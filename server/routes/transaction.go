package routes

import (
	"waysbeanapi/handlers"
	"waysbeanapi/pkg/middleware"
	"waysbeanapi/pkg/mysql"
	"waysbeanapi/repositories"

	"github.com/labstack/echo/v4"
)

func TransactionRoutes(e *echo.Group) {
	transactionRepository := repositories.RepositoryTransaction(mysql.DB)
	productRepository := repositories.RepositoryProduct(mysql.DB)
	h := handlers.HandlerTransaction(transactionRepository, productRepository)

	e.GET("/transactions", middleware.Auth(h.FindTransaction))
	e.PATCH("/transaction", middleware.Auth(h.UpdateTransaction))
	e.GET("/user/transaction", middleware.Auth(h.GetUserTransactionByUserID))
	e.POST("/notification", h.Notification)
	e.GET("/test/:id", h.GetTxById)
}
