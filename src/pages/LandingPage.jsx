import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
      role: "Engineering Student",
      content: "As a student aiming for top engineering programs, UNIQUEST helped me discover universities that perfectly matched my academic interests and career goals. The interactive map made my college search enjoyable and less stressful.",
      rating: 5
    },
    {
      id: 2,
      name: "Durga Rao",
      role: "Parent",
      content: "Finding the right college for my daughter was overwhelming until we found UNIQUEST. The personalized recommendations and detailed university profiles gave us confidence in making this important decision for her future.",
      rating: 5
    },
    {
      id: 3,
      name: "Leela Krishna",
      role: "High School Counselor",
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
        <div className="flex space-x-8 items-center">
          <Button 
            onClick={() => navigate('/pricing')}
            variant="ghost"
            className="text-gray-300 hover:text-white hover:bg-purple-600/20 transition-colors"
          >
            Pricing
          </Button>
          <Button 
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-amber-400 to-pink-500 hover:opacity-90 transition-opacity text-white"
          >
            Get Started
          </Button>
        </div>
      </div>
      
      <div className="max-w-5xl w-full flex flex-col items-center mt-20">
        {/* Main headline with gradient */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-pink-500 to-purple-600">
              Think College Search is Hard?
            </span>
            <br />
            <span className="text-white">Think again.</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mt-6">
            Find, analyze, and apply to the perfect colleges tailored to your unique journey.
            Don't take chances with your future education.
          </p>
        </div>
        
        {/* Card Display - Updated layout with staggered cards */}
        <div className="relative w-full max-w-4xl mb-20">
          <div className="flex flex-col items-center h-[400px] relative">
            {/* Cards rendering with staggered positioning */}
            {cards.map((card, idx) => {
              // Determine the position for each card based on the active index
              const positionClass = 
                idx === activeCardIndex
                  ? "z-20 top-0 left-1/2 transform -translate-x-1/2" // Main card in the middle
                  : idx === (activeCardIndex + 1) % cards.length
                    ? "z-10 top-40 left-3/4 transform -translate-x-1/2 scale-85" // Card to the right bottom
                    : "z-10 top-40 left-1/4 transform -translate-x-1/2 scale-85"; // Card to the left bottom
              
              return (
                <motion.div
                  key={card.id}
                  className={`absolute transition-all duration-500 ${positionClass}`}
                  animate={{
                    scale: idx === activeCardIndex ? 1 : 0.85,
                    opacity: idx === activeCardIndex ? 1 : 0.5,
                    top: idx === activeCardIndex ? 0 : '10rem',
                    left: idx === activeCardIndex 
                      ? '50%' 
                      : idx === (activeCardIndex + 1) % cards.length
                        ? '75%'
                        : '25%',
                    zIndex: idx === activeCardIndex ? 20 : 10,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <Card 
                    className={`p-1 rounded-xl overflow-hidden w-[320px] shadow-lg ${
                      idx === activeCardIndex ? 'shadow-orange-500/30' : ''
                    }`} 
                    style={{ background: "#FF5722" }}
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
          
          {/* Card indicator dots */}
          <div className="flex justify-center space-x-2 mt-16">
            {cards.map((_, idx) => (
              <button
                key={idx}
                className={`w-3 h-3 rounded-full ${idx === activeCardIndex ? 'bg-white' : 'bg-gray-600'}`}
                onClick={() => setActiveCardIndex(idx)}
              />
            ))}
          </div>
        </div>
        
        <div className="text-center mb-20">
          <Button onClick={() => navigate('/login')} className="bg-gradient-to-r from-amber-400 to-pink-500 hover:opacity-90 transition-opacity text-white text-lg px-8 py-6">
            <span className="flex items-center gap-2">
              Try now <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </span>
          </Button>
        </div>
        
        {/* Features Section */}
        <div className="w-full mb-20">
          <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-pink-500 to-purple-600">
            UNIQUEST Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-pink-500/30 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-pink-500 rounded-lg mb-4 flex items-center justify-center">
                <GraduationCap className="text-white h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Interactive Map</h3>
              <p className="text-gray-400">Explore universities state by state with our interactive map visualization.</p>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-pink-500/30 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-pink-500 rounded-lg mb-4 flex items-center justify-center">
                <LineChart className="text-white h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Advisor</h3>
              <p className="text-gray-400">Get personalized college recommendations with our advanced AI chat assistant.</p>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-pink-500/30 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-pink-500 rounded-lg mb-4 flex items-center justify-center">
                <FileText className="text-white h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Favorite Schools</h3>
              <p className="text-gray-400">Save and compare your favorite universities to make informed decisions.</p>
            </div>
          </div>
        </div>
        
        {/* User Types Section */}
        <div className="w-full mb-20">
          <h2 className="text-4xl font-bold text-center mb-16">
            Perfect For Everyone
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-gray-900 border border-gray-800">
              <School className="w-10 h-10 text-amber-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Students & Parents</h3>
              <p className="text-gray-400">Find the perfect college match based on your interests, budget, and career goals.</p>
            </div>
            
            <div className="p-6 rounded-xl bg-gray-900 border border-gray-800">
              <Briefcase className="w-10 h-10 text-pink-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Counselors</h3>
              <p className="text-gray-400">Help your students discover universities that align with their academic strengths and aspirations.</p>
            </div>
            
            <div className="p-6 rounded-xl bg-gray-900 border border-gray-800">
              <BarChart className="w-10 h-10 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Institutions</h3>
              <p className="text-gray-400">Connect with potential students who are the right fit for your programs and campus culture.</p>
            </div>
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="w-full mb-20">
          <h2 className="text-4xl font-bold text-center mb-6">
            Students & Professionals rave about us, 
            <span className="text-gray-400"> and there's a good reason.</span>
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16">
            Find out why UNIQUEST is the smarter, safer way to find your perfect college match.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div key={review.id} className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-pink-500/30 transition-all duration-300">
                <div className="flex mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6">"{review.content}"</p>
                <div className="flex items-center mt-auto">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-pink-500 flex items-center justify-center text-white font-bold">
                    {review.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold">{review.name}</h4>
                    <p className="text-sm text-gray-400">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="w-full">
          <div className="bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 p-px rounded-xl">
            <div className="bg-gray-900 p-8 md:p-12 rounded-xl">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
                Start Your College Journey Today
              </h2>
              <p className="text-xl text-gray-300 text-center mb-8 max-w-2xl mx-auto">
                Don't leave your education to chance. Discover the perfect college match with UNIQUEST's powerful tools.
              </p>
              <div className="flex justify-center">
                <Button 
                  onClick={() => navigate('/login')} 
                  className="bg-gradient-to-r from-amber-400 to-pink-500 hover:opacity-90 transition-opacity text-white text-lg px-8 py-6"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
