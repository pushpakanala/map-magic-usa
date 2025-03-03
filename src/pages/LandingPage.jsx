import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, ArrowUpRight, CheckCircle, Lock, FileText, Briefcase, School, BarChart, LineChart, Star } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  
  // Cards data
  const cards = [
    {
      id: 1,
      title: "College Recommendation AI",
      content: [
        { text: "Analyzing your preferences...", checked: true },
        { text: "Finding matching colleges", checked: false },
        { text: "Generating recommendations", checked: false }
      ],
      gradientClass: "from-orange-500 to-red-400",
      result: "Result: Perfect College Match",
      tags: ["Enhanced AI", "Real-time", "99.9% Accurate"]
    },
    {
      id: 2,
      title: "Interactive College Map",
      content: [
        { category: "College Type", options: ["Public", "Private", "Community"] },
        { category: "Location", options: ["Urban", "Suburban", "Rural"] }
      ],
      gradientClass: "from-amber-400 to-pink-500",
      tags: ["Interactive", "Nationwide", "Up-to-date"]
    },
    {
      id: 3,
      title: "College Comparison Tool",
      content: "Compare universities side by side to make informed decisions",
      gradientClass: "from-purple-600 to-blue-500",
      buttonText: "Start Comparing"
    }
  ];
  
  // Review data
  const reviews = [
    {
      id: 1,
      name: "Pushpak Praneeth",
      role: "Student",
      content: "As a student aiming for top engineering programs, UNIQUEST helped me discover universities that perfectly matched my academic interests and career goals. The interactive map made my college search enjoyable and less stressful.",
      rating: 5
    },
    {
      id: 2,
      name: "Durga Rao",
      role: "Student",
      content: "Finding the right college for my daughter was overwhelming until we found UNIQUEST. The personalized recommendations and detailed university profiles gave us confidence in making this important decision for her future.",
      rating: 5
    },
    {
      id: 3,
      name: "Leela Krishna",
      role: "Student",
      content: "UNIQUEST has transformed how I guide students through the college application process. The interactive tools and comprehensive data help me provide better advice tailored to each student's unique aspirations.",
      rating: 5
    }
  ];

  // Card highlighting effect every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [cards.length]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-black text-white p-4">
      {/* Navigation */}
      <div className="w-full max-w-7xl flex justify-between items-center py-6">
        <div className="text-3xl font-bold">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-pink-500">
            UNIQUEST
          </span>
        </div>
        <div className="hidden md:flex space-x-8 items-center">
          {/* Top-right "Try now" button */}
          <div className="relative inline-block">
            <button 
              onClick={() => navigate('/login')} 
              className="try-now-button group"
            >
              Try now <ArrowUpRight size={18} className="ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              <div className="underline-effect"></div>
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-5xl w-full flex flex-col items-center">
        {/* Main headline with gradient - Reduced spacing */}
        <div className="text-center mb-2">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-pink-500 to-purple-600">
              Think College Search is Hard?
            </span>
            <br />
            <span className="text-white">Think again.</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Find, analyze, and apply to the perfect colleges tailored to your unique journey.
            Don't take chances with your future education.
          </p>
        </div>
        
        {/* Card Display - Moved upward by adjusting margins */}
        <div className="relative w-full max-w-4xl mt-2 mb-8">
          <div className="flex justify-center items-center h-[420px]">
            <div className="relative w-full flex justify-center">
              {cards.map((card, idx) => {
                // Calculate position based on active card
                let xPosition = 0;
                let scale = 0.8;
                let zIndex = 0;
                let opacity = 0.3;
                
                if (idx === activeCardIndex) {
                  // Active card is centered
                  xPosition = 0;
                  scale = 1;
                  zIndex = 30;
                  opacity = 1;
                } else if ((activeCardIndex === 0 && idx === 2) || (idx === activeCardIndex - 1)) {
                  // Card to the left
                  xPosition = -250;
                  zIndex = 20;
                } else if ((activeCardIndex === 2 && idx === 0) || (idx === activeCardIndex + 1)) {
                  // Card to the right
                  xPosition = 250;
                  zIndex = 20;
                }
                
                return (
                  <motion.div
                    key={card.id}
                    className="absolute"
                    animate={{
                      x: xPosition,
                      scale: scale,
                      opacity: opacity,
                      zIndex: zIndex
                    }}
                    transition={{ 
                      duration: 0.5,
                      ease: "easeInOut"
                    }}
                    style={{ 
                      width: '380px',
                      height: '420px'
                    }}
                  >
                    <Card 
                      className={`h-full p-1 rounded-xl overflow-hidden ${
                        idx === activeCardIndex ? 'shadow-lg shadow-orange-500/20' : ''
                      }`} 
                      style={{ background: "#FF5722", border: "none" }}
                    >
                      <CardContent className="bg-black rounded-lg h-full p-6 flex flex-col">
                        <div className="flex items-center mb-4">
                          <Lock className="w-5 h-5 text-green-500 mr-2" />
                          <h3 className="text-green-500 font-medium">{card.title}</h3>
                        </div>
                        
                        {idx === 0 && (
                          <>
                            <Button className="w-full bg-red-500 hover:bg-red-600 text-white mb-6">
                              Find Your College
                            </Button>
                            <div className="space-y-4 mb-6">
                              {card.content.map((item, i) => (
                                <div key={i} className="flex items-center">
                                  {i === 0 ? (
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                  ) : (
                                    <div className="w-5 h-5 border border-gray-500 rounded-full mr-2" />
                                  )}
                                  <span className="text-gray-200">{item.text}</span>
                                </div>
                              ))}
                            </div>
                            <div className="mt-auto">
                              <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden mb-6">
                                <div className="h-full bg-gradient-to-r from-red-500 to-amber-500 w-3/4"></div>
                              </div>
                              <div className="bg-red-500 text-white p-3 rounded-lg mb-4 text-center">
                                {card.result}
                              </div>
                              <div className="flex justify-between">
                                {card.tags.map((tag, i) => (
                                  <div key={i} className="flex items-center text-xs text-green-500">
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    {tag}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                        
                        {idx === 1 && (
                          <div className="flex-1 flex flex-col justify-between">
                            <div className="grid grid-cols-2 gap-4">
                              {card.content.map((section, i) => (
                                <div key={i} className="mb-4">
                                  <h4 className="text-gray-300 mb-2">{section.category}</h4>
                                  <div className="space-y-2">
                                    {section.options.map((option, j) => (
                                      <div key={j} className={`p-2 rounded-md text-center ${j === 0 ? 'bg-gray-800 border border-green-500 text-white' : 'bg-gray-900 text-gray-400'}`}>
                                        {option}
                                        {j === 0 && <CheckCircle className="inline w-4 h-4 ml-2 text-green-500" />}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-between mt-6">
                              {card.tags.map((tag, i) => (
                                <div key={i} className="flex items-center text-xs text-green-500">
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  {tag}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {idx === 2 && (
                          <div className="flex-1 flex flex-col items-center justify-center">
                            <p className="text-center text-lg mb-8">{card.content}</p>
                            <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 text-white px-8 py-2 rounded-lg">
                              {card.buttonText}
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
          
          {/* Card indicator dots */}
          <div className="flex justify-center space-x-2">
            {cards.map((_, idx) => (
              <button
                key={idx}
                className={`w-3 h-3 rounded-full ${idx === activeCardIndex ? 'bg-white' : 'bg-gray-600'}`}
                onClick={() => setActiveCardIndex(idx)}
              />
            ))}
          </div>
        </div>
        
        {/* Try Now button - Clearly visible below cards */}
        <div className="text-center mb-14 mt-2">
          <div className="relative inline-block">
            <button 
              onClick={() => navigate('/login')} 
              className="try-now-button group"
            >
              Try now <ArrowUpRight size={18} className="ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              <div className="underline-effect"></div>
            </button>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="w-full mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Everything You Need for a <span className="text-pink-500">Perfect College Match</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-[#1A1F2C] to-[#141824] p-6 rounded-xl border border-gray-800 hover:border-pink-500/30 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-pink-500 rounded-lg mb-4 flex items-center justify-center">
                <School className="text-white h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">College Profiles</h3>
              <p className="text-gray-400">Detailed information on thousands of colleges including programs, tuition, campus life, and more.</p>
            </div>
            
            <div className="bg-gradient-to-br from-[#1A1F2C] to-[#141824] p-6 rounded-xl border border-gray-800 hover:border-pink-500/30 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-pink-500 rounded-lg mb-4 flex items-center justify-center">
                <BarChart className="text-white h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Admission Chances</h3>
              <p className="text-gray-400">Get a personalized assessment of your admission chances based on your profile and achievements.</p>
            </div>
            
            <div className="bg-gradient-to-br from-[#1A1F2C] to-[#141824] p-6 rounded-xl border border-gray-800 hover:border-pink-500/30 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-pink-500 rounded-lg mb-4 flex items-center justify-center">
                <FileText className="text-white h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Application Tracker</h3>
              <p className="text-gray-400">Stay organized with our application tracking system. Never miss a deadline again.</p>
            </div>
          </div>
        </div>
        
        {/* User Types Section */}
        <div className="w-full mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Who is UNIQUEST <span className="text-pink-500">for?</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-[#1A1F2C] to-[#141824] p-6 rounded-xl border border-gray-800 hover:border-pink-500/30 transition-all duration-300">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-pink-500 rounded-full flex items-center justify-center">
                  <GraduationCap className="text-white h-8 w-8" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Students</h3>
              <p className="text-gray-400 text-center">Find your dream college that aligns with your academic goals, interests, and budget.</p>
            </div>
            
            <div className="bg-gradient-to-br from-[#1A1F2C] to-[#141824] p-6 rounded-xl border border-gray-800 hover:border-pink-500/30 transition-all duration-300">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-pink-500 rounded-full flex items-center justify-center">
                  <Briefcase className="text-white h-8 w-8" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Counselors</h3>
              <p className="text-gray-400 text-center">Access powerful tools to help guide your students to colleges that match their unique profiles.</p>
            </div>
            
            <div className="bg-gradient-to-br from-[#1A1F2C] to-[#141824] p-6 rounded-xl border border-gray-800 hover:border-pink-500/30 transition-all duration-300">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-pink-500 rounded-full flex items-center justify-center">
                  <LineChart className="text-white h-8 w-8" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Parents</h3>
              <p className="text-gray-400 text-center">Get insights and data to help your child make informed decisions about their education future.</p>
            </div>
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="w-full mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            What Our <span className="text-pink-500">Users Say</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div 
                key={review.id}
                className="bg-gradient-to-br from-[#1A1F2C] to-[#141824] p-6 rounded-xl border border-gray-800 hover:border-pink-500/30 transition-all duration-300"
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-500'}`} 
                    />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{review.content}"</p>
                <div>
                  <p className="font-semibold">{review.name}</p>
                  <p className="text-gray-400 text-sm">{review.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="w-full mb-20 bg-gradient-to-r from-orange-500/10 to-pink-500/10 p-12 rounded-2xl border border-pink-500/20">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Find Your Perfect College Match?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Join thousands of students who have found their dream colleges with UNIQUEST.
            </p>
            <div className="relative inline-block">
              <button 
                onClick={() => navigate('/login')} 
                className="try-now-button group text-lg"
              >
                Try now <ArrowUpRight size={20} className="ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                <div className="underline-effect"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
