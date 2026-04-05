# Zorvyn Finance Dashboard Backend

A comprehensive backend API for a finance dashboard system with role-based access control, financial record management, and analytics aggregation.

## Features

✅ **User & Role Management**

- Support for multiple roles: Admin, Analyst, Viewer
- User status management (active/inactive)
- JWT-based authentication

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
- **Dev Tools**: Nodemon

## Project Structure

```
src/
├── app.js                 # Express app setup
├── server.js             # Server entry point
├── config/
│   └── db.js             # MongoDB connection
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
└── routes/
    ├── authRoute.js      # Auth endpoints
    ├── recordRoute.js    # Record endpoints
    ├── dashboardRoute.js # Dashboard endpoints
    ├── userRoute.js      # User management endpoints
    └── testRoute.js      # Test endpoints
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

3. **Start the development server**

   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3000`

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

### Register User

- **POST** `/auth/register`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "role": "viewer"
  }
  ```
- **Roles**: Optional, defaults to "viewer"
- **Valid roles**: "admin", "analyst", "viewer"
- **Response** (201):
  ```json
  {
    "success": true,
    "message": "user created successfully",
    "data": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "viewer"
    }
  }
  ```

### Login

- **POST** `/auth/login`
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

---

## Records Endpoints

### Create Record

- **POST** `/records`
- **Auth**: Required (Admin only)
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
- **Valid roles**: "admin", "analyst", "viewer"
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

| Role        | Capabilities                                               |
| ----------- | ---------------------------------------------------------- |
| **Admin**   | Create/Update/Delete records, Manage users, View analytics |
| **Analyst** | View records, Access analytics, Cannot modify data         |
| **Viewer**  | View own dashboard summary only (future: own records only) |

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
3. **Authorization**: Users can only modify records they created (enforced in controller)
4. **Role-Based Access**: Implemented via middleware for clean separation of concerns
5. **Error Responses**: Consistent JSON format with `success` flag, `message`, and optional `error` details
6. **Password Storage**: All passwords are hashed using bcryptjs before storage; never returned in responses
7. **JWT Expiration**: Tokens expire in 24 hours
8. **User Status**: Inactive users cannot login but their records remain in the system
9. **Dashboard Analytics**: Calculated from all records (not filtered by user)
10. **Soft Delete**: Not implemented; hard deletion is used for simplicity

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

### Using cURL

1. **Register**:

   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Admin User",
       "email": "admin@example.com",
       "password": "admin123",
       "role": "admin"
     }'
   ```

2. **Login**:

   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@example.com",
       "password": "admin123"
     }'
   ```

3. **Create Record** (use token from login):
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

### Using Postman

1. Create a new collection
2. Import the API endpoints
3. Set the `Bearer <TOKEN>` in the Authorization tab
4. Test each endpoint

---

## Validation Rules

### User Registration

- Name: Required, trimmed
- Email: Required, valid email format, unique
- Password: Required, minimum 6 characters
- Role: Optional, must be "admin", "analyst", or "viewer"

### Financial Record

- Amount: Required, must be a number >= 0
- Type: Required, must be "income" or "expenses"
- Category: Required, any string
- Date: Required for filtering, defaults to current date if not provided
- Notes: Optional, defaults to empty string

---

## Future Enhancements

- [ ] Pagination for record listing
- [ ] Search functionality by category or notes
- [ ] Soft delete functionality for records
- [ ] Rate limiting
- [ ] Unit and integration tests
- [ ] API documentation with OpenAPI/Swagger
- [ ] Email verification for registration
- [ ] Two-factor authentication
- [ ] Document export (CSV, PDF)
- [ ] Advanced analytics (trends, forecasting)

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

## License

ISC License

---

## Support

For issues or questions, please create an issue in the repository or contact the development team.
