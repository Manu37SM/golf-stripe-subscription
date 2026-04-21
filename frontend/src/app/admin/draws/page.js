"use client";
import { useEffect, useState } from "react";
import { getDraws, createDraw, runDraw, simulateDraw, publishDraw } from "@/services/admin.service";
import Link from "next/link";

export default function AdminDraws() {
  const [draws, setDraws] = useState([]);
  const [month, setMonth] = useState(new Date().toISOString().slice(0,7));
  const [simulation, setSimulation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [msg, setMsg] = useState(null);

  const load = async () => {
    try { const data = await getDraws(); setDraws(data); }
    catch { setMsg({ type:'error', text:'Failed to load draws.' }); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!month) return;
    setMsg(null);
    try {
      await createDraw(month);
      setMsg({ type:'success', text:`Draw created for ${month}.` });
      await load();
    } catch (err) { setMsg({ type:'error', text: err.response?.data?.error || 'Failed.' }); }
  };

  const handleSimulate = async (id) => {
    setActionId(id); setSimulation(null); setMsg(null);
    try {
      const res = await simulateDraw(id);
      setSimulation(res);
    } catch (err) { setMsg({ type:'error', text: err.response?.data?.error || 'Simulation failed.' }); }
    finally { setActionId(null); }
  };

  const handleRun = async (id) => {
    if (!confirm("This will record winners. Run the draw?")) return;
    setActionId(id); setMsg(null);
    try {
      const res = await runDraw(id);
      setMsg({ type:'success', text:`Draw run! 5-match: ${res.winners?.winners5?.length||0}, 4-match: ${res.winners?.winners4?.length||0}, 3-match: ${res.winners?.winners3?.length||0}` });
      await load();
    } catch (err) { setMsg({ type:'error', text: err.response?.data?.error || 'Failed to run draw.' }); }
    finally { setActionId(null); }
  };

  const handlePublish = async (id) => {
    setActionId(id);
    try {
      await publishDraw(id);
      setMsg({ type:'success', text:'Draw published!' });
      await load();
    } catch (err) { setMsg({ type:'error', text: err.response?.data?.error || 'Failed.' }); }
    finally { setActionId(null); }
  };

  const statusColor = { pending:'badge-yellow', published:'badge-green' };

  return (
    <div style={{minHeight:'100vh'}}>
      <nav className="nav">
        <div className="nav-inner">
          <span className="nav-brand">Golf<span>Gives</span> <span style={{fontSize:11,color:'var(--text3)',fontWeight:400,marginLeft:4}}>Admin</span></span>
          <div className="nav-links"><Link href="/admin" className="nav-link">← Admin Home</Link></div>
        </div>
      </nav>
      <div className="container section">
        <h1 className="page-title" style={{fontSize:28,marginBottom:28}}>Draw Management</h1>

        {msg && <div className={`alert alert-${msg.type}`} style={{marginBottom:16}}>{msg.text}</div>}

        {/* Create Draw */}
        <div className="card" style={{marginBottom:24}}>
          <h2 className="section-title" style={{fontSize:17,marginBottom:16}}>Create New Draw</h2>
          <div style={{display:'flex',gap:12,alignItems:'flex-end',flexWrap:'wrap'}}>
            <div className="form-group" style={{flex:1,minWidth:200}}>
              <label className="label">Draw Month</label>
              <input type="month" className="input" value={month} onChange={e=>setMonth(e.target.value)} />
            </div>
            <button className="btn btn-primary" onClick={handleCreate}>Create Draw</button>
          </div>
        </div>

        {/* Simulation result */}
        {simulation && (
          <div className="card" style={{marginBottom:24,borderColor:'var(--blue)'}}>
            <h3 className="section-title" style={{fontSize:16,marginBottom:12}}>🔍 Simulation Preview</h3>
            <p className="text-sm text-muted" style={{marginBottom:12}}>Draw numbers: <strong style={{color:'var(--accent)'}}>{simulation.drawNumbers?.join(', ')}</strong></p>
            <div className="grid-3">
              {[['5-Match 🏆',simulation.preview5],['4-Match 🥈',simulation.preview4],['3-Match 🥉',simulation.preview3]].map(([label,names])=>(
                <div key={label}>
                  <div className="label" style={{marginBottom:8}}>{label}</div>
                  {names?.length ? names.map(n=><div key={n} style={{fontSize:14,color:'var(--text)',padding:'4px 0'}}>{n}</div>) : <div className="text-sm text-muted">No winners</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Draws list */}
        {loading ? (
          <div style={{textAlign:'center',padding:60}}><div className="spinner" /></div>
        ) : draws.length === 0 ? (
          <div className="empty"><div className="empty-icon">🎯</div><p>No draws created yet.</p></div>
        ) : (
          <div className="card" style={{padding:0,overflow:'hidden'}}>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Month</th><th>Numbers</th><th>Status</th><th>Created</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {draws.map(d=>(
                    <tr key={d.id}>
                      <td style={{fontWeight:600,color:'var(--text)'}}>{d.draw_month}</td>
                      <td style={{fontFamily:'monospace',color:'var(--accent)'}}>{d.numbers?.join(' · ')}</td>
                      <td><span className={`badge ${statusColor[d.status]||'badge-gray'}`}>{d.status}</span></td>
                      <td className="text-sm">{new Date(d.created_at).toLocaleDateString()}</td>
                      <td>
                        <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                          <button className="btn btn-outline btn-xs" onClick={()=>handleSimulate(d.id)} disabled={actionId===d.id}>
                            Simulate
                          </button>
                          {d.status !== 'published' && <>
                            <button className="btn btn-primary btn-xs" onClick={()=>handleRun(d.id)} disabled={actionId===d.id}>
                              Run Draw
                            </button>
                            <button className="btn btn-outline btn-xs" onClick={()=>handlePublish(d.id)} disabled={actionId===d.id}>
                              Publish
                            </button>
                          </>}
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
