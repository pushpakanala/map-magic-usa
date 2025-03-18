
import axios from 'axios'; 
import { METRICS_LOGGING } from '../constants';

// Event types constants
export const EVENT_TYPES = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  SIGNUP: 'signup',
  PAGE_VISIT: 'page_visit',
  UNIVERSITY_SEARCH: 'university_search', 
  BUTTON_CLICK: 'button_click',
  TIME_SPENT: 'time_spent'
};

// Configure the logger
const API_ENDPOINT = METRICS_LOGGING;

// Track if we've already logged an error to prevent infinite loops
let hasLoggedNetworkError = false;

export const logEvent = async (event, details = {}) => {
  // Don't log anything if we're already having network issues
  if (hasLoggedNetworkError) {
    return;
  }
  
  try {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const userId = user.name || 'anonymous';
    
    const logData = {
      user_id: userId,
      event: event,
      details: details,
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

// Specialized logging functions for specific events
export const logLoginEvent = (email) => {
  logEvent(EVENT_TYPES.LOGIN, { email });
};

export const logSignupEvent = (email) => {
  logEvent(EVENT_TYPES.SIGNUP, { email });
};

export const logLogoutEvent = () => {
  logEvent(EVENT_TYPES.LOGOUT);
};

export const logPageView = (pageName) => {
  logEvent(EVENT_TYPES.PAGE_VISIT, { page: pageName });
};

export const logButtonClick = (buttonName, location) => {
  logEvent(EVENT_TYPES.BUTTON_CLICK, { button: buttonName, location });
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
