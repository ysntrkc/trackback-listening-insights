# Spotify Stats Tracker Backend

This is a FastAPI application that allows users to view their Spotify statistics.

## Features

- Login with Spotify OAuth
- View user profile information
- Get top tracks for different time periods
- Get top artists for different time periods
- Logout functionality

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in the required values
3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Run the application:

```bash
uvicorn main:app --reload
```

## API Endpoints

- `GET /login` - Redirects to Spotify login
- `GET /callback` - Handles OAuth callback from Spotify
- `GET /profile` - Get user profile information
- `GET /top-tracks` - Get user's top tracks
- `GET /top-artists` - Get user's top artists
- `POST /logout` - Logs out the user

## Parameters for Top Tracks/Artists

- `time_range`: 
  - `short_term`: Last 4 weeks
  - `medium_term`: Last 6 months
  - `long_term`: Several years
- `limit`: Number of items to return (default: 20)

Example: `/top-tracks?time_range=short_term&limit=10`
