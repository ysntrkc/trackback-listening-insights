# Spotify Stats Tracker Frontend

A React-based frontend for the Spotify Stats Tracker application, built with Vite.

## Features

- Clean and responsive user interface
- Real-time authentication state management
- Profile information display
- Interactive top tracks and artists views
- Time range selection for statistics
- Loading states and error handling

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
```
Set `VITE_BACKEND_URL` to match your backend server URL (default: http://localhost:8000)

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Project Structure

- `src/components/` - React components
- `src/context/` - React context providers
- `src/styles/` - CSS stylesheets
- `src/utils/` - Utility functions and API client
- `public/` - Static assets

## Components

- `App.jsx` - Main application component
- `Login.jsx` - Spotify login page
- `Profile.jsx` - User profile display
- `TopTracks.jsx` - Top tracks listing
- `TopArtists.jsx` - Top artists grid
- `Navigation.jsx` - Navigation bar
- `Loading.jsx` - Loading spinner

## State Management

The application uses React Context for:
- Authentication state
- User profile data
- Session management

## API Integration

- Axios-based API client with session storage caching
- Automatic error handling
- Request/response interceptors
- CORS configuration

## Development

1. Start the backend server first
2. Run the frontend in development mode
3. Access the app at http://localhost:5173

## Troubleshooting

1. If login fails:
   - Check if backend URL is correct in .env
   - Verify backend server is running
   - Clear browser cache/cookies

2. For API errors:
   - Check browser console for error messages
   - Verify authentication state
   - Ensure backend is accessible

3. For build issues:
   - Clear node_modules and reinstall
   - Update dependencies
   - Check for conflicting environment variables