"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getDashboardData } from "@/services/dashboard.service";
import { getSubscriptionStatus } from "@/services/subscription.service";
import Navbar from "@/components/Navbar";

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState({ scores: [], charity: null, winnings: [] });
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    const u = localStorage.getItem("user");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (u) setUser(JSON.parse(u));

    const load = async () => {
      try {
        const [dashboard, sub] = await Promise.all([
          getDashboardData(),
          getSubscriptionStatus(),
        ]);
        setData(dashboard);
        setSubscription(sub);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalWon =
    data.winnings?.reduce(
      (acc, w) => acc + parseFloat(w.prize_amount || 0),
      0,
    ) || 0;
  const pendingWins =
    data.winnings?.filter((w) => w.status === "pending").length || 0;

  const subColor =
    subscription?.status === "active"
      ? "badge-green"
      : subscription?.status === "inactive"
        ? "badge-red"
        : "badge-yellow";

  return (
    <div className="page">
      <Navbar />
      <div className="container section">
        {loading ? (
          <div
            style={{ display: "flex", justifyContent: "center", padding: 80 }}
          >
            <div className="spinner" style={{ width: 40, height: 40 }} />
          </div>
        ) : (
          <div className="fade-in">
            {/* Header */}
            <div style={{ marginBottom: 32 }}>
              <p className="text-muted text-sm" style={{ marginBottom: 4 }}>
                Welcome back
              </p>
              <h1 className="page-title" style={{ fontSize: 32 }}>
                {user?.name || "Player"} 👋
              </h1>
            </div>

            {/* Stats row */}
            <div className="grid-4" style={{ marginBottom: 28 }}>
              {[
                {
                  label: "Subscription",
                  value: subscription?.plan || "None",
                  sub: subscription?.status || "inactive",
                  badge: subColor,
                },
                {
                  label: "Scores logged",
                  value: data.scores?.length || 0,
                  sub: "of 5 max",
                },
                {
                  label: "Total won",
                  value: `€${totalWon.toFixed(2)}`,
                  sub: `${pendingWins} pending`,
                },
                {
                  label: "Charity %",
                  value: data.charity ? `${data.charity.percentage}%` : "—",
                  sub: data.charity?.name || "Not selected",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="card"
                  style={{ textAlign: "center" }}
                >
                  <div className="label" style={{ marginBottom: 8 }}>
                    {s.label}
                  </div>
                  <div
                    className="stat-value"
                    style={{ fontSize: 24, marginBottom: 4 }}
                  >
                    {s.value}
                  </div>
                  {s.badge ? (
                    <span className={`badge ${s.badge}`}>{s.sub}</span>
                  ) : (
                    <div className="text-sm text-muted">{s.sub}</div>
                  )}
                </div>
              ))}
            </div>

            {/* Subscription alert */}
            {(!subscription || subscription.status !== "active") && (
              <div
                className="alert alert-error"
                style={{
                  marginBottom: 24,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>
                  ⚠️ You need an active subscription to enter scores and join
                  draws.
                </span>
                <Link href="/subscription" className="btn btn-primary btn-sm">
                  Subscribe Now
                </Link>
              </div>
            )}

            <div className="grid-2" style={{ gap: 24 }}>
              {/* Scores */}
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
                    Recent Scores
                  </h2>
                  <Link href="/scores" className="btn btn-outline btn-xs">
                    Manage →
                  </Link>
                </div>
                {data.scores?.length === 0 ? (
                  <div className="empty">
                    <div className="empty-icon">🏌️</div>
                    <p>No scores yet</p>
                    <Link
                      href="/scores"
                      className="btn btn-primary btn-sm"
                      style={{ marginTop: 12 }}
                    >
                      Add Score
                    </Link>
                  </div>
                ) : (
                  data.scores.map((s, i) => (
                    <div key={s.id} className="score-card">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 16,
                        }}
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
                      {i === 0 && (
                        <span className="badge badge-green">Latest</span>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Right column */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 24 }}
              >
                {/* Charity */}
                <div className="card">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 16,
                    }}
                  >
                    <h2 className="section-title" style={{ fontSize: 17 }}>
                      Your Charity
                    </h2>
                    <Link href="/charity" className="btn btn-outline btn-xs">
                      Change
                    </Link>
                  </div>
                  {data.charity ? (
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>
                        {data.charity.name}
                      </div>
                      <div
                        className="text-sm text-muted"
                        style={{ marginBottom: 12 }}
                      >
                        {data.charity.percentage}% of your subscription
                      </div>
                      <div className="progress">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${Math.min(data.charity.percentage, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="empty" style={{ padding: 24 }}>
                      <p className="text-muted text-sm">No charity selected</p>
                      <Link
                        href="/charity"
                        className="btn btn-primary btn-sm"
                        style={{ marginTop: 12 }}
                      >
                        Choose Charity
                      </Link>
                    </div>
                  )}
                </div>

                {/* Winnings */}
                <div className="card">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 16,
                    }}
                  >
                    <h2 className="section-title" style={{ fontSize: 17 }}>
                      Winnings
                    </h2>
                  </div>
                  {data.winnings?.length === 0 ? (
                    <div className="empty" style={{ padding: 24 }}>
                      <div className="empty-icon">🎯</div>
                      <p className="text-muted text-sm">
                        No winnings yet — keep playing!
                      </p>
                    </div>
                  ) : (
                    data.winnings.slice(0, 3).map((w) => (
                      <div
                        key={w.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "10px 0",
                          borderBottom: "1px solid var(--border)",
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>
                            €{parseFloat(w.prize_amount).toFixed(2)}
                          </div>
                          <div className="text-xs text-muted">
                            {w.match_count}-number match
                          </div>
                        </div>
                        <span
                          className={`badge ${w.status === "paid" ? "badge-green" : w.status === "pending" ? "badge-yellow" : "badge-gray"}`}
                        >
                          {w.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
