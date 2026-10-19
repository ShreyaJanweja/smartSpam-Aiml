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

# SmartSpam — Full Stack AI Spam Detector

A working local full-stack starter for SmartSpam:

React + Vite frontend
Node.js + Express backend
Python + FastAPI ML service
TF-IDF + Logistic Regression SMS spam model
Optional MongoDB history storage

## 1. Project structure

SmartSpam/
  client/       React UI
  server/       Node/Express API
  ml-service/   Python ML API + model/training script

## 2. ML model

The ML service expects these files inside `ml-service/model/`:

- sms_spam_model.pkl
- tfidf_vectorizer.pkl

These are the files you already trained in Colab.

If you don't have the files on this computer, upload/copy them into that folder.

You can also train locally with `ml-service/train_model.py` after putting `spam.csv` in `ml-service/data/`.

## 3. Start ML service

Open terminal 1:

cd ml-service
python -m venv .venv

Windows:
.venv\Scripts\activate

pip install -r requirements.txt
python -m uvicorn app:app --reload --port 8000

Test:
http://localhost:8000/health

## 4. Start Node backend

Open terminal 2:

cd server
npm install
npm run dev

Backend:
http://localhost:5000

## 5. Start React frontend

Open terminal 3:

cd client
npm install
npm run dev

Frontend:
http://localhost:5173

## Important

The Node backend calls the Python ML service. React never loads the .pkl files directly.

Flow:

React -> Express -> FastAPI -> TF-IDF + Logistic Regression -> Express -> React
