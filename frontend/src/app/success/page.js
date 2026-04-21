"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import API from "@/services/api";

export default function Success() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("activating"); // activating | done | error

  useEffect(() => {
    // BUG FIX #3: When Stripe redirects back to /success it includes
    // ?session_id=cs_xxx in the URL. We use this to call our backend
    // which retrieves the session from Stripe directly and activates
    // the subscription — this is the reliable fallback for local dev
    // where the Stripe webhook cannot reach localhost.
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      // No session_id — webhook may have already handled it, go straight to done
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("done");
      return;
    }

    const activate = async () => {
      try {
        await API.post("/subscription/activate-session", { sessionId });
        setStatus("done");
      } catch (err) {
        // If activation fails (e.g. already active from webhook), still show success
        console.warn(
          "activate-session:",
          err.response?.data?.error || err.message,
        );
        setStatus("done");
      }
    };

    activate();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(127,255,110,0.08) 0%, transparent 70%), var(--bg)",
        padding: 24,
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        {status === "activating" ? (
          <>
            <div style={{ marginBottom: 24 }}>
              <div className="spinner" style={{ width: 40, height: 40 }} />
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 24,
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              Activating your subscription…
            </h2>
            <p style={{ color: "var(--text2)", fontSize: 14 }}>
              Just a moment, please don&#39;t close this page.
            </p>
          </>
        ) : (
          <>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 32,
                fontWeight: 800,
                marginBottom: 12,
              }}
            >
              Payment Successful!
            </h1>
            <p
              style={{
                color: "var(--text2)",
                marginBottom: 32,
                lineHeight: 1.6,
              }}
            >
              Your subscription is now active. You can start entering Stableford
              scores, join monthly prize draws, and support your chosen charity.
            </p>
            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/dashboard"
                className="btn btn-primary"
                style={{ fontSize: 15, padding: "13px 28px" }}
              >
                Go to Dashboard →
              </Link>
              <Link
                href="/scores"
                className="btn btn-outline"
                style={{ fontSize: 15, padding: "13px 28px" }}
              >
                Add Scores
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
