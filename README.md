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
