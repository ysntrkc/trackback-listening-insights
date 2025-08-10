# TrackBack Listening Insights

A web application that allows users to view their Spotify listening statistics, including top tracks and favorite artists across different time periods.

## Features

- OAuth2 authentication with Spotify
- View your Spotify profile information
- Track your top played songs over different time periods:
  - Last 4 weeks
  - Last 6 months
  - All time
- Discover your most listened artists with similar time ranges
- Responsive design for both desktop and mobile devices

## Project Structure

- `frontend/` - React application built with Vite
- `backend/` - FastAPI server handling Spotify API integration

## Prerequisites

- Node.js 16+ for frontend
- Python 3.12+ for backend
- Spotify Developer account and application credentials

## Getting Started

1. Clone the repository
2. Set up the backend:
   - Navigate to `backend/`
   - Copy `.env.example` to `.env` and fill in your Spotify credentials
   - Install dependencies: `pip install -r requirements.txt`
   - Start the server: `uvicorn main:app --reload`

3. Set up the frontend:
   - Navigate to `frontend/`
   - Copy `.env.example` to `.env`
   - Install dependencies: `npm install`
   - Start the development server: `npm run dev`

4. Visit `http://localhost:5173` to use the application

## Tech Stack

### Frontend
- React 18
- Vite
- React Router
- Axios

### Backend
- FastAPI
- Python
- JWT Authentication
- Spotify Web API

## Contact

If you want to use this application or have any questions, feel free to contact me via email at **yasintarakci42@gmail.com**.

## License

MIT
