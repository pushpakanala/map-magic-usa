import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import USAMap from '@/components/USAMap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogOut, User, Bot, X, Send, KeyRound, Info, MapPin, Heart, BarChart3, Shield, Sparkles } from 'lucide-react';
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
import { Card, CardContent } from "@/components/ui/card";
import { Map, Search, GraduationCap, Users, Globe2, BrainCircuit, Award, Compass, School, BookOpen, Lightbulb, Rocket } from 'lucide-react';
import SessionExpiredDialog from '@/components/SessionExpiredDialog';
import ComparisonBanner from '@/components/ComparisonBanner';
import { useIsMobile } from '@/hooks/use-mobile';
import ChatMessage from '@/components/bot/ChatMessage';
import AdvancedChat from '@/components/advanced-ai/AdvancedChat';

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
      
      let botResponse = "I received a response in an unexpected format. Please try again.";
      let rawData = null;
      
      if (response.data && response.data.data) {
        const responseData = response.data.data;
        
        if (typeof responseData.response === 'string') {
          botResponse = responseData.response;
        } else if (responseData.response && typeof responseData.response === 'object') {
          rawData = responseData;
          
          botResponse = generateTextSummary(responseData.response);
        } else {
          botResponse = JSON.stringify(responseData, null, 2);
        }
      }
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        rawData: rawData || response.data.data
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

  const generateTextSummary = (data) => {
    if (!data) return "No information available.";
    
    let summary = [];
    
    if (data.universities && data.universities.length > 0) {
      const universitiesText = data.universities.length === 1 
        ? `About ${data.universities[0]}`
        : `About ${data.universities.length} universities`;
      summary.push(universitiesText);
    }
    
    if (data.courses && data.courses.length > 0) {
      summary.push(`${data.courses.length} programs/schools available`);
    }
    
    const availableInfo = [];
    if (data.fees) availableInfo.push("fees");
    if (data.requirements) availableInfo.push("requirements");
    if (data.scholarships) availableInfo.push("scholarships");
    if (data.living_costs) availableInfo.push("living costs");
    if (data.rankings) availableInfo.push("rankings");
    if (data.admission_rate) availableInfo.push("admission rates");
    if (data.campus_life) availableInfo.push("campus life");
    if (data.notable_alumni) availableInfo.push("notable alumni");
    if (data.research) availableInfo.push("research");
    if (data.student_body) availableInfo.push("student body info");
    
    if (availableInfo.length > 0) {
      summary.push(`Information available on: ${availableInfo.join(", ")}`);
    }
    
    return summary.join(". ");
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
  };

  return (
    <>
      <div className="relative min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-700/20 bg-[linear-gradient(to_right,transparent_0%,transparent_49.5%,#e2e8f0_49.5%,#e2e8f0_50.5%,transparent_50.5%,transparent_100%),linear-gradient(to_bottom,transparent_0%,transparent_49.5%,#e2e8f0_49.5%,#e2e8f0_50.5%,transparent_50.5%,transparent_100%)] dark:bg-[linear-gradient(to_right,transparent_0%,transparent_49.5%,#1e293b_49.5%,#1e293b_50.5%,transparent_50.5%,transparent_100%),linear-gradient(to_bottom,transparent_0%,transparent_49.5%,#1e293b_49.5%,#1e293b_50.5%,transparent_50.5%,transparent_100%)] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] [background-size:4%_4%] -z-10" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-6 space-y-8"
        >
          <header className="flex flex-col md:flex-row justify-between items-center gap-6 py-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <motion.img 
                  src="/lovable-uploads/17d6db8d-3627-4ac9-90a6-5c27912246ed.png" 
                  alt="Uniquest Logo" 
                  className="w-16 h-16 md:w-20 md:h-20 rounded-xl shadow-md"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                />
                <div className="absolute -bottom-2 -right-2 bg-black text-white text-xs font-bold px-2 py-1 rounded-full">EDU</div>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-700">
                  UniQuest
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Discover Your Academic Future</p>
              </div>
            </motion.div>
            
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
              <motion.div 
                className="flex gap-2 w-full md:w-auto"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for a university..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full md:w-80 pl-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 focus-visible:ring-black"
                  />
                </div>
                <Button onClick={handleSearch} className="bg-black hover:bg-gray-800 text-white">
                  Search
                </Button>
              </motion.div>

              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="rounded-full bg-white dark:bg-slate-800 hover:bg-black/10 transition-colors"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="rounded-full bg-black/10 p-2">
                        <User className="h-6 w-6 text-black" />
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
                    {userData?.role === 'admin' && (
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start mb-2"
                        onClick={() => navigate('/admin')}
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Management
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </header>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50"
          >
            <Tabs defaultValue="map" className="w-full">
              <TabsList className={`grid w-full max-w-[700px] mx-auto mb-6 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 ${userData?.role === 'admin' ? 'grid-cols-4' : 'grid-cols-3'}`}>
                <TabsTrigger value="map" className="flex items-center gap-2 data-[state=active]:bg-black data-[state=active]:text-white">
                  <MapPin className="h-4 w-4" />
                  <span className="hidden sm:inline">Map View</span>
                </TabsTrigger>
                <TabsTrigger value="favorites" className="flex items-center gap-2 data-[state=active]:bg-black data-[state=active]:text-white">
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">Favorites</span> <span className="text-xs">({favorites.length})</span>
                </TabsTrigger>
                <TabsTrigger value="about" className="flex items-center gap-2 data-[state=active]:bg-black data-[state=active]:text-white">
                  <Info className="h-4 w-4" />
                  <span className="hidden sm:inline">About</span>
                </TabsTrigger>
                {userData?.role === 'admin' && (
                  <TabsTrigger value="admin" className="flex items-center gap-2 data-[state=active]:bg-black data-[state=active]:text-white">
                    <Shield className="h-4 w-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="map" className="focus-visible:outline-none focus-visible:ring-0">
                <motion.p 
                  className="text-center text-muted-foreground mb-6 italic"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Click on a state to explore universities, or hover to view population data
                </motion.p>
                <div className="w-full mx-auto">
                  <USAMap />
                </div>
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="group"
                  >
                    <Card className="relative h-full overflow-hidden border-none bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 hover:shadow-xl transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/10 dark:from-white/5 dark:to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <CardContent className="p-6 flex flex-col space-y-3">
                        <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mb-2">
                          <GraduationCap className="h-6 w-6 text-black" />
                        </div>
                        <h3 className="text-xl font-bold">4,000+ Universities</h3>
                        <p className="text-muted-foreground">Explore thousands of universities across the United States, each with detailed information about programs, campus life, and more.</p>
                        <div className="absolute bottom-0 right-0 w-24 h-24 -m-12 bg-black/5 dark:bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-150"></div>
                      </CardContent>
                    </Card>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="group"
                  >
                    <Card className="relative h-full overflow-hidden border-none bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 hover:shadow-xl transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/10 dark:from-white/5 dark:to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <CardContent className="p-6 flex flex-col space-y-3">
                        <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mb-2">
                          <Map className="h-6 w-6 text-black" />
                        </div>
                        <h3 className="text-xl font-bold">Nationwide Coverage</h3>
                        <p className="text-muted-foreground">Access educational institutions from all 50 states with our interactive map interface, allowing you to discover schools by location.</p>
                        <div className="absolute bottom-0 right-0 w-24 h-24 -m-12 bg-black/5 dark:bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-150"></div>
                      </CardContent>
                    </Card>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="group"
                  >
                    <Card className="relative h-full overflow-hidden border-none bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/40 dark:to-indigo-800/40 hover:shadow-xl transition-all duration-300" onClick={() => navigate('/ai-advanced')}>
                      <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/10 dark:from-white/5 dark:to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <CardContent className="p-6 flex flex-col space-y-3 cursor-pointer">
                        <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mb-2">
                          <BrainCircuit className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold">AI Advanced Assistant</h3>
                        <p className="text-muted-foreground">Explore our powerful AI assistant for in-depth information about universities, programs, and educational options.</p>
                        <div className="absolute bottom-0 right-0 w-24 h-24 -m-12 bg-indigo-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-150"></div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>

              <TabsContent value="favorites" className="focus-visible:outline-none focus-visible:ring-0">
                <UniversitiesList
                  universities={favorites.map(name => ({ name }))}
                  favorites={favorites}
                  comparedUniversities={comparedUniversities}
                  onFavoriteClick={handleFavoriteClick}
                  onCompareClick={handleCompareClick}
                  onUniversityClick={(college) => navigate(`/college/${encodeURIComponent(college.name)}`)}
                />
              </TabsContent>

              <TabsContent value="about" className="focus-visible:outline-none focus-visible:ring-0">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-6xl mx-auto space-y-12"
                >
                  <div className="relative rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-gray-800/90 z-0"></div>
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1470&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
                    <div className="relative z-10 px-6 md:px-8 py-12 md:py-16 text-center">
                      <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl md:text-5xl font-bold mb-4 text-white"
                      >
                        Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-white">UniQuest</span>
                      </motion.h1>
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto mb-8"
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
                      className="bg-gradient-to-br from-gray-200/10 to-uniquestPurple/5 p-8 rounded-xl backdrop-blur-sm border border-uniquestPurple/20 shadow-xl shadow-uniquestPurple/5"
                    >
                      <div className="bg-uniquestPurple/20 p-3 w-fit rounded-full mb-4">
                        <Rocket className="h-6 w-6 text-uniquestPurple" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
                      <p className="text-muted-foreground leading-relaxed">
                        UniQuest is dedicated to simplifying the university search process, empowering students to make informed decisions about their educational future. We believe in providing accurate, comprehensive information in an accessible and interactive format, making the complex journey of choosing a university both enjoyable and insightful.
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="bg-gradient-to-br from-gray-300/10 to-uniquestPurple/5 p-8 rounded-xl backdrop-blur-sm border border-uniquestPurple/20 shadow-xl shadow-uniquestPurple/5"
                    >
                      <div className="bg-uniquestPurple/20 p-3 w-fit rounded-full mb-4">
                        <Lightbulb className="h-6 w-6 text-uniquestPurple" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h2>
                      <p className="text-muted-foreground leading-relaxed">
                        We envision a future where every student has equal access to comprehensive university information, enabling them to find institutions that best match their academic goals, personal preferences, and career aspirations. UniQuest strives to be the leading platform that bridges the information gap between students and educational institutions.
                      </p>
                    </motion.div>
                  </div>

                  <div>
                    <motion.h2 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-uniquestPurple to-uniquestPurple-dark"
                    >
                      Discover Our Features
                    </motion.h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {[
                        { 
                          icon: Map, 
                          title: "Interactive Map", 
                          description: "Explore universities state by state with our interactive US map interface.",
                          color: "bg-uniquestPurple/10 text-uniquestPurple border-uniquestPurple/20"
                        },
                        { 
                          icon: BookOpen, 
                          title: "Comprehensive Profiles", 
                          description: "Access detailed information about each university's programs, campus, and more.",
                          color: "bg-uniquestPurple/10 text-uniquestPurple border-uniquestPurple/20"
                        },
                        { 
                          icon: BarChart3, 
                          title: "Side-by-Side Comparison", 
                          description: "Compare multiple universities to find your perfect academic match.",
                          color: "bg-uniquestPurple/10 text-uniquestPurple border-uniquestPurple/20"
                        },
                        { 
                          icon: Sparkles, 
                          title: "Personalized Recommendations", 
                          description: "Receive tailored university suggestions based on your preferences.",
                          color: "bg-uniquestPurple/10 text-uniquestPurple border-uniquestPurple/20"
                        },
                        { 
                          icon: BrainCircuit, 
                          title: "AI Assistant", 
                          description: "Get instant answers to your university questions with our intelligent chatbot.",
                          color: "bg-uniquestPurple/10 text-uniquestPurple border-uniquestPurple/20"
                        },
                        { 
                          icon: Search, 
                          title: "Advanced Search", 
                          description: "Find specific universities with our powerful search functionality.",
                          color: "bg-uniquestPurple/10 text-uniquestPurple border-uniquestPurple/20"
                        }
                      ].map((feature, index) => (
                        <motion.div
                          key={feature.title}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className={`p-6 rounded-xl backdrop-blur-sm border shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] group ${feature.color}`}
                        >
                          <div className="p-3 w-fit rounded-full mb-4 bg-white/20 dark:bg-slate-800/20">
                            <feature.icon className="h-6 w-6" />
                          </div>
                          <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                          <p className="text-muted-foreground">{feature.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-gray-500/5 to-uniquestPurple/5 p-10 rounded-2xl border border-uniquestPurple/10 shadow-lg"
                  >
                    <h2 className="text-3xl font-bold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-uniquestPurple to-uniquestPurple-dark">
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
                          className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/10 transition-colors"
                        >
                          <div className="bg-gradient-to-br from-uniquestPurple to-uniquestPurple-dark p-2 rounded-full text-white">
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
                <TabsContent value="admin" className="focus-visible:outline-none focus-visible:ring-0">
                  <div className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                    <h2 className="text-2xl font-bold text-primary mb-4">Admin Dashboard</h2>
                    <p className="text-muted-foreground">Welcome to the admin dashboard. Here you can manage universities and user data.</p>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <Button
            className={`rounded-full h-14 w-14 shadow-lg transition-all duration-300 ${
              isChatOpen 
                ? "bg-red-500 hover:bg-red-600" 
                : "bg-gradient-to-br from-gray-800 to-black hover:shadow-xl"
            }`}
