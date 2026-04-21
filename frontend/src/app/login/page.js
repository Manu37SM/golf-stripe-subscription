"use client";
import { useState } from "react";
import { loginUser } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await loginUser(form);
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card fade-in">
        <Link href="/" className="auth-logo">Golf<span style={{color:'var(--text)'}}>Gives</span></Link>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Sign in to your account to continue</p>

        {error && <div className="alert alert-error" style={{marginBottom:16}}>{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="label">Email address</label>
            <input name="email" type="email" placeholder="you@example.com" className="input" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="label">Password</label>
            <input name="password" type="password" placeholder="••••••••" className="input" onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{width:'100%', marginTop:4}} disabled={loading}>
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        <p className="auth-footer" style={{marginTop:24}}>
          Don't have an account? <Link href="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
