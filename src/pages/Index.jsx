
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import USAMap from '@/components/USAMap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogOut, User, Bot, X, Send, KeyRound, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFavorites } from '@/hooks/use-favorites';
import { useComparison } from '@/hooks/use-comparison';
import UniversitiesList from '@/components/state/UniversitiesList';
import axios from 'axios';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea } from "@/components/ui/textarea";
import { BOT_GEMINI } from '../constants';
import { Map, GraduationCap, Users, Globe2, BrainCircuit, Award, BarChart3, Compass, School, BookOpen, Lightbulb, Sparkles, Rocket } from 'lucide-react';
import SessionExpiredDialog from '@/components/SessionExpiredDialog';
import ComparisonBanner from '@/components/ComparisonBanner';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { favorites, handleFavoriteClick } = useFavorites();
  const { comparedUniversities, handleCompareClick, clearComparedUniversities } = useComparison();
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const token = sessionStorage.getItem("token");
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
    } else {
      const userStr = sessionStorage.getItem('user');
      if (userStr) {
        setUserData(JSON.parse(userStr));
      }
    }
  }, [navigate]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      navigate(`/college/${encodeURIComponent(searchQuery)}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search university",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;
    
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: currentMessage,
      sender: 'user'
    }]);
    
    setIsLoading(true);
    
    try {
      const response = await axios.get(`${BOT_GEMINI}?request=${currentMessage}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: response.data.data.response,
        sender: 'bot'
      }]);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.data?.status?.code === 401) {
        setIsSessionExpired(true);
      } else {
        toast({
          title: "Error",
          description: "Failed to get response from the bot",
          variant: "destructive",
        });
        
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: "Sorry, I'm having trouble responding right now. Please try again later.",
          sender: 'bot'
        }]);
      }
    } finally {
      setIsLoading(false);
      setCurrentMessage('');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    clearComparedUniversities();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/login', { replace: true });
  };

  const handleBotClick = () => {
    setIsChatOpen(!isChatOpen);
    console.log('Bot clicked, chat open:', !isChatOpen);
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-b from-background to-background/90"
      >
        {/* Header with glass effect */}
        <div className="sticky top-0 z-30 backdrop-blur-md bg-background/80 border-b border-primary/10 shadow-sm">
          <div className="max-w-[1800px] mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center">
                <motion.img 
                  src="/lovable-uploads/17d6db8d-3627-4ac9-90a6-5c27912246ed.png" 
                  alt="Uniquest Logo" 
                  className="w-16 h-16 md:w-20 md:h-20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
                <div className="ml-2">
                  <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    UniQuest
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Discover Your Academic Path
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                <motion.div 
                  className="flex gap-2 flex-1 md:flex-initial"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="relative flex-1 md:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search for a university..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pl-10 bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary/50 w-full"
                    />
                  </div>
                  <Button onClick={handleSearch} className="bg-primary hover:bg-primary/90 hidden md:flex">
                    Search
                  </Button>
                </motion.div>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full h-9 w-9 border-primary/20">
                      <User className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1 overflow-hidden">
                        <p className="font-medium truncate">{userData?.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{userData?.email}</p>
                        <p className="text-xs text-muted-foreground capitalize">Role: {userData?.role}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start mb-2"
                      onClick={() => navigate('/forgot-password')}
                    >
                      <KeyRound className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-[1800px] mx-auto px-4 py-6">
          <Tabs defaultValue="map" className="w-full">
            <TabsList className={`grid w-full max-w-[600px] mx-auto bg-background/50 backdrop-blur-sm border border-primary/20 ${userData?.role === 'admin' ? 'grid-cols-4' : 'grid-cols-3'}`}>
              <TabsTrigger value="map">Map View</TabsTrigger>
              <TabsTrigger value="favorites">Favorites ({favorites.length})</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              {userData?.role === 'admin' && (
                <TabsTrigger value="admin">Admin</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="map" className="min-h-[800px]">
              <motion.p 
                className="text-center text-muted-foreground mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Click on a state to explore its universities, or hover to see details
              </motion.p>
              <USAMap />
            </TabsContent>

            <TabsContent value="favorites">
              <UniversitiesList
                universities={favorites.map(name => ({ name }))}
                favorites={favorites}
                comparedUniversities={comparedUniversities}
                onFavoriteClick={handleFavoriteClick}
                onCompareClick={handleCompareClick}
                onUniversityClick={(college) => navigate(`/college/${encodeURIComponent(college.name)}`)}
              />
            </TabsContent>

            <TabsContent value="about">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto p-6 space-y-12"
              >
                <div className="relative rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-purple-700/90 z-0"></div>
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1470&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
                  <div className="relative z-10 px-8 py-16 text-center">
                    <motion.h1 
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-4xl md:text-5xl font-bold mb-4 text-white"
                    >
                      Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-purple-100">UniQuest</span>
                    </motion.h1>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-xl text-indigo-100 max-w-2xl mx-auto mb-8"
                    >
                      Your comprehensive platform for exploring and comparing universities across the United States
                    </motion.p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-gradient-to-br from-indigo-500/10 to-purple-600/5 p-8 rounded-xl backdrop-blur-sm border border-indigo-500/20 shadow-xl shadow-indigo-500/5"
                  >
                    <div className="bg-indigo-600/20 p-3 w-fit rounded-full mb-4">
                      <Rocket className="h-6 w-6 text-indigo-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-indigo-600 mb-4">Our Mission</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      UniQuest is dedicated to simplifying the university search process, empowering students to make informed decisions about their educational future. We believe in providing accurate, comprehensive information in an accessible and interactive format, making the complex journey of choosing a university both enjoyable and insightful.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-gradient-to-br from-purple-500/10 to-indigo-600/5 p-8 rounded-xl backdrop-blur-sm border border-purple-500/20 shadow-xl shadow-purple-500/5"
                  >
                    <div className="bg-purple-600/20 p-3 w-fit rounded-full mb-4">
                      <Lightbulb className="h-6 w-6 text-purple-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-purple-600 mb-4">Our Vision</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      We envision a future where every student has equal access to comprehensive university information, enabling them to find institutions that best match their academic goals, personal preferences, and career aspirations. UniQuest strives to be the leading platform that bridges the information gap between students and educational institutions.
                    </p>
                  </motion.div>
                </div>

                <div>
                  <motion.h2 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
                  >
                    Discover Our Features
                  </motion.h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      { 
                        icon: Map, 
                        title: "Interactive Map", 
                        description: "Explore universities state by state with our interactive US map interface.",
                        color: "indigo"
                      },
                      { 
                        icon: BookOpen, 
                        title: "Comprehensive Profiles", 
                        description: "Access detailed information about each university's programs, campus, and more.",
                        color: "purple"
                      },
                      { 
                        icon: BarChart3, 
                        title: "Side-by-Side Comparison", 
                        description: "Compare multiple universities to find your perfect academic match.",
                        color: "blue"
                      },
                      { 
                        icon: Sparkles, 
                        title: "Personalized Recommendations", 
                        description: "Receive tailored university suggestions based on your preferences.",
                        color: "violet"
                      },
                      { 
                        icon: BrainCircuit, 
                        title: "AI Assistant", 
                        description: "Get instant answers to your university questions with our intelligent chatbot.",
                        color: "pink"
                      },
                      { 
                        icon: Search, 
                        title: "Advanced Search", 
                        description: "Find specific universities with our powerful search functionality.",
                        color: "indigo"
                      }
                    ].map((feature, index) => (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className={`bg-gradient-to-br from-${feature.color}-500/10 to-${feature.color}-600/5 p-6 rounded-xl backdrop-blur-sm border border-${feature.color}-500/20 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] group`}
                      >
                        <div className={`bg-${feature.color}-500/20 p-3 w-fit rounded-full mb-4 group-hover:bg-${feature.color}-500/30 transition-colors`}>
                          <feature.icon className={`h-6 w-6 text-${feature.color}-500`} />
                        </div>
                        <h3 className={`text-xl font-semibold text-${feature.color}-600 mb-2`}>{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-indigo-500/5 to-purple-500/5 p-10 rounded-2xl border border-indigo-500/10 shadow-lg"
                >
                  <h2 className="text-3xl font-bold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    Why Choose UniQuest?
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { icon: Award, text: "Comprehensive university database covering all US states" },
                      { icon: BarChart3, text: "Real-time statistics and insights about each institution" },
                      { icon: Users, text: "Community-driven reviews and experiences from real students" },
                      { icon: Compass, text: "Personalized university recommendations based on your profile" },
                      { icon: GraduationCap, text: "Detailed information about programs, majors, and specializations" },
                      { icon: Globe2, text: "Regular updates about university rankings and achievements" }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex items-start gap-4 p-4 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/10 transition-colors"
                      >
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-2 rounded-full text-white">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <p className="text-muted-foreground font-medium">{item.text}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </TabsContent>

            {userData?.role === 'admin' && (
              <TabsContent value="admin">
                <div className="p-6 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
                  <h2 className="text-2xl font-bold text-primary mb-4">Admin Dashboard</h2>
                  <p className="text-muted-foreground">Welcome to the admin dashboard. Here you can manage universities and user data.</p>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Button
          className="rounded-full h-12 w-12 shadow-lg bg-primary hover:bg-primary/90"
          onClick={handleBotClick}
          type="button"
        >
          {isChatOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
        </Button>
      </motion.div>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 right-4 w-96 h-[600px] bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-primary/20 z-40 flex flex-col"
          >
            <div className="p-4 border-b border-primary/10">
              <h3 className="text-lg font-semibold text-primary">Chat with Bot</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted'
                    }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-lg">
                    <span className="animate-pulse">Thinking...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-primary/10">
              <div className="flex gap-2">
                <Textarea
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type your message..."
                  className="resize-none"
                  rows={2}
                />
                <Button
                  onClick={handleSendMessage}
                  size="icon"
                  className="h-auto"
                  disabled={!currentMessage.trim() || isLoading}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Press Enter to send, Shift + Enter for new line
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <ComparisonBanner 
        comparedUniversities={comparedUniversities} 
        onClear={clearComparedUniversities} 
      />
      
      <SessionExpiredDialog 
        open={isSessionExpired} 
        onOpenChange={setIsSessionExpired}
      />
    </>
  );
};

export default Index;
