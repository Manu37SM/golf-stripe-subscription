"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const adminLinks = [
  { href: '/admin', label: '📊 Overview', exact: true },
  { href: '/admin/users', label: '👥 Users' },
  { href: '/admin/charity', label: '❤️ Charities' },
  { href: '/admin/draws', label: '🎯 Draws' },
  { href: '/admin/winners', label: '🏆 Winners' },
  { href: '/admin/reports', label: '📈 Reports' },
];

export default function AdminLayout() {
  return (
    <div style={{minHeight:'100vh', background:'var(--bg)'}}>
      {/* Admin Nav */}
      <nav className="nav">
        <div className="nav-inner">
          <span className="nav-brand">Golf<span>Gives</span> <span style={{fontSize:11, color:'var(--text3)', fontWeight:400, marginLeft:4}}>Admin</span></span>
          <div className="nav-links">
            <Link href="/dashboard" className="nav-link">← Back to App</Link>
          </div>
        </div>
      </nav>

      <div className="container section">
        <div className="sidebar-layout">
          {/* Sidebar */}
          <aside className="sidebar card" style={{padding:12}}>
            {adminLinks.map(l => (
              <Link key={l.href} href={l.href} className="sidebar-link">
                {l.label}
              </Link>
            ))}
          </aside>

          {/* Overview */}
          <div>
            <h1 className="page-title" style={{fontSize:28, marginBottom:24}}>Admin Panel</h1>
            <div className="grid-2" style={{gap:16}}>
              {adminLinks.slice(1).map(l => (
                <Link key={l.href} href={l.href} className="card" style={{textDecoration:'none',display:'block',transition:'all 0.15s'}}>
                  <div style={{fontSize:32, marginBottom:8}}>{l.label.split(' ')[0]}</div>
                  <div style={{fontWeight:600}}>{l.label.split(' ').slice(1).join(' ')}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
