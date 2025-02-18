
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { TOP_GPT_UNIVERSITIES_LLM } from '../constants';
import PopulationStats from '../components/state/PopulationStats';
import UniversitiesList from '../components/state/UniversitiesList';
import { useFavorites } from '../hooks/use-favorites';
import { GraduationCap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

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
      Loading universities...
    </motion.p>
  </div>
);

const StatePage = () => {
  const { stateName } = useParams();
  const navigate = useNavigate();
  const { favorites, handleFavoriteClick } = useFavorites();
  const token = sessionStorage.getItem("token");

  const { data: universities, isLoading } = useQuery({
    queryKey: ['universities', stateName],
    queryFn: async () => {
      const response = await axios.get(`${TOP_GPT_UNIVERSITIES_LLM}?state_name=${stateName}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data.map((item) => ({
        name: item.university_name,
      }));
    }
  });

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-[1024px] max-w-[1440px] mx-auto bg-gradient-to-br from-slate-50 via-slate-100 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="p-8 space-y-8">
        <div className="w-full max-w-7xl text-left">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')} 
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
          
          <PopulationStats stateData={null} />

          {universities && universities.length > 0 && (
            <UniversitiesList
              universities={universities}
              favorites={favorites}
              onFavoriteClick={handleFavoriteClick}
              onUniversityClick={(college) => navigate(`/college/${encodeURIComponent(college.name)}`)}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default StatePage;
