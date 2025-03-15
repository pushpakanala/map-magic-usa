
import { useState, useEffect } from 'react';

export const useComparison = () => {
  const [comparedUniversities, setComparedUniversities] = useState([]);
  const [cachedUniversityData, setCachedUniversityData] = useState({});

  // Load from sessionStorage on mount
  useEffect(() => {
    const storedCompared = sessionStorage.getItem('comparedUniversities');
    const storedCachedData = sessionStorage.getItem('cachedUniversityData');
    
    if (storedCompared) {
      try {
        setComparedUniversities(JSON.parse(storedCompared));
      } catch (e) {
        console.error('Failed to parse compared universities from session storage:', e);
      }
    }
    
    if (storedCachedData) {
      try {
        setCachedUniversityData(JSON.parse(storedCachedData));
      } catch (e) {
        console.error('Failed to parse cached university data from session storage:', e);
      }
    }
    
    // Listen for storage events to update state when sessionStorage changes in other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'comparedUniversities') {
        try {
          const newValue = e.newValue ? JSON.parse(e.newValue) : [];
          setComparedUniversities(newValue);
        } catch (error) {
          console.error('Error parsing comparedUniversities from storage event:', error);
        }
      } else if (e.key === 'cachedUniversityData') {
        try {
          const newValue = e.newValue ? JSON.parse(e.newValue) : {};
          setCachedUniversityData(newValue);
        } catch (error) {
          console.error('Error parsing cachedUniversityData from storage event:', error);
        }
      } else if (e.key && e.key.startsWith('comparison_')) {
        // Handle newly cached comparison data if needed
        console.log('New comparison data cached in another tab:', e.key);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Update sessionStorage when selections change
  useEffect(() => {
    sessionStorage.setItem('comparedUniversities', JSON.stringify(comparedUniversities));
  }, [comparedUniversities]);
  
  // Update sessionStorage when cached data changes
  useEffect(() => {
    sessionStorage.setItem('cachedUniversityData', JSON.stringify(cachedUniversityData));
  }, [cachedUniversityData]);

  const handleCompareClick = (universityName) => {
    setComparedUniversities(prev => {
      if (prev.includes(universityName)) {
        return prev.filter(name => name !== universityName);
      } else {
        return [...prev, universityName];
      }
    });
  };

  // New function to remove a university from the comparison list
  const removeFromComparison = (universityName) => {
    setComparedUniversities(prev => prev.filter(name => name !== universityName));
  };

  const clearComparedUniversities = () => {
    setComparedUniversities([]);
    sessionStorage.removeItem('comparedUniversities');
    
    // Also clear comparison cache keys
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('comparison_')) {
        sessionStorage.removeItem(key);
      }
    });
  };
  
  const cacheUniversityData = (universityName, data) => {
    if (universityName && data) {
      console.log('Caching university data for:', universityName);
      
      // Update the React state
      setCachedUniversityData(prev => {
        const newCache = {
          ...prev,
          [universityName]: data
        };
        
        // Also update sessionStorage directly
        sessionStorage.setItem('cachedUniversityData', JSON.stringify(newCache));
        
        return newCache;
      });
    }
  };
  
  const getCachedUniversityData = (universityName) => {
    if (!universityName) return null;
    
    // Try to get from React state first
    let data = cachedUniversityData[universityName];
    
    // If not in React state, try to get from sessionStorage directly
    // This is useful if the data was cached in another tab/window
    if (!data) {
      const cachedDataStr = sessionStorage.getItem('cachedUniversityData');
      if (cachedDataStr) {
        try {
          const allCachedData = JSON.parse(cachedDataStr);
          data = allCachedData[universityName];
          
          // Update our state if we found data in sessionStorage but not in our state
          if (data && !cachedUniversityData[universityName]) {
            setCachedUniversityData(prev => ({
              ...prev,
              [universityName]: data
            }));
          }
        } catch (e) {
          console.error('Failed to parse cached university data:', e);
        }
      }
    }
    
    if (data) {
      console.log('Retrieved cached data for:', universityName);
    } else {
      console.log('No cached data found for:', universityName);
    }
    
    return data || null;
  };

  return {
    comparedUniversities,
    handleCompareClick,
    removeFromComparison,
    clearComparedUniversities,
    cacheUniversityData,
    getCachedUniversityData,
    cachedUniversityData
  };
};
