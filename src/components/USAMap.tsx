import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { statesData } from '@/lib/states-data';
import { motion, AnimatePresence } from 'framer-motion';

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
      const response = await axios.get('https://api.census.gov/data/2023/acs/acs1', {
        params: {
          get: "NAME,B01001_001E,B01001_002E,B01001_026E",
          for: "state:*",
          key: "e921b3e18e6fd0b1d0845420b5baf19b33229c36"
        }
      });    
      const formattedData = response.data.slice(1).map((item: any[]) => ({
        state: item[0],
        population: parseInt(item[1])
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
    const colors = [
      'fill-blue-400',
      'fill-blue-500',
      'fill-blue-600',
      'fill-indigo-500',
      'fill-indigo-600'
    ];
    return colors[index % colors.length];
  };

  if (isLoading) return (
    <div className="w-full aspect-[16/9] relative">
      <Skeleton className="absolute inset-0 rounded-xl" />
    </div>
  );

  if (error) {
    toast({
      title: "Error loading map data",
      description: "Please try again later",
      variant: "destructive",
    });
    return <div>Error loading map</div>;
  }

  return (
    <div className="relative w-full max-w-[1600px] mx-auto px-4 py-8">
      <motion.div 
        className="relative bg-gradient-to-br from-background/80 to-background/40 rounded-xl shadow-xl border border-primary/10 backdrop-blur-sm p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <svg
          ref={mapRef}
          viewBox="50 0 959 593"
          className="w-full h-auto transform scale-[0.95]"
          onMouseMove={handleMouseMove}
          style={{ 
            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
            maxHeight: '80vh'
          }}
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {statesData.map((state, index) => (
            <motion.path
              key={state.id}
              d={state.path}
              className={`${getStateColor(index)} transition-all duration-300 cursor-pointer
                hover:brightness-110 hover:saturate-150`}
              style={{
                filter: hoveredState === state.id ? 'url(#glow)' : 'none',
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.01 }}
              whileHover={{ scale: 1.02 }}
              onMouseEnter={() => setHoveredState(state.name)}
              onMouseLeave={() => setHoveredState(null)}
              onClick={() => handleStateClick(state.name)}
            />
          ))}
        </svg>
        
        <AnimatePresence>
          {hoveredState && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute bg-card/90 backdrop-blur-md p-4 rounded-lg shadow-lg border border-primary/20 pointer-events-none z-10"
              style={{
                left: `${hoverPosition.x}px`,
                top: `${hoverPosition.y}px`,
                transform: 'translate(20px, -50%)'
              }}
            >
              <p className="font-semibold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                {getStateName(hoveredState)}
              </p>
              <p className="text-sm text-muted-foreground">
                Population: {getPopulation(hoveredState)}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default USAMap;
