
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, School, BookOpenCheck, GraduationCap, Users } from 'lucide-react';
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

  // Redirect if no universities to compare
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
        const response = await axios.get(
          `${UNIVERSITIES_COMPARE}?university_names=${encodeURIComponent(universities.join(','))}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Cache each university's data
        if (response.data.data && Array.isArray(response.data.data)) {
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
    enabled: universities.length >= 2
  });

  const handleViewDetails = (universityName) => {
    // Check if we have cached data for this university
    const cachedData = getCachedUniversityData(universityName);
    
    if (cachedData) {
      console.log('Using cached data to navigate to university details');
    }
    
    // Navigate to the college details page
    navigate(`/college/${encodeURIComponent(universityName)}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/explore')} 
            className="mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Explore
          </Button>
          
          <div className="flex flex-col space-y-4 mb-8">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-5 w-96" />
          </div>
          
          <Skeleton className="h-12 w-96 mx-auto mb-8 rounded-md" />
          
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-[400px] rounded-lg" />
              <Skeleton className="h-[400px] rounded-lg" />
            </div>
            
            {universities.length > 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-[400px] rounded-lg" />
                {universities.length > 3 && <Skeleton className="h-[400px] rounded-lg" />}
              </div>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-red-500">
            Error loading comparison data
          </h2>
          <p className="mb-4">Please try again later</p>
          <Button onClick={() => navigate('/explore')}>
            Back to Explore
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/explore')} 
              className="hover:bg-white/20 backdrop-blur-sm group transition-all dark:text-white"
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
            <div className="flex items-center justify-center gap-2 mb-3">
              <School className="h-6 w-6 text-uniquestPurple" />
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-uniquestPurple to-uniquestPurple-light">
                University Comparison
              </h1>
            </div>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto">
              Compare {data?.length} universities side by side to make an informed decision about your academic future
            </p>
          </motion.div>
            
          <Tabs 
            defaultValue="overview" 
            className="mb-8"
            onValueChange={setActiveTab}
          >
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-4 rounded-full p-1 bg-white dark:bg-slate-800/50 backdrop-blur-sm shadow-md">
                <TabsTrigger 
                  value="overview" 
                  className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-uniquestPurple/80 data-[state=active]:to-uniquestPurple-light/80 data-[state=active]:text-white data-[state=active]:shadow-sm gap-1.5"
                >
                  <School className="h-4 w-4" />
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="academics" 
                  className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-uniquestPurple/80 data-[state=active]:to-uniquestPurple-light/80 data-[state=active]:text-white data-[state=active]:shadow-sm gap-1.5"
                >
                  <BookOpenCheck className="h-4 w-4" />
                  <span>Academics</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="admissions" 
                  className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-uniquestPurple/80 data-[state=active]:to-uniquestPurple-light/80 data-[state=active]:text-white data-[state=active]:shadow-sm gap-1.5"
                >
                  <GraduationCap className="h-4 w-4" />
                  <span>Admissions</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="student-life" 
                  className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-uniquestPurple/80 data-[state=active]:to-uniquestPurple-light/80 data-[state=active]:text-white data-[state=active]:shadow-sm gap-1.5"
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
      
      <SessionExpiredDialog 
        open={isSessionExpired} 
        onOpenChange={setIsSessionExpired}
      />
    </>
  );
};

export default ComparePage;
