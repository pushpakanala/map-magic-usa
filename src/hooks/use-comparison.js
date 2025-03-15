
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

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

  const handleCompareClick = useCallback((universityName) => {
    setComparedUniversities(prev => {
      if (prev.includes(universityName)) {
        const newList = prev.filter(name => name !== universityName);
        sessionStorage.setItem('comparedUniversities', JSON.stringify(newList));
        return newList;
      } else {
        const newList = [...prev, universityName];
        sessionStorage.setItem('comparedUniversities', JSON.stringify(newList));
        return newList;
      }
    });
  }, []);

  // Function to remove a university from the comparison list - using useCallback to memoize
  const removeFromComparison = useCallback((universityName) => {
    if (!universityName) return;
    
    console.log(`Removing ${universityName} from comparison list`);
    
    // Use function form of setState to ensure we're working with the most recent state
    setComparedUniversities(prev => {
      // Only remove the specified university, not all universities
      const newList = prev.filter(name => name !== universityName);
      
      // Update session storage right away
      sessionStorage.setItem('comparedUniversities', JSON.stringify(newList));
      
      // Notify other tabs about the change
      setTimeout(() => {
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'comparedUniversities',
          newValue: JSON.stringify(newList)
        }));
      }, 0);
      
      return newList;
    });
  }, []);

  const clearComparedUniversities = useCallback(() => {
    setComparedUniversities([]);
    sessionStorage.removeItem('comparedUniversities');
    
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('comparison_')) {
        sessionStorage.removeItem(key);
      }
    });
    
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'comparedUniversities',
      newValue: JSON.stringify([])
    }));
  }, []);
  
  const cacheUniversityData = useCallback((universityName, data) => {
    if (universityName && data) {
      console.log('Caching university data for:', universityName);
      
      setCachedUniversityData(prev => {
        const newCache = {
          ...prev,
          [universityName]: data
        };
        
        sessionStorage.setItem('cachedUniversityData', JSON.stringify(newCache));
        
        return newCache;
      });
    }
  }, []);
  
  const getCachedUniversityData = useCallback((universityName) => {
    if (!universityName) return null;
    
    let data = cachedUniversityData[universityName];
    
    if (!data) {
      const cachedDataStr = sessionStorage.getItem('cachedUniversityData');
      if (cachedDataStr) {
        try {
          const allCachedData = JSON.parse(cachedDataStr);
          data = allCachedData[universityName];
          
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
    
    return data || null;
  }, [cachedUniversityData]);

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
