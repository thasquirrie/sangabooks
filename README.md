# **SangaBooks**

## **Overview**

This is a Node.js project that provides a basic team management system. It allows administrators to create and manage team members, assign roles, and perform other administrative tasks.

## **Features**

- User authentication and authorization
- Team member management (create, read, update, delete)
- Role management (create, read, update, delete)
- Assignment of roles to team members

## **Technologies Used**

- Node.js
- Express.js
- Mongoose
- MongoDB

## **Project Structure**

- `src`: Source code directory
  - `models`: Mongoose models for database schema
  - `factory`: Mongoose abstraction database calls for models
  - `services`: Abstracted business logic for controller endpoints
  - `controllers`: Business logic for API endpoints
  - `routes`: API endpoint definitions
  - `utils`: Utility functions
- `app.js`: Main application file
- `server.js`: Entry file
- `.env`: Enviromental variables
- `connectDB.js`: Mongoose database declaration
- `package.json`: Project dependencies and scripts

## **Getting Started**

1. Clone the repository: `git clone https://github.com/thasquirrie/sangabooks.git`
2. Install dependencies: `npm install | yarn`
3. Start the application: `npm dev | yarn dev`
4. Access the API endpoints using a tool like Postman or cURL

## **API Endpoints**

- `POST  /auth/create-admin`: Create a new administrator
- `POST  /auth/admin-login`: Login endpoint for admins
- `POST  /auth/login`: Login endpoint for other users
- `POST  /auth/signup`: Sign up endpoint for users
- `GET   /admins/members`: Retrieve a list of all team members
- `GET   /admins/members/create`: Create a team member
- `PATCH /admins/members/:memberId/role`: Update the role of a team member
- `PATCH /admins/members/:memberId/status`: Update the status of a team member
- `PATCH /admins/members/:memberId/permissions`: Update the permissions of a team member
- `DELETE /admins/members/:memberId`: Delete a team member
- `GET  /roles`: Retrieve a list of all roles
- `POST /roles`: Create a new role
- `GET  /roles/:id`: Retrieve a single role by ID

## **License**

This project is licensed under the MIT License. See the LICENSE file for details.
