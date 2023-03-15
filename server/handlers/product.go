package handlers

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"strconv"
	productdto "waysbeanapi/dto/product"
	dto "waysbeanapi/dto/result"
	"waysbeanapi/models"
	"waysbeanapi/repositories"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
)

var ctx = context.Background()
var CLOUD_NAME = os.Getenv("CLOUD_NAME")
var API_KEY = os.Getenv("API_KEY")
var API_SECRET = os.Getenv("API_SECRET")

type handlerProduct struct {
	ProductRepository repositories.ProductRepository
}

func HandlerProduct(ProductRepository repositories.ProductRepository) *handlerProduct {
	return &handlerProduct{ProductRepository}
}

func (h *handlerProduct) FindProducts(c echo.Context) error {
	products, err := h.ProductRepository.FindProducts()

	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: "Success", Data: products})
}

func (h *handlerProduct) CreateProduct(c echo.Context) error {

	fmt.Println(CLOUD_NAME)
	fmt.Println(API_KEY)
	fmt.Println(CLOUD_NAME)
	filepath := c.Get("dataFile").(string)

	userLogin := c.Get("userLogin")
	userId := userLogin.(jwt.MapClaims)["id"].(float64)
	price, _ := strconv.Atoi(c.FormValue("price"))
	qty, _ := strconv.Atoi(c.FormValue("stock"))
	request := productdto.ProductRequest{
		Name:   c.FormValue("name"),
		Desc:   c.FormValue("desc"),
		Price:  price,
		Stock:  qty,
		Image:  filepath,
		UserID: int(userId),
	}

	validation := validator.New()
	err := validation.Struct(request)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	cld, _ := cloudinary.NewFromParams(CLOUD_NAME, API_KEY, API_SECRET)

	resp, err := cld.Upload.Upload(ctx, filepath, uploader.UploadParams{Folder: "waysbeans"})
	if err != nil {
		fmt.Println(err.Error())
	}
	fmt.Println("image" + resp.SecureURL)
	// Query setup
	product := models.Product{
		Name:   request.Name,
		Desc:   request.Desc,
		Price:  request.Price,
		Stock:  request.Stock,
		Image:  resp.SecureURL,
		UserID: request.UserID,
	}
	product, err = h.ProductRepository.CreateProduct(product)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	product, _ = h.ProductRepository.GetProduct(product.ID)

	productResponse := productdto.ProductResponse{
		ID:          product.ID,
		Name:        product.Name,
		Price:       product.Price,
		Description: product.Desc,
		Image:       product.Image,
		Stock:       product.Stock,
	}
	return c.JSON(http.StatusOK, dto.SuccessResult{Status: "Success", Data: productResponse})
}

func (h *handlerProduct) GetProduct(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	var product models.Product
	product, err := h.ProductRepository.GetProduct(id)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: "Success", Data: convertResponseProduct(product)})
}

func (h *handlerProduct) UpdateProduct(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	product, err := h.ProductRepository.GetProduct(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}
	// geting id from params
	price, _ := strconv.Atoi(c.FormValue("price"))
	qty, _ := strconv.Atoi(c.FormValue("stock"))
	filepath := c.Get("dataFile").(string)
	request := productdto.UpdateProductRequest{
		Name:  c.FormValue("name"),
		Desc:  c.FormValue("desc"),
		Price: price,
		Stock: qty,
		Image: filepath,
	}

	cld, _ := cloudinary.NewFromParams(CLOUD_NAME, API_KEY, API_SECRET)

	resp, err := cld.Upload.Upload(ctx, filepath, uploader.UploadParams{Folder: "Waysbeans"})
	if err != nil {
		fmt.Println(err.Error())
	}

	if request.Name != "" {
		product.Name = request.Name
	}

	if request.Desc != "" {
		product.Desc = request.Desc
	}

	if request.Price != 0 {
		product.Price = request.Price
	}
	if request.Stock != 0 {
		product.Stock = request.Stock
	}

	if request.Image != "" {
		product.Image = resp.SecureURL
	}

	data, err := h.ProductRepository.UpdateProduct(product)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}
	return c.JSON(http.StatusOK, dto.SuccessResult{Status: "Success", Data: data})

}

func (h *handlerProduct) DeleteProduct(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	product, err := h.ProductRepository.GetProduct(id)

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}
	var path_file = "uploads/"
	// Delete image file
	err = os.Remove(path_file + product.Image)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}
	data, err := h.ProductRepository.DeleteProduct(product)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}
	return c.JSON(http.StatusOK, dto.SuccessResult{Status: "Success", Data: convertResponseProduct(data)})
}

func convertResponseProduct(u models.Product) models.ProductResponse {
	return models.ProductResponse{
		Name:  u.Name,
		Desc:  u.Desc,
		Price: u.Price,
		Image: u.Image,
		Stock: u.Stock,
	}
}
