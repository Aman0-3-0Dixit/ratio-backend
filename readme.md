# Assignment : User Photo Upload

This repository contains base

## Installation

1. Clone the repository:


2. Navigate to the project directory:


3. Install dependencies:


4. Set up MongoDB:
- Create a MongoDB Atlas account or use an existing one.
- Replace the connection string in `app.js` with your MongoDB Atlas connection string.

## Usage

1. Start the server:


2. Access the application on `http://localhost:3000`.

## Endpoints

- `GET /users`: Retrieves all users from the database.
- `GET /users/{id}`: Retrieves a user from the database.

## Models

### User

The `User` model represents registered users.

#### Fields

- `username`: Name of the user. Required, must be between 3 and 20 characters.
- `email`: Email address of the user. Required, unique, and must be a valid email address.
- `password`: Password of the user. Required, hashed for security.
- `images`: Array of uploaded photo filenames.
- `createdAt`: Date and time when the user was created.





Feel free to explore more by trying out the application!
