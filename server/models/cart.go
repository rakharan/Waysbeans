package models

import "time"

type Cart struct {
	ID            int         `json:"id" gorm:"primary_key: auto_increment"`
	UserID        int         `json:"user_id"`
	ProductID     int         `json:"product_id"`
	Product       Product     `json:"product" gorm:"constraint:OnDelete:SET NULL;"`
	OrderQty      int         `json:"orderQuantity"`
	Subtotal      int         `json:"subtotal"`
	TransactionID int         `json:"-"`
	Transaction   Transaction `json:"-" gorm:"foreignKey:TransactionID;references:ID"`
	CreateAt      time.Time   `json:"-"`
}
