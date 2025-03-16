import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { statesData } from '@/lib/states-data';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Search, Users, Building2, BookOpen, Award, Map, School, Compass, BrainCircuit, Globe2, BarChart3, MapPin, ChartBar, TrendingUp } from 'lucide-react';
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

  const statHighlights = [
    { 
      icon: School, 
      title: "Top Universities", 
      value: "50+",
      description: "Highest-ranked institutions per state",
      theme: "bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 hover:from-indigo-500/20 hover:to-indigo-600/10"
    },
    { 
      icon: Users, 
      title: "Student Population", 
      value: "4.5M+",
      description: "Students currently enrolled in higher education",
      theme: "bg-gradient-to-br from-purple-500/10 to-purple-600/5 hover:from-purple-500/20 hover:to-purple-600/10"
    },
    { 
      icon: BookOpen, 
      title: "Academic Programs", 
      value: "10K+",
      description: "Diverse degree programs nationwide",
      theme: "bg-gradient-to-br from-blue-500/10 to-blue-600/5 hover:from-blue-500/20 hover:to-blue-600/10"
    }
  ];

  const insightCards = [
    { 
      icon: GraduationCap, 
      title: "Explore By Major", 
      description: "Find universities offering your desired field of study",
      theme: "bg-gradient-to-br from-violet-500/10 to-violet-600/5 hover:from-violet-500/20 hover:to-violet-600/10 border-violet-500/20"
    },
    { 
      icon: MapPin, 
      title: "Campus Locations", 
      description: "Urban, suburban or rural - find your perfect setting",
      theme: "bg-gradient-to-br from-teal-500/10 to-teal-600/5 hover:from-teal-500/20 hover:to-teal-600/10 border-teal-500/20"
    },
    { 
      icon: ChartBar, 
      title: "Admissions Stats", 
      description: "Acceptance rates and application requirements",
      theme: "bg-gradient-to-br from-amber-500/10 to-amber-600/5 hover:from-amber-500/20 hover:to-amber-600/10 border-amber-500/20"
    },
    { 
      icon: TrendingUp, 
      title: "Career Outcomes", 
      description: "Employment rates & average starting salaries",
      theme: "bg-gradient-to-br from-rose-500/10 to-rose-600/5 hover:from-rose-500/20 hover:to-rose-600/10 border-rose-500/20"
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
      <div className="max-w-[1800px] mx-auto p-6">
        <div className={`grid grid-cols-1 ${isMobile ? '' : 'lg:grid-cols-12'} gap-8`}>
          {isMobile ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative rounded-2xl overflow-hidden shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-3xl -z-10" />
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
              </motion.div>
              
              <div className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-3 gap-4">
                  {statHighlights.map((highlight, index) => (
                    <motion.div
                      key={highlight.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className={`${highlight.theme} backdrop-blur-sm border border-primary/10 p-3 rounded-xl shadow-md`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="p-1.5 rounded-full bg-white/30">
                          <highlight.icon className="h-3 w-3 text-primary" />
                        </div>
                        <p className="text-primary font-medium text-xs">{highlight.title}</p>
                      </div>
                      <p className="text-2xl font-bold text-primary">{highlight.value}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{highlight.description}</p>
                    </motion.div>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {insightCards.map((card, index) => (
                    <motion.div
                      key={card.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 + (index * 0.1) }}
                      className={`${card.theme} backdrop-blur-sm border rounded-xl p-3 shadow-md hover:shadow-lg transition-all`}
                    >
                      <div className="flex items-start gap-2">
                        <div className="p-1.5 rounded-full bg-white/20 mt-0.5">
                          <card.icon className="h-3 w-3 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xs font-medium text-primary">{card.title}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2">{card.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="lg:col-span-3 space-y-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl font-semibold text-primary mb-4">University Statistics</h2>
                  <div className="grid grid-cols-1 gap-5">
                    {statHighlights.map((highlight, index) => (
                      <motion.div
                        key={highlight.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card className={`${highlight.theme} backdrop-blur-sm border-primary/10 overflow-hidden group`}>
                          <CardContent className="p-5">
                            <div className="flex items-center gap-4">
                              <div className="p-3 rounded-xl bg-white/20 group-hover:bg-white/30 transition-colors">
                                <highlight.icon className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <p className="text-3xl font-bold text-primary mb-1">{highlight.value}</p>
                                <p className="text-sm font-medium text-primary/90">{highlight.title}</p>
                                <p className="text-xs text-muted-foreground mt-1">{highlight.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h2 className="text-2xl font-semibold text-primary mb-4">Educational Insights</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {insightCards.map((card, index) => (
                      <motion.div
                        key={card.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                      >
                        <Card className={`${card.theme} backdrop-blur-sm border hover:shadow-md transition-all duration-300 group`}>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <div className="p-2.5 rounded-lg bg-white/20 group-hover:bg-white/30 transition-colors">
                                <card.icon className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-sm font-semibold text-primary">{card.title}</h3>
                                <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              <div className="lg:col-span-9">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative rounded-2xl overflow-hidden shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-3xl -z-10" />
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
                </motion.div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default USAMap;
