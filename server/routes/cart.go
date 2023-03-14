package routes

import (
	"waysbeanapi/handlers"
	"waysbeanapi/pkg/middleware"
	"waysbeanapi/pkg/mysql"
	"waysbeanapi/repositories"

	"github.com/labstack/echo/v4"
)

func CartRoutes(e *echo.Group) {
	// GET CART REPOSITORY HANDLER
	CartRepository := repositories.RepositoryCart(mysql.DB)
	h := handlers.HandlerCart(CartRepository)

	// DEFINE ROUTES
	e.POST("/cart", middleware.Auth(h.CreateCart))
	e.DELETE("/cart/:id", middleware.Auth(h.DeleteCart))
	e.GET("/user/cart/", middleware.Auth(h.FindCartByTransactionID))
}
