# Structura API Documentation

## Base URL
```
http://localhost:4000/api
```

---

## Authentication Endpoints

### 1. Sign Up
**Endpoint:** `POST /auth/signup`

**Description:** Create a new user account

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201 Created):**
```json
{
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400 Bad Request` - Missing required fields
- `409 Conflict` - Email already in use
- `500 Internal Server Error` - Server error

---

### 2. Sign In
**Endpoint:** `POST /auth/signin`

**Description:** Authenticate user and receive JWT token

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400 Bad Request` - Missing email or password
- `401 Unauthorized` - Invalid credentials
- `500 Internal Server Error` - Server error

---

### 3. Get Current User
**Endpoint:** `GET /auth/me`

**Description:** Retrieve current user profile

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Error Responses:**
- `401 Unauthorized` - No token or invalid token
- `500 Internal Server Error` - Server error

---

## Form Management Endpoints

### 1. Get All Forms
**Endpoint:** `GET /forms`

**Description:** Retrieve all forms created by the authenticated user

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Query Parameters:** None

**Response (200 OK):**
```json
{
  "forms": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Customer Feedback Form",
      "description": "Collect customer feedback and suggestions",
      "fields": [
        {
          "id": "field_1",
          "type": "text",
          "label": "Full Name",
          "required": true
        },
        {
          "id": "field_2",
          "type": "email",
          "label": "Email",
          "required": true
        }
      ],
      "settings": {},
      "createdAt": "2026-02-03T10:30:00Z",
      "updatedAt": "2026-02-03T11:45:00Z"
    }
  ]
}
```

**Error Responses:**
- `401 Unauthorized` - No token or invalid token
- `500 Internal Server Error` - Server error

---

### 2. Get Specific Form
**Endpoint:** `GET /forms/:id`

**Description:** Retrieve a specific form by ID

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**URL Parameters:**
- `id` (required) - Form ID (MongoDB ObjectId)

**Response (200 OK):**
```json
{
  "form": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Customer Feedback Form",
    "description": "Collect customer feedback and suggestions",
    "fields": [
      {
        "id": "field_1",
        "type": "text",
        "label": "Full Name",
        "required": true
      }
    ],
    "settings": {},
    "createdAt": "2026-02-03T10:30:00Z",
    "updatedAt": "2026-02-03T11:45:00Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - No token or invalid token
- `404 Not Found` - Form not found
- `500 Internal Server Error` - Server error

---

### 3. Create Form
**Endpoint:** `POST /forms`

**Description:** Create a new form

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "New Form",
  "description": "Form description (optional)",
  "fields": []
}
```

**Response (201 Created):**
```json
{
  "form": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "New Form",
    "description": "Form description (optional)",
    "fields": [],
    "settings": {},
    "userId": "507f1f77bcf86cd799439012",
    "createdAt": "2026-02-03T10:30:00Z",
    "updatedAt": "2026-02-03T10:30:00Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Title is required
- `401 Unauthorized` - No token or invalid token
- `500 Internal Server Error` - Server error

---

### 4. Update Form
**Endpoint:** `PUT /forms/:id`

**Description:** Update an existing form

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**URL Parameters:**
- `id` (required) - Form ID (MongoDB ObjectId)

**Request Body:**
```json
{
  "title": "Updated Form Title",
  "description": "Updated description",
  "fields": [
    {
      "id": "field_1",
      "type": "text",
      "label": "Full Name",
      "required": true
    }
  ],
  "settings": {
    "theme": "dark",
    "submitButtonText": "Submit"
  }
}
```

**Response (200 OK):**
```json
{
  "form": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Updated Form Title",
    "description": "Updated description",
    "fields": [...],
    "settings": {...},
    "createdAt": "2026-02-03T10:30:00Z",
    "updatedAt": "2026-02-03T12:00:00Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - No token or invalid token
- `404 Not Found` - Form not found
- `500 Internal Server Error` - Server error

---

### 5. Delete Form
**Endpoint:** `DELETE /forms/:id`

**Description:** Delete a form permanently

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**URL Parameters:**
- `id` (required) - Form ID (MongoDB ObjectId)

**Response (200 OK):**
```json
{
  "message": "Form deleted successfully"
}
```

**Error Responses:**
- `401 Unauthorized` - No token or invalid token
- `404 Not Found` - Form not found
- `500 Internal Server Error` - Server error

---

## Authentication

All protected endpoints require JWT token in the `Authorization` header:
```
Authorization: Bearer {token}
```

**Token Details:**
- **Type:** JWT (JSON Web Token)
- **Expiry:** 7 days
- **Secret:** Defined in `.env` as `JWT_SECRET`

**Token Verification:**
The token is verified on each protected request. If token is invalid or expired, a `401 Unauthorized` response is returned.

---

## Error Handling

All error responses follow this format:
```json
{
  "message": "Error description"
}
```

**Common Status Codes:**
- `200 OK` - Request successful
- `201 Created` - Resource successfully created
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Missing or invalid authentication token
- `404 Not Found` - Requested resource not found
- `409 Conflict` - Resource already exists (e.g., duplicate email)
- `500 Internal Server Error` - Server error

---

## Usage Examples

### Example 1: Complete Sign Up and Create Form Flow

```bash
# 1. Sign up
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "pass123"
  }'

# Response:
# {
#   "email": "john@example.com",
#   "token": "eyJhbGc..."
# }

# 2. Create a form using the token
curl -X POST http://localhost:4000/api/forms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "title": "Feedback Form",
    "description": "Collect feedback from users"
  }'

# Response:
# {
#   "form": {
#     "_id": "507f1f77...",
#     "title": "Feedback Form",
#     ...
#   }
# }
```

### Example 2: Fetch and Update Form

```bash
# 1. Get all forms
curl -X GET http://localhost:4000/api/forms \
  -H "Authorization: Bearer eyJhbGc..."

# 2. Update a specific form
curl -X PUT http://localhost:4000/api/forms/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "title": "Updated Feedback Form",
    "fields": [
      {
        "id": "field_1",
        "type": "textarea",
        "label": "Your Feedback"
      }
    ]
  }'
```

---

## Environment Variables

Required `.env` configuration:

```env
PORT=4000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5173
```

---

## Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  username: String,
  email: String (unique),
  passwordHash: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Form Model
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  userId: ObjectId (reference to User),
  fields: Array,
  settings: Object,
  createdAt: Date,
  updatedAt: Date
}
```

---

## CORS Configuration

CORS is enabled for the frontend application. Configure in `.env`:

```env
CORS_ORIGIN=http://localhost:5173
```

For production, set this to your actual domain:
```env
CORS_ORIGIN=https://yourdomain.com
```

---

## Security Notes

1. **JWT Secret:** Change the default JWT secret in `.env` for production
2. **Password Hashing:** Passwords are hashed using bcrypt with salt rounds of 10
3. **Token Expiry:** Tokens expire after 7 days
4. **HTTPS:** Use HTTPS in production environments
5. **CORS:** Restrict CORS origin to trusted domains only

---

## Rate Limiting

Currently not implemented. Consider adding rate limiting middleware for production:
- Limit login attempts: 5 per 15 minutes per IP
- Limit API requests: 100 per minute per user

---

## Future Enhancements

- [ ] Email verification on signup
- [ ] Password reset functionality
- [ ] Refresh token mechanism
- [ ] Rate limiting
- [ ] Form submission storage
- [ ] Form analytics
- [ ] Collaborative editing
- [ ] Form versioning

---

**Last Updated:** February 3, 2026
**API Version:** 1.0
