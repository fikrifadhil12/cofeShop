package routes

import (
	"net/http"

	"coffee-shop-backend/handlers"
)

func RegisterRoutes() {
	http.HandleFunc("/products", handlers.GetProducts)
}
