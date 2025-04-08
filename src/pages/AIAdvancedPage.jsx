
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, ArrowLeft, Bot, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { BOT_GEMINI } from '../constants';

const AIAdvancedPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const token = sessionStorage.getItem("token");

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
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

        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50 min-h-[calc(100vh-12rem)]">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-3 mb-8">
              <BrainCircuit className="h-10 w-10 mx-auto text-indigo-600" />
              <h2 className="text-2xl font-bold">UniQuest Advanced AI Assistant</h2>
              <p className="text-muted-foreground">
                Ask me anything about universities, programs, admissions, scholarships, or student life. I'm here to provide detailed information to help with your educational journey.
              </p>
            </div>

            <div className="h-[calc(100vh-26rem)] overflow-y-auto p-4 rounded-lg bg-slate-100/50 dark:bg-slate-900/50 mb-4">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center p-6 max-w-md">
                    <Bot className="h-12 w-12 mx-auto mb-4 text-indigo-500 opacity-50" />
                    <p className="text-muted-foreground">
                      Start a conversation with the AI Assistant to get detailed information about universities and educational opportunities.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-indigo-500 text-white'
                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.text}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
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

            <div className="flex gap-2">
              <Textarea
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Ask about universities, programs, admissions, scholarships..."
                className="resize-none flex-1 p-3 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700"
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                className="bg-indigo-600 hover:bg-indigo-700"
                disabled={!currentMessage.trim() || isLoading}
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              Press Enter to send, Shift + Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAdvancedPage;
