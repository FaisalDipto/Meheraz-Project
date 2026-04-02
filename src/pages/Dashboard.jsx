import React, { useState, useEffect, useCallback } from 'react';
import { LayoutDashboard, MessageSquare, Book, UserRound, MessageCircleWarning, Settings, Plus, User, LogOut, ChevronDown, TrendingUp, Headphones, HelpCircle, Palette, Monitor, Users, Trash2, Mail, Menu, X, Edit2 } from 'lucide-react';
import { useWidget } from '../context/WidgetContext';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import './Dashboard.css';

// Sub-components
const Overview = ({ user, pages, onNavigate }) => {
  const [assigning, setAssigning] = useState({}); // {pageId: boolean}
  const [success, setSuccess] = useState({}); // {pageId: boolean}
  const [selectedAgents, setSelectedAgents] = useState(() => {
    try {
      const cached = localStorage.getItem('qchat_assigned_agents');
      return cached ? JSON.parse(cached) : {};
    } catch (e) {
      return {};
    }
  });

  const agents = user?.agents || [];

  useEffect(() => {
    if (!Array.isArray(pages) || pages.length === 0) return;

    setSelectedAgents(prev => {
      const nextAgents = { ...prev };
      let changed = false;

      pages.forEach(p => {
        let backendAgentId = null;
        if (p.agent_name) {
          const matched = agents.find(a => a.name === p.agent_name);
          if (matched) {
            backendAgentId = matched.agent_id;
          } else {
            // It's assigned by someone else, so we use a fallback placeholder ID
            backendAgentId = `foreign_agent_${p.agent_name}`;
          }
        }

        const agId = backendAgentId || p.agent_id || p.agent?.agent_id || p.agent?.id || p.assigned_agent_id;

        if (p.agent_name === null || p.agent_name === '') {
          if (nextAgents[p.page_id]) {
            delete nextAgents[p.page_id];
            changed = true;
          }
        } else if (agId) {
          if (nextAgents[p.page_id] !== agId) {
            nextAgents[p.page_id] = agId;
            changed = true;
          }
        }
      });

      if (changed) {
        try {
          localStorage.setItem('qchat_assigned_agents', JSON.stringify(nextAgents));
        } catch (e) { }
        return nextAgents;
      }
      return prev;
    });
  }, [pages, agents]);

  const handleAssign = async (pageId, agentId) => {
    if (!agentId) return;
    setAssigning(prev => ({ ...prev, [pageId]: true }));
    try {
      const response = await apiService.assignAgentToPage(pageId, agentId);
      console.log('Assign Agent API Response:', response);
      setSelectedAgents(prev => {
        const nextState = { ...prev, [pageId]: agentId };
        try {
          localStorage.setItem('qchat_assigned_agents', JSON.stringify(nextState));
        } catch (e) { }
        return nextState;
      });
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
        <p>Welcome back{user?.name || user?.username || user?.first_name ? `, ${user.name || user.username || user.first_name}` : ''}! Manage your pages and assign AI agents.</p>
      </div>

      <div className="pages-grid" style={{ paddingBottom: '40px' }}>
        {Array.isArray(pages) && pages.map(page => (
          <div key={page.page_id} className="page-card-container">
            <div className="giant-page-btn btn-blue">
              <UserRound size={48} className="page-icon" />
              <span className="page-name">{page.name}</span>
            </div>

            <div className="agent-assign-box">
              <label>Assigned Agent</label>
              <select
                value={selectedAgents[page.page_id] || ""}
                onChange={(e) => handleAssign(page.page_id, e.target.value)}
                disabled={assigning[page.page_id]}
                className={success[page.page_id] ? 'success-pulse' : ''}
              >
                <option value="" disabled>Select an Agent...</option>

                {selectedAgents[page.page_id] && String(selectedAgents[page.page_id]).startsWith('foreign_agent_') && (
                  <option value={selectedAgents[page.page_id]} disabled>
                    {String(selectedAgents[page.page_id]).replace('foreign_agent_', '')} (Assigned by teammate)
                  </option>
                )}

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

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const messageText = inputText;
    // Clear input immediately for better UX
    setInputText('');

    if (!selectedPageId || !activeContact) return;
    const convId = activeContact.conversation_id || activeContact.id;

    // Optimistically add message
    const tempMsg = {
      id: 'temp_' + Date.now(),
      message: messageText,
      is_ai_msg: true // to render it on the right side
    };
    setMessages(prev => [...prev, tempMsg]);

    console.log("Sending Payload to Backend:", { message: messageText });

    try {
      const response = await apiService.replyToConversation(selectedPageId, convId, messageText);
      console.log("Facebook Reply Endpoint Response:", response);
    } catch (err) {
      console.error("Failed to send message:", err);
      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
      alert("Failed to send message. Please try again.");
    }
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
            const updated = new Date(contact.updated_time || contact.last_message_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
              <label htmlFor="chatInput" style={{ display: 'none' }}>Message</label>
              <input
                id="chatInput"
                type="text"
                placeholder="Type a message..."
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
  const [feedbackType, setFeedbackType] = useState('Suggest Improvement');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim() || description.trim()) {
      try {
        await apiService.submitFeedback({
          type: feedbackType,
          title: title,
          details: description
        });
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setTitle('');
          setDescription('');
        }, 3000);
      } catch (err) {
        console.error('Feedback submit error:', err);
        alert('Failed to submit feedback. Please try again later.');
      }
    }
  };

  return (
    <div className="dashboard-content-area animate-fade-in-up">
      <div className="dashboard-header" style={{ textAlign: 'center', marginBottom: '32px', paddingTop: '20px' }}>
        <h3 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>Feedback</h3>
        <p style={{ color: '#334155', fontSize: '15px' }}>
          Give us Feedback, Report a Bug, or Tell us how we can improve.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}
      >
        <div className="form-group" style={{ position: 'relative' }}>
          <select
            value={feedbackType}
            onChange={(e) => setFeedbackType(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '15px',
              fontFamily: 'inherit',
              outline: 'none',
              boxSizing: 'border-box',
              backgroundColor: '#fff',
              color: 'var(--text-primary)',
              appearance: 'none',
              cursor: 'pointer',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onFocus={(e) => { e.target.style.borderColor = '#0ea5e9'; e.target.style.boxShadow = '0 0 0 3px rgba(14,165,233,0.12)'; }}
            onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
          >
            <option value="General">General</option>
            <option value="Report a bug">Report a bug</option>
            <option value="Suggest Improvement">Suggest Improvement</option>
            <option value="Feature Request">Feature Request</option>
          </select>
          <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#cbd5e1' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="feedbackTitle" style={{ display: 'none' }}>Title</label>
          <input
            id="feedbackTitle"
            type="text"
            placeholder="Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '15px',
              fontFamily: 'inherit',
              outline: 'none',
              boxSizing: 'border-box',
              backgroundColor: '#fff',
              color: 'var(--text-primary)',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onFocus={(e) => { e.target.style.borderColor = '#0ea5e9'; e.target.style.boxShadow = '0 0 0 3px rgba(14,165,233,0.12)'; }}
            onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="feedbackDetails" style={{ display: 'none' }}>Details</label>
          <textarea
            id="feedbackDetails"
            placeholder="Details *"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '15px',
              fontFamily: 'inherit',
              resize: 'vertical',
              outline: 'none',
              height: '140px',
              boxSizing: 'border-box',
              backgroundColor: '#fff',
              color: 'var(--text-primary)',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onFocus={(e) => { e.target.style.borderColor = '#0ea5e9'; e.target.style.boxShadow = '0 0 0 3px rgba(14,165,233,0.12)'; }}
            onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
          />
        </div>

        <button
          type="submit"
          className="btn-submit"
          style={{
            backgroundColor: submitted ? '#22c55e' : 'var(--bg-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '16px',
            fontSize: '16px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'background-color 0.25s, transform 0.1s',
            marginTop: '8px',
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
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
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [knowledgeType, setKnowledgeType] = useState('text');
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  const [fetchingDetails, setFetchingDetails] = useState(false);

  const handleViewClick = async (item) => {
    const actualId = item.id || item.knowledge_id || item.knowledgeId || item.uuid;
    if (!actualId || String(actualId).startsWith('temp_')) {
      return alert('Wait for the item to be fully saved in the database before viewing');
    }

    setFetchingDetails(true);
    try {
      const details = await apiService.getKnowledgeItem(selectedPageId, actualId);
      setViewingItem(details);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch details: ' + err.message);
    } finally {
      setFetchingDetails(false);
    }
  };

  const handleEditClick = async (item) => {
    const actualId = item.id || item.knowledge_id || item.knowledgeId || item.uuid;
    if (String(actualId).startsWith('temp_')) return alert('Wait for the item to be fully saved before editing');

    setName(item.name || item.data_source?.name || '');
    setTitle(item.title || '');
    setDescription(item.description || item.data_source?.text || '');
    setKnowledgeType('text');
    setEditingItemId(actualId);
    setShowModal(true);

    // Fetch the full detailed item just in case the list view omitted the heavy description field
    if (!item.description && !item.data_source?.text) {
      try {
        const details = await apiService.getKnowledgeItem(selectedPageId, actualId);
        if (details.description) setDescription(details.description);
        if (details.title && !item.title) setTitle(details.title);
      } catch (err) {
        console.warn('Failed to fetch full item details for edit modal', err);
      }
    }
  };

  const handleDelete = async (item) => {
    const actualId = item.id || item.knowledge_id || item.knowledgeId || item.uuid;
    if (!actualId || String(actualId).startsWith('temp_')) {
      return alert('Cannot delete item without a valid ID. Wait for save to complete.');
    }

    if (!window.confirm(`Are you sure you want to delete "${item.name || item.title || 'this document'}"?`)) return;

    const type = (item.knowledge_type === 'file' || item.file_name) ? 'file' : 'text';

    try {
      await apiService.deleteKnowledge(selectedPageId, actualId, type);
      setKnowledgeList(prev => prev.filter(k => (k.id || k.knowledge_id || k.knowledgeId || k.uuid) !== actualId));
    } catch (error) {
      console.error(error);
      alert('Failed to delete knowledge: ' + error.message);
    }
  };

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

    // For edits, we keep it blocking since it's fast
    if (editingItemId) {
      setUploading(true);
      try {
        if (!name.trim() || !title.trim() || !description.trim()) {
           setUploading(false);
           return alert('Name, Title, and Description are required');
        }
        const updateData = {
          name: name.trim(),
          title: title.trim(),
          description: description.trim()
        };
        await apiService.editKnowledge(selectedPageId, editingItemId, updateData);
        // Refresh list
        const updatedList = await apiService.getKnowledge(selectedPageId);
        setKnowledgeList(Array.isArray(updatedList) ? updatedList : (updatedList.results || updatedList.items || []));
        
        setShowModal(false);
        setName('');
        setTitle('');
        setDescription('');
        setSelectedFiles(null);
        setKnowledgeType('text');
        setEditingItemId(null);
      } catch (error) {
        console.error(error);
        alert('Failed to edit knowledge: ' + error.message);
      } finally {
        setUploading(false);
      }
      return;
    }

    // For Add Knowledge, we can run it optimistically and close the modal instantly!
    if (knowledgeType === 'text') {
        if (!name.trim() || !title.trim() || !description.trim()) {
            return alert('Name, Title, and Description are required');
        }
        const payload = {
          documents: [{ name: name.trim(), title: title.trim(), description: description.trim() }]
        };
        
        const optimisticId = 'temp_' + Date.now();
        setKnowledgeList(prev => [...prev, {
          id: optimisticId, name: name.trim(), title: title.trim(), description: description.trim(), knowledge_type: 'text'
        }]);

        // Background process
        apiService.createKnowledge(selectedPageId, payload)
          .then(() => apiService.getKnowledge(selectedPageId))
          .then(updatedList => setKnowledgeList(Array.isArray(updatedList) ? updatedList : (updatedList.results || updatedList.items || [])))
          .catch(error => {
            console.error(error);
            alert('Failed to add text knowledge: ' + error.message);
            setKnowledgeList(prev => prev.filter(k => k.id !== optimisticId));
          });
    } else {
        if (!selectedFiles || selectedFiles.length === 0) {
            return alert('Please select at least one file to upload');
        }
        const formData = new FormData();
        const tempItems = [];
        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append('files', selectedFiles[i]);
            tempItems.push({
              id: 'temp_file_' + Date.now() + '_' + i,
              name: selectedFiles[i].name,
              knowledge_type: 'file',
              file_name: selectedFiles[i].name
            });
        }
        
        setKnowledgeList(prev => [...prev, ...tempItems]);
        
        // Background process
        apiService.uploadKnowledgeFiles(selectedPageId, formData)
          .then(() => apiService.getKnowledge(selectedPageId))
          .then(updatedList => setKnowledgeList(Array.isArray(updatedList) ? updatedList : (updatedList.results || updatedList.items || [])))
          .catch(error => {
            console.error(error);
            alert('Failed to upload files: ' + error.message);
            const tempIds = tempItems.map(t => t.id);
            setKnowledgeList(prev => prev.filter(k => !tempIds.includes(k.id)));
          });
    }

    // Instantly close modal regardless of background processing
    setShowModal(false);
    setName('');
    setTitle('');
    setDescription('');
    setSelectedFiles(null);
    setKnowledgeType('text');
    setEditingItemId(null);
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

          <button className="btn-add-knowledge" onClick={() => {
            setName('');
            setTitle('');
            setDescription('');
            setSelectedFiles(null);
            setKnowledgeType('text');
            setEditingItemId(null);
            setShowModal(true);
          }}>
            <Plus size={18} /> Add Knowledge
          </button>
        </div>
      </div>

      <div className="knowledge-list">
        <div className="knowledge-header-row">
          <div className="k-col k-name">Name</div>
          <div className="k-col k-desc">Type</div>
          <div className="k-col k-actions" style={{ width: '80px', textAlign: 'right' }}>Actions</div>
        </div>

        {loading ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>Loading documents...</div>
        ) : knowledgeList.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>No documents found for this page.</div>
        ) : (
          knowledgeList.map((item, i) => (
            <div key={item.id || i} className="knowledge-item">
              <div className="k-col k-name">{item.name || item.title || item.data_source?.name || 'Unnamed Document'}</div>
              <div className="k-col k-desc">
                {item.knowledge_type === 'file' || item.file_name ? 'File' : item.knowledge_type === 'text' ? 'Raw Text' : (item.description ? 'Product Details' : (item.data_source?.url ? 'URL Link' : 'Raw Text'))}
              </div>
              <div className="k-col k-actions" style={{ width: '100px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                {!(item.knowledge_type === 'file' || item.file_name) && (
                  <>
                    <button
                      onClick={() => handleViewClick(item)}
                      style={{ background: 'transparent', border: 'none', color: '#10b981', cursor: 'pointer', padding: '4px' }}
                      title="View Details"
                      disabled={fetchingDetails}
                    >
                      <Book size={16} />
                    </button>
                    <button
                      onClick={() => handleEditClick(item)}
                      style={{ background: 'transparent', border: 'none', color: '#0ea5e9', cursor: 'pointer', padding: '4px' }}
                      title="Edit element"
                    >
                      <Edit2 size={16} />
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDelete(item)}
                  style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                  title="Delete element"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {viewingItem && (
        <div className="modal-overlay" onClick={() => setViewingItem(null)}>
          <div className="modal-content animate-fade-in-up" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>Knowledge Details</h3>
              <button type="button" onClick={() => setViewingItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '4px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '12px', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>Name</h4>
                  <div style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a' }}>{viewingItem.name || 'N/A'}</div>
                </div>

                <div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '12px', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>Title</h4>
                  <div style={{ fontSize: '16px', color: '#334155' }}>{viewingItem.title || 'N/A'}</div>
                </div>

                <div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '12px', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>Description</h4>
                  <div style={{ fontSize: '15px', color: '#475569', lineHeight: '1.6', whiteSpace: 'pre-wrap', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>{viewingItem.description || 'N/A'}</div>
                </div>

                <div style={{ display: 'flex', gap: '32px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8' }}>Knowledge ID</h4>
                    <div style={{ fontSize: '13px', color: '#64748b', fontFamily: 'monospace', background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px' }}>{viewingItem.knowledge_id || viewingItem.id || viewingItem.uuid || 'N/A'}</div>
                  </div>
                  {viewingItem.created_at && (
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8' }}>Created</h4>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>{new Date(viewingItem.created_at).toLocaleString()}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-actions" style={{ marginTop: '24px' }}>
              <button type="button" className="btn-cancel" onClick={() => setViewingItem(null)} style={{ background: '#0ea5e9', color: 'white', border: 'none' }}>Close Details</button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in-up" style={{ maxWidth: '600px' }}>
            <h3>{editingItemId ? 'Edit Knowledge' : 'Add New Knowledge'}</h3>

            <form className="modal-form" onSubmit={handleAddKnowledge}>
              {!editingItemId && (
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label>Knowledge Type</label>
                  <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '8px', padding: '4px', marginTop: '10px' }}>
                    <div 
                      onClick={() => setKnowledgeType('text')}
                      style={{ flex: 1, textAlign: 'center', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 500, color: knowledgeType === 'text' ? '#0f172a' : '#64748b', background: knowledgeType === 'text' ? '#ffffff' : 'transparent', boxShadow: knowledgeType === 'text' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s' }}
                    >
                      Raw Text
                    </div>
                    <div 
                      onClick={() => setKnowledgeType('file')}
                      style={{ flex: 1, textAlign: 'center', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 500, color: knowledgeType === 'file' ? '#0f172a' : '#64748b', background: knowledgeType === 'file' ? '#ffffff' : 'transparent', boxShadow: knowledgeType === 'file' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s' }}
                    >
                      File Upload
                    </div>
                  </div>
                </div>
              )}

              {knowledgeType === 'text' || editingItemId ? (
                <>
                  <div className="form-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Product_Specs"
                      value={name}
                      onChange={e => {
                        const val = e.target.value.replace(/[^a-zA-Z0-9 _-]/g, '');
                        if (val.length <= 50) setName(val);
                      }}
                      maxLength={50}
                      required={knowledgeType === 'text'}
                    />
                    <small style={{ color: '#64748b', marginTop: '6px', fontSize: '12px', display: 'block' }}>Max 50 characters. Letters, numbers, spaces, _, and - only.</small>
                  </div>

                  <div className="form-group">
                    <label>Title *</label>
                    <input type="text" placeholder="e.g. Premium Plan Features" value={title} onChange={e => setTitle(e.target.value)} required={knowledgeType === 'text'} />
                  </div>

                  <div className="form-group">
                    <label>Description *</label>
                    <textarea placeholder="Provide detailed product description or information..." value={description} onChange={e => setDescription(e.target.value)} rows="4" required={knowledgeType === 'text'}></textarea>
                  </div>
                </>
              ) : (
                <div className="form-group">
                  <label>Upload Files *</label>
                  <div style={{ border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '40px', textAlign: 'center', marginTop: '12px', background: '#f8fafc', position: 'relative' }}>
                    <input 
                      type="file" 
                      multiple 
                      onChange={e => setSelectedFiles(e.target.files)} 
                      style={{ 
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' 
                      }}
                      required={knowledgeType === 'file'}
                    />
                    <p style={{ margin: 0, color: '#0ea5e9', fontWeight: 500, fontSize: '15px' }}>
                      {selectedFiles && selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : 'Click to Browse Files or Drag & Drop'}
                    </p>
                    <p style={{ color: '#64748b', margin: '8px 0 0 0', fontSize: '13px' }}>Supported formats: PDF, TXT, DOCX, CSV</p>
                    {selectedFiles && selectedFiles.length > 0 && (
                      <div style={{ marginTop: '16px', textAlign: 'left', background: '#fff', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0', maxHeight: '100px', overflowY: 'auto' }}>
                        {Array.from(selectedFiles).map((file, idx) => (
                          <div key={idx} style={{ fontSize: '13px', color: '#334155', padding: '4px 0', borderBottom: idx < selectedFiles.length - 1 ? '1px solid #f1f5f9' : 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            ✓ {file.name} ({(file.size / 1024).toFixed(1)} KB)
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="modal-actions" style={{ marginTop: '32px' }}>
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)} disabled={uploading}>Cancel</button>
                <button type="submit" className="btn-submit" disabled={uploading}>{uploading ? 'Processing...' : (editingItemId ? 'Save Changes' : 'Upload')}</button>
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

const AgentPanel = ({ user, onUpdate, onAgentCreated, onAgentEdited }) => {
  const agents = user?.agents || [];
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAgentId, setEditingAgentId] = useState(null);

  const [agentName, setAgentName] = useState('');
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [tone, setTone] = useState('Professional');
  const [language, setLanguage] = useState('English');
  const [businessName, setBusinessName] = useState('');
  const [businessDesc, setBusinessDesc] = useState('');
  const [instructions, setInstructions] = useState('');
  const [fallbackMessage, setFallbackMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);

  const TONES = ["Professional", "Friendly", "Formal", "Casual", "Persuasive", "Empathetic", "Confident"];
  const LANGUAGES = ["Mimic User Language", "English", "Arabic", "Spanish", "French", "German", "Portuguese", "Hindi", "Bengali"];

  const REVERSE_ROLE_MAP = { 'Sales Agent': 'sales', 'Support Agent': 'support', 'Q&A Agent': 'qa' };

  const handleEditClick = (agent) => {
    setIsEditing(true);
    setIsCreating(false);
    setEditingAgentId(agent.agent_id);

    setAgentName(agent.name || '');
    setBusinessName(agent.business_name || '');
    setBusinessDesc(agent.business_description || '');
    setInstructions(agent.instructions || '');
    setFallbackMessage(agent.fallback_message || '');
    setSelectedPersona(REVERSE_ROLE_MAP[agent.role] || 'sales');
    setTone(agent.tone || 'Professional');
    setLanguage(agent.language || 'English');
  };

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
        instructions: instructions.trim() || null,
        fallback_message: fallbackMessage.trim() || null
      };

      if (isEditing) {
        await apiService.updateAgent(editingAgentId, payload);
        if (onAgentEdited) onAgentEdited(editingAgentId, payload);
      } else {
        const userId = user?.email || 'default_user_session';
        const newAgent = await apiService.createAgent(userId, payload);
        if (onAgentCreated) onAgentCreated(newAgent);
      }

      setCreated(true);
      setTimeout(() => {
        setCreated(false);
        setAgentName('');
        setSelectedPersona(null);
        setBusinessName('');
        setBusinessDesc('');
        setInstructions('');
        setFallbackMessage('');
        setIsCreating(false);
        setIsEditing(false);
        setEditingAgentId(null);
      }, 3000);
    } catch (error) {
      console.error('Failed to create agent:', error);
      alert('Failed to create agent: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isCreating && !isEditing) {
    return (
      <div className="dashboard-content-area animate-fade-in-up">
        <div className="dashboard-header">
          <h2>Your Agents</h2>
          <p>Manage your AI agents or create a new one.</p>
        </div>

        <div className="pages-grid" style={{ paddingBottom: '40px' }}>
          {agents.map(agent => (
            <div key={agent.agent_id} className="page-card-container" style={{ position: 'relative' }}>
              <button
                onClick={() => handleEditClick(agent)}
                style={{ position: 'absolute', top: '12px', right: '12px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', transition: 'all 0.2s' }}
                title="Edit Agent"
                onMouseEnter={(e) => e.currentTarget.style.color = '#0ea5e9'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
              >
                <Edit2 size={16} />
              </button>
              <div className="giant-page-btn btn-blue" style={{ cursor: 'default' }}>
                <UserRound size={48} className="page-icon" />
                <span className="page-name">{agent.name}</span>
              </div>

              <div className="agent-assign-box" style={{ textAlign: 'center', paddingTop: '16px' }}>
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>Role: <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{agent.role}</span></div>
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>Tone: <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{agent.tone}</span></div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '12px', wordBreak: 'break-all', padding: '6px', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
                  <span style={{ fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '2px' }}>Agent ID</span>
                  {agent.agent_id}
                </div>
              </div>
            </div>
          ))}

          {/* Create Agent Placeholder */}
          <div className="page-card-container">
            <button className="giant-page-btn btn-add-dashed" onClick={() => setIsCreating(true)}>
              <UserRound size={48} className="page-icon" />
              <span className="page-name">Create Agent</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content-area animate-fade-in-up">
      <div className="dashboard-header flex-between" style={{ alignItems: 'center', marginBottom: '32px', maxWidth: '600px', margin: '0 auto' }}>
        <button onClick={() => { setIsCreating(false); setIsEditing(false); setEditingAgentId(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600, padding: '0' }}>
          <ChevronDown size={18} style={{ transform: 'rotate(90deg)' }} /> Back to Agents
        </button>
      </div>

      <div className="dashboard-header" style={{ textAlign: 'center', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px auto' }}>
        <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>{isEditing ? 'Edit Your Agent' : 'Create Your Agent'}</h3>
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

        <div className="form-group">
          <label>Fallback Message (Optional)</label>
          <textarea placeholder="e.g. I'm not sure about that, let me connect you with someone who can help." value={fallbackMessage} onChange={(e) => setFallbackMessage(e.target.value)} rows="2" style={{ padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }} />
        </div>

        <button type="submit" className="btn-submit" disabled={loading} style={{ backgroundColor: created ? '#22c55e' : (loading ? '#94a3b8' : 'var(--text-primary)'), color: '#fff', border: 'none', borderRadius: '8px', padding: '14px', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background-color 0.25s' }}>
          {loading ? (isEditing ? 'Saving...' : 'Creating...') : (created ? (isEditing ? '✓ Settings Saved!' : '✓ Agent Created!') : (isEditing ? 'Save Changes' : 'Create Agent'))}
        </button>
      </form>
    </div>
  );
};

/* ─────────────────────────────────────────
   SETTINGS PANEL
───────────────────────────────────────── */
const THEMES = [
  { id: 'sky', label: 'Sky Blue', primary: '#87CEEB', accent: '#0ea5e9' },
  { id: 'slate', label: 'Slate', primary: '#94a3b8', accent: '#475569' },
  { id: 'violet', label: 'Violet', primary: '#a78bfa', accent: '#7c3aed' },
  { id: 'rose', label: 'Rose', primary: '#fb7185', accent: '#e11d48' },
  { id: 'emerald', label: 'Emerald', primary: '#6ee7b7', accent: '#059669' },
  { id: 'amber', label: 'Amber', primary: '#fcd34d', accent: '#d97706' },
];

const INITIAL_TEAM = [
  { id: 1, name: 'John Smith', email: 'john.smith@company.com', role: 'Admin', avatar: 'JS', color: '#0ea5e9' },
  { id: 2, name: 'Alice Tan', email: 'alice.tan@company.com', role: 'Agent', avatar: 'AT', color: '#8b5cf6' },
  { id: 3, name: 'Bob Reyes', email: 'bob.reyes@company.com', role: 'Agent', avatar: 'BR', color: '#10b981' },
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
    { id: 'themes', icon: Palette, label: 'Themes' },
    { id: 'widget', icon: Monitor, label: 'Widget Appearance' },
    { id: 'team', icon: Users, label: 'Team Members' },
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
                          <svg width="9" height="7" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
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
                    {['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#e11d48', '#374151'].map(c => (
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
                        border: !['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#e11d48', '#374151'].includes(widgetColor) ? '3px solid #374151' : '1px solid #e2e8f0',
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
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
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
      console.log("API Pages Response:", pagesData);
      const agentsData = await apiService.getAgents();

      const parsedUser = userData?.user || userData || null;
      const parsedPages = Array.isArray(pagesData) ? pagesData : (pagesData?.pages || pagesData?.data || []);
      const parsedAgents = Array.isArray(agentsData) ? agentsData : (agentsData?.agents || agentsData?.data || []);

      if (parsedUser) parsedUser.agents = parsedAgents;
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

    switch (activeTab) {
      case 'overview': return <Overview user={user} pages={pages} onNavigate={setActiveTab} />;
      case 'conversation': return <ConversationList pages={pages} />;
      case 'knowledge': return <Knowledge pages={pages} />;
      case 'agent': return <AgentPanel user={user} onUpdate={fetchData} onAgentCreated={(newAgent) => setUser(prev => prev ? { ...prev, agents: [...(prev.agents || []), newAgent] } : prev)} onAgentEdited={(id, payload) => setUser(prev => prev ? { ...prev, agents: (prev.agents || []).map(a => a.agent_id === id ? { ...a, ...payload } : a) } : prev)} />;
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
            <UserRound size={20} />
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
                {(user?.name || user?.username || user?.first_name || 'U').charAt(0).toUpperCase()}
                {user?.last_name ? user.last_name.charAt(0).toUpperCase() : ''}
              </div>
              <span className="profile-name">{user?.username || user?.name || (user?.first_name ? `${user.first_name} ${user?.last_name || ''}` : '') || user?.email || 'User'}</span>
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
                  {(user?.name || user?.username || user?.first_name || 'U').charAt(0).toUpperCase()}
                  {user?.last_name ? user.last_name.charAt(0).toUpperCase() : ''}
                </div>
                <h4>{user?.username || user?.name || (user?.first_name ? `${user.first_name} ${user?.last_name || ''}` : '') || user?.email || 'User'}</h4>
                <p>{user?.email || 'No email provided'}</p>
              </div>

              <div className="drawer-menu">
                <button className="drawer-menu-item">
                  <User size={18} /> Account Settings
                </button>
                <button className="drawer-menu-item" onClick={async () => {
                  await apiService.logout().catch(() => { });
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
