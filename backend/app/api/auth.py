import base64
import hashlib
import hmac
import json
import secrets
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.entities import UserAccount, LearnerProfile, UserProgress
from app.schemas.auth import (
    RegisterRequest, LoginRequest, GoogleAuthRequest,
    LinkGoogleAccountRequest, GoogleAccountItem,
    UserProfileSchema, AuthResponse
)

router = APIRouter(prefix="/auth", tags=["Authentication & Google OAuth"])

SECRET_KEY = "chinai-t-ailab-production-hmac-key-2026"

def _hash_password(password: str, salt: Optional[str] = None) -> str:
    if not salt:
        salt = secrets.token_hex(16)
    dk = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100_000)
    return f"{salt}${dk.hex()}"

def _verify_password(password: str, stored_hash: str) -> bool:
    if not stored_hash or "$" not in stored_hash:
        return False
    salt, _ = stored_hash.split("$", 1)
    expected = _hash_password(password, salt)
    return hmac.compare_digest(expected, stored_hash)

def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "iat": int(datetime.utcnow().timestamp()),
    }
    payload_b64 = base64.urlsafe_b64encode(json.dumps(payload).encode("utf-8")).decode("utf-8").rstrip("=")
    sig = hmac.new(SECRET_KEY.encode("utf-8"), payload_b64.encode("utf-8"), hashlib.sha256).hexdigest()
    return f"{payload_b64}.{sig}"

def decode_access_token(token: str) -> Optional[dict]:
    try:
        if "." not in token:
            return None
        payload_b64, sig = token.split(".", 1)
        expected_sig = hmac.new(SECRET_KEY.encode("utf-8"), payload_b64.encode("utf-8"), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(sig, expected_sig):
            return None
        padding = "=" * (-len(payload_b64) % 4)
        data = json.loads(base64.urlsafe_b64decode(payload_b64 + padding).decode("utf-8"))
        return data
    except Exception:
        return None

def get_current_user_id(
    authorization: Optional[str] = Header(default=None),
    x_user_id: Optional[str] = Header(default=None)
) -> str:
    if authorization and authorization.lower().startswith("bearer "):
        token = authorization.split(" ", 1)[1].strip()
        decoded = decode_access_token(token)
        if decoded and decoded.get("sub"):
            return decoded["sub"]
    if x_user_id and x_user_id.strip():
        return x_user_id.strip()
    return "default-learner"

def _ensure_learner_profile(db: Session, user_id: str):
    profile = db.query(LearnerProfile).filter(LearnerProfile.user_id == user_id).first()
    if not profile:
        # Copy baseline or guest progress if available
        guest_profile = db.query(LearnerProfile).filter(LearnerProfile.user_id == "default-learner").first()
        profile = LearnerProfile(
            user_id=user_id,
            diagnostic_completed=guest_profile.diagnostic_completed if guest_profile else False,
            diagnostic_score=guest_profile.diagnostic_score if guest_profile else 0.0,
            recommended_track=guest_profile.recommended_track if guest_profile else "track-foundations",
            xp=guest_profile.xp if guest_profile else 150,
            level=guest_profile.level if guest_profile else 2,
            streak_days=guest_profile.streak_days if guest_profile else 3,
            badges_json=guest_profile.badges_json if guest_profile else json.dumps(["first_step", "streak_champion"]),
            daily_goal_xp=50,
            today_xp=guest_profile.today_xp if guest_profile else 30,
        )
        db.add(profile)
        # Also copy completed lessons from guest to this user if none exist yet
        guest_lessons = db.query(UserProgress).filter(UserProgress.user_id == "default-learner").all()
        for gl in guest_lessons:
            new_prog_id = f"prog-{user_id}-{gl.lesson_id}"
            if not db.query(UserProgress).filter(UserProgress.id == new_prog_id).first():
                db.add(UserProgress(
                    id=new_prog_id,
                    user_id=user_id,
                    lesson_id=gl.lesson_id,
                    completed=gl.completed,
                    quiz_score=gl.quiz_score,
                    code_exercise_passed=gl.code_exercise_passed,
                    xp_earned=gl.xp_earned
                ))
        db.commit()

def _to_user_schema(user: UserAccount) -> UserProfileSchema:
    try:
        raw_accounts = json.loads(user.google_accounts_json or "[]")
    except Exception:
        raw_accounts = []
    accounts = [GoogleAccountItem(**acc) for acc in raw_accounts]
    return UserProfileSchema(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        avatar_url=user.avatar_url,
        role=user.role or "AI Explorer",
        auth_provider=user.auth_provider or "local",
        connected_google_accounts=accounts,
        created_at=user.created_at.isoformat() if user.created_at else datetime.utcnow().isoformat()
    )

@router.post("/register", response_model=AuthResponse)
def register_user(req: RegisterRequest, db: Session = Depends(get_db)):
    email = req.email.strip().lower()
    if not email or "@" not in email:
        raise HTTPException(status_code=400, detail="Email không hợp lệ / Invalid email address")
    if len(req.password) < 6:
        raise HTTPException(status_code=400, detail="Mật khẩu phải có ít nhất 6 ký tự / Password must be at least 6 characters")

    existing = db.query(UserAccount).filter(UserAccount.email == email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email này đã được đăng ký. Vui lòng đăng nhập! / Email already registered")

    user_id = f"user-{secrets.token_hex(6)}"
    avatar = f"https://api.dicebear.com/7.x/initials/svg?seed={req.full_name.strip() or email}"
    google_list = []
    if email.endswith("@gmail.com"):
        google_list.append({
            "email": email,
            "name": req.full_name.strip(),
            "avatar_url": avatar,
            "is_primary": True,
            "linked_at": datetime.utcnow().isoformat()
        })

    new_user = UserAccount(
        id=user_id,
        email=email,
        full_name=req.full_name.strip() or email.split("@")[0],
        password_hash=_hash_password(req.password),
        auth_provider="local",
        avatar_url=avatar,
        role=req.role or "AI Learner",
        google_accounts_json=json.dumps(google_list)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    _ensure_learner_profile(db, user_id)
    token = create_access_token(new_user.id, new_user.email)
    return AuthResponse(access_token=token, user=_to_user_schema(new_user))

@router.post("/login", response_model=AuthResponse)
def login_user(req: LoginRequest, db: Session = Depends(get_db)):
    email = req.email.strip().lower()
    user = db.query(UserAccount).filter(UserAccount.email == email).first()
    if not user or not user.password_hash or not _verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=401,
            detail="Email hoặc mật khẩu không chính xác / Invalid email or password"
        )

    user.last_login_at = datetime.utcnow()
    db.commit()
    db.refresh(user)

    _ensure_learner_profile(db, user.id)
    token = create_access_token(user.id, user.email)
    return AuthResponse(access_token=token, user=_to_user_schema(user))

@router.post("/google", response_model=AuthResponse)
def google_oauth_login(req: GoogleAuthRequest, db: Session = Depends(get_db)):
    email = req.email.strip().lower()
    full_name = req.full_name.strip()

    # If a real Google JWT credential is provided, decode its payload
    if req.google_credential and "." in req.google_credential:
        try:
            parts = req.google_credential.split(".")
            if len(parts) >= 2:
                pad = "=" * (-len(parts[1]) % 4)
                jwt_payload = json.loads(base64.urlsafe_b64decode(parts[1] + pad).decode("utf-8"))
                email = jwt_payload.get("email", email).lower()
                full_name = jwt_payload.get("name", full_name)
                req.avatar_url = jwt_payload.get("picture", req.avatar_url)
        except Exception:
            pass

    if not email or "@" not in email:
        raise HTTPException(status_code=400, detail="Tài khoản Google không hợp lệ / Invalid Google email")

    avatar = req.avatar_url or f"https://api.dicebear.com/7.x/initials/svg?seed={full_name or email}"
    user = db.query(UserAccount).filter(UserAccount.email == email).first()

    now_iso = datetime.utcnow().isoformat()
    if not user:
        user_id = f"user-google-{secrets.token_hex(5)}"
        google_accounts = [{
            "email": email,
            "name": full_name or email.split("@")[0],
            "avatar_url": avatar,
            "is_primary": True,
            "linked_at": now_iso
        }]
        user = UserAccount(
            id=user_id,
            email=email,
            full_name=full_name or email.split("@")[0],
            password_hash=None,
            auth_provider="google",
            avatar_url=avatar,
            role="AI Engineer",
            google_accounts_json=json.dumps(google_accounts)
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        user.last_login_at = datetime.utcnow()
        if "google" not in (user.auth_provider or ""):
            user.auth_provider = "local+google"
        try:
            accounts = json.loads(user.google_accounts_json or "[]")
        except Exception:
            accounts = []
        if not any(a.get("email", "").lower() == email for a in accounts):
            accounts.append({
                "email": email,
                "name": full_name or user.full_name,
                "avatar_url": avatar,
                "is_primary": len(accounts) == 0,
                "linked_at": now_iso
            })
            user.google_accounts_json = json.dumps(accounts)
        db.commit()
        db.refresh(user)

    _ensure_learner_profile(db, user.id)
    token = create_access_token(user.id, user.email)
    return AuthResponse(access_token=token, user=_to_user_schema(user))

@router.post("/google/link", response_model=UserProfileSchema)
def link_google_account(
    req: LinkGoogleAccountRequest,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    user = db.query(UserAccount).filter(UserAccount.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="Vui lòng đăng nhập trước khi liên kết tài khoản Google")

    g_email = req.email.strip().lower()
    if not g_email or "@" not in g_email:
        raise HTTPException(status_code=400, detail="Email Google không hợp lệ")

    try:
        accounts = json.loads(user.google_accounts_json or "[]")
    except Exception:
        accounts = []

    avatar = req.avatar_url or f"https://api.dicebear.com/7.x/initials/svg?seed={req.full_name or g_email}"
    if not any(a.get("email", "").lower() == g_email for a in accounts):
        accounts.append({
            "email": g_email,
            "name": req.full_name.strip() or g_email.split("@")[0],
            "avatar_url": avatar,
            "is_primary": len(accounts) == 0,
            "linked_at": datetime.utcnow().isoformat()
        })
        user.google_accounts_json = json.dumps(accounts)
        if "google" not in (user.auth_provider or ""):
            user.auth_provider = "local+google"
        db.commit()
        db.refresh(user)

    return _to_user_schema(user)

@router.post("/google/unlink", response_model=UserProfileSchema)
def unlink_google_account(
    payload: dict,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    user = db.query(UserAccount).filter(UserAccount.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="Vui lòng đăng nhập")

    target_email = (payload.get("email") or "").strip().lower()
    try:
        accounts = json.loads(user.google_accounts_json or "[]")
    except Exception:
        accounts = []

    accounts = [a for a in accounts if a.get("email", "").lower() != target_email]
    user.google_accounts_json = json.dumps(accounts)
    db.commit()
    db.refresh(user)
    return _to_user_schema(user)

@router.get("/me", response_model=UserProfileSchema)
def get_me(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    user = db.query(UserAccount).filter(UserAccount.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return _to_user_schema(user)
