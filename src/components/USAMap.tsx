
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { statesData } from '@/lib/states-data';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, School, Compass, BrainCircuit, Globe2, BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

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

  const highlights = [
    { 
      title: "Universities Mapped", 
      value: "3,000+",
      icon: School,
      theme: "bg-gradient-to-br from-uniquestPurple/10 to-uniquestPurple-dark/5"
    },
    { 
      title: "Total States", 
      value: statesData.length.toString(),
      icon: Map,
      theme: "bg-gradient-to-br from-cyan-500/10 to-cyan-600/5"
    },
    { 
      title: "Student Population", 
      value: "20M+",
      icon: Globe2,
      theme: "bg-gradient-to-br from-violet-500/10 to-violet-600/5"
    }
  ];

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
    <div className="min-h-screen w-full bg-gradient-to-b from-background to-background/80">
      <div className="max-w-[1800px] mx-auto p-4">
        <div className="grid grid-cols-1 gap-6">
          {/* Map comes first on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative mb-6"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-3xl -z-10" />
            <div className="relative">
              <svg
                ref={mapRef}
                viewBox="-0 -0 1300 1000"
                preserveAspectRatio="xMidYMid meet"
                className="w-full h-full"
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
                    className={`${getStateColor(index)} transition-all duration-300 cursor-pointer
                      hover:brightness-110 hover:saturate-150`}
                    style={{
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

          {/* Only show the highlights on non-mobile */}
          {!isMobile && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-3 gap-4 mt-6"
            >
              {highlights.map((highlight, index) => (
                <motion.div
                  key={highlight.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.4 }}
                >
                  <Card className={`${highlight.theme} backdrop-blur-sm border-primary/10 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-full bg-white/20">
                          <highlight.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-primary">{highlight.value}</p>
                          <p className="text-sm text-muted-foreground">{highlight.title}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default USAMap;
