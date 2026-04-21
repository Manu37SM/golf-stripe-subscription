"use client";
import { useState, useEffect } from "react";
import { createCharity, getCharities, deleteCharity } from "@/services/admin.service";
import Link from "next/link";

export default function AdminCharity() {
  const [charities, setCharities] = useState([]);
  const [form, setForm] = useState({ name:"", description:"", image_url:"", is_featured: false });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = async () => {
    const data = await getCharities();
    setCharities(data);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setMsg({ type:'error', text:'Name is required.' }); return; }
    setLoading(true); setMsg(null);
    try {
      await createCharity(form);
      setForm({ name:"", description:"", image_url:"", is_featured:false });
      setMsg({ type:'success', text:'Charity created!' });
      await load();
    } catch (err) {
      setMsg({ type:'error', text: err.response?.data?.error || 'Failed to create charity.' });
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this charity?")) return;
    try {
      await deleteCharity(id);
      setMsg({ type:'success', text:'Charity deleted.' });
      await load();
    } catch { setMsg({ type:'error', text:'Failed to delete.' }); }
  };

  return (
    <div style={{minHeight:'100vh'}}>
      <nav className="nav">
        <div className="nav-inner">
          <span className="nav-brand">Golf<span>Gives</span> <span style={{fontSize:11,color:'var(--text3)',fontWeight:400,marginLeft:4}}>Admin</span></span>
          <div className="nav-links"><Link href="/admin" className="nav-link">← Admin Home</Link></div>
        </div>
      </nav>
      <div className="container section">
        <h1 className="page-title" style={{fontSize:28, marginBottom:28}}>Manage Charities</h1>

        {msg && <div className={`alert alert-${msg.type}`} style={{marginBottom:16}}>{msg.text}</div>}

        <div className="grid-2" style={{gap:24,alignItems:'start'}}>
          {/* Create Form */}
          <div className="card">
            <h2 className="section-title" style={{fontSize:17,marginBottom:20}}>Add New Charity</h2>
            <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:14}}>
              <div className="form-group">
                <label className="label">Charity Name *</label>
                <input className="input" placeholder="e.g. Cancer Research UK" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="label">Description</label>
                <textarea className="input" rows={3} placeholder="Brief description…" style={{resize:'vertical'}} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
              </div>
              <div className="form-group">
                <label className="label">Image URL</label>
                <input className="input" placeholder="https://…" value={form.image_url} onChange={e=>setForm({...form,image_url:e.target.value})} />
              </div>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <input type="checkbox" id="featured" checked={form.is_featured} onChange={e=>setForm({...form,is_featured:e.target.checked})} style={{width:16,height:16,accentColor:'var(--accent)'}} />
                <label htmlFor="featured" style={{fontSize:14,color:'var(--text2)',cursor:'pointer'}}>Mark as featured charity</label>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Creating…" : "Create Charity"}
              </button>
            </form>
          </div>

          {/* List */}
          <div>
            <h2 className="section-title" style={{fontSize:17,marginBottom:16}}>
              All Charities <span className="badge badge-gray" style={{marginLeft:8}}>{charities.length}</span>
            </h2>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {charities.length === 0 ? (
                <div className="empty"><p>No charities yet.</p></div>
              ) : charities.map(c => (
                <div key={c.id} className="card card-sm" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12}}>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,marginBottom:2}}>{c.name}</div>
                    <div className="text-sm text-muted" style={{marginBottom:6}}>{c.description || 'No description'}</div>
                    <div style={{display:'flex',gap:6}}>
                      {c.is_featured && <span className="badge badge-yellow">Featured</span>}
                    </div>
                  </div>
                  <button className="btn btn-danger btn-xs" onClick={() => handleDelete(c.id)}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
