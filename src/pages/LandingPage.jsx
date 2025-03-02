
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  const navigate = useNavigate();
  const letters = "UNIQUEST".split("");
  const [activeLetter, setActiveLetter] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const letterRefs = useRef(letters.map(() => React.createRef()));
  
  // Function to get random gradient colors
  const getRandomGradient = () => {
    const gradients = [
      'linear-gradient(90deg, #9b87f5, #7E69AB)',
      'linear-gradient(90deg, #8B5CF6, #D946EF)',
      'linear-gradient(90deg, #0EA5E9, #8B5CF6)',
      'linear-gradient(90deg, #F97316, #EC4899)',
      'linear-gradient(90deg, #4ADE80, #2563EB)',
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  // Handle mouse movement to track position for hover effects
  const handleMouseMove = (e, index) => {
    if (activeLetter === index) {
      const letterEl = letterRefs.current[index].current;
      if (letterEl) {
        const rect = letterEl.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    }
  };

  // Get distance from mouse to a point
  const getDistance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  // Calculate the gradient for SVG path based on mouse proximity
  const calculateGradientPath = (pathData, index) => {
    if (!pathData || activeLetter !== index) return null;
    
    // Create multiple sample points along the path
    const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathElement.setAttribute("d", pathData);
    const pathLength = pathElement.getTotalLength();
    
    const numPoints = 20;
    const points = [];
    
    for (let i = 0; i < numPoints; i++) {
      const point = pathElement.getPointAtLength(pathLength * (i / numPoints));
      points.push(point);
    }
    
    // Find the closest point to mouse
    let closestDistance = Infinity;
    let closestPointIndex = 0;
    
    points.forEach((point, i) => {
      const distance = getDistance(mousePosition.x, mousePosition.y, point.x, point.y);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestPointIndex = i;
      }
    });
    
    // Create gradient effect around closest point
    const threshold = 50; // Distance threshold for gradient effect
    
    return points.map((point, i) => {
      const distance = getDistance(
        points[closestPointIndex].x, 
        points[closestPointIndex].y, 
        point.x, 
        point.y
      );
      
      // Calculate opacity based on distance from closest point
      let opacity = 0;
      if (distance < threshold) {
        opacity = 1 - (distance / threshold);
      }
      
      return {
        ...point,
        opacity: Math.max(0, Math.min(1, opacity))
      };
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212] text-white p-4">
      <div className="max-w-5xl w-full flex flex-col items-center">
        <div className="flex flex-wrap justify-center relative">
          {letters.map((letter, index) => (
            <motion.div
              key={index}
              ref={letterRefs.current[index]}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              className="relative"
              onMouseEnter={() => setActiveLetter(index)}
              onMouseLeave={() => setActiveLetter(null)}
              onMouseMove={(e) => handleMouseMove(e, index)}
            >
              {/* SVG container for letter outline */}
              <svg 
                width="140" 
                height="180" 
                viewBox="0 0 140 180" 
                fill="none"
                className="inline-block"
              >
                {/* Path definitions for each letter */}
                {letter === 'U' && (
                  <>
                    <path 
                      d="M20,20 L20,120 Q20,150 50,150 Q80,150 80,120 L80,20" 
                      stroke="rgba(255, 255, 255, 0.2)" 
                      strokeWidth="2" 
                      fill="none"
                    />
                    {activeLetter === index && calculateGradientPath("M20,20 L20,120 Q20,150 50,150 Q80,150 80,120 L80,20", index)?.map((point, i) => (
                      <circle 
                        key={i}
                        cx={point.x}
                        cy={point.y}
                        r="6"
                        fill="none"
                        style={{
                          filter: `blur(4px)`,
                          opacity: point.opacity,
                          stroke: getRandomGradient(),
                          strokeWidth: 3,
                        }}
                      />
                    ))}
                  </>
                )}
                {letter === 'N' && (
                  <>
                    <path 
                      d="M20,20 L20,150 L30,150 L80,50 L80,150 L90,150 L90,20 L80,20 L30,120 L30,20 Z" 
                      stroke="rgba(255, 255, 255, 0.2)" 
                      strokeWidth="2" 
                      fill="none"
                    />
                    {activeLetter === index && calculateGradientPath("M20,20 L20,150 L30,150 L80,50 L80,150 L90,150 L90,20 L80,20 L30,120 L30,20 Z", index)?.map((point, i) => (
                      <circle 
                        key={i}
                        cx={point.x}
                        cy={point.y}
                        r="6"
                        fill="none"
                        style={{
                          filter: `blur(4px)`,
                          opacity: point.opacity,
                          stroke: getRandomGradient(),
                          strokeWidth: 3,
                        }}
                      />
                    ))}
                  </>
                )}
                {letter === 'I' && (
                  <>
                    <path 
                      d="M50,20 L50,150" 
                      stroke="rgba(255, 255, 255, 0.2)" 
                      strokeWidth="2" 
                      fill="none"
                    />
                    {activeLetter === index && calculateGradientPath("M50,20 L50,150", index)?.map((point, i) => (
                      <circle 
                        key={i}
                        cx={point.x}
                        cy={point.y}
                        r="6"
                        fill="none"
                        style={{
                          filter: `blur(4px)`,
                          opacity: point.opacity,
                          stroke: getRandomGradient(),
                          strokeWidth: 3,
                        }}
                      />
                    ))}
                  </>
                )}
                {letter === 'Q' && (
                  <>
                    <path 
                      d="M50,50 Q20,50 20,85 L20,100 Q20,135 50,135 Q80,135 80,100 L80,85 Q80,50 50,50 Z M70,125 L90,150" 
                      stroke="rgba(255, 255, 255, 0.2)" 
                      strokeWidth="2" 
                      fill="none"
                    />
                    {activeLetter === index && calculateGradientPath("M50,50 Q20,50 20,85 L20,100 Q20,135 50,135 Q80,135 80,100 L80,85 Q80,50 50,50 Z M70,125 L90,150", index)?.map((point, i) => (
                      <circle 
                        key={i}
                        cx={point.x}
                        cy={point.y}
                        r="6"
                        fill="none"
                        style={{
                          filter: `blur(4px)`,
                          opacity: point.opacity,
                          stroke: getRandomGradient(),
                          strokeWidth: 3,
                        }}
                      />
                    ))}
                  </>
                )}
                {letter === 'E' && (
                  <>
                    <path 
                      d="M20,20 L20,150 L80,150 M20,85 L70,85 M20,20 L80,20" 
                      stroke="rgba(255, 255, 255, 0.2)" 
                      strokeWidth="2" 
                      fill="none"
                    />
                    {activeLetter === index && calculateGradientPath("M20,20 L20,150 L80,150 M20,85 L70,85 M20,20 L80,20", index)?.map((point, i) => (
                      <circle 
                        key={i}
                        cx={point.x}
                        cy={point.y}
                        r="6"
                        fill="none"
                        style={{
                          filter: `blur(4px)`,
                          opacity: point.opacity,
                          stroke: getRandomGradient(),
                          strokeWidth: 3,
                        }}
                      />
                    ))}
                  </>
                )}
                {letter === 'S' && (
                  <>
                    <path 
                      d="M70,40 Q70,20 50,20 Q20,20 20,45 Q20,70 50,85 Q80,100 80,125 Q80,150 50,150 Q20,150 20,130" 
                      stroke="rgba(255, 255, 255, 0.2)" 
                      strokeWidth="2" 
                      fill="none"
                    />
                    {activeLetter === index && calculateGradientPath("M70,40 Q70,20 50,20 Q20,20 20,45 Q20,70 50,85 Q80,100 80,125 Q80,150 50,150 Q20,150 20,130", index)?.map((point, i) => (
                      <circle 
                        key={i}
                        cx={point.x}
                        cy={point.y}
                        r="6"
                        fill="none"
                        style={{
                          filter: `blur(4px)`,
                          opacity: point.opacity,
                          stroke: getRandomGradient(),
                          strokeWidth: 3,
                        }}
                      />
                    ))}
                  </>
                )}
                {letter === 'T' && (
                  <>
                    <path 
                      d="M20,20 L90,20 M55,20 L55,150" 
                      stroke="rgba(255, 255, 255, 0.2)" 
                      strokeWidth="2" 
                      fill="none"
                    />
                    {activeLetter === index && calculateGradientPath("M20,20 L90,20 M55,20 L55,150", index)?.map((point, i) => (
                      <circle 
                        key={i}
                        cx={point.x}
                        cy={point.y}
                        r="6"
                        fill="none"
                        style={{
                          filter: `blur(4px)`,
                          opacity: point.opacity,
                          stroke: getRandomGradient(),
                          strokeWidth: 3,
                        }}
                      />
                    ))}
                  </>
                )}
              </svg>
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
