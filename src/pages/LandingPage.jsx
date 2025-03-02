
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  const navigate = useNavigate();
  const letters = "UNIQUEST".split("");
  const [hoveredLetter, setHoveredLetter] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [glowPosition, setGlowPosition] = useState(null);
  const letterRefs = useRef(letters.map(() => React.createRef()));
  
  // Handle mouse movement to track exact position of cursor
  const handleMouseMove = (event, index) => {
    if (hoveredLetter === index) {
      const letterRect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - letterRect.left;
      const y = event.clientY - letterRect.top;
      
      setMousePosition({ x, y });
      setGlowPosition({
        x,
        y,
        color: getRandomNeonColor(),
      });
    }
  };
  
  // Handle login click - redirect to map page after login
  const handleLogin = () => {
    navigate('/login', { state: { redirectTo: '/' } });
  };

  // Handle signup click
  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212] text-white p-4">
      <div className="max-w-5xl w-full flex flex-col items-center">
        <div className="flex flex-wrap justify-center">
          {letters.map((letter, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredLetter(index)}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={() => {
                setHoveredLetter(null);
                setGlowPosition(null);
              }}
              ref={letterRefs.current[index]}
            >
              {/* Base letter with minimalist styling */}
              <span 
                className="text-[8rem] sm:text-[10rem] md:text-[12rem] font-bold leading-none tracking-tighter hover:cursor-pointer inline-block relative"
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
              
              {/* Precise glow effect where mouse cursor is */}
              {hoveredLetter === index && glowPosition && (
                <div
                  className="absolute pointer-events-none mix-blend-screen"
                  style={{
                    left: `${glowPosition.x - 10}px`,
                    top: `${glowPosition.y - 10}px`,
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${glowPosition.color} 0%, rgba(255,255,255,0) 70%)`,
                    filter: `blur(6px) brightness(1.5)`,
                    boxShadow: `0 0 15px 5px ${glowPosition.color}`,
                    opacity: 0.9,
                    transform: 'scale(2)', // Making it approximately 1cm in diameter
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-16 flex flex-col sm:flex-row gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.7 }}
        >
          <Button 
            variant="outline"
            className="px-8 py-6 text-lg bg-transparent border-[#7e22ce] text-white hover:bg-[#7e22ce]/20 transition-all"
            onClick={handleLogin}
          >
            Login
          </Button>
          <Button 
            className="px-8 py-6 text-lg bg-[#7e22ce] hover:bg-[#7e22ce]/80 transition-all"
            onClick={handleSignup}
          >
            Sign Up
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

// Helper function to get random neon color for the segments
function getRandomNeonColor() {
  const colors = [
    '#9333ea', // Purple
    '#4ade80', // Green
    '#06b6d4', // Cyan
    '#2563eb', // Blue
    '#ec4899', // Pink
    '#8b5cf6', // Violet
    '#f97316', // Orange
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export default LandingPage;
