package models

type Profile struct {
	ID      int                  `json:"id" gorm:"primary_key:auto_increment"`
	Phone   string               `json:"phone" gorm:"type: varchar(255)"`
	Gender  string               `json:"gender" gorm:"type: varchar(255)"`
	Address string               `json:"address" gorm:"type: text"`
	UserID  int                  `json:"user_id"`
	User    UsersProfileResponse `json:"user"`
}

type ProfileResponse struct {
	Phone   string `json:"phone"`
	Gender  string `json:"gender"`
	Address string `json:"address"`
	UserID  int    `json:"user_id"`
}

func (ProfileResponse) TableName() string {
	return "profiles"
}
