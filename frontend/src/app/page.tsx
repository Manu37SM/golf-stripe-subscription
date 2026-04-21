import Link from "next/link";

export default function Home() {
  return (
    <div className="page">
      {/* NAV */}
      <nav className="nav">
        <div className="nav-inner">
          <a href="/" className="nav-brand">Golf<span>Gives</span></a>
          <div className="nav-links">
            <a href="/charity" className="nav-link">Charities</a>
            <a href="/login" className="nav-link">Log in</a>
            <a href="/signup" className="nav-btn">Get Started</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        padding: '100px 24px 80px',
        textAlign: 'center',
        background: 'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(127,255,110,0.1) 0%, transparent 65%)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(127,255,110,0.04) 1px, transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 760, margin: '0 auto' }}>
          <div className="badge badge-green" style={{ marginBottom: 20, display: 'inline-flex' }}>
            ⛳ Monthly Draw · Charity · Stableford
          </div>
          <h1 className="page-title" style={{ marginBottom: 20 }}>
            Play golf.<br />
            <span className="text-accent">Win prizes.</span><br />
            Change lives.
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text2)', marginBottom: 40, lineHeight: 1.7, maxWidth: 560, margin: '0 auto 40px' }}>
            Enter your Stableford scores, join monthly prize draws, and automatically donate to a charity you believe in — all in one place.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/signup" className="btn btn-primary" style={{ fontSize: 16, padding: '14px 32px' }}>
              Start Playing →
            </a>
            <a href="/charity" className="btn btn-outline" style={{ fontSize: 16, padding: '14px 32px' }}>
              View Charities
            </a>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p className="label" style={{ marginBottom: 8 }}>How it works</p>
            <h2 className="section-title" style={{ fontSize: 28 }}>Three steps to make a difference</h2>
          </div>
          <div className="grid-3">
            {[
              { num: '01', icon: '🏌️', title: 'Enter your scores', desc: 'Log up to 5 Stableford scores (1–45). One score per date. Your 5 most recent always count.' },
              { num: '02', icon: '🎯', title: 'Join the monthly draw', desc: 'Your scores are automatically matched against the monthly draw numbers. 3, 4, or 5-match wins.' },
              { num: '03', icon: '❤️', title: 'Give to charity', desc: 'A minimum 10% of your subscription goes straight to the charity you choose. Increase it anytime.' },
            ].map(s => (
              <div key={s.num} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', letterSpacing: 2, marginBottom: 16 }}>{s.num}</div>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{s.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRIZE POOLS */}
      <section className="section" style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <p className="label" style={{ marginBottom: 8 }}>Prize structure</p>
            <h2 className="section-title" style={{ fontSize: 28 }}>How prizes are distributed</h2>
          </div>
          <div className="grid-3">
            {[
              { match: '5-Number Match', share: '40%', rollover: true, icon: '🏆', color: 'var(--gold)' },
              { match: '4-Number Match', share: '35%', rollover: false, icon: '🥈', color: 'var(--blue)' },
              { match: '3-Number Match', share: '25%', rollover: false, icon: '🥉', color: 'var(--accent)' },
            ].map(p => (
              <div key={p.match} className="card" style={{ textAlign: 'center', borderColor: p.rollover ? 'var(--gold)' : 'var(--border)' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{p.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 800, color: p.color, letterSpacing: -2 }}>{p.share}</div>
                <div style={{ fontWeight: 600, marginBottom: 8, marginTop: 4 }}>{p.match}</div>
                <div style={{ fontSize: 12, color: 'var(--text3)' }}>of the prize pool</div>
                {p.rollover && (
                  <div className="badge badge-yellow" style={{ marginTop: 12 }}>Jackpot rolls over</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="page-title" style={{ fontSize: 36, marginBottom: 16 }}>
            Ready to play with <span className="text-accent">purpose</span>?
          </h2>
          <p style={{ color: 'var(--text2)', marginBottom: 32, fontSize: 16 }}>
            Join thousands of golfers making every round count.
          </p>
          <a href="/signup" className="btn btn-primary" style={{ fontSize: 16, padding: '16px 40px' }}>
            Subscribe Now →
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '28px 24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text3)', fontSize: 13 }}>
          © 2026 GolfGives · <a href="/charity" style={{ color: 'var(--text2)', textDecoration: 'none' }}>Charities</a> · <a href="/login" style={{ color: 'var(--text2)', textDecoration: 'none' }}>Login</a>
        </p>
      </footer>
    </div>
  );
}
