from fastapi import FastAPI, HTTPException, Depends, Request, Header, Query
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import requests
import base64
import os
import secrets
from dotenv import load_dotenv
import jwt
import time
from urllib.parse import urlencode
from typing import Any, Dict, Literal, Optional

load_dotenv()

app = FastAPI(title="TrackBack Listening Insights")

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
# An empty key would let anyone sign valid tokens
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY is not set")

# Spotify API endpoints
AUTH_URL = "https://accounts.spotify.com/authorize"
TOKEN_URL = "https://accounts.spotify.com/api/token"
API_BASE_URL = "https://api.spotify.com/v1"
SPOTIFY_TIMEOUT = 10
STATE_COOKIE = "oauth_state"

# Scopes for Spotify API access
SCOPES = [
    "user-read-private",
    "user-read-email",
    "user-top-read",
]

TimeRange = Literal["short_term", "medium_term", "long_term"]


def create_response(
    status: str = "success", message: str = "", data: Optional[Any] = None
) -> Dict[str, Any]:
    """Create a standardized API response"""
    return {"status": status, "message": message, "data": data}


def get_token_from_request(authorization: str = Header(None)):
    """Extract and validate the JWT token from request header"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing authentication token")
    try:
        return jwt.decode(
            authorization.removeprefix("Bearer "), SECRET_KEY, algorithms=["HS256"]
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=401, detail=f"Invalid authentication token: {str(e)}"
        )


def spotify_get(token_data: Dict[str, Any], path: str, params: Optional[dict] = None):
    """GET a Spotify API endpoint with the user's access token"""
    headers = {"Authorization": f"Bearer {token_data['access_token']}"}
    r = requests.get(
        f"{API_BASE_URL}{path}", headers=headers, params=params, timeout=SPOTIFY_TIMEOUT
    )
    if r.status_code != 200:
        raise HTTPException(status_code=r.status_code, detail="Spotify API error")
    return r.json()


def first_image(images):
    return images[0]["url"] if images else None


def frontend_redirect(**params):
    return RedirectResponse(
        url=f"{FRONTEND_URL}/auth?{urlencode(params)}", status_code=303
    )


@app.get("/")
def root():
    return create_response(message="Welcome to TrackBack Listening Insights API")


@app.get("/init")
def init(authorization: str = Header(None)):
    """Check if user is logged in and return minimal profile information"""
    try:
        user_data = spotify_get(get_token_from_request(authorization), "/me")
    except HTTPException:
        return JSONResponse(
            status_code=401,
            content=create_response(
                status="error", message="Not authenticated", data=None
            ),
        )
    profile_data = {
        "display_name": user_data.get("display_name"),
        "profile_image": first_image(user_data.get("images")),
    }
    return create_response(message="User is authenticated", data=profile_data)


@app.get("/login")
def login():
    """Redirect user to Spotify authorization page"""
    state = secrets.token_urlsafe(16)
    params = {
        "client_id": CLIENT_ID,
        "response_type": "code",
        "redirect_uri": REDIRECT_URI,
        "scope": " ".join(SCOPES),
        "state": state,
        "show_dialog": True,
    }

    response = RedirectResponse(url=f"{AUTH_URL}?{urlencode(params)}")
    # The state cookie ties the callback to this browser (prevents login CSRF)
    response.set_cookie(
        STATE_COOKIE,
        state,
        max_age=600,
        httponly=True,
        secure=REDIRECT_URI.startswith("https"),
        samesite="lax",
    )
    return response


@app.get("/callback")
def callback(
    request: Request, code: str = None, state: str = None, error: str = None
):
    """Handle callback from Spotify auth"""
    if error:
        return frontend_redirect(error=error)

    expected_state = request.cookies.get(STATE_COOKIE)
    if not state or not expected_state or not secrets.compare_digest(
        state, expected_state
    ):
        return frontend_redirect(error="state_mismatch")

    if not code:
        return frontend_redirect(error="no_code")

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
        r = requests.post(
            TOKEN_URL, headers=headers, data=data, timeout=SPOTIFY_TIMEOUT
        )

        if r.status_code != 200:
            return frontend_redirect(error="spotify_api_error")

        tokens = r.json()

        # The refresh token is not stored: it is never used and the JWT payload is readable
        jwt_token = jwt.encode(
            {
                "access_token": tokens["access_token"],
                "exp": time.time() + tokens["expires_in"],
            },
            SECRET_KEY,
            algorithm="HS256",
        )

        # Token goes in the URL fragment, which browsers never send to servers or logs
        response = RedirectResponse(
            url=f"{FRONTEND_URL}/auth#token={jwt_token}", status_code=303
        )
    except Exception:
        response = frontend_redirect(error="server_error")
    response.delete_cookie(STATE_COOKIE)
    return response


@app.get("/profile")
def get_profile(token_data=Depends(get_token_from_request)):
    """Get user's Spotify profile"""
    user_data = spotify_get(token_data, "/me")

    profile_data = {
        "display_name": user_data.get("display_name"),
        "email": user_data.get("email"),
        "profile_image": first_image(user_data.get("images")),
        "spotify_url": user_data.get("external_urls", {}).get("spotify"),
        "followers": user_data.get("followers", {}).get("total"),
    }

    return create_response(message="Profile retrieved successfully", data=profile_data)


@app.get("/top-tracks")
def get_top_tracks(
    time_range: TimeRange = "medium_term",
    limit: int = Query(50, ge=1, le=50),
    token_data=Depends(get_token_from_request),
):
    """Get user's top tracks"""
    response = spotify_get(
        token_data, "/me/top/tracks", {"time_range": time_range, "limit": limit}
    )

    tracks = []
    for item in response["items"]:
        track = {
            "name": item["name"],
            "artist": ", ".join([artist["name"] for artist in item["artists"]]),
            "album": item["album"]["name"],
            "image": first_image(item["album"]["images"]),
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
def get_top_artists(
    time_range: TimeRange = "medium_term",
    limit: int = Query(50, ge=1, le=50),
    token_data=Depends(get_token_from_request),
):
    """Get user's top artists"""
    response = spotify_get(
        token_data, "/me/top/artists", {"time_range": time_range, "limit": limit}
    )

    artists = []
    for item in response["items"]:
        artist = {
            "name": item["name"],
            "image": first_image(item["images"]),
            "spotify_url": item["external_urls"]["spotify"],
        }
        artists.append(artist)

    return create_response(
        message="Top artists retrieved successfully",
        data={"artists": artists},
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content=create_response(status="error", message=str(exc.detail), data=None),
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
