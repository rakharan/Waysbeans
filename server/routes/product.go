package routes

import (
	"waysbeanapi/handlers"
	"waysbeanapi/pkg/middleware"
	"waysbeanapi/pkg/mysql"
	"waysbeanapi/repositories"

	"github.com/labstack/echo/v4"
)

func ProductRoutes(e *echo.Group) {
	ProductRepository := repositories.RepositoryProduct(mysql.DB)
	h := handlers.HandlerProduct(ProductRepository)

	e.GET("/products", h.FindProducts)
	e.GET("/product/:id", h.GetProduct)
	e.POST("/product", middleware.Auth(middleware.UploadFile(h.CreateProduct)))
	e.DELETE("/product/:id", middleware.Auth(h.DeleteProduct))
	e.PATCH("/product/:id", middleware.UploadFile(h.UpdateProduct))
}
