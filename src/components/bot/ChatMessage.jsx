
import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { BOT_RESPONSE_TYPES } from '@/constants';
import { 
  GraduationCap, Book, DollarSign, ClipboardList, Award, Home, Trophy, 
  BookOpen, Users, Globe, Lightbulb, School, MessageCircle, Sparkles, 
  Info, Robot, CheckCircle, List
} from 'lucide-react';

const ChatMessage = ({ message, isLatest = false }) => {
  const isBot = message.sender === 'bot';
  const messageRef = useRef(null);
  
  useEffect(() => {
    if (isLatest && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [isLatest, message]);
  
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
  
  const renderStructuredResponse = (data) => {
    if (!data) return null;
    
    // If the response contains just a message field, render it as a simple message
    if (data.message && Object.keys(data).length === 1) {
      return (
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MessageCircle className="h-5 w-5 text-uniquestPurple mt-1 flex-shrink-0" />
            <p className="text-gray-800 dark:text-gray-200">{data.message}</p>
          </div>
        </div>
      );
    }
    
    // If the response contains assistant info (name, role, capabilities)
    if (data.name && data.role && data.capabilities) {
      return (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-uniquestPurple to-uniquestPurple-dark flex items-center justify-center text-white">
              <Robot className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-lg text-uniquestPurple">{data.name}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">{data.role}</p>
            </div>
          </div>
          
          {data.capabilities && data.capabilities.length > 0 && (
            <div className="bg-uniquestPurple/5 dark:bg-uniquestPurple/10 rounded-lg p-4 border border-uniquestPurple/20">
              <h5 className="text-sm font-medium text-uniquestPurple flex items-center mb-3 gap-2">
                <Sparkles className="h-4 w-4" />
                Capabilities
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {data.capabilities.map((capability, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-uniquestPurple/60 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{capability}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {/* Universities Section */}
        {data.universities && (
          <div className="space-y-2">
            <h4 className="font-semibold text-uniquestPurple flex items-center gap-2">
              <School className="h-5 w-5" />
              {data.universities.length > 1 ? 'Universities' : 'University'}
            </h4>
            {renderList(data.universities, School)}
          </div>
        )}
        
        {/* Courses Section */}
        {data.courses && data.courses.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-uniquestPurple flex items-center gap-2">
              <Book className="h-5 w-5" />
              Programs & Schools
            </h4>
            {renderList(data.courses, GraduationCap)}
          </div>
        )}
        
        {/* Fees Section */}
        {data.fees && (
          <div className="space-y-2">
            <h4 className="font-semibold text-uniquestPurple flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Tuition & Fees
            </h4>
            <p>{data.fees}</p>
          </div>
        )}
        
        {/* Requirements Section */}
        {data.requirements && (
          <div className="space-y-2">
            <h4 className="font-semibold text-uniquestPurple flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Admission Requirements
            </h4>
            <p>{data.requirements}</p>
          </div>
        )}
        
        {/* Scholarships Section */}
        {data.scholarships && (
          <div className="space-y-2">
            <h4 className="font-semibold text-uniquestPurple flex items-center gap-2">
              <Award className="h-5 w-5" />
              Scholarships
            </h4>
            <p>{data.scholarships}</p>
          </div>
        )}
        
        {/* Living Costs Section */}
        {data.living_costs && (
          <div className="space-y-2">
            <h4 className="font-semibold text-uniquestPurple flex items-center gap-2">
              <Home className="h-5 w-5" />
              Living Costs
            </h4>
            <p>{data.living_costs}</p>
          </div>
        )}
        
        {/* Rankings Section */}
        {data.rankings && (
          <div className="space-y-2">
            <h4 className="font-semibold text-uniquestPurple flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Rankings
            </h4>
            <p>{data.rankings}</p>
          </div>
        )}
        
        {/* Admission Rate Section */}
        {data.admission_rate && (
          <div className="space-y-2">
            <h4 className="font-semibold text-uniquestPurple flex items-center gap-2">
              <Users className="h-5 w-5" />
              Admission Rate
            </h4>
            <p>{data.admission_rate}</p>
          </div>
        )}
        
        {/* Campus Life Section */}
        {data.campus_life && (
          <div className="space-y-2">
            <h4 className="font-semibold text-uniquestPurple flex items-center gap-2">
              <Users className="h-5 w-5" />
              Campus Life
            </h4>
            <p>{data.campus_life}</p>
          </div>
        )}
        
        {/* Notable Alumni Section */}
        {data.notable_alumni && (
          <div className="space-y-2">
            <h4 className="font-semibold text-uniquestPurple flex items-center gap-2">
              <Users className="h-5 w-5" />
              Notable Alumni
            </h4>
            {renderList(data.notable_alumni, Users)}
          </div>
        )}
        
        {/* Research Section */}
        {data.research && (
          <div className="space-y-2">
            <h4 className="font-semibold text-uniquestPurple flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Research
            </h4>
            <p>{data.research}</p>
          </div>
        )}
        
        {/* Student Body Section */}
        {data.student_body && (
          <div className="space-y-2">
            <h4 className="font-semibold text-uniquestPurple flex items-center gap-2">
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
      <div ref={messageRef} className="flex justify-end mb-4">
        <div className="max-w-[80%] p-3 rounded-lg bg-gradient-to-br from-uniquestPurple to-uniquestPurple-dark text-white shadow-md">
          {message.text}
        </div>
      </div>
    );
  }
  
  // For bot messages with structured data
  if (isBot && message.rawData && message.rawData.response && typeof message.rawData.response === 'object') {
    return (
      <div ref={messageRef} className="flex justify-start mb-4 animate-fade-in">
        <Card className="max-w-[85%] bg-gradient-to-br from-gray-50 to-white dark:from-slate-950 dark:to-slate-900 shadow-md border-uniquestPurple/20 overflow-hidden hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            {renderStructuredResponse(message.rawData.response)}
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // For simple text bot messages
  return (
    <div ref={messageRef} className="flex justify-start mb-4 animate-fade-in">
      <div className="max-w-[80%] p-3 rounded-lg bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 shadow-sm">
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
