
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { BOT_RESPONSE_TYPES } from '@/constants';
import { GraduationCap, Book, DollarSign, ClipboardList, Award, Home, Trophy, BookOpen, Users, Globe, Lightbulb, School, MessageCircle, Bot, CheckCircle, Sparkles, Zap } from 'lucide-react';

const ChatMessage = ({ message }) => {
  const isBot = message.sender === 'bot';
  
  // Helper function to render a list of items
  const renderList = (items, icon) => {
    if (!items || items.length === 0) return null;
    
    const IconComponent = icon || Book;
    
    return (
      <div className="space-y-2 mt-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <IconComponent className="h-4 w-4 text-uniquestPurple/70 flex-shrink-0" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    );
  };

  // Function to render assistant info card
  const renderAssistantInfo = (data) => {
    if (!data.name && !data.role && !data.capabilities) return null;

    return (
      <div className="space-y-4 bg-gradient-to-br from-gray-100/40 to-uniquestPurple/10 p-4 rounded-lg border border-uniquestPurple/20 shadow-md backdrop-blur-sm">
        {data.name && (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-br from-uniquestPurple to-uniquestPurple-dark text-white">
              <Bot className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{data.name}</h3>
          </div>
        )}
        
        {data.role && (
          <p className="text-sm text-muted-foreground italic ml-12">{data.role}</p>
        )}
        
        {data.capabilities && data.capabilities.length > 0 && (
          <div className="ml-12 space-y-1 mt-3">
            <div className="text-sm font-medium mb-2">I can help you with:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {data.capabilities.map((capability, index) => (
                <div key={index} className="flex items-center gap-2 bg-white/50 dark:bg-black/20 p-2 rounded-md backdrop-blur-sm border border-uniquestPurple/10">
                  <CheckCircle className="h-4 w-4 text-uniquestPurple flex-shrink-0" />
                  <span className="text-sm">{capability}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="absolute -bottom-2 -right-2 opacity-40">
          <Sparkles className="h-8 w-8 text-uniquestPurple animate-pulse" />
        </div>
      </div>
    );
  };
  
  const renderStructuredResponse = (data) => {
    if (!data) return null;
    
    // If the response contains just a message field, render it as a simple message
    if (data.message && Object.keys(data).length === 1) {
      return (
        <div className="space-y-2 relative overflow-hidden">
          <div className="flex items-start gap-2">
            <div className="p-1.5 rounded-full bg-uniquestPurple/20 mt-0.5">
              <MessageCircle className="h-4 w-4 text-uniquestPurple" />
            </div>
            <p className="text-gray-800 dark:text-gray-200">{data.message}</p>
          </div>
          <div className="absolute -bottom-4 -right-4 opacity-20">
            <Zap className="h-10 w-10 text-uniquestPurple" />
          </div>
        </div>
      );
    }

    // If the response contains assistant info (name, role, capabilities)
    if ((data.name || data.role || data.capabilities) && 
        !data.universities && !data.courses && !data.fees && 
        !data.requirements && !data.scholarships && !data.living_costs) {
      return renderAssistantInfo(data);
    }
    
    return (
      <div className="space-y-4 relative">
        {/* Universities Section */}
        {data.universities && (
          <div className="space-y-2 bg-gradient-to-r from-gray-100/30 to-gray-100/10 dark:from-gray-800/30 dark:to-gray-800/10 p-3 rounded-lg border-l-2 border-uniquestPurple">
            <h4 className="font-semibold text-uniquestPurple flex items-center gap-2">
              <School className="h-5 w-5" />
              {data.universities.length > 1 ? 'Universities' : 'University'}
            </h4>
            {renderList(data.universities, School)}
          </div>
        )}
        
        {/* Courses Section */}
        {data.courses && data.courses.length > 0 && (
          <div className="space-y-2 bg-gradient-to-r from-gray-100/30 to-gray-100/10 dark:from-gray-800/30 dark:to-gray-800/10 p-3 rounded-lg border-l-2 border-modernTeal">
            <h4 className="font-semibold text-modernTeal flex items-center gap-2">
              <Book className="h-5 w-5" />
              Programs & Schools
            </h4>
            {renderList(data.courses, GraduationCap)}
          </div>
        )}
        
        {/* Fees Section */}
        {data.fees && (
          <div className="space-y-2 bg-gradient-to-r from-gray-100/30 to-gray-100/10 dark:from-gray-800/30 dark:to-gray-800/10 p-3 rounded-lg border-l-2 border-modernIndigo">
            <h4 className="font-semibold text-modernIndigo flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Tuition & Fees
            </h4>
            <p>{data.fees}</p>
          </div>
        )}
        
        {/* Requirements Section */}
        {data.requirements && (
          <div className="space-y-2 bg-gradient-to-r from-gray-100/30 to-gray-100/10 dark:from-gray-800/30 dark:to-gray-800/10 p-3 rounded-lg border-l-2 border-modernRose">
            <h4 className="font-semibold text-modernRose flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Admission Requirements
            </h4>
            <p>{data.requirements}</p>
          </div>
        )}
        
        {/* Scholarships Section */}
        {data.scholarships && (
          <div className="space-y-2 bg-gradient-to-r from-gray-100/30 to-gray-100/10 dark:from-gray-800/30 dark:to-gray-800/10 p-3 rounded-lg border-l-2 border-modernAmber">
            <h4 className="font-semibold text-modernAmber flex items-center gap-2">
              <Award className="h-5 w-5" />
              Scholarships
            </h4>
            <p>{data.scholarships}</p>
          </div>
        )}
        
        {/* Living Costs Section */}
        {data.living_costs && (
          <div className="space-y-2 bg-gradient-to-r from-gray-100/30 to-gray-100/10 dark:from-gray-800/30 dark:to-gray-800/10 p-3 rounded-lg border-l-2 border-uniquestPurple">
            <h4 className="font-semibold text-uniquestPurple flex items-center gap-2">
              <Home className="h-5 w-5" />
              Living Costs
            </h4>
            <p>{data.living_costs}</p>
          </div>
        )}
        
        {/* Rankings Section */}
        {data.rankings && (
          <div className="space-y-2 bg-gradient-to-r from-gray-100/30 to-gray-100/10 dark:from-gray-800/30 dark:to-gray-800/10 p-3 rounded-lg border-l-2 border-modernTeal">
            <h4 className="font-semibold text-modernTeal flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Rankings
            </h4>
            <p>{data.rankings}</p>
          </div>
        )}
        
        {/* Admission Rate Section */}
        {data.admission_rate && (
          <div className="space-y-2 bg-gradient-to-r from-gray-100/30 to-gray-100/10 dark:from-gray-800/30 dark:to-gray-800/10 p-3 rounded-lg border-l-2 border-modernIndigo">
            <h4 className="font-semibold text-modernIndigo flex items-center gap-2">
              <Users className="h-5 w-5" />
              Admission Rate
            </h4>
            <p>{data.admission_rate}</p>
          </div>
        )}
        
        {/* Campus Life Section */}
        {data.campus_life && (
          <div className="space-y-2 bg-gradient-to-r from-gray-100/30 to-gray-100/10 dark:from-gray-800/30 dark:to-gray-800/10 p-3 rounded-lg border-l-2 border-modernRose">
            <h4 className="font-semibold text-modernRose flex items-center gap-2">
              <Users className="h-5 w-5" />
              Campus Life
            </h4>
            <p>{data.campus_life}</p>
          </div>
        )}
        
        {/* Notable Alumni Section */}
        {data.notable_alumni && (
          <div className="space-y-2 bg-gradient-to-r from-gray-100/30 to-gray-100/10 dark:from-gray-800/30 dark:to-gray-800/10 p-3 rounded-lg border-l-2 border-modernAmber">
            <h4 className="font-semibold text-modernAmber flex items-center gap-2">
              <Users className="h-5 w-5" />
              Notable Alumni
            </h4>
            {renderList(data.notable_alumni, Users)}
          </div>
        )}
        
        {/* Research Section */}
        {data.research && (
          <div className="space-y-2 bg-gradient-to-r from-gray-100/30 to-gray-100/10 dark:from-gray-800/30 dark:to-gray-800/10 p-3 rounded-lg border-l-2 border-uniquestPurple">
            <h4 className="font-semibold text-uniquestPurple flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Research
            </h4>
            <p>{data.research}</p>
          </div>
        )}
        
        {/* Student Body Section */}
        {data.student_body && (
          <div className="space-y-2 bg-gradient-to-r from-gray-100/30 to-gray-100/10 dark:from-gray-800/30 dark:to-gray-800/10 p-3 rounded-lg border-l-2 border-modernTeal">
            <h4 className="font-semibold text-modernTeal flex items-center gap-2">
              <Users className="h-5 w-5" />
              Student Body
            </h4>
            <p>{data.student_body}</p>
          </div>
        )}
      </div>
    );
  };
  
  // For user messages
  if (!isBot) {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[80%] p-3 rounded-lg bg-gradient-to-r from-black to-gray-800 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
          {message.text}
        </div>
      </div>
    );
  }
  
  // For bot messages with structured data
  if (isBot && message.rawData && message.rawData.response && typeof message.rawData.response === 'object') {
    return (
      <div className="flex justify-start mb-4">
        <Card className="max-w-[85%] bg-gradient-to-br from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 shadow-md hover:shadow-lg transition-all duration-300 border-uniquestPurple/20 overflow-hidden rounded-lg hover:-translate-y-0.5">
          <CardContent className="p-4 relative">
            {renderStructuredResponse(message.rawData.response)}
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // For simple text bot messages
  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[80%] p-3 rounded-lg bg-gradient-to-r from-gray-200 to-gray-100 dark:from-slate-700 dark:to-slate-800 text-gray-800 dark:text-gray-200 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 border border-gray-200/50 dark:border-slate-600/30">
        {message.text.split('\n').map((line, index) => {
          const boldRegex = /\*\*(.*?)\*\*/g;
          const formattedLine = line.replace(boldRegex, '<strong>$1</strong>');
          
          return (
            <div 
              key={index} 
              className="mb-1"
              dangerouslySetInnerHTML={{ __html: formattedLine }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ChatMessage;
