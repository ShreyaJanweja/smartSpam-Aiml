from pathlib import Path
import string
import joblib
import pandas as pd
import nltk

from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data" / "spam.csv"
MODEL_DIR = BASE_DIR / "model"
MODEL_DIR.mkdir(exist_ok=True)

nltk.download("stopwords")
STOP_WORDS = set(stopwords.words("english"))
STEMMER = PorterStemmer()


def preprocess(text):
    text = str(text).lower()
    text = text.translate(str.maketrans("", "", string.punctuation))
    text = " ".join(
        word for word in text.split()
        if word not in STOP_WORDS
    )
    return " ".join(STEMMER.stem(word) for word in text.split())


if not DATA_PATH.exists():
    raise FileNotFoundError(
        "Put the SMS Spam Collection spam.csv at ml-service/data/spam.csv"
    )

df = pd.read_csv(DATA_PATH, encoding="latin1")
df = df[["v1", "v2"]]
df.columns = ["label", "message"]
df = df.drop_duplicates()

df["message"] = df["message"].apply(preprocess)

X_text = df["message"]
y = df["label"].map({"ham": 0, "spam": 1})

vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(X_text)

# Same final model approach used in your Colab work.
model = LogisticRegression(
    max_iter=1000,
    class_weight="balanced"
)
model.fit(X, y)

joblib.dump(model, MODEL_DIR / "sms_spam_model.pkl")
joblib.dump(vectorizer, MODEL_DIR / "tfidf_vectorizer.pkl")

print("Training complete.")
print("Rows:", len(df))
print("Features:", X.shape[1])
print("Saved:", MODEL_DIR / "sms_spam_model.pkl")
print("Saved:", MODEL_DIR / "tfidf_vectorizer.pkl")
