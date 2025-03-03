
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, ArrowUpRight, CheckCircle, Lock, FileText, Briefcase, School, BarChart, LineChart } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  
  // Cards data for swapping animation
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
      title: "College Application Tracker",
      content: "Track your application progress and deadlines",
      gradientClass: "from-purple-600 to-blue-500",
      buttonText: "Start Tracking"
    }
  ];

  // Card swapping effect every 3 seconds
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
          <Button 
            onClick={() => navigate('/pricing')}
            variant="ghost"
            className="text-gray-300 hover:text-white transition-colors"
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
        
        {/* Card Display - Updated to match the design in the image */}
        <div className="relative w-full max-w-md h-[400px] mb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCardIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Card className={`w-full h-full p-1 rounded-xl overflow-hidden`} style={{ background: "#FF5722" }}>
                <CardContent className="bg-black rounded-lg h-full p-6 flex flex-col">
                  <div className="flex items-center mb-4">
                    <Lock className="w-5 h-5 text-green-500 mr-2" />
                    <h3 className="text-green-500 font-medium">{cards[activeCardIndex].title}</h3>
                  </div>
                  
                  {activeCardIndex === 0 && (
                    <>
                      <Button className="w-full bg-red-500 hover:bg-red-600 text-white mb-6">
                        Find Your College
                      </Button>
                      <div className="space-y-4 mb-6">
                        {cards[0].content.map((item, idx) => (
                          <div key={idx} className="flex items-center">
                            {idx === 0 ? (
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
                          {cards[0].result}
                        </div>
                        <div className="flex justify-between">
                          {cards[0].tags.map((tag, idx) => (
                            <div key={idx} className="flex items-center text-xs text-green-500">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              {tag}
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  
                  {activeCardIndex === 1 && (
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="grid grid-cols-2 gap-4">
                        {cards[1].content.map((section, idx) => (
                          <div key={idx} className="mb-4">
                            <h4 className="text-gray-300 mb-2">{section.category}</h4>
                            <div className="space-y-2">
                              {section.options.map((option, optIdx) => (
                                <div key={optIdx} className={`p-2 rounded-md text-center ${optIdx === 0 ? 'bg-gray-800 border border-green-500 text-white' : 'bg-gray-900 text-gray-400'}`}>
                                  {option}
                                  {optIdx === 0 && <CheckCircle className="inline w-4 h-4 ml-2 text-green-500" />}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-6">
                        {cards[1].tags.map((tag, idx) => (
                          <div key={idx} className="flex items-center text-xs text-green-500">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            {tag}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {activeCardIndex === 2 && (
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <p className="text-center text-lg mb-8">{cards[2].content}</p>
                      <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 text-white px-8 py-2 rounded-lg">
                        {cards[2].buttonText}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
          
          {/* Card indicator dots */}
          <div className="flex justify-center space-x-2 mt-4 absolute bottom-[-30px] left-0 right-0">
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
