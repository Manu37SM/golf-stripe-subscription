"use client";
import { useEffect, useState } from "react";
import {
  createSubscriptionSession,
  getSubscriptionStatus,
} from "@/services/subscription.service";
import API from "@/services/api";
import Navbar from "@/components/Navbar";

export default function SubscriptionPage() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchStatus = () =>
    getSubscriptionStatus().then(setStatus).catch(console.error);

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleSubscribe = async (plan) => {
    setError("");
    setLoading(plan);
    try {
      const res = await createSubscriptionSession(plan);
      window.location.href = res.url;
    } catch (err) {
      setError(
        err.response?.data?.error || "Something went wrong. Please try again.",
      );
      setLoading(null);
    }
  };

  const handleCancel = async () => {
    if (
      !confirm(
        "Are you sure you want to cancel your subscription? You'll lose access at the end of your billing period.",
      )
    )
      return;
    setCancelling(true);
    setError("");
    setSuccess("");
    try {
      await API.post("/subscription/cancel");
      setSuccess(
        "Your subscription has been cancelled. You'll retain access until the end of your current billing period.",
      );
      await fetchStatus();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to cancel subscription.");
    } finally {
      setCancelling(false);
    }
  };

  const isActive = status?.status === "active";
  const activePlan = status?.plan;

  const plans = [
    {
      id: "monthly",
      name: "Monthly",
      price: "€9.99",
      period: "/month",
      perks: [
        "Monthly prize draw entry",
        "Score tracking (5 scores)",
        "Charity contribution",
        "Cancel anytime",
      ],
    },
    {
      id: "yearly",
      name: "Yearly",
      price: "€89.99",
      period: "/year",
      perks: [
        "Everything in Monthly",
        "2 months free (save €30)",
        "Priority support",
        "Annual leaderboard",
      ],
      featured: true,
    },
  ];

  return (
    <div className="page">
      <Navbar />
      <div className="container section">
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 className="page-title" style={{ fontSize: 32, marginBottom: 10 }}>
            Subscription
          </h1>
          <p className="text-muted">
            Unlock score tracking, monthly draws and charity giving.
          </p>
        </div>

        {error && (
          <div
            className="alert alert-error"
            style={{ maxWidth: 640, margin: "0 auto 20px" }}
          >
            {error}
          </div>
        )}
        {success && (
          <div
            className="alert alert-success"
            style={{ maxWidth: 640, margin: "0 auto 20px" }}
          >
            {success}
          </div>
        )}

        {/* Active subscription banner */}
        {isActive && (
          <div
            style={{
              maxWidth: 640,
              margin: "0 auto 36px",
              background: "var(--accent-dim2)",
              border: "1px solid rgba(127,255,110,0.25)",
              borderRadius: 14,
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "var(--accent-dim)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                ✅
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>
                  Active —{" "}
                  <span
                    style={{
                      color: "var(--accent)",
                      textTransform: "capitalize",
                    }}
                  >
                    {activePlan}
                  </span>{" "}
                  Plan
                </div>
                <div className="text-sm text-muted">
                  Your subscription is active and renewing automatically.
                </div>
              </div>
            </div>
            <button
              className="btn btn-outline btn-sm"
              style={{
                borderColor: "var(--coral)",
                color: "var(--coral)",
                flexShrink: 0,
              }}
              onClick={handleCancel}
              disabled={cancelling}
            >
              {cancelling ? "Cancelling…" : "Cancel Subscription"}
            </button>
          </div>
        )}

        <div
          className="grid-2"
          style={{ maxWidth: 700, margin: "0 auto", gap: 20 }}
        >
          {plans.map((plan) => {
            const isCurrentPlan = isActive && activePlan === plan.id;

            return (
              <div
                key={plan.id}
                className="plan-card"
                style={{
                  // Highlight ONLY the active plan with green border; featured (yearly) only gets it when not active
                  borderColor: isCurrentPlan
                    ? "var(--accent)"
                    : plan.featured && !isActive
                      ? "var(--accent)"
                      : "var(--border)",
                  position: "relative",
                }}
              >
                {/* Active plan badge — replaces "Best Value" when this is the current plan */}
                {isCurrentPlan ? (
                  <div
                    className="badge badge-green"
                    style={{ marginBottom: 16 }}
                  >
                    ✓ Current Plan
                  </div>
                ) : plan.featured && !isActive ? (
                  <div
                    className="badge badge-green"
                    style={{ marginBottom: 16 }}
                  >
                    Best Value
                  </div>
                ) : (
                  <div style={{ height: 28, marginBottom: 16 }} /> // spacer to keep layout consistent
                )}

                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 22,
                    marginBottom: 8,
                  }}
                >
                  {plan.name}
                </h2>
                <div className="plan-price" style={{ marginBottom: 20 }}>
                  {plan.price}
                  <span>{plan.period}</span>
                </div>
                <ul
                  style={{
                    listStyle: "none",
                    marginBottom: 28,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {plan.perks.map((p) => (
                    <li
                      key={p}
                      style={{
                        display: "flex",
                        gap: 10,
                        fontSize: 14,
                        color: "var(--text2)",
                      }}
                    >
                      <span style={{ color: "var(--accent)", flexShrink: 0 }}>
                        ✓
                      </span>{" "}
                      {p}
                    </li>
                  ))}
                </ul>

                {isCurrentPlan ? (
                  // Active plan: show manage/cancel area instead of subscribe button
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    <div
                      style={{
                        background: "var(--accent-dim2)",
                        border: "1px solid rgba(127,255,110,0.2)",
                        borderRadius: 10,
                        padding: "10px 14px",
                        textAlign: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          color: "var(--accent)",
                          fontWeight: 600,
                        }}
                      >
                        Active
                      </span>
                      <span className="text-sm text-muted">
                        {" "}
                        · renews automatically
                      </span>
                    </div>
                    <button
                      className="btn btn-outline btn-sm"
                      style={{
                        width: "100%",
                        borderColor: "var(--coral)",
                        color: "var(--coral)",
                      }}
                      onClick={handleCancel}
                      disabled={cancelling}
                    >
                      {cancelling ? "Cancelling…" : "Cancel Plan"}
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn btn-primary"
                    style={{ width: "100%" }}
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={!!loading || isActive}
                  >
                    {loading === plan.id
                      ? "Redirecting…"
                      : isActive
                        ? "Switch Plan"
                        : `Subscribe ${plan.name}`}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: 28 }}>
          <p className="text-sm text-muted">
            Secure payment via Stripe · Cancel anytime · 10% minimum goes to
            your charity
          </p>
        </div>
      </div>
    </div>
  );
}
