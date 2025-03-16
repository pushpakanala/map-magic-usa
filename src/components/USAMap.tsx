
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { statesData } from '@/lib/states-data';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Compass } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface StateData {
  state: string;
  population: number;
}

interface HoverPosition {
  x: number;
  y: number;
}

// State abbreviations with refined positions
const stateAbbreviations: { [key: string]: { abbr: string, position: [number, number] } } = {
  "Alabama": { abbr: "AL", position: [622, 445] },
  "Alaska": { abbr: "AK", position: [170, 590] },
  "Arizona": { abbr: "AZ", position: [270, 370] },
  "Arkansas": { abbr: "AR", position: [570, 400] },
  "California": { abbr: "CA", position: [140, 300] },
  "Colorado": { abbr: "CO", position: [370, 320] },
  "Connecticut": { abbr: "CT", position: [860, 220] },
  "Delaware": { abbr: "DE", position: [840, 260] },
  "Florida": { abbr: "FL", position: [710, 510] },
  "Georgia": { abbr: "GA", position: [700, 420] },
  "Hawaii": { abbr: "HI", position: [230, 520] },
  "Idaho": { abbr: "ID", position: [220, 210] },
  "Illinois": { abbr: "IL", position: [600, 300] },
  "Indiana": { abbr: "IN", position: [650, 280] },
  "Iowa": { abbr: "IA", position: [550, 260] },
  "Kansas": { abbr: "KS", position: [480, 340] },
  "Kentucky": { abbr: "KY", position: [670, 330] },
  "Louisiana": { abbr: "LA", position: [550, 470] },
  "Maine": { abbr: "ME", position: [890, 150] },
  "Maryland": { abbr: "MD", position: [810, 275] },
  "Massachusetts": { abbr: "MA", position: [865, 200] },
  "Michigan": { abbr: "MI", position: [650, 225] },
  "Minnesota": { abbr: "MN", position: [530, 180] },
  "Mississippi": { abbr: "MS", position: [600, 450] },
  "Missouri": { abbr: "MO", position: [550, 340] },
  "Montana": { abbr: "MT", position: [300, 170] },
  "Nebraska": { abbr: "NE", position: [460, 280] },
  "Nevada": { abbr: "NV", position: [180, 270] },
  "New Hampshire": { abbr: "NH", position: [870, 180] },
  "New Jersey": { abbr: "NJ", position: [840, 245] },
  "New Mexico": { abbr: "NM", position: [340, 390] },
  "New York": { abbr: "NY", position: [820, 200] },
  "North Carolina": { abbr: "NC", position: [760, 360] },
  "North Dakota": { abbr: "ND", position: [470, 170] },
  "Ohio": { abbr: "OH", position: [700, 270] },
  "Oklahoma": { abbr: "OK", position: [480, 380] },
  "Oregon": { abbr: "OR", position: [150, 180] },
  "Pennsylvania": { abbr: "PA", position: [780, 240] },
  "Rhode Island": { abbr: "RI", position: [872, 217] },
  "South Carolina": { abbr: "SC", position: [740, 400] },
  "South Dakota": { abbr: "SD", position: [460, 220] },
  "Tennessee": { abbr: "TN", position: [650, 370] },
  "Texas": { abbr: "TX", position: [450, 450] },
  "Utah": { abbr: "UT", position: [270, 300] },
  "Vermont": { abbr: "VT", position: [850, 170] },
  "Virginia": { abbr: "VA", position: [780, 310] },
  "Washington": { abbr: "WA", position: [170, 130] },
  "West Virginia": { abbr: "WV", position: [745, 300] },
  "Wisconsin": { abbr: "WI", position: [590, 210] },
  "Wyoming": { abbr: "WY", position: [350, 240] },
};

const USAMap: React.FC = () => {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [hoverPosition, setHoverPosition] = useState<HoverPosition>({ x: 0, y: 0 });
  const mapRef = useRef<SVGSVGElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

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
      'fill-slate-400',
      'fill-slate-500',
      'fill-zinc-400',
      'fill-zinc-500',
      'fill-slate-600'
    ];
    return colors[index % colors.length];
  };

  if (isLoading) return (
    <div className="w-full h-[400px] relative">
      <Skeleton className="absolute inset-0" />
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
    <div className="w-full bg-gradient-to-b from-background to-background/80">
      <div className="max-w-[1000px] mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-6"
        >
          <div className="relative">
            <svg
              ref={mapRef}
              viewBox="-0 -0 1000 700"
              preserveAspectRatio="xMidYMid meet"
              className="w-full h-full max-h-[450px]"
              onMouseMove={handleMouseMove}
              style={{ 
                filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
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
                <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8E9196" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#403E43" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              {statesData.map((state, index) => (
                <motion.path
                  key={state.id}
                  d={state.path}
                  className="transition-all duration-300 cursor-pointer hover:brightness-110 hover:saturate-150"
                  style={{
                    fill: 'url(#mapGradient)',
                    filter: hoveredState === state.id ? 'url(#glow)' : 'none',
                    opacity: 0.85,
                  }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 0.85, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.01 }}
                  whileHover={{ scale: 1.02, opacity: 1 }}
                  onMouseEnter={() => setHoveredState(state.name)}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => handleStateClick(state.name)}
                />
              ))}
              
              {/* State abbreviations */}
              {Object.entries(stateAbbreviations).map(([stateName, stateInfo]) => {
                return (
                  <text
                    key={`text-${stateName}`}
                    x={stateInfo.position[0]}
                    y={stateInfo.position[1]}
                    className="text-[10px] font-bold fill-black pointer-events-none"
                    textAnchor="middle"
                  >
                    {stateInfo.abbr}
                  </text>
                );
              })}
            </svg>

            <AnimatePresence>
              {hoveredState && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute bg-white/90 backdrop-blur-md p-4 rounded-lg shadow-lg border border-slate-200/50 pointer-events-none z-10"
                  style={{
                    left: `${hoverPosition.x}px`,
                    top: `${hoverPosition.y}px`,
                  }}
                >
                  <p className="font-semibold text-lg text-slate-700">
                    {getStateName(hoveredState)}
                  </p>
                  <p className="text-sm text-slate-500">
                    Population: {getPopulation(hoveredState)}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default USAMap;
