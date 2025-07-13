# LoFo - Lost and Found Platform

A web-based lost and found platform that helps people find their lost items. This platform provides an easy-to-use interface for searching lost items and connecting with the community.

## Features

- Easy search functionality with category filtering
- User-friendly interface
- Secure and privacy-focused platform
- Contact form for administrative support
- Responsive design for all devices
- User authentication and account management
- Admin dashboard for lost item management
- RESTful API for data management

## Technologies Used

### Frontend
- HTML5, CSS3, JavaScript
- React.js with React Router
- Axios for API communication
- Font Awesome Icons
- Responsive design with CSS

### Backend
- Node.js with Express
- RESTful API architecture
- MongoDB database
- Authentication with JWT

## Project Structure

### Traditional Frontend
- `frontend/` - Traditional HTML/CSS/JS implementation
  - `home.html` - Main page with search functionality
  - `about.html` - Information about LoFo platform
  - `contact.html` - Contact form and information
  - `login.html` - User authentication page
  - `admin.html` - Administrative dashboard
  - `css/` - Stylesheets for all pages
  - `js/` - JavaScript functionality
  - `images/` - Project images and assets

### React Frontend
- `frontend-react/` - Modern React implementation
  - `src/` - Source code
    - `components/` - React components
      - `layout/` - Header, Footer, and Layout components
      - `pages/` - Page components (Home, About, Contact, Login, Admin)
      - `ui/` - Reusable UI components
    - `context/` - React Context for state management
    - `services/` - API service for backend communication
  - `public/` - Static assets and HTML template

### Backend
- `backend/` - Node.js server implementation
  - `config/` - Configuration files
  - `database/` - Database connection and models
  - `routes/` - API endpoints
  - `server.js` - Main server file

## Getting Started

### Running the React Frontend
```
cd frontend-react
npm install
npm start
```

### Running the Backend
```
cd backend
npm install
npm start
```
