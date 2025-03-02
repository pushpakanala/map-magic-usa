
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  const navigate = useNavigate();
  const letters = "UNIQUEST".split("");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  // Colors for the highlight effect
  const highlightColors = [
    'border-purple-500',
    'border-green-400',
    'border-blue-400',
    'border-pink-500',
    'border-yellow-400',
    'border-cyan-400',
    'border-red-400',
    'border-emerald-400',
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <div className="max-w-5xl w-full flex flex-col items-center">
        <div className="flex">
          {letters.map((letter, index) => (
            <motion.span
              key={index}
              className={`text-[8rem] sm:text-[10rem] md:text-[15rem] font-bold leading-none tracking-tighter relative
                ${hoveredIndex === index ? `text-black ${highlightColors[index % highlightColors.length]}` : 'text-transparent'}
                hover:cursor-pointer`}
              style={{
                WebkitTextStroke: '1px #333', 
                textStroke: '1px #333'
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              {letter}
              {hoveredIndex === index && (
                <motion.span 
                  className={`absolute inset-0 z-[-1] opacity-80`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  style={{
                    background: `linear-gradient(90deg, ${getRandomColor()}, ${getRandomColor()})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                  }}
                >
                  {letter}
                </motion.span>
              )}
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
