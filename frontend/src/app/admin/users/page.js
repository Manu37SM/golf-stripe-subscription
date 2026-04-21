"use client";
import { useEffect, useState } from "react";
import { getUsers, updateUserRole } from "@/services/admin.service";
import Link from "next/link";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  const load = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch { setMsg({ type:'error', text:'Failed to load users.' }); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const toggleRole = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await updateUserRole(id, newRole);
      setMsg({ type:'success', text:`Role updated to ${newRole}.` });
      await load();
    } catch { setMsg({ type:'error', text:'Failed to update role.' }); }
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
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:28}}>
          <h1 className="page-title" style={{fontSize:28}}>Users</h1>
          <span className="badge badge-gray">{users.length} total</span>
        </div>

        {msg && <div className={`alert alert-${msg.type}`} style={{marginBottom:16}}>{msg.text}</div>}

        {loading ? (
          <div style={{textAlign:'center',padding:80}}><div className="spinner" /></div>
        ) : (
          <div className="card" style={{padding:0,overflow:'hidden'}}>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th><th>Email</th><th>Role</th><th>Subscription</th><th>Joined</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td style={{fontWeight:600,color:'var(--text)'}}>{u.name}</td>
                      <td>{u.email}</td>
                      <td><span className={`badge ${u.role==='admin'?'badge-yellow':'badge-gray'}`}>{u.role}</span></td>
                      <td><span className={`badge ${u.subscription_status==='active'?'badge-green':'badge-red'}`}>{u.subscription_status || 'none'}</span></td>
                      <td>{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</td>
                      <td>
                        <button className="btn btn-outline btn-xs" onClick={() => toggleRole(u.id, u.role)}>
                          {u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                        </button>
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
