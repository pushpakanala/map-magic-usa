
import axios from 'axios';

const API_ENDPOINT = 'https://api.example.com/logs'; // Replace with your actual logging API endpoint

export const logEvent = async (event, details = {}) => {
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
    
    // Send log data to API
    await axios.post(API_ENDPOINT, logData);
  } catch (error) {
    console.error('Error logging event:', error);
    // We don't throw the error to prevent affecting the main application flow
  }
};

// Specialized logging functions for common events
export const logLoginEvent = (email) => {
  logEvent('login', { email });
};

export const logSignupEvent = (email) => {
  logEvent('signup', { email });
};

export const logLogoutEvent = () => {
  logEvent('logout');
};

export const logPageView = (pageName) => {
  logEvent('page_view', { page: pageName });
};

export const logButtonClick = (buttonName, location) => {
  logEvent('button_click', { button: buttonName, location });
};

export const logUniversitySearch = (query, state) => {
  logEvent('university_search', { query, state });
};

export const logUniversityView = (universityName) => {
  logEvent('university_view', { university: universityName });
};

// Time tracking
let pageEnterTime = null;

export const startTimeTracking = (pageName) => {
  pageEnterTime = new Date();
  logEvent('page_enter', { page: pageName });
};

export const endTimeTracking = (pageName) => {
  if (pageEnterTime) {
    const timeSpent = (new Date() - pageEnterTime) / 1000; // in seconds
    logEvent('time_spent', { page: pageName, seconds: timeSpent });
    pageEnterTime = null;
  }
};
