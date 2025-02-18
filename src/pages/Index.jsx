import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import USAMap from '@/components/USAMap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogOut, User, Search, Bot, X, Send } from 'lucide-react';
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
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea } from "@/components/ui/textarea";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { favorites, handleFavoriteClick } = useFavorites();
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
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
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;
    
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: currentMessage,
      sender: 'user'
    }]);
    
    // Add bot response (you can replace this with actual bot logic)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Thanks for your message! This is a demo response.",
        sender: 'bot'
      }]);
    }, 1000);
    
    setCurrentMessage('');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 p-6"
    >
      <div className="flex justify-between items-center">
        <motion.img 
          src="/lovable-uploads/17d6db8d-3627-4ac9-90a6-5c27912246ed.png" 
          alt="Uniquest Logo" 
          className="w-32 h-32"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
        
        <div className="flex items-center gap-4">
          <motion.div 
            className="flex gap-2"
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
                className="w-80 pl-10 bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary/50"
              />
            </div>
            <Button onClick={handleSearch} className="bg-primary hover:bg-primary/90">
              Search
            </Button>
          </motion.div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
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
            className="text-center text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Click on a state to learn more about its Universities, or hover to see its population
          </motion.p>
          <div className="max-w-[1600px] mx-auto px-4">
            <USAMap />
          </div>
        </TabsContent>

        <TabsContent value="favorites">
          <UniversitiesList
            universities={favorites.map(name => ({ name }))}
            favorites={favorites}
            onFavoriteClick={handleFavoriteClick}
            onUniversityClick={(college) => navigate(`/college/${encodeURIComponent(college.name)}`)}
          />
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
          </div>

          <div className="p-4 border-t border-primary/10">
            <div className="flex gap-2">
              <Textarea
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className="resize-none"
                rows={2}
              />
              <Button
                onClick={handleSendMessage}
                size="icon"
                className="h-auto"
                disabled={!currentMessage.trim()}
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
    </motion.div>
  );
};

export default Index;
