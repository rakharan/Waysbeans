package handlers

import (
	profiledto "waysbeanapi/dto/profile"
	dto "waysbeanapi/dto/result"

	// usersdto "backEnd/dto/users"
	"waysbeanapi/models"
	"waysbeanapi/repositories"

	"net/http"
	"strconv"

	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
)

type handlerProfile struct {
	ProfileRepository repositories.ProfileRepository
}

func HandlerProfile(ProfileRepository repositories.ProfileRepository) *handlerProfile {
	return &handlerProfile{ProfileRepository}
}

func (h *handlerProfile) CreateProfil(c echo.Context) error {
	request := new(profiledto.CreateProfileRequest)
	if err := c.Bind(request); err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	validation := validator.New()
	err := validation.Struct(request)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	userLogin := c.Get("userLogin")
	userId := userLogin.(jwt.MapClaims)["id"].(float64)
	// data form pattern submit to pattern entity db user
	profil := models.Profile{
		Gender:  request.Gender,
		Phone:   request.Phone,
		Address: request.Address,
		UserID:  int(userId),
	}

	data, err := h.ProfileRepository.CreateProfil(profil)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: "Success", Data: convertResponseProfile(data)})
}

func (h *handlerProfile) FindProfile(c echo.Context) error {
	profil, err := h.ProfileRepository.FindProfile()
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: "Success", Data: profil})
}

func (h *handlerProfile) GetProfile(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	var profile models.Profile
	profile, err := h.ProfileRepository.GetProfile(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: "Success", Data: convertResponseProfile(profile)})
}

func (h *handlerProfile) UpdateProfile(c echo.Context) error {
	request := new(profiledto.CreateProfileRequest)
	if err := c.Bind(&request); err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	id, _ := strconv.Atoi(c.Param("id"))
	user, err := h.ProfileRepository.GetProfile(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}
	if request.Phone != "" {
		user.Phone = request.Phone
	}

	if request.Gender != "" {
		user.Gender = request.Gender
	}

	if request.Address != "" {
		user.Address = request.Address
	}

	data, err := h.ProfileRepository.UpdateProfile(user)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: "Success", Data: data})
}
func convertResponseProfile(u models.Profile) profiledto.ProfileResponse {
	return profiledto.ProfileResponse{
		ID:      u.ID,
		Phone:   u.Phone,
		Gender:  u.Gender,
		Address: u.Address,
		User:    u.User,
	}
}
