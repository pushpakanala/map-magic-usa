
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  const navigate = useNavigate();
  const letters = "UNIQUEST".split("");
  const [hoveredLetter, setHoveredLetter] = useState(null);
  const [glowSegments, setGlowSegments] = useState([]);
  
  // Create random glow segments for each letter when hovered
  useEffect(() => {
    if (hoveredLetter !== null) {
      const numSegments = Math.floor(Math.random() * 2) + 2; // 2-3 segments
      const newSegments = [];
      
      for (let i = 0; i < numSegments; i++) {
        newSegments.push({
          startPosition: Math.random() * 0.7, // Random start position (0-70% of outline)
          length: 0.2 + Math.random() * 0.3, // Length between 20-50% of the outline
          color: getRandomNeonColor(),
          delay: Math.random() * 0.2, // Random delay for animation
          pulseDuration: 1.5 + Math.random(), // Random pulse duration
          side: Math.random() > 0.5 ? 'left' : 'right', // Randomly choose side
        });
      }
      
      setGlowSegments(newSegments);
    } else {
      setGlowSegments([]);
    }
  }, [hoveredLetter]);

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
              onMouseLeave={() => setHoveredLetter(null)}
            >
              {/* Base letter with minimalist styling */}
              <span 
                className="text-[8rem] sm:text-[10rem] md:text-[12rem] font-bold leading-none tracking-tighter hover:cursor-pointer inline-block relative"
                style={{
                  fontFamily: '"Montserrat", "Segoe UI", Arial, sans-serif',
                  fontWeight: 800,
                  color: 'rgba(255, 255, 255, 0.2)', // Very dull color for base
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
              
              {/* Glowing neon segments that appear on hover */}
              {hoveredLetter === index && glowSegments.map((segment, i) => (
                <motion.span
                  key={`segment-${i}`}
                  className="absolute left-0 top-0 pointer-events-none"
                  style={{
                    fontFamily: '"Montserrat", "Segoe UI", Arial, sans-serif',
                    fontWeight: 800,
                    WebkitTextStroke: `2.5px ${segment.color}`,
                    textStroke: `2.5px ${segment.color}`,
                    color: 'transparent',
                    textShadow: `0 0 10px ${segment.color}80`,
                    fontSize: 'inherit',
                    lineHeight: 'inherit',
                    letterSpacing: 'inherit',
                    // Create partial outline with clip-path
                    clipPath: segment.side === 'left' 
                      ? `polygon(0% ${segment.startPosition * 100}%, 50% ${segment.startPosition * 100}%, 50% ${(segment.startPosition + segment.length) * 100}%, 0% ${(segment.startPosition + segment.length) * 100}%)`
                      : `polygon(50% ${segment.startPosition * 100}%, 100% ${segment.startPosition * 100}%, 100% ${(segment.startPosition + segment.length) * 100}%, 50% ${(segment.startPosition + segment.length) * 100}%)`,
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
                    delay: segment.delay,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                >
                  {letter}
                </motion.span>
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
