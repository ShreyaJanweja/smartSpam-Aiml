from pathlib import Path
import string
import joblib
import nltk

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer


# ==========================================
# PATHS
# ==========================================

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "model"

MODEL_PATH = MODEL_DIR / "sms_spam_model.pkl"
VECTORIZER_PATH = MODEL_DIR / "tfidf_vectorizer.pkl"


# ==========================================
# NLTK
# ==========================================

try:
    nltk.data.find("corpora/stopwords")
except LookupError:
    nltk.download("stopwords")


STOP_WORDS = set(stopwords.words("english"))
STEMMER = PorterStemmer()


# ==========================================
# LOAD MODEL
# ==========================================

model = None
tfidf = None


def load_model():

    global model
    global tfidf

    if not MODEL_PATH.exists():
        print("ERROR: sms_spam_model.pkl not found")
        return

    if not VECTORIZER_PATH.exists():
        print("ERROR: tfidf_vectorizer.pkl not found")
        return

    model = joblib.load(MODEL_PATH)
    tfidf = joblib.load(VECTORIZER_PATH)

    print("ML model loaded successfully")
    print("TF-IDF vectorizer loaded successfully")
    print("Number of features:", len(tfidf.vocabulary_))


load_model()


# ==========================================
# FASTAPI
# ==========================================

app = FastAPI(
    title="SmartSpam ML Service",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# ==========================================
# REQUEST FORMAT
# ==========================================

class MessageRequest(BaseModel):

    message: str = Field(
        min_length=1,
        max_length=10000
    )


# ==========================================
# TEXT PREPROCESSING
# ==========================================

def preprocess(text):

    # lowercase
    text = text.lower()

    # remove punctuation
    text = text.translate(
        str.maketrans(
            "",
            "",
            string.punctuation
        )
    )

    # remove stopwords
    text = " ".join(
        word
        for word in text.split()
        if word not in STOP_WORDS
    )

    # stemming
    text = " ".join(
        STEMMER.stem(word)
        for word in text.split()
    )

    return text


# ==========================================
# HEALTH CHECK
# ==========================================

@app.get("/health")
def health():

    return {
        "status": "ok",
        "model_loaded": model is not None,
        "vectorizer_loaded": tfidf is not None
    }


# ==========================================
# PREDICTION
# ==========================================

@app.post("/predict")
def predict(request: MessageRequest):

    if model is None or tfidf is None:

        raise HTTPException(
            status_code=503,
            detail="ML model or TF-IDF vectorizer not loaded."
        )

    original_message = request.message.strip()

    # preprocessing
    cleaned_message = preprocess(
        original_message
    )

    # convert text into TF-IDF features
    features = tfidf.transform(
        [cleaned_message]
    )

    # prediction
    prediction = int(
        model.predict(features)[0]
    )

    # probability
    probabilities = model.predict_proba(
        features
    )[0]

    ham_probability = float(
        probabilities[0]
    )

    spam_probability = float(
        probabilities[1]
    )

    # label
    if prediction == 1:

        label = "spam"
        confidence = spam_probability

    else:

        label = "ham"
        confidence = ham_probability


    # ==========================================
    # RISK
    # ==========================================

    if label == "spam":

        if confidence >= 0.85:
            risk = "High"

        elif confidence >= 0.60:
            risk = "Medium"

        else:
            risk = "Low"

    else:

        if confidence >= 0.85:
            risk = "Low"

        else:
            risk = "Medium"


    # ==========================================
    # SIMPLE EXPLANATION SIGNALS
    # ==========================================

    lower = original_message.lower()

    signals = []


    # urgent language
    urgent_words = [
        "urgent",
        "immediately",
        "act now",
        "verify now",
        "limited time",
        "hurry"
    ]

    if any(
        word in lower
        for word in urgent_words
    ):

        signals.append(
            "Urgent language detected"
        )


    # financial / sensitive information
    sensitive_words = [
        "bank",
        "account",
        "password",
        "otp",
        "pin",
        "card",
        "payment",
        "details"
    ]

    if any(
        word in lower
        for word in sensitive_words
    ):

        signals.append(
            "Requests sensitive information"
        )


    # links
    if (
        "http://" in lower
        or "https://" in lower
        or "www." in lower
        or "bit.ly" in lower
        or "tinyurl" in lower
    ):

        signals.append(
            "Contains a link"
        )


    # prize / reward
    reward_words = [
        "won",
        "winner",
        "prize",
        "cash",
        "free",
        "congratulations",
        "claim"
    ]

    if any(
        word in lower
        for word in reward_words
    ):

        signals.append(
            "Prize or reward language"
        )


    if len(signals) == 0:

        signals.append(
            "No obvious suspicious signal detected"
        )


    # ==========================================
    # RESPONSE
    # ==========================================

    return {

        "label": label,

        "confidence": round(
            confidence * 100,
            2
        ),

        "spam_probability": round(
            spam_probability * 100,
            2
        ),

        "ham_probability": round(
            ham_probability * 100,
            2
        ),

        "risk": risk,

        "signals": signals,

        "cleaned_message": cleaned_message
    }