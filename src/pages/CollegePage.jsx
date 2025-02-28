import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from 'axios';
import { MapPin, Globe, Award, School, BookOpen, Users, Building2, GraduationCap, DollarSign, Star } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UNIVERSITIS_DATA_GPT } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import SessionExpiredDialog from '@/components/SessionExpiredDialog';

const COLORS = ['#4C51BF', '#48BB78', '#ECC94B', '#ED64A6', '#9F7AEA', '#667EEA'];

const LoadingState = () => (
  <div className="min-h-screen bg-background p-8 flex flex-col items-center justify-center">
    <div className="relative w-24 h-24 mb-8">
      <motion.div
        className="absolute inset-0"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <GraduationCap className="w-24 h-24 text-primary" />
      </motion.div>
    </div>
    <motion.p
      className="text-xl font-medium text-primary/80"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      Loading university information...
    </motion.p>
  </div>
);

const formatPercentage = (value) => {
  if (typeof value === 'number') {
    return `${value}%`;
  }
  return value;
};

const formatFees = (fees) => {
  if (typeof fees === 'number') {
    return `$${fees.toLocaleString()}`;
  }
  return fees;
};

const formatCourseRank = (rank) => {
  return `#${rank}`;
};

const CollegePage = () => {
  const { collegeName } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [universityData, setUniversityData] = useState(null);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const token = sessionStorage.getItem('token');

  const renderSchoolPrograms = (programs) => {
    if (!programs) return [];
    if (typeof programs === 'string') {
      return [programs];
    }
    if (Array.isArray(programs)) {
      return programs;
    }
    return [];
  };

  useEffect(() => {
    const fetchUniversityData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${UNIVERSITIS_DATA_GPT}?university_name=${collegeName}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUniversityData(response.data);
      } catch (error) {
        if (error.response?.status === 401 || error.response?.data?.status?.code === 401) {
          setIsSessionExpired(true);
        }
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversityData();
  }, [collegeName, token]);

  if (loading) {
    return <LoadingState />;
  }

  if (!universityData) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <p className="text-lg text-red-500">Failed to load university data</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  const { school, programs, students, faculty } = universityData.data;

  const prepareChartData = (data) => {
    return Object.entries(data).map(([name, value]) => ({
      name,
      value: parseFloat(value.toString().replace('%', ''))
    }));
  };

  const studentDemographics = prepareChartData(students.race_ethnicity);
  const facultyDemographics = prepareChartData(faculty.race_ethnicity);

  const renderContactDetails = (contact) => {
    if (typeof contact === 'string') {
      return contact;
    }
    return (
      <div className="space-y-1">
        <p className="text-sm"><span className="font-medium">Phone:</span> {contact.phone}</p>
        <p className="text-sm"><span className="font-medium">Email:</span> {contact.email}</p>
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mb-8 fixed top-4 left-4 z-10 hover:bg-background/80 backdrop-blur-sm"
          >
            ← Back
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8 pt-16"
          >
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm border border-primary/10 shadow-xl">
                <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
                  <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                      {school.name}
                    </h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{school.address}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold">#{school.us_ranking} in US Rankings</span>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap gap-2"
                >
                  {renderSchoolPrograms(school.school_programs).map((program) => (
                    <span
                      key={program}
                      className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm border border-primary/20 hover:bg-primary/20 transition-colors"
                    >
                      {program}
                    </span>
                  ))}
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  className="p-6 rounded-xl bg-gradient-to-br from-background/60 to-background/30 backdrop-blur-sm border border-primary/10 hover:shadow-lg hover:shadow-primary/5 transition-all"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                    <Building2 className="h-5 w-5 text-primary" />
                    Key Information
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center pb-2 border-b border-primary/10">
                      <span className="text-muted-foreground">Founded</span>
                      <span className="font-medium">{school.founded_in}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-primary/10">
                      <span className="text-muted-foreground">Type</span>
                      <span className="font-medium">{school.type}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-primary/10">
                      <span className="text-muted-foreground">Cost of Living</span>
                      <span className="font-medium">{school.cost_of_living_near_university}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Required Exams</span>
                      <div className="flex flex-wrap justify-end gap-1">
                        {school.eligibility_addmission_exams.map((exam) => (
                          <span key={exam} className="text-xs bg-primary/10 px-2 py-1 rounded-full">
                            {exam}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="p-6 rounded-xl bg-gradient-to-br from-background/60 to-background/30 backdrop-blur-sm border border-primary/10 hover:shadow-lg hover:shadow-primary/5 transition-all"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                    <Award className="h-5 w-5 text-primary" />
                    Academic Performance
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center pb-2 border-b border-primary/10">
                      <span className="text-muted-foreground">Graduation Rate</span>
                      <span className="font-medium">{school.graduation_rate}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-primary/10">
                      <span className="text-muted-foreground">Acceptance Rate</span>
                      <span className="font-medium">{school.acceptance_rate}</span>
                    </div>
                    <div className="space-y-2">
                      <span className="text-muted-foreground block">Accreditation</span>
                      <p className="font-medium">{school.accreditor}</p>
                      <p className="text-xs text-muted-foreground">Code: {school.accreditor_code}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="p-6 rounded-xl bg-gradient-to-br from-background/60 to-background/30 backdrop-blur-sm border border-primary/10 hover:shadow-lg hover:shadow-primary/5 transition-all"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                    <Globe className="h-5 w-5 text-primary" />
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    {renderContactDetails(school.contact_details)}
                    <a 
                      href={school.school_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mt-2"
                    >
                      <Globe className="h-4 w-4" />
                      Visit Website
                    </a>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Student Demographics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Total Students</p>
                      <p className="text-3xl font-bold text-primary">{students.total_students.toLocaleString()}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Graduate Students</p>
                      <p className="text-3xl font-bold text-primary">{students.grad_students.toLocaleString()}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Male Students</p>
                      <p className="text-2xl font-semibold">{formatPercentage(students.men)}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Female Students</p>
                      <p className="text-2xl font-semibold">{formatPercentage(students.women)}</p>
                    </div>
                  </div>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={studentDemographics}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {studentDemographics.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <School className="h-5 w-5 text-primary" />
                    Faculty Demographics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Male Faculty</p>
                      <p className="text-2xl font-semibold">{formatPercentage(faculty.men)}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Female Faculty</p>
                      <p className="text-2xl font-semibold">{formatPercentage(faculty.women)}</p>
                    </div>
                  </div>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={facultyDemographics}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {facultyDemographics.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Academic Programs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="undergrad" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="undergrad">Undergraduate Programs</TabsTrigger>
                    <TabsTrigger value="grad">Graduate Programs</TabsTrigger>
                  </TabsList>

                  <TabsContent value="undergrad" className="mt-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Program Name</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Fees</TableHead>
                          <TableHead>Ranking</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {programs.undergrad_programs.map((program, index) => (
                          <TableRow key={index}>
                            <TableCell>{program.program_name}</TableCell>
                            <TableCell>{program.program_duration}</TableCell>
                            <TableCell>{formatFees(program.fees)}</TableCell>
                            <TableCell>{formatCourseRank(program.course_rank)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>

                  <TabsContent value="grad" className="mt-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Program Name</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Fees</TableHead>
                          <TableHead>Ranking</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {programs.grad_programs.map((program, index) => (
                          <TableRow key={index}>
                            <TableCell>{program.program_name}</TableCell>
                            <TableCell>{program.program_duration}</TableCell>
                            <TableCell>{formatFees(program.fees)}</TableCell>
                            <TableCell>{formatCourseRank(program.course_rank)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
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

export default CollegePage;
