
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  const navigate = useNavigate();
  const letters = "UNIQUEST".split("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredLetter, setHoveredLetter] = useState(null);
  
  // Handle mouse movement for precise cursor tracking
  const handleMouseMove = (event, index) => {
    if (index === hoveredLetter) {
      const letterRect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - letterRect.left;
      const y = event.clientY - letterRect.top;
      setMousePosition({ x, y });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212] text-white p-4">
      <div className="max-w-5xl w-full flex flex-col items-center">
        <div className="flex flex-wrap justify-center relative">
          {letters.map((letter, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredLetter(index)}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={() => setHoveredLetter(null)}
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
              
              {/* Glowing effect that follows the mouse with 3cm diameter */}
              {hoveredLetter === index && (
                <div 
                  className="absolute pointer-events-none"
                  style={{
                    left: `${mousePosition.x - 15}px`,  // Center the glow (3cm ≈ 30px radius)
                    top: `${mousePosition.y - 15}px`,
                    width: '60px',  // 3cm diameter ≈ 60px
                    height: '60px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 40%, rgba(126,34,206,0.7) 45%, rgba(74,222,128,0.7) 50%, rgba(6,182,212,0.7) 55%, rgba(37,99,235,0.7) 60%, rgba(236,72,153,0.7) 65%, rgba(255,255,255,0) 70%)',
                    mixBlendMode: 'screen',
                    filter: 'blur(2px)',
                    opacity: 0.9,
                    zIndex: 10,
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
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
          <Button 
            className="px-8 py-6 text-lg bg-[#7e22ce] hover:bg-[#7e22ce]/80 transition-all"
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
