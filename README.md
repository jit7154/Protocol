# Chat App

This is a real-time chat application built using the **MERN** stack (MongoDB, Express.js, React, Node.js). It features secure user authentication with **JSON Web Tokens (JWT)**, real-time messaging via **WebSockets**, and a customizable user interface with **Tailwind CSS**.

---

## Features

* **User Authentication:** Secure sign-up and login with JWT.
* **Real-time Chat:** Instant messaging using WebSockets.
* **Message Storage:** Messages are stored persistently in **MongoDB**.
* **Image Sharing:** Send and receive image messages with image hosting on **Cloudinary**.
* **Profile Management:** Users can upload and manage their profile photos via Cloudinary.
* **Theming:** Users can personalize their experience by choosing different themes.
* **Middleware:** Robust backend with custom middleware for authentication and and error handling.
* **Responsive Design:** Built with Tailwind CSS for a mobile-first and responsive user interface.
  
---

## Tech Stack

**Frontend:**
* React
* Tailwind CSS
* Socket.IO Client

**Backend:**
* Node.js
* Express.js
* MongoDB (Mongoose ODM)
* Socket.IO
* JWT (jsonwebtoken, bcrypt)
* Cloudinary

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js 
* MongoDB
* npm or Yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd chat-app
    ```

2.  **Backend Setup:**
    ```bash
    cd backend
    npm install # or yarn
    ```
    Create a `.env` file in the `backend` directory and add your environment variables:
    ```
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```

3.  **Frontend Setup:**
    ```bash
    cd ../frontend
    npm install # or yarn
    ```
    Create a `.env` file in the `frontend` directory and add your environment variables:
    ```
    VITE_BACKEND_URL=http://localhost:5000 # Or your deployed backend URL
    ```

---

## Running the Application

1.  **Start the Backend Server:**
    ```bash
    cd backend
    npm start # or yarn start
    ```

2.  **Start the Frontend Development Server:**
    ```bash
    cd ../frontend
    npm run dev # or yarn dev
    ```

The application should now be running. Open your browser and navigate to `http://localhost:5173` (or whatever port the frontend is running on).

---

## Usage

1.  **Register a New Account:** Sign up with your desired username and password.
2.  **Log In:** Use your credentials to access the chat application.
3.  **Start Chatting:** Begin sending messages in real-time.
4.  **Send Images:** Use the image upload feature to share photos.
5.  **Change Theme:** Explore the settings to change your preferred theme.

---
