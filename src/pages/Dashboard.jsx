import React, { useState } from 'react';
import { LayoutDashboard, MessageSquare, Book, Bot, MessageCircleWarning, Settings, Plus, User, LogOut, ChevronDown } from 'lucide-react';
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

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const renderContent = () => {
    switch(activeTab) {
      case 'overview': return <Overview />;
      case 'conversation': return <ConversationList />;
      case 'knowledge': return <Knowledge />;
      default: return <div className="dashboard-content-area"><h2>Coming Soon</h2></div>;
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-q">
            Q<div className="sidebar-logo-bubble"></div>
          </div>
          <span className="sidebar-logo-text">chat</span>
        </div>

        <nav className="sidebar-nav primary-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <LayoutDashboard size={20} />
            <span>Overview</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'conversation' ? 'active' : ''}`}
            onClick={() => setActiveTab('conversation')}
          >
            <MessageSquare size={20} />
            <span>Conversation List</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'knowledge' ? 'active' : ''}`}
            onClick={() => setActiveTab('knowledge')}
          >
            <Book size={20} />
            <span>Knowledge</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'agent' ? 'active' : ''}`}
            onClick={() => setActiveTab('agent')}
          >
            <Bot size={20} />
            <span>Agent</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'feedback' ? 'active' : ''}`}
            onClick={() => setActiveTab('feedback')}
          >
            <MessageCircleWarning size={20} />
            <span>Feedback</span>
          </button>
        </nav>

        <nav className="sidebar-nav secondary-nav">
          <button className="nav-item">
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main">
        {/* Top Navbar */}
        <header className="dashboard-top-navbar">
          <div className="top-nav-left">
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
