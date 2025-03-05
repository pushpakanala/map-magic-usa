
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Building2, ArrowLeft, School, MapPin, GraduationCap, Users, BookOpen, Calendar, Clock, DollarSign, Award, GlobeIcon, Briefcase } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { UNIVERSITIS_DATA_GPT } from '../constants';
import SessionExpiredDialog from '@/components/SessionExpiredDialog';
import { useToast } from '@/hooks/use-toast';
import { useComparison } from '@/hooks/use-comparison';

const ComparePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { comparedUniversities } = useComparison();
  const [isSessionExpired, setIsSessionExpired] = useState(false);
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
          `${UNIVERSITIS_DATA_GPT}?university_names=${encodeURIComponent(universities.join(','))}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/explore')} 
            className="mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Explore
          </Button>
          
          <h1 className="text-3xl font-bold mb-8">
            Comparing Universities
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(3).fill(0).map((_, i) => (
              <Card key={i} className="w-full">
                <CardHeader>
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {Array(8).fill(0).map((_, j) => (
                    <Skeleton key={j} className="h-6 w-full" />
                  ))}
                </CardContent>
              </Card>
            ))}
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
      <div className="min-h-screen bg-background p-8">
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
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/explore')} 
              className="hover:bg-background/80 backdrop-blur-sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Explore
            </Button>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              University Comparison
            </h1>
            <p className="text-muted-foreground mb-8">
              Comparing {data?.length} universities side by side
            </p>
            
            <Tabs defaultValue="overview" className="mb-8">
              <TabsList className="w-full max-w-md mx-auto mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="academics">Academics</TabsTrigger>
                <TabsTrigger value="admissions">Admissions</TabsTrigger>
                <TabsTrigger value="student-life">Student Life</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data?.map((item, index) => (
                    <Card key={index} className="overflow-hidden border-primary/10 hover:shadow-lg transition-shadow">
                      <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
                        <CardTitle className="flex items-start gap-2">
                          <Building2 className="h-5 w-5 text-primary mt-1" />
                          <span>{item.school.name}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{item.school.city}, {item.school.state}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <School className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Ranking: #{item.school.us_ranking}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Type: {item.school.type}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Students: {item.school.students?.total_students}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Founded: {item.school.founded_in}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Acceptance Rate: {item.school.acceptance_rate}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <GlobeIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm overflow-hidden text-ellipsis">
                            <a href={item.school.school_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              {item.school.school_url.replace(/^https?:\/\//, '')}
                            </a>
                          </span>
                        </div>
                        
                        <Separator />
                        
                        <div className="pt-2">
                          <Button 
                            onClick={() => navigate(`/college/${encodeURIComponent(item.school.name)}`)} 
                            variant="outline" 
                            className="w-full"
                          >
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="academics">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {data?.map((item, index) => (
                    <Card key={index} className="overflow-hidden border-primary/10">
                      <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
                        <CardTitle>{item.school.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          Programs
                        </h3>
                        <div className="space-y-2 mb-6">
                          {item.school.school_programs?.slice(0, 5).map((program, idx) => (
                            <div key={idx} className="text-sm py-1 px-2 bg-primary/5 rounded">
                              {program}
                            </div>
                          ))}
                          {item.school.school_programs?.length > 5 && (
                            <div className="text-sm text-muted-foreground">
                              +{item.school.school_programs.length - 5} more programs
                            </div>
                          )}
                        </div>
                        
                        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          Program Duration
                        </h3>
                        <div className="space-y-3 mb-6">
                          <div className="flex justify-between">
                            <span className="text-sm">Undergraduate:</span>
                            <span className="text-sm font-medium">4 years</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Graduate:</span>
                            <span className="text-sm font-medium">2 years</span>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                          <Award className="h-4 w-4 text-primary" />
                          Graduation Rate
                        </h3>
                        <div className="text-xl font-semibold text-center mb-6">
                          {item.school.graduation_rate}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="admissions">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {data?.map((item, index) => (
                    <Card key={index} className="overflow-hidden border-primary/10">
                      <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
                        <CardTitle>{item.school.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                          <Award className="h-4 w-4 text-primary" />
                          Acceptance Rate
                        </h3>
                        <div className="text-xl font-semibold text-center mb-6">
                          {item.school.acceptance_rate}
                        </div>
                        
                        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-primary" />
                          Application Fee
                        </h3>
                        {item.school.application_fee && (
                          <div className="space-y-3 mb-6">
                            <div className="flex justify-between">
                              <span className="text-sm">Undergraduate (Local):</span>
                              <span className="text-sm font-medium">
                                ${item.school.application_fee.undergraduate?.local_students}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Undergraduate (International):</span>
                              <span className="text-sm font-medium">
                                ${item.school.application_fee.undergraduate?.international_students}
                              </span>
                            </div>
                          </div>
                        )}
                        
                        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          Application Deadlines
                        </h3>
                        {item.school.admission_deadlines && (
                          <div className="space-y-3">
                            <div>
                              <div className="text-sm font-medium">Fall Semester</div>
                              <div className="flex justify-between">
                                <span className="text-xs text-muted-foreground">Local:</span>
                                <span className="text-xs">
                                  {item.school.admission_deadlines.fall?.local_students}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs text-muted-foreground">International:</span>
                                <span className="text-xs">
                                  {item.school.admission_deadlines.fall?.international_students}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="student-life">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {data?.map((item, index) => (
                    <Card key={index} className="overflow-hidden border-primary/10">
                      <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
                        <CardTitle>{item.school.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                          <Users className="h-4 w-4 text-primary" />
                          Student Demographics
                        </h3>
                        {item.school.students && (
                          <div className="space-y-3 mb-6">
                            <div className="flex justify-between">
                              <span className="text-sm">Total Students:</span>
                              <span className="text-sm font-medium">{item.school.students.total_students}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Graduate Students:</span>
                              <span className="text-sm font-medium">{item.school.students.grad_students}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Gender Ratio:</span>
                              <span className="text-sm font-medium">
                                {item.school.students.men} men / {item.school.students.women} women
                              </span>
                            </div>
                          </div>
                        )}
                        
                        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-primary" />
                          Part-time Opportunities
                        </h3>
                        {item.school.part_time_opportunities && (
                          <div className="space-y-3">
                            <div>
                              <div className="text-sm font-medium">On-campus Jobs</div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {item.school.part_time_opportunities.on_campus_jobs?.slice(0, 2).map((job, idx) => (
                                  <span key={idx} className="text-xs py-1 px-2 bg-primary/5 rounded">
                                    {job}
                                  </span>
                                ))}
                                {item.school.part_time_opportunities.on_campus_jobs?.length > 2 && (
                                  <span className="text-xs text-muted-foreground">
                                    +{item.school.part_time_opportunities.on_campus_jobs.length - 2} more
                                  </span>
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium">Internships</div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {item.school.part_time_opportunities.internships?.slice(0, 2).map((job, idx) => (
                                  <span key={idx} className="text-xs py-1 px-2 bg-primary/5 rounded">
                                    {job}
                                  </span>
                                ))}
                                {item.school.part_time_opportunities.internships?.length > 2 && (
                                  <span className="text-xs text-muted-foreground">
                                    +{item.school.part_time_opportunities.internships.length - 2} more
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
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
