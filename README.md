# Workout Tracker - Full Stack Exercise Log Management Application

## Project Overview

Workout Tracker is a comprehensive full-stack web application designed to help users manage and track their fitness journey. Built using React, Node.js, and MongoDB, this application provides a robust platform for creating, learning how to execute exercises, tracking, and analyzing workout routines with a focus on user experience and functionality.
When runned for the first time services will activate and create 2 users one admin one regular for quick use, also all of the exercises will be made as well as three prefixed workouts allways be available for your use (not from database)
.env files are uploaded as well make sure of right path

## Features

### Core Functionality

-   **User Authentication & Authorization**

    -   Secure login and registration system
    -   Role-based access control (Admin/Regular users)
    -   JWT-based authentication
    -   Protected routes and API endpoints

-   **Workout Management**

    -   Create custom workout routines
    -   Choose from 500+ exercises in the database
    -   Track sets, reps, and weights for each exercise
    -   Add notes to exercises and workouts
    -   Mark workouts as favorites (only user made not prefixed)
    -   Real-time workout timer during sessions
    -   Check instructions for each exercise as you build or execute workout

-   **Exercise Library**

    -   Comprehensive database of exercises
    -   Detailed exercise information including:
        -   Primary and secondary muscles worked
        -   Equipment required
        -   Difficulty level
        -   Step-by-step instructions
        -   Exercise categories and types
        -   Info icon everywhere an exercise displayed for instructions on exercise

-   **Workout Tracking**

    -   Log completed workouts
    -   Track progress over time
    -   View workout history
    -   Analyze performance trends
    -   Search and filter workout logs by date

-   **Admin Features**
    -   Manage exercise database
    -   Add/Edit/Delete exercises

### User Experience

-   Modern, responsive design
-   Intuitive navigation
-   Real-time feedback on actions
-   Comprehensive exercise search and filtering
-   Mobile-friendly interface
-   Accessible instructions when choosing and when preforming exercises

## Technical Stack

### Frontend

-   React
-   Tailwind CSS for styling
-   Axios for API requests
-   JWT for authentication
-   Lucide React for icons
-   Context API for state management

### Backend

-   Node.js
-   Express.js
-   MongoDB
-   Mongoose for database modeling
-   JWT for authentication
-   Joi for validation
-   Bcrypt for password hashing

### Installation

2. Install backend dependencies:

```bash
cd server
npm install
```

3. Install frontend dependencies:

```bash
cd client
npm install
```

4. Create `.env` files or use the ones provided in the server directory with the following variables:

```env
PORT=8989
JWT_SECRET="secret"
MONGO_URL="mongodb://localhost:27017/workoutapp"
```

````env
REACT_APP_API_URL=http://localhost:8989

5. Make sure you have tailwind.config.js and postcss.config.js for website styling .env files for front and beck ends

6. Start the backend server:

```bash
cd server
npm start
````

7. Start the frontend application:

```bash
cd client
npm start
```

## Usage Guide

### For Regular Users And Admins

1. **Getting Started**

    - Register for a new account
    - Log in to access your dashboard
    - Browse the exercise library
    - Create your first workout

2. **Creating a Workout**

    - Click "Create Workout" from the dashboard
    - Add exercises from the exercise library
    - Set your target reps and weights
    - Add notes if needed
    - Save your workout

3. **Starting a Workout**

    - Select a workout from your list or sample workouts
    - Follow the guided workout interface
    - Track your sets and reps
    - Save your workout log when finished

4. **Tracking Progress**

    - View your workout history
    - Check your recent workouts
    - Analyze your performance
    - Review favorite workouts (only user made workouts can be marked favorite)

5. **Initial Data And Service**
    - upon installation services will be executed
    - 2 users (one admin one regular passwords provided inside usersInitialData in comments)
    - 574 Exercises built in the database
    - No workouts other than the sample ones are pre made

### For Admin Users Only

**Exercise Management From Frontend**

-   Add new exercises to the database
-   Edit existing exercise details
-   Remove outdated exercises
-   Manage exercise categories

**User Management from Backend**

-   Change user role by PATCH request to admin or not
-   Delete users
-   Update users
-   Read every user created
