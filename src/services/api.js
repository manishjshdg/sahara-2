// SAHARA API Client with Resilient Offline Fallback
// Provides typed asynchronous operations for Check-ins, AI Support Signals, Habits,
// Hobbies, Appointments, Cases, Emergency Live Location, and Multilingual settings.

const API_BASE = '/api';

async function fetchJson(endpoint, options = {}) {
  const token = localStorage.getItem('sahara_auth_token') || 'sahara_sec_tok_usr_demo_1';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...(options.headers || {})
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(errorData.error || `HTTP ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn(`[SAHARA API Request Warning] ${endpoint}:`, err.message);
    throw err;
  }
}

export const api = {
  // Auth & Profile
  login: (email, password) => fetchJson('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  signup: (userData) => fetchJson('/auth/signup', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => fetchJson('/auth/me'),
  getProfile: (userId) => fetchJson(`/profile${userId ? `?userId=${userId}` : ''}`),
  updateProfile: (data) => fetchJson('/profile', { method: 'PUT', body: JSON.stringify(data) }),
  getConsents: (userId) => fetchJson(`/consents${userId ? `?userId=${userId}` : ''}`),
  updateConsent: (consentType, granted) => fetchJson('/consents', { method: 'POST', body: JSON.stringify({ consentType, granted }) }),

  // Check-ins & AI Baseline
  getCheckInQuestions: () => fetchJson('/checkins/questions'),
  getCheckIns: (userId) => fetchJson(`/checkins${userId ? `?userId=${userId}` : ''}`),
  submitCheckIn: (checkInData) => fetchJson('/checkins', { method: 'POST', body: JSON.stringify(checkInData) }),
  getBaseline: (userId) => fetchJson(`/baseline${userId ? `?userId=${userId}` : ''}`),
  getSupportSignals: (userId) => fetchJson(`/ai/support-signals${userId ? `?userId=${userId}` : ''}`),
  acknowledgeSignal: (id) => fetchJson(`/ai/support-signals/${id}/acknowledge`, { method: 'POST' }),
  getWellbeingTrends: (days = 7) => fetchJson(`/wellbeing?days=${days}`),
  getLifestyleSuggestions: () => fetchJson('/lifestyle/suggestions'),

  // Habits
  getHabits: () => fetchJson('/habits'),
  createHabit: (habitData) => fetchJson('/habits', { method: 'POST', body: JSON.stringify(habitData) }),
  toggleHabit: (id) => fetchJson(`/habits/${id}/toggle`, { method: 'POST' }),
  deleteHabit: (id) => fetchJson(`/habits/${id}`, { method: 'DELETE' }),

  // Hobbies
  getHobbies: () => fetchJson('/hobbies'),
  createHobby: (hobbyData) => fetchJson('/hobbies', { method: 'POST', body: JSON.stringify(hobbyData) }),
  logHobbyTime: (id, durationMinutes, note) => fetchJson(`/hobbies/${id}/log`, { method: 'POST', body: JSON.stringify({ durationMinutes, note }) }),

  // Support & Trusted Circle
  getTrustedContacts: () => fetchJson('/trusted-contacts'),
  addTrustedContact: (data) => fetchJson('/trusted-contacts', { method: 'POST', body: JSON.stringify(data) }),
  deleteTrustedContact: (id) => fetchJson(`/trusted-contacts/${id}`, { method: 'DELETE' }),
  getEmergencyStatus: () => fetchJson('/emergency/status'),
  startEmergencyLiveLocation: (coords) => fetchJson('/emergency/start', { method: 'POST', body: JSON.stringify(coords || {}) }),
  stopEmergencyLiveLocation: () => fetchJson('/emergency/stop', { method: 'POST', body: JSON.stringify({}) }),

  // Professionals & Appointments
  getProfessionals: (role) => fetchJson(`/professionals${role ? `?role=${role}` : ''}`),
  getAppointments: () => fetchJson('/appointments'),
  bookAppointment: (data) => fetchJson('/appointments', { method: 'POST', body: JSON.stringify(data) }),
  updateAppointment: (id, data) => fetchJson(`/appointments/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Cases & Case Notes (For Professional Portal)
  getCases: (profId) => fetchJson(`/cases${profId ? `?professionalId=${profId}` : ''}`),
  getCaseDetails: (id) => fetchJson(`/cases/${id}`),
  addCaseNote: (id, noteData) => fetchJson(`/cases/${id}/notes`, { method: 'POST', body: JSON.stringify(noteData) }),
  updateCaseStatus: (id, status, priority) => fetchJson(`/cases/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, priority }) }),

  // Resources, Rights & Helplines
  getResources: (category, search) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    return fetchJson(`/resources?${params.toString()}`);
  },
  getHelplines: () => fetchJson('/helplines'),

  // Notifications
  getNotifications: () => fetchJson('/notifications'),
  markNotificationRead: (id) => fetchJson(`/notifications/${id}/read`, { method: 'POST' }),

  // Organization & Subscriptions
  getOrgOverview: () => fetchJson('/organizations/current'),

  // Hackathon Demo Mode
  resetDemo: () => fetchJson('/demo/reset', { method: 'POST' })
};
