# WaysBeans

Fullstack online coffee shop web application with shopping cart, Midtrans payment gateway, order tracking, and admin dashboard.

Live demo: [https://waysbeans-teal.vercel.app](https://waysbeans-teal.vercel.app)

## Architecture

Monorepo separating React client and Go Echo backend:

```
Waysbeans/
├── client/          # Frontend application (React 18 + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/  # Reusable UI elements
│   │   ├── context/     # Auth state context
│   │   ├── pages/       # Catalog, Cart, Profile, Transaction, Admin
│   │   └── config/      # API client and endpoints
└── server/          # REST API (Go + Echo + GORM + PostgreSQL)
    ├── handlers/    # HTTP controllers (auth, product, cart, transaction)
    ├── repositories/# Database persistence layer
    ├── models/      # GORM database schemas
    ├── dto/         # Request / response payload contracts
    └── pkg/         # JWT, bcrypt, Midtrans Snap client
```

## Features

- **Product Catalog**: Browsable coffee bean products with detailed descriptions, stock status, and pricing.
- **Cart & Checkout**: Interactive shopping cart with local state, quantity controls, and total calculations.
- **Midtrans Payment Gateway**: Snap popup integration for credit card, bank transfer, and e-wallet checkout.
- **Order Tracking**: Real-time order status tracking (Waiting Payment, Success, Cancel).
- **Admin Dashboard**: Manage product listings, update prices, and review incoming transactions.
- **Authentication**: JWT token-based auth with bcrypt password hashing and route guards.

## Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **State & Routing**: React Router DOM, Context API
- **Deployment**: Vercel

### Backend
- **Language**: Go 1.20+
- **Framework**: Echo v4
- **ORM**: GORM
- **Database**: PostgreSQL
- **Payments**: Midtrans Snap API

## Quick Start

### 1. Prerequisites
- Node.js 18+ & Yarn/npm
- Go 1.20+
- PostgreSQL instance running

### 2. Clone Repository

```bash
git clone https://github.com/rakharan/Waysbeans.git
cd Waysbeans
```

### 3. Backend Setup

```bash
cd server
go mod download
# Configure .env with DB credentials and Midtrans Server Key
go run main.go
```

Backend boots on `http://localhost:5000`.

### 4. Frontend Setup

```bash
cd ../client
npm install
npm run dev
```

Frontend boots on `http://localhost:5173`.

## License

MIT
