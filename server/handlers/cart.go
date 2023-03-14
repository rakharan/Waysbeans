package handlers

import (
	"net/http"
	"strconv"
	"time"
	cartdto "waysbeanapi/dto/cart"
	dto "waysbeanapi/dto/result"
	"waysbeanapi/models"
	"waysbeanapi/repositories"

	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
)

type handlerCart struct {
	CartRepository repositories.CartRepository
}

func HandlerCart(CartRepository repositories.CartRepository) *handlerCart {
	return &handlerCart{CartRepository}
}

func (h *handlerCart) CreateCart(c echo.Context) error {
	// GET USER ID FROM JWT TOKEN
	userLogin := c.Get("userLogin")
	userId := userLogin.(jwt.MapClaims)["id"].(float64)
	// GET REQUEST AND DECODING JSON
	cartRequest := new(cartdto.CartRequest)
	if err := c.Bind(cartRequest); err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	// RUN REPOSITORY GET PRODUCT BY PRODUCT ID
	product, err := h.CartRepository.GetProductCartByID(int(cartRequest.ProductID))
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	// FIND TOTAL PRICE PRODUCT FROM QUANTITY REQUEST
	total := product.Price * cartRequest.Quantity

	// RUN REPOSITORY GET TRANSACTION BY USER ID
	userTransaction, err := h.CartRepository.GetCartTransactionByUserID(int(userId))
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	// CHECK IF EXIST
	if userTransaction.ID == 0 {

		// SETUP FOR QUERY TRANSACTION
		transaction := models.Transaction{
			ID:       int(time.Now().Unix()),
			UserID:   int(userId),
			Status:   "waiting",
			Total:    0,
			CreateAt: time.Now(),
			UpdateAt: time.Now(),
		}

		// RUN REPOSITORY CREATE TRANSACTION
		transactionData, err := h.CartRepository.CreateTransaction(transaction)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
		}

		// SETUP FOR QUERY CART
		cart := models.Cart{
			UserID:        int(userId),
			ProductID:     cartRequest.ProductID,
			Product:       models.Product{},
			OrderQty:      cartRequest.Quantity,
			Subtotal:      total,
			TransactionID: transactionData.ID,
			CreateAt:      time.Now(),
		}

		// RUN REPOSITORY CREATE CART
		data, err := h.CartRepository.CreateCart(cart)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
		}

		dataResponse, _ := h.CartRepository.GetCart(int(data.ID))

		// WRITE RESPONSE
		return c.JSON(http.StatusOK, dto.SuccessResult{Status: "Success", Data: dataResponse})
	} else {

		// SETUP FOR QUERY CART
		cart := models.Cart{
			UserID:        int(userId),
			ProductID:     cartRequest.ProductID,
			Product:       models.Product{},
			OrderQty:      cartRequest.Quantity,
			Subtotal:      total,
			TransactionID: userTransaction.ID,
			CreateAt:      time.Now(),
		}

		// RUN REPOSITORY CREATE CART
		data, err := h.CartRepository.CreateCart(cart)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
		}

		dataResponse, _ := h.CartRepository.GetCart(int(data.ID))

		// WRITE RESPONSE
		return c.JSON(http.StatusOK, dto.SuccessResult{Status: "Success", Data: dataResponse})
	}
}

func (h *handlerCart) FindCartByTransactionID(c echo.Context) error {

	// GET USER ID FROM JWT
	userLogin := c.Get("userLogin")
	userId := userLogin.(jwt.MapClaims)["id"].(float64)
	// Get transaction by id
	transaction, err := h.CartRepository.GetCartTransactionByUserID(int(userId))
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	// run repo find cart by transaction id
	carts, err := h.CartRepository.FindCartByTransactionID(int(transaction.ID))
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: "Success", Data: carts})
}

func (h *handlerCart) DeleteCart(c echo.Context) error {
	CartID, _ := strconv.Atoi(c.Param("id"))
	userLogin := c.Get("userLogin")
	userID := int(userLogin.(jwt.MapClaims)["id"].(float64))

	cart, err := h.CartRepository.GetCart(CartID)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	if userID != int(cart.UserID) {
		return c.JSON(http.StatusUnauthorized, dto.ErrorResult{Code: http.StatusUnauthorized, Message: err.Error()})
	}

	data, err := h.CartRepository.DeleteCart(cart)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: "Success", Data: data})
}
