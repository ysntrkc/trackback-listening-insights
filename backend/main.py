from fastapi import FastAPI, HTTPException, Depends, Request, Header
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import requests
import base64
import os
from dotenv import load_dotenv
from jose import jwt
import time
from urllib.parse import urlencode
from typing import Any, Dict, Optional

load_dotenv()

app = FastAPI(title="Spotify Stats Tracker")

FRONTEND_URL = os.getenv("FRONTEND_URL")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Spotify API credentials
CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
REDIRECT_URI = os.getenv("REDIRECT_URI")
SECRET_KEY = os.getenv("SECRET_KEY")

# Spotify API endpoints
AUTH_URL = "https://accounts.spotify.com/authorize"
TOKEN_URL = "https://accounts.spotify.com/api/token"
API_BASE_URL = "https://api.spotify.com/v1"

# Scopes for Spotify API access
SCOPES = [
    "user-read-private",
    "user-read-email",
    "user-top-read",
]


def create_response(
    status: str = "success", message: str = "", data: Optional[Any] = None
) -> Dict[str, Any]:
    """Create a standardized API response"""
    return {"status": status, "message": message, "data": data}


def get_token_from_request(request: Request, authorization: str = Header(None)):
    """Extract and validate the JWT token from request header"""
    try:
        if authorization and authorization.startswith("Bearer "):
            token = authorization.replace("Bearer ", "")
        else:
            raise HTTPException(status_code=401, detail="Missing authentication token")

        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except Exception as e:
        raise HTTPException(
            status_code=401, detail=f"Invalid authentication token: {str(e)}"
        )


@app.get("/")
async def root():
    return create_response(message="Welcome to Spotify Stats Tracker API")


@app.get("/init")
async def init(request: Request, authorization: str = Header(None)):
    """Check if user is logged in and return minimal profile information"""
    try:
        token_data = get_token_from_request(request, authorization)
        access_token = token_data["access_token"]
        headers = {"Authorization": f"Bearer {access_token}"}

        r = requests.get(f"{API_BASE_URL}/me", headers=headers)

        if r.status_code != 200:
            raise HTTPException(status_code=r.status_code, detail=r.json())

        user_data = r.json()
        profile_data = {
            "display_name": user_data.get("display_name"),
            "profile_image": (
                user_data.get("images")[0].get("url")
                if user_data.get("images")
                else None
            ),
        }
        return create_response(message="User is authenticated", data=profile_data)
    except HTTPException as _:
        return JSONResponse(
            status_code=401,
            content=create_response(
                status="error", message="Not authenticated", data=None
            ),
        )


@app.get("/login")
async def login():
    """Redirect user to Spotify authorization page"""
    params = {
        "client_id": CLIENT_ID,
        "response_type": "code",
        "redirect_uri": REDIRECT_URI,
        "scope": " ".join(SCOPES),
        "show_dialog": True,
    }

    auth_url = f"{AUTH_URL}?{urlencode(params)}"
    return RedirectResponse(url=auth_url)


@app.get("/callback")
async def callback(code: str = None, error: str = None):
    """Handle callback from Spotify auth"""
    if error:
        return RedirectResponse(url=f"{FRONTEND_URL}/auth?error={error}")

    if not code:
        return RedirectResponse(url=f"{FRONTEND_URL}/auth?error=no_code")

    auth_string = base64.b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode()).decode()

    headers = {
        "Authorization": f"Basic {auth_string}",
        "Content-Type": "application/x-www-form-urlencoded",
    }

    data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI,
    }

    try:
        r = requests.post(TOKEN_URL, headers=headers, data=data)

        if r.status_code != 200:
            error_message = "spotify_api_error"
            return RedirectResponse(url=f"{FRONTEND_URL}/auth?error={error_message}")

        tokens = r.json()

        expires_in = tokens["expires_in"]
        jwt_token = jwt.encode(
            {
                "access_token": tokens["access_token"],
                "refresh_token": tokens["refresh_token"],
                "exp": time.time() + expires_in,
            },
            SECRET_KEY,
            algorithm="HS256",
        )

        redirect_url = f"{FRONTEND_URL}/auth?token={jwt_token}"
        return RedirectResponse(url=redirect_url, status_code=303)
    except Exception as e:
        return RedirectResponse(
            url=f"{FRONTEND_URL}/auth?error=server_error", status_code=303
        )


@app.get("/profile")
async def get_profile(token_data=Depends(get_token_from_request)):
    """Get user's Spotify profile"""
    access_token = token_data["access_token"]
    headers = {"Authorization": f"Bearer {access_token}"}

    r = requests.get(f"{API_BASE_URL}/me", headers=headers)

    if r.status_code != 200:
        raise HTTPException(status_code=r.status_code, detail=r.json())

    user_data = r.json()

    profile_data = {
        "display_name": user_data.get("display_name"),
        "email": user_data.get("email"),
        "profile_image": (
            user_data.get("images")[0].get("url") if user_data.get("images") else None
        ),
        "spotify_url": user_data.get("external_urls", {}).get("spotify"),
        "followers": user_data.get("followers", {}).get("total"),
    }

    return create_response(message="Profile retrieved successfully", data=profile_data)


@app.get("/top-tracks")
async def get_top_tracks(
    time_range: str = "medium_term",
    limit: int = 50,
    token_data=Depends(get_token_from_request),
):
    """Get user's top tracks"""
    access_token = token_data["access_token"]
    headers = {"Authorization": f"Bearer {access_token}"}

    params = {
        "time_range": time_range,
        "limit": limit,
    }

    r = requests.get(f"{API_BASE_URL}/me/top/tracks", headers=headers, params=params)

    if r.status_code != 200:
        raise HTTPException(status_code=r.status_code, detail=r.json())

    response = r.json()

    tracks = []
    for item in response["items"]:
        track = {
            "name": item["name"],
            "artist": ", ".join([artist["name"] for artist in item["artists"]]),
            "album": item["album"]["name"],
            "image": (
                item["album"]["images"][0]["url"] if item["album"]["images"] else None
            ),
            "spotify_url": item["external_urls"]["spotify"],
            "artist_url": (
                item["artists"][0]["external_urls"]["spotify"]
                if item["artists"]
                else None
            ),
        }
        tracks.append(track)

    return create_response(
        message="Top tracks retrieved successfully",
        data={"tracks": tracks},
    )


@app.get("/top-artists")
async def get_top_artists(
    time_range: str = "medium_term",
    limit: int = 50,
    token_data=Depends(get_token_from_request),
):
    """Get user's top artists"""
    access_token = token_data["access_token"]
    headers = {"Authorization": f"Bearer {access_token}"}

    params = {
        "time_range": time_range,
        "limit": limit,
    }

    r = requests.get(f"{API_BASE_URL}/me/top/artists", headers=headers, params=params)

    if r.status_code != 200:
        raise HTTPException(status_code=r.status_code, detail=r.json())

    response = r.json()

    artists = []
    for item in response["items"]:
        artist = {
            "name": item["name"],
            "image": item["images"][0]["url"] if item["images"] else None,
            "spotify_url": item["external_urls"]["spotify"],
        }
        artists.append(artist)

    return create_response(
        message="Top artists retrieved successfully",
        data={"artists": artists},
    )


@app.post("/logout")
async def logout():
    """Logout endpoint that returns success message"""
    return create_response(message="Logged out successfully")


@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content=create_response(status="error", message=str(exc.detail), data=None),
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
