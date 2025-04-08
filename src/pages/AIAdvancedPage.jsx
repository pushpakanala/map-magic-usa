import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, ArrowLeft, Bot, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { BOT_GEMINI } from '../constants';
import { ScrollArea } from '@/components/ui/scroll-area';
import { v4 as uuidv4 } from 'uuid';
import ChatMessage from '@/components/bot/ChatMessage';
import SessionExpiredDialog from '@/components/SessionExpiredDialog';
import { useSessionExpiry } from '@/hooks/use-session-expiry';

const AIAdvancedPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const token = sessionStorage.getItem("token");
  const { isSessionExpired, resetSessionExpiry } = useSessionExpiry();

  useEffect(() => {
    // Generate a session ID when the component mounts
    const newSessionId = sessionStorage.getItem("chatSessionId") || uuidv4();
    if (!sessionStorage.getItem("chatSessionId")) {
      sessionStorage.setItem("chatSessionId", newSessionId);
    }
    setSessionId(newSessionId);
    
    // Cleanup function to handle component unmounting
    return () => {
      // Any cleanup needed when navigating away
    };
  }, []);

  const handleBack = useCallback(() => {
    // Navigate back safely
    navigate(-1);
  }, [navigate]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;
    
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: currentMessage,
      sender: 'user'
    }]);
    
    setIsLoading(true);
    
    try {
      // Updated API call with user_message parameter instead of message
      const response = await axios.post(`${BOT_GEMINI}`, {
        user_message: currentMessage,
        session_id: sessionId
      }, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      let botResponse = "I received a response in an unexpected format. Please try again.";
      let rawData = null;
      
      // Handle the specific response format provided
      if (response.data && response.data.data) {
        const responseData = response.data.data;
        
        if (responseData.response && responseData.response.message) {
          botResponse = responseData.response.message;
          rawData = responseData;
        } else if (typeof responseData.response === 'string') {
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
      console.error("API error:", error);
      
      toast({
        title: "Error",
        description: "Failed to get response from the AI assistant",
        variant: "destructive",
      });
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble responding right now. Please try again later.",
        sender: 'bot'
      }]);
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
    
    // Only add fields that have actual data
    const fieldsToCheck = [
      { key: 'fees', label: 'fees' },
      { key: 'requirements', label: 'requirements' },
      { key: 'scholarships', label: 'scholarships' },
      { key: 'living_costs', label: 'living costs' },
      { key: 'rankings', label: 'rankings' },
      { key: 'admission_rate', label: 'admission rates' },
      { key: 'campus_life', label: 'campus life' },
      { key: 'notable_alumni', label: 'notable alumni' },
      { key: 'research', label: 'research' },
      { key: 'student_body', label: 'student body info' }
    ];
    
    fieldsToCheck.forEach(field => {
      if (data[field.key] && 
          (typeof data[field.key] !== 'string' || data[field.key].trim() !== '') &&
          (!Array.isArray(data[field.key]) || data[field.key].length > 0)) {
        availableInfo.push(field.label);
      }
    });
    
    if (availableInfo.length > 0) {
      summary.push(`Information available on: ${availableInfo.join(", ")}`);
    }
    
    return summary.join(". ");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex flex-col">
      <SessionExpiredDialog 
        open={isSessionExpired} 
        onOpenChange={resetSessionExpiry} 
      />
      <div className="container mx-auto px-4 py-4 flex-1 flex flex-col">
        <div className="mb-4 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBack}
            className="rounded-full hover:bg-black/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <BrainCircuit className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold">AI Advanced Search</h1>
          </div>
        </div>

        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 flex-1 flex flex-col">
          <div className="flex-1 p-4 sm:p-6 flex flex-col">
            <ScrollArea className="flex-1 bg-slate-100/50 dark:bg-slate-900/50 mb-4 rounded-lg min-h-[calc(100vh-200px)]">
              <div className="p-4">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center min-h-[calc(100vh-250px)]">
                    <div className="text-center p-6 max-w-lg">
                      <Bot className="h-16 w-16 mx-auto mb-4 text-indigo-500 opacity-50" />
                      <p className="text-lg text-muted-foreground">
                        Start a conversation with the AI Assistant to get detailed information about universities and educational opportunities.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {messages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="max-w-[85%] p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="flex gap-2">
              <Textarea
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Ask about universities, programs, admissions, scholarships..."
                className="resize-none flex-1 p-3 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700"
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                className="bg-indigo-600 hover:bg-indigo-700 self-end h-12 px-4"
                disabled={!currentMessage.trim() || isLoading}
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Press Enter to send, Shift + Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAdvancedPage;
