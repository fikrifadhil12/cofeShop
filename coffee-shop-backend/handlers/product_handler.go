package handlers

import (
	"encoding/json"
	"net/http"

	"coffee-shop-backend/db"
	"coffee-shop-backend/models"
)

func GetProducts(w http.ResponseWriter, r *http.Request) {
	rows, err := db.DB.Query("SELECT id, name, price, stock FROM products")
	if err != nil {
		http.Error(w, "Gagal ambil data produk", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var products []models.Product
	for rows.Next() {
		var p models.Product
		if err := rows.Scan(&p.ID, &p.Name, &p.Price, &p.Stock); err != nil {
			http.Error(w, "Error scan data", http.StatusInternalServerError)
			return
		}
		products = append(products, p)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
}
