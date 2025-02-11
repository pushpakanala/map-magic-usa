
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface College {
  id: string;
  name: string;
  city: string;
  website: string;
}

const StatePage = () => {
  const { stateName } = useParams();
  const navigate = useNavigate();

  // Query for state population data
  const { data: stateData, isLoading: stateLoading } = useQuery({
    queryKey: ['stateDetails', stateName],
    queryFn: async () => {
      const response = await axios.get('https://api.census.gov/data/2023/acs/acs1', {
        params: {
          get: "NAME,B01001_001E,B01001_002E,B01001_026E",
          for: "state:*",
          key: "e921b3e18e6fd0b1d0845420b5baf19b33229c36"
        }
      });
      
      const formattedData = response.data.slice(1).find((item: any[]) => 
        item[0].toLowerCase() === stateName?.toLowerCase()
      );
      return formattedData ? {
        population: parseInt(formattedData[1]).toLocaleString(),
        male: parseInt(formattedData[2]).toLocaleString(),
        female: parseInt(formattedData[3]).toLocaleString()
      } : null;
    }
  });

  // Query for universities data
  const { data: universities, isLoading: universitiesLoading } = useQuery({
    queryKey: ['universities', stateName],
    queryFn: async () => {
      // Using JSONPlaceholder as a sample API - replace this with your actual API
      const response = await axios.get(`https://jsonplaceholder.typicode.com/users?state=${stateName}`);
      
      // Transform the sample data into our College interface format
      return response.data.map((item: any) => ({
        id: item.id.toString(),
        name: item.company.name, // Using company name as university name for sample data
        city: item.address.city,
        website: item.website
      }));
    }
  });

  if (stateLoading || universitiesLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-12 w-48 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  const handleCollegeClick = (college: College) => {
    navigate(`/college/${encodeURIComponent(college.name)}`);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto text-left">
        <div className="w-full max-w-7xl text-left">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="mb-8"
          >
            ← Back to Map
          </Button>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold mb-6 capitalize">
            {stateName}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-primary/10">
              <CardHeader>
                <CardTitle>Total Population</CardTitle>
                <CardDescription>Current census data</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stateData?.population}</p>
              </CardContent>
            </Card>

            <Card className="bg-blue-500/10">
              <CardHeader>
                <CardTitle>Male Population</CardTitle>
                <CardDescription>Current census data</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stateData?.male}</p>
              </CardContent>
            </Card>

            <Card className="bg-pink-500/10">
              <CardHeader>
                <CardTitle>Female Population</CardTitle>
                <CardDescription>Current census data</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stateData?.female}</p>
              </CardContent>
            </Card>
          </div>

          {universities && universities.length > 0 && (
            <>
              <h2 className="text-3xl font-bold mb-6">
                Universities ({universities.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {universities.map((college: College) => (
                  <motion.div
                    key={college.id}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card 
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => handleCollegeClick(college)}
                    >
                      <CardHeader>
                        <CardTitle className="text-xl">{college.name}</CardTitle>
                        <CardDescription>{college.city}</CardDescription>
                      </CardHeader>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default StatePage;
