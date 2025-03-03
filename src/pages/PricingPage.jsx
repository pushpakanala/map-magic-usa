
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PricingPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-pink-500 to-purple-600">
          Pricing Coming Soon
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12">
          We're working on our pricing plans. Check back soon for more details.
        </p>
        <Button 
          onClick={() => navigate('/')} 
          className="bg-gradient-to-r from-amber-400 to-pink-500 hover:opacity-90 transition-opacity text-white"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default PricingPage;
