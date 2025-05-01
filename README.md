
# User Authentication & Session Management (Node.js,Typescript MongoDB, Redis)

This project provides a complete **user authentication** system built with **Node.js (Express)**, **MongoDB**, and **Redis**. It handles **registration**, **login**, **session management**, and **password reset** functionality with a focus on security.

### Features
- User registration with **hashed passwords** (bcrypt)
- Login with **Session Management**
- Session management using **Redis**
- Secure password reset using time-limited tokens
- API documented with **Swagger UI**
- Middleware for **route protection**

---

## Tech Stack

- **Node.js** (Express)
- **MongoDB** (User data storage)
- **Redis** (Session management)
- **Typescript** (Typescript)
- **bcryptjs** (Password hashing)
- **Swagger UI** (API documentation)
- **Jest** (Unit and integration tests)

---

## Getting Started

### 1. Clone the Repo

```bash
git clone <repository-url>
cd <project-directory>
```
# master Banch

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root of the project with the following:

```bash
MONGO_URI=mongodb://localhost:27017/yourdbname
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=yourpassword
SESSION_SECRET=yoursecretkey
JWT_SECRET=yoursecretkey
```

### 4. Start the Server

Run the application:

```bash
npm run dev
```

The app will be available at `http://localhost:4000`.

---

## API Documentation

Swagger UI is integrated. Access it at:

```
http://localhost:4000/api-docs
```

This will let you interact with and test the API endpoints directly.

---

## Routes

### 1. POST `/api/auth/register`
Register a new user with the following JSON body:

```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Test1234!"
}
```

**Response**:
```json
{
  "success": true,
  "message": "User registered successfully"
}
```

---

### 2. POST `/api/auth/login`
Log in with **username** and **password**:

```json
{
  "username": "testuser",
  "password": "Test1234!"
}
```

**Response**:
```json
{
  "success": true,
  "token": "your-jwt-token"
}
```

---

### 3. POST `/api/auth/logout`
Log out and destroy the session.

**Response**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Testing

### Run Unit Tests

This app includes unit tests for **user registration**, **login**, and **session management**.

Run the tests with:

```bash
npm run test
```

Tests are located in `src/tests`.

---

## Security Measures

- **Password Hashing**: Uses **bcryptjs** to hash passwords.
- **JWT Authentication**: Secure token-based login system.
- **Redis**: Sessions are stored in **Redis** for fast access and efficient session management.
- **HTTPS**: Ensure your app runs with HTTPS in production (recommended for security).
- **Input Validation & Sanitization**: Prevents common security risks like SQL Injection, XSS, etc.

---

## Conclusion

This project provides a simple, secure authentication system that’s easy to extend. **Redis** speeds up session handling, and **JWT** ensures a stateless and scalable login process.

Feel free to clone, tweak, and use this for your own authentication requirements!

## Git Hub link : https://github.com/shyamgupta5555/Typescript_userOpration.git
