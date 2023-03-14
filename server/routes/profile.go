package routes

import (
	"waysbeanapi/handlers"
	"waysbeanapi/pkg/middleware"
	"waysbeanapi/pkg/mysql"
	"waysbeanapi/repositories"

	"github.com/labstack/echo/v4"
)

func ProfileRoutes(e *echo.Group) {
	profileRepository := repositories.RepositoryProfile(mysql.DB)
	h := handlers.HandlerProfile(profileRepository)

	e.GET("/profile/:id", middleware.Auth(h.GetProfile))
	e.GET("/profile", middleware.Auth(h.FindProfile))
	e.POST("/profile", middleware.Auth(h.CreateProfil))
	e.PATCH("/profile/:id", middleware.Auth(h.UpdateProfile))

}
