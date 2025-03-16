
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { statesData } from '@/lib/states-data';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Users, Building2, BookOpen, Award, Map, School, Compass, BrainCircuit, Globe2, BarChart3 } from 'lucide-react';
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

  const getStateAbbreviation = (stateId: string) => {
    const state = statesData.find(state => state.id === stateId);
    return state?.abbreviation || '';
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

  const educationStats = [
    { 
      title: "Top Universities", 
      value: "250+",
      icon: Award,
      description: "Leading institutions across the nation",
      theme: "bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border-indigo-500/20"
    },
    { 
      title: "Student Population", 
      value: "19.4M",
      icon: Users,
      description: "Active college students nationwide",
      theme: "bg-gradient-to-br from-violet-500/10 to-violet-600/5 border-violet-500/20"
    },
    { 
      title: "Degree Programs", 
      value: "1,000+",
      icon: BookOpen,
      description: "Diverse academic pathways available",
      theme: "bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20"
    }
  ];

  const insightCards = [
    { 
      title: "Research Funding", 
      value: "$86B",
      description: "Annual university research investment",
      icon: BrainCircuit,
      theme: "bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20"
    },
    { 
      title: "International Students", 
      value: "1.1M",
      description: "Students from 220+ countries",
      icon: Globe2,
      theme: "bg-gradient-to-br from-teal-500/10 to-teal-600/5 border-teal-500/20"
    },
    { 
      title: "Average ROI", 
      value: "14.8%",
      description: "Return on college education investment",
      icon: BarChart3,
      theme: "bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20"
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
      <div className="max-w-[1800px] mx-auto p-4 md:p-6">
        <div className={`grid grid-cols-1 ${isMobile ? '' : 'lg:grid-cols-12'} gap-8`}>
          {/* Map comes first on mobile */}
          <div className={`${isMobile ? 'order-first' : 'lg:col-span-9 lg:order-last'}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
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
                    <g key={state.id}>
                      <motion.path
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
                        onMouseEnter={() => setHoveredState(state.id)}
                        onMouseLeave={() => setHoveredState(null)}
                        onClick={() => handleStateClick(state.name)}
                      />
                      {/* State Abbreviations */}
                      <text
                        x={state.textPosition[0]}
                        y={state.textPosition[1]}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-white text-[12px] font-semibold pointer-events-none select-none"
                        style={{ textShadow: "0px 1px 2px rgba(0,0,0,0.5)" }}
                      >
                        {getStateAbbreviation(state.id)}
                      </text>
                    </g>
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
          </div>

          {/* Stats cards come second on mobile */}
          <div className={`${isMobile ? 'order-last' : 'lg:col-span-3 lg:order-first'} space-y-6`}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4"
            >
              {educationStats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className={`${stat.theme} backdrop-blur-sm border transition-all duration-300 hover:shadow-md hover:shadow-indigo-500/5 group hover:scale-[1.02]`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                          <stat.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-primary">{stat.value}</p>
                          <p className="text-sm font-medium text-primary/80">{stat.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4"
            >
              {insightCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                >
                  <Card className={`${card.theme} backdrop-blur-sm border transition-all duration-300 hover:shadow-md hover:shadow-indigo-500/5 group hover:scale-[1.02]`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                          <card.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="text-sm font-medium text-primary">{card.title}</h3>
                            <span className="text-lg font-bold text-primary">{card.value}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default USAMap;
