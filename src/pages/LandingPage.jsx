
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212] text-white p-4">
      <div className="max-w-5xl w-full flex flex-col items-center">
        {/* Main headline with gradient highlight */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-2">
            Discover Your <span 
              className="bg-clip-text text-transparent transition-all duration-300 hover:brightness-150"
              style={{
                backgroundImage: 'linear-gradient(90deg, #1EAEDB 0%, #8B5CF6 100%)',
                backgroundSize: '200% auto',
                animation: 'text-shimmer 2s ease-in-out infinite'
              }}
            >
              UNIQUEST
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Find the perfect college journey tailored to your ambitions
          </p>
        </div>
        
        {/* Interactive letters display with hover effect */}
        <div className="flex flex-wrap justify-center relative mb-12">
          {"UNIQUEST".split('').map((letter, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
            >
              {/* Base letter with minimalist styling and hover effect */}
              <span 
                className="text-[8rem] sm:text-[10rem] md:text-[12rem] font-bold leading-none tracking-tighter inline-block relative hover:brightness-125 transition-all duration-300"
                style={{
                  fontFamily: '"Montserrat", "Segoe UI", Arial, sans-serif',
                  fontWeight: 800,
                  color: 'transparent', // Make text hollow (no fill)
                  WebkitTextStroke: '1px rgba(255, 255, 255, 0.2)', // Light outline for all letters
                  textStroke: '1px rgba(255, 255, 255, 0.2)',
                }}
              >
                {/* Special styling for U and Q */}
                {letter === 'U' && index === 0 ? (
                  <span className="relative">
                    U
                    <span className="absolute h-[4px] w-[50%] bg-[#7e22ce] top-[18%] left-[25%] opacity-20 rounded-full"></span>
                  </span>
                ) : letter === 'Q' ? (
                  <span className="relative">
                    Q
                    <span className="absolute h-[4px] w-[30%] bg-[#4ade80] bottom-[28%] right-[15%] opacity-20 rounded-full transform rotate-45"></span>
                  </span>
                ) : (
                  letter
                )}
              </span>
            </motion.div>
          ))}
        </div>
        
        {/* Modern gradient text showcase */}
        <div className="bg-[#1A1F2C] p-8 rounded-xl mb-16 w-full max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Experience the Future of College Search</h2>
          <p className="text-lg text-gray-300 mb-6">
            Our platform uses advanced algorithms to help you find the perfect 
            <span 
              className="mx-2 font-bold bg-clip-text text-transparent transition-all duration-300 hover:brightness-150"
              style={{
                backgroundImage: 'linear-gradient(90deg, #8B5CF6 0%, #1EAEDB 50%, #8B5CF6 100%)',
                backgroundSize: '200% auto',
                animation: 'text-shimmer 3s linear infinite'
              }}
            >
              Grok
            </span>
            for your academic journey.
          </p>
          <p className="text-gray-400">
            Discover colleges that match your interests, budget, and career goals with our intelligent recommendation system.
          </p>
        </div>
        
        {/* Modern "Try Now" button replacing the login/signup buttons */}
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.7 }}
        >
          <div 
            onClick={() => navigate('/login')}
            className="group cursor-pointer relative overflow-hidden py-4 px-10 rounded-full bg-gradient-to-r from-[#7e22ce] to-[#5b21b6] hover:shadow-lg hover:shadow-[#7e22ce]/20 transition-all duration-300"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#7e22ce]/10 to-[#1EAEDB]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute -inset-y-full right-0 w-1/3 h-[300%] bg-gradient-to-r from-transparent to-white/20 group-hover:animate-[shine_1.5s_ease]"></div>
            <span className="relative text-white text-lg font-semibold tracking-wide">Try Now</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
