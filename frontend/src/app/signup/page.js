"use client";
import { useState } from "react";
import { registerUser } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false); return;
    }
    try {
      await registerUser(form);
      router.push("/login?registered=1");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card fade-in">
        <Link href="/" className="auth-logo">Golf<span style={{color:'var(--text)'}}>Gives</span></Link>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-sub">Start playing with purpose today</p>

        {error && <div className="alert alert-error" style={{marginBottom:16}}>{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="label">Full name</label>
            <input name="name" placeholder="John Smith" className="input" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="label">Email address</label>
            <input name="email" type="email" placeholder="you@example.com" className="input" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="label">Password</label>
            <input name="password" type="password" placeholder="Min. 6 characters" className="input" onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{width:'100%', marginTop:4}} disabled={loading}>
            {loading ? "Creating account…" : "Create Account →"}
          </button>
        </form>

        <div style={{background:'var(--accent-dim2)', border:'1px solid rgba(127,255,110,0.15)', borderRadius:8, padding:'12px 14px', marginTop:20}}>
          <p style={{fontSize:12, color:'var(--text2)', lineHeight:1.5}}>
            ⛳ After creating your account, subscribe to a plan to unlock score entry and monthly draws.
          </p>
        </div>

        <p className="auth-footer" style={{marginTop:20}}>
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
