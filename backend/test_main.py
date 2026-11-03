# Run: pip install pytest "httpx<0.28" && pytest
import os

os.environ.setdefault("SECRET_KEY", "test-secret-key-that-is-32-bytes-long")
os.environ.setdefault("REDIRECT_URI", "http://localhost:8000/callback")
os.environ.setdefault("FRONTEND_URL", "http://localhost:5173")

from urllib.parse import parse_qs, urlparse

import jwt
from fastapi.testclient import TestClient

import main

client = TestClient(main.app)
client.follow_redirects = False


def test_login_sets_state_cookie_matching_url():
    r = client.get("/login")
    state = parse_qs(urlparse(r.headers["location"]).query)["state"][0]
    assert r.cookies[main.STATE_COOKIE] == state


def test_callback_rejects_missing_or_wrong_state():
    client.cookies.clear()
    r = client.get("/callback", params={"code": "c", "state": "x"})
    assert "error=state_mismatch" in r.headers["location"]

    client.cookies.set(main.STATE_COOKIE, "right")
    r = client.get("/callback", params={"code": "c", "state": "wrong"})
    assert "error=state_mismatch" in r.headers["location"]


def test_protected_route_rejects_bad_tokens():
    assert client.get("/profile").status_code == 401
    forged = jwt.encode({"access_token": "a"}, "wrong-key-that-is-32-bytes-long!!", algorithm="HS256")
    r = client.get("/profile", headers={"Authorization": f"Bearer {forged}"})
    assert r.status_code == 401


def test_invalid_time_range_is_rejected():
    token = jwt.encode({"access_token": "a"}, main.SECRET_KEY, algorithm="HS256")
    r = client.get(
        "/top-tracks",
        params={"time_range": "forever"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert r.status_code == 422
