# Authentication API Service

This is a TypeScript-based authentication service using Express.js with SQLite as an in-memory database.

## Features

- User registration
- User login with JWT authentication
- Protected routes
- In-memory SQLite database
- Test users pre-loaded

## Prerequisites

- Node.js (v14 or higher)
- npm

## Installation

1. Clone the repository and install dependencies:
   `npm install`

2. Create a `.env` file in the root directory:
   PORT=3000
   JWT_SECRET=2f96d48e3acf4eab9b6b6a5e8e1f8b7c4d2e0a7f9c6b3d8e5a2c9f6b3d8e5a2

3. Start the server:
   `npm start`

## API Endpoints

### 1. Register User

**POST** `/auth/register`

```json
{
"username": "testuser",
"email": "test@example.com",
"password": "password123"
}
```

### 2. Login User

**POST** `/auth/login`

```json
{
"email": "test1@example.com",
"password": "password123"
}
```

Response:

```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Validate Token

**GET** `/auth/validate`  
Headers: `Authorization: Bearer <your-jwt-token>`

Response (valid token):

```json
{
    "valid": true,
    "user": {
        "userId": "1",
        "email": "test1@example.com"
    }
}
```

### 4. Protected Route

**GET** `/auth/protected`  
Headers: `Authorization: Bearer <your-jwt-token>`

Response:

```json
{
    "message": "Protected route",
    "user": {
        "userId": "1",
        "email": "test1@example.com"
    }
}
```

## Implementation Details

### Project Structure

- `src/app.ts` - Main application entry point
- `src/controllers/` - Request handlers
- `src/services/` - Business logic
- `src/middleware/` - Custom middleware (auth)
- `src/routes/` - API routes
- `src/types/` - TypeScript interfaces

### Key Components

1. **Database Service (`database.service.ts`)**

   - Implements Singleton pattern
   - Uses SQLite in-memory database
   - Handles user creation and queries
   - Includes pre-loaded test users

2. **Authentication Service (`auth.service.ts`)**

   - Handles user registration with password hashing
   - Manages login with JWT token generation
   - Uses bcrypt for password hashing

3. **Authentication Middleware (`auth.middleware.ts`)**

   - Validates JWT tokens
   - Protects routes requiring authentication

4. **Controllers (`auth.controller.ts`)**
   - Handles HTTP requests
   - Manages response formatting
   - Error handling

### Test Users

The database comes pre-loaded with two test users:

```json
{
"username": "testuser1",
"email": "test1@example.com",
"password": "password123"
}
{
"username": "testuser2",
"email": "test2@example.com",
"password": "password123"
}
```

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Protected routes middleware
- Environment variable configuration
- CORS enabled

## Testing with Postman

Import these cURL commands to test the API:

1. **Register:**

curl --location 'http://localhost:3000/auth/register' \
--header 'Content-Type: application/json' \
--data-raw '{
"username": "newuser",
"email": "newuser@example.com",
"password": "password123"
}'

2. **Login:**

curl --location 'http://localhost:3000/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
"email": "test1@example.com",
"password": "password123"
}'

3. **Protected Route:**

curl --location 'http://localhost:3000/auth/protected' \
--header 'Authorization: Bearer <your-jwt-token>'

## Notes

- The database is in-memory, so data will be reset when the server restarts
- JWT tokens expire after 1 hour
- Error handling is implemented for common scenarios
- The service uses TypeScript for type safety
