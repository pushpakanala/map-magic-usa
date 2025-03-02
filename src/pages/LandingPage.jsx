
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  const navigate = useNavigate();
  const letters = "UNIQUEST".split("");
  const [hoveredLetter, setHoveredLetter] = useState(null);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <div className="max-w-5xl w-full flex flex-col items-center">
        <div className="flex">
          {letters.map((letter, index) => (
            <motion.span
              key={index}
              className="text-[8rem] sm:text-[10rem] md:text-[15rem] font-bold leading-none tracking-tighter relative overflow-visible hover:cursor-pointer"
              style={{
                WebkitTextStroke: hoveredLetter === index ? '3px' : '2px',
                WebkitTextStrokeColor: hoveredLetter === index ? getRandomColor() : '#444',
                color: 'rgba(0, 0, 0, 0.6)' // More dull/transparent color
              }}
              onMouseEnter={() => setHoveredLetter(index)}
              onMouseLeave={() => setHoveredLetter(null)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              {letter}
            </motion.span>
          ))}
        </div>
        
        <motion.div 
          className="mt-16 flex flex-col sm:flex-row gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <Button 
            variant="purple"
            className="px-8 py-6 text-lg rounded-md transition-all"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
          <Button 
            variant="purpleOutline"
            className="px-8 py-6 text-lg rounded-md transition-all"
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

// Helper function to get random color for gradient effect
function getRandomColor() {
  const colors = [
    '#9b87f5', // Purple
    '#4ade80', // Green
    '#60a5fa', // Blue
    '#f472b6', // Pink
    '#fbbf24', // Yellow
    '#22d3ee', // Cyan
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export default LandingPage;
