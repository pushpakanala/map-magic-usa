
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

// Updated state abbreviation positions with better centered coordinates
const stateAbbreviations: Record<string, {abbr: string, x: number, y: number}> = {
  "Alabama": { abbr: "AL", x: 628, y: 430 },
  "Alaska": { abbr: "AK", x: 140, y: 550 },
  "Arizona": { abbr: "AZ", x: 235, y: 365 },
  "Arkansas": { abbr: "AR", x: 545, y: 395 },
  "California": { abbr: "CA", x: 125, y: 310 },
  "Colorado": { abbr: "CO", x: 350, y: 320 },
  "Connecticut": { abbr: "CT", x: 865, y: 240 },
  "Delaware": { abbr: "DE", x: 840, y: 282 },
  "Florida": { abbr: "FL", x: 750, y: 505 },
  "Georgia": { abbr: "GA", x: 700, y: 425 },
  "Hawaii": { abbr: "HI", x: 230, y: 510 },
  "Idaho": { abbr: "ID", x: 210, y: 230 },
  "Illinois": { abbr: "IL", x: 590, y: 320 },
  "Indiana": { abbr: "IN", x: 647, y: 300 },
  "Iowa": { abbr: "IA", x: 540, y: 273 },
  "Kansas": { abbr: "KS", x: 470, y: 345 },
  "Kentucky": { abbr: "KY", x: 662, y: 345 },
  "Louisiana": { abbr: "LA", x: 550, y: 465 },
  "Maine": { abbr: "ME", x: 875, y: 170 },
  "Maryland": { abbr: "MD", x: 815, y: 290 },
  "Massachusetts": { abbr: "MA", x: 860, y: 225 },
  "Michigan": { abbr: "MI", x: 635, y: 235 },
  "Minnesota": { abbr: "MN", x: 525, y: 195 },
  "Mississippi": { abbr: "MS", x: 585, y: 445 },
  "Missouri": { abbr: "MO", x: 545, y: 345 },
  "Montana": { abbr: "MT", x: 300, y: 180 },
  "Nebraska": { abbr: "NE", x: 460, y: 280 },
  "Nevada": { abbr: "NV", x: 175, y: 275 },
  "New Hampshire": { abbr: "NH", x: 865, y: 200 },
  "New Jersey": { abbr: "NJ", x: 842, y: 265 },
  "New Mexico": { abbr: "NM", x: 335, y: 390 },
  "New York": { abbr: "NY", x: 815, y: 220 },
  "North Carolina": { abbr: "NC", x: 760, y: 370 },
  "North Dakota": { abbr: "ND", x: 465, y: 180 },
  "Ohio": { abbr: "OH", x: 695, y: 290 },
  "Oklahoma": { abbr: "OK", x: 475, y: 380 },
  "Oregon": { abbr: "OR", x: 145, y: 200 },
  "Pennsylvania": { abbr: "PA", x: 780, y: 265 },
  "Rhode Island": { abbr: "RI", x: 872, y: 232 },
  "South Carolina": { abbr: "SC", x: 745, y: 400 },
  "South Dakota": { abbr: "SD", x: 455, y: 230 },
  "Tennessee": { abbr: "TN", x: 645, y: 370 },
  "Texas": { abbr: "TX", x: 445, y: 445 },
  "Utah": { abbr: "UT", x: 260, y: 300 },
  "Vermont": { abbr: "VT", x: 845, y: 195 },
  "Virginia": { abbr: "VA", x: 780, y: 325 },
  "Washington": { abbr: "WA", x: 165, y: 150 },
  "West Virginia": { abbr: "WV", x: 740, y: 315 },
  "Wisconsin": { abbr: "WI", x: 585, y: 230 },
  "Wyoming": { abbr: "WY", x: 340, y: 250 }
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

  // Updated color palette to match the image - blue-gray gradient
  const getStateColor = (index: number) => {
    const colors = [
      '#B8C3CE', // Light blue-gray
      '#8794A3', // Medium blue-gray
      '#5F6D7E', // Darker blue-gray
      '#485869', // Deep blue-gray
      '#364254', // Very dark blue-gray
    ];
    return colors[index % colors.length];
  };

  if (isLoading) return (
    <div className="w-full h-[700px] relative">
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

  // Connect state paths with their names
  const stateMap = statesData.reduce((acc, state) => {
    acc[state.id] = state.name;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="w-full bg-gradient-to-b from-background to-background/80">
      <div className="max-w-[1300px] mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-6"
        >
          <div className="relative">
            <svg
              ref={mapRef}
              viewBox="-0 -0 1000 600"
              preserveAspectRatio="xMidYMid meet"
              className="w-full h-full max-h-[800px]" 
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
              </defs>
              {statesData.map((state, index) => (
                <motion.path
                  key={state.id}
                  d={state.path}
                  className="transition-all duration-300 cursor-pointer hover:brightness-110 hover:saturate-150"
                  style={{
                    fill: getStateColor(index),
                    filter: hoveredState === state.id ? 'url(#glow)' : 'none',
                    opacity: 0.9,
                    stroke: '#FFFFFF',
                    strokeWidth: 1,
                  }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 0.9, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.01 }}
                  whileHover={{ scale: 1.02, opacity: 1 }}
                  onMouseEnter={() => setHoveredState(state.id)}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => handleStateClick(state.name)}
                />
              ))}
              
              {/* Place state abbreviations */}
              {statesData.map(state => {
                const stateInfo = stateAbbreviations[state.name];
                if (!stateInfo) return null;
                
                return (
                  <g 
                    key={`label-${state.id}`} 
                    className="cursor-pointer"
                    onClick={() => handleStateClick(state.name)}
                  >
                    <text
                      x={stateInfo.x}
                      y={stateInfo.y}
                      className="text-[14px] font-bold pointer-events-none select-none"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ fill: '#000000', fontWeight: 700 }}
                    >
                      {stateInfo.abbr}
                    </text>
                  </g>
                );
              })}
            </svg>

            <AnimatePresence>
              {hoveredState && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute z-50 bg-white/90 backdrop-blur-md p-4 rounded-lg shadow-lg border border-slate-200/50 pointer-events-none"
                  style={{
                    left: `${hoverPosition.x}px`,
                    top: `${hoverPosition.y}px`,
                    transform: 'translate(-50%, -100%)',
                    marginTop: '-10px'
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
