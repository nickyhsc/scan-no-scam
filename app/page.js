"use client";

import { useState } from "react";

const RISK_STYLES = {
  low: { label: "🟢 Low Risk", color: "#1a7f37", bg: "#e8f7ec" },
  suspicious: { label: "🟡 Suspicious", color: "#9a6700", bg: "#fff6e0" },
  high: { label: "🔴 High Risk", color: "#c22", bg: "#fdecec" },
  unsure: { label: "🟡 Unable to determine confidently", color: "#9a6700", bg: "#fff6e0" },
};

export default function Home() {
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [provider, setProvider] = useState(null);
  const [error, setError] = useState(null);

  async function handleAnalyze() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setResult(data.result);
      setProvider(data.provider);
    } catch (e) {
      setError("Could not reach the server. Is the dev server running?");
    } finally {
      setLoading(false);
    }
  }

  const risk = result ? RISK_STYLES[result.risk_level] || RISK_STYLES.unsure : null;

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontSize: 28, marginBottom: 4 }}>🛡️ SafeCheck</h1>
      <p style={{ color: "#555", marginTop: 0 }}>
        Not sure about a message? Check before you act.
      </p>

      <textarea
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        placeholder="Paste the suspicious message here..."
        rows={6}
        style={{
          width: "100%",
          padding: 12,
          fontSize: 15,
          borderRadius: 8,
          border: "1px solid #ccc",
          boxSizing: "border-box",
          resize: "vertical",
        }}
      />

      <button
        onClick={handleAnalyze}
        disabled={loading || !messageText.trim()}
        style={{
          marginTop: 12,
          padding: "10px 20px",
          fontSize: 15,
          borderRadius: 8,
          border: "none",
          background: loading ? "#999" : "#2b57d8",
          color: "white",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Analyzing..." : "Analyze Message"}
      </button>

      {error && (
        <p style={{ color: "#c22", marginTop: 16 }}>⚠️ {error}</p>
      )}

      {result && (
        <div style={{ marginTop: 32 }}>
          <div
            style={{
              display: "inline-block",
              padding: "8px 16px",
              borderRadius: 8,
              background: risk.bg,
              color: risk.color,
              fontWeight: 600,
              marginBottom: 20,
            }}
          >
            {risk.label}
          </div>
          {provider === "claude-fallback" && (
            <p style={{ fontSize: 12, color: "#888" }}>
              (Analyzed by fallback provider — Nemotron was unavailable)
            </p>
          )}

          <Section title="🚩 WHY?" subtitle="Why is this suspicious?">
            {result.signals && result.signals.length > 0 ? (
              result.signals.map((s, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 600 }}>{s.type.replace(/_/g, " ")}</div>
                  <div style={{ fontStyle: "italic", color: "#555" }}>
                    &ldquo;{s.evidence}&rdquo;
                  </div>
                  <div style={{ color: "#333" }}>{s.explanation}</div>
                </div>
              ))
            ) : (
              <p>No specific warning signs detected.</p>
            )}
          </Section>

          <Section title="🎯 WHAT?" subtitle="What is the sender trying to make you do?">
            <ul>
              {(result.intended_actions || []).map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </Section>

          <Section title="🛟 NOW WHAT?" subtitle="What should you do next?">
            <p><strong>{result.recommended_action?.primary}</strong></p>
            <p>{result.recommended_action?.alternative}</p>
          </Section>

          <ListenButton text={result.summary} />
        </div>
      )}
    </main>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <div style={{ marginBottom: 24, paddingTop: 16, borderTop: "1px solid #ddd" }}>
      <h2 style={{ fontSize: 18, marginBottom: 2 }}>{title}</h2>
      <p style={{ color: "#777", marginTop: 0, fontSize: 14 }}>{subtitle}</p>
      {children}
    </div>
  );
}

// Placeholder for the ElevenLabs "Listen to explanation" feature.
// Wire this up later - swap the button body for a real API call to
// ElevenLabs' text-to-speech endpoint using result.summary as the input.
function ListenButton({ text }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleListen() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Couldn't generate audio.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
      audio.onended = () => URL.revokeObjectURL(url);
    } catch (e) {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleListen}
        disabled={loading}
        style={{
          padding: "10px 20px",
          fontSize: 15,
          borderRadius: 8,
          border: "1px solid #2b57d8",
          background: "white",
          color: "#2b57d8",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Generating audio..." : "🔊 Listen to explanation"}
      </button>
      {error && <p style={{ color: "#c22", fontSize: 13 }}>⚠️ {error}</p>}
    </div>
  );
}
