
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { TOP_GPT_UNIVERSITIES_LLM } from '../constants';
import PopulationStats from '../components/state/PopulationStats';
import UniversitiesList from '../components/state/UniversitiesList';
import { useFavorites } from '../hooks/use-favorites';
import { useComparison } from '../hooks/use-comparison';
import { GraduationCap } from 'lucide-react';
import SessionExpiredDialog from '@/components/SessionExpiredDialog';
import ComparisonBanner from '@/components/ComparisonBanner';
import { logUniversitySearch } from '@/utils/logger';

const LoadingState = () => (
  <div className="min-h-screen bg-background p-8 flex flex-col items-center justify-center">
    <div className="relative w-24 h-24 mb-8">
      <motion.div
        className="absolute inset-0"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <GraduationCap className="w-24 h-24 text-primary" />
      </motion.div>
    </div>
    <motion.p
      className="text-xl font-medium text-primary/80"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      Loading universities in {useParams().stateName}...
    </motion.p>
  </div>
);

const StatePage = () => {
  const { stateName } = useParams();
  const navigate = useNavigate();
  const { favorites, handleFavoriteClick } = useFavorites();
  const { comparedUniversities, handleCompareClick, clearComparedUniversities } = useComparison();
  const token = sessionStorage.getItem("token");
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  useEffect(() => {
    if (stateName) {
      // Log university search when viewing a state page
      logUniversitySearch('', stateName);
    }
  }, [stateName]);

  const handleFavoriteWithLogging = (universityName) => {
    handleFavoriteClick(universityName);
  };

  const handleCompareWithLogging = (universityName) => {
    handleCompareClick(universityName);
  };

  const handleClearComparisonWithLogging = () => {
    clearComparedUniversities();
  };

  const { data: stateData, isLoading: stateLoading } = useQuery({
    queryKey: ['stateDetails', stateName],
    queryFn: async () => {
      const response = await axios.get('https://api.census.gov/data/2023/acs/acs1', {
        params: {
          get: "NAME,B01001_001E,B01001_002E,B01001_026E",
          for: "state:*",
          key: "e921b3e18e6fd0b1d0845420b5baf19b33229c36"
        }
      });
      
      const formattedData = response.data.slice(1).find((item) => 
        item[0].toLowerCase() === stateName?.toLowerCase()
      );
      
      return formattedData ? {
        population: parseInt(formattedData[1]).toLocaleString(),
        male: parseInt(formattedData[2]).toLocaleString(),
        female: parseInt(formattedData[3]).toLocaleString()
      } : null;
    }
  });

  const { data: universities, isLoading: universitiesLoading } = useQuery({
    queryKey: ['universities', stateName],
    queryFn: async () => {
      try {
        const response = await axios.get(`${TOP_GPT_UNIVERSITIES_LLM}?state_name=${stateName}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const universities = response.data.data.map((item) => ({
          name: item.university_name,
        }));
        
        return universities;
      } catch (error) {
        if (error.response?.status === 401 || error.response?.data?.status?.code === 401) {
          setIsSessionExpired(true);
        }
        throw error;
      }
    }
  });

  const handleCollegeClick = (college) => {
    navigate(`/college/${encodeURIComponent(college.name)}`);
  };

  const handleBackClick = () => {
    navigate('/explore');
  };

  if (stateLoading || universitiesLoading) {
    return <LoadingState />;
  }

  return (
    <>
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-7xl text-left">
            <Button 
              variant="ghost" 
              onClick={handleBackClick} 
              className="mb-8 hover:bg-background/80 backdrop-blur-sm"
            >
              ← Back to Map
            </Button>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }} 
            className="space-y-8"
          >
            <h1 className="text-4xl font-bold mb-6 capitalize bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              {stateName}
            </h1>
            
            <PopulationStats stateData={stateData} />

            {universities && universities.length > 0 && (
              <UniversitiesList
                universities={universities}
                favorites={favorites}
                comparedUniversities={comparedUniversities}
                onFavoriteClick={handleFavoriteWithLogging}
                onCompareClick={handleCompareWithLogging}
                onUniversityClick={handleCollegeClick}
              />
            )}
          </motion.div>
        </div>
      </div>

      <ComparisonBanner 
        comparedUniversities={comparedUniversities} 
        onClear={handleClearComparisonWithLogging} 
      />

      <SessionExpiredDialog 
        open={isSessionExpired} 
        onOpenChange={setIsSessionExpired}
      />
    </>
  );
};

export default StatePage;
