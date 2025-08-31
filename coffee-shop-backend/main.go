package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
)

var db *sql.DB
var upgrader = websocket.Upgrader{
    CheckOrigin: func(r *http.Request) bool {
        return true // sementara izinkan semua origin
    },
}


// --------------------- Struct Models ---------------------

type Product struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	Price       float64 `json:"price"`
	Stock       int     `json:"stock"`
	IsAvailable bool    `json:"is_available"`
	CategoryID  int     `json:"category_id"`
	ImageURL    string  `json:"image_url"`
}

type Order struct {
	ID        int       `json:"id"`
	TableNo   string    `json:"table_no"`
	Total     float64   `json:"total"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"created_at"`
}

type OrderItem struct {
	ProductID int     `json:"product_id"`
	Quantity  int     `json:"quantity"`
	Price     float64 `json:"price"`
}

// --------------------- MAIN ---------------------

func main() {
	// Database connection
	connStr := "user=postgres password=admin123 dbname=coffee_shop sslmode=disable"
	var err error
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("✅ Connected to PostgreSQL")

	// Router setup
	r := mux.NewRouter()

	// Product routes
	r.HandleFunc("/products", getProducts).Methods("GET")
	r.HandleFunc("/products/{id}", getProduct).Methods("GET")
	r.HandleFunc("/products", createProduct).Methods("POST")
	r.HandleFunc("/products/{id}", updateProduct).Methods("PUT")
	r.HandleFunc("/products/{id}", deleteProduct).Methods("DELETE")
	// WebSocket route
	r.HandleFunc("/orders/updates", handleOrderUpdates)


	// Order routes
	r.HandleFunc("/orders", createOrder).Methods("POST")
	r.HandleFunc("/orders/{tableNo}", getOrdersByTable).Methods("GET")

	// Root endpoint
	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("☕ Welcome to Coffee Shop API"))
	}).Methods("GET")

	// CORS setup
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	// Start server
	handler := c.Handler(r)
	fmt.Println("🚀 Server running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}

// --------------------- Product Handlers ---------------------

func getProducts(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query(`SELECT id, name, price, stock, is_available, category_id, image_url FROM products`)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	var products []Product
	for rows.Next() {
		var p Product
		err := rows.Scan(&p.ID, &p.Name, &p.Price, &p.Stock, &p.IsAvailable, &p.CategoryID, &p.ImageURL)
		if err != nil {
			respondWithError(w, http.StatusInternalServerError, err.Error())
			return
		}
		products = append(products, p)
	}

	respondWithJSON(w, http.StatusOK, products)
}

func getProduct(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid product ID")
		return
	}

	var p Product
	err = db.QueryRow(`SELECT id, name, price, stock, is_available, category_id, image_url FROM products WHERE id=$1`, id).
		Scan(&p.ID, &p.Name, &p.Price, &p.Stock, &p.IsAvailable, &p.CategoryID, &p.ImageURL)

	if err != nil {
		respondWithError(w, http.StatusNotFound, "Product not found")
		return
	}

	respondWithJSON(w, http.StatusOK, p)
}

func createProduct(w http.ResponseWriter, r *http.Request) {
	var p Product
	err := json.NewDecoder(r.Body).Decode(&p)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	err = db.QueryRow(
		`INSERT INTO products (name, price, stock, is_available, category_id, image_url) 
		 VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
		p.Name, p.Price, p.Stock, p.IsAvailable, p.CategoryID, p.ImageURL,
	).Scan(&p.ID)

	if err != nil {
		respondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondWithJSON(w, http.StatusCreated, p)
}

func updateProduct(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid product ID")
		return
	}

	var p Product
	err = json.NewDecoder(r.Body).Decode(&p)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	_, err = db.Exec(
		`UPDATE products 
		 SET name=$1, price=$2, stock=$3, is_available=$4, category_id=$5, image_url=$6
		 WHERE id=$7`,
		p.Name, p.Price, p.Stock, p.IsAvailable, p.CategoryID, p.ImageURL, id,
	)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	p.ID = id
	respondWithJSON(w, http.StatusOK, p)
}

func deleteProduct(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid product ID")
		return
	}

	_, err = db.Exec("DELETE FROM products WHERE id=$1", id)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondWithJSON(w, http.StatusOK, map[string]string{"message": "Product deleted successfully"})
}

// --------------------- Order Handlers ---------------------

func createOrder(w http.ResponseWriter, r *http.Request) {
	var order struct {
		TableNo string      `json:"table_no"`
		Items   []OrderItem `json:"items"`
	}

	err := json.NewDecoder(r.Body).Decode(&order)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	// Calculate total
	var total float64
	for _, item := range order.Items {
		total += item.Price * float64(item.Quantity)
	}

	tx, err := db.Begin()
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	var orderID int
	err = tx.QueryRow(
		"INSERT INTO orders (table_no, total, status) VALUES ($1, $2, 'pending') RETURNING id",
		order.TableNo, total,
	).Scan(&orderID)
	if err != nil {
		tx.Rollback()
		respondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	for _, item := range order.Items {
		_, err = tx.Exec(
			"INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
			orderID, item.ProductID, item.Quantity, item.Price,
		)
		if err != nil {
			tx.Rollback()
			respondWithError(w, http.StatusInternalServerError, err.Error())
			return
		}
	}

	err = tx.Commit()
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondWithJSON(w, http.StatusCreated, map[string]interface{}{
		"order_id": orderID,
		"message":  "Order created successfully",
	})
}

func getOrdersByTable(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	tableNo := vars["tableNo"]

	rows, err := db.Query(`
		SELECT o.id, o.table_no, o.total, o.status, o.created_at
		FROM orders o
		WHERE o.table_no = $1
		ORDER BY o.created_at DESC
	`, tableNo)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	var orders []Order
	for rows.Next() {
		var o Order
		err := rows.Scan(&o.ID, &o.TableNo, &o.Total, &o.Status, &o.CreatedAt)
		if err != nil {
			respondWithError(w, http.StatusInternalServerError, err.Error())
			return
		}
		orders = append(orders, o)
	}

	respondWithJSON(w, http.StatusOK, orders)
}

func handleOrderUpdates(w http.ResponseWriter, r *http.Request) {
    conn, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Println("❌ WebSocket upgrade error:", err)
        return
    }
    defer conn.Close()

    log.Println("✅ WebSocket client connected")

    // contoh: broadcast dummy update tiap 5 detik
    for {
        update := map[string]interface{}{
            "status": "pending",
            "message": "Order update from server",
            "time": time.Now().Format(time.RFC3339),
        }

        if err := conn.WriteJSON(update); err != nil {
            log.Println("❌ Write error:", err)
            break
        }

        time.Sleep(5 * time.Second)
    }
}


// --------------------- Helper Functions ---------------------

func respondWithError(w http.ResponseWriter, code int, message string) {
	respondWithJSON(w, code, map[string]string{"error": message})
}

func respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(payload)
}
