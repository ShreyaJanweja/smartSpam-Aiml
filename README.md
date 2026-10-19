# SmartSpam

AI-Based Email and Text Spam Detection System.

Short overview, setup and development notes.

## Project Overview
SmartSpam is a full-stack application to detect spam in emails and SMS/text messages. The AI/ML model will be implemented later in Python using FastAPI and integrated with the Node.js backend.

## Tech Stack
- Frontend: React + TypeScript + Vite + TailwindCSS
- Backend: Node.js + Express
- ML Service: Python + FastAPI (future)
- Database: MongoDB + Mongoose

## Structure
SmartSpam/
- client/ - React frontend
- server/ - Node/Express backend
- ml-service/ - Future Python/FastAPI model
- docs/

## Local Setup (Frontend)
1. cd client
2. npm install
3. npm run dev

## Local Setup (Backend)
1. cd server
2. npm install
3. cp .env.example .env (fill values)
4. npm run dev

## Current Status
- Phase 1 foundation is complete: MongoDB connection, User and Analysis models,
  JWT authentication, protected history access, and client login/register flows.

### Authentication API
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (Bearer token required)
- `GET /api/history` (Bearer token required)

The frontend stores the session token in local storage and sends it as a Bearer
token through the shared Axios client. Dashboard and History are protected;
the About page remains in the source tree but is no longer routed or shown in
the navigation.

## Next Steps
- Connect the detector to `/api/analyze`
- Implement ML FastAPI service and connect
