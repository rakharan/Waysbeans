package profiledto

type CreateProfileRequest struct {
	ID      int    `json:"id" gorm:"primary_key:auto_increment"`
	Phone   string `json:"phone" gorm:"type: varchar(255)" validate:"required"`
	Gender  string `json:"gender" gorm:"type: varchar(255)" validate:"required"`
	Address string `json:"address" gorm:"type: text" validate:"required"`
}
