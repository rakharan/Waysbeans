package productdto

type ProductRequest struct {
	Name   string `json:"name" form:"name" validate:"required"`
	Desc   string `json:"desc" form:"desc" validate:"required"`
	Price  int    `json:"price" form:"price" validate:"required"`
	Image  string `json:"image" form:"image" validate:"required"`
	Stock  int    `json:"stock" form:"stock" validate:"required"`
	UserID int    `json:"user_id"`
}

type UpdateProductRequest struct {
	Name  string `json:"name" form:"name"`
	Desc  string `json:"desc" form:"desc"`
	Price int    `json:"price" form:"price"`
	Image string `json:"image" form:"image"`
	Stock int    `json:"stock" form:"stock"`
}
