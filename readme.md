# Ratio Backend

This repository contains base code for ratio backend.

## Installation

1. Clone the repository:


2. Navigate to the project directory:


3. Install dependencies:


4. Set up MongoDB:
- Create a MongoDB Atlas account or use an existing one.
- Replace the connection string in `app.js` with your MongoDB Atlas connection string.

## Usage

1. Start the server: npm start ( already added in package.json)


2. Access the application on `http://localhost:3000`.

## Endpoints

- `GET /users`: Retrieves all users from the database.
- `GET /users/{id}`: Retrieves a user from the database.

## Models

### User

The `User` model represents registered users.


Feel free to explore more by trying out the application!
