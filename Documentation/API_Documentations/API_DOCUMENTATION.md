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

## Form Publishing & Sharing Endpoints

### 1. Publish Form
**Endpoint:** `POST /forms/:formId/publish`

**Description:** Publish a form and generate a unique public sharing link

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**URL Parameters:**
- `formId` (required) - Form ID (MongoDB ObjectId)

**Request Body:** (None required)

**Response (200 OK):**
```json
{
  "message": "Form published successfully",
  "form": {
    "_id": "507f1f77bcf86cd799439011",
    "status": "published",
    "publicToken": "a1b2c3d4e5f6",
    "publicUrl": "http://localhost:3000/form/a1b2c3d4e5f6",
    "publishedAt": "2026-02-05T10:30:00Z",
    "responseCount": 0
  }
}
```

**Error Responses:**
- `404 Not Found` - Form not found or user doesn't own it
- `500 Internal Server Error` - Failed to generate token

---

### 2. Unpublish Form
**Endpoint:** `POST /forms/:formId/unpublish`

**Description:** Unpublish a form and revoke the public sharing link

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**URL Parameters:**
- `formId` (required) - Form ID (MongoDB ObjectId)

**Request Body:** (None required)

**Response (200 OK):**
```json
{
  "message": "Form unpublished successfully",
  "form": {
    "_id": "507f1f77bcf86cd799439011",
    "status": "draft",
    "title": "Customer Feedback"
  }
}
```

**Error Responses:**
- `404 Not Found` - Form not found or user doesn't own it
- `500 Internal Server Error` - Failed to unpublish form

---

### 3. Get Published Form (Public)
**Endpoint:** `GET /forms/public/:publicToken`

**Description:** Retrieve a published form by public token (NO AUTHENTICATION REQUIRED)

**Headers:**
```
Content-Type: application/json
```

**URL Parameters:**
- `publicToken` (required) - Public sharing token (12-character hex string)

**Response (200 OK):**
```json
{
  "form": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Customer Feedback Form",
    "description": "Please share your feedback",
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
    "template": "default"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid token format
- `404 Not Found` - Form not found or no longer published
- `500 Internal Server Error` - Server error

---

### 4. Submit Form Response (Public)
**Endpoint:** `POST /forms/public/:publicToken/submit`

**Description:** Submit responses to a published form (NO AUTHENTICATION REQUIRED)

**Headers:**
```
Content-Type: application/json
```

**URL Parameters:**
- `publicToken` (required) - Public sharing token

**Request Body:**
```json
{
  "responses": [
    {
      "fieldId": "field_1",
      "fieldLabel": "Full Name",
      "fieldType": "text",
      "value": "John Doe"
    },
    {
      "fieldId": "field_2",
      "fieldLabel": "Email",
      "fieldType": "email",
      "value": "john@example.com"
    },
    {
      "fieldId": "field_3",
      "fieldLabel": "Feedback",
      "fieldType": "textarea",
      "value": "Great experience!"
    }
  ],
  "submittedBy": "john@example.com"
}
```

**Response (201 Created):**
```json
{
  "message": "Response submitted successfully",
  "response": {
    "_id": "507f1f77bcf86cd799439012",
    "submittedAt": "2026-02-05T10:35:00Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid token format or invalid responses
- `404 Not Found` - Form not found or no longer published
- `500 Internal Server Error` - Server error

---

### 5. Get Form Responses (Admin)
**Endpoint:** `GET /forms/:formId/responses`

**Description:** Retrieve all responses for a specific form (admin only)

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**URL Parameters:**
- `formId` (required) - Form ID (MongoDB ObjectId)

**Query Parameters:**
- `limit` (optional, default: 50) - Maximum responses to return
- `skip` (optional, default: 0) - Number of responses to skip (for pagination)

**Response (200 OK):**
```json
{
  "form": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Customer Feedback Form",
    "responseCount": 2
  },
  "responses": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "formId": "507f1f77bcf86cd799439011",
      "responses": [
        {
          "fieldId": "field_1",
          "fieldLabel": "Full Name",
          "fieldType": "text",
          "value": "John Doe"
        }
      ],
      "submittedBy": "john@example.com",
      "submittedAt": "2026-02-05T10:35:00Z"
    }
  ],
  "pagination": {
    "total": 2,
    "limit": 50,
    "skip": 0,
    "hasMore": false
  }
}
```

**Error Responses:**
- `401 Unauthorized` - No token or invalid token
- `404 Not Found` - Form not found or user doesn't own it
- `500 Internal Server Error` - Server error

---

### 6. Get Specific Response (Admin)
**Endpoint:** `GET /forms/:formId/responses/:responseId`

**Description:** Retrieve a specific form response by ID (admin only)

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**URL Parameters:**
- `formId` (required) - Form ID
- `responseId` (required) - Response ID

**Response (200 OK):**
```json
{
  "response": {
    "_id": "507f1f77bcf86cd799439012",
    "formId": "507f1f77bcf86cd799439011",
    "responses": [
      {
        "fieldId": "field_1",
        "fieldLabel": "Full Name",
        "fieldType": "text",
        "value": "John Doe"
      },
      {
        "fieldId": "field_2",
        "fieldLabel": "Email",
        "fieldType": "email",
        "value": "john@example.com"
      }
    ],
    "submittedBy": "john@example.com",
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
    "submittedAt": "2026-02-05T10:35:00Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - No token or invalid token
- `404 Not Found` - Form or response not found
- `500 Internal Server Error` - Server error

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
  status: String (enum: 'draft', 'published', default: 'draft'),
  publicToken: String (unique, nullable, for sharing),
  publishedAt: Date,
  responseCount: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### FormResponse Model
```javascript
{
  _id: ObjectId,
  formId: ObjectId (reference to Form, required),
  responses: [
    {
      fieldId: String,
      fieldLabel: String,
      fieldType: String,
      value: Mixed (String, Number, Boolean, Array, etc.)
    }
  ],
  submittedBy: String (default: 'anonymous'),
  ipAddress: String (nullable),
  userAgent: String (nullable),
  submittedAt: Date (default: now)
}

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

- [x] Form submission storage
- [x] Form publishing with public links
- [ ] Form response export (CSV/Excel)
- [ ] Form analytics and statistics
- [ ] Email verification on signup
- [ ] Password reset functionality
- [ ] Refresh token mechanism
- [ ] Rate limiting
- [ ] Collaborative editing
- [ ] Form versioning
- [ ] Webhook notifications on form submission
- [ ] Multi-language support
- [ ] Advanced conditional logic for fields
- [ ] Payment/Donation form integration
- [ ] File upload fields

---

**Last Updated:** February 5, 2026
**API Version:** 2.0
