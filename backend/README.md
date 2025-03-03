# Spotify Stats Tracker Backend

This is a FastAPI application that allows users to view their Spotify statistics.

## Features

- Login with Spotify OAuth
- View user profile information
- Get top tracks for different time periods
- Get top artists for different time periods
- Logout functionality
- Secure cookie-based JWT authentication
- CORS support for frontend integration

## Setup

1. Create a Spotify Developer Application:
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create a new application
   - Add `http://localhost:8000/callback` to Redirect URIs
   - Note down your Client ID and Client Secret

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in the following values:
   - `SPOTIFY_CLIENT_ID`: Your Spotify application client ID
   - `SPOTIFY_CLIENT_SECRET`: Your Spotify application client secret
   - `REDIRECT_URI`: Default is http://localhost:8000/callback
   - `SECRET_KEY`: A random string for JWT encryption
   - `FRONTEND_URL`: URL of your frontend (default: http://localhost:5173)

3. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Run the application:
   ```bash
   uvicorn main:app --reload
   ```

## API Endpoints

### Authentication
- `GET /login` - Redirects to Spotify login
- `GET /callback` - Handles OAuth callback from Spotify
- `POST /logout` - Logs out the user and clears auth cookie

### User Data
- `GET /init` - Quick authentication check and basic profile info
- `GET /profile` - Get detailed user profile information

### Statistics
- `GET /top-tracks` - Get user's top tracks
- `GET /top-artists` - Get user's top artists

Parameters for Top Tracks/Artists:
- `time_range`: 
  - `short_term`: Last 4 weeks
  - `medium_term`: Last 6 months
  - `long_term`: Several years
- `limit`: Number of items (default: 50, max: 50)

Example: `/top-tracks?time_range=short_term&limit=10`

## Error Handling

The API uses standardized error responses:
```json
{
  "status": "error",
  "message": "Error description",
  "data": null
}
```

Common error scenarios:
- 401: Authentication token missing or invalid
- 403: Insufficient Spotify permissions
- 429: Spotify API rate limit exceeded

## Development

- The application uses FastAPI's automatic API documentation
- Access interactive API docs at `/docs` or `/redoc`
- CORS is configured to allow requests from the frontend URL
- JWT tokens are stored in HTTP-only cookies for security

## Troubleshooting

1. If authentication fails:
   - Verify your Spotify application credentials
   - Check if redirect URI matches exactly
   - Ensure all required scopes are enabled in Spotify Dashboard

2. For "Invalid token" errors:
   - Clear browser cookies
   - Try logging in again
   - Check if SECRET_KEY is consistent

3. If CORS errors occur:
   - Verify FRONTEND_URL in .env matches your frontend URL
   - Check if credentials are included in frontend requests
