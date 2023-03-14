package routes

import (
	"waysbeanapi/handlers"
	"waysbeanapi/pkg/middleware"
	"waysbeanapi/pkg/mysql"
	"waysbeanapi/repositories"

	"github.com/labstack/echo/v4"
)

func AuthRoutes(e *echo.Group) {
	authRepository := repositories.RepositoryAuth(mysql.DB)
	h := handlers.HandlerAuth(authRepository)

	e.POST("/register", middleware.UploadFile(h.Register))
	e.POST("/login", h.Login)
	e.GET("/auth", middleware.Auth(h.CheckAuth))
}
