# Zorvyn Finance Dashboard Backend

A comprehensive backend API for a finance dashboard system with role-based access control, financial record management, and analytics aggregation.

## Features

✅ **User & Role Management**

- Support for multiple roles: Admin, Analyst, Viewer
- User status management (active/inactive)
- JWT-based authentication
- **Admin Setup**: Pre-configured admin credentials (no registration needed)
- **Analyst & Viewer Self-Registration**: Users can register and login immediately

✅ **Financial Records Management**

- Create, read, update, delete financial records
- Support for income and expense tracking
- **Advanced Filtering**: Search by category, type, date range, and keywords
- **Pagination**: Control record count with page and limit parameters
- **Sorting**: Sort by any field (amount, date, category) in ascending/descending order
- **Soft Delete**: Preserve data while marking records as deleted
- **Input Validation**: Comprehensive validation for all fields

✅ **Dashboard Analytics**

- Total income and expenses summary
- Net balance calculation
- Category-wise spending totals
- Monthly trend analysis
- Recent activity tracking

✅ **Access Control**

- Role-based middleware for endpoint protection
- User activity tracking via createdBy field
- Granular permission control

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Email Service**: Resend
- **Dev Tools**: Nodemon

## Project Structure

```
src/
├── app.js                 # Express app setup
├── server.js             # Server entry point
├── config/
│   ├── db.js             # MongoDB connection
│   └── email.js          # SMTP configuration
├── controllers/
│   ├── authController.js       # Auth logic
│   ├── recordController.js     # Record CRUD
│   ├── dashboardController.js  # Analytics
│   └── userController.js       # User management
├── middleware/
│   ├── authMiddleware.js       # JWT verification
│   └── roleMIddleware.js       # Role checking
├── models/
│   ├── user.js           # User schema
│   └── record.js         # Financial record schema
├── routes/
│   ├── authRoute.js      # Auth endpoints
│   ├── recordRoute.js    # Record endpoints
│   ├── dashboardRoute.js # Dashboard endpoints
│   ├── userRoute.js      # User management endpoints
│   └── testRoute.js      # Test endpoints
└── services/
    └── emailService.js   # Email sending utilities
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd zorvyn
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   Create a `.env` file in the root directory with the following variables:

   ```
   # Database
   Mongo_URI=mongodb+srv://username:password@cluster.mongodb.net/

   # Authentication
   JWT_SECRET=your_secret_key_here

   # Server
   PORT=3000

   # Resend Email Configuration
   RESEND_API_KEY=your_resend_api_key
   FROM_EMAIL=ProManager <noreply@yourdomain.com>

   # Application URL
   APP_URL=http://localhost:3000
   ```

   **Note**:
   - Get your Resend API key from [Resend Dashboard](https://resend.com)
   - Update `FROM_EMAIL` with your verified domain in Resend

4. **Setup Admin User**

   Run the admin setup script to create the initial admin user:

   ```bash
   npm run setup-admin
   ```

   This will create an admin user with the following credentials:
   - **Email**: `admin@promanager.com`
   - **Password**: `ProManager@123`

   **⚠️ Important**: Keep these credentials safe. Change the admin password after the first login.

5. **Start the development server**

   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3000`

## Authentication Flow

### System Overview

```
┌─────────────────────────────────────────────────────┐
│           ProManager Authentication System          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ADMIN ACCESS                                       │
│  ├─ Pre-configured credentials                     │
│  ├─ Set up using: npm run setup-admin              │
│  ├─ Email: admin@promanager.com                    │
│  ├─ Password: ProManager@123                       │
│  ├─ Role: admin                                    │
│  └─ Full system access (create/manage records)     │
│                                                     │
│  ANALYST ACCESS (Self-Register)                    │
│  ├─ Users can register themselves                  │
│  ├─ Endpoint: POST /api/auth/register              │
│  ├─ Body: {"name", "email", "password", role: "analyst"}   │
│  ├─ Role: analyst                                  │
│  ├─ Email verification required (24-hour link)     ││
│  ├─ Role: analyst                                  │
│  ├─ Can login immediately after registration       │
│  ├─ Can create, view, and manage records           │
│  └─ Access full analytics dashboard                │
│                                                     │
│  VIEWER ACCESS (Self-Register)                     │
│  ├─ Users can register themselves                  │
│  ├─ Endpoint: POST /api/auth/register              │
│  ├─ Body: {"name", "email", "password"} OR         │
│  │        {"name", "email", "password", role: "viewer"}  │
│  ├─ Role: viewer (default if not specified)        │
│  ├─ Can login immediately after registration       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Step-by-Step

1. **Admin Setup** (First time only)

   ```bash
   npm run setup-admin
   ```

   Creates an admin user with pre-set credentials.

2. **Admin Login**
   - Use credentials: `admin@promanager.com` / `ProManager@123`
   - Receives JWT token with 24-hour expiration
   - Can manage users and create records

3. **Analyst Registration**
   - Register via POST `/api/auth/register`
   - Choose role: `"analyst"` in request body
   - Email verification link sent automatically
   - Must click link or verify manually
   - Can login immediately after registration
   - Can create records

4. **Viewer Registration**
   - Register via POST `/api/auth/register`
   - Choose role: `"viewer"` (or omit for default viewer role)
   - Can login immediately after registration
   - Can view dashboard analytics

5. **Login**
   - Submitsed on assigned role

## API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication

Include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Admin Login (Pre-configured)

Admin users receive credentials directly via the setup script. No registration required.

- **Email**: `admin@promanager.com`
- **Password**: `ProManager@123` (change after first login)
- **How to login**: Use the Login endpoint below with these credentials

### Register User

- **POST** `/auth/register`
- **Auth**: Not required
- **Body**:
  ```json
  {
    "name": "John User",
    "email": "john@example.com",
    "password": "securePassword123",
    "role": "analyst"
  }
  ```
- **Role** (Optional):
  - `"analyst"` - Can create, view, and manage records
  - `"viewer"` - Can only view dashboard analytics (read-only)
  - If omitted, defaults to `"viewer"`
- **Valid Roles for Self-Registration**: `"analyst"`, `"viewer"`
  - Admin role is NOT available for self-registration (setup-admin only)

- **Response** (201):

  ```json
  {
    "success": true,
    "message": "user created successfully. Check your email to verify your account.",
    "data": {
      "id": "user_id",",
    "data": {
      "id": "user_id",
      "name": "John User",
      "email": "john@example.com",
      "role": "analyst"
    }
  }
  ```

- **Notes**:
  - User can login immediately after registration
  - No email verification required

- **POST** `/auth/login`
- **Auth**: Not required
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "securePassword123"
  }
  ```
- **Response** (200):

  ```json
  {
    "success": true,
    "message": "login successful",
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "viewer"
    }
  }
  ```

- **Error Responses**:
  - Email not verified: `403 Forbidden - "please verify your email before logging in"`
  - Invalid credentials: `401 Unauthorized`
  - Inactive account: `403 Forbidden`

- **Notes**:
  - Email verification is required before login
  - JWT token expires in 24 hours
  - Include token in Authorization header for authenticated requests

---

## Records Endpoints

⚠️ **ALL record operations require Authentication Token in header**:

```
Authorization: Bearer <YOUR_JWT_TOKEN>
```

### Create Record

- **POST** `/records`
- **Auth**: Required - Token + Admin role
- **Body**:
  ```json
  {
    "amount": 500,
    "type": "income",
    "category": "Salary",
    "date": "2024-01-15",
    "notes": "Monthly salary"
  }
  ```
- **Required fields**: amount, type, category
- **Valid types**: "income", "expenses"
- **Response** (201):
  ```json
  {
    "success": true,
    "message": "record created successfully",
    "data": { ...record details }
  }
  ```

### Get Records

- **GET** `/records`
- **Auth**: Required (All authenticated users)
- **Query Parameters** (Optional):
  | Parameter | Type | Default | Description |
  |-----------|------|---------|-------------|
  | `page` | number | 1 | Page number for pagination |
  | `limit` | number | 10 | Records per page (max: 100) |
  | `sort` | string | date | Sort field (prefix with `-` for descending: `-date`, `-amount`) |
  | `type` | string | - | Filter by type: "income" or "expenses" |
  | `category` | string | - | Filter by category (case-insensitive) |
  | `search` | string | - | Search in category and notes |
  | `startDate` | date | - | Filter from date (YYYY-MM-DD) |
  | `endDate` | date | - | Filter to date (YYYY-MM-DD) |

- **Examples**:

  ```
  GET /records?page=1&limit=10                        # Get first 10 records
  GET /records?sort=-date&limit=5                     # Get latest 5 records
  GET /records?type=income&sort=-amount               # Get income sorted by amount (desc)
  GET /records?category=salary&page=2&limit=20        # Search by category with pagination
  GET /records?search=bonus&sort=date                 # Search records with keyword
  GET /records?startDate=2024-01-01&endDate=2024-12-31  # Date range filter
  ```

- **Response** (200):
  ```json
  {
    "success": true,
    "count": 10,
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "data": [ ...records ]
  }
  ```

### Update Record

- **PUT** `/records/:id`
- **Auth**: Required (Admin only, must be creator)
- **Body**: Any fields to update
  ```json
  {
    "amount": 600,
    "notes": "Updated salary"
  }
  ```
- **Response** (200):
  ```json
  {
    "success": true,
    "message": "record updated successfully",
    "data": { ...updated record }
  }
  ```

### Delete Record

- **DELETE** `/records/:id`
- **Auth**: Required (Admin only, must be creator)
- **Note**: Uses soft delete (marks as deleted, preserves data)
- **Response** (200):
  ```json
  {
    "success": true,
    "message": "record deleted successfully"
  }
  ```

---

## Dashboard Endpoints

### Get Summary

- **GET** `/dashboard/summary`
- **Auth**: Required (Admin, Analyst)
- **Response** (200):
  ```json
  {
    "success": true,
    "data": {
      "totalIncome": 5000,
      "totalExpense": 2000,
      "netBalance": 3000
    }
  }
  ```

### Get Category Summary

- **GET** `/dashboard/category`
- **Auth**: Required (Admin, Analyst)
- **Response** (200):
  ```json
  {
    "success": true,
    "count": 3,
    "data": [
      {
        "_id": "Salary",
        "total": 5000,
        "count": 1
      },
      {
        "_id": "Food",
        "total": 800,
        "count": 4
      }
    ]
  }
  ```

### Get Recent Activity

- **GET** `/dashboard/recent`
- **Auth**: Required (Admin, Analyst)
- **Query Parameters**:
  - `limit`: Number of records (default: 5, max: 100)
- **Response** (200):
  ```json
  {
    "success": true,
    "count": 5,
    "data": [ ...5 most recent records ]
  }
  ```

### Get Monthly Summary

- **GET** `/dashboard/montly`
- **Auth**: Required (Admin, Analyst)
- **Response** (200):
  ```json
  {
    "success": true,
    "count": 2,
    "data": [
      {
        "_id": {
          "month": 1,
          "year": 2024
        },
        "income": 5000,
        "expenses": 2000,
        "total": 3000
      }
    ]
  }
  ```

---

## User Management Endpoints

### Get All Users

- **GET** `/users`
- **Auth**: Required (Admin only)
- **Response** (200):
  ```json
  {
    "success": true,
    "count": 3,
    "data": [ ...users without passwords ]
  }
  ```

### Get User by ID

- **GET** `/users/:id`
- **Auth**: Required (Admin only)
- **Response** (200):
  ```json
  {
    "success": true,
    "data": { ...user details }
  }
  ```

### Update User Role

- **PUT** `/users/:id/role`
- **Auth**: Required (Admin only)
- **Body**:
  ```json
  {
    "role": "analyst"
  }
  ```
- **Valid roles**: "admin", "analyst"
- **Response** (200):
  ```json
  {
    "success": true,
    "message": "user role updated successfully",
    "data": { ...updated user }
  }
  ```

### Update User Status

- **PUT** `/users/:id/status`
- **Auth**: Required (Admin only)
- **Body**:
  ```json
  {
    "isActive": false
  }
  ```
- **Response** (200):
  ```json
  {
    "success": true,
    "message": "user deactivated successfully",
    "data": { ...updated user }
  }
  ```

### Delete User

- **DELETE** `/users/:id`
- **Auth**: Required (Admin only)
- **Response** (200):
  ```json
  {
    "success": true,
    "message": "user deleted successfully"
  }
  ```

---

## Role-Based Access Control

| Role        | Access Level | Capabilities                                                                | Registration                |
| ----------- | ------------ | --------------------------------------------------------------------------- | --------------------------- |
| **Admin**   | Full         | Create/Update/Delete records, Manage users, View analytics, User management | Pre-configured (Setup only) |
| **Analyst** | Standard     | Create/View/Update/Delete records, View analytics                           | Self-register               |
| **Viewer**  | Read-Only    | View dashboard analytics, View reports (no data modification)               | Self-register (default)     |

---

## Data Models

### User Model

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ["admin", "analyst", "viewer"], default: "viewer"),
  isActive: Boolean (default: true),
  isVerified: Boolean (default: false),
  verificationToken: String (null after verification),
  verificationTokenExpiry: Date (24 hours from creation),
  timestamps: true
}
```

### Record Model

```javascript
{
  amount: Number (required, min: 0),
  type: String (enum: ["income", "expenses"]),
  category: String (required),
  date: Date (required),
  notes: String,
  createdBy: ObjectId (ref: User),
  timestamps: true
}
```

---

## Assumptions & Design Decisions

1. **Amount Field**: Stored as Number to support precise calculations and aggregations
2. **Date Handling**: Dates are stored as ISO format; filtering uses date range queries
3. **Authorization**:
   - Analysts can modify records they created
   - Viewers have read-only access to dashboards
   - Enforced in middleware layer
4. **Role-Based Access**: Implemented via middleware for clean separation of concerns
5. **Error Responses**: Consistent JSON format with `success` flag, `message`, and optional `error` details
6. **Password Storage**: All passwords are hashed using bcryptjs before storage; never returned in responses
7. **JWT Expiration**: Tokens expire in 24 hours
8. **User Status**: Inactive users cannot login but their records remain in the system
9. **Admin Users**: Pre-configured via setup script; not available for self-registration
10. **Self-Registration**: Analysts and Viewers can self-register; email verification required before login
11. **Default Role**: If role not specified during registration, defaults to "viewer" (read-only access)
12. **Email Verification**: Tokens expire in 24 hours; automatic verification link sent on registration
13. **Dashboard Analytics**: Accessible to Analysts and Viewers (different write permissions)
14. **Soft Delete**: Not implemented; hard deletion is used for simplicity

---

## Error Handling

Standard HTTP status codes are used:

| Code | Meaning                                     |
| ---- | ------------------------------------------- |
| 200  | Success                                     |
| 201  | Created                                     |
| 400  | Bad Request (validation error)              |
| 401  | Unauthorized (invalid credentials or token) |
| 403  | Forbidden (insufficient permissions)        |
| 404  | Not Found                                   |
| 409  | Conflict (resource already exists)          |
| 500  | Server Error                                |

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "error.message"
}
```

---

## Testing the API

### Quick Start Flow

1. **Setup Admin** (one-time):

   ```bash
   npm run setup-admin
   ```

   This creates admin credentials:
   - Email: `admin@promanager.com`
   - Password: `ProManager@123`

2. **Admin Login** → Get JWT token (required for all CRUD operations)
3. **Use Token** → Include in Authorization header for all API requests
4. **Analyst/Viewer Registration** → By other users
5. **Email Verification** → From email link
6. **Login** → Get token, use for API requests

## Token-Based Authentication Guide

### Overview

```
┌──────────────────────────────────────────────────────┐
│           Token-Required Authentication             │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Step 1: LOGIN                                       │
│  POST /api/auth/login                               │
│  Body: {email, password}                            │
│  Response: {token, user}  ← Save this token!        │
│                                                      │
│  Step 2: USE TOKEN IN REQUESTS                       │
│  ALL CRUD operations require Authorization header    │
│  Header: Authorization: Bearer <TOKEN>              │
│                                                      │
│  Step 3: PERFORM CRUD                                │
│  POST /api/records (create)                         │
│  GET /api/records (read)                            │
│  PUT /api/records/:id (update)                      │
│  DELETE /api/records/:id (delete)                   │
│                                                      │
├──────────────────────────────────────────────────────┤
│  TOKEN DETAILS:                                      │
│  • Issued after login                               │
│  • Valid for 24 hours                               │
│  • Must be included in every CRUD request            │
│  • Admin & Analysts can modify records              │
│  • Viewers are read-only                            │
└──────────────────────────────────────────────────────┘
```

### Using cURL

**1. Admin Login** (get token):

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@promanager.com",
    "password": "ProManager@123"
  }'

# Response includes token - save it for API requests
```

**2. Register as Analyst** (can create and manage records):

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Analyst",
    "email": "john@example.com",
    "password": "securePassword123",
    "role": "analyst"
  }'

# Check email for verification link
```

**2b. Register as Viewer** (read-only access to analytics):

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Viewer",
    "email": "jane@example.com",
    "password": "securePassword123",
    "role": "viewer"
  }'

# OR omit role for default viewer access:
# "role": "viewer" is automatically set if not provided

# Check email for verification link
```

**3. Verify Email** (click link or manual):

```bash
curl -X GET "http://localhost:3000/api/auth/verify-email?token=VERIFICATION_TOKEN&email=john@example.com"
```

**4. Login (Analyst or Viewer)**:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

**5. Create Record** (Analyst only - use token from login):

```bash
curl -X POST http://localhost:3000/api/records \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "amount": 5000,
    "type": "income",
    "category": "Salary",
    "date": "2024-01-15",
    "notes": "Monthly salary"
  }'
```

### How to Use Token in API Requests

Every CRUD request **REQUIRES** the authorization token in the header.

**Format:**

```
Authorization: Bearer <YOUR_TOKEN_HERE>
```

**Step 1: Get Token from Login Response**

When you login, the response includes:

```json
{
  "success": true,
  "message": "login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

**Copy the `token` value** (without "Bearer" prefix)

**Step 2: Use Token in Your Requests**

```bash
# Example: Get all records
curl -X GET http://localhost:3000/api/records \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Example: Create a record
curl -X POST http://localhost:3000/api/records \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "amount": 1000,
    "type": "income",
    "category": "Bonus",
    "date": "2024-01-20"
  }'

# Example: Update a record
curl -X PUT http://localhost:3000/api/records/USER_RECORD_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "amount": 1200
  }'

# Example: Delete a record
curl -X DELETE http://localhost:3000/api/records/USER_RECORD_ID \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Important Notes:**

- ⚠️ Token expires in **24 hours** - you'll need to login again
- 🔒 Always include the `Authorization` header
- ❌ Without token: `401 Unauthorized` error
- ❌ With invalid token: `401 Invalid token` error

### Using Postman

1. Create a new collection
2. Import the API endpoints
3. **First**: POST to `/api/auth/login` with admin credentials:
   ```json
   {
     "email": "admin@promanager.com",
     "password": "ProManager@123"
   }
   ```
4. **Copy** the `token` from response
5. For **every other endpoint**:
   - Go to **Authorization** tab
   - Select type: **Bearer Token**
   - Paste token in the **Token** field
   - Send request
6. Test each endpoint

**Token expires after 24 hours** - login again to get a new token

---

## Validation Rules

### User Registration (Analyst or Viewer)

- Name: Required, trimmed
- Email: Required, valid email format, unique
- Password: Required, minimum 6 characters
- Role: Optional
  - Valid values: `"analyst"` or `"viewer"`
  - Defaults to `"viewer"` if not specified
  - `"admin"` role cannot be used in registration (setup-admin only)

### Financial Record

- Amount: Required, must be a number >= 0
- Type: Required, must be "income" or "expenses"
- Category: Required, any string
- Date: Required for filtering, defaults to current date if not provided
- Notes: Optional, defaults to empty string

---

## Future Enhancements

- [ ] Rate limiting
- [ ] Unit and integration tests
- [ ] API documentation with OpenAPI/Swagger
- [ ] Two-factor authentication
- [ ] Document export (CSV, PDF)
- [ ] Advanced analytics (trends, forecasting)
- [ ] Forgot password functionality
- [ ] Password change/reset endpoints

---

## Database Setup

### Local MongoDB

```bash
# Start MongoDB
mongod

# Create database
mongo
> use zorvyn
```

### MongoDB Atlas

1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user
3. Get connection string
4. Update `.env` file with connection string

---

## Troubleshooting

### Connection Refused

- Ensure MongoDB is running
- Check `Mongo_URI` in `.env`

### JWT Errors

- Verify `JWT_SECRET` is set in `.env`
- Check token format: `Bearer <token>`
- Token expires in 24 hours

### Validation Errors

- Check required fields are provided
- Verify data types (amount should be number, not string)
- Validate email format and date format

---

### Deployment

The backend is deployed using Render and connected to MongoDB Atlas for cloud-based data persistence.

## Deployment Guide

### Prerequisites for Production

- MongoDB Atlas account (cloud database)
- Render account (or Heroku/Railway/Vercel)
- Gmail account with App Password
- Node.js environment ready

### Deployment Steps

#### 1. **Prepare Code for Deployment**

```bash
# Build your app (no build step needed for Node.js)
# Just make sure all dependencies are in package.json
npm install

# Test locally
npm run dev
```

#### 2. **Set Up MongoDB Atlas** (if not already done)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Create a database user with strong password
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/database`
5. Save this for later

#### 3. **Prepare Environment Variables**

Create a document with all your `.env` variables:

```
Mongo_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/YOUR_DB_NAME
JWT_SECRET=YOUR_SECRET_KEY_HERE
PORT=3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
FROM_EMAIL=ProManager your_email@gmail.com
APP_URL=https://your-deployed-app.onrender.com
```

**Important:** Use the deployed URL for `APP_URL`, not localhost!

#### 4. **Deploy to Render** (Recommended)

**Step 1: Push code to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/zorvyn.git
git push -u origin main
```

**Step 2: Create Render Service**

1. Go to [Render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Fill in details:
   - **Name**: zorvyn-api
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click "Create Web Service"

**Step 3: Add Environment Variables**

1. In Render dashboard, go to your service
2. Click "Environment" tab
3. Add all variables from your `.env` file:
   - `Mongo_URI`
   - `JWT_SECRET`
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_SECURE`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `FROM_EMAIL`
   - `APP_URL` (your Render URL)
4. Click "Save"

**Step 4: Deploy**

- Render automatically deploys after you save
- Check "Logs" tab to verify deployment

#### 5. **Deploy to Heroku** (Alternative)

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create your-app-name

# Add environment variables
heroku config:set Mongo_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your_secret
heroku config:set SMTP_USER=your_email@gmail.com
heroku config:set SMTP_PASS=your_app_password
heroku config:set FROM_EMAIL="ProManager your_email@gmail.com"
heroku config:set APP_URL=https://your-app-name.herokuapp.com

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Nodemailer Configuration for Production

#### Gmail Setup (Recommended)

**⚠️ Important:** Google doesn't allow regular passwords for third-party apps.

**Step 1: Enable 2-Factor Authentication**

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable "2-Step Verification"

**Step 2: Create App Password**

1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and "Windows Computer"
3. Google generates a 16-character password
4. Copy this password and use as `SMTP_PASS`

**Environment Variables for Gmail:**

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx  (16-char app password)
FROM_EMAIL=ProManager your_email@gmail.com
```

#### Alternative Email Providers

**SendGrid:**

```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=SG.your_sendgrid_api_key_here
FROM_EMAIL=noreply@yourdomain.com
```

**AWS SES (Simple Email Service):**

```
SMTP_HOST=email-smtp.region.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_aws_smtp_username
SMTP_PASS=your_aws_smtp_password
FROM_EMAIL=verified@yourdomain.com
```

### Test Deployment

**1. Test Admin Setup on Deployed App**

```bash
# SSH into Render instance (if needed)
# Or trigger setup via API endpoint

# Call your deployed API
curl -X POST https://your-app.onrender.com/api/health
```

**2. Test Email Sending**

```bash
# Register a new user
curl -X POST https://your-app.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "testPassword123",
    "role": "analyst"
  }'

# Check email for verification link
```

**3. Check Logs**

- Render: Dashboard → Logs tab
- Heroku: `heroku logs --tail`
- Look for "SMTP Server is ready to send emails" message

### Troubleshooting Deployment

**Issue: "SMTP Error" or emails not sending**

```
Solution:
1. Verify SMTP credentials are correct
2. Ensure app password (not regular password) for Gmail
3. Check firewall doesn't block port 587
4. Verify FROM_EMAIL is correct
5. Check logs for detailed error messages
```

**Issue: "MongoDB connection refused"**

```
Solution:
1. Verify Mongo_URI is correct
2. Check MongoDB Atlas cluster is running
3. Whitelist Render/Heroku IPs in MongoDB Atlas:
   - Network Access → IP Whitelist
   - Add: 0.0.0.0/0 (allows all IPs)
4. Ensure database user credentials are correct
```

**Issue: Admin user not created in production**

```
Solution:
1. Run setup script after deployment:
   - Render: Go to "Shell" tab and run: node setup-admin.js
   - Or create HTTP endpoint for setup
2. Manually create admin user via MongoDB Atlas UI
```

### Production Checklist

- [ ] MongoDB Atlas cluster running
- [ ] Gmail app password created
- [ ] Environment variables set on hosting platform
- [ ] Render/Heroku deployment successful
- [ ] Logs show "MongoDB connected!"
- [ ] Logs show "SMTP Server is ready to send emails"
- [ ] Test user registration (verify email sent)
- [ ] Test user login (verify token works)
- [ ] Test CRUD operations (verify authentication works)
- [ ] Test admin login with deployed URL
- [ ] Verify email verification links work (check APP_URL)

### Production URLs

After deployment, your API will be available at:

```
https://your-app-name.onrender.com/api
```

Update `APP_URL` in environment variables to use this URL for email verification links!

## License

ISC License

---

## Support

For issues or questions, please create an issue in the repository or contact me.
