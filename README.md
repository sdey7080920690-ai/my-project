# Backend Project

A Node.js Express backend with authentication and todo functionality.

## Features

- User registration
- User login
- Password hashing with bcrypt
- JSON file-based user and todo storage
- Todo CRUD operations

## Installation

1. Clone the repository
2. Run `npm install`
3. Run `node index.js` to start the server on port 3000

## API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login

### Todo
- POST /api/todo/create (body: {title, description, userEmail})
- GET /api/todo?userEmail=... (query param for filtering)
- PUT /api/todo/:id (body: {title?, description?, completed?})
- DELETE /api/todo/:id