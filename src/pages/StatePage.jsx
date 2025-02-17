
import React from 'react';
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

const StatePage = () => {
  const { stateName } = useParams();
  const navigate = useNavigate();
  const { favorites, handleFavoriteClick } = useFavorites();
  const token = sessionStorage.getItem("token");

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
      const response = await axios.get(`${TOP_GPT_UNIVERSITIES_LLM}?state_name=${stateName}`,{
        headers: { Authorization: `Bearer ${token}` }
    });
      return response.data.data.map((item) => ({
        name: item.university_name,
      }));
    }
  });

  const handleCollegeClick = (college) => {
    navigate(`/college/${encodeURIComponent(college.name)}`);
  };

  if (stateLoading || universitiesLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-12 w-48 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto text-left">
        <div className="w-full max-w-7xl text-left">
          <Button variant="outline" onClick={() => navigate('/')} className="mb-8">
            ← Back to Map
          </Button>
        </div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
          <h1 className="text-4xl font-bold mb-6 capitalize">{stateName}</h1>
          
          <PopulationStats stateData={stateData} />

          {universities && universities.length > 0 && (
            <UniversitiesList
              universities={universities}
              favorites={favorites}
              onFavoriteClick={handleFavoriteClick}
              onUniversityClick={handleCollegeClick}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default StatePage;
