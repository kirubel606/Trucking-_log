
# Trip Logbook App

A full-stack Django and React application that allows property-carrying truck drivers to log trip details, calculate route information, and generate daily ELD logs. The app uses a free map API to display routes and automatically fills out log sheets based on input data.

## Features
- **Input Fields:**
  - Current location
  - Pickup location
  - Dropoff location
  - Current cycle hours used
- **Outputs:**
  - A map showing the route with information about stops and rest breaks.
  - Daily log sheets filled out with relevant details, including drawn logs for each day of the trip.
- **Assumptions:**
  - The driver is operating under the 70-hour/8-day rule for property-carrying drivers.
  - Fueling happens at least once every 1,000 miles.
  - 1-hour estimated time for pickup and drop-off.

## Tech Stack
- **Backend:** Django (REST API with Django REST Framework)
- **Frontend:** React (Vite for faster build time, Material-UI for UI components, Tailwind CSS for styling)
- **Database:** SQLite (or PostgreSQL in production)
- **Map API:** Google Maps 

## Installation

### 1. Backend (Django)
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/trip-logbook-app.git
   cd trip-logbook-app/backend
   ```

2. Set up a virtual environment and activate it:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run database migrations:
   ```bash
   python manage.py migrate
   ```

5. Start the Django server:
   ```bash
   python manage.py runserver
   ```

### 2. Frontend (React)
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm run dev
   ```

The app will be available on `http://localhost:3000` for the frontend and `http://localhost:8000` for the backend.

## Deployment

1. **Backend Deployment:**
   - The Django app can be deployed on services like **Heroku**, **Railway**, or **Render**.
   
2. **Frontend Deployment:**
   - The React app can be deployed to **Vercel** for easy hosting.


