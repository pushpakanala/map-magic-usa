import React, { useState, useRef } from 'react';
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

interface HoverPosition {
  x: number;
  y: number;
}

const USAMap: React.FC = () => {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [hoverPosition, setHoverPosition] = useState<HoverPosition>({ x: 0, y: 0 });
  const mapRef = useRef<SVGSVGElement>(null);
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

  const handleMouseMove = (e: React.MouseEvent) => {
    if (mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setHoverPosition({ x, y });
    }
  };

  const getStateColor = (index: number) => {
    const colors = ['100', '200', '300', '400', '500'];
    return `fill-mapBase-${colors[index % colors.length]}`;
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
        ref={mapRef}
        viewBox="0 0 959 593"
        className="w-full h-auto"
        onMouseMove={handleMouseMove}
      >
        {statesData.map((state, index) => (
          <path
            key={state.id}
            d={state.path}
            className={`${getStateColor(index)} hover:fill-mapHover cursor-pointer transition-colors duration-300 ${
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
          className="absolute bg-white p-4 rounded-lg shadow-lg border border-gray-200 pointer-events-none z-10"
          style={{
            left: `${hoverPosition.x}px`,
            top: `${hoverPosition.y}px`,
            transform: 'translate(20px, -50%)'
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