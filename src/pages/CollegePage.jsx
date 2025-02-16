
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from 'axios';
import { MapPin, Globe, Award, School, BookOpen, Users, Building2, GraduationCap } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UNIVERSITIS_DATA_GPT } from '../constants';

const CollegePage = () => {
  const { collegeName } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [universityData, setUniversityData] = useState(null);

  useEffect(() => {
    const fetchUniversityData = async () => {
      try {
        const response = await axios.get(`${UNIVERSITIS_DATA_GPT}?university_name=${collegeName}`);
        setUniversityData(response.data);
      } catch (error) {
        console.error('Error fetching university data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversityData();
  }, [collegeName]);

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

  const school = universityData?.data.school;
  const programs = universityData?.data.programs;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background p-8">
      <div className="max-w-7xl mx-auto">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-8">
          ← Back
        </Button>

        {school && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <Card className="w-full overflow-hidden border-none shadow-xl bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
              <CardHeader className="pb-0">
                <div className="relative">
                  <div className="absolute top-0 right-0 flex space-x-2">
                    {school.school_programs.map((program) => (
                      <span
                        key={program}
                        className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm"
                      >
                        {program}
                      </span>
                    ))}
                  </div>
                  <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    {school.name}
                  </CardTitle>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 text-muted-foreground mt-4"
                >
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{school.address}</span>
                </motion.div>
              </CardHeader>

              <CardContent className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3 group">
                      <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Globe className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Website</p>
                        <a
                          href={school.school_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm"
                        >
                          Visit Official Website
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 group">
                      <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Award className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">US Ranking</p>
                        <p className="text-2xl font-bold text-primary">#{school.us_ranking}</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="md:col-span-2"
                  >
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-primary" />
                          Accreditation
                        </h3>
                        <div className="bg-muted/50 p-4 rounded-lg backdrop-blur-sm">
                          <p className="text-sm">{school.accreditor}</p>
                          <p className="text-xs text-muted-foreground mt-1">Code: {school.accreditor_code}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Users className="h-5 w-5 text-primary" />
                          Admission Requirements
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {school.eligibility_addmission_exams.map((exam) => (
                            <span
                              key={exam}
                              className="bg-secondary/10 text-secondary px-3 py-1.5 rounded-full text-sm font-medium hover:bg-secondary/20 transition-colors cursor-default"
                            >
                              {exam}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>

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
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {programs?.undergrad_programs.map((program, index) => (
                          <TableRow key={index}>
                            <TableCell>{program.program_name}</TableCell>
                            <TableCell>{program.program_duration}</TableCell>
                            <TableCell>{program.fees}</TableCell>
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
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {programs?.grad_programs.map((program, index) => (
                          <TableRow key={index}>
                            <TableCell>{program.program_name}</TableCell>
                            <TableCell>{program.program_duration}</TableCell>
                            <TableCell>{program.fees}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CollegePage;
