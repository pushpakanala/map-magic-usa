
import React from 'react';
import USAMap from '@/components/USAMap';

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          United States Interactive Map
        </h1>
        <p className="text-center text-muted-foreground mb-12">
          Click on a state to learn more about it, or hover to see its population
        </p>
        <USAMap />
      </div>
    </div>
  );
};

export default Index;
