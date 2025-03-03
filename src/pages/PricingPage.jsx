
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PricingPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-pink-500 to-purple-600">
          Pricing Plans Coming Soon
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
          We're carefully crafting pricing plans that provide exceptional value for students, parents, and educational institutions.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 mb-12">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h3 className="text-xl font-semibold mb-4 text-amber-400">Student Plan</h3>
            <p className="text-gray-400 mb-6">Perfect for high school students beginning their college search journey.</p>
            <div className="text-lg font-bold mb-6">Coming Soon</div>
          </div>
          
          <div className="relative bg-gray-900 p-6 rounded-xl border border-pink-500/50 before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-amber-400 before:to-pink-500 before:opacity-20 before:-z-10">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-400 to-pink-500 text-white text-xs font-bold py-1 px-4 rounded-full">
              MOST POPULAR
            </div>
            <h3 className="text-xl font-semibold mb-4 text-pink-500">Family Plan</h3>
            <p className="text-gray-400 mb-6">Ideal for families with students planning their educational future.</p>
            <div className="text-lg font-bold mb-6">Coming Soon</div>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h3 className="text-xl font-semibold mb-4 text-purple-500">Counselor Plan</h3>
            <p className="text-gray-400 mb-6">Designed for educational counselors working with multiple students.</p>
            <div className="text-lg font-bold mb-6">Coming Soon</div>
          </div>
        </div>
        
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
          Join our waitlist to be the first to know when our pricing plans are available.
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
