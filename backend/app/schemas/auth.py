from typing import Optional
from pydantic import BaseModel

class GoogleAccountItem(BaseModel):
    email: str
    name: str
    avatar_url: Optional[str] = None
    is_primary: bool = False
    linked_at: str

class RegisterRequest(BaseModel):
    email: str
    full_name: str
    password: str
    role: Optional[str] = "AI Learner"

class LoginRequest(BaseModel):
    email: str
    password: str

class GoogleAuthRequest(BaseModel):
    email: str
    full_name: str
    avatar_url: Optional[str] = None
    google_credential: Optional[str] = None

class LinkGoogleAccountRequest(BaseModel):
    email: str
    full_name: str
    avatar_url: Optional[str] = None

class UserProfileSchema(BaseModel):
    id: str
    email: str
    full_name: str
    avatar_url: Optional[str] = None
    role: str
    auth_provider: str
    connected_google_accounts: list[GoogleAccountItem] = []
    created_at: str

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfileSchema
