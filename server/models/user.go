package models

import "time"

// User model struct
type User struct {
	ID        int                   `json:"id"`
	Name      string                `json:"name" gorm:"type: varchar(255)"`
	Email     string                `json:"email" gorm:"type: varchar(255)"`
	Password  string                `json:"-" gorm:"type: varchar(255)"`
	Role      string                `json:"role" form:"role" gorm:"default:user; type:varchar(6)"`
	Image     string                `json:"image" form:"image" gorm:"type: varchar(255)"`
	Profile   ProfileResponse       `json:"profile"`
	Products  []ProductUserResponse `json:"products"`
	CreatedAt time.Time             `json:"created_at"`
	UpdatedAt time.Time             `json:"updated_at"`
}

type UsersProfileResponse struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

func (UsersProfileResponse) TableName() string {
	return "users"
}
