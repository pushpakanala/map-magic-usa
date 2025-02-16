
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from 'axios';
import { UniversityResponse } from '@/types/university';
import { MapPin, Globe, Award, School, BookOpen } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CollegePage = () => {
  const { collegeName } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [universityData, setUniversityData] = useState<UniversityResponse | null>(null);

  useEffect(() => {
    const fetchUniversityData = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get(`https://api.example.com/universities/${encodeURIComponent(collegeName)}`);
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
        <p>Loading university information...</p>
      </div>
    );
  }

  const school = universityData?.data.school;
  const programs = universityData?.data.programs;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-8"
        >
          ← Back
        </Button>

        {school && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* School Information */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-4xl font-bold">
                  {school.name}
                </CardTitle>
                <div className="flex items-center gap-2 text-muted-foreground mt-2">
                  <MapPin className="h-4 w-4" />
                  <span>{school.address}</span>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" />
                    <a href={school.school_url} target="_blank" rel="noopener noreferrer" 
                       className="text-primary hover:underline">
                      Visit Website
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span>US Ranking: #{school.us_ranking}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <School className="h-4 w-4 text-primary" />
                    <span>Accredited by {school.accreditor}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Programs Offered</h3>
                  <div className="flex flex-wrap gap-2">
                    {school.school_programs.map((program) => (
                      <span key={program} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
                        {program}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Admission Exams</h3>
                  <div className="flex flex-wrap gap-2">
                    {school.eligibility_addmission_exams.map((exam) => (
                      <span key={exam} className="bg-secondary/10 text-secondary px-2 py-1 rounded-full text-sm">
                        {exam}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Programs Section */}
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
                        {programs?.undergrad_programs.map((program) => (
                          <TableRow key={program.program_name}>
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
                        {programs?.grad_programs.map((program) => (
                          <TableRow key={program.program_name}>
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

            {/* Student & Faculty Demographics will be added in the next iteration */}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CollegePage;
