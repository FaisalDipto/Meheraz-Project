import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import { LayoutDashboard, MessageSquare, Book, UserRound, MessageCircleWarning, Settings, Plus, User, LogOut, ChevronDown, TrendingUp, Headphones, HelpCircle, Palette, Monitor, Users, Trash2, Mail, Menu, X, Edit2 } from 'lucide-react';
import { useWidget } from '../context/WidgetContext';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import './Dashboard.css';
import logoImg from '../assets/logo1.png';
import titleImg from '../assets/title.png';

// Sub-components
const Overview = ({ user, pages, onNavigate, onUpdate }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [assigning, setAssigning] = useState({}); // {pageId: boolean}
  const [success, setSuccess] = useState({}); // {pageId: boolean}
  const [selectedAgents, setSelectedAgents] = useState(() => {
    try {
      const cached = localStorage.getItem('lyfflow_assigned_agents');
      return cached ? JSON.parse(cached) : {};
    } catch (e) {
      return {};
    }
  });

  const agents = user?.agents || [];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.custom-dropdown-container')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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
          localStorage.setItem('lyfflow_assigned_agents', JSON.stringify(nextAgents));
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
          localStorage.setItem('lyfflow_assigned_agents', JSON.stringify(nextState));
        } catch (e) { }
        return nextState;
      });
      setSuccess(prev => ({ ...prev, [pageId]: true }));
      setTimeout(() => {
        setSuccess(prev => ({ ...prev, [pageId]: false }));
      }, 3000);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Failed to assign agent:", error);
      alert("Failed to assign agent: " + error.message);
    } finally {
      setAssigning(prev => ({ ...prev, [pageId]: false }));
    }
  };

  const handleUnassign = async (pageId) => {
    setAssigning(prev => ({ ...prev, [pageId]: true }));
    try {
      await apiService.unassignAgentFromPage(pageId);
      setSelectedAgents(prev => {
        const nextState = { ...prev };
        delete nextState[pageId];
        try {
          localStorage.setItem('lyfflow_assigned_agents', JSON.stringify(nextState));
        } catch (e) { }
        return nextState;
      });
      setSuccess(prev => ({ ...prev, [pageId]: true }));
      setTimeout(() => {
        setSuccess(prev => ({ ...prev, [pageId]: false }));
      }, 3000);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Failed to unassign agent:", error);
      alert("Failed to unassign agent: " + error.message);
    } finally {
      setAssigning(prev => ({ ...prev, [pageId]: false }));
    }
  };

  return (
    <div className="dashboard-content-area animate-fade-in-up flex-1 p-4 md:p-6 xl:p-8 space-y-6 xl:space-y-12 w-full text-left bg-surface-bright">
      {/* Hero Header */}
      <div className="flex justify-between items-end">
        <div>
          <span className="label-md uppercase tracking-[0.2em] text-outline mb-1 sm:mb-2 block font-label font-semibold text-xs sm:text-sm">Active Workspace</span>
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-headline font-black tracking-tighter text-primary">My Workspace</h1>
        </div>
        <div className="hidden sm:flex gap-3">
          <div className="flex -space-x-2">
            <img alt="Team member" className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmshpeiThC41D3oYoeWJPdOlPAZgPL4Q27QrQJqYQAk0lqbXxdOvgSHyv35ROzxQfzvc5ATVnSTUsJxi_Lr01YfpSP8hQ_5Ntk_Zpa2wIN9s0vUuGx-9geekTRAiwTnfHxLoiuUsfyimTDVFEZkrqmIJiaeehJD4un5GZv0DOqmeBI17YqzYT12OuO-ELphoCuIF0s0b_vmtjqRMich8eWky8JOxPRQGvY4wcbSc3dMYyptqBqITQtQZAR0p-TXDaZJ-FeUOugt38"/>
            <img alt="Team member" className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD17OerDChMrHv2dHx2sdIJRo6zgSAywzPvjIFEDcvczs-PE5Lt_tHErvdbnmvZWLkRpa1N-XUEdRbco2MftgKHV7gsnPYCFJy3YllMVT8P21etDi21ooo5rS-C_Yc0ekW6yrBRfUQtFPVdhWr62EFUpv7Z1nVJ3IPUzd7OS9y_U94KPA8aCq2NIvvt4HFN9QdlESzX7KBzxUoCTaWtnZz-m0vmJl6woSLXTGl_nuYalWAxprWDYgsU95Vlqd6Jb8rDVo8dGMNc3tU"/>
            <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-500">+4</div>
          </div>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {Array.isArray(pages) && pages.map((page, index) => {
          const isEven = index % 2 === 0;
          const cardBorder = isEven ? "border-emerald-500" : "border-primary";
          const iconBg = isEven ? "bg-emerald-100" : "bg-slate-900";
          const iconColor = isEven ? "text-emerald-600" : "text-white";
          const iconName = isEven ? "movie" : "chat_bubble";
          const assignHoverBorder = isEven ? "group-hover:border-emerald-100" : "group-hover:border-slate-200";
          const assignIconColor = isEven ? "text-emerald-500" : "text-primary";
          const assignIconName = isEven ? "person" : "smart_toy";
          const barBg = isEven ? "bg-emerald-500" : "bg-primary";
          const barWidth = isEven ? "75%" : "50%";
          const percentageColor = isEven ? "text-emerald-600" : "text-primary";
          
          return (
            <div key={page.page_id} className={`group bg-surface-container-lowest rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border-t-4 ${cardBorder}`}>
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center`}>
                  <span className={`material-symbols-outlined ${iconColor} text-3xl`} data-icon={iconName}>{iconName}</span>
                </div>
                <button className="p-2 text-slate-300 hover:text-slate-600">
                  <span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
                </button>
              </div>
              <h3 className="text-2xl font-headline font-bold text-primary mb-1">{page.name}</h3>
              <p className="text-on-surface-variant text-sm mb-6">{page.description || 'Automated agent assignments and settings for this workspace.'}</p>
              <div className="space-y-4">
                <div className={`flex items-center justify-between p-3 bg-surface-container-low rounded-lg border border-transparent ${assignHoverBorder} transition-colors`}>
                  <div className="flex items-center gap-3">
                    <span className={`material-symbols-outlined ${assignIconColor}`} data-icon={assignIconName}>{assignIconName}</span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-outline">Assigned Agent</span>
                  </div>
                  <div className="relative custom-dropdown-container flex items-center justify-end">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === page.page_id ? null : page.page_id)}
                      disabled={assigning[page.page_id]}
                      className={`flex items-center gap-1 bg-transparent border-none text-sm font-bold p-0 focus:ring-0 cursor-pointer hover:text-emerald-600 transition-colors ${success[page.page_id] ? 'text-green-500' : 'text-primary'}`}
                    >
                      {assigning[page.page_id] ? 'Assigning...' : (
                        agents.find(a => a.agent_id === selectedAgents[page.page_id])?.name || 
                        (selectedAgents[page.page_id] && String(selectedAgents[page.page_id]).startsWith('foreign_agent_') ? `${String(selectedAgents[page.page_id]).replace('foreign_agent_', '')} (Team)` : 'Select Agent')
                      )}
                      <span className="material-symbols-outlined text-[18px]">expand_more</span>
                    </button>

                    {openDropdown === page.page_id && (
                      <div className="absolute top-[120%] right-0 w-[200px] bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-100 z-[999] overflow-hidden text-left py-1 animate-fade-in-up">
                        {agents.length === 0 ? (
                          <div className="px-4 py-3 text-sm text-slate-500 font-medium text-center">No agents available</div>
                        ) : (
                          agents.map(agent => (
                            <button
                              key={agent.agent_id}
                              onClick={() => {
                                handleAssign(page.page_id, agent.agent_id);
                                setOpenDropdown(null);
                              }}
                              className={`w-full text-left px-4 py-2.5 text-[13px] font-semibold hover:bg-slate-50 transition-colors flex items-center justify-between border-transparent border-none cursor-pointer ${selectedAgents[page.page_id] === agent.agent_id ? 'text-emerald-600 bg-emerald-50/50' : 'text-slate-700 bg-white'}`}
                            >
                              <span className="truncate pr-2">{agent.name}</span>
                              {selectedAgents[page.page_id] === agent.agent_id && (
                                <span className="material-symbols-outlined text-[16px] text-emerald-500 shrink-0">check</span>
                              )}
                            </button>
                          ))
                        )}
                        <div className="border-t border-slate-100 my-1"></div>
                        {selectedAgents[page.page_id] && (
                          <button
                            onClick={() => {
                              handleUnassign(page.page_id);
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left px-4 py-2.5 text-[13px] font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 border-none bg-white cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">person_remove</span>
                            Unassign Agent
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setOpenDropdown(null);
                            onNavigate('agent'); // Jump straight to Agents tab
                          }}
                          className="w-full text-left px-4 py-2.5 text-[13px] font-semibold text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-2 border-none bg-white cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">add</span>
                          Create New
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${barBg}`} style={{width: barWidth}}></div>
                  </div>
                  <span className={`text-xs font-bold ${percentageColor}`}>{barWidth}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add Page Placeholder Card */}
        <button className="group border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center gap-4 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all duration-300 min-h-[250px] bg-transparent">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
            <span className="material-symbols-outlined text-2xl" data-icon="add">add</span>
          </div>
          <div className="text-center">
            <span className="block font-headline font-bold text-slate-400 group-hover:text-emerald-600">Add New Page</span>
            <span className="text-xs text-slate-300 uppercase tracking-widest font-semibold mt-1 block">Project Canvas</span>
          </div>
        </button>
      </div>
    </div>
  );
};

const ConversationList = ({ pages, user }) => {
  const [selectedPageId, setSelectedPageId] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileVisible, setIsProfileVisible] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (pages && pages.length > 0 && !selectedPageId) {
      setSelectedPageId(pages[0].page_id);
    }
  }, [pages]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.page-dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!selectedPageId) return;
    setLoading(true);
    apiService.getPageDetails(selectedPageId)
      .then(data => {
        // Handle FB Graph variations
        const convs = data?.conversations?.data || data?.conversations || data?.data || [];
        const normalized = Array.isArray(convs) ? convs : [];
        setContacts(normalized);
        if (normalized.length > 0) setActiveContact(normalized[0]);
        else setActiveContact(null);

        // Fetch snippets asynchronously to populate last message without blocking UI
        normalized.forEach(conv => {
          const cId = conv.conversation_id || conv.id;
          if (!cId) return;
          apiService.getConversationDetails(selectedPageId, cId)
            .then(details => {
              const msgs = details?.messages?.data || details?.messages || details?.data || [];
              if (Array.isArray(msgs) && msgs.length > 0) {
                const lastMsg = msgs[0]; // FB returns newest first
                setContacts(prev => prev.map(c => 
                  (c.conversation_id || c.id) === cId 
                    ? { ...c, last_message: lastMsg.message, updated_time: lastMsg.created_time || lastMsg.timestamp || Date.now() }
                    : c
                ));
              }
            }).catch(() => {});
        });
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
    const name = contactObj?.senders?.data?.[0]?.name || contactObj?.participants?.data?.[0]?.name || contactObj?.name || 'U';
    const initial = name.charAt(0).toUpperCase();
    return (
      <img
        alt={name}
        className={`${extraClass} object-cover grayscale brightness-110`}
        src={`https://ui-avatars.com/api/?name=${initial}&background=random&font-size=0.4`}
      />
    );
  };

  const renderChatMessage = (msg) => {
    let isMe = true;
    if (msg.role === 'user') {
      isMe = false;
    } else if (msg.is_ai_msg === true) {
      isMe = true;
    } else {
      const customerId = activeContact?.senders?.data?.[0]?.id || activeContact?.participants?.data?.[0]?.id || activeContact?.id;
      const fromId = msg?.from?.id;
      if (fromId && customerId) {
        isMe = fromId !== customerId;
      }
    }

    const timeStr = msg.created_time || msg.timestamp 
          ? new Date(msg.created_time || msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
          : 'Now';

    if (isMe) {
      // Sent message
      return (
        <div key={msg.id || msg.message_id || Math.random()} className="flex gap-4 max-w-2xl ml-auto flex-row-reverse group">
          <div className="space-y-2 flex flex-col items-end">
            <div className="bg-slate-900 text-white p-5 rounded-t-3xl rounded-bl-3xl text-[15px] leading-relaxed shadow-xl">
              {msg.message || msg.text || ''}
            </div>
            <p className="text-[10px] text-slate-400 font-medium px-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {timeStr} <span className="material-symbols-outlined text-[12px] text-emerald-500" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
            </p>
          </div>
        </div>
      );
    } else {
      // Received message
      return (
        <div key={msg.id || msg.message_id || Math.random()} className="flex gap-4 max-w-2xl group">
          {renderAvatar(activeContact, "w-8 h-8 rounded-full self-end")}
          <div className="space-y-2">
            <div className="bg-slate-50 text-slate-900 p-5 rounded-t-3xl rounded-br-3xl text-[15px] leading-relaxed shadow-sm border border-slate-200">
              {msg.message || msg.text || ''}
            </div>
            <p className="text-[10px] text-slate-400 font-medium px-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {timeStr}
            </p>
          </div>
        </div>
      );
    }
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
    <div className="flex h-full w-full bg-slate-50 animate-fade-in-up flex-1 overflow-hidden">
      {/* Conversation List Column */}
      <main className={`flex flex-col bg-slate-50 border-r border-slate-200 shrink-0 ${mobileShowChat ? 'hidden md:flex' : 'flex'} w-full md:w-96`}>
        <div className="p-4 md:p-8">
          <header className="mb-8 flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase mb-2">Inbox</p>
              <h1 className="text-3xl font-black font-['Epilogue'] tracking-tighter text-slate-900">Messages</h1>
            </div>
            <div className="relative page-dropdown-container">
               <button 
                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                 className="flex items-center gap-2 p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors bg-white relative z-0 cursor-pointer"
               >
                 <span className="material-symbols-outlined text-lg">page_info</span>
                 <span className="text-xs font-bold truncate max-w-[80px]">
                   {pages.find(p => p.page_id === selectedPageId)?.name || 'Select Page'}
                 </span>
                 <span className="material-symbols-outlined text-[16px]">expand_more</span>
               </button>

               {isDropdownOpen && (
                 <div className="absolute top-[110%] right-0 w-[220px] bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-100 z-[999] overflow-hidden py-1 animate-fade-in-up">
                    <div className="px-4 py-2 border-b border-slate-50 mb-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Page</p>
                    </div>
                    {pages.map(p => (
                      <button
                        key={p.page_id}
                        onClick={() => {
                          setSelectedPageId(p.page_id);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-[13px] font-semibold hover:bg-slate-50 transition-colors flex items-center justify-between border-none cursor-pointer ${selectedPageId === p.page_id ? 'text-emerald-600 bg-emerald-50/50' : 'text-slate-700 bg-white'}`}
                      >
                        <span className="truncate pr-2">{p.name}</span>
                        {selectedPageId === p.page_id && (
                          <span className="material-symbols-outlined text-[16px] text-emerald-500 shrink-0" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                        )}
                      </button>
                    ))}
                 </div>
               )}
            </div>
          </header>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors">search</span>
            <input className="w-full bg-white border border-slate-200 shadow-sm rounded-xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-slate-900 outline-none transition-all text-slate-900 placeholder:text-slate-400" placeholder="Search conversations..." type="text"/>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-2">
          {loading ? (
            <div className="p-8 text-center text-slate-400 font-medium text-sm">Loading channels...</div>
          ) : contacts.length === 0 ? (
            <div className="p-8 text-center text-slate-400 font-medium text-sm">No ongoing conversations.</div>
          ) : contacts.map((contact, i) => {
            const contactName = contact.name || contact.senders?.data?.[0]?.name || contact.participants?.data?.[0]?.name || `User ${i}`;
            const snippet = contact.snippet || contact.last_message || contact.messages?.data?.[0]?.message || contact.messages?.[0]?.message || 'No messages';
            const updatedTimeValue = contact.updated_time || contact.last_message_at || contact.updated;
            const updated = updatedTimeValue ? new Date(updatedTimeValue).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
            const id = contact.conversation_id || contact.id || i;
            const isActive = (activeContact?.id || activeContact?.conversation_id) === id;

            return (
              <div
                key={id}
                onClick={() => { setActiveContact(contact); setMobileShowChat(true); }}
                className={`p-4 rounded-2xl transition-colors cursor-pointer group ${isActive ? 'bg-white shadow-sm border-l-4 border-emerald-500' : 'hover:bg-slate-200/50'}`}
              >
                <div className="flex gap-4 items-center">
                  {renderAvatar(contact, `w-12 h-12 rounded-full ${isActive ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`)}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <h3 className="font-bold text-slate-900 truncate">{contactName}</h3>
                        {contact.is_human_needed && (
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse" title="Needs Human Support"></span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{updated}</span>
                    </div>
                    <p className={`text-sm truncate font-semibold ${isActive ? 'text-emerald-600' : contact.is_human_needed ? 'text-red-500' : 'text-slate-500 font-medium'}`}>{snippet}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Active Chat Window */}
      <section className={`flex-col bg-white border-r border-slate-100 ${mobileShowChat ? 'flex' : 'hidden md:flex'} flex-1`}>
        {activeContact ? (
          <>
            <header className="h-20 px-4 md:px-8 flex items-center justify-between bg-white/80 backdrop-blur-md z-10 border-b border-slate-50">
              <div className="flex items-center gap-3">
                {/* Mobile back button */}
                <button
                  onClick={() => setMobileShowChat(false)}
                  className="md:hidden p-2 -ml-1 text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="relative">
                  {renderAvatar(activeContact, "w-10 h-10 rounded-full")}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h2 className="font-['Epilogue'] font-bold text-lg text-slate-900 tracking-tight">
                    {activeContact?.senders?.data?.[0]?.name || activeContact?.name || 'User'}
                  </h2>
                  <div className="flex items-center gap-2">
                    {activeContact?.is_human_needed ? (
                      <p className="text-[10px] text-red-500 font-black tracking-widest uppercase flex items-center gap-1">
                        <span className="material-symbols-outlined text-[10px] animate-pulse">warning</span>
                        Manual Support Needed
                      </p>
                    ) : (
                      <p className="text-[10px] text-emerald-600 font-bold tracking-widest uppercase">Autonomous Mode</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6 text-slate-400">
                <button className="hover:text-slate-900 transition-colors"><span className="material-symbols-outlined">call</span></button>
                <button className="hover:text-slate-900 transition-colors"><span className="material-symbols-outlined">videocam</span></button>
                <button 
                  onClick={() => setIsProfileVisible(!isProfileVisible)}
                  className={`hover:text-slate-900 transition-colors ${!isProfileVisible ? 'text-emerald-600' : ''}`}
                  title={isProfileVisible ? "Hide Profile" : "Show Profile"}
                >
                  <span className="material-symbols-outlined">{isProfileVisible ? 'side_navigation' : 'person_search'}</span>
                </button>
                <button className="hover:text-slate-900 transition-colors"><span className="material-symbols-outlined">more_vert</span></button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/20">
              {loadingMsgs ? (
                <div className="text-center text-slate-400 mt-10">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-center text-slate-400 mt-10">No messages available.</div>
              ) : (
                <>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase py-2 px-4 rounded-full bg-slate-100 mb-6">Chat History</span>
                  </div>
                  {messages.map(msg => renderChatMessage(msg))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            <footer className="p-8 bg-white border-t border-slate-50">
              <div className="max-w-4xl mx-auto flex items-center gap-4 bg-slate-50 rounded-2xl p-2 pr-4 shadow-sm border border-slate-200 focus-within:border-slate-900 transition-colors">
                <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                  <span className="material-symbols-outlined">attach_file</span>
                </button>
                <input 
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium py-3 text-slate-900 placeholder:text-slate-400 outline-none" 
                  placeholder="Type your message..." 
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <div className="flex items-center gap-2">
                  <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                    <span className="material-symbols-outlined">mood</span>
                  </button>
                  <button 
                    className="bg-slate-900 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-md hover:scale-105 transition-transform"
                    onClick={handleSend}
                  >
                    <span className="material-symbols-outlined text-xl">send</span>
                  </button>
                </div>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 font-medium">
            Select a conversation to view chat history
          </div>
        )}
      </section>

      {/* Profile Right Sidebar - hidden on mobile */}
      {isProfileVisible && (
        <aside className="w-80 bg-white hidden xl:flex flex-col overflow-y-auto shrink-0 border-l border-slate-100 animate-fade-in-right">
          {activeContact ? (
          <div className="p-8">
            <div className="flex justify-center mb-8">
              <div className="relative">
                {renderAvatar(activeContact, "w-32 h-32 rounded-3xl shadow-xl")}
                <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-lg">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="text-center mb-10">
              <h2 className="text-2xl font-black font-['Epilogue'] tracking-tighter text-slate-900">
                {activeContact?.senders?.data?.[0]?.name || activeContact?.name || 'User'}
              </h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Chat Participant</p>
              <div className="flex justify-center flex-wrap gap-2 mt-4">
                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">{user?.subscription?.plan?.plan_name || 'FREE Plan'}</span>
                {activeContact?.is_human_needed ? (
                  <span className="bg-red-100 text-red-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider animate-bounce-subtle">Needs Human</span>
                ) : (
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Managed by AI</span>
                )}
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h4 className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase mb-4 border-b border-slate-100 pb-2">Information</h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-sm text-slate-400 mt-0.5">mail</span>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Email / Source</p>
                      <p className="text-xs font-semibold text-slate-900 truncate max-w-[200px]">Facebook Messenger</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-sm text-slate-400 mt-0.5">schedule</span>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Local Time</p>
                      <p className="text-xs font-semibold text-slate-900">Current Time</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase mb-4 border-b border-slate-100 pb-2">Shared Files</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="aspect-square bg-slate-50 rounded-xl flex flex-col items-center justify-center gap-1 group hover:bg-slate-900 transition-all cursor-pointer">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-white">description</span>
                    <span className="text-[9px] font-bold text-slate-400 group-hover:text-white uppercase">Report.pdf</span>
                  </div>
                  <div className="aspect-square bg-slate-50 rounded-xl flex flex-col items-center justify-center gap-1 group hover:bg-slate-900 transition-all cursor-pointer">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-white">table_chart</span>
                    <span className="text-[9px] font-bold text-slate-400 group-hover:text-white uppercase">Metrics.csv</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase mb-4 border-b border-slate-100 pb-2">Shortcuts</h4>
                <div className="space-y-2">
                  <button className="w-full text-left p-3 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl flex items-center justify-between group">
                    Block User
                    <span className="material-symbols-outlined text-sm text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">block</span>
                  </button>
                  <button className="w-full text-left p-3 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl flex items-center justify-between group">
                    Clear Conversation
                    <span className="material-symbols-outlined text-sm text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">delete_sweep</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </aside>
    )}
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
    <div className="flex-1 flex flex-col items-center justify-start pt-6 pb-20 md:pt-12 relative animate-fade-in-up w-full">
      {/* Subtle Floating Orbs (Background Texture) */}
      <div className="fixed top-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-emerald-200 blur-[80px] opacity-40 pointer-events-none -z-10"></div>
      <div className="fixed bottom-[10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-violet-200 blur-[80px] opacity-40 pointer-events-none -z-10"></div>
      <div className="fixed top-[40%] left-[60%] w-[300px] h-[300px] rounded-full bg-blue-100 blur-[80px] opacity-40 pointer-events-none -z-10"></div>

      {/* Feedback Form Container */}
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-2xl rounded-xl p-8 md:p-16 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.05)] border border-white/40">
        <div className="mb-12 text-center md:text-left">
          <span className="font-['Inter'] text-[10px] uppercase tracking-[0.2em] text-[#57657a] font-bold mb-4 block">Continuous Improvement</span>
          <h1 className="font-['Epilogue'] text-5xl font-black tracking-tight text-[#000000] mb-4">Share Feedback</h1>
          <p className="font-['Inter'] text-[#45464d] text-lg leading-relaxed max-w-md">Your insights shape the future of our autonomous agents. Tell us what's working and what's not.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Category Dropdown */}
          <div className="space-y-3">
            <label className="font-['Epilogue'] text-xs font-extrabold uppercase tracking-widest text-[#000000]" htmlFor="category">Category</label>
            <div className="relative group">
              <select 
                className="w-full bg-[#f2f4f6] border-none border-b-2 border-slate-300/40 focus:border-[#000000] focus:ring-0 font-['Inter'] text-base py-4 px-4 transition-all cursor-pointer" 
                id="category" 
                name="category"
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value)}
              >
                <option disabled value="">Select feedback type</option>
                <option value="bug">Report a Bug</option>
                <option value="feature">Feature Request</option>
                <option value="performance">Performance Issue</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Title Field */}
          <div className="space-y-3">
            <label className="font-['Epilogue'] text-xs font-extrabold uppercase tracking-widest text-[#000000]" htmlFor="title">Title</label>
            <input 
              className="w-full bg-[#f2f4f6] border-none border-b-2 border-slate-300/40 focus:border-[#000000] focus:ring-0 font-['Inter'] text-base py-4 px-4 transition-all placeholder:text-slate-400" 
              id="title" 
              name="title" 
              placeholder="A brief summary of your feedback" 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Details Textarea */}
          <div className="space-y-3">
            <label className="font-['Epilogue'] text-xs font-extrabold uppercase tracking-widest text-[#000000]" htmlFor="details">Details</label>
            <textarea 
              className="w-full bg-[#f2f4f6] border-none border-b-2 border-slate-300/40 focus:border-[#000000] focus:ring-0 font-['Inter'] text-base py-4 px-4 transition-all resize-none placeholder:text-slate-400" 
              id="details" 
              name="details" 
              placeholder="Tell us more about your experience..." 
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button 
              className="w-full md:w-auto bg-gradient-to-br from-violet-500 to-emerald-500 text-white font-['Epilogue'] font-bold text-lg px-12 py-5 rounded-lg shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-3" 
              type="submit"
              disabled={submitted}
            >
              <span>{submitted ? 'Feedback Submitted' : 'Submit Feedback'}</span>
              {!submitted && <span className="material-symbols-outlined">send</span>}
              {submitted && <span className="material-symbols-outlined">check_circle</span>}
            </button>
          </div>
        </form>
      </div>

      {/* Footer Meta */}
      <div className="mt-12 text-center pb-8">
        <p className="font-['Inter'] text-[10px] uppercase tracking-tighter text-[#76777d]">© 2024 ChatAutomate Labs. Feedback loop v4.2.0</p>
      </div>
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

  // Toast state
  const [toasts, setToasts] = useState([]);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleViewClick = async (item) => {
    const actualId = item.id || item.knowledge_id || item.knowledgeId || item.uuid;
    if (!actualId || String(actualId).startsWith('temp_')) {
      addToast('Wait for the item to be fully saved in the database before viewing', 'error');
      return;
    }

    setFetchingDetails(true);
    try {
      const details = await apiService.getKnowledgeItem(selectedPageId, actualId);
      setViewingItem(details);
    } catch (err) {
      console.error(err);
      addToast('Failed to fetch details: ' + err.message, 'error');
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

  const handleRequestDelete = (item) => {
    const actualId = item.id || item.knowledge_id || item.knowledgeId || item.uuid;
    if (!actualId || String(actualId).startsWith('temp_')) {
      addToast('Cannot delete item without a valid ID. Wait for save to complete.', 'error');
      return;
    }
    setDeleteConfirmItem(item);
  };

  const handleConfirmDelete = async () => {
    const item = deleteConfirmItem;
    if (!item) return;
    setDeleteConfirmItem(null); 
    const actualId = item.id || item.knowledge_id || item.knowledgeId || item.uuid;
    const type = (item.knowledge_type === 'file' || item.file_name) ? 'file' : 'text';

    console.log('--- DELETION DEBUG ---');
    console.log('Page ID:', selectedPageId);
    console.log('Knowledge type evaluated as:', type);
    console.log('Deleting ID:', actualId);
    console.log('Endpoint called:', `/api/knowledge/${selectedPageId}/${type}/${actualId}`);
    console.log('----------------------');

    try {
      await apiService.deleteKnowledge(selectedPageId, actualId, type);
      setKnowledgeList(prev => prev.filter(k => (k.id || k.knowledge_id || k.knowledgeId || k.uuid) !== actualId));
      addToast('Knowledge deleted successfully', 'delete');
    } catch (error) {
      console.error(error);
      addToast('Failed to delete knowledge: ' + error.message, 'error');
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
    if (!selectedPageId) {
      addToast('Please select a page first', 'error');
      return;
    }

    // For edits, we keep it blocking since it's fast
    if (editingItemId) {
      setUploading(true);
      try {
        if (!name.trim() || !title.trim() || !description.trim()) {
           setUploading(false);
           addToast('Name, Title, and Description are required', 'error');
           return;
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
        addToast('Knowledge updated successfully!', 'edit');
      } catch (error) {
        console.error(error);
        addToast('Failed to edit knowledge: ' + error.message, 'error');
      } finally {
        setUploading(false);
      }
      return;
    }

    // For Add Knowledge, we can run it optimistically and close the modal instantly!
    if (knowledgeType === 'text') {
        if (!name.trim() || !title.trim() || !description.trim()) {
            addToast('Name, Title, and Description are required', 'error');
            return;
        }
        const payload = {
          documents: [{ name: name.trim(), title: title.trim(), description: description.trim() }]
        };
        
        const optimisticId = 'temp_' + Date.now();
        setKnowledgeList(prev => [...prev, {
          id: optimisticId, name: name.trim(), title: title.trim(), description: description.trim(), knowledge_type: 'text'
        }]);

        // Background process: Poll the backend to wait for data (Pinecone sync)
        apiService.createKnowledge(selectedPageId, payload)
          .then(async () => {
             addToast('Document added successfully!', 'success');
             for (let i = 0; i < 5; i++) {
                 await new Promise(resolve => setTimeout(resolve, i === 0 ? 1500 : 2000));
                 const rawList = await apiService.getKnowledge(selectedPageId);
                 const arr = Array.isArray(rawList) ? rawList : (rawList.results || rawList.items || []);
                 
                 setKnowledgeList(prev => {
                     const currentTemps = prev.filter(p => String(p.id).startsWith('temp_'));
                     const unmatchedTemps = currentTemps.filter(t => !arr.some(k => k.name === t.name || k.file_name === t.name));
                     return [...arr, ...unmatchedTemps];
                 });
                 
                 const found = arr.some(k => k.name === name.trim() && k.title === title.trim());
                 if (found || i === 4) break;
             }
          })
          .catch(error => {
            console.error(error);
            addToast('Failed to add text knowledge: ' + error.message, 'error');
            setKnowledgeList(prev => prev.filter(k => k.id !== optimisticId));
          });
    } else {
        if (!selectedFiles || selectedFiles.length === 0) {
            addToast('Please select at least one file to upload', 'error');
            return;
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
        
        // Background process: Poll the backend to wait for data (Pinecone sync)
        apiService.uploadKnowledgeFiles(selectedPageId, formData)
          .then(async () => {
             addToast('File(s) uploaded successfully!', 'success');
             for (let i = 0; i < 5; i++) {
                 await new Promise(resolve => setTimeout(resolve, i === 0 ? 1500 : 2000));
                 const rawList = await apiService.getKnowledge(selectedPageId);
                 const arr = Array.isArray(rawList) ? rawList : (rawList.results || rawList.items || []);
                 
                 setKnowledgeList(prev => {
                     const currentTemps = prev.filter(p => String(p.id).startsWith('temp_'));
                     const unmatchedTemps = currentTemps.filter(t => !arr.some(k => k.name === t.name || k.file_name === t.name));
                     return [...arr, ...unmatchedTemps];
                 });
                 
                 // Check if the uploaded files are present in backend
                 const found = tempItems.every(temp => arr.some(k => k.name === temp.name || k.file_name === temp.name || (k.title && k.title.includes(temp.name))));
                 if (found || i === 4) break;
             }
          })
          .catch(error => {
            console.error(error);
            addToast('Failed to upload files: ' + error.message, 'error');
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
          <h2>Knowledge Base Test</h2>
          <p>Please connect a Facebook page before adding knowledge. The API requires a linked page context.</p>
        </div>
      </div>
    );
  }

  const totalSizeMB = knowledgeList.reduce((acc, curr) => {
    if (curr.size) return acc + (curr.size / (1024 * 1024));
    return acc + (curr.knowledge_type === 'text' ? 0.1 : 1.2);
  }, 0);

  return (
    <div className="flex-1 w-full bg-white p-8 md:p-12 overflow-y-auto animate-fade-in-up">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-2">Resource Library</p>
            <h1 className="text-4xl font-black font-['Epilogue'] tracking-tighter text-slate-900 mb-4">Knowledge Base</h1>
            <p className="text-sm text-slate-500 max-w-lg leading-relaxed">
              Upload and manage the documents that power your agents. These resources provide the semantic context for all AI interactions.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <select
              value={selectedPageId}
              onChange={e => setSelectedPageId(e.target.value)}
              className="text-sm font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none cursor-pointer focus:ring-2 focus:ring-emerald-500 transition-all appearance-none pr-8 relative"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '16px'
              }}
            >
              {pages.map(p => <option key={p.page_id} value={p.page_id}>{p.name}</option>)}
            </select>
            
            <button 
              className="bg-emerald-500 text-white text-sm font-bold py-3 px-6 rounded-xl flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
              onClick={() => {
                setName('');
                setTitle('');
                setDescription('');
                setSelectedFiles(null);
                setKnowledgeType('text');
                setEditingItemId(null);
                setShowModal(true);
              }}
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              Add Knowledge
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col gap-4 transition-transform hover:scale-[1.02]">
            <span className="material-symbols-outlined text-emerald-500 text-3xl">description</span>
            <div>
              <div className="text-4xl font-black text-slate-900 font-['Epilogue']">{knowledgeList.length < 10 ? `0${knowledgeList.length}` : knowledgeList.length}</div>
              <div className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase mt-2">Active Docs</div>
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col gap-4 transition-transform hover:scale-[1.02]">
            <span className="material-symbols-outlined text-emerald-500 text-3xl">format_list_bulleted</span>
            <div>
              <div className="text-4xl font-black text-slate-900 font-['Epilogue']">{totalSizeMB.toFixed(1)} MB</div>
              <div className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase mt-2">Storage Used</div>
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col gap-4 transition-transform hover:scale-[1.02]">
            <span className="material-symbols-outlined text-emerald-500 text-3xl">sync</span>
            <div>
              <div className="text-4xl font-black text-slate-900 font-['Epilogue']">100%</div>
              <div className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase mt-2">Indexing Status</div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="grid grid-cols-12 gap-4 p-5 text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase bg-slate-50/50 border-b border-slate-100">
            <div className="col-span-4 pl-6 flex items-center">Name</div>
            <div className="col-span-3 flex items-center">Type</div>
            <div className="col-span-2 flex items-center">Size</div>
            <div className="col-span-2 flex items-center">Status</div>
            <div className="col-span-1 text-right pr-6 flex items-center justify-end">Actions</div>
          </div>
          
          <div className="divide-y divide-slate-50">
            {loading ? (
              <div className="p-12 text-center text-slate-400 font-medium text-sm">Loading documents...</div>
            ) : knowledgeList.length === 0 ? (
              <div className="p-12 text-center text-slate-400 font-medium text-sm">No documents found for this page.</div>
            ) : (
              knowledgeList.map((item, i) => {
                const name = item.name || item.title || item.data_source?.name || 'Unnamed Document';
                const isFile = item.knowledge_type === 'file' || item.file_name;
                
                let extType = 'Text File';
                if (isFile) {
                  const extMatch = name.match(/\.([0-9a-z]+)(?:[\?#]|$)/i);
                  if (extMatch) {
                     const ext = extMatch[1].toLowerCase();
                     if (ext === 'pdf') extType = 'PDF Document';
                     else if (ext === 'doc' || ext === 'docx') extType = 'Word Doc';
                     else if (ext === 'csv') extType = 'CSV Data';
                     else extType = ext.toUpperCase() + ' File';
                  } else {
                     extType = 'Document';
                  }
                }

                let displaySize = '0.1 MB';
                if (item.size) {
                  displaySize = (item.size / (1024 * 1024)).toFixed(1) + ' MB';
                } else if (!isFile) {
                  displaySize = '0.1 MB';
                } else {
                  displaySize = '1.2 MB'; // fallback
                }

                return (
                  <div key={item.id || i} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50/80 transition-colors group">
                    <div className="col-span-4 flex items-center gap-4 pl-6">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                         <span className="material-symbols-outlined text-[20px]">{isFile ? 'description' : 'text_snippet'}</span>
                      </div>
                      <span className="font-bold text-sm text-slate-900 truncate">{name}</span>
                    </div>
                    
                    <div className="col-span-3 text-sm text-slate-600 font-medium">{extType}</div>
                    
                    <div className="col-span-2 text-sm text-slate-600 font-medium">{displaySize}</div>
                    
                    <div className="col-span-2 flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                       <span className="text-[11px] font-bold text-emerald-600">Ready</span>
                    </div>
                    
                    <div className="col-span-1 flex items-center justify-end gap-1 pr-4">
                      {!isFile && (
                        <>
                          <button
                            onClick={() => handleViewClick(item)}
                            disabled={fetchingDetails}
                            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                            title="View Details"
                          >
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                          </button>
                          <button
                            onClick={() => handleEditClick(item)}
                            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleRequestDelete(item)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="flex justify-between items-center text-xs font-bold text-slate-400 mb-8 pt-4">
          <span>Showing {knowledgeList.length} of {knowledgeList.length} resources</span>
          <div className="flex gap-4">
            <button className="hover:text-slate-900 transition-colors cursor-not-allowed opacity-50">Previous</button>
            <button className="text-slate-900 hover:underline transition-all">Next</button>
          </div>
        </div>
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

      {/* Slide-in Notifications */}
      {ReactDOM.createPortal(
        <div style={{ position: 'fixed', top: '24px', right: '24px', display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 999999, pointerEvents: 'none' }}>
          {toasts.map(t => (
            <div key={t.id} style={{
              animation: 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              padding: '16px 20px',
              borderRadius: '8px',
              color: '#fff',
              fontWeight: 600,
              fontSize: '14px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              display: 'flex',
              alignItems: 'center',
              minWidth: '250px',
              pointerEvents: 'auto',
              backgroundColor: t.type === 'success' ? '#10b981' : t.type === 'error' ? '#ef4444' : t.type === 'delete' ? '#f43f5e' : '#0ea5e9',
            }}>
              <div style={{ marginRight: '12px', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%' }}>
                {t.type === 'success' ? '✓' : t.type === 'error' ? '!' : t.type === 'delete' ? '✕' : 'ℹ'}
              </div>
              {t.message}
            </div>
          ))}
          {deleteConfirmItem && (
            <div style={{
              animation: 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              padding: '16px 20px',
              borderRadius: '8px',
              color: '#0f172a',
              fontWeight: 500,
              fontSize: '14px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
              display: 'flex',
              flexDirection: 'column',
              minWidth: '280px',
              pointerEvents: 'auto',
              backgroundColor: '#fff',
              borderLeft: '4px solid #ef4444'
            }}>
              <div style={{ marginBottom: '14px', fontWeight: 600, fontSize: '14.5px' }}>
                Delete "{deleteConfirmItem.name || deleteConfirmItem.title || 'this document'}"?
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button onClick={() => setDeleteConfirmItem(null)} style={{ padding: '8px 14px', borderRadius: '6px', fontSize: '13px', backgroundColor: '#f1f5f9', color: '#475569', fontWeight: 600, transition: 'background-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor='#e2e8f0'} onMouseLeave={e => e.currentTarget.style.backgroundColor='#f1f5f9'}>Cancel</button>
                <button onClick={handleConfirmDelete} style={{ padding: '8px 14px', borderRadius: '6px', fontSize: '13px', backgroundColor: '#ef4444', color: '#fff', fontWeight: 600, transition: 'background-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor='#dc2626'} onMouseLeave={e => e.currentTarget.style.backgroundColor='#ef4444'}>Yes, delete</button>
              </div>
            </div>
          )}
        </div>,
        document.body
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

const AgentPanel = ({ user, pages, onUpdate, onAgentCreated, onAgentEdited }) => {
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
  const [unassigningId, setUnassigningId] = useState(null);

  const [toasts, setToasts] = useState([]);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);
  
  const [assignModalAgent, setAssignModalAgent] = useState(null);
  const [assigningId, setAssigningId] = useState(null);

  // Filter State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'All',
    role: 'All',
    tone: 'All'
  });

  const activeSelectedAgents = JSON.parse(localStorage.getItem('qchat_assigned_agents') || '{}');

  const filteredAgents = agents.filter(agent => {
    // Role filter
    if (filters.role !== 'All' && agent.role !== filters.role) return false;
    
    // Tone filter
    if (filters.tone !== 'All' && agent.tone !== filters.tone) return false;
    
    // Status filter
    if (filters.status !== 'All') {
      const assignedPageId = Object.keys(activeSelectedAgents).find(key => activeSelectedAgents[key] === agent.agent_id);
      const isActive = !!assignedPageId;
      if (filters.status === 'Active' && !isActive) return false;
      if (filters.status === 'IDLE' && isActive) return false;
    }
    
    return true;
  });

  const clearFilters = () => setFilters({ status: 'All', role: 'All', tone: 'All' });
  const activeFiltersCount = Object.values(filters).filter(v => v !== 'All').length;

  const handleAssign = async (agentId, pageId) => {
    if (!pageId) return;
    setAssigningId(agentId);
    try {
      await apiService.assignAgentToPage(pageId, agentId);
      const activeSelectedAgents = JSON.parse(localStorage.getItem('qchat_assigned_agents') || '{}');
      activeSelectedAgents[pageId] = agentId;
      localStorage.setItem('qchat_assigned_agents', JSON.stringify(activeSelectedAgents));
      addToast('Agent assigned successfully', 'success');
      setAssignModalAgent(null);
      if (onUpdate) onUpdate();
    } catch (e) {
      console.error(e);
      addToast('Failed to assign: ' + e.message, 'error');
    } finally {
      setAssigningId(null);
    }
  };

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleUnassign = async (agentId, pageId) => {
    if (!pageId) return;
    setUnassigningId(agentId);
    try {
      await apiService.unassignAgentFromPage(pageId);
      const activeSelectedAgents = JSON.parse(localStorage.getItem('qchat_assigned_agents') || '{}');
      if (activeSelectedAgents[pageId]) {
         delete activeSelectedAgents[pageId];
         localStorage.setItem('qchat_assigned_agents', JSON.stringify(activeSelectedAgents));
      }
      addToast('Agent unassigned successfully', 'success');
      if (onUpdate) onUpdate();
    } catch (e) {
      console.error(e);
      addToast('Failed to unassign: ' + e.message, 'error');
    } finally {
      setUnassigningId(null);
    }
  };

  const handleDeleteAgent = (agent) => {
    setDeleteConfirmItem(agent);
  };

  const handleConfirmDelete = async () => {
    const agent = deleteConfirmItem;
    if (!agent) return;
    setDeleteConfirmItem(null);
    try {
      await apiService.deleteAgent(agent.agent_id);
      const activeSelectedAgents = JSON.parse(localStorage.getItem('qchat_assigned_agents') || '{}');
      let changed = false;
      Object.keys(activeSelectedAgents).forEach(pageId => {
        if (activeSelectedAgents[pageId] === agent.agent_id) {
          delete activeSelectedAgents[pageId];
          changed = true;
        }
      });
      if (changed) {
        localStorage.setItem('qchat_assigned_agents', JSON.stringify(activeSelectedAgents));
      }
      addToast('Agent deleted successfully', 'delete');
      if (onUpdate) onUpdate();
    } catch (e) {
      console.error(e);
      addToast('Failed to delete agent: ' + e.message, 'error');
    }
  };

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

  const overlays = typeof document !== 'undefined' ? ReactDOM.createPortal(
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <div className="absolute top-6 right-6 flex flex-col gap-3 items-end">
        {toasts.map(t => (
          <div key={t.id} style={{
            animation: 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            padding: '12px 20px',
            borderRadius: '8px',
            color: '#fff',
            fontWeight: 600,
            fontSize: '14px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: t.type === 'success' ? '#10b981' : t.type === 'error' ? '#ef4444' : t.type === 'delete' ? '#ef4444' : '#0ea5e9'
          }}>
            <div style={{ marginRight: '12px', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%' }}>
              {t.type === 'success' ? '✓' : t.type === 'error' ? '!' : t.type === 'delete' ? '✕' : 'ℹ'}
            </div>
            {t.message}
          </div>
        ))}
        {deleteConfirmItem && (
          <div style={{
            animation: 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            padding: '16px 20px',
            borderRadius: '8px',
            color: '#0f172a',
            fontWeight: 500,
            fontSize: '14px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
            display: 'flex',
            flexDirection: 'column',
            minWidth: '280px',
            pointerEvents: 'auto',
            backgroundColor: '#fff',
            borderLeft: '4px solid #ef4444'
          }}>
            <div style={{ marginBottom: '14px', fontWeight: 600, fontSize: '14.5px' }}>
              Delete "{deleteConfirmItem.name}"?
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteConfirmItem(null)} style={{ padding: '8px 14px', borderRadius: '6px', fontSize: '13px', backgroundColor: '#f1f5f9', color: '#475569', fontWeight: 600, transition: 'background-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor='#e2e8f0'} onMouseLeave={e => e.currentTarget.style.backgroundColor='#f1f5f9'}>Cancel</button>
              <button onClick={handleConfirmDelete} style={{ padding: '8px 14px', borderRadius: '6px', fontSize: '13px', backgroundColor: '#ef4444', color: '#fff', fontWeight: 600, transition: 'background-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor='#dc2626'} onMouseLeave={e => e.currentTarget.style.backgroundColor='#ef4444'}>Yes, delete</button>
            </div>
          </div>
        )}
        {assignModalAgent && (
          <div style={{
            animation: 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            padding: '16px 20px',
            borderRadius: '8px',
            color: '#0f172a',
            fontWeight: 500,
            fontSize: '14px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
            display: 'flex',
            flexDirection: 'column',
            minWidth: '320px',
            pointerEvents: 'auto',
            backgroundColor: '#fff',
            borderLeft: '4px solid #0ea5e9'
          }}>
            <div style={{ marginBottom: '14px', fontWeight: 600, fontSize: '14.5px' }}>
              Assign "{assignModalAgent.name}" to Page
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px', maxHeight: '200px', overflowY: 'auto' }}>
              {pages?.length > 0 ? pages.map(p => (
                <button 
                  key={p.page_id}
                  onClick={() => handleAssign(assignModalAgent.agent_id, p.page_id)}
                  disabled={assigningId === assignModalAgent.agent_id}
                  style={{ textAlign: 'left', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', cursor: assigningId === assignModalAgent.agent_id ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '13px', transition: 'all 0.2s' }}
                  onMouseEnter={e => { if (assigningId !== assignModalAgent.agent_id) e.currentTarget.style.backgroundColor='#e0f2fe'; e.currentTarget.style.borderColor='#bae6fd'; }}
                  onMouseLeave={e => { if (assigningId !== assignModalAgent.agent_id) e.currentTarget.style.backgroundColor='#f8fafc'; e.currentTarget.style.borderColor='#e2e8f0'; }}
                >
                  {p.name} {assigningId === assignModalAgent.agent_id && '(Assigning...)'}
                </button>
              )) : (
                <div style={{ fontSize: '13px', color: '#64748b', textAlign: 'center', padding: '10px 0' }}>No pages connected.</div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setAssignModalAgent(null)} 
                disabled={assigningId === assignModalAgent.agent_id}
                style={{ padding: '8px 14px', borderRadius: '6px', fontSize: '13px', backgroundColor: '#f1f5f9', color: '#475569', fontWeight: 600, transition: 'background-color 0.2s', cursor: assigningId === assignModalAgent.agent_id ? 'not-allowed' : 'pointer' }}
                onMouseEnter={e => { if(assigningId !== assignModalAgent.agent_id) e.currentTarget.style.backgroundColor='#e2e8f0' }} 
                onMouseLeave={e => { if(assigningId !== assignModalAgent.agent_id) e.currentTarget.style.backgroundColor='#f1f5f9' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  ) : null;

  if (!isCreating && !isEditing) {
    return (
      <div className="flex-1 w-full p-6 md:p-8 xl:p-12 min-h-screen bg-[#f7f9fb] animate-fade-in-up">
        <div className="max-w-[1400px] mx-auto">
          {/* Header Section */}
          <section className="mb-16">
            <div className="flex justify-between items-end flex-wrap gap-6">
              <div className="max-w-2xl">
                <span className="font-['Inter'] text-[10px] uppercase tracking-[0.2em] text-[#45464d] mb-4 block font-bold">Fleet Management</span>
                <h2 className="text-5xl font-extrabold tracking-tight text-primary font-['Epilogue'] mb-6">AI Agents</h2>
                <p className="text-lg text-[#45464d] leading-relaxed">
                    Deploy, monitor, and scale your autonomous intelligence fleet. Your agents are currently handling <span className="text-emerald-600 font-bold">84%</span> of all support traffic.
                </p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${isFilterOpen || activeFiltersCount > 0 ? 'bg-black text-white shadow-lg shadow-black/20' : 'bg-[#e6e8ea] hover:bg-[#e0e3e5]'}`}
                >
                    <span className="material-symbols-outlined text-lg border-b-0" data-icon="tune">tune</span>
                    {activeFiltersCount > 0 ? `Filters (${activeFiltersCount})` : 'Filter View'}
                </button>
                <button 
                  onClick={() => setIsCreating(true)}
                  className="flex items-center gap-2 px-8 py-3 bg-[#000000] text-white rounded-xl font-bold transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-black/20"
                >
                    <span className="material-symbols-outlined font-black" style={{fontVariationSettings: "'FILL' 1"}}>add</span>
                    Create New Agent
                </button>
              </div>
            </div>
          {/* Filter Bar */}
          <div className={`overflow-hidden transition-all duration-300 ${isFilterOpen ? 'max-h-40 opacity-100 mb-12' : 'max-h-0 opacity-0 mb-0'}`}>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-wrap items-center gap-6">
              <div className="flex flex-col gap-1.5 min-w-[140px]">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Status</label>
                <select 
                  value={filters.status}
                  onChange={e => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-black/5"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="IDLE">IDLE</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 min-w-[140px]">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Role</label>
                <select 
                  value={filters.role}
                  onChange={e => setFilters(prev => ({ ...prev, role: e.target.value }))}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-black/5"
                >
                  <option value="All">All Roles</option>
                  <option value="Sales Agent">Sales Agent</option>
                  <option value="Support Agent">Support Agent</option>
                  <option value="Q&A Agent">Q&A Agent</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 min-w-[140px]">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Personality</label>
                <select 
                  value={filters.tone}
                  onChange={e => setFilters(prev => ({ ...prev, tone: e.target.value }))}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-black/5"
                >
                  <option value="All">All Tones</option>
                  {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {activeFiltersCount > 0 && (
                <button 
                  onClick={clearFilters}
                  className="mt-5 text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">refresh</span>
                  Clear All
                </button>
              )}
            </div>
          </div>
          </section>

          {/* Agents Bento Grid */}
          <div className="grid grid-cols-12 gap-6 pb-20 auto-rows-fr">
            
            {/* Create Agent Card */}
            <div 
              onClick={() => setIsCreating(true)}
              className="col-span-12 md:col-span-6 lg:col-span-4 min-h-[360px] relative group overflow-hidden bg-[#000000] rounded-[2rem] cursor-pointer shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#000000] to-[#131b2e] opacity-90"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center border border-white/10 m-3 rounded-[1.5rem] border-dashed transition-colors group-hover:border-emerald-500/50">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300 shadow-lg">
                      <span className="material-symbols-outlined text-white text-3xl group-hover:text-emerald-400">add</span>
                  </div>
                  <h3 className="text-white text-xl font-bold mb-2 font-['Epilogue'] tracking-tight">New Intelligence</h3>
                  <p className="text-[#bec6e0] text-sm font-medium">Deploy a custom trained model to handle specific logic.</p>
              </div>
            </div>

            {/* Dynamic Agents List */}
            {filteredAgents.length === 0 && activeFiltersCount > 0 ? (
              <div className="col-span-12 py-20 text-center bg-white rounded-[2rem] border border-dashed border-slate-200">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-slate-300 text-3xl">filter_list_off</span>
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">No agents match your filters</h4>
                <p className="text-slate-500 text-sm mb-6">Try adjusting your criteria or clearing all filters.</p>
                <button onClick={clearFilters} className="text-emerald-600 font-bold text-sm hover:underline">Clear all filters</button>
              </div>
            ) : filteredAgents.map((agent) => {
              // Read assigned agents state globally
              const assignedPageId = Object.keys(activeSelectedAgents).find(key => activeSelectedAgents[key] === agent.agent_id);
              const isAssigned = !!assignedPageId;

              return (
                <div key={agent.agent_id} className="col-span-12 md:col-span-6 lg:col-span-4 bg-white rounded-[2rem] p-8 flex flex-col justify-between group hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 border border-[#e0e3e5] relative break-inside-avoid min-h-[360px]">
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-4">
                      {isAssigned ? (
                         <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:scale-105 transition-transform">
                            <span className="material-symbols-outlined text-emerald-600 text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>support_agent</span>
                         </div>
                      ) : (
                         <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 group-hover:scale-105 transition-transform">
                            <span className="material-symbols-outlined text-slate-600 text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>psychology</span>
                         </div>
                      )}
                      
                      <div className="flex flex-col justify-center min-w-0">
                        <h3 className="text-2xl font-bold text-[#000000] leading-tight font-['Epilogue'] truncate pr-4">{agent.name}</h3>
                        {isAssigned ? (
                           <div className="flex items-center gap-2 mt-2">
                             <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]"></span>
                             <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active</span>
                           </div>
                        ) : (
                            <div className="bg-slate-50 px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-500 flex items-center gap-1 border border-slate-200 w-fit mt-2">
                                <span className="material-symbols-outlined text-[14px]">pause_circle</span>
                                IDLE
                            </div>
                        )}
                      </div>
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAgent(agent);
                      }}
                      className="p-2 -mt-2 -mr-2 rounded-xl hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors z-20"
                      title="Delete Agent"
                    >
                      <span className="material-symbols-outlined text-xl">delete</span>
                    </button>
                  </div>

                  <div className="mb-6 flex-1 mt-4">
                    <div className="grid grid-cols-2 gap-8 my-8">
                      <div>
                        <p className="font-['Inter'] text-[10px] uppercase tracking-widest text-[#45464d] mb-2 font-bold">Core Function</p>
                        <p className="text-sm font-semibold text-[#000000]">{agent.role}</p>
                      </div>
                      <div>
                        <p className="font-['Inter'] text-[10px] uppercase tracking-widest text-[#45464d] mb-2 font-bold">Tone Setup</p>
                        <p className="text-sm font-semibold text-[#000000] max-w-[120px] truncate">{agent.tone} Profile</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#eceef0] mt-auto space-y-6">
                    {/* Stats Row */}
                    <div className="flex gap-6 sm:gap-8 justify-start">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#76777d] block mb-1">Dialogues</span>
                        <span className="text-lg font-bold text-[#000000]">12,402</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#76777d] block mb-1">Success</span>
                        <span className="text-lg font-bold text-[#000000]">94.2%</span>
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        {isAssigned ? (
                          <button 
                            onClick={() => handleUnassign(agent.agent_id, assignedPageId)}
                            disabled={unassigningId === agent.agent_id}
                            className="text-[13px] font-bold text-red-500 flex items-center gap-1.5 transition-all px-3 py-1.5 hover:bg-red-50 rounded-lg disabled:opacity-50 whitespace-nowrap"
                          >
                            {unassigningId === agent.agent_id ? 'Wait...' : 'Unassign'}
                          </button>
                        ) : (
                          <button 
                            onClick={() => setAssignModalAgent(agent)}
                            className="text-[13px] font-bold text-blue-600 flex items-center gap-1.5 transition-all px-3 py-1.5 hover:bg-blue-50 rounded-lg whitespace-nowrap"
                          >
                            Assign
                          </button>
                        )}
                        <button 
                          onClick={() => handleEditClick(agent)}
                          className="text-[13px] font-bold text-emerald-600 flex items-center gap-1.5 hover:gap-2 transition-all px-3 py-1.5 hover:bg-emerald-50 rounded-lg whitespace-nowrap"
                        >
                          Configure <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
          </div>
        </div>
        {overlays}
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
      {overlays}
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

const TutorialPanel = () => {
  return (
    <div className="dashboard-content-area animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '600px' }}>
      <div style={{ textAlign: 'center' }}>
        <span className="material-symbols-outlined text-slate-300 mb-4 inline-block" style={{ fontSize: '72px' }}>school</span>
        <h2 className="text-4xl font-headline font-black tracking-tighter text-slate-900 mb-4">Tutorials</h2>
        <p className="text-slate-500 max-w-md mx-auto text-base">We're putting together comprehensive guides and interactive walkthroughs to help you master LYFFLOW. Check back soon!</p>
        <div className="mt-8">
          <span className="bg-slate-100 text-slate-600 px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase inline-block">
            Coming Soon
          </span>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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
      let subscriptionData = null;
      try {
        subscriptionData = await apiService.getSubscription();
      } catch (e) {
        console.warn("Could not fetch subscription", e);
      }

      const parsedUser = userData?.user || userData || null;
      const parsedPages = Array.isArray(pagesData) ? pagesData : (pagesData?.pages || pagesData?.data || []);
      const parsedAgents = Array.isArray(agentsData) ? agentsData : (agentsData?.agents || agentsData?.data || []);

      if (parsedUser) {
        parsedUser.agents = parsedAgents;
        parsedUser.subscription = subscriptionData;
      }
      setUser(parsedUser);
      setPages(parsedPages);

      // Handle post-OAuth redirect (backend always lands on /dashboard,
      // so we use this flag to forward new users to /app/pricing instead)
      const postAuthRedirect = localStorage.getItem('lyfflow_postAuthRedirect');
      if (postAuthRedirect && postAuthRedirect !== '/app/dashboard') {
        localStorage.removeItem('lyfflow_postAuthRedirect');
        navigate(postAuthRedirect);
      } else {
        localStorage.removeItem('lyfflow_postAuthRedirect');
      }
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      if (err.status === 401) {
        // Clear stale returning-user flag so the next OAuth flow treats them as new
        localStorage.removeItem('lyfflow_ReturningUser');
        navigate('/app/get-started');
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
      case 'overview': return <Overview user={user} pages={pages} onNavigate={setActiveTab} onUpdate={fetchData} />;
      case 'conversation': return <ConversationList pages={pages} user={user} />;
      case 'knowledge': return <Knowledge pages={pages} />;
      case 'agent': return <AgentPanel user={user} pages={pages} onUpdate={fetchData} onAgentCreated={(newAgent) => setUser(prev => prev ? { ...prev, agents: [...(prev.agents || []), newAgent] } : prev)} onAgentEdited={(id, payload) => setUser(prev => prev ? { ...prev, agents: (prev.agents || []).map(a => a.agent_id === id ? { ...a, ...payload } : a) } : prev)} />;
      case 'feedback': return <FeedbackPanel />;
      case 'settings': return <SettingsPanel />;
      case 'tutorial': return <TutorialPanel />;
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
      <aside className={`bg-slate-50 border-r border-slate-100 flex flex-col font-['Epilogue'] font-medium h-full py-8 shrink-0 transition-all duration-300
        fixed top-0 left-0 w-56 px-3 z-[10000]
        ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        ${isSidebarCollapsed ? 'md:-translate-x-full md:w-0 md:px-0 md:border-none md:overflow-hidden' : 'md:translate-x-0 md:relative md:w-56 md:px-3 xl:w-64 xl:px-4 md:z-auto md:shadow-none'}`}>
        <div className="p-0 m-0 mb-6 pb-6 w-full flex items-center justify-start px-2 border-b border-slate-200">
          <div className="flex items-center gap-[6px] px-2">
            <img src={logoImg} alt="LYFFLOW" style={{ height: '36px', width: 'auto', filter: 'brightness(0) saturate(100%) invert(59%) sepia(72%) saturate(450%) hue-rotate(100deg) brightness(95%) contrast(90%)' }} />
            <img src={titleImg} alt="LYFFLOW" style={{ height: '22px', width: 'auto', filter: 'brightness(0) saturate(100%) invert(59%) sepia(72%) saturate(450%) hue-rotate(100deg) brightness(95%) contrast(90%)' }} />
          </div>
          {/* Mobile Close Button */}
          <button className="md:hidden ml-auto bg-transparent border-none p-0 cursor-pointer text-slate-400" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
            { id: 'conversation', icon: MessageSquare, label: 'Conversations' },
            { id: 'knowledge', icon: Book, label: 'Knowledge' },
            { id: 'agent', icon: UserRound, label: 'Agents' },
            { id: 'feedback', icon: MessageCircleWarning, label: 'Feedback' },
            { id: 'tutorial', icon: Settings, label: 'Tutorial' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer border-none text-left ${
                activeTab === item.id 
                  ? 'text-emerald-600 font-bold border-l-0 border-r-4 border-emerald-500 bg-[#ecfdf5] rounded-r-none pl-[16px] pr-[12px]' 
                  : 'text-slate-500 hover:bg-slate-100 bg-transparent'
              }`}
            >
              {item.id === 'tutorial'
                ? <span className="material-symbols-outlined text-[20px]">school</span>
                : <item.icon size={20} />}
              <span className="text-[15px]">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-slate-100 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-100 transition-all rounded-lg cursor-pointer border-none bg-transparent text-left">
            <HelpCircle size={20} />
            <span className="text-[15px]">Support</span>
          </button>
          <button onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }} 
            className={`w-full flex items-center gap-3 px-4 py-3 transition-all rounded-lg cursor-pointer border-none text-left ${activeTab === 'settings' ? 'text-emerald-600 font-bold bg-[#ecfdf5]' : 'text-slate-500 hover:bg-slate-100 bg-transparent'}`}
          >
            <Settings size={20} />
            <span className="text-[15px]">Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main">
        {/* Top Navbar */}
        <header className="dashboard-top-navbar">
          <div className="top-nav-left" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
              onClick={() => {
                if (window.innerWidth < 768) {
                  setIsSidebarOpen(true);
                } else {
                  setIsSidebarCollapsed(!isSidebarCollapsed);
                }
              }}
              title="Toggle Sidebar"
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
                <button className="drawer-menu-item" onClick={() => {
                  setIsLogoutModalOpen(true);
                  setIsProfileOpen(false);
                }}>
                  <LogOut size={18} /> Log Out
                </button>
              </div>
            </div>
          </div>

          {/* Custom Logout Modal */}
          {isLogoutModalOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in-up border border-slate-100 p-6 m-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-red-500 text-2xl">logout</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-headline font-bold text-slate-900">Log Out</h3>
                    <p className="text-sm text-slate-500 font-medium">Are you sure you want to exit your workspace?</p>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-8">
                  <button 
                    onClick={() => setIsLogoutModalOpen(false)}
                    disabled={isLoggingOut}
                    className="flex-1 py-3 px-4 rounded-xl font-bold border-2 border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={async () => {
                      setIsLoggingOut(true);
                      await apiService.logout().catch(() => { });
                      window.location.href = '/app/login';
                    }}
                    disabled={isLoggingOut}
                    className="flex-1 py-3 px-4 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoggingOut ? 'Logging out...' : 'Log Out'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
