package main

import (
	"waysbeanapi/database"
	"waysbeanapi/pkg/mysql"
	"waysbeanapi/routes"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()
	mysql.DatabaseInit()
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{echo.GET, echo.POST, echo.PATCH, echo.DELETE},
		AllowHeaders: []string{"X-Requested-With", "Content-Type", "Authorization"},
	}))
	errEnv := godotenv.Load()
	if errEnv != nil {
		panic("Failed to load env file")
	}
	e.Static("/uploads", "./uploads")
	database.RunMigration()
	routes.RouteInit(e.Group("/api/v1"))

	e.Logger.Fatal(e.Start("localhost:5000"))
}
