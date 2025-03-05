
import { useState, useEffect } from 'react';

export const useComparison = () => {
  const [comparedUniversities, setComparedUniversities] = useState([]);

  // Load from sessionStorage on mount
  useEffect(() => {
    const storedCompared = sessionStorage.getItem('comparedUniversities');
    if (storedCompared) {
      try {
        setComparedUniversities(JSON.parse(storedCompared));
      } catch (e) {
        console.error('Failed to parse compared universities from session storage:', e);
      }
    }
    
    // Listen for storage events to update state when sessionStorage changes
    const handleStorageChange = () => {
      const storedData = sessionStorage.getItem('comparedUniversities');
      if (storedData) {
        try {
          setComparedUniversities(JSON.parse(storedData));
        } catch (e) {
          console.error('Failed to parse compared universities from session storage:', e);
        }
      } else {
        setComparedUniversities([]);
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

  return {
    comparedUniversities,
    handleCompareClick,
    clearComparedUniversities
  };
};
