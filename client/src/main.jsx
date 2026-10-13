import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import {
  ShieldCheck,
  ArrowUpRight,
  Activity,
  MessageSquareText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Link2,
  LockKeyhole,
  Menu,
  X
} from "lucide-react";
import "./styles.css";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

function Navbar({ page, setPage }) {
  const [open, setOpen] = useState(false);

  const go = (next) => {
    setPage(next);
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="nav">
      <button className="brand" onClick={() => go("home")}>
        <span className="brand-icon"><ShieldCheck size={20} /></span>
        <span>SmartSpam</span>
      </button>

      <nav className={open ? "nav-links mobile-open" : "nav-links"}>
        <button className={page === "home" ? "active" : ""} onClick={() => go("home")}>Home</button>
        <button className={page === "detector" ? "active" : ""} onClick={() => go("detector")}>Detector</button>
        <button className={page === "dashboard" ? "active" : ""} onClick={() => go("dashboard")}>Dashboard</button>
        <button className={page === "history" ? "active" : ""} onClick={() => go("history")}>History</button>
      </nav>

      <div className="nav-actions">
        <button className="ghost-btn" onClick={() => window.open("https://github.com/", "_blank")}>
          GitHub
        </button>
        <button className="primary-btn" onClick={() => go("detector")}>
          Try Detector <ArrowUpRight size={16} />
        </button>
      </div>

      <button className="menu-btn" onClick={() => setOpen(!open)}>
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
}

function Home({ setPage }) {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">MESSAGE INTELLIGENCE / 01</p>
          <h1>Know what you're reading. Before you trust it.</h1>
          <p className="hero-text">
            SmartSpam uses natural language processing and machine learning
            to classify suspicious SMS messages and make the result easy to understand.
          </p>

          <div className="hero-actions">
            <button className="primary-btn large" onClick={() => setPage("detector")}>
              Try Detector <ArrowUpRight size={18} />
            </button>
            <button className="ghost-btn large" onClick={() => document.getElementById("how").scrollIntoView({ behavior: "smooth" })}>
              How It Works
            </button>
          </div>

          <div className="hero-note">
            <span className="line" />
            <span>A research-led interface for exploring how message classification works.</span>
          </div>
        </div>

        <div className="preview-card">
          <div className="preview-head">
            <div><Activity size={17} /> ANALYSIS PREVIEW / SAMPLE DATA</div>
            <span>sample / 001</span>
          </div>

          <div className="sample-message">
            <div className="small-label"><MessageSquareText size={16} /> Incoming message</div>
            <p>Your account needs immediate verification. Confirm your details to avoid suspension.</p>
          </div>

          <div className="classification">
            <div>
              <span className="muted">Classification</span>
              <strong className="danger">Likely spam</strong>
            </div>
            <div className="status"><CheckCircle2 size={16} /> Complete</div>
          </div>

          <div className="risk-row">
            <span className="muted">Risk level</span>
            <span className="risk-badge high">High</span>
          </div>

          <Metric label="Model confidence" value="94%" progress={94} />
          <Metric label="Signal strength" value="88%" progress={88} />
          <Metric label="Sender trust" value="21%" progress={21} />

          <div className="signals">
            <div className="signal-title"><AlertTriangle size={16} /> Detected signals</div>
            <div className="chips">
              <span>Urgent language</span>
              <span>Sensitive request</span>
              <span>Suspicious link</span>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-strip" id="how">
        <Feature icon={<MessageSquareText />} title="NLP preprocessing" text="Clean and normalize text before classification." />
        <Feature icon={<Activity />} title="ML classification" text="TF-IDF features feed a balanced Logistic Regression model." />
        <Feature icon={<ShieldCheck />} title="Explainable result" text="See confidence, risk and useful text-based signals." />
      </section>
    </main>
  );
}

function Feature({ icon, title, text }) {
  return (
    <article className="feature">
      <div className="feature-icon">{icon}</div>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </article>
  );
}

function Metric({ label, value, progress }) {
  return (
    <div className="metric">
      <div><span className="muted">{label}</span><b>{value}</b></div>
      <div className="bar"><span style={{ width: `${progress}%` }} /></div>
    </div>
  );
}

function Detector({ result, setResult }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setError("");

    try {
      const { data } = await API.post("/predict", { message });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not connect to SmartSpam backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <div className="page-heading">
        <p className="eyebrow">DETECTOR / 02</p>
        <h1>Analyze a message before you trust it.</h1>
        <p>Paste an SMS below. Your trained TF-IDF + Logistic Regression model will classify it.</p>
      </div>

      <section className="detector-grid">
        <div className="input-card">
          <div className="card-top">
            <div><MessageSquareText size={18} /> Message</div>
            <span>SMS</span>
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Paste a message here..."
            rows={11}
          />

          <div className="input-footer">
            <span>{message.length} characters</span>
            <button className="primary-btn large" onClick={analyze} disabled={loading || !message.trim()}>
              {loading ? "Analyzing..." : "Analyze message"}
              {!loading && <ArrowUpRight size={18} />}
            </button>
          </div>

          {error && <div className="error-box"><XCircle size={17} /> {error}</div>}

          <div className="examples">
            <span>Try an example:</span>
            <button onClick={() => setMessage("Congratulations! You have won a free prize. Call now!")}>Spam</button>
            <button onClick={() => setMessage("Hey, are we meeting today?")}>Ham</button>
          </div>
        </div>

        <ResultCard result={result} />
      </section>
    </main>
  );
}

function ResultCard({ result }) {
  if (!result) {
    return (
      <div className="result-card empty">
        <div className="empty-icon"><Activity size={25} /></div>
        <h2>Analysis result</h2>
        <p>Your real model result will appear here after analysis.</p>
      </div>
    );
  }

  const spam = result.label === "spam";

  return (
    <div className="result-card">
      <div className="card-top">
        <div><Activity size={18} /> ANALYSIS RESULT</div>
        <span>LIVE</span>
      </div>

      <div className="result-status">
        <span className="muted">Classification</span>
        <h2 className={spam ? "danger" : "safe"}>
          {spam ? "Likely spam" : "Likely legitimate"}
        </h2>
      </div>

      <div className="result-row">
        <span className="muted">Risk level</span>
        <span className={`risk-badge ${result.risk.toLowerCase()}`}>{result.risk}</span>
      </div>

      <Metric label="Model confidence" value={`${result.confidence}%`} progress={result.confidence} />
      <Metric label="Spam probability" value={`${result.spam_probability}%`} progress={result.spam_probability} />

      <div className="signals">
        <div className="signal-title"><AlertTriangle size={16} /> Detected signals</div>
        <div className="chips">
          {result.signals.map((signal) => <span key={signal}>{signal}</span>)}
        </div>
      </div>

      <div className="model-note">
        <LockKeyhole size={15} />
        Prediction generated by the trained SmartSpam SMS model.
      </div>
    </div>
  );
}

function Dashboard({ result }) {
  return (
    <main className="page">
      <div className="page-heading">
        <p className="eyebrow">DASHBOARD / 03</p>
        <h1>Model activity at a glance.</h1>
        <p>A simple view of the current SmartSpam detector.</p>
      </div>

      <section className="stats-grid">
        <Stat icon={<ShieldCheck />} label="Final model" value="Logistic Regression" />
        <Stat icon={<Activity />} label="Validation accuracy" value="97.49%" />
        <Stat icon={<CheckCircle2 />} label="Spam recall" value="89%" />
        <Stat icon={<MessageSquareText />} label="TF-IDF features" value="8,038" />
      </section>

      <section className="dashboard-panel">
        <div>
          <p className="eyebrow">CURRENT PIPELINE</p>
          <h2>Message → Preprocessing → TF-IDF → ML → Risk</h2>
        </div>
        <div className="pipeline">
          {["Input", "Clean", "TF-IDF", "Classifier", "Result"].map((x, i) => (
            <div className="pipeline-item" key={x}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <b>{x}</b>
            </div>
          ))}
        </div>
        {result && (
          <div className="last-result">
            <span>Last prediction</span>
            <b className={result.label === "spam" ? "danger" : "safe"}>
              {result.label.toUpperCase()} — {result.confidence}%
            </b>
          </div>
        )}
      </section>
    </main>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function History() {
  const [items] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("smartspam_history") || "[]");
    } catch {
      return [];
    }
  });

  return (
    <main className="page">
      <div className="page-heading">
        <p className="eyebrow">HISTORY / 04</p>
        <h1>Your recent analyses.</h1>
        <p>Local history is kept in this browser for this starter version.</p>
      </div>

      {items.length === 0 ? (
        <div className="result-card empty">
          <div className="empty-icon"><MessageSquareText size={25} /></div>
          <h2>No analyses yet</h2>
          <p>Run a message through the detector and results can be stored here.</p>
        </div>
      ) : (
        <div className="history-list">
          {items.map((item, index) => (
            <div className="history-item" key={index}>
              <div>
                <b className={item.label === "spam" ? "danger" : "safe"}>
                  {item.label.toUpperCase()}
                </b>
                <p>{item.message}</p>
              </div>
              <span>{item.confidence}%</span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

function App() {
  const [page, setPage] = useState("home");
  const [result, setResult] = useState(null);

  React.useEffect(() => {
    if (result) {
      const current = JSON.parse(localStorage.getItem("smartspam_history") || "[]");
      const item = {
        message: result.cleaned_message,
        label: result.label,
        confidence: result.confidence
      };
      localStorage.setItem(
        "smartspam_history",
        JSON.stringify([item, ...current].slice(0, 20))
      );
    }
  }, [result]);

  return (
    <>
      <Navbar page={page} setPage={setPage} />
      {page === "home" && <Home setPage={setPage} />}
      {page === "detector" && <Detector result={result} setResult={setResult} />}
      {page === "dashboard" && <Dashboard result={result} />}
      {page === "history" && <History />}
      <footer>
        <span>SmartSpam</span>
        <span>NLP × Machine Learning × Explainability</span>
      </footer>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
