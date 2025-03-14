
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, School, AlertCircle } from 'lucide-react';
import { UNIVERSITIES_COMPARE } from '../constants';
import SessionExpiredDialog from '@/components/SessionExpiredDialog';
import { useToast } from '@/hooks/use-toast';
import { useComparison } from '@/hooks/use-comparison';
import ComparisonTabContent from '@/components/ComparisonTabContent';

const ComparePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cacheUniversityData, getCachedUniversityData, cachedUniversityData } = useComparison();
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const token = sessionStorage.getItem("token");
  
  const universities = searchParams.get('universities')?.split(',') || [];

  // Check if we already have cached data for all universities
  const allUniversitiesCached = universities.every(uni => !!getCachedUniversityData(uni));
  const cachedData = universities.map(uni => getCachedUniversityData(uni)).filter(Boolean);

  // Redirect if no universities to compare
  useEffect(() => {
    if (universities.length === 0) {
      toast({
        title: "No universities selected",
        description: "Please select at least one university to compare",
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
    // Skip fetching if we already have cached data for all universities
    enabled: !allUniversitiesCached && universities.length > 0
  });

  // Use cached data if available, otherwise use fetched data
  const universityData = allUniversitiesCached ? cachedData : data;

  const handleViewDetails = (universityName) => {
    const universityData = getCachedUniversityData(universityName);
    
    if (universityData) {
      navigate(`/college/${encodeURIComponent(universityName)}`);
    } else {
      toast({
        title: "University data not found",
        description: "Unable to view details for this university",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/explore')} 
            className="mb-8 text-white/80 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Explore
          </Button>
          
          <div className="flex flex-col space-y-4 mb-8 items-center">
            <Skeleton className="h-10 w-64 bg-white/10" />
            <Skeleton className="h-5 w-96 bg-white/5" />
          </div>
          
          <Skeleton className="h-12 w-96 mx-auto mb-8 rounded-full bg-white/10" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {Array(2).fill(0).map((_, i) => (
              <div key={i} className="flex flex-col space-y-2 bg-white/5 rounded-lg p-6 h-[400px]">
                <Skeleton className="h-20 rounded-lg bg-white/10" />
                <div className="space-y-4 pt-4">
                  {Array(5).fill(0).map((_, j) => (
                    <Skeleton key={j} className="h-10 bg-white/5" />
                  ))}
                </div>
                <Skeleton className="h-10 mt-auto bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-8 max-w-2xl mx-auto">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-300 mb-3">
              Error Loading Comparison Data
            </h2>
            <p className="text-white/70 mb-6">We encountered a problem retrieving university information. Please try again later.</p>
            <Button 
              onClick={() => navigate('/explore')}
              className="bg-white/10 hover:bg-white/20 text-white"
            >
              Back to Explore
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/explore')} 
              className="text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm group transition-all"
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
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-[#7B1FA2] to-[#1976D2] p-3 rounded-xl">
                <School className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#E1BEE7] to-[#BBDEFB]">
                University Comparison
              </h1>
            </div>
            <p className="text-white/60 text-center max-w-2xl mx-auto">
              Compare universities side by side to make an informed decision about your academic future
            </p>
          </motion.div>
            
          <Tabs 
            defaultValue="overview" 
            className="mb-8"
            onValueChange={setActiveTab}
          >
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-4 rounded-full p-1 bg-white/5 backdrop-blur-sm shadow-inner border border-white/10">
                <TabsTrigger 
                  value="overview" 
                  className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#9C27B0]/80 data-[state=active]:to-[#2196F3]/80 data-[state=active]:text-white data-[state=active]:shadow-md text-white/70"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="academics" 
                  className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#9C27B0]/80 data-[state=active]:to-[#2196F3]/80 data-[state=active]:text-white data-[state=active]:shadow-md text-white/70"
                >
                  Academics
                </TabsTrigger>
                <TabsTrigger 
                  value="admissions" 
                  className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#9C27B0]/80 data-[state=active]:to-[#2196F3]/80 data-[state=active]:text-white data-[state=active]:shadow-md text-white/70"
                >
                  Admissions
                </TabsTrigger>
                <TabsTrigger 
                  value="student-life" 
                  className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#9C27B0]/80 data-[state=active]:to-[#2196F3]/80 data-[state=active]:text-white data-[state=active]:shadow-md text-white/70"
                >
                  Student Life
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="overview">
              <ComparisonTabContent 
                data={universityData} 
                tabValue="overview" 
                onViewDetails={handleViewDetails}
              />
            </TabsContent>
            
            <TabsContent value="academics">
              <ComparisonTabContent 
                data={universityData} 
                tabValue="academics"
                onViewDetails={handleViewDetails}
              />
            </TabsContent>
            
            <TabsContent value="admissions">
              <ComparisonTabContent 
                data={universityData} 
                tabValue="admissions"
                onViewDetails={handleViewDetails}
              />
            </TabsContent>
            
            <TabsContent value="student-life">
              <ComparisonTabContent 
                data={universityData} 
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
