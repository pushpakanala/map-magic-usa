import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, School, BookOpenCheck, GraduationCap, Users, Building2, Sparkles } from 'lucide-react';
import { UNIVERSITIS_DATA_GPT, UNIVERSITIES_COMPARE } from '../constants';
import SessionExpiredDialog from '@/components/SessionExpiredDialog';
import { useToast } from '@/hooks/use-toast';
import { useComparison } from '@/hooks/use-comparison';
import ComparisonTabContent from '@/components/ComparisonTabContent';

const ComparePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cacheUniversityData, getCachedUniversityData } = useComparison();
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const token = sessionStorage.getItem("token");
  
  const universities = searchParams.get('universities')?.split(',') || [];

  useEffect(() => {
    if (universities.length < 2) {
      toast({
        title: "Not enough universities",
        description: "Please select at least two universities to compare",
        variant: "destructive",
      });
      navigate('/explore');
    }
  }, [universities, navigate, toast]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['compareUniversities', universities.join(',')],
    queryFn: async () => {
      try {
        const cachedKey = `comparison_${universities.join(',')}`;
        const cachedData = sessionStorage.getItem(cachedKey);
        
        if (cachedData) {
          console.log('Using cached comparison data');
          return JSON.parse(cachedData);
        }
        
        console.log('Fetching fresh comparison data from API');
        const response = await axios.get(
          `${UNIVERSITIES_COMPARE}?university_names=${encodeURIComponent(universities.join(','))}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (response.data.data && Array.isArray(response.data.data)) {
          sessionStorage.setItem(cachedKey, JSON.stringify(response.data.data));
          
          response.data.data.forEach(uni => {
            if (uni.school && uni.school.name) {
              cacheUniversityData(uni.school.name, uni);
            }
          });
        }
        
        return response.data.data;
      } catch (error) {
        if (error.response?.status === 401 || error.response?.data?.status?.code === 401) {
          setIsSessionExpired(true);
        }
        throw error;
      }
    },
    enabled: universities.length >= 2,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });

  const handleViewDetails = (universityName) => {
    const cachedData = getCachedUniversityData(universityName);
    
    if (cachedData) {
      console.log('Using cached data to navigate to university details');
    } else {
      console.log('No cached data found for this university');
    }
    
    navigate(`/college/${encodeURIComponent(universityName)}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#0f1222] dark:from-[#0f172a] dark:to-[#0f1222] p-8">
        <div className="max-w-7xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/explore')} 
            className="mb-8 text-indigo-200/80 hover:text-indigo-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Explore
          </Button>
          
          <div className="relative flex flex-col items-center justify-center space-y-10 mb-12">
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.7, 1, 0.7] 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Building2 className="w-20 h-20 text-indigo-500/60" />
            </motion.div>
            <motion.div
              className="h-10 w-64 bg-indigo-800/50 rounded-lg"
              animate={{ 
                opacity: [0.4, 0.7, 0.4] 
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <motion.div
              className="h-5 w-96 bg-indigo-800/40 rounded-lg"
              animate={{ 
                opacity: [0.3, 0.6, 0.3] 
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.2
              }}
            />
          </div>
          
          <div className="h-12 w-96 mx-auto mb-12 bg-indigo-900/40 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-indigo-600/50 to-indigo-400/50"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-[400px] rounded-2xl bg-indigo-900/20 border border-indigo-500/20" />
            <Skeleton className="h-[400px] rounded-2xl bg-indigo-900/20 border border-indigo-500/20" />
            {universities.length > 2 && (
              <>
                <Skeleton className="h-[400px] rounded-2xl bg-indigo-900/20 border border-indigo-500/20" />
                {universities.length > 3 && <Skeleton className="h-[400px] rounded-2xl bg-indigo-900/20 border border-indigo-500/20" />}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    toast({
      title: "Error loading comparison data",
      description: "Please try again later",
      variant: "destructive",
    });
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#0f1222] dark:from-[#0f172a] dark:to-[#0f1222] p-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-red-500">
            Error loading comparison data
          </h2>
          <p className="mb-4 text-indigo-200/80">Please try again later</p>
          <Button 
            onClick={() => navigate('/explore')} 
            className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600"
          >
            Back to Explore
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#0c0c16] bg-[url('public/lovable-uploads/2fe89ce0-f195-42a4-a352-a57bc50f72cb.png')] bg-cover bg-center bg-no-repeat bg-blend-overlay text-white">
        <div className="min-h-screen backdrop-blur-sm bg-gradient-to-br from-[#0f172a]/90 to-[#0f1222]/90">
          <div className="max-w-7xl mx-auto p-8">
            <div className="flex justify-between items-center mb-8">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/explore')} 
                className="hover:bg-indigo-900/20 text-indigo-300 hover:text-indigo-200 backdrop-blur-sm border border-indigo-500/20 rounded-xl group transition-all"
              >
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
                Back to Explore
              </Button>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="relative">
                  <Building2 className="h-8 w-8 text-indigo-400" />
                  <motion.div
                    className="absolute -inset-1 rounded-full"
                    animate={{ 
                      boxShadow: ["0 0 0 0 rgba(129, 140, 248, 0)", "0 0 0 4px rgba(129, 140, 248, 0.3)", "0 0 0 0 rgba(129, 140, 248, 0)"]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                  />
                </div>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-indigo-100">
                  University Comparison
                </h1>
                <div className="relative">
                  <Sparkles className="h-6 w-6 text-indigo-400" />
                  <motion.div
                    className="absolute -inset-1 rounded-full"
                    animate={{ 
                      boxShadow: ["0 0 0 0 rgba(129, 140, 248, 0)", "0 0 0 4px rgba(129, 140, 248, 0.3)", "0 0 0 0 rgba(129, 140, 248, 0)"]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      repeatType: "loop",
                      delay: 0.5
                    }}
                  />
                </div>
              </div>
              <p className="text-indigo-300/80 text-center max-w-2xl mx-auto">
                Compare {data?.length} universities side by side to make an informed decision about your academic future
              </p>
            </motion.div>
              
            <Tabs 
              defaultValue="overview" 
              className="mb-8"
              onValueChange={setActiveTab}
            >
              <div className="flex justify-center mb-12">
                <TabsList className="grid grid-cols-4 rounded-full p-1 bg-indigo-900/30 backdrop-blur-sm border border-indigo-500/20 shadow-xl shadow-indigo-700/5">
                  <TabsTrigger 
                    value="overview" 
                    className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:shadow-indigo-700/20 gap-1.5 text-indigo-300"
                  >
                    <School className="h-4 w-4" />
                    <span>Overview</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="academics" 
                    className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:shadow-indigo-700/20 gap-1.5 text-indigo-300"
                  >
                    <BookOpenCheck className="h-4 w-4" />
                    <span>Academics</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="admissions" 
                    className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:shadow-indigo-700/20 gap-1.5 text-indigo-300"
                  >
                    <GraduationCap className="h-4 w-4" />
                    <span>Admissions</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="student-life" 
                    className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:shadow-indigo-700/20 gap-1.5 text-indigo-300"
                  >
                    <Users className="h-4 w-4" />
                    <span>Student Life</span>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="overview">
                <ComparisonTabContent 
                  data={data} 
                  tabValue="overview" 
                  onViewDetails={handleViewDetails}
                />
              </TabsContent>
              
              <TabsContent value="academics">
                <ComparisonTabContent 
                  data={data} 
                  tabValue="academics"
                  onViewDetails={handleViewDetails}
                />
              </TabsContent>
              
              <TabsContent value="admissions">
                <ComparisonTabContent 
                  data={data} 
                  tabValue="admissions"
                  onViewDetails={handleViewDetails}
                />
              </TabsContent>
              
              <TabsContent value="student-life">
                <ComparisonTabContent 
                  data={data} 
                  tabValue="student-life"
                  onViewDetails={handleViewDetails}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <SessionExpiredDialog 
        open={isSessionExpired} 
        onOpenChange={setIsSessionExpired}
      />
    </>
  );
};

export default ComparePage;
