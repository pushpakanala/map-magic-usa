
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
  "Arizona": { abbr: "AZ", position: [245, 370] },
  "Arkansas": { abbr: "AR", position: [545, 400] },
  "California": { abbr: "CA", position: [135, 305] },
  "Colorado": { abbr: "CO", position: [360, 322] },
  "Connecticut": { abbr: "CT", position: [860, 240] },
  "Delaware": { abbr: "DE", position: [825, 282] },
  "Florida": { abbr: "FL", position: [735, 510] },
  "Georgia": { abbr: "GA", position: [700, 420] },
  "Hawaii": { abbr: "HI", position: [230, 520] },
  "Idaho": { abbr: "ID", position: [220, 230] },
  "Illinois": { abbr: "IL", position: [595, 320] },
  "Indiana": { abbr: "IN", position: [652, 300] },
  "Iowa": { abbr: "IA", position: [550, 275] },
  "Kansas": { abbr: "KS", position: [480, 340] },
  "Kentucky": { abbr: "KY", position: [665, 350] },
  "Louisiana": { abbr: "LA", position: [550, 470] },
  "Maine": { abbr: "ME", position: [875, 170] },
  "Maryland": { abbr: "MD", position: [800, 290] },
  "Massachusetts": { abbr: "MA", position: [860, 225] },
  "Michigan": { abbr: "MI", position: [640, 235] },
  "Minnesota": { abbr: "MN", position: [530, 195] },
  "Mississippi": { abbr: "MS", position: [590, 450] },
  "Missouri": { abbr: "MO", position: [550, 350] },
  "Montana": { abbr: "MT", position: [300, 180] },
  "Nebraska": { abbr: "NE", position: [465, 285] },
  "Nevada": { abbr: "NV", position: [180, 280] },
  "New Hampshire": { abbr: "NH", position: [870, 200] },
  "New Jersey": { abbr: "NJ", position: [840, 265] },
  "New Mexico": { abbr: "NM", position: [340, 390] },
  "New York": { abbr: "NY", position: [820, 220] },
  "North Carolina": { abbr: "NC", position: [760, 370] },
  "North Dakota": { abbr: "ND", position: [470, 180] },
  "Ohio": { abbr: "OH", position: [700, 295] },
  "Oklahoma": { abbr: "OK", position: [480, 380] },
  "Oregon": { abbr: "OR", position: [150, 200] },
  "Pennsylvania": { abbr: "PA", position: [780, 265] },
  "Rhode Island": { abbr: "RI", position: [872, 232] },
  "South Carolina": { abbr: "SC", position: [740, 400] },
  "South Dakota": { abbr: "SD", position: [460, 230] },
  "Tennessee": { abbr: "TN", position: [650, 375] },
  "Texas": { abbr: "TX", position: [450, 450] },
  "Utah": { abbr: "UT", position: [265, 300] },
  "Vermont": { abbr: "VT", position: [845, 195] },
  "Virginia": { abbr: "VA", position: [780, 330] },
  "Washington": { abbr: "WA", position: [170, 150] },
  "West Virginia": { abbr: "WV", position: [745, 315] },
  "Wisconsin": { abbr: "WI", position: [590, 230] },
  "Wyoming": { abbr: "WY", position: [350, 255] },
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
    // Blue-gray colors based on the image
    const colors = [
      '#A4B7C6', // Light blue-gray
      '#7D8FA3', // Medium blue-gray
      '#5C6F84', // Darker blue-gray
      '#485A71', // Deep blue-gray
      '#364459', // Very dark blue-gray
    ];
    return colors[index % colors.length];
  };

  if (isLoading) return (
    <div className="w-full h-[500px] relative">
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
      <div className="max-w-[1200px] mx-auto p-4">
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
              className="w-full h-full max-h-[500px]" 
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
                    strokeWidth: 0.5,
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
              
              {/* State abbreviations */}
              {Object.entries(stateAbbreviations).map(([stateName, stateInfo]) => {
                const stateData = statesData.find(s => s.name === stateName);
                if (!stateData) return null;
                
                return (
                  <text
                    key={`text-${stateName}`}
                    x={stateInfo.position[0]}
                    y={stateInfo.position[1]}
                    className="text-[10px] font-bold pointer-events-none"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ fill: '#000000' }}
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
