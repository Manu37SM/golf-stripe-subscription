"use client";
import { useEffect, useState } from "react";
import { getReports } from "@/services/admin.service";
import Link from "next/link";

export default function AdminReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReports().then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  const stats = data ? [
    { label: 'Total Users', value: data.totalUsers, icon: '👥', color: 'var(--blue)' },
    { label: 'Active Subscriptions', value: data.activeSubscriptions, icon: '✅', color: 'var(--accent)' },
    { label: 'Total Prize Pool', value: `€${data.totalPrizePool?.toFixed(2)||'0.00'}`, icon: '💰', color: 'var(--gold)' },
    { label: 'Charity Contributions', value: `€${data.charityContributions?.toFixed(2)||'0.00'}`, icon: '❤️', color: 'var(--coral)' },
    { label: 'Total Draws', value: data.totalDraws, icon: '🎯', color: 'var(--accent)' },
    { label: 'Total Winners', value: data.totalWinners, icon: '🏆', color: 'var(--gold)' },
    { label: 'Paid Out', value: data.paidWinners, icon: '💸', color: 'var(--accent)' },
  ] : [];

  return (
    <div style={{minHeight:'100vh'}}>
      <nav className="nav">
        <div className="nav-inner">
          <span className="nav-brand">Golf<span>Gives</span> <span style={{fontSize:11,color:'var(--text3)',fontWeight:400,marginLeft:4}}>Admin</span></span>
          <div className="nav-links"><Link href="/admin" className="nav-link">← Admin Home</Link></div>
        </div>
      </nav>
      <div className="container section">
        <h1 className="page-title" style={{fontSize:28,marginBottom:28}}>Reports & Analytics</h1>

        {loading ? (
          <div style={{textAlign:'center',padding:80}}><div className="spinner" /></div>
        ) : (
          <div className="grid-3" style={{gap:16}}>
            {stats.map(s => (
              <div key={s.label} className="card" style={{textAlign:'center'}}>
                <div style={{fontSize:32,marginBottom:8}}>{s.icon}</div>
                <div className="stat-value" style={{color:s.color,marginBottom:4}}>{s.value}</div>
                <div className="label">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
