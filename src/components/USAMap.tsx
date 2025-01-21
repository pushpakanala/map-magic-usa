import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

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
        {/* This is where we'll add state paths - I'll include just a few examples for brevity */}
        <path
          d="M161.1 453.7l-14.9 63.9-12.6 53.9 3.4 6.1 1.5 4.6-0.6 7.6 2.7 4.9 0.9 4.9-2.7 8.5 2.4 5.5 3.4 3.4 0.6 4.9 4.3 6.1 1.5 4-1.8 3.4 0.9 3.4 7.6 3.4 0.9 11.6 4.3 2.7 2.1 6.4 3.4 2.1 3.1 2.6 4.9 0.9 3.8 5.5 3.9 4 0.9 3.1-2.1 5.2-0.3 3.7 3.7 4 1.8 4.6 0.9 4.3 2.4 4.9 1.5 4.3 1.5 5.5 4 5.8 2.7 5.2-0.9 3.4-3.4 3.1-1.8 4.9 2.1 4.6 3.4 5.8-0.6 4.6-1.8 4.9-3.1 4.3-4.6 2.4 0.9 1.2-0.9 1.5-3.1 1.8-2.7 4-0.3 4.9 0.9 3.7 1.5 4.3 0.9 4.3 2.4 4.6 1.5 4.9 0.9 4.3 1.5 4.3-0.3 4.9-1.8 4.6-3.1 4.3-4.6 2.4 1.5 1.5-1.5 1.5-3.1 1.8-2.7 4-0.3 4.9 0.9 3.7 1.5 4.3 0.9 4.3 2.4 4.6 1.5 4.9 0.9 4.3 1.5 4.3-0.3 4.9-1.8 4.6-3.1 4.3-4.6 2.4 1.5 1.5-1.5 1.5-3.1 1.8-2.7 4-0.3 4.9 0.9 3.7 1.5 4.3 0.9 4.3 2.4 4.6 1.5 4.9 0.9 4.3 1.5 4.3-0.3 4.9-1.8 4.6-3.1 4.3-4.6 2.4z"
          className={`fill-mapBase hover:fill-mapHover cursor-pointer transition-colors duration-300 ${
            hoveredState === 'CA' ? 'animate-map-hover' : ''
          }`}
          onMouseEnter={() => setHoveredState('CA')}
          onMouseLeave={() => setHoveredState(null)}
          onClick={() => handleStateClick('california')}
        />
        {/* Add more state paths here */}
      </svg>
      
      {hoveredState && (
        <div className="absolute bg-white p-4 rounded-lg shadow-lg border border-gray-200 transform -translate-x-1/2 pointer-events-none">
          <p className="font-semibold">{hoveredState}</p>
          <p>Population: {getPopulation(hoveredState)}</p>
        </div>
      )}
    </div>
  );
};

export default USAMap;