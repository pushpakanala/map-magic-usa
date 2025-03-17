
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

// Updated state abbreviations with refined positions to ensure proper placement
const stateAbbreviations: { [key: string]: { abbr: string, position: [number, number] } } = {
  "Alabama": { abbr: "AL", position: [625, 435] },
  "Alaska": { abbr: "AK", position: [140, 550] },
  "Arizona": { abbr: "AZ", position: [235, 365] },
  "Arkansas": { abbr: "AR", position: [545, 395] },
  "California": { abbr: "CA", position: [125, 310] },
  "Colorado": { abbr: "CO", position: [350, 320] },
  "Connecticut": { abbr: "CT", position: [865, 240] },
  "Delaware": { abbr: "DE", position: [830, 282] },
  "Florida": { abbr: "FL", position: [735, 505] },
  "Georgia": { abbr: "GA", position: [700, 425] },
  "Hawaii": { abbr: "HI", position: [230, 510] },
  "Idaho": { abbr: "ID", position: [210, 230] },
  "Illinois": { abbr: "IL", position: [590, 320] },
  "Indiana": { abbr: "IN", position: [647, 300] },
  "Iowa": { abbr: "IA", position: [540, 273] },
  "Kansas": { abbr: "KS", position: [470, 345] },
  "Kentucky": { abbr: "KY", position: [662, 345] },
  "Louisiana": { abbr: "LA", position: [550, 465] },
  "Maine": { abbr: "ME", position: [875, 170] },
  "Maryland": { abbr: "MD", position: [805, 290] },
  "Massachusetts": { abbr: "MA", position: [860, 225] },
  "Michigan": { abbr: "MI", position: [635, 235] },
  "Minnesota": { abbr: "MN", position: [525, 195] },
  "Mississippi": { abbr: "MS", position: [585, 445] },
  "Missouri": { abbr: "MO", position: [545, 345] },
  "Montana": { abbr: "MT", position: [300, 180] },
  "Nebraska": { abbr: "NE", position: [460, 280] },
  "Nevada": { abbr: "NV", position: [175, 275] },
  "New Hampshire": { abbr: "NH", position: [865, 200] },
  "New Jersey": { abbr: "NJ", position: [838, 265] },
  "New Mexico": { abbr: "NM", position: [335, 390] },
  "New York": { abbr: "NY", position: [815, 220] },
  "North Carolina": { abbr: "NC", position: [760, 370] },
  "North Dakota": { abbr: "ND", position: [465, 180] },
  "Ohio": { abbr: "OH", position: [695, 290] },
  "Oklahoma": { abbr: "OK", position: [475, 380] },
  "Oregon": { abbr: "OR", position: [145, 200] },
  "Pennsylvania": { abbr: "PA", position: [775, 265] },
  "Rhode Island": { abbr: "RI", position: [872, 232] },
  "South Carolina": { abbr: "SC", position: [740, 400] },
  "South Dakota": { abbr: "SD", position: [455, 230] },
  "Tennessee": { abbr: "TN", position: [645, 370] },
  "Texas": { abbr: "TX", position: [445, 445] },
  "Utah": { abbr: "UT", position: [260, 300] },
  "Vermont": { abbr: "VT", position: [845, 195] },
  "Virginia": { abbr: "VA", position: [780, 325] },
  "Washington": { abbr: "WA", position: [165, 150] },
  "West Virginia": { abbr: "WV", position: [740, 315] },
  "Wisconsin": { abbr: "WI", position: [585, 230] },
  "Wyoming": { abbr: "WY", position: [340, 250] },
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
    <div className="w-full h-[600px] relative">
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
              viewBox="-0 -0 1200 700"
              preserveAspectRatio="xMidYMid meet"
              className="w-full h-full max-h-[600px]" 
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
                  onMouseEnter={() => setHoveredState(state.name)}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => handleStateClick(state.name)}
                />
              ))}
              
              {/* State abbreviations with improved positioning */}
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
