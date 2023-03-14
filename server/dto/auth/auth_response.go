package authdto

type LoginResponse struct {
	Email string `gorm:"type: varchar(255)" json:"email"`
	Token string `gorm:"type: varchar(255)" json:"token"`
	ID    int    `gorm:"type:int" json:"id"`
	Role  string `json:"role" gorm:"default:user; type:varchar(6)"`
	Image string `json:"image"`
}

type RegisterResponse struct {
	Email    string `gorm:"type: varchar(255)" json:"email"`
	Name     string `gorm:"type: varchar(255)" json:"name"`
	Password string `gorm:"type: varchar(255)" json:"password"`
	Image    string `json:"image"`
}

type CheckAuthResponse struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
	Role  string `json:"role"`
}
