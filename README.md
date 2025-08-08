# 🛍️ E-Commerce Web Application

A modern e-commerce platform built with Next.js, Prisma, PostgreSQL, and NextAuth.js.

## 🚀 Features

- **User Authentication** - Secure login/signup with NextAuth.js
- **Product Catalog** - Browse products with filtering and search
- **Shopping Cart** - Add/remove items with size selection
- **Order Management** - Track order status and history
- **Admin Panel** - Manage products, orders, and users
- **Responsive Design** - Works on desktop and mobile

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Forms**: React Hook Form + Zod validation

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL database** (or Neon account)

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd selling_web/frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the `frontend` directory:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 4. Database Setup

#### Option A: Using Neon (Recommended)

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string to your `.env` file

#### Option B: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database
3. Update the `DATABASE_URL` in your `.env`

### 5. Run Database Migrations

```bash
# Apply schema changes
npm run db:migrate

# Or reset database (⚠️ Deletes all data)
npm run db:reset
```

### 6. Seed the Database

```bash
npx prisma db seed
```

This will create:

- Admin user: `admin@example.com` / `admin123`
- Regular user: `user@example.com` / `user123`
- Sample brands and products

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## 📊 Database Management

### View Database (Prisma Studio)

```bash
npm run db:studio
```

### Database Commands

```bash
# Apply migrations
npm run db:migrate

# Reset database
npm run db:reset

# Generate Prisma client
npx prisma generate

# Push schema changes
npx prisma db push
```

## 👤 Default Users

After seeding the database, you can login with:

| Email               | Password   | Role  |
| ------------------- | ---------- | ----- |
| `admin@example.com` | `admin123` | Admin |
| `user@example.com`  | `user123`  | User  |

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js app router
│   ├── components/          # React components
│   ├── lib/                 # Utilities and configurations
│   ├── prisma/             # Database schema and migrations
│   ├── types/              # TypeScript type definitions
│   └── data/               # Data fetching functions
├── public/                 # Static assets
├── prisma/                 # Prisma configuration
└── package.json
```

## 🔐 Authentication

The app uses NextAuth.js with multiple providers:

- **Credentials** (email/password)
- **Google OAuth** (optional)
- **WebAuthn** (optional)

## 🛒 Features Overview

### For Users

- Browse products with filters (brand, size, price)
- Add items to cart with size selection
- Complete checkout process
- View order history
- Manage profile and addresses

### For Admins

- Manage products (CRUD operations)
- View and update orders
- Manage users
- View analytics

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Error

```bash
# Check your DATABASE_URL in .env
# Ensure database is running
npm run db:studio
```

#### 2. Prisma Client Not Generated

```bash
npx prisma generate
```

#### 3. Migration Issues

```bash
# Reset database
npm run db:reset

# Or push schema directly
npx prisma db push
```

#### 4. Permission Errors (Windows)

- Run PowerShell as Administrator
- Close any running Node.js processes
- Try: `taskkill /f /im node.exe`

### Environment Variables

Make sure all required environment variables are set:

```env
# Required
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Optional
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## 📝 API Routes

The application includes the following API routes:

- `POST /api/auth/*` - Authentication endpoints
- `GET /api/products` - Product listing
- `POST /api/cart/*` - Cart operations
- `POST /api/orders/*` - Order management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the troubleshooting section
2. Review the console logs
3. Open an issue on GitHub

---

**Happy coding! 🎉**
