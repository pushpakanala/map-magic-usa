
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const PricingPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-black text-white p-4">
      {/* Navigation */}
      <div className="w-full max-w-7xl flex justify-between items-center py-6">
        <div 
          className="text-3xl font-bold cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-pink-500">
            UNIQUEST
          </span>
        </div>
        <div className="flex space-x-8 items-center">
          <Button 
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-amber-400 to-pink-500 hover:opacity-90 transition-opacity text-white"
          >
            Get Started
          </Button>
        </div>
      </div>

      <div className="text-center max-w-4xl mx-auto mt-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-pink-500 to-purple-600">
          Pricing Plans
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-16">
          Choose the perfect plan for your college search journey.
          Get started today with our carefully crafted pricing options.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 mb-12">
          <div className="bg-gray-900 p-8 rounded-xl border border-gray-800">
            <h3 className="text-xl font-semibold mb-4 text-amber-400">Student Plan</h3>
            <div className="text-3xl font-bold mb-2">$9.99<span className="text-sm text-gray-400">/month</span></div>
            <p className="text-gray-400 mb-6">Perfect for high school students beginning their college search journey.</p>
            
            <div className="space-y-3 text-left mb-8">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Access to college recommendations</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Interactive college map</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Save up to 10 favorite schools</span>
              </div>
            </div>
            
            <Button className="w-full bg-gradient-to-r from-amber-400 to-pink-500 hover:opacity-90">
              Coming Soon
            </Button>
          </div>
          
          <div className="relative bg-gray-900 p-8 rounded-xl border border-pink-500/50 transform scale-105 z-10 shadow-xl shadow-pink-500/20">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-400 to-pink-500 text-white text-xs font-bold py-1 px-4 rounded-full">
              MOST POPULAR
            </div>
            <h3 className="text-xl font-semibold mb-4 text-pink-500">Family Plan</h3>
            <div className="text-3xl font-bold mb-2">$19.99<span className="text-sm text-gray-400">/month</span></div>
            <p className="text-gray-400 mb-6">Ideal for families with students planning their educational future.</p>
            
            <div className="space-y-3 text-left mb-8">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">All features in Student Plan</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Multiple student profiles</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Advanced college comparison tools</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Unlimited favorites</span>
              </div>
            </div>
            
            <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90">
              Coming Soon
            </Button>
          </div>
          
          <div className="bg-gray-900 p-8 rounded-xl border border-gray-800">
            <h3 className="text-xl font-semibold mb-4 text-purple-500">Counselor Plan</h3>
            <div className="text-3xl font-bold mb-2">$49.99<span className="text-sm text-gray-400">/month</span></div>
            <p className="text-gray-400 mb-6">Designed for educational counselors working with multiple students.</p>
            
            <div className="space-y-3 text-left mb-8">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">All features in Family Plan</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Manage up to 25 student profiles</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Analytics dashboard</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Priority support</span>
              </div>
            </div>
            
            <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90">
              Coming Soon
            </Button>
          </div>
        </div>
        
        <div className="mt-12 mb-16">
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            Need a custom plan for your institution? <span className="text-pink-500">Contact us</span> for enterprise pricing.
          </p>
          
          <Button 
            onClick={() => navigate('/')} 
            variant="outline" 
            className="border-pink-500 text-pink-500 hover:bg-pink-500/10"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
