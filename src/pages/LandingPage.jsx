
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  const navigate = useNavigate();
  const letters = "UNIQUEST".split("");
  const [hoveredLetter, setHoveredLetter] = useState(null);
  const [hoveredPart, setHoveredPart] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [glowSegments, setGlowSegments] = useState([]);
  
  // Handle mouse movement to track position within a letter
  const handleMouseMove = (event, index) => {
    if (hoveredLetter === index) {
      const letterRect = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - letterRect.left) / letterRect.width;
      const y = (event.clientY - letterRect.top) / letterRect.height;
      setMousePosition({ x, y });
      
      // Determine which part of the letter is being hovered
      // Divide letter into 9 parts (3x3 grid)
      const partX = Math.floor(x * 3);
      const partY = Math.floor(y * 3);
      const partIndex = partY * 3 + partX;
      setHoveredPart(partIndex);
    }
  };
  
  // Create random glow segment for the hovered part
  useEffect(() => {
    if (hoveredLetter !== null && hoveredPart !== null) {
      // Create segments based on the hovered part
      const newSegments = [{
        partIndex: hoveredPart,
        color: getRandomNeonColor(),
        pulseDuration: 1.2 + Math.random() * 0.8,
      }];
      
      setGlowSegments(newSegments);
    } else {
      setGlowSegments([]);
    }
  }, [hoveredLetter, hoveredPart]);

  // Create clip path for the specific part of the letter
  const getClipPath = (partIndex) => {
    const row = Math.floor(partIndex / 3);
    const col = partIndex % 3;
    
    const startX = (col * 33.33);
    const startY = (row * 33.33);
    const endX = startX + 33.33;
    const endY = startY + 33.33;
    
    return `polygon(${startX}% ${startY}%, ${endX}% ${startY}%, ${endX}% ${endY}%, ${startX}% ${endY}%)`;
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
                setHoveredPart(null);
              }}
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
              
              {/* Glowing segments for the hovered part of the letter */}
              {hoveredLetter === index && glowSegments.map((segment, i) => (
                <motion.div
                  key={`segment-${i}`}
                  className="absolute left-0 top-0 w-full h-full overflow-hidden pointer-events-none"
                  style={{
                    clipPath: getClipPath(segment.partIndex),
                  }}
                >
                  <span
                    className="absolute left-0 top-0 w-full h-full"
                    style={{
                      fontFamily: '"Montserrat", "Segoe UI", Arial, sans-serif',
                      fontWeight: 800,
                      WebkitTextStroke: `2.5px ${segment.color}`,
                      textStroke: `2.5px ${segment.color}`,
                      color: 'transparent',
                      textShadow: `0 0 10px ${segment.color}80`,
                      fontSize: 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: 'scale(1)',
                      fontSize: 'inherit',
                    }}
                  >
                    {letter}
                  </span>
                  <motion.span
                    className="absolute left-0 top-0 w-full h-full flex items-center justify-center"
                    style={{
                      fontFamily: '"Montserrat", "Segoe UI", Arial, sans-serif',
                      fontWeight: 800,
                      WebkitTextStroke: `2.5px ${segment.color}`,
                      textStroke: `2.5px ${segment.color}`,
                      color: 'transparent',
                      textShadow: `0 0 10px ${segment.color}80`,
                      fontSize: 'inherit',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0.7, 1],
                      textShadow: [
                        `0 0 8px ${segment.color}40`,
                        `0 0 12px ${segment.color}90`,
                        `0 0 8px ${segment.color}40`,
                        `0 0 15px ${segment.color}90`
                      ]
                    }}
                    transition={{ 
                      duration: segment.pulseDuration, 
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }}
                  >
                    {letter}
                  </motion.span>
                </motion.div>
              ))}
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
