import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { statesData } from '@/lib/states-data';

interface StateData {
  state: string;
  population: number;
}

const USAMap: React.FC = () => {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: populationData, isLoading, error } = useQuery({
    queryKey: ['statePopulation'],
    queryFn: async () => {
      const response = await axios.get('https://api.census.gov/data/2020/dec/pl?get=P1_001N&for=state:*');
      const formattedData = response.data.slice(1).map((item: any[]) => ({
        state: item[2],
        population: parseInt(item[0])
      }));
      return formattedData;
    }
  });

  const handleStateClick = (stateName: string) => {
    navigate(`/state/${stateName.toLowerCase()}`);
  };

  const getPopulation = (stateId: string) => {
    if (!populationData) return 'Loading...';
    const stateData = populationData.find((state: StateData) => state.state === stateId);
    return stateData ? stateData.population.toLocaleString() : 'N/A';
  };

  const getStateName = (stateId: string) => {
    const state = statesData.find(state => state.id === stateId);
    return state ? state.name : stateId;
  };

  if (isLoading) return <Skeleton className="w-full h-[600px] rounded-lg" />;

  if (error) {
    toast({
      title: "Error loading map data",
      description: "Please try again later",
      variant: "destructive",
    });
    return <div>Error loading map</div>;
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <svg
        viewBox="0 0 959 593"
        className="w-full h-auto"
      >
        {statesData.map((state) => (
          <path
            key={state.id}
            d={state.path}
            className={`fill-mapBase hover:fill-mapHover cursor-pointer transition-colors duration-300 ${
              hoveredState === state.id ? 'animate-map-hover' : ''
            }`}
            onMouseEnter={() => setHoveredState(state.id)}
            onMouseLeave={() => setHoveredState(null)}
            onClick={() => handleStateClick(state.name)}
          />
        ))}
      </svg>
      
      {hoveredState && (
        <div 
          className="absolute bg-white p-4 rounded-lg shadow-lg border border-gray-200 transform -translate-x-1/2 pointer-events-none z-10"
          style={{
            left: '50%',
            top: '50%'
          }}
        >
          <p className="font-semibold text-lg">{getStateName(hoveredState)}</p>
          <p className="text-gray-600">Population: {getPopulation(hoveredState)}</p>
        </div>
      )}
    </div>
  );
};

export default USAMap;