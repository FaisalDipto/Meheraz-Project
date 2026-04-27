import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import logoImg from '../assets/logo1.png';
import titleImg from '../assets/title.png';
import './AdminPanel.css';

// ── Helpers ──────────────────────────────────────────────
const fmt = (n) => (n ?? 0).toLocaleString();
const initials = (str) => (str || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

function StatCard({ label, value, icon, color }) {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-card-label">
        <span className="material-symbols-outlined stat-icon">{icon}</span>
        {label}
      </div>
      <div className={`admin-stat-card-value ${color || ''}`}>{fmt(value)}</div>
    </div>
  );
}

function LoadingState() {
  return <div className="admin-loading"><div className="admin-spinner" /><span>Loading…</span></div>;
}

function EmptyState({ icon = 'inbox', text = 'No data found' }) {
  return <div className="admin-empty"><span className="material-symbols-outlined">{icon}</span>{text}</div>;
}

function Badge({ type }) {
  const map = {
    active: ['badge-green', 'check_circle'],
    suspended: ['badge-red', 'block'],
    inactive: ['badge-slate', 'radio_button_unchecked'],
    paid: ['badge-green', 'check_circle'],
    failed: ['badge-red', 'cancel'],
  };
  const [cls, icon] = map[type?.toLowerCase()] || ['badge-slate', 'help'];
  return <span className={`badge ${cls}`}><span className="material-symbols-outlined" style={{fontSize:11}}>{icon}</span>{type}</span>;
}

// ── Dashboard Section ──────────────────────────────────
function DashboardSection() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.adminDashboard().then(r => setStats(r?.data || r)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;
  if (!stats) return <EmptyState text="Could not load dashboard stats." />;

  const cards = [
    { label: 'Total Users', value: stats.total_users, icon: 'group', color: '' },
    { label: 'Active Users', value: stats.active_users, icon: 'person_check', color: 'green' },
    { label: 'Suspended', value: stats.suspended_users, icon: 'person_off', color: 'red' },
    { label: 'Subscriptions', value: stats.total_subscriptions, icon: 'subscriptions', color: 'blue' },
    { label: 'Active Subs', value: stats.active_subscriptions, icon: 'verified', color: 'green' },
    { label: 'AI Agents', value: stats.total_agents, icon: 'smart_toy', color: '' },
    { label: 'Pages', value: stats.total_pages, icon: 'pages', color: '' },
    { label: 'Conversations', value: stats.total_conversations, icon: 'chat', color: 'blue' },
    { label: 'Messages', value: stats.total_messages, icon: 'message', color: '' },
    { label: 'Feedbacks', value: stats.total_feedbacks, icon: 'feedback', color: 'amber' },
    { label: 'Leads', value: stats.total_leads, icon: 'contacts', color: '' },
    { label: 'Tokens Used', value: stats.total_tokens_used, icon: 'data_usage', color: '' },
  ];

  return (
    <div>
      <div className="admin-section-header">
        <div className="admin-section-label">Overview</div>
        <div className="admin-section-title">Dashboard</div>
      </div>
      <div className="admin-stats-grid">
        {cards.map(c => <StatCard key={c.label} {...c} />)}
      </div>
      {stats.total_revenue !== undefined && (
        <div className="admin-card" style={{padding:'24px 28px'}}>
          <div className="admin-stat-card-label"><span className="material-symbols-outlined stat-icon">payments</span>Total Revenue</div>
          <div className="admin-stat-card-value green" style={{fontSize:36}}>${fmt(stats.total_revenue)}</div>
        </div>
      )}
    </div>
  );
}

// ── Users Section ──────────────────────────────────────
function UsersSection() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [cursor, setCursor] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const load = useCallback((cur = null) => {
    setLoading(true);
    apiService.adminUsers({ search, status: statusFilter, cursor: cur, page_size: 20 })
      .then(r => {
        const data = r?.data || r;
        setUsers(Array.isArray(data) ? data : (data?.users || data?.items || []));
        setNextCursor(r?.next_cursor || r?.cursor || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, statusFilter]);

  useEffect(() => { setCursor(null); load(null); }, [search, statusFilter]);

  const toggleStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    setTogglingId(user.user_id || user.id);
    try {
      await apiService.adminChangeUserStatus(user.user_id || user.id, newStatus);
      setUsers(prev => prev.map(u => (u.user_id || u.id) === (user.user_id || user.id) ? { ...u, status: newStatus } : u));
    } catch (e) { alert('Failed: ' + e.message); }
    finally { setTogglingId(null); }
  };

  return (
    <div>
      <div className="admin-section-header">
        <div className="admin-section-label">Management</div>
        <div className="admin-section-title">Users</div>
      </div>
      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">All Users</span>
          <div className="admin-filter-row">
            <div className="admin-search-bar">
              <span className="material-symbols-outlined">search</span>
              <input placeholder="Search users…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="admin-filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
        {loading ? <LoadingState /> : users.length === 0 ? <EmptyState icon="group" text="No users found." /> : (
          <table className="admin-table">
            <thead><tr>
              <th>User</th><th>Email</th><th>Plan</th><th>Status</th><th>Joined</th><th>Action</th>
            </tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.user_id || u.id}>
                  <td><div style={{display:'flex',alignItems:'center',gap:10}}>
                    <div className="admin-avatar">{initials(u.name || u.email)}</div>
                    <span className="font-bold">{u.name || '—'}</span>
                  </div></td>
                  <td>{u.email}</td>
                  <td><span className="badge badge-blue">{u.plan || u.subscription?.plan || 'Free'}</span></td>
                  <td><Badge type={u.status} /></td>
                  <td className="text-muted">{fmtDate(u.created_at)}</td>
                  <td>
                    <button
                      className={`btn-action ${u.status === 'active' ? 'btn-action-danger' : 'btn-action-success'}`}
                      onClick={() => toggleStatus(u)}
                      disabled={togglingId === (u.user_id || u.id)}
                    >
                      <span className="material-symbols-outlined" style={{fontSize:13}}>{u.status === 'active' ? 'block' : 'check_circle'}</span>
                      {togglingId === (u.user_id || u.id) ? '…' : u.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="admin-pagination">
          <button disabled={!cursor} onClick={() => { setCursor(null); load(null); }}>← First</button>
          <button disabled={!nextCursor} onClick={() => { setCursor(nextCursor); load(nextCursor); }}>Next →</button>
        </div>
      </div>
    </div>
  );
}

// ── Generic List Section ───────────────────────────────
function GenericListSection({ title, label, icon, fetcher, columns }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState(null);
  const [cursor, setCursor] = useState(null);

  const load = useCallback((cur = null) => {
    setLoading(true);
    fetcher({ cursor: cur, page_size: 20 })
      .then(r => {
        const data = r?.data || r;
        setItems(Array.isArray(data) ? data : (data?.items || data?.results || []));
        setNextCursor(r?.next_cursor || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [fetcher]);

  useEffect(() => { load(null); }, [load]);

  return (
    <div>
      <div className="admin-section-header">
        <div className="admin-section-label">{label}</div>
        <div className="admin-section-title">{title}</div>
      </div>
      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">{title}</span>
        </div>
        {loading ? <LoadingState /> : items.length === 0 ? <EmptyState icon={icon} text={`No ${title.toLowerCase()} found.`} /> : (
          <table className="admin-table">
            <thead><tr>{columns.map(c => <th key={c.key}>{c.label}</th>)}</tr></thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item.id || item.agent_id || item.page_id || item.conversation_id || i}>
                  {columns.map(c => <td key={c.key}>{c.render ? c.render(item) : (item[c.key] ?? '—')}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="admin-pagination">
          <button disabled={!cursor} onClick={() => { setCursor(null); load(null); }}>← First</button>
          <button disabled={!nextCursor} onClick={() => { setCursor(nextCursor); load(nextCursor); }}>Next →</button>
        </div>
      </div>
    </div>
  );
}

// ── Revenue Section ────────────────────────────────────
function RevenueSection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.adminRevenue().then(r => setData(r?.data || r)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;
  if (!data) return <EmptyState text="Could not load revenue data." />;

  const plans = data.plan_distribution || data.plans || [];
  const total = plans.reduce((s, p) => s + (p.count || 0), 0) || 1;

  return (
    <div>
      <div className="admin-section-header">
        <div className="admin-section-label">Financials</div>
        <div className="admin-section-title">Revenue</div>
      </div>
      <div className="admin-stats-grid" style={{gridTemplateColumns:'repeat(3,1fr)',marginBottom:24}}>
        {data.total_revenue !== undefined && <StatCard label="Total Revenue" value={`$${fmt(data.total_revenue)}`} icon="payments" color="green" />}
        {data.mrr !== undefined && <StatCard label="Monthly Recurring" value={`$${fmt(data.mrr)}`} icon="repeat" color="blue" />}
        {data.active_subscriptions !== undefined && <StatCard label="Active Subscriptions" value={data.active_subscriptions} icon="verified" color="" />}
      </div>
      {plans.length > 0 && (
        <div className="admin-card" style={{padding:'24px 28px'}}>
          <div className="admin-card-title" style={{marginBottom:16}}>Plan Distribution</div>
          <div className="plan-distribution">
            {plans.map((p, i) => (
              <div className="plan-card" key={i}>
                <div className="plan-card-name">{p.plan_name || p.plan || p.name}</div>
                <div className="plan-card-count">{fmt(p.count || p.subscribers || 0)}</div>
                <div className="plan-card-bar-bg">
                  <div className="plan-card-bar-fill" style={{width:`${Math.round(((p.count||0)/total)*100)}%`}} />
                </div>
                <div className="text-muted">{Math.round(((p.count||0)/total)*100)}% of total</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Activity Section ───────────────────────────────────
function ActivitySection() {
  const [stats, setStats] = useState(null);
  const [daily, setDaily] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().slice(0, 10);
  const monthAgo = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10);
  const [start, setStart] = useState(monthAgo);
  const [end, setEnd] = useState(today);

  const load = () => {
    setLoading(true);
    Promise.all([
      apiService.adminActivityStats(start, end),
      apiService.adminActivityDaily(start, end),
    ]).then(([s, d]) => {
      setStats(s?.data || s);
      const arr = d?.data || d;
      setDaily(Array.isArray(arr) ? arr : []);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const maxVal = Math.max(...daily.map(d => d.messages || d.count || 0), 1);

  return (
    <div>
      <div className="admin-section-header">
        <div className="admin-section-label">Analytics</div>
        <div className="admin-section-title">Activity</div>
      </div>
      <div className="admin-card" style={{padding:'20px 24px',marginBottom:20}}>
        <div className="date-range-picker">
          <span style={{fontSize:13,fontWeight:600,color:'#64748b'}}>From</span>
          <input type="date" value={start} onChange={e => setStart(e.target.value)} />
          <span style={{fontSize:13,fontWeight:600,color:'#64748b'}}>To</span>
          <input type="date" value={end} onChange={e => setEnd(e.target.value)} />
          <button className="btn-primary" onClick={load}>
            <span className="material-symbols-outlined" style={{fontSize:15}}>refresh</span>Apply
          </button>
        </div>
      </div>
      {loading ? <LoadingState /> : (
        <>
          {stats && (
            <div className="admin-stats-grid" style={{marginBottom:24}}>
              {Object.entries(stats).map(([k, v]) => typeof v === 'number' && (
                <StatCard key={k} label={k.replace(/_/g,' ')} value={v} icon="bar_chart" />
              ))}
            </div>
          )}
          {daily.length > 0 && (
            <div className="admin-card" style={{padding:'24px 28px'}}>
              <div className="admin-card-title" style={{marginBottom:16}}>Daily Activity</div>
              <div className="daily-chart">
                {daily.map((d, i) => {
                  const val = d.messages || d.count || d.total || 0;
                  const h = Math.max(8, Math.round((val / maxVal) * 100));
                  const dateLabel = (d.date || d.day || '').slice(5);
                  return (
                    <div className="daily-bar-group" key={i} title={`${dateLabel}: ${val}`}>
                      <div className="daily-bar" style={{height: h}} />
                      <div className="daily-bar-label">{dateLabel}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Subscriptions columns ──────────────────────────────
const subCols = [
  { key: 'user_email', label: 'User', render: r => r.user_email || r.email || '—' },
  { key: 'plan', label: 'Plan', render: r => <span className="badge badge-blue">{r.plan_name || r.plan || '—'}</span> },
  { key: 'status', label: 'Status', render: r => <Badge type={r.status} /> },
  { key: 'created_at', label: 'Started', render: r => fmtDate(r.created_at || r.start_date) },
];

const agentCols = [
  { key: 'name', label: 'Agent Name', render: r => <span className="font-bold">{r.name || '—'}</span> },
  { key: 'user_email', label: 'Owner', render: r => r.user_email || r.owner || '—' },
  { key: 'created_at', label: 'Created', render: r => fmtDate(r.created_at) },
];

const pagesCols = [
  { key: 'name', label: 'Page Name', render: r => <span className="font-bold">{r.name || '—'}</span> },
  { key: 'page_id', label: 'Page ID', render: r => <span className="text-muted">{r.page_id || '—'}</span> },
  { key: 'agent_name', label: 'Agent', render: r => r.agent_name || <span className="text-muted">Unassigned</span> },
];

const convCols = [
  { key: 'id', label: 'ID', render: r => <span className="text-muted">{(r.conversation_id || r.id || '').slice(0, 10)}…</span> },
  { key: 'page', label: 'Page', render: r => r.page_name || r.page_id || '—' },
  { key: 'messages', label: 'Messages', render: r => fmt(r.message_count || r.messages || 0) },
  { key: 'updated_at', label: 'Updated', render: r => fmtDate(r.updated_at || r.last_message_at) },
];

const feedbackCols = [
  { key: 'type', label: 'Type', render: r => <span className="badge badge-slate">{r.type}</span> },
  { key: 'title', label: 'Title', render: r => r.title || '—' },
  { key: 'user_email', label: 'User', render: r => r.user_email || r.email || '—' },
  { key: 'created_at', label: 'Date', render: r => fmtDate(r.created_at) },
];

const leadCols = [
  { key: 'name', label: 'Name', render: r => <span className="font-bold">{r.name || '—'}</span> },
  { key: 'email', label: 'Email', render: r => r.email || '—' },
  { key: 'phone', label: 'Phone', render: r => r.phone || '—' },
  { key: 'created_at', label: 'Date', render: r => fmtDate(r.created_at) },
];

// ── Nav Items ──────────────────────────────────────────
const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'users', label: 'Users', icon: 'group' },
  { id: 'subscriptions', label: 'Subscriptions', icon: 'subscriptions' },
  { id: 'revenue', label: 'Revenue', icon: 'payments' },
  { id: 'agents', label: 'AI Agents', icon: 'smart_toy' },
  { id: 'pages', label: 'Pages', icon: 'pages' },
  { id: 'conversations', label: 'Conversations', icon: 'chat' },
  { id: 'feedbacks', label: 'Feedbacks', icon: 'feedback' },
  { id: 'leads', label: 'Leads', icon: 'contacts' },
  { id: 'activity', label: 'Activity', icon: 'bar_chart' },
];

// ── Main Component ─────────────────────────────────────
export default function AdminPanel() {
  const [section, setSection] = useState('dashboard');
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    apiService.adminMe()
      .then(r => setAdmin(r?.data || r))
      .catch(() => {});
  }, []);


  const handleLogout = () => navigate('/app/admin/login');

  const currentLabel = NAV.find(n => n.id === section)?.label || 'Dashboard';

  const renderSection = () => {
    switch (section) {
      case 'dashboard': return <DashboardSection />;
      case 'users': return <UsersSection />;
      case 'subscriptions': return <GenericListSection title="Subscriptions" label="Billing" icon="subscriptions" fetcher={apiService.adminSubscriptions} columns={subCols} />;
      case 'revenue': return <RevenueSection />;
      case 'agents': return <GenericListSection title="AI Agents" label="Fleet" icon="smart_toy" fetcher={apiService.adminAgents} columns={agentCols} />;
      case 'pages': return <GenericListSection title="Pages" label="Connected" icon="pages" fetcher={apiService.adminPages} columns={pagesCols} />;
      case 'conversations': return <GenericListSection title="Conversations" label="Inbox" icon="chat" fetcher={apiService.adminConversations} columns={convCols} />;
      case 'feedbacks': return <GenericListSection title="Feedbacks" label="Reports" icon="feedback" fetcher={apiService.adminFeedbacks} columns={feedbackCols} />;
      case 'leads': return <GenericListSection title="Leads" label="CRM" icon="contacts" fetcher={apiService.adminLeads} columns={leadCols} />;
      case 'activity': return <ActivitySection />;
      default: return null;
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <img src={logoImg} alt="logo" />
          <img src={titleImg} alt="LYFFLOW" className="title-img" />
        </div>
        <div className="admin-sidebar-subtitle">Admin Console</div>
        <nav className="admin-nav">
          {NAV.map(item => (
            <button
              key={item.id}
              className={`admin-nav-item ${section === item.id ? 'active' : ''}`}
              onClick={() => setSection(item.id)}
            >
              <span className="material-symbols-outlined nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          {admin && (
            <div className="admin-profile-chip">
              <div className="admin-avatar" style={{width:30,height:30,fontSize:11}}>{initials(admin.name || admin.email)}</div>
              <div className="admin-profile-chip-info">
                <span className="admin-profile-chip-name">{admin.name || 'Admin'}</span>
                <span className="admin-profile-chip-email">{admin.email || ''}</span>
              </div>
            </div>
          )}
          <button className="admin-nav-item" onClick={handleLogout}>
            <span className="material-symbols-outlined nav-icon">logout</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="admin-main">
        <div className="admin-topbar">
          <span className="admin-topbar-title">{currentLabel}</span>
          <div className="admin-topbar-right">
            {admin && (
              <div className="admin-topbar-profile">
                <div className="admin-avatar" style={{width:32,height:32,fontSize:12}}>{initials(admin.name || admin.email)}</div>
                <div style={{lineHeight:1.2}}>
                  <div style={{fontSize:13,fontWeight:700,color:'#0f172a'}}>{admin.name || 'Admin'}</div>
                  <div style={{fontSize:11,color:'#94a3b8'}}>{admin.email || ''}</div>
                </div>
              </div>
            )}
            <button className="admin-logout-btn" onClick={handleLogout}>
              <span className="material-symbols-outlined" style={{fontSize:16}}>logout</span>
              Sign Out
            </button>
          </div>
        </div>
        <div className="admin-content">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}
