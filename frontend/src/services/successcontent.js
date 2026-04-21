"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import API from "@/services/api";

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("activating");

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("done");
      return;
    }

    const activate = async () => {
      try {
        await API.post("/subscription/activate-session", { sessionId });
        setStatus("done");
      } catch (err) {
        console.warn(
          "activate-session:",
          err.response?.data?.error || err.message,
        );
        setStatus("done");
      }
    };

    activate();
  }, [searchParams]);

  return (
    <div style={{ textAlign: "center", maxWidth: 480 }}>
      {status === "activating" ? (
        <>
          <div style={{ marginBottom: 24 }}>
            <div className="spinner" style={{ width: 40, height: 40 }} />
          </div>
          <h2>Activating your subscription…</h2>
          <p>Just a moment, please don’t close this page.</p>
        </>
      ) : (
        <>
          <div style={{ fontSize: 64 }}>🎉</div>
          <h1>Payment Successful!</h1>
          <Link href="/dashboard">Go to Dashboard →</Link>
        </>
      )}
    </div>
  );
}
