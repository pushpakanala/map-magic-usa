
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
  Send, Sparkles, Bot, X, Trash2, Cpu, Brain, BrainCircuit, 
  MessageSquare, Download, Copy, RotateCcw, RefreshCw
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { BOT_GEMINI } from '@/constants';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from '@/components/bot/ChatMessage';

const AdvancedChat = () => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() => `session-${Date.now()}`);
  const messagesEndRef = useRef(null);
  const token = sessionStorage.getItem("token");

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
        headers: { 
          Authorization: `Bearer ${token}`,
          'X-Session-ID': sessionId 
        }
      });
      
      let botResponse = "I received a response in an unexpected format. Please try again.";
      let rawData = null;
      
      if (response.data && response.data.data) {
        const responseData = response.data.data;
        
        if (typeof responseData.response === 'string') {
          botResponse = responseData.response;
        } else if (responseData.response && typeof responseData.response === 'object') {
          rawData = responseData;
          
          // Generate a summary of the structured data for the bot message
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
      console.error("API Error:", error);
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.",
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
        ? `About ${data.universities[0].name || "a university"}`
        : `About ${data.universities.length} universities`;
      summary.push(universitiesText);
    }
    
    if (data.message) {
      summary.push(data.message);
    }
    
    if (summary.length === 0) {
      return "I've found some information for you.";
    }
    
    return summary.join(". ");
  };

  const clearChat = () => {
    setMessages([]);
    setSessionId(`session-${Date.now()}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-300px)] min-h-[600px] w-full max-w-5xl mx-auto flex flex-col relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-xl">
      {/* Chat header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <BrainCircuit className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">UniQuest AI Assistant</h3>
            <p className="text-xs text-white/70">Session ID: {sessionId.substring(0, 12)}...</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={clearChat}
            className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-white dark:bg-gray-950">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <Card className="w-full max-w-2xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 border border a-gray-100 dark:border-gray-800 shadow-md">
              <CardContent className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"
                >
                  <Brain className="h-10 w-10 text-white" />
                </motion.div>
                
                <h3 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">UniQuest Advanced AI</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto">
                  Ask me anything about universities, programs, admission requirements, scholarships, campus life, or any educational information you need.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm max-w-xl mx-auto">
                  {[
                    "Tell me about Harvard University",
                    "What programs does MIT offer?",
                    "Compare Stanford and Berkeley",
                    "Scholarship options for international students",
                    "What are the admission requirements for UCLA?",
                    "Top universities for computer science"
                  ].map((suggestion, i) => (
                    <Button 
                      key={i}
                      variant="outline" 
                      className="justify-start overflow-hidden text-ellipsis whitespace-nowrap border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
                      onClick={() => {
                        setCurrentMessage(suggestion);
                      }}
                    >
                      <Sparkles className="h-3 w-3 mr-2 text-indigo-500" />
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${
                  message.sender === 'user' 
                    ? 'bg-indigo-500 text-white rounded-2xl rounded-tr-sm' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-sm'
                } px-4 py-3 shadow-sm`}>
                  <ChatMessage message={message} />
                </div>
              </div>
            ))}
          </>
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-indigo-500 rounded-full animate-pulse"></div>
                <div className="h-2 w-2 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="h-2 w-2 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="flex gap-2 items-end">
          <Textarea
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about universities, programs, admission requirements..."
            className="resize-none min-h-[60px] max-h-[180px] bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 focus-visible:ring-indigo-500 rounded-xl"
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-colors shadow-md"
            disabled={!currentMessage.trim() || isLoading}
          >
            <Send className="h-4 w-4 text-white" />
          </Button>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>Press Enter to send, Shift + Enter for new line</span>
          <span>Session: {sessionId.substring(0, 8)}</span>
        </div>
      </div>
    </div>
  );
};

export default AdvancedChat;
