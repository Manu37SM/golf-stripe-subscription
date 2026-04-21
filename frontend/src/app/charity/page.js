/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useEffect, useState } from "react";
import {
  getCharities,
  selectCharity,
  getMyCharity,
} from "@/services/charity.service";
import Navbar from "@/components/Navbar";

export default function CharityPage() {
  const [charities, setCharities] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [percentage, setPercentage] = useState(10);
  const [myCharity, setMyCharity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const fetchData = async () => {
    try {
      const list = await getCharities();
      setCharities(list);
      try {
        const mine = await getMyCharity();
        setMyCharity(mine);
        if (mine) {
          setSelectedId(mine.charity_id);
          setPercentage(mine.percentage);
        }
      } catch {}
    } catch (err) {
      setMsg({ type: "error", text: "Failed to load charities." });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedId) {
      setMsg({ type: "error", text: "Please select a charity." });
      return;
    }
    if (percentage < 10 || percentage > 100) {
      setMsg({ type: "error", text: "Percentage must be between 10 and 100." });
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      await selectCharity({
        charityId: selectedId,
        percentage: parseInt(percentage),
      });
      setMsg({ type: "success", text: "Charity selection saved!" });
      await fetchData();
    } catch (err) {
      setMsg({
        type: "error",
        text: err.response?.data?.error || "Failed to save selection.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Navbar />
      <div className="container section">
        <div style={{ marginBottom: 32 }}>
          <h1 className="page-title" style={{ fontSize: 32 }}>
            Choose Your Charity ❤️
          </h1>
          <p className="text-muted" style={{ marginTop: 6 }}>
            A minimum 10% of your subscription goes to your chosen charity. You
            can give more.
          </p>
        </div>

        <div className="grid-2" style={{ gap: 24, alignItems: "start" }}>
          {/* Selection form */}
          <div className="card">
            <h2
              className="section-title"
              style={{ fontSize: 17, marginBottom: 20 }}
            >
              {myCharity ? "Update Selection" : "Select a Charity"}
            </h2>

            {myCharity && (
              <div
                style={{
                  background: "var(--accent-dim2)",
                  border: "1px solid rgba(127,255,110,0.15)",
                  borderRadius: 8,
                  padding: 14,
                  marginBottom: 20,
                }}
              >
                <p
                  className="text-sm"
                  style={{
                    color: "var(--accent)",
                    marginBottom: 2,
                    fontWeight: 600,
                  }}
                >
                  Currently supporting
                </p>
                <p style={{ fontWeight: 700 }}>{myCharity.name}</p>
                <p className="text-sm text-muted">
                  {myCharity.percentage}% of your subscription
                </p>
              </div>
            )}

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
                <label className="label">Choose Charity</label>
                <select
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="input select"
                >
                  <option value="">— Select a charity —</option>
                  {charities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="label">
                  Contribution %{" "}
                  <span style={{ color: "var(--text3)" }}>(min 10%)</span>
                </label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  className="input"
                />
                <div style={{ marginTop: 8 }}>
                  <div className="progress">
                    <div
                      className="progress-fill"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted" style={{ marginTop: 6 }}>
                    {percentage}% to charity · {100 - percentage}% to prize pool
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Saving…" : "Save Selection"}
              </button>
            </form>
          </div>

          {/* Charity directory */}
          <div>
            <h2
              className="section-title"
              style={{ fontSize: 17, marginBottom: 16 }}
            >
              Charity Directory
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {charities.length === 0 ? (
                <div className="empty">
                  <p>No charities listed yet.</p>
                </div>
              ) : (
                charities.map((c) => (
                  <div
                    key={c.id}
                    className="card card-sm"
                    style={{
                      cursor: "pointer",
                      borderColor:
                        selectedId == c.id ? "var(--accent)" : "var(--border)",
                      background:
                        selectedId == c.id
                          ? "var(--accent-dim2)"
                          : "var(--card)",
                      transition: "all 0.15s",
                    }}
                    onClick={() => setSelectedId(c.id)}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 12,
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, marginBottom: 4 }}>
                          {c.name}
                        </div>
                        <p
                          className="text-sm text-muted"
                          style={{ lineHeight: 1.5 }}
                        >
                          {c.description}
                        </p>
                      </div>
                      {selectedId == c.id && (
                        <span className="badge badge-green">Selected</span>
                      )}
                      {c.is_featured && (
                        <span className="badge badge-yellow">Featured</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
