import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { statesData } from '@/lib/states-data';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Search, Users, Building2, BookOpen, Award, Map, School, Compass, BrainCircuit, Globe2, BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
      'fill-slate-400',
      'fill-slate-500',
      'fill-zinc-400',
      'fill-zinc-500',
      'fill-slate-600'
    ];
    return colors[index % colors.length];
  };

  const features = [
    { 
      icon: GraduationCap, 
      title: "Academic Excellence", 
      description: "Browse top-ranked universities and colleges",
      theme: "bg-gradient-to-br from-blue-500/10 to-blue-600/5 hover:from-blue-500/20 hover:to-blue-600/10"
    },
    { 
      icon: BrainCircuit, 
      title: "Research Opportunities", 
      description: "Discover cutting-edge research programs",
      theme: "bg-gradient-to-br from-purple-500/10 to-purple-600/5 hover:from-purple-500/20 hover:to-purple-600/10"
    },
    { 
      icon: Globe2, 
      title: "Global Connections", 
      description: "International student programs and exchanges",
      theme: "bg-gradient-to-br from-green-500/10 to-green-600/5 hover:from-green-500/20 hover:to-green-600/10"
    },
    { 
      icon: BarChart3, 
      title: "Career Outcomes", 
      description: "Employment rates and alumni success stories",
      theme: "bg-gradient-to-br from-orange-500/10 to-orange-600/5 hover:from-orange-500/20 hover:to-orange-600/10"
    },
    { 
      icon: Compass, 
      title: "Campus Life", 
      description: "Student activities and campus culture",
      theme: "bg-gradient-to-br from-pink-500/10 to-pink-600/5 hover:from-pink-500/20 hover:to-pink-600/10"
    },
    { 
      icon: Award, 
      title: "Scholarships", 
      description: "Financial aid and merit-based opportunities",
      theme: "bg-gradient-to-br from-teal-500/10 to-teal-600/5 hover:from-teal-500/20 hover:to-teal-600/10"
    }
  ];

  const highlights = [
    { 
      title: "Universities Mapped", 
      value: "3,000+",
      icon: School,
      theme: "bg-gradient-to-br from-indigo-500/10 to-indigo-600/5"
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
      icon: Users,
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
      <div className="max-w-[1800px] mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 gap-4"
            >
              {highlights.map((highlight, index) => (
                <motion.div
                  key={highlight.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className={`${highlight.theme} backdrop-blur-sm border-primary/10`}>
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                >
                  <Card className={`${feature.theme} backdrop-blur-sm border-primary/10 transition-all duration-300`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-white/20">
                          <feature.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-primary">{feature.title}</h3>
                          <p className="text-xs text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="lg:col-span-9">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
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
            </motion.div>
          </div>
        </div>

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
                transform: 'translate(20px, -50%)'
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
    </div>
  );
};

export default USAMap;
