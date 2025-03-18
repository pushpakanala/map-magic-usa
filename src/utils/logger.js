
import axios from 'axios'; 
import { METRICS_LOGGING } from '../constants';

// Event types constants
export const EVENT_TYPES = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  SIGNUP: 'signup',
  PAGE_VISIT: 'page_visit',
  UNIVERSITY_SEARCH: 'university_search', 
  TIME_SPENT: 'time_spent',
  API_REQUEST: 'api_request'  // Changed from BUTTON_CLICK to API_REQUEST
};

// Configure the logger
const API_ENDPOINT = METRICS_LOGGING;

// Track if we've already logged an error to prevent infinite loops
let hasLoggedNetworkError = false;
// Track if user is authenticated
let isAuthenticated = false;

/**
 * Update authentication status when user logs in or out
 */
export const setAuthenticationStatus = (status) => {
  isAuthenticated = status;
};

/**
 * Main logging function
 */
export const logEvent = async (event, details = {}) => {
  // Don't log anything if we're already having network issues
  if (hasLoggedNetworkError) {
    return;
  }
  
  try {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const userId = user.name || 'anonymous';
    
    // Skip logging for anonymous users except for login, signup, or page_visit to landing pages
    if (!isAuthenticated && 
        userId === 'anonymous' && 
        event !== EVENT_TYPES.LOGIN && 
        event !== EVENT_TYPES.SIGNUP &&
        !(event === EVENT_TYPES.PAGE_VISIT && 
          (details.page === '/login' || details.page === '/signup' || details.page === '/' || 
           details.page === '/forgot-password' || details.action === 'app_started'))) {
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
    
    console.log('Logging event:', logData);
    
    // Only send log data to API if it's one of our defined event types
    if (Object.values(EVENT_TYPES).includes(event)) {
      await axios.post(API_ENDPOINT, logData);
    }
  } catch (error) {
    console.error('Error logging event:', error);
    // Mark that we've had a network error to prevent more requests
    if (error.code === 'ERR_NETWORK') {
      hasLoggedNetworkError = true;
      
      // Reset the flag after some time to allow future logging attempts
      setTimeout(() => {
        hasLoggedNetworkError = false;
      }, 60000); // Wait 1 minute before trying again
    }
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
    
    case EVENT_TYPES.PAGE_VISIT:
      return { 
        page: details.page || 'unknown',
        referrer: details.referrer || document.referrer || 'direct',
        action: details.action || 'view'
      };
    
    case EVENT_TYPES.UNIVERSITY_SEARCH:
      return { 
        query: details.query || '',
        state: details.state || 'all',
        filters: details.filters || {} 
      };
    
    case EVENT_TYPES.API_REQUEST:  // Updated from BUTTON_CLICK to API_REQUEST
      return { 
        method: details.method || 'unknown',
        url: details.url || 'unknown',
        action: details.action || 'request' 
      };
    
    case EVENT_TYPES.TIME_SPENT:
      return { 
        page: details.page || 'unknown',
        seconds: details.seconds || 0 
      };
    
    default:
      return details;
  }
};

// Specialized logging functions for specific events
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

export const logPageView = (pageName) => {
  logEvent(EVENT_TYPES.PAGE_VISIT, { page: pageName });
};

// Remove the logButtonClick function
// export const logButtonClick = (buttonName, location) => {
//   logEvent(EVENT_TYPES.BUTTON_CLICK, { button: buttonName, location });
// };

// Add API request logging function
export const logApiRequest = (method, url) => {
  logEvent(EVENT_TYPES.API_REQUEST, { method, url });
};

export const logUniversitySearch = (query, state) => {
  logEvent(EVENT_TYPES.UNIVERSITY_SEARCH, { query, state });
};

// Time tracking
let pageEnterTime = null;

export const startTimeTracking = (pageName) => {
  pageEnterTime = new Date();
  // No need to log page_enter, since we'll track the actual time spent
};

export const endTimeTracking = (pageName) => {
  if (pageEnterTime) {
    const timeSpent = (new Date() - pageEnterTime) / 1000; // in seconds
    logEvent(EVENT_TYPES.TIME_SPENT, { page: pageName, seconds: timeSpent });
    pageEnterTime = null;
  }
};
