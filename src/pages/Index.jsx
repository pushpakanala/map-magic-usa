
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import USAMap from '@/components/USAMap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogOut, User, Search, Bot, X, Settings, Bell, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFavorites } from '@/hooks/use-favorites';
import UniversitiesList from '@/components/state/UniversitiesList';
import axios from 'axios';
import { BOT_GEMINI } from '../constants';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from 'framer-motion';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { favorites, handleFavoriteClick } = useFavorites();
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const token = sessionStorage.getItem("token");

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
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('user');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/login', { replace: true });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setMessages(prev => [...prev, { text: newMessage, sender: 'user' }]);
    
    try {
      const response = await axios.get(`${BOT_GEMINI}?request=${newMessage}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessages(prev => [...prev, { 
        text: response.data.data.response || "Thanks for your message!", 
        sender: 'bot' 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: "I'm having trouble connecting right now. Please try again later.", 
        sender: 'bot' 
      }]);
    }
    
    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="max-w-[1920px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8 p-8"
        >
          {/* Header Section */}
          <div className="flex justify-between items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
            <motion.img 
              src="/lovable-uploads/17d6db8d-3627-4ac9-90a6-5c27912246ed.png" 
              alt="Uniquest Logo" 
              className="w-32 h-32"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
            
            <div className="flex items-center gap-6">
              <motion.div 
                className="flex gap-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for a university..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-96 pl-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 focus:border-primary/50 rounded-lg"
                  />
                </div>
                <Button 
                  onClick={handleSearch} 
                  className="bg-primary hover:bg-primary/90 text-white px-6 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
            <Tabs defaultValue="map" className="w-full">
              <TabsList className="grid w-full max-w-[600px] mx-auto bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg grid-cols-3 p-1 mb-8">
                <TabsTrigger value="map" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md">Map View</TabsTrigger>
                <TabsTrigger value="favorites" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md">Favorites ({favorites.length})</TabsTrigger>
                <TabsTrigger value="about" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md">About</TabsTrigger>
              </TabsList>
              
              <TabsContent value="map" className="min-h-[800px]">
                <motion.p 
                  className="text-center text-lg text-slate-600 dark:text-slate-300 mb-8 font-medium"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Click on a state to learn more about its Universities, or hover to see its population
                </motion.p>
                <div className="max-w-[1400px] mx-auto">
                  <USAMap />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Chat Button */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              className="fixed bottom-8 right-8 rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90 text-white transition-all duration-200 hover:shadow-xl"
              onClick={() => setIsChatOpen(!isChatOpen)}
            >
              {isChatOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
