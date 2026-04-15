# Security Configuration & Setup Guide

## Overview
This document outlines the security configurations implemented for Task 1.2 of the IPT Backend project.

## Security Features Implemented

### 1. **Password Hashing with bcryptjs**
- Passwords are automatically hashed using bcryptjs with 10 salt rounds before being stored in the database
- Location: `models/User.js` - `pre('save')` hook
- Method: `user.matchPassword(enteredPassword)` - securely compares passwords during login

### 2. **JWT (JSON Web Token) Authentication**
- Generated on successful registration and login
- Token expires after 7 days (configurable via `JWT_EXPIRE` in `.env`)
- Secret key is stored in environment variables (`JWT_SECRET`)

**Usage:**
```
Authorization: Bearer <token>
```

### 3. **Authentication Middleware**
- Location: `middleware/auth.js`
- `protect` middleware - Verifies JWT tokens on protected routes
- `authorize` middleware - Checks user role for role-based access control
- Protected endpoints:
  - POST /api/projects - Create projects (requires authentication)
  - PUT /api/projects/:id - Update projects (requires authentication)
  - DELETE /api/projects/:id - Delete projects (requires authentication)
  - POST /api/tasks - Create tasks (requires authentication)
  - PUT /api/tasks/:id - Update tasks (requires authentication)
  - DELETE /api/tasks/:id - Delete tasks (requires authentication)

### 4. **Environment Variables**
Essential security variables in `.env`:
```
PORT=3000
MONGO_URI=mongodb+srv://admin:admin123@cluster0.9wylnf5.mongodb.net/IPT?appName=Cluster0
JWT_SECRET=your_jwt_secret_key_change_this_in_production_2024
JWT_EXPIRE=7d
```

**⚠️ IMPORTANT:** Change `JWT_SECRET` to a strong random string in production!

### 5. **User Model Enhancements**
- Password hashing on save
- `matchPassword()` method for secure password comparison
- Role-based authorization (admin/member)
- Timestamps for created/updated tracking

### 6. **Controller Updates**
- Better error handling and validation
- User data returned excludes sensitive information
- Token returned on successful registration and login

## Security Best Practices

### For Development:
1. ✅ Use `.env` for sensitive data
2. ✅ Never commit `.env` to version control
3. ✅ Test authentication flows
4. ✅ Verify token expiration

### For Production:
1. 🔒 Change `JWT_SECRET` to a strong random value
2. 🔒 Use `HTTPS` only
3. 🔒 Enable CORS with specific allowed origins
4. 🔒 Implement rate limiting
5. 🔒 Use environment-specific `.env` files
6. 🔒 Enable helmet.js for HTTP headers
7. 🔒 Implement CSRF protection
8. 🔒 Add input validation and sanitization
9. 🔒 Monitor authentication attempts
10. 🔒 Use strong database credentials

## Testing Authentication

### 1. Create User (Register)
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"SecurePass123!"}'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"SecurePass123!"}'
```

### 3. Create Project (Protected - Requires Token)
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{"title":"My Project","description":"Test project"}'
```

## Future Enhancements
- [ ] Email verification on registration
- [ ] Password reset functionality
- [ ] Two-factor authentication (2FA)
- [ ] OAuth2/Google Sign-In integration
- [ ] Rate limiting middleware
- [ ] Helmet.js security headers
- [ ] CORS configuration
- [ ] Input validation & sanitization
- [ ] Audit logging
- [ ] Session management with express-session

## Configuration File
- Location: `config/security.js`
- Contains centralized security settings for password rules, CORS, JWT, sessions, and rate limiting
