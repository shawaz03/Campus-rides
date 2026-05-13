"""Backend health endpoint tests for Campus Rides"""
import os
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://ac6fbafd-451e-47cb-8652-249f15f5109e.preview.emergentagent.com").rstrip("/")


def test_health_status_code():
    r = requests.get(f"{BASE_URL}/api/health", timeout=15)
    assert r.status_code == 200


def test_health_payload():
    r = requests.get(f"{BASE_URL}/api/health", timeout=15)
    data = r.json()
    assert data.get("status") == "ok"
    assert data.get("service") == "campus-rides"


def test_health_content_type():
    r = requests.get(f"{BASE_URL}/api/health", timeout=15)
    assert "application/json" in r.headers.get("Content-Type", "")
