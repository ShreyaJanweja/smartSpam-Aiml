import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", async (_req, res) => {
  try {
    const response = await fetch(`${ML_SERVICE_URL}/health`);
    const data = await response.json();

    res.json({
      backend: "ok",
      mlService: data,
    });
  } catch (error) {
    res.status(503).json({
      backend: "ok",
      mlService: "unavailable",
      error: error.message,
    });
  }
});

app.post("/api/predict", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Please enter a message."
      });
    }

    const response = await fetch(`${ML_SERVICE_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    // Basic explainability signals derived from the submitted text.
    const lower = message.toLowerCase();

    const signals = [];

    if (/(urgent|immediately|act now|limited time|verify now)/i.test(lower)) {
      signals.push("Urgent language");
    }

    if (/(bank|account|password|otp|pin|card|payment|details)/i.test(lower)) {
      signals.push("Requests sensitive information");
    }

    if (/(https?:\/\/|www\.|bit\.ly|tinyurl|t\.co)/i.test(lower)) {
      signals.push("Contains a link");
    }

    if (/(won|winner|prize|cash|free|congratulations|claim)/i.test(lower)) {
      signals.push("Prize or reward language");
    }

    if (signals.length === 0) {
      signals.push("No obvious high-risk phrase detected");
    }

    const risk =
      data.label === "spam"
        ? data.confidence >= 85 ? "High" : "Medium"
        : data.confidence >= 85 ? "Low" : "Medium";

    res.json({
      ...data,
      risk,
      signals
    });
  } catch (error) {
    res.status(500).json({
      message: "Prediction service is unavailable.",
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`SmartSpam backend running on http://localhost:${PORT}`);
});
