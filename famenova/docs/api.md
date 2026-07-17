# REX Agency API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Response Format

All endpoints return consistent JSON:

```json
{
  "success": true,
  "data": {},
  "message": "Optional message",
  "errors": {},
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## Public Endpoints

### POST /submit

Submit an inquiry form.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "phone": "+1234567890",
  "location": "New York",
  "businessName": "Acme Corp",
  "niche": "ecommerce"
}
```

**Valid niches:** ecommerce, saas, health, fitness, realestate, finance, education, food, beauty, local, agency, other

**Response:**
```json
{
  "success": true,
  "message": "Your application has been received!"
}
```

### GET /leads/count

Get total number of leads.

**Response:**
```json
{
  "count": 42
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-15T10:30:00.000Z"
}
```

## Auth Endpoints

### POST /auth/login

Login and receive a JWT token.

**Request Body:**
```json
{
  "email": "admin@rexagency.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "...",
      "name": "Admin",
      "email": "admin@rexagency.com",
      "role": "admin"
    }
  }
}
```

### POST /auth/register

Create a new admin user.

**Request Body:**
```json
{
  "name": "Admin",
  "email": "admin@rexagency.com",
  "password": "admin123",
  "role": "admin"
}
```

### GET /auth/profile

Get current user profile. **Requires auth.**

### PUT /auth/password

Update password. **Requires auth.**

**Request Body:**
```json
{
  "currentPassword": "admin123",
  "newPassword": "newpassword123"
}
```

## Leads Endpoints (Protected)

### GET /leads

Get all leads with pagination, search, and filtering.

**Query Parameters:**
| Parameter | Type   | Default | Description                    |
| --------- | ------ | ------- | ------------------------------ |
| page      | number | 1       | Page number                    |
| limit     | number | 10      | Results per page               |
| search    | string | —       | Search by name, business, etc. |
| status    | string | —       | Filter by status               |
| niche     | string | —       | Filter by niche                |
| sort      | string | -createdAt | Sort field                  |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "fullName": "John Doe",
      "phone": "+1234567890",
      "location": "New York",
      "businessName": "Acme Corp",
      "niche": "E-Commerce",
      "status": "new",
      "notes": "",
      "submittedAt": "2026-01-15T10:30:00.000Z",
      "createdAt": "2026-01-15T10:30:00.000Z",
      "updatedAt": "2026-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "pages": 5
  }
}
```

### GET /leads/:id

Get a single lead by ID.

### PUT /leads/:id

Update a lead (status, notes).

**Request Body:**
```json
{
  "status": "contacted",
  "notes": "Called back, interested in paid ads package"
}
```

### DELETE /leads/:id

Delete a lead. **Admin role only.**

### GET /leads/stats

Get lead statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 42,
    "byStatus": {
      "new": 20,
      "contacted": 15,
      "closed": 7
    },
    "byNiche": {
      "E-Commerce": 12,
      "SaaS / Tech": 8
    },
    "recent": [...]
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "errors": {
    "fullName": "Full name is required",
    "phone": "Valid phone number is required"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```
