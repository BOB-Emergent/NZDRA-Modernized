"""
NZDRA API Backend
FastAPI server providing the REST API for the NZDRA (New Zealand Drag Racing Association) website.
Reconstructed from frontend API contracts.
"""

from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date
import os
import json
from jose import jwt, JWTError
from passlib.context import CryptContext

# Configuration
SECRET_KEY = os.getenv("JWT_SECRET", "nzdra-dev-secret-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

app = FastAPI(title="NZDRA API", version="1.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ─── Pydantic Models ───────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: str
    password: str

class EventCreate(BaseModel):
    title: str
    date: str
    track: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None

class RuleCreate(BaseModel):
    title: str
    content: str
    category: Optional[str] = None
    order: Optional[int] = 0

class ChatMessage(BaseModel):
    session_id: str
    message: str

class ReassignForm(BaseModel):
    racer_name: Optional[str] = None
    car: Optional[str] = None

class SwapLanes(BaseModel):
    result_id_a: int
    result_id_b: int
    note: Optional[str] = None


# ─── In-memory data store (scaffolding) ──────────────────────────────────────

events_db = []
results_db = []
rules_db = []
news_db = []
tracks_db = []
tenants_db = []
racers_db = []
users_db = []


# ─── Auth helpers ──────────────────────────────────────────────────────────────

def create_access_token(data: dict):
    encoded = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
    return encoded

# ─── API Routes ────────────────────────────────────────────────────────────────

@app.get("/api/")
def api_root():
    return {"status": "online", "version": "1.0"}

# Events
@app.get("/api/events")
def get_events(track: Optional[str] = None, from_date: Optional[str] = None):
    return events_db

# Results
@app.get("/api/results")
def get_results(track: Optional[str] = None, from_date: Optional[str] = None, limit: int = 100):
    return results_db

# Rules
@app.get("/api/rules")
def get_rules(q: Optional[str] = None):
    return rules_db

# News
@app.get("/api/news")
def get_news(limit: Optional[int] = None):
    return news_db

# Tracks
@app.get("/api/tracks")
def get_tracks():
    return tracks_db

# Tenants
@app.get("/api/tenants")
def get_tenants():
    return tenants_db

@app.get("/api/tenants/{slug}")
def get_tenant(slug: str):
    for t in tenants_db:
        if t.get("slug") == slug:
            return t
    raise HTTPException(status_code=404, detail="Tenant not found")

# Racers
@app.get("/api/racers/{member_number}")
def get_racer(member_number: str):
    for r in racers_db:
        if r.get("member_number") == member_number:
            return r
    raise HTTPException(status_code=404, detail="Racer not found")

# Admin
@app.get("/api/admin/stats")
def get_admin_stats():
    return {
        "total_events": len(events_db),
        "total_results": len(results_db),
        "total_racers": len(racers_db),
        "total_tracks": len(tracks_db),
    }

# Treena AI Chatbot
@app.post("/api/chat/rulebook")
def chat_rulebook(msg: ChatMessage):
    return {
        "response": "I'm Treena, the NZDRA AI assistant. I'm currently running in standby mode while the rulebook database is being initialized.",
        "session_id": msg.session_id,
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
