# SmartSpam — AI-Based Email and SMS Spam Detection

SmartSpam is a full-stack AI-powered application designed to detect spam in emails and SMS/text messages. It combines machine learning with a web interface to help users identify potentially unwanted or suspicious messages.

## Features

- **SMS Spam Detection:** Classifies SMS messages as spam or ham (legitimate).
- **Email Spam Detection:** Uses a trained machine learning model to detect spam emails.
- **Machine Learning API:** Serves trained models through a Python FastAPI service.
- **Web Interface:** React-based frontend for interacting with the detection system.
- **Backend API:** Node.js and Express connect the frontend with backend functionality and the ML service.
- **Optional History Storage:** MongoDB can be used to store user and analysis history.

## Tech Stack

| Component | Technologies |
|---|---|
| Frontend | React, Vite, TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js |
| Machine Learning | Python, FastAPI, scikit-learn |
| NLP & Feature Extraction | TF-IDF, text preprocessing |
| ML Algorithm | Logistic Regression |
| Database | MongoDB, Mongoose |
| Authentication | JWT |
| Version Control | Git, GitHub |

## Project Structure

```text
smartSpam-aiml/
├── client/                 # React frontend
├── server/                 # Node.js and Express backend
├── ml-service/             # Python ML service
│   ├── app.py              # FastAPI application
│   ├── requirements.txt    # Python dependencies
│   ├── model/              # Trained model artifacts
│   │   ├── sms_spam_model.pkl
│   │   └── tfidf_vectorizer.pkl
│   └── ...
├── README.md
└── .gitignore
```

*Note: The exact files and folders may differ slightly depending on your current project structure.*

## Prerequisites

Install the following before running the project:

- [Git](https://git-scm.com/)
- [Node.js and npm](https://nodejs.org/)
- [Python 3.11](https://www.python.org/downloads/)
- MongoDB, if you want to use database-backed features

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ShreyaJanweja/smartSpam-aiml.git
cd smartSpam-aiml
```

### 2. Set Up the Frontend

Open a terminal in the project root and run:

```bash
cd client
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal. The default development URL is usually:

`http://localhost:5173`

### 3. Set Up the Backend

Open a **separate terminal**:

```bash
cd server
npm install
```

Configure the backend environment variables using the provided `.env.example` file, if available.

On Windows PowerShell, you can create a local environment file with:

```powershell
Copy-Item .env.example .env
```

Update `.env` with your actual configuration values. Never commit secrets, passwords, or JWT keys.

Start the backend using the script defined in your `server/package.json`. If the project has a `dev` script, run:

```bash
npm run dev
```

The backend is configured to use port `5000` in the current setup, unless your environment configuration specifies otherwise.

### 4. Set Up the Machine Learning Service

The ML service uses Python and FastAPI to load the trained spam detection model and expose it through an API.

Open a **third terminal** in the project root:

```bash
cd ml-service
```

#### Create a virtual environment

On Windows PowerShell:

```powershell
python -m venv .venv
```

Activate it:

```powershell
.\.venv\Scripts\Activate.ps1
```

If PowerShell blocks activation, you can use Command Prompt and run:

```bat
.venv\Scripts\activate.bat
```

#### Install Python dependencies

```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

Make sure `requirements.txt` contains the dependencies required by your application, including FastAPI, Uvicorn, scikit-learn and joblib, with compatible versions.

#### Verify the trained model files

Ensure the trained model artifacts are present in the location expected by `app.py`.

For example:

```text
ml-service/
├── app.py
├── requirements.txt
└── model/
    ├── sms_spam_model.pkl
    └── tfidf_vectorizer.pkl
```

The filenames and directory must match the paths used in your actual Python code. If the models are stored elsewhere, use their actual paths instead.

If the model files are not present, copy or generate them using your training workflow before starting the service.

#### Start the ML service

Run:

```bash
python -m uvicorn app:app --reload --port 8000
```

If startup is successful, the service should be available at:

`http://127.0.0.1:8000`

Verify the health endpoint in your browser:

`http://127.0.0.1:8000/health`

You can also open the FastAPI interactive documentation at:

`http://127.0.0.1:8000/docs`

The `/health` and `/docs` URLs should be used only if those endpoints are available in your application.

## Running the Complete Application

Run the three services in separate terminals:

| Service | Command | Default URL |
|---|---|---|
| Frontend | `npm run dev` from `client/` | `http://localhost:5173` |
| Backend | `npm run dev` from `server/` | `http://localhost:5000` |
| ML Service | `python -m uvicorn app:app --reload --port 8000` from `ml-service/` | `http://127.0.0.1:8000` |

Ensure the backend is configured with the correct ML service URL. The frontend should communicate with the backend, rather than loading Python model files directly.

## Application Workflow

```text
User
  ↓
React Frontend
  ↓
Node.js / Express Backend
  ↓
Python FastAPI ML Service
  ↓
Text Preprocessing
  ↓
TF-IDF Feature Extraction
  ↓
Trained Spam Classification Model
  ↓
Prediction Returned to Backend
  ↓
Result Displayed in Frontend
```

The exact request flow depends on the endpoints implemented in the current application.

## Machine Learning Approach

The SMS spam detection pipeline uses:

1. Text cleaning and preprocessing.
2. TF-IDF vectorization to convert text into numerical features.
3. Logistic Regression to classify messages.
4. A FastAPI service to load the trained model and serve predictions.

The trained model and vectorizer must be compatible with the preprocessing and feature extraction used during training.

## Configuration and Security

- Store environment-specific settings in local `.env` files.
- Keep `.env`, virtual environments, `node_modules`, and other generated files out of version control.
- Do not commit credentials, tokens, private keys, or personal data.
- Ensure that the model artifacts required for inference are available when deploying the ML service.


*SmartSpam — making digital communication safer through machine learning.*
