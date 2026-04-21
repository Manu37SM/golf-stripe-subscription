"use client";
import { useEffect, useState } from "react";
import { getWinners, updateWinner } from "@/services/admin.service";
import Link from "next/link";

export default function AdminWinners() {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  // BUG FIX: load() was called inside markPaid() but defined inside useEffect (out of scope). 
  // Now defined at module level so it can be called from any handler.
  const load = async () => {
    try {
      const data = await getWinners();
      setWinners(data);
    } catch { setMsg({ type:'error', text:'Failed to load winners.' }); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await updateWinner(id, status);
      setMsg({ type:'success', text:`Status updated to "${status}".` });
      await load(); // BUG FIX: now accessible
    } catch { setMsg({ type:'error', text:'Failed to update status.' }); }
  };

  const statusColor = { pending:'badge-yellow', approved:'badge-blue', paid:'badge-green', rejected:'badge-red' };

  return (
    <div style={{minHeight:'100vh'}}>
      <nav className="nav">
        <div className="nav-inner">
          <span className="nav-brand">Golf<span>Gives</span> <span style={{fontSize:11,color:'var(--text3)',fontWeight:400,marginLeft:4}}>Admin</span></span>
          <div className="nav-links"><Link href="/admin" className="nav-link">← Admin Home</Link></div>
        </div>
      </nav>
      <div className="container section">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:28}}>
          <h1 className="page-title" style={{fontSize:28}}>Winners</h1>
          <span className="badge badge-gray">{winners.length} total</span>
        </div>

        {msg && <div className={`alert alert-${msg.type}`} style={{marginBottom:16}}>{msg.text}</div>}

        {loading ? (
          <div style={{textAlign:'center',padding:80}}><div className="spinner" /></div>
        ) : winners.length === 0 ? (
          <div className="empty"><div className="empty-icon">🏆</div><p>No winners yet.</p></div>
        ) : (
          <div className="card" style={{padding:0,overflow:'hidden'}}>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Winner</th><th>Email</th><th>Draw Month</th><th>Match</th><th>Prize</th><th>Status</th><th>Proof</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {winners.map(w => (
                    <tr key={w.id}>
                      <td style={{fontWeight:600,color:'var(--text)'}}>{w.user_name}</td>
                      <td>{w.email}</td>
                      <td>{w.draw_month}</td>
                      <td><span className="badge badge-blue">{w.match_count}-match</span></td>
                      <td style={{color:'var(--accent)',fontWeight:600}}>€{parseFloat(w.prize_amount).toFixed(2)}</td>
                      <td><span className={`badge ${statusColor[w.status]||'badge-gray'}`}>{w.status}</span></td>
                      <td>
                        {w.proof_url
                          ? <a href={`https://golf-stripe-subscription.onrender.com/${w.proof_url}`} target="_blank" rel="noreferrer" style={{color:'var(--blue)',fontSize:12}}>View</a>
                          : <span className="text-xs text-muted">None</span>
                        }
                      </td>
                      <td>
                        <div style={{display:'flex',gap:4',flexWrap:'wrap',gap:4}}>
                          {w.status === 'pending' && <>
                            <button className="btn btn-primary btn-xs" onClick={() => updateStatus(w.id,'approved')}>Approve</button>
                            <button className="btn btn-danger btn-xs" onClick={() => updateStatus(w.id,'rejected')}>Reject</button>
                          </>}
                          {w.status === 'approved' && (
                            <button className="btn btn-primary btn-xs" onClick={() => updateStatus(w.id,'paid')}>Mark Paid</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
