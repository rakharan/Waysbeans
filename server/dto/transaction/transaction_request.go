package transactiondto

type TransactionRequest struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Phone   string `json:"phone"`
	Address string `json:"address"`
	Total   int    `json:"total"`
}
type CreateTransactionRequest struct {
	ProductID int    `json:"product_id" validate:"required"`
	BuyerID   int    `json:"buyer_id" validate:"required"`
	SellerID  int    `json:"seller_id" validate:"required"`
	Price     int    `json:"price" validate:"required"`
	Status    string `json:"status" validate:"required"`
}
