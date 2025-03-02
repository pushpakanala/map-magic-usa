
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  const navigate = useNavigate();
  const letters = "UNIQUEST".split("");
  const [hoveredLetter, setHoveredLetter] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const letterRefs = useRef(new Array(letters.length).fill(null).map(() => React.createRef()));
  
  // Colors for modern gradient effects
  const gradientColors = [
    ['#FF3CAC', '#784BA0', '#2B86C5'], // Pink to Blue
    ['#8EC5FC', '#E0C3FC'], // Lavender
    ['#FFDEE9', '#B5FFFC'], // Pink to Cyan
    ['#FA8BFF', '#2BD2FF', '#2BFF88'], // Neon
    ['#FFD1FF', '#FAD0C4', '#FFC8DD'], // Soft Pink
    ['#FEE140', '#FA709A'], // Yellow to Pink
    ['#0093E9', '#80D0C7'], // Electric Blue
    ['#85FFBD', '#FFFB7D'], // Minty
  ];
  
  // Track mouse position over letters
  const handleMouseMove = (e, index) => {
    if (hoveredLetter === index) {
      const letterElement = letterRefs.current[index].current;
      if (letterElement) {
        const rect = letterElement.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <div className="max-w-5xl w-full flex flex-col items-center">
        <div className="flex">
          {letters.map((letter, index) => (
            <motion.span
              key={index}
              ref={letterRefs.current[index]}
              className="text-[8rem] sm:text-[10rem] md:text-[15rem] font-bold leading-none tracking-tighter relative overflow-visible hover:cursor-pointer"
              style={{
                WebkitTextStroke: '2px #555',
                textStroke: '2px #555',
                color: 'transparent'
              }}
              onMouseEnter={() => setHoveredLetter(index)}
              onMouseLeave={() => {
                setHoveredLetter(null);
                setMousePosition({ x: 0, y: 0 });
              }}
              onMouseMove={(e) => handleMouseMove(e, index)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              {letter}
              {hoveredLetter === index && (
                <motion.div 
                  className="absolute pointer-events-none"
                  style={{
                    left: `${mousePosition.x - 30}px`,
                    top: `${mousePosition.y - 30}px`,
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${gradientColors[Math.floor(Math.random() * gradientColors.length)].join(', ')})`,
                    mixBlendMode: 'lighten',
                    filter: 'blur(8px)',
                    opacity: 0.9,
                    zIndex: 5
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
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
