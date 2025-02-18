
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
import { UNIVERSITIS_DATA_GPT } from '@/constants';
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
      // Sample API endpoint - replace with your actual chatbot API
      const response = await axios.post('https://api.example.com/chatbot', {
        message: newMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessages(prev => [...prev, { 
        text: response.data.reply || "Thanks for your message!", 
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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
      <div className="max-w-[1920px] mx-auto p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-8">
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-10 w-10 rounded-full hover:bg-primary/10"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <Card className="border-none bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-8 w-8 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-lg">{userData?.name}</p>
                            <p className="text-sm text-muted-foreground capitalize">{userData?.role}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" className="w-full gap-2 hover:bg-primary/10" onClick={() => toast({ title: "Settings", description: "Coming soon!" })}>
                            <Settings className="h-4 w-4" />
                            Settings
                          </Button>
                          <Button variant="outline" className="w-full gap-2 hover:bg-primary/10" onClick={() => toast({ title: "Notifications", description: "Coming soon!" })}>
                            <Bell className="h-4 w-4" />
                            Notifications
                          </Button>
                          <Button variant="outline" className="w-full gap-2 hover:bg-primary/10" onClick={() => toast({ title: "Help", description: "Coming soon!" })}>
                            <HelpCircle className="h-4 w-4" />
                            Help
                          </Button>
                          <Button variant="outline" className="w-full gap-2 hover:bg-primary/10" onClick={handleLogout}>
                            <LogOut className="h-4 w-4" />
                            Logout
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Tabs defaultValue="map" className="mb-8">
            <TabsList className="grid w-full grid-cols-3 max-w-[600px] mx-auto bg-background/50 backdrop-blur-sm border border-primary/20">
              <TabsTrigger value="map">Map View</TabsTrigger>
              <TabsTrigger value="favorites">Favorites ({favorites.length})</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
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
              <USAMap />
            </TabsContent>
            
            <TabsContent value="favorites">
              <div className="max-w-7xl mx-auto">
                {favorites.length > 0 ? (
                  <UniversitiesList
                    universities={favorites.map(name => ({ name }))}
                    favorites={favorites}
                    onFavoriteClick={handleFavoriteClick}
                    onUniversityClick={(college) => navigate(`/college/${encodeURIComponent(college.name)}`)}
                  />
                ) : (
                  <motion.div 
                    className="text-center text-muted-foreground py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p>No favorite universities yet.</p>
                    <p>Click on a state and add universities to your favorites!</p>
                  </motion.div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="about">
              <Card className="border-none bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Welcome to Uniquest</h2>
                  <p className="text-muted-foreground">
                    Discover your perfect university journey with Uniquest. 
                    We're here to help you explore universities across the United States.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <AnimatePresence>
            {isChatOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-20 right-4 w-80 bg-card/80 backdrop-blur-md rounded-lg shadow-xl border border-primary/20"
              >
                <div className="p-4 border-b border-primary/20 flex justify-between items-center bg-primary text-primary-foreground rounded-t-lg">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    Chat Support
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setIsChatOpen(false)}
                    className="hover:bg-primary/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="h-80 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          msg.sender === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendMessage} className="p-4 border-t border-primary/20">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 bg-background/50 backdrop-blur-sm border-primary/20"
                    />
                    <Button type="submit" className="bg-primary hover:bg-primary/90">Send</Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              className="fixed bottom-4 right-4 rounded-full h-12 w-12 shadow-lg bg-primary hover:bg-primary/90"
              onClick={() => setIsChatOpen(!isChatOpen)}
            >
              <Bot className="h-6 w-6" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
