
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
    
    // Listen for storage events to update state when sessionStorage changes
    const handleStorageChange = () => {
      const storedData = sessionStorage.getItem('comparedUniversities');
      const storedCache = sessionStorage.getItem('cachedUniversityData');
      
      if (storedData) {
        try {
          setComparedUniversities(JSON.parse(storedData));
        } catch (e) {
          console.error('Failed to parse compared universities from session storage:', e);
        }
      } else {
        setComparedUniversities([]);
      }
      
      if (storedCache) {
        try {
          setCachedUniversityData(JSON.parse(storedCache));
        } catch (e) {
          console.error('Failed to parse cached university data from session storage:', e);
        }
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

  const clearComparedUniversities = () => {
    setComparedUniversities([]);
    sessionStorage.removeItem('comparedUniversities');
  };
  
  const cacheUniversityData = (universityName, data) => {
    if (universityName && data) {
      console.log('Caching university data for:', universityName);
      setCachedUniversityData(prev => ({
        ...prev,
        [universityName]: data
      }));
    }
  };
  
  const getCachedUniversityData = (universityName) => {
    if (!universityName) return null;
    
    const data = cachedUniversityData[universityName];
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
    clearComparedUniversities,
    cacheUniversityData,
    getCachedUniversityData,
    cachedUniversityData
  };
};
