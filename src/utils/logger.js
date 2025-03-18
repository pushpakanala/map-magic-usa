
import axios from 'axios'; 
import { METRICS_LOGGING } from '../constants';

// Essential event types only
export const EVENT_TYPES = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  SIGNUP: 'signup',
  PASSWORD_CHANGE: 'password_change',
  UNIVERSITY_SEARCH: 'university_search',
  BOT_INTERACTION: 'bot_interaction'
};

// Configure the logger
const API_ENDPOINT = METRICS_LOGGING;

// Track if user is authenticated
let isAuthenticated = false;

/**
 * Update authentication status when user logs in or out
 */
export const setAuthenticationStatus = (status) => {
  isAuthenticated = status;
};

/**
 * Main logging function - only logs essential events
 */
export const logEvent = async (event, details = {}) => {
  try {
    // Skip logging if it's not one of our essential event types
    if (!Object.values(EVENT_TYPES).includes(event)) {
      return;
    }
    
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const userId = user.name || 'anonymous';
    
    // Skip logging for anonymous users except for login/signup
    if (!isAuthenticated && 
        userId === 'anonymous' && 
        event !== EVENT_TYPES.LOGIN && 
        event !== EVENT_TYPES.SIGNUP) {
      return;
    }
    
    // Standardize details object structure based on event type
    const standardizedDetails = standardizeDetails(event, details);
    
    const logData = {
      user_id: userId,
      event: event,
      details: standardizedDetails,
      timestamp: new Date().toISOString()
    };
    
    await axios.post(API_ENDPOINT, logData);
  } catch (error) {
    // We don't throw the error to prevent affecting the main application flow
  }
};

/**
 * Standardize details object based on event type
 */
const standardizeDetails = (event, details) => {
  switch (event) {
    case EVENT_TYPES.LOGIN:
      return { email: details.email || 'unknown' };
    
    case EVENT_TYPES.SIGNUP:
      return { email: details.email || 'unknown' };
    
    case EVENT_TYPES.LOGOUT:
      return { reason: details.reason || 'user_initiated' };
    
    case EVENT_TYPES.PASSWORD_CHANGE:
      return { email: details.email || 'unknown' };
    
    case EVENT_TYPES.UNIVERSITY_SEARCH:
      return { 
        query: details.query || '',
        state: details.state || 'all',
        filters: details.filters || {} 
      };
    
    case EVENT_TYPES.BOT_INTERACTION:
      return { 
        query: details.query || '',
        response_id: details.response_id || '',
        action: details.action || 'question'
      };
    
    default:
      return details;
  }
};

// Specialized logging functions for essential events
export const logLoginEvent = (email) => {
  setAuthenticationStatus(true);
  logEvent(EVENT_TYPES.LOGIN, { email });
};

export const logSignupEvent = (email) => {
  setAuthenticationStatus(true);
  logEvent(EVENT_TYPES.SIGNUP, { email });
};

export const logLogoutEvent = (reason = 'user_initiated') => {
  logEvent(EVENT_TYPES.LOGOUT, { reason });
  setAuthenticationStatus(false);
};

export const logPasswordChangeEvent = (email) => {
  logEvent(EVENT_TYPES.PASSWORD_CHANGE, { email });
};

export const logUniversitySearch = (query, state) => {
  logEvent(EVENT_TYPES.UNIVERSITY_SEARCH, { query, state });
};

export const logBotInteraction = (query, responseId) => {
  logEvent(EVENT_TYPES.BOT_INTERACTION, { query, response_id: responseId });
};
