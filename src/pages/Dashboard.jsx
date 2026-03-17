import React, { useState, useEffect } from 'react';
import { LayoutDashboard, MessageSquare, Book, Bot, MessageCircleWarning, Settings, Plus, User, LogOut, ChevronDown, TrendingUp, Headphones, HelpCircle, Palette, Monitor, Users, Trash2, Mail, Menu, X } from 'lucide-react';
import { useWidget } from '../context/WidgetContext';
import './Dashboard.css';

// Placeholder sub-components
const Overview = () => (
  <div className="dashboard-content-area animate-fade-in-up">
    <div className="dashboard-header">
      <h2>Overview</h2>
      <p>Welcome back! Select a demo page to view or add a new one.</p>
    </div>
    
    <div className="pages-grid">
      {/* Demo Page 1 */}
      <button className="giant-page-btn btn-blue">
        <Bot size={48} className="page-icon" />
        <span className="page-name">Support Bot</span>
      </button>

      {/* Demo Page 2 */}
      <button className="giant-page-btn btn-purple">
        <MessageSquare size={48} className="page-icon" />
        <span className="page-name">Sales Chat</span>
      </button>

      {/* Demo Page 3 */}
      <button className="giant-page-btn btn-green">
        <Book size={48} className="page-icon" />
        <span className="page-name">Docs Assistant</span>
      </button>

      {/* Add Page */}
      <button className="giant-page-btn btn-add-dashed">
        <Plus size={48} className="page-icon" />
        <span className="page-name">Add Page</span>
      </button>
    </div>
  </div>
);

const mockContacts = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    avatar: 'SJ',
    color: '#8b5cf6',
    times: '10:42 AM',
    messages: [
      { id: 1, text: 'Hi, I need help resetting my password.', sender: 'them' },
      { id: 2, text: 'Hello Sarah! I can certainly help you with that. Are you locked out of your current account?', sender: 'me' },
      { id: 3, text: 'Yes, I tried logging in from a new device.', sender: 'them' }
    ],
    analytics: { response: '1m 12s', resolution: 'In Progress' }
  },
  {
    id: 2,
    name: 'Michael Chen',
    avatar: 'MC',
    color: '#0ea5e9',
    times: 'Yesterday',
    messages: [
      { id: 1, text: 'Does the enterprise plan include API access?', sender: 'them' },
      { id: 2, text: 'Hi Michael, yes, the Enterprise plan includes full access to our GraphQL API and dedicated support.', sender: 'me' },
      { id: 3, text: 'Perfect, thank you.', sender: 'them' }
    ],
    analytics: { response: '45s', resolution: 'Resolved' }
  },
  {
    id: 3,
    name: 'Emma Watson',
    avatar: 'EW',
    color: '#10b981',
    times: 'Yesterday',
    messages: [
      { id: 1, text: 'How do I add a new agent to my team?', sender: 'them' },
      { id: 2, text: 'You can add a new agent by going to Settings > Team > Invite Members.', sender: 'me' }
    ],
    analytics: { response: '2m 05s', resolution: 'Resolved' }
  },
  {
    id: 4,
    name: 'David Rodriguez',
    avatar: 'DR',
    color: '#f59e0b',
    times: 'Monday',
    messages: [
      { id: 1, text: 'I am seeing an error when trying to deploy the chat widget on my WordPress site.', sender: 'them' },
      { id: 2, text: 'Hi David, could you provide the specific error message you are seeing in your browser console?', sender: 'me' }
    ],
    analytics: { response: '3m 40s', resolution: 'In Progress' }
  }
];

const ConversationList = () => {
  const [activeContact, setActiveContact] = useState(mockContacts[0]);
  const [inputText, setInputText] = useState('');
  const [contacts, setContacts] = useState(mockContacts);

  const renderChatMessage = (msg) => {
    // Mock bot avatar
    const botAvatarColor = '#cbd5e1';
    
    return (
      <div key={msg.id} className={`chat-message-row ${msg.sender === 'me' ? 'sent' : 'received'}`}>
        {msg.sender !== 'me' && (
          <div className="contact-avatar very-small" style={{ backgroundColor: activeContact.color }}>
            {activeContact.avatar}
          </div>
        )}
        <div className="chat-bubble">
            {msg.text}
        </div>
        {msg.sender === 'me' && (
          <div className="contact-avatar very-small" style={{ backgroundColor: botAvatarColor, color: '#333' }}>
            QB
          </div>
        )}
      </div>
    );
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    const updatedContacts = contacts.map(contact => {
      if (contact.id === activeContact.id) {
        const newMessage = { id: Date.now(), text: inputText, sender: 'me' };
        return { ...contact, messages: [...contact.messages, newMessage] };
      }
      return contact;
    });

    setContacts(updatedContacts);
    setActiveContact(updatedContacts.find(c => c.id === activeContact.id));
    setInputText('');
  };

  return (
    <div className="dashboard-content-area conversation-layout animate-fade-in-up">
      {/* Left Pane: Contacts */}
      <div className="conv-contacts-pane">
        <div className="pane-header">
          <h3>Conversations</h3>
        </div>
        <div className="contact-list">
          {contacts.map(contact => (
            <div 
              key={contact.id} 
              className={`contact-item ${activeContact.id === contact.id ? 'active' : ''}`}
              onClick={() => setActiveContact(contact)}
            >
              <div className="contact-avatar" style={{ backgroundColor: contact.color }}>
                {contact.avatar}
              </div>
              <div className="contact-info">
                <h4>{contact.name}</h4>
                <p>{contact.messages[contact.messages.length - 1]?.text || 'No messages yet'}</p>
              </div>
              <span className="contact-time">{contact.times}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Middle Pane: Active Chat */}
      <div className="conv-chat-pane">
        <div className="pane-header border-bottom">
          <div className="active-chat-header">
            <div className="contact-avatar small" style={{ backgroundColor: activeContact.color }}>
              {activeContact.avatar}
            </div>
            <h3>{activeContact.name}</h3>
          </div>
        </div>
        
        <div className="chat-history">
          {activeContact.messages.map(msg => renderChatMessage(msg))}
        </div>
        
        <div className="chat-input-area">
          <input 
            type="text" 
            placeholder="Type a message..." 
            className="chat-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className="btn-send" onClick={handleSend}>Send</button>
        </div>
      </div>

      {/* Right Pane: Analytics */}
      <div className="conv-analytics-pane">
        <div className="pane-header">
          <h3>Chat Details</h3>
        </div>
        <div className="analytics-content">
          <div className="stat-box">
            <span className="stat-label">Current Status</span>
            <span className={`stat-value ${activeContact.analytics.resolution === 'Resolved' ? 'resolved-status' : 'progress-status'}`}>
              {activeContact.analytics.resolution}
            </span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Average Response Time</span>
            <span className="stat-value">{activeContact.analytics.response}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Total Messages</span>
            <span className="stat-value">{activeContact.messages.length}</span>
          </div>
          
          <div className="dummy-graph-box">
            <span className="stat-label" style={{ marginBottom: '12px', display: 'block' }}>Sentiment Trend</span>
            <div className="dummy-graph">
              <div className="graph-bar" style={{ height: '40%' }}></div>
              <div className="graph-bar" style={{ height: '60%' }}></div>
              <div className="graph-bar" style={{ height: '30%' }}></div>
              <div className="graph-bar" style={{ height: '80%' }}></div>
              <div className="graph-bar" style={{ height: '50%' }}></div>
              <div className="graph-bar" style={{ height: '90%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeedbackPanel = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() || description.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setTitle('');
        setDescription('');
      }, 3000);
    }
  };

  return (
    <div className="dashboard-content-area animate-fade-in-up">
      <div className="dashboard-header" style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>Feedback</h3>
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          Give us Feedback, Report a Bug or Tell us how we can improve.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}
      >
        <div className="form-group">
          <label>Feedback Title</label>
          <input
            type="text"
            placeholder="Enter a short title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Feedback Description</label>
          <textarea
            placeholder="Describe your feedback in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical',
              outline: 'none',
              height: '120px',
              boxSizing: 'border-box',
              backgroundColor: '#f8fafc',
              color: 'var(--text-primary)',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onFocus={(e) => { e.target.style.borderColor = '#0ea5e9'; e.target.style.boxShadow = '0 0 0 3px rgba(14,165,233,0.12)'; }}
            onBlur={(e)  => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
          />
        </div>

        <button
          type="submit"
          className="btn-submit"
          style={{
            backgroundColor: submitted ? '#22c55e' : 'var(--text-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '14px',
            fontSize: '15px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'background-color 0.25s',
          }}
        >
          {submitted ? '✓ Submitted!' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

const Knowledge = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="dashboard-content-area animate-fade-in-up">
       <div className="dashboard-header flex-between">
        <div>
          <h2>Knowledge Base</h2>
          <p>Manage the documents and context your AI uses.</p>
        </div>
        <button className="btn-add-knowledge" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add Knowledge
        </button>
      </div>

      <div className="knowledge-list">
        <div className="knowledge-header-row">
          <div className="k-col k-name">Name</div>
          <div className="k-col k-title">Title</div>
          <div className="k-col k-desc">Description</div>
        </div>
        
        {/* Dummy Items */}
        {[1, 2].map(i => (
          <div key={i} className="knowledge-item">
            <div className="k-col k-name">Company_Policy_v{i}</div>
            <div className="k-col k-title">Handbook {i}</div>
            <div className="k-col k-desc">Internal rules and regulations document serving as context.</div>
          </div>
        ))}
      </div>

      {/* Add Knowledge Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in-up">
            <h3>Add New Knowledge</h3>
            <form className="modal-form" onSubmit={(e) => { e.preventDefault(); setShowModal(false); }}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" placeholder="e.g. Return_Policy" required />
              </div>
              <div className="form-group">
                <label>Title</label>
                <input type="text" placeholder="e.g. 30-Day Returns" required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea placeholder="Brief description of this knowledge source..." rows="3" required></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-submit">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const PERSONAS = [
  {
    id: 'sales',
    icon: TrendingUp,
    iconColor: '#8b5cf6',
    iconBg: 'rgba(139,92,246,0.1)',
    title: 'Sales Assistant',
    desc: 'Helps with product recommendations and sales inquiries.',
  },
  {
    id: 'support',
    icon: Headphones,
    iconColor: '#0ea5e9',
    iconBg: 'rgba(14,165,233,0.1)',
    title: 'Support Agent',
    desc: 'Provides customer support and troubleshooting.',
  },
  {
    id: 'qa',
    icon: HelpCircle,
    iconColor: '#10b981',
    iconBg: 'rgba(16,185,129,0.1)',
    title: 'Q&A Bot',
    desc: 'Answers questions based on your knowledge base.',
  },
];

const AgentPanel = () => {
  const [agentName, setAgentName] = useState('');
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [created, setCreated] = useState(false);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!agentName.trim() || !selectedPersona) return;
    setCreated(true);
    setTimeout(() => {
      setCreated(false);
      setAgentName('');
      setSelectedPersona(null);
    }, 3000);
  };

  return (
    <div className="dashboard-content-area animate-fade-in-up">
      <div className="dashboard-header" style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>Create Your Agent</h3>
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          Configure your AI agent&apos;s personality and behavior
        </p>
      </div>

      <form
        onSubmit={handleCreate}
        style={{ maxWidth: '520px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '22px' }}
      >
        {/* Agent Name */}
        <div className="form-group">
          <label>Agent Name</label>
          <input
            type="text"
            placeholder="e.g. My Sales Bot"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
          />
        </div>

        {/* Persona Selector */}
        <div className="form-group">
          <label style={{ marginBottom: '10px', display: 'block' }}>Select Persona</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {PERSONAS.map((p) => {
              const Icon = p.icon;
              const isSelected = selectedPersona === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPersona(p.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '14px 16px',
                    borderRadius: '10px',
                    border: isSelected ? '2px solid #0ea5e9' : '2px solid #e2e8f0',
                    backgroundColor: isSelected ? 'rgba(14,165,233,0.05)' : '#f8fafc',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s, background-color 0.2s',
                  }}
                >
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: p.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={20} color={p.iconColor} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)', marginBottom: '2px' }}>
                      {p.title}
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>{p.desc}</div>
                  </div>
                  {isSelected && (
                    <div style={{ marginLeft: 'auto', width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn-submit"
          style={{
            backgroundColor: created ? '#22c55e' : 'var(--text-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '14px',
            fontSize: '15px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'background-color 0.25s',
          }}
        >
          {created ? '✓ Agent Created!' : 'Create Agent'}
        </button>
      </form>
    </div>
  );
};

/* ─────────────────────────────────────────
   SETTINGS PANEL
───────────────────────────────────────── */
const THEMES = [
  { id: 'sky',    label: 'Sky Blue',    primary: '#87CEEB', accent: '#0ea5e9' },
  { id: 'slate',  label: 'Slate',       primary: '#94a3b8', accent: '#475569' },
  { id: 'violet', label: 'Violet',      primary: '#a78bfa', accent: '#7c3aed' },
  { id: 'rose',   label: 'Rose',        primary: '#fb7185', accent: '#e11d48' },
  { id: 'emerald',label: 'Emerald',     primary: '#6ee7b7', accent: '#059669' },
  { id: 'amber',  label: 'Amber',       primary: '#fcd34d', accent: '#d97706' },
];

const INITIAL_TEAM = [
  { id: 1, name: 'John Smith',   email: 'john.smith@company.com',  role: 'Admin',  avatar: 'JS', color: '#0ea5e9' },
  { id: 2, name: 'Alice Tan',    email: 'alice.tan@company.com',   role: 'Agent',  avatar: 'AT', color: '#8b5cf6' },
  { id: 3, name: 'Bob Reyes',    email: 'bob.reyes@company.com',   role: 'Agent',  avatar: 'BR', color: '#10b981' },
];

const SettingsPanel = () => {
  const [activeSettings, setActiveSettings] = useState('themes');

  // ── Themes state ──
  const [selectedTheme, setSelectedTheme] = useState('sky');
  const [themeSaved, setThemeSaved] = useState(false);

  const {
    themeId, setThemeId,
    widgetColor, setWidgetColor,
    widgetGreeting, setWidgetGreeting,
    widgetPosition, setWidgetPosition,
  } = useWidget();

  // Sync initial selector with global context
  useEffect(() => {
    setSelectedTheme(themeId);
  }, [themeId]);

  const [widgetSaved, setWidgetSaved] = useState(false);

  // ── Team Members state ──
  const [team, setTeam] = useState(INITIAL_TEAM);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Agent');
  const [inviteSent, setInviteSent] = useState(false);

  const handleThemeSave = () => {
    setThemeId(selectedTheme);
    setThemeSaved(true);
    setTimeout(() => setThemeSaved(false), 2500);
  };

  const handleWidgetSave = (e) => {
    e.preventDefault();
    setWidgetSaved(true);
    setTimeout(() => setWidgetSaved(false), 2500);
  };

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviteSent(true);
    setTimeout(() => {
      setInviteSent(false);
      setInviteEmail('');
    }, 2500);
  };

  const removeTeamMember = (id) => {
    setTeam(prev => prev.filter(m => m.id !== id));
  };

  const settingsTabs = [
    { id: 'themes',  icon: Palette,  label: 'Themes' },
    { id: 'widget',  icon: Monitor,  label: 'Widget Appearance' },
    { id: 'team',    icon: Users,    label: 'Team Members' },
  ];

  return (
    <div className="dashboard-content-area animate-fade-in-up" style={{ padding: '0' }}>
      {/* Settings sub-nav */}
      <div style={{ borderBottom: '1px solid #e2e8f0', padding: '0 32px', display: 'flex', gap: '4px', backgroundColor: '#fff' }}>
        {settingsTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeSettings === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSettings(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '14px 16px',
                fontSize: '13.5px', fontWeight: isActive ? 600 : 500,
                color: isActive ? '#0ea5e9' : '#64748b',
                background: 'none', border: 'none',
                borderBottom: isActive ? '2px solid #0ea5e9' : '2px solid transparent',
                cursor: 'pointer', transition: 'color 0.15s',
                marginBottom: '-1px',
              }}
            >
              <Icon size={16} />{tab.label}
            </button>
          );
        })}
      </div>

      <div style={{ padding: '32px', maxWidth: '600px' }}>

        {/* ── THEMES ── */}
        {activeSettings === 'themes' && (
          <div>
            <h3 style={{ fontWeight: 700, fontSize: '17px', marginBottom: '6px' }}>Themes</h3>
            <p style={{ color: '#64748b', fontSize: '13.5px', marginBottom: '24px' }}>Choose a color theme for your dashboard.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
              {THEMES.map(t => {
                const isSelected = selectedTheme === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTheme(t.id)}
                    style={{
                      borderRadius: '12px',
                      border: isSelected ? `2px solid ${t.accent}` : '2px solid #e2e8f0',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                      boxShadow: isSelected ? `0 0 0 3px ${t.accent}22` : 'none',
                    }}
                  >
                    {/* Swatch */}
                    <div style={{ height: '56px', background: `linear-gradient(135deg, ${t.primary}, ${t.accent})` }} />
                    <div style={{ padding: '8px 10px', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#374151' }}>{t.label}</span>
                      {isSelected && (
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="9" height="7" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={handleThemeSave}
              className="btn-submit"
              style={{ marginTop: '28px', backgroundColor: themeSaved ? '#22c55e' : 'var(--text-primary)', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 28px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', transition: 'background-color 0.25s' }}
            >
              {themeSaved ? '✓ Theme Applied!' : 'Apply Theme'}
            </button>
          </div>
        )}

        {/* ── WIDGET APPEARANCE ── */}
        {activeSettings === 'widget' && (
          <form onSubmit={handleWidgetSave}>
            <h3 style={{ fontWeight: 700, fontSize: '17px', marginBottom: '6px' }}>Widget Appearance</h3>
            <p style={{ color: '#64748b', fontSize: '13.5px', marginBottom: '24px' }}>Customize how your chat widget looks to visitors.</p>

            <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Color */}
              <div className="form-group">
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  Widget Color
                  <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 400 }}>{widgetColor}</span>
                </label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '8px' }}>
                  {['#0ea5e9','#8b5cf6','#10b981','#f59e0b','#e11d48','#374151'].map(c => (
                    <div
                      key={c}
                      onClick={() => setWidgetColor(c)}
                      style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        backgroundColor: c, cursor: 'pointer',
                        border: widgetColor === c ? '3px solid #374151' : '3px solid transparent',
                        boxSizing: 'border-box', transition: 'border 0.15s',
                      }}
                    />
                  ))}
                  {/* Custom color picker */}
                  <div 
                    style={{ 
                      width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: !['#0ea5e9','#8b5cf6','#10b981','#f59e0b','#e11d48','#374151'].includes(widgetColor) ? '3px solid #374151' : '1px solid #e2e8f0',
                      boxSizing: 'border-box'
                    }}
                  >
                    <input
                      type="color"
                      value={widgetColor}
                      onChange={e => setWidgetColor(e.target.value)}
                      style={{ 
                        width: '40px', height: '40px', /* oversized to hide the input's own borders inside the overflow: hidden circle */
                        border: 'none', cursor: 'pointer', padding: 0, 
                        backgroundColor: 'transparent'
                      }}
                      title="Custom color"
                    />
                  </div>
                </div>
              </div>

              {/* Greeting */}
              <div className="form-group">
                <label>Greeting Message</label>
                <input
                  type="text"
                  value={widgetGreeting}
                  onChange={e => setWidgetGreeting(e.target.value)}
                  placeholder="Hi there 👋 How can we help you?"
                />
              </div>

              {/* Position */}
              <div className="form-group">
                <label>Widget Position</label>
                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                  {['bottom-right', 'bottom-left'].map(pos => (
                    <div
                      key={pos}
                      onClick={() => setWidgetPosition(pos)}
                      style={{
                        flex: 1, padding: '10px', textAlign: 'center',
                        borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                        border: widgetPosition === pos ? '2px solid #0ea5e9' : '2px solid #e2e8f0',
                        backgroundColor: widgetPosition === pos ? 'rgba(14,165,233,0.05)' : '#f8fafc',
                        transition: 'all 0.15s',
                      }}
                    >
                      {pos === 'bottom-right' ? '↘ Bottom Right' : '↙ Bottom Left'}
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview bubble */}
              <div style={{ backgroundColor: '#f1f5f9', borderRadius: '12px', padding: '20px', position: 'relative', minHeight: '80px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>PREVIEW</span>
                <div style={{
                  position: 'absolute',
                  bottom: '14px',
                  [widgetPosition === 'bottom-right' ? 'right' : 'left']: '14px',
                  width: '44px', height: '44px', borderRadius: '50%',
                  backgroundColor: widgetColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
              </div>
            </div>

              {/* Live Preview */}
              <div 
                style={{ 
                  width: '280px', 
                  backgroundColor: '#f8fafc', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '16px', 
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                  alignSelf: 'stretch'
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Live Preview</div>
                
                {/* Received Bubble */}
                <div style={{ alignSelf: 'flex-start', backgroundColor: '#ffffff', color: '#334155', padding: '10px 14px', borderRadius: '16px 16px 16px 4px', fontSize: '13px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', maxWidth: '90%' }}>
                  {widgetGreeting || 'Hi there 👋 How can we help you?'}
                </div>
                
                {/* Sent Bubble */}
                <div style={{ alignSelf: 'flex-end', background: `linear-gradient(90deg, ${widgetColor} 0%, ${widgetColor}dd 100%)`, color: '#ffffff', padding: '10px 14px', borderRadius: '16px 16px 4px 16px', fontSize: '13px', maxWidth: '90%' }}>
                  Yes 😊 Would you like pricing or a demo?
                </div>

                {/* Position Indicator */}
                <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', justifyContent: widgetPosition === 'bottom-left' ? 'flex-start' : 'flex-end' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: widgetColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <MessageSquare size={20} />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn-submit"
              style={{ marginTop: '24px', backgroundColor: widgetSaved ? '#22c55e' : 'var(--text-primary)', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 28px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', transition: 'background-color 0.25s' }}
            >
              {widgetSaved ? '✓ Saved!' : 'Save Changes'}
            </button>
          </form>
        )}

        {/* ── TEAM MEMBERS ── */}
        {activeSettings === 'team' && (
          <div>
            <h3 style={{ fontWeight: 700, fontSize: '17px', marginBottom: '6px' }}>Team Members</h3>
            <p style={{ color: '#64748b', fontSize: '13.5px', marginBottom: '24px' }}>Manage who has access to your workspace.</p>

            {/* Member list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
              {team.map(member => (
                <div key={member.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div className="contact-avatar very-small" style={{ backgroundColor: member.color, color: '#fff', flexShrink: 0 }}>{member.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '13.5px' }}>{member.name}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>{member.email}</div>
                  </div>
                  <span style={{ fontSize: '11.5px', fontWeight: 600, padding: '3px 10px', borderRadius: '999px', backgroundColor: member.role === 'Admin' ? 'rgba(14,165,233,0.1)' : 'rgba(16,185,129,0.1)', color: member.role === 'Admin' ? '#0ea5e9' : '#059669' }}>
                    {member.role}
                  </span>
                  {member.role !== 'Admin' && (
                    <button onClick={() => removeTeamMember(member.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', padding: '4px', borderRadius: '6px', transition: 'color 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#e11d48'}
                      onMouseLeave={e => e.currentTarget.style.color = '#cbd5e1'}
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Invite form */}
            <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '7px' }}>
                <Mail size={15} color="#0ea5e9" /> Invite a team member
              </div>
              <form onSubmit={handleInvite} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input
                  type="email"
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  style={{ flex: 1, minWidth: '180px', padding: '10px 13px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13.5px', fontFamily: 'inherit', outline: 'none', backgroundColor: '#fff' }}
                />
                <select
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value)}
                  style={{ padding: '10px 13px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13.5px', fontFamily: 'inherit', outline: 'none', backgroundColor: '#fff', cursor: 'pointer' }}
                >
                  <option>Agent</option>
                  <option>Admin</option>
                </select>
                <button
                  type="submit"
                  style={{ padding: '10px 18px', backgroundColor: inviteSent ? '#22c55e' : 'var(--text-primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer', transition: 'background-color 0.25s', whiteSpace: 'nowrap' }}
                >
                  {inviteSent ? '✓ Sent!' : 'Send Invite'}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch(activeTab) {
      case 'overview': return <Overview />;
      case 'conversation': return <ConversationList />;
      case 'knowledge': return <Knowledge />;
      case 'agent': return <AgentPanel />;
      case 'feedback': return <FeedbackPanel />;
      case 'settings': return <SettingsPanel />;
      default: return <div className="dashboard-content-area"><h2>Coming Soon</h2></div>;
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-q">
            Q<div className="sidebar-logo-bubble"></div>
          </div>
          <span className="sidebar-logo-text">chat</span>
          {/* Mobile Close Button */}
          <button className="mobile-sidebar-close" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} color="#fff" />
          </button>
        </div>

        <nav className="sidebar-nav primary-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }}
          >
            <LayoutDashboard size={20} />
            <span>Overview</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'conversation' ? 'active' : ''}`}
            onClick={() => { setActiveTab('conversation'); setIsSidebarOpen(false); }}
          >
            <MessageSquare size={20} />
            <span>Conversation List</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'knowledge' ? 'active' : ''}`}
            onClick={() => { setActiveTab('knowledge'); setIsSidebarOpen(false); }}
          >
            <Book size={20} />
            <span>Knowledge</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'agent' ? 'active' : ''}`}
            onClick={() => { setActiveTab('agent'); setIsSidebarOpen(false); }}
          >
            <Bot size={20} />
            <span>Agent</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'feedback' ? 'active' : ''}`}
            onClick={() => { setActiveTab('feedback'); setIsSidebarOpen(false); }}
          >
            <MessageCircleWarning size={20} />
            <span>Feedback</span>
          </button>
        </nav>

        <nav className="sidebar-nav secondary-nav">
          <button
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }}
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main">
        {/* Top Navbar */}
        <header className="dashboard-top-navbar">
          <div className="top-nav-left" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              className="mobile-sidebar-open" 
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <span className="workspace-name">My Workspace</span>
          </div>
          <div className="top-nav-right">
            <button 
              className="profile-toggle-btn" 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="contact-avatar very-small" style={{ backgroundColor: '#0ea5e9', color: 'white' }}>JS</div>
              <span className="profile-name">John Smith</span>
              <ChevronDown size={16} className={`profile-chevron ${isProfileOpen ? 'rotated' : ''}`} />
            </button>
          </div>
        </header>

        <div className="dashboard-content-wrapper">
          {renderContent()}

          {/* Profile Slideout Drawer */}
          <div className={`profile-drawer ${isProfileOpen ? 'open' : ''}`}>
             <div className="drawer-header">
                <h3>Profile</h3>
             </div>
             <div className="drawer-content">
               <div className="drawer-user-info">
                 <div className="contact-avatar large" style={{ backgroundColor: '#0ea5e9', color: 'white' }}>JS</div>
                 <h4>John Smith</h4>
                 <p>john.smith@company.com</p>
               </div>
               
               <div className="drawer-menu">
                 <button className="drawer-menu-item">
                   <User size={18} /> Account Settings
                 </button>
                 <button className="drawer-menu-item" onClick={() => window.location.href = '/login'}>
                   <LogOut size={18} /> Log Out
                 </button>
               </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
