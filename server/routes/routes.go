package routes

import "github.com/labstack/echo/v4"

func RouteInit(e *echo.Group) {
	UserRoutes(e)
	ProductRoutes(e)
	ProfileRoutes(e)
	AuthRoutes(e)
	CartRoutes(e)
	TransactionRoutes(e)
}
