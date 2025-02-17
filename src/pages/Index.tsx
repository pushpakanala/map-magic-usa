
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import USAMap from '@/components/USAMap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogOut, User, Search, Bot, X } from 'lucide-react';
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
  const [userData, setUserData] = useState<{ name: string; role: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const token = sessionStorage.getItem('token')

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
      const response = await axios.get(`${UNIVERSITIS_DATA_GPT}?university_name=${searchQuery}`,{
        headers: { Authorization: `Bearer ${token}` }
    });
      setSearchResults(response.data);
      toast({
        title: "Search Results",
        description: "University information found!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch university data",
        variant: "destructive",
      });
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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setMessages([...messages, { text: newMessage, sender: 'user' }]);
    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "Thanks for your message! Our support team will get back to you soon.", 
        sender: 'bot' 
      }]);
    }, 1000);
    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/17d6db8d-3627-4ac9-90a6-5c27912246ed.png" 
              alt="Uniquest Logo" 
              className="w-16 h-16"
            />
            <h1 className="text-2xl font-bold">UNIQUEST</h1>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 rounded-full"
              >
                <User className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Name</p>
                      <p className="text-sm text-muted-foreground">{userData?.name}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Role</p>
                      <p className="text-sm text-muted-foreground capitalize">{userData?.role}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handleLogout}
                      className="w-full gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </PopoverContent>
          </Popover>
        </div>

        <div className="mb-8">
          <div className="flex gap-4 max-w-xl mx-auto">
            <Input
              placeholder="Search for a university..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        <Tabs defaultValue="map" className="mb-8">
          <TabsList className="grid w-full grid-cols-4 max-w-[600px] mx-auto">
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="favorites">Favorites ({favorites.length})</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>
          
          <TabsContent value="map">
            {searchResults ? (
              <div className="mb-8">
                <Button 
                  variant="outline" 
                  onClick={() => setSearchResults(null)}
                  className="mb-4"
                >
                  ← Back to Map
                </Button>
                <Card>
                  <CardContent className="pt-6">
                    {/* Display university data similar to CollegePage */}
                    <h2 className="text-2xl font-bold mb-4">{searchResults.data.school.name}</h2>
                    <p>{searchResults.data.school.address}</p>
                    {/* Add more details as needed */}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <>
                <p className="text-center text-muted-foreground mb-12">
                  Click on a state to learn more about its Universities, or hover to see its population
                </p>
                <USAMap />
              </>
            )}
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
                <div className="text-center text-muted-foreground py-12">
                  <p>No favorite universities yet.</p>
                  <p>Click on a state and add universities to your favorites!</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="about">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">Welcome to Uniquest</h2>
                <p className="text-muted-foreground">
                  Discover your perfect university journey with Uniquest. 
                  We're here to help you explore universities across the United States.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">Admin Management</h2>
                <p className="text-muted-foreground">
                  Welcome to the admin dashboard. Management features coming soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Chatbot */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-20 right-4 w-80 bg-card rounded-lg shadow-xl border"
            >
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-semibold">Chat Support</h3>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsChatOpen(false)}
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
              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button type="submit">Send</Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          className="fixed bottom-4 right-4 rounded-full h-12 w-12 shadow-lg"
          onClick={() => setIsChatOpen(!isChatOpen)}
        >
          <Bot className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default Index;
