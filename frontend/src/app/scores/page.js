"use client";
import { useEffect, useState } from "react";
import {
  addScore,
  getScores,
  updateScore,
  deleteScore,
} from "@/services/score.service";
import Navbar from "@/components/Navbar";

export default function ScoresPage() {
  const [scores, setScores] = useState([]);
  const [form, setForm] = useState({ score: "", played_at: "" });
  const [editId, setEditId] = useState(null);
  const [editScore, setEditScore] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  // BUG FIX: fetchScores was defined inside useEffect making it inaccessible — moved to module scope
  const fetchScores = async () => {
    try {
      const data = await getScores();
      setScores(data);
    } catch (err) {
      setMsg({
        type: "error",
        text: err.response?.data?.error || "Failed to load scores",
      });
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchScores();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    const s = parseInt(form.score);
    if (s < 1 || s > 45) {
      setMsg({ type: "error", text: "Score must be between 1 and 45." });
      return;
    }
    if (!form.played_at) {
      setMsg({ type: "error", text: "Please select a date." });
      return;
    }
    setLoading(true);
    try {
      await addScore(form);
      setForm({ score: "", played_at: "" });
      setMsg({ type: "success", text: "Score added successfully!" });
      await fetchScores();
    } catch (err) {
      setMsg({
        type: "error",
        text: err.response?.data?.error || "Failed to add score",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this score?")) return;
    try {
      await deleteScore(id);
      setMsg({ type: "success", text: "Score deleted." });
      await fetchScores(); // BUG FIX: was calling fetchScores() which was out-of-scope
    } catch (err) {
      setMsg({
        type: "error",
        text: err.response?.data?.error || "Failed to delete score",
      });
    }
  };

  const handleEdit = async (id) => {
    const s = parseInt(editScore);
    if (s < 1 || s > 45) {
      setMsg({ type: "error", text: "Score must be between 1 and 45." });
      return;
    }
    try {
      await updateScore(id, s);
      setEditId(null);
      setEditScore("");
      setMsg({ type: "success", text: "Score updated." });
      await fetchScores();
    } catch (err) {
      setMsg({
        type: "error",
        text: err.response?.data?.error || "Failed to update score",
      });
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="page">
      <Navbar />
      <div className="container section">
        <div style={{ marginBottom: 32 }}>
          <h1 className="page-title" style={{ fontSize: 32 }}>
            Golf Scores
          </h1>
          <p className="text-muted" style={{ marginTop: 6 }}>
            Your last 5 Stableford scores. Adding a new one auto-removes the
            oldest.
          </p>
        </div>

        <div className="grid-2" style={{ gap: 24, alignItems: "start" }}>
          {/* Add score form */}
          <div className="card">
            <h2
              className="section-title"
              style={{ marginBottom: 20, fontSize: 17 }}
            >
              Add New Score
            </h2>

            {msg && (
              <div
                className={`alert alert-${msg.type}`}
                style={{ marginBottom: 16 }}
              >
                {msg.text}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              <div className="form-group">
                <label className="label">
                  Stableford Score{" "}
                  <span style={{ color: "var(--text3)" }}>(1 – 45)</span>
                </label>
                <input
                  name="score"
                  type="number"
                  min="1"
                  max="45"
                  placeholder="e.g. 36"
                  className="input"
                  value={form.score}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="label">Date Played</label>
                <input
                  name="played_at"
                  type="date"
                  max={today}
                  className="input"
                  value={form.played_at}
                  onChange={handleChange}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Adding…" : "Add Score"}
              </button>
            </form>

            <div
              style={{
                marginTop: 20,
                padding: 14,
                background: "var(--bg3)",
                borderRadius: 8,
              }}
            >
              <p className="text-xs text-muted">
                <strong style={{ color: "var(--text2)" }}>Rules:</strong> One
                score per date · Max 5 scores stored · New score auto-replaces
                oldest if at capacity
              </p>
            </div>
          </div>

          {/* Scores list */}
          <div className="card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h2 className="section-title" style={{ fontSize: 17 }}>
                Your Scores
              </h2>
              <span className="badge badge-gray">{scores.length} / 5</span>
            </div>

            {scores.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">⛳</div>
                <p>No scores added yet</p>
              </div>
            ) : (
              scores.map((s, i) => (
                <div
                  key={s.id}
                  className="score-card"
                  style={{
                    flexDirection: "column",
                    alignItems: "stretch",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 14 }}
                    >
                      <div className="score-num">{s.score}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>
                          Stableford
                        </div>
                        <div className="text-sm text-muted">
                          {new Date(s.played_at).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {i === 0 && (
                        <span className="badge badge-green">Latest</span>
                      )}
                      <button
                        className="btn btn-outline btn-xs"
                        onClick={() => {
                          setEditId(s.id);
                          setEditScore(s.score);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-xs"
                        onClick={() => handleDelete(s.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  {editId === s.id && (
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                        paddingTop: 8,
                        borderTop: "1px solid var(--border)",
                      }}
                    >
                      <input
                        type="number"
                        min="1"
                        max="45"
                        value={editScore}
                        onChange={(e) => setEditScore(e.target.value)}
                        className="input"
                        style={{ width: 100 }}
                      />
                      <button
                        className="btn btn-primary btn-xs"
                        onClick={() => handleEdit(s.id)}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-outline btn-xs"
                        onClick={() => setEditId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
