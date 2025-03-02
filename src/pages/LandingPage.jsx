
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GraduationCap, ArrowUpRight } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
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
                    {/* Graduation cap on U - increased size */}
                    <GraduationCap className="absolute -top-8 -left-3 w-16 h-16 text-[#8B5CF6] opacity-80" />
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
        <div className="bg-[#1A1F2C] p-8 rounded-xl mb-12 w-full max-w-3xl shadow-lg shadow-[#8B5CF6]/10">
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
        
        {/* New Feature Highlights Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mb-10">
          <div className="bg-gradient-to-br from-[#1A1F2C] to-[#141824] p-6 rounded-xl border border-primary/5 hover:border-primary/20 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-[#8B5CF6] to-[#1EAEDB] rounded-lg mb-4 flex items-center justify-center">
              <GraduationCap className="text-white h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Interactive Map</h3>
            <p className="text-gray-400 text-sm">Explore universities state by state with our interactive map visualization.</p>
          </div>
          
          <div className="bg-gradient-to-br from-[#1A1F2C] to-[#141824] p-6 rounded-xl border border-primary/5 hover:border-primary/20 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-[#8B5CF6] to-[#1EAEDB] rounded-lg mb-4 flex items-center justify-center">
              <ArrowUpRight className="text-white h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">AI Advisor</h3>
            <p className="text-gray-400 text-sm">Get personalized college recommendations with our advanced AI chat assistant.</p>
          </div>
          
          <div className="bg-gradient-to-br from-[#1A1F2C] to-[#141824] p-6 rounded-xl border border-primary/5 hover:border-primary/20 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-[#8B5CF6] to-[#1EAEDB] rounded-lg mb-4 flex items-center justify-center">
              <svg className="text-white h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Favorite Schools</h3>
            <p className="text-gray-400 text-sm">Save and compare your favorite universities to make informed decisions.</p>
          </div>
        </div>
        
        {/* Try Now button moved up and using modern styling from App.css */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.7 }}
        >
          <div onClick={() => navigate('/login')} className="try-now-button group">
            <span className="flex items-center gap-2">
              Try now <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </span>
            <div className="underline-effect"></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
