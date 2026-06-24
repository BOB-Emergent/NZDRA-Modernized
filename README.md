# NZDRA Modernized

New Zealand Drag Racing Association — modern web platform.

## Architecture

- **Frontend:** React 18 + Tailwind CSS + React Router + Framer Motion
- **Backend:** Python FastAPI + SQLite
- **AI:** Treena chatbot for rulebook Q&A

## Project Structure

```
├── src/                    # React frontend source
│   ├── components/         # Reusable UI components
│   ├── lib/               # Shared utilities (API client, auth, tenant context)
│   └── pages/             # Route-level page components
├── backend/               # FastAPI backend
│   ├── server.py          # Main API server
│   └── requirements.txt   # Python dependencies
├── public/                # Static assets (sponsor logos, index.html)
└── package.json           # Frontend dependencies
```

## Features

- **Multi-tenant architecture** — white-label portals for individual tracks
- **DragCentral** — cross-track hub surfacing every NZ drag strip
- **Results management** — race results with verification, lane swaps, reassignment
- **Calendar** — event scheduling per track
- **Rulebook** — searchable rule database with AI assistant (Treena)
- **News** — announcements and updates
- **Racer Dashboard** — member-specific view with license info
- **Admin Dashboard** — full CRUD for events, results, rules, news
- **Sponsor Wall** — logo tiles with links for all NZDRA sponsors

## Getting Started

### Frontend
```bash
npm install
npm start
```

### Backend
```bash
cd backend
pip install -r requirements.txt
python server.py
```

## Environment Variables

- `REACT_APP_BACKEND_URL` — Backend API base URL
- `JWT_SECRET` — Secret key for JWT token signing

## Deployment (Unraid)

This project is designed to be deployed as a Docker container on Unraid.
See the provided Dockerfile for containerization.
