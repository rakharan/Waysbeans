package models

import "time"

type Transaction struct {
	ID       int                  `json:"id" gorm:"primary_key: auto_increment"`
	UserID   int                  `json:"user_id"`
	User     UsersProfileResponse `json:"user"`
	Name     string               `json:"name" form:"name" gorm:"type: varchar(50)"`
	Email    string               `json:"email" gorm:"type: varchar(50)"`
	Phone    string               `json:"phone" form:"phone" gorm:"type: varchar(50)"`
	Address  string               `json:"address" form:"address" gorm:"type : text"`
	Cart     []Cart               `json:"cart" gorm:"constraint:OnDelete:SET NULL;"`
	Status   string               `json:"status" gorm:"type: varchar(50)"`
	Total    int                  `json:"total" gorm:"type: int"`
	CreateAt time.Time            `json:"-"`
	UpdateAt time.Time            `json:"update_at"`
}
