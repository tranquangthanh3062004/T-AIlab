import uuid
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_register_and_login_flow():
    unique_email = f"learner_{uuid.uuid4().hex[:6]}@example.com"
    reg_res = client.post("/api/auth/register", json={
        "email": unique_email,
        "full_name": "Tran Quang Thanh",
        "password": "securepassword123",
        "role": "Applied AI Engineer"
    })
    assert reg_res.status_code == 200
    data = reg_res.json()
    assert "access_token" in data
    assert data["user"]["email"] == unique_email
    assert data["user"]["full_name"] == "Tran Quang Thanh"

    # Login with same credentials
    login_res = client.post("/api/auth/login", json={
        "email": unique_email,
        "password": "securepassword123"
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]

    # Fetch /api/auth/me
    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["email"] == unique_email

def test_google_oauth_and_multi_account_linking():
    primary_google = f"thanh_google_{uuid.uuid4().hex[:5]}@gmail.com"
    google_res = client.post("/api/auth/google", json={
        "email": primary_google,
        "full_name": "Thanh Google Primary",
        "avatar_url": "https://api.dicebear.com/7.x/initials/svg?seed=Thanh"
    })
    assert google_res.status_code == 200
    g_data = google_res.json()
    token = g_data["access_token"]
    assert g_data["user"]["auth_provider"] == "google"
    assert len(g_data["user"]["connected_google_accounts"]) == 1

    # Link a second Google account
    second_google = f"thanh_lab_{uuid.uuid4().hex[:5]}@gmail.com"
    link_res = client.post(
        "/api/auth/google/link",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "email": second_google,
            "full_name": "Thanh AI Lab Account"
        }
    )
    assert link_res.status_code == 200
    linked_user = link_res.json()
    emails = [a["email"] for a in linked_user["connected_google_accounts"]]
    assert primary_google in emails
    assert second_google in emails
