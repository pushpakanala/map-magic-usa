
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
        // Limit to 2 universities
        const newList = [...prev];
        if (newList.length >= 2) {
          newList.shift(); // Remove the oldest entry
        }
        newList.push(universityName);
        return newList;
      }
    });
  };

  const clearComparedUniversities = () => {
    setComparedUniversities([]);
    sessionStorage.removeItem('comparedUniversities');
  };
  
  const cacheUniversityData = (universityName, data) => {
    setCachedUniversityData(prev => ({
      ...prev,
      [universityName]: data
    }));
  };
  
  const getCachedUniversityData = (universityName) => {
    return cachedUniversityData[universityName] || null;
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
