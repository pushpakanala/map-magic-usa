
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
    // Enhanced color palette with satellite-inspired colors
    const colors = [
      'fill-slate-600',
      'fill-slate-700',
      'fill-slate-800',
      'fill-zinc-700',
      'fill-zinc-800'
    ];
    return colors[index % colors.length];
  };

  if (isLoading) return (
    <div className="w-full aspect-[2/1] relative">
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
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6">
      <motion.div 
        className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/80 rounded-xl shadow-2xl border border-slate-700/30 backdrop-blur-sm overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="aspect-[2/1] relative w-full">
          <svg
            ref={mapRef}
            viewBox="-50 0 1100 600"
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-full"
            onMouseMove={handleMouseMove}
            style={{ 
              filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2))',
            }}
          >
            <defs>
              <linearGradient id="satelliteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#1e293b', stopOpacity: 0.8 }} />
                <stop offset="100%" style={{ stopColor: '#334155', stopOpacity: 0.9 }} />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <pattern id="gridPattern" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#475569" strokeWidth="0.5" opacity="0.2"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#gridPattern)" />
            {statesData.map((state, index) => (
              <motion.path
                key={state.id}
                d={state.path}
                className={`${getStateColor(index)} transition-all duration-300 cursor-pointer
                  hover:brightness-125 hover:saturate-150`}
                style={{
                  filter: hoveredState === state.id ? 'url(#glow)' : 'none',
                  opacity: 0.9,
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 0.9, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.01 }}
                whileHover={{ scale: 1.02, opacity: 1 }}
                onMouseEnter={() => setHoveredState(state.name)}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => handleStateClick(state.name)}
              />
            ))}
          </svg>
        </div>
        
        <AnimatePresence>
          {hoveredState && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute bg-slate-900/90 backdrop-blur-md p-4 rounded-lg shadow-lg border border-slate-700/30 pointer-events-none z-10"
              style={{
                left: `${hoverPosition.x}px`,
                top: `${hoverPosition.y}px`,
                transform: 'translate(20px, -50%)'
              }}
            >
              <p className="font-semibold text-lg text-slate-100">
                {getStateName(hoveredState)}
              </p>
              <p className="text-sm text-slate-300">
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
