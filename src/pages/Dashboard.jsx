import React, { useState, useEffect, useCallback } from 'react';
import { LayoutDashboard, MessageSquare, Book, Bot, MessageCircleWarning, Settings, Plus, User, LogOut, ChevronDown, TrendingUp, Headphones, HelpCircle, Palette, Monitor, Users, Trash2, Mail, Menu, X } from 'lucide-react';
import { useWidget } from '../context/WidgetContext';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import './Dashboard.css';

// Sub-components
const Overview = ({ user, pages }) => {
  const [assigning, setAssigning] = useState({}); // {pageId: boolean}
  const [success, setSuccess] = useState({}); // {pageId: boolean}

  const agents = user?.agents || [];

  const handleAssign = async (pageId, agentId) => {
    if (!agentId) return;
    setAssigning(prev => ({ ...prev, [pageId]: true }));
    try {
      await apiService.assignAgentToPage(pageId, agentId);
      setSuccess(prev => ({ ...prev, [pageId]: true }));
      setTimeout(() => {
        setSuccess(prev => ({ ...prev, [pageId]: false }));
      }, 3000);
    } catch (error) {
      console.error("Failed to assign agent:", error);
      alert("Failed to assign agent: " + error.message);
    } finally {
      setAssigning(prev => ({ ...prev, [pageId]: false }));
    }
  };

  return (
    <div className="dashboard-content-area animate-fade-in-up">
      <div className="dashboard-header">
        <h2>Overview</h2>
        <p>Welcome back{user?.first_name ? `, ${user.first_name}` : ''}! Manage your pages and assign AI agents.</p>
      </div>
      
      <div className="pages-grid">
        {Array.isArray(pages) && pages.map(page => (
          <div key={page.page_id} className="page-card-container">
            <div className="giant-page-btn btn-blue">
              <Bot size={48} className="page-icon" />
              <span className="page-name">{page.name}</span>
            </div>
            
            <div className="agent-assign-box">
              <label>Assigned Agent</label>
              <select 
                defaultValue="" 
                onChange={(e) => handleAssign(page.page_id, e.target.value)}
                disabled={assigning[page.page_id]}
                className={success[page.page_id] ? 'success-pulse' : ''}
              >
                <option value="" disabled>Select an Agent...</option>
                {agents.length === 0 ? (
                  <option disabled>No agents created yet</option>
                ) : (
                  agents.map(agent => (
                    <option key={agent.agent_id} value={agent.agent_id}>
                      {agent.name} ({agent.role || 'Agent'})
                    </option>
                  ))
                )}
              </select>
              {success[page.page_id] && <span className="assign-success-text">✓ Assigned!</span>}
            </div>
          </div>
        ))}

        {/* Add Page Placeholder */}
        <div className="page-card-container">
          <button className="giant-page-btn btn-add-dashed">
            <Plus size={48} className="page-icon" />
            <span className="page-name">Add Page</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const ConversationList = ({ pages }) => {
  const [selectedPageId, setSelectedPageId] = useState('');
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  useEffect(() => {
    if (pages && pages.length > 0 && !selectedPageId) {
      setSelectedPageId(pages[0].page_id);
    }
  }, [pages]);

  useEffect(() => {
    if (!selectedPageId) return;
    setLoading(true);
    apiService.getPageDetails(selectedPageId)
      .then(data => {
        // Handle FB Graph variations
        const convs = data?.conversations?.data || data?.conversations || data?.data || [];
        setContacts(Array.isArray(convs) ? convs : []);
        if (convs.length > 0) setActiveContact(convs[0]);
        else setActiveContact(null);
      })
      .catch(err => console.error("Failed to fetch conversations", err))
      .finally(() => setLoading(false));
  }, [selectedPageId]);

  useEffect(() => {
    if (!selectedPageId || !activeContact) return;
    setLoadingMsgs(true);
    const convId = activeContact.id || activeContact.conversation_id || activeContact.id;
    apiService.getConversationDetails(selectedPageId, convId)
      .then(data => {
         const msgs = data?.messages?.data || data?.messages || data?.data || [];
         // Typically Facebook returns newest first, reverse for chat UI
         setMessages(Array.isArray(msgs) ? msgs.reverse() : []);
      })
      .catch(err => console.error("Failed to fetch messages", err))
      .finally(() => setLoadingMsgs(false));
  }, [selectedPageId, activeContact]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    alert("Sending custom messages is disabled or restricted in the current open API phase. The AI Agent will handle replies automatically.");
    setInputText('');
  };

  const renderAvatar = (contactObj, extraClass = "") => {
    // Facebook Graph API usually returns profile pictures in one of these structures depending on your query
    // Adding more variations like "profile_picture", "picture.url", etc.
    const url = 
      contactObj?.senders?.data?.[0]?.profile_pic || 
      contactObj?.participants?.data?.[0]?.profile_pic ||
      contactObj?.profile_pic || 
      contactObj?.picture?.data?.url || 
      contactObj?.picture?.url || 
      contactObj?.picture ||
      contactObj?.profile_picture;
    
    const name = contactObj?.senders?.data?.[0]?.name || contactObj?.participants?.data?.[0]?.name || contactObj?.name || 'U';
    
    if (url && typeof url === 'string') {
      return (
        <div 
          className={`contact-avatar ${extraClass}`} 
          style={{ backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#e2e8f0' }} 
        />
      );
    }
    return (
      <div className={`contact-avatar ${extraClass}`} style={{ backgroundColor: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
        {name.charAt(0)}
      </div>
    );
  };

  const renderChatMessage = (msg) => {
    // The debug info shows msg has a "role" field ("user") and "is_ai_msg" boolean.
    // If "role" is "user" -> it's the customer (isMe = false).
    // If "is_ai_msg" is true -> it's the bot (isMe = true).
    
    let isMe = true; 
    if (msg.role === 'user') {
      isMe = false;
    } else if (msg.is_ai_msg === true) {
      isMe = true;
    } else {
      // Fallback: search for ID comparison or name matching
      const customerId = activeContact?.senders?.data?.[0]?.id || activeContact?.participants?.data?.[0]?.id || activeContact?.id;
      const fromId = msg?.from?.id;
      if (fromId && customerId) {
        isMe = fromId !== customerId;
      }
    }
    
    return (
      <div key={msg.id || msg.message_id || Math.random()} className={`chat-message-row ${isMe ? 'sent' : 'received'}`}>
        {!isMe && renderAvatar(activeContact, "very-small")}
        <div className="chat-bubble">
            {msg.message || msg.text || ''}
        </div>
        {isMe && (
          <div className="contact-avatar very-small" style={{ backgroundColor: '#cbd5e1', color: '#333' }}>
            QB
          </div>
        )}
      </div>
    );
  };

  if (!pages || pages.length === 0) {
    return (
      <div className="dashboard-content-area conversation-layout animate-fade-in-up">
        <div style={{ padding: '40px' }}>
          <h2>Conversations</h2>
          <p>Please connect a Facebook page to view your Messenger/Instagram inboxes here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content-area conversation-layout animate-fade-in-up">
      {/* Left Pane: Contacts */}
      <div className="conv-contacts-pane">
        <div className="pane-header" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ margin: 0 }}>Inbox</h3>
          <select 
            value={selectedPageId} 
            onChange={e => setSelectedPageId(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', outline: 'none' }}
          >
            {pages.map(p => <option key={p.page_id} value={p.page_id}>{p.name}</option>)}
          </select>
        </div>
        <div className="contact-list">
          {loading ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>Loading channels...</div>
          ) : contacts.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No ongoing conversations.</div>
          ) : contacts.map((contact, i) => {
            const contactName = contact.name || contact.senders?.data?.[0]?.name || contact.participants?.data?.[0]?.name || `User ${i}`;
            const snippet = contact.snippet || contact.last_message || contact.messages?.data?.[0]?.message || contact.messages?.[0]?.message || 'No messages';
            const updated = new Date(contact.updated_time || contact.last_message_at || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            const id = contact.conversation_id || contact.id || i;

            return (
              <div 
                key={id} 
                className={`contact-item ${(activeContact?.id || activeContact?.conversation_id) === id ? 'active' : ''}`}
                onClick={() => setActiveContact(contact)}
              >
                {renderAvatar(contact)}
                <div className="contact-info">
                  <h4>{contactName}</h4>
                  <p>{snippet}</p>
                </div>
                <span className="contact-time">{updated}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Middle Pane: Active Chat */}
      <div className="conv-chat-pane">
        {activeContact ? (
          <>
            <div className="pane-header border-bottom">
              <div className="active-chat-header">
                {renderAvatar(activeContact, "small")}
                <h3>{activeContact?.senders?.data?.[0]?.name || activeContact?.name || 'User'}</h3>
              </div>
            </div>
            

            <div className="chat-history">
              {loadingMsgs ? (
                <div style={{ textAlign: 'center', color: '#64748b', marginTop: '20px' }}>Loading messages...</div>
              ) : messages.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#64748b', marginTop: '20px' }}>No messages available in this thread.</div>
              ) : (
                messages.map(msg => renderChatMessage(msg))
              )}
            </div>
            
            <div className="chat-input-area">
              <input 
                type="text" 
                placeholder="Type a message (Read-Only Preview)" 
                className="chat-input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button className="btn-send" onClick={handleSend}>Send</button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
            Select a conversation to view chat history
          </div>
        )}
      </div>

      {/* Right Pane: Analytics (Stateless Mock Panel) */}
      <div className="conv-analytics-pane">
        <div className="pane-header">
          <h3>Chat Context</h3>
        </div>
        <div className="analytics-content">
          <div className="stat-box">
            <span className="stat-label">AI Agent Handling</span>
            <span className="stat-value progress-status">Active</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Message Count</span>
            <span className="stat-value">{messages.length}</span>
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

const Knowledge = ({ pages }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPageId, setSelectedPageId] = useState('');
  const [knowledgeList, setKnowledgeList] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Modal state
  const [name, setName] = useState('');
  const [textMode, setTextMode] = useState(false); // toggle between file and text/url
  const [file, setFile] = useState(null);
  const [textContent, setTextContent] = useState('');
  const [urlContent, setUrlContent] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (pages && pages.length > 0 && !selectedPageId) {
      setSelectedPageId(pages[0].page_id);
    }
  }, [pages]);

  useEffect(() => {
    if (!selectedPageId) return;
    setLoading(true);
    apiService.getKnowledge(selectedPageId)
      .then(data => {
        // Assume data is an array or { results: [] }
        setKnowledgeList(Array.isArray(data) ? data : (data.results || data.items || []));
      })
      .catch(err => console.error("Failed to load knowledge", err))
      .finally(() => setLoading(false));
  }, [selectedPageId]);

  const handleAddKnowledge = async (e) => {
    e.preventDefault();
    if (!selectedPageId) return alert('Please select a page first');
    if (!name.trim()) return alert('Name is required');

    setUploading(true);
    try {
      const formData = new FormData();
      if (!textMode && file) {
        formData.append('file', file);
      }
      
      const dataSource = {
        name: name.trim(),
        text: textMode ? (textContent.trim() || null) : null,
        url: textMode ? (urlContent.trim() || null) : null
      };

      formData.append('data_source', JSON.stringify(dataSource));

      await apiService.createKnowledge(selectedPageId, formData);
      
      // refresh list
      const updatedList = await apiService.getKnowledge(selectedPageId);
      setKnowledgeList(Array.isArray(updatedList) ? updatedList : (updatedList.results || updatedList.items || []));
      
      setShowModal(false);
      setName('');
      setFile(null);
      setTextContent('');
      setUrlContent('');
    } catch (error) {
      console.error(error);
      alert('Failed to upload knowledge: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (!pages || pages.length === 0) {
    return (
      <div className="dashboard-content-area animate-fade-in-up">
        <div className="dashboard-header">
          <h2>Knowledge Base</h2>
          <p>Please connect a Facebook page before adding knowledge. The API requires a linked page context.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content-area animate-fade-in-up">
       <div className="dashboard-header flex-between" style={{ flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Knowledge Base</h2>
          <p>Manage the documents and context your AI uses.</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <select 
            value={selectedPageId} 
            onChange={e => setSelectedPageId(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#fff', outline: 'none', fontWeight: 500 }}
          >
            {pages.map(p => <option key={p.page_id} value={p.page_id}>{p.name}</option>)}
          </select>

          <button className="btn-add-knowledge" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Add Knowledge
          </button>
        </div>
      </div>

      <div className="knowledge-list">
        <div className="knowledge-header-row">
          <div className="k-col k-name">Name</div>
          <div className="k-col k-desc">Type</div>
        </div>
        
        {loading ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>Loading documents...</div>
        ) : knowledgeList.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>No documents found for this page.</div>
        ) : (
          knowledgeList.map((item, i) => (
            <div key={item.id || i} className="knowledge-item">
              <div className="k-col k-name">{item.data_source?.name || item.name || 'Unnamed Document'}</div>
              <div className="k-col k-desc">
                {item.file_name ? 'File' : (item.data_source?.url ? 'URL Link' : 'Raw Text')}
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in-up">
            <h3>Add New Knowledge</h3>
            
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <button 
                type="button" 
                onClick={() => setTextMode(false)}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: !textMode ? '#e0f2fe' : '#f1f5f9', color: !textMode ? '#0369a1' : '#64748b', fontWeight: 600, cursor: 'pointer' }}
              >
                File Upload
              </button>
              <button 
                type="button" 
                onClick={() => setTextMode(true)}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: textMode ? '#e0f2fe' : '#f1f5f9', color: textMode ? '#0369a1' : '#64748b', fontWeight: 600, cursor: 'pointer' }}
              >
                Text / Link
              </button>
            </div>

            <form className="modal-form" onSubmit={handleAddKnowledge}>
              <div className="form-group">
                <label>Document Name *</label>
                <input type="text" placeholder="e.g. Return_Policy" value={name} onChange={e => setName(e.target.value)} required />
              </div>

              {!textMode ? (
                <div className="form-group">
                  <label>Upload File</label>
                  <input type="file" onChange={e => setFile(e.target.files[0])} style={{ padding: '8px' }} required />
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label>Website URL (Optional)</label>
                    <input type="url" placeholder="https://example.com/pricing" value={urlContent} onChange={e => setUrlContent(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Raw Text (Optional)</label>
                    <textarea placeholder="Paste plain text content here..." value={textContent} onChange={e => setTextContent(e.target.value)} rows="4"></textarea>
                  </div>
                </>
              )}

              <div className="modal-actions" style={{ marginTop: '24px' }}>
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)} disabled={uploading}>Cancel</button>
                <button type="submit" className="btn-submit" disabled={uploading}>{uploading ? 'Processing...' : 'Upload'}</button>
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

const AgentPanel = ({ user, onUpdate }) => {
  const [agentName, setAgentName] = useState('');
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [tone, setTone] = useState('Professional');
  const [language, setLanguage] = useState('English');
  const [businessName, setBusinessName] = useState('');
  const [businessDesc, setBusinessDesc] = useState('');
  const [instructions, setInstructions] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);

  const TONES = ["Professional", "Friendly", "Formal", "Casual", "Persuasive", "Empathetic", "Confident"];
  const LANGUAGES = ["Mimic User Language", "English", "Arabic", "Spanish", "French", "German", "Portuguese", "Hindi", "Bengali"];

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!agentName.trim() || !selectedPersona || !businessName.trim() || !businessDesc.trim()) return;
    
    setLoading(true);
    try {
      const roleMap = { 'sales': 'Sales Agent', 'support': 'Support Agent', 'qa': 'Q&A Agent' };
      const payload = {
        name: agentName,
        role: roleMap[selectedPersona],
        tone,
        language,
        business_name: businessName,
        business_description: businessDesc,
        instructions: instructions.trim() || null
      };

      const userId = user?.email || 'default_user_session';
      await apiService.createAgent(userId, payload);
      
      if (onUpdate) await onUpdate(); // Refresh user data to get the new agent list
      
      setCreated(true);
      setTimeout(() => {
        setCreated(false);
        setAgentName('');
        setSelectedPersona(null);
        setBusinessName('');
        setBusinessDesc('');
        setInstructions('');
      }, 3000);
    } catch (error) {
      console.error('Failed to create agent:', error);
      alert('Failed to create agent: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-content-area animate-fade-in-up">
      <div className="dashboard-header" style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>Create Your Agent</h3>
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          Configure your AI agent&apos;s personality, behavior, and business context.
        </p>
      </div>

      <form
        onSubmit={handleCreate}
        style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '22px' }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label>Agent Name *</label>
            <input type="text" placeholder="e.g. Sales Bot" value={agentName} onChange={(e) => setAgentName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Business Name *</label>
            <input type="text" placeholder="Your Company Ltd" value={businessName} onChange={(e) => setBusinessName(e.target.value)} required />
          </div>
        </div>

        <div className="form-group">
          <label style={{ marginBottom: '10px', display: 'block' }}>Select Persona *</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {PERSONAS.map((p) => {
              const Icon = p.icon;
              const isSelected = selectedPersona === p.id;
              return (
                <div key={p.id} onClick={() => setSelectedPersona(p.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '14px 12px', borderRadius: '10px', border: isSelected ? '2px solid #0ea5e9' : '2px solid #e2e8f0', backgroundColor: isSelected ? 'rgba(14,165,233,0.05)' : '#f8fafc', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: p.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color={p.iconColor} />
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>{p.title}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label>Tone *</label>
            <select value={tone} onChange={e => setTone(e.target.value)} style={{ padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none', backgroundColor: '#fff', fontSize: '14px' }}>
              {TONES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Language *</label>
            <select value={language} onChange={e => setLanguage(e.target.value)} style={{ padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none', backgroundColor: '#fff', fontSize: '14px' }}>
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Business Description *</label>
          <textarea placeholder="What does your business do? How should the agent ground its suggestions?" value={businessDesc} onChange={(e) => setBusinessDesc(e.target.value)} rows="3" style={{ padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }} required />
        </div>

        <div className="form-group">
          <label>Custom Instructions (Optional)</label>
          <textarea placeholder="e.g. Always end conversations with 'Have a great day!'" value={instructions} onChange={(e) => setInstructions(e.target.value)} rows="2" style={{ padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }} />
        </div>

        <button type="submit" className="btn-submit" disabled={loading} style={{ backgroundColor: created ? '#22c55e' : (loading ? '#94a3b8' : 'var(--text-primary)'), color: '#fff', border: 'none', borderRadius: '8px', padding: '14px', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background-color 0.25s' }}>
          {loading ? 'Creating...' : (created ? '✓ Agent Created!' : 'Create Agent')}
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
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const userData = await apiService.getUserProfile();
      const pagesData = await apiService.getPages();
      
      const parsedUser = userData?.user || userData || null;
      const parsedPages = Array.isArray(pagesData) ? pagesData : (pagesData?.pages || pagesData?.data || []);

      setUser(parsedUser);
      setPages(parsedPages);
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      if (err.status === 401) {
        navigate('/app/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderContent = () => {
    if (loading) {
      return <div className="dashboard-content-area"><h2>Loading workspace...</h2></div>;
    }

    switch(activeTab) {
      case 'overview': return <Overview user={user} pages={pages} />;
      case 'conversation': return <ConversationList pages={pages} />;
      case 'knowledge': return <Knowledge pages={pages} />;
      case 'agent': return <AgentPanel user={user} onUpdate={fetchData} />;
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
              <div className="contact-avatar very-small" style={{ backgroundColor: '#0ea5e9', color: 'white' }}>
                {user?.first_name ? user.first_name.charAt(0) : 'U'}
                {user?.last_name ? user.last_name.charAt(0) : ''}
              </div>
              <span className="profile-name">{user?.first_name ? `${user.first_name} ${user?.last_name || ''}` : 'Workspace User'}</span>
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
                 <div className="contact-avatar large" style={{ backgroundColor: '#0ea5e9', color: 'white' }}>
                   {user?.first_name ? user.first_name.charAt(0) : 'U'}
                   {user?.last_name ? user.last_name.charAt(0) : ''}
                 </div>
                 <h4>{user?.first_name ? `${user.first_name} ${user?.last_name || ''}` : 'Workspace User'}</h4>
                 <p>{user?.email || 'No email provided'}</p>
               </div>
               
               <div className="drawer-menu">
                 <button className="drawer-menu-item">
                   <User size={18} /> Account Settings
                 </button>
                 <button className="drawer-menu-item" onClick={async () => {
                   await apiService.logout().catch(() => {});
                   window.location.href = '/app/login';
                 }}>
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
