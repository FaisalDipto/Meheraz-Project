/**
 * API Service for interacting with the Qchat Backend
 */

// Since we setup a proxy in Vite, we can just use relative paths locally
// In production, this might need to be an absolute URL if the frontend and backend servers differ
const API_BASE = '';

/**
 * Helper to perform fetch requests with default headers
 */
const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  
  const headers = { ...options.headers };
  // If the body is FormData, let the browser set the Content-Type with the correct boundary
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  } else {
    delete headers['Content-Type'];
  }

  const mergedOptions = {
    ...options,
    credentials: 'include', // Important: Ensures cookies/sessions are sent with every request
    headers,
  };

  const response = await fetch(url, mergedOptions);
  
  if (!response.ok) {
    // Attempt to extract JSON error message if provided by FastAPI
    let errorMessage = 'An error occurred while fetching data';
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch (e) {
      // Ignore parsing errors for non-JSON responses
    }
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }

  // Parse JSON response body if content-type matches
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
};

export const apiService = {
  // Returns current logged-in user details
  getUserProfile: () => apiFetch('/api/user/'),
  
  // Explicit logout
  logout: () => apiFetch('/api/logout'),

  // Gets the connected Facebook Pages
  getPages: () => apiFetch('/api/pages'),
  
  // Knowledge Base
  getKnowledge: (pageId) => apiFetch(`/api/knowledge/${pageId}`),
  
  getKnowledgeItem: (pageId, knowledgeId) => apiFetch(`/api/knowledge/${pageId}/${knowledgeId}`),
  
  createKnowledge: (pageId, payload) => apiFetch(`/api/knowledge/${pageId}/create`, {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  
  uploadKnowledgeFiles: (pageId, formData) => apiFetch(`/api/knowledge/${pageId}/upload`, {
    method: 'POST',
    body: formData,
  }),
  
  editKnowledge: (pageId, knowledgeId, updateData) => apiFetch(`/api/knowledge/${pageId}/${knowledgeId}`, {
    method: 'PATCH',
    body: JSON.stringify(updateData),
  }),
  
  deleteKnowledge: (pageId, knowledgeId, type = 'text') => apiFetch(`/api/knowledge/${pageId}/${type}/${knowledgeId}`, {
    method: 'DELETE',
  }),

  // Agent Management
  getAgents: () => apiFetch('/api/agents'),
  
  createAgent: (userId, agentData) => apiFetch(`/api/agent/create?user_id=${encodeURIComponent(userId)}`, {
    method: 'POST',
    body: JSON.stringify(agentData),
  }),
  
  updateAgent: (agentId, agentData) => apiFetch(`/api/agent/update/${agentId}`, {
    method: 'PATCH',
    body: JSON.stringify(agentData),
  }),
  
  deleteAgent: (agentId) => apiFetch(`/api/agent/delete?agent_id=${encodeURIComponent(agentId)}`, {
    method: 'DELETE',
  }),
  
  assignAgentToPage: (pageId, agentId) => apiFetch(`/api/page/${pageId}/assign-agent`, {
    method: 'PATCH',
    body: JSON.stringify({ agent_id: agentId }),
  }),
  
  unassignAgentFromPage: (pageId) => apiFetch(`/api/page/${pageId}/unassign-agent`, {
    method: 'PATCH',
  }),
  
  // Profile
  getProfilePic: (userId) => apiFetch(`/api/user/profile_pic/${userId}`),

  // Conversations
  getPageDetails: (pageId) => apiFetch(`/api/page/${pageId}`),
  getConversationDetails: (pageId, conversationId) => apiFetch(`/api/page/${pageId}/conversation/${conversationId}`),
  replyToConversation: (pageId, conversationId, message) => apiFetch(`/api/facebook/${pageId}/messenger/${conversationId}/reply`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  }),
  
  // General AI Chat
  aiChat: (prompt) => apiFetch(`/api/chat?prompt=${encodeURIComponent(prompt)}`, {
    method: 'POST',
  }),

  // Feedback
  submitFeedback: (feedbackData) => apiFetch('/api/feedback', {
    method: 'POST',
    body: JSON.stringify(feedbackData),
  }),
};
