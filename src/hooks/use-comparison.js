import { useState, useEffect } from 'react';
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

  const handleCompareClick = (universityName) => {
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
  };

  // Function to remove a university from the comparison list
  const removeFromComparison = (universityName) => {
    if (!universityName) return;
    
    console.log(`Removing ${universityName} from comparison list`);
    
    setComparedUniversities(prev => {
      const newList = prev.filter(name => name !== universityName);
      
      sessionStorage.setItem('comparedUniversities', JSON.stringify(newList));
      
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'comparedUniversities',
        newValue: JSON.stringify(newList)
      }));
      
      return newList;
    });
  };

  const clearComparedUniversities = () => {
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
  };
  
  const cacheUniversityData = (universityName, data) => {
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
  };
  
  const getCachedUniversityData = (universityName) => {
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
