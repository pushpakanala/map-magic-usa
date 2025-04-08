
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
    <div className="flex flex-col h-[calc(100vh-300px)] min-h-[600px] relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
      {/* Chat header */}
      <div className="bg-gradient-to-r from-gray-900 to-black p-4 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
            <BrainCircuit className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Advanced AI Interface</h3>
            <p className="text-xs text-gray-400">Session ID: {sessionId.substring(0, 12)}...</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={clearChat}
            className="h-8 w-8 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-950 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <Card className="w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"
                >
                  <Brain className="h-8 w-8 text-white" />
                </motion.div>
                
                <h3 className="text-xl font-bold text-white mb-2">Advanced AI Assistant</h3>
                <p className="text-gray-400 mb-6">
                  Ask me anything about universities, programs, or education information.
                </p>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {[
                    "Tell me about Harvard University",
                    "What programs does MIT offer?",
                    "Compare Stanford and Berkeley",
                    "Scholarship options for international students"
                  ].map((suggestion, i) => (
                    <Button 
                      key={i}
                      variant="outline" 
                      className="border-gray-700 bg-gray-800/50 hover:bg-gray-700 text-gray-300 justify-start overflow-hidden text-ellipsis whitespace-nowrap"
                      onClick={() => {
                        setCurrentMessage(suggestion);
                      }}
                    >
                      <Sparkles className="h-3 w-3 mr-2 text-indigo-400" />
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
              <ChatMessage key={message.id} message={message} />
            ))}
          </>
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 bg-purple-500 rounded-full animate-pulse"></div>
                <div className="h-3 w-3 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="h-3 w-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                <span className="text-xs text-gray-400 ml-2">Processing your request...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat input */}
      <div className="p-4 bg-gray-900 border-t border-gray-700">
        <div className="flex gap-2">
          <Textarea
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask the AI assistant..."
            className="resize-none min-h-[60px] bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500 focus-visible:ring-indigo-500"
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="h-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-colors"
            disabled={!currentMessage.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift + Enter for new line • Session ID: {sessionId.substring(0, 8)}
        </p>
      </div>
    </div>
  );
};

export default AdvancedChat;
