
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from 'axios';
import { MapPin, Globe, Award, School, BookOpen, Users, Building2, GraduationCap, DollarSign } from 'lucide-react';
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const CollegePage = () => {
  const { collegeName } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [universityData, setUniversityData] = useState(null);
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    const fetchUniversityData = async () => {
      try {
        const response = await axios.get(`${UNIVERSITIS_DATA_GPT}?university_name=${collegeName}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUniversityData(response.data);
      } catch (error) {
        console.error('Error fetching university data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversityData();
  }, [collegeName, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <GraduationCap className="h-12 w-12 animate-pulse mx-auto text-primary" />
          <p className="text-lg">Loading university information...</p>
        </div>
      </div>
    );
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
      value: parseFloat(value.replace('%', ''))
    }));
  };

  const studentDemographics = prepareChartData(students.race_ethnicity);
  const facultyDemographics = prepareChartData(faculty.race_ethnicity);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-7xl mx-auto p-8">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)} 
          className="mb-8 fixed top-4 left-4 z-10"
        >
          ← Back
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8 pt-12"
        >
          <Card className="w-full overflow-hidden border-none shadow-xl bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="space-y-6">
                <div>
                  <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    {school.name}
                  </CardTitle>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-2 text-muted-foreground mt-4"
                  >
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{school.address}</span>
                  </motion.div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {school.eligibility_addmission_exams.map((exam) => (
                      <span
                        key={exam}
                        className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm border border-primary/20"
                      >
                        {exam}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Key Information</h3>
                    <div className="space-y-2">
                      <p className="text-sm"><span className="font-medium">Founded:</span> {school.founded_in}</p>
                      <p className="text-sm"><span className="font-medium">Type:</span> {school.type}</p>
                      <p className="text-sm"><span className="font-medium">Cost of Living:</span> {school.cost_of_living_near_university}</p>
                      <p className="text-sm"><span className="font-medium">Programs:</span> {school.school_programs}</p>
                      <p className="text-sm"><span className="font-medium">US Ranking:</span> #{school.us_ranking}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Contact Information</h3>
                    <div className="space-y-2">
                      <p className="text-sm">{school.contact_details}</p>
                      <p className="text-sm"><span className="font-medium">Website:</span> 
                        <a 
                          href={school.school_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline ml-1"
                        >
                          Visit Website
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Academic Performance</h3>
                    <div className="space-y-2">
                      <p className="text-sm"><span className="font-medium">Graduation Rate:</span> {school.graduation_rate}</p>
                      <p className="text-sm"><span className="font-medium">Acceptance Rate:</span> {school.acceptance_rate}</p>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Accreditation:</p>
                        <p className="text-sm">{school.accreditor}</p>
                        <p className="text-xs text-muted-foreground">Code: {school.accreditor_code}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

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
                    <p className="text-2xl font-semibold">{students.men}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Female Students</p>
                    <p className="text-2xl font-semibold">{students.women}</p>
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
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {studentDemographics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
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
                    <p className="text-2xl font-semibold">{faculty.men}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Female Faculty</p>
                    <p className="text-2xl font-semibold">{faculty.women}</p>
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
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {facultyDemographics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
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
                          <TableCell>${program.fees.toLocaleString()}</TableCell>
                          <TableCell>{program.course_rank}</TableCell>
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
                          <TableCell>${program.fees.toLocaleString()}</TableCell>
                          <TableCell>{program.course_rank}</TableCell>
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
  );
};

export default CollegePage;
