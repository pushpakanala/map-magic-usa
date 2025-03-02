
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  const navigate = useNavigate();
  const letters = "UNIQUEST".split("");
  const [hoveredLetter, setHoveredLetter] = useState(null);
  const [hoverSegments, setHoverSegments] = useState([]);
  
  // Create random segments for each letter (3-5 segments per letter)
  useEffect(() => {
    if (hoveredLetter !== null) {
      const numSegments = Math.floor(Math.random() * 3) + 3; // 3-5 segments
      const newSegments = [];
      
      for (let i = 0; i < numSegments; i++) {
        newSegments.push({
          position: Math.random(),
          length: 0.1 + Math.random() * 0.3, // Length between 10-40% of the letter
          color: getRandomNeonColor(),
          delay: Math.random() * 0.3, // Random delay for animation
        });
      }
      
      setHoverSegments(newSegments);
    } else {
      setHoverSegments([]);
    }
  }, [hoveredLetter]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#221F26] text-white p-4">
      <div className="max-w-5xl w-full flex flex-col items-center">
        <div className="flex flex-wrap justify-center">
          {letters.map((letter, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredLetter(index)}
              onMouseLeave={() => setHoveredLetter(null)}
            >
              {/* Base letter with futuristic styling */}
              <span 
                className="text-[8rem] sm:text-[10rem] md:text-[12rem] font-bold leading-none tracking-tighter hover:cursor-pointer inline-block relative"
                style={{
                  WebkitTextStroke: '2px #444',
                  textStroke: '2px #444',
                  color: 'rgba(255, 255, 255, 0.1)', // Very dull color
                  fontFamily: '"Segoe UI", Arial, sans-serif',
                }}
              >
                {/* Special styling for U and Q */}
                {letter === 'U' && index === 0 ? (
                  <span className="relative">
                    U
                    <span className="absolute h-[5px] w-[70%] bg-uniquestPurple-light top-[15%] left-[15%] opacity-30 rounded-full"></span>
                  </span>
                ) : letter === 'Q' ? (
                  <span className="relative">
                    Q
                    <span className="absolute h-[5px] w-[40%] bg-[#4ade80] bottom-[25%] right-[10%] opacity-30 rounded-full transform rotate-45"></span>
                  </span>
                ) : (
                  letter
                )}
              </span>
              
              {/* Glowing neon segments that appear on hover */}
              {hoveredLetter === index && hoverSegments.map((segment, i) => (
                <motion.span
                  key={`segment-${i}`}
                  className="absolute left-0 top-0 pointer-events-none"
                  style={{
                    WebkitTextStroke: `3px ${segment.color}`,
                    textStroke: `3px ${segment.color}`,
                    color: 'transparent',
                    textShadow: `0 0 8px ${segment.color}40`,
                    fontFamily: '"Segoe UI", Arial, sans-serif',
                    clipPath: `inset(${segment.position * 100}% 0 ${(1 - segment.position - segment.length) * 100}% 0)`,
                    fontSize: 'inherit',
                    lineHeight: 'inherit',
                    fontWeight: 'inherit',
                    letterSpacing: 'inherit',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0.8, 1] }}
                  transition={{ 
                    duration: 0.8, 
                    delay: segment.delay,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                    times: [0, 0.2, 0.5, 1] 
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

// Helper function to get random neon color for the segments
function getRandomNeonColor() {
  const colors = [
    '#9b87f5', // Purple (brand color)
    '#4ade80', // Green
    '#60a5fa', // Blue
    '#f472b6', // Pink
    '#22d3ee', // Cyan
    '#8B5CF6', // Vivid Purple
    '#0EA5E9', // Ocean Blue
    '#D946EF', // Magenta Pink
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export default LandingPage;
