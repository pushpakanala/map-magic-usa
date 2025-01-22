import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Skeleton } from '@/components/ui/skeleton';

const StatePage = () => {
  const { stateName } = useParams();
  const navigate = useNavigate();

  const { data: stateData, isLoading } = useQuery({
    queryKey: ['stateDetails', stateName],
    queryFn: async () => {
      const response = await axios.get('https://api.census.gov/data/2023/acs/acs1', {
        params: {
            get: "NAME,B01001_001E,B01001_002E,B01001_026E", // Total population, male, female
            for: "state:*", // Get data for all states
            key: "e921b3e18e6fd0b1d0845420b5baf19b33229c36" // Replace with your Census API key
        }
    });
    
      const formattedData = response.data.slice(1).find((item: any[]) => 
        item[0].toLowerCase() === stateName?.toLowerCase()
      );
      return formattedData ? {
        population: parseInt(formattedData[1]).toLocaleString()
      } : null;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-48 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="mb-8"
        >
          ← Back to Map
        </Button>
        
        <h1 className="text-4xl font-bold mb-6 capitalize">
          {stateName}
        </h1>
        
        <div className="bg-card rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">State Information</h2>
          <p className="text-lg">
            Population: {stateData?.population || 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatePage;