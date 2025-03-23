
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { BOT_RESPONSE_TYPES } from '@/constants';
import { GraduationCap, Book, DollarSign, ClipboardList, Award, Home, Trophy, BookOpen, Users, Globe, Lightbulb, School, MessageCircle, Bot, CheckCircle } from 'lucide-react';

const ChatMessage = ({ message }) => {
  const isBot = message.sender === 'bot';
  
  // Helper function to safely format any value for display
  const formatValue = (value) => {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return value.map(item => formatValue(item)).join(', ');
      } else {
        // Convert object to string representation
        return JSON.stringify(value);
      }
    }
    
    return String(value);
  };
  
  // Helper function to render a list of items
  const renderList = (items, icon) => {
    if (!items || items.length === 0) return null;
    
    const IconComponent = icon || Book;
    
    return (
      <div className="space-y-2 mt-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <IconComponent className="h-4 w-4 text-uniquestPurple/70 flex-shrink-0" />
            <span>{formatValue(item)}</span>
          </div>
        ))}
      </div>
    );
  };

  // Function to render assistant info card
  const renderAssistantInfo = (data) => {
    if (!data.name && !data.role && !data.capabilities) return null;

    return (
      <div className="space-y-4 bg-gradient-to-br from-gray-100/30 to-uniquestPurple/5 p-4 rounded-lg">
        {data.name && (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-uniquestPurple/10">
              <Bot className="h-5 w-5 text-uniquestPurple" />
            </div>
            <h3 className="text-lg font-semibold">{data.name}</h3>
          </div>
        )}
        
        {data.role && (
          <p className="text-sm text-muted-foreground italic ml-12">{data.role}</p>
        )}
        
        {data.capabilities && data.capabilities.length > 0 && (
          <div className="ml-12 space-y-1 mt-3">
            <div className="text-sm font-medium mb-2">I can help you with:</div>
            {renderList(data.capabilities, CheckCircle)}
          </div>
        )}
      </div>
    );
  };
  
  // Function to render university items when universities is an array
  const renderUniversityItems = (universities) => {
    if (!Array.isArray(universities) || universities.length === 0) return null;
    
    return (
      <div className="space-y-6">
        {universities.map((university, index) => (
          <div key={index} className="p-4 border border-uniquestPurple/20 rounded-lg bg-gray-50/50 dark:bg-gray-900/50">
            <h3 className="text-lg font-semibold text-uniquestPurple mb-2">
              {university.name}
            </h3>
            <div className="space-y-3">
              {university.requirements && (
                <div className="space-y-1">
                  <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <ClipboardList className="h-4 w-4" />
                    Requirements
                  </h4>
                  <p className="text-sm">{university.requirements}</p>
                </div>
              )}
              
              {university.courses && (
                <div className="space-y-1">
                  <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <Book className="h-4 w-4" />
                    Courses
                  </h4>
                  <p className="text-sm">{university.courses}</p>
                </div>
              )}
              
              {university.fees && (
                <div className="space-y-1">
                  <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    Fees
                  </h4>
                  <p className="text-sm">{university.fees}</p>
                </div>
              )}
              
              {university.scholarships && (
                <div className="space-y-1">
                  <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    Scholarships
                  </h4>
                  <p className="text-sm">{university.scholarships}</p>
                </div>
              )}
              
              {university.living_costs && (
                <div className="space-y-1">
                  <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <Home className="h-4 w-4" />
                    Living Costs
                  </h4>
                  <p className="text-sm">{university.living_costs}</p>
                </div>
              )}
              
              {university.ielts_requirement && (
                <div className="space-y-1">
                  <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    IELTS Requirements
                  </h4>
                  <p className="text-sm">{university.ielts_requirement}</p>
                </div>
              )}
            </div>
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
    if ((data.name || data.role || data.capabilities) && 
        !data.universities && !data.courses && !data.fees && 
        !data.requirements && !data.scholarships && !data.living_costs) {
      return renderAssistantInfo(data);
    }
    
    // Handle universities array
    if (data.universities && Array.isArray(data.universities)) {
      return renderUniversityItems(data.universities);
    }
    
    return (
      <div className="space-y-4">
        {/* Universities Section */}
        {data.universities && (
          <div className="space-y-2">
            <h4 className="font-semibold text-uniquestPurple flex items-center gap-2">
              <School className="h-5 w-5" />
              {Array.isArray(data.universities) && data.universities.length > 1 ? 'Universities' : 'University'}
            </h4>
            {Array.isArray(data.universities) 
              ? renderList(data.universities, School)
              : <p>{formatValue(data.universities)}</p>
            }
          </div>
        )}
        
        {/* Courses Section */}
        {data.courses && (
          <div className="space-y-2">
            <h4 className="font-semibold text-uniquestPurple flex items-center gap-2">
              <Book className="h-5 w-5" />
              Programs & Schools
            </h4>
            {Array.isArray(data.courses) 
              ? renderList(data.courses, GraduationCap)
              : <p>{formatValue(data.courses)}</p>
            }
          </div>
        )}
        
        {/* Fees Section */}
        {data.fees && (
          <div className="space-y-2">
            <h4 className="font-semibold text-uniquestPurple flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Tuition & Fees
            </h4>
            <p>{formatValue(data.fees)}</p>
          </div>
        )}
        
        {/* Requirements Section */}
        {data.requirements && (
          <div className="space-y-2">
            <h4 className="font-semibold text-uniquestPurple flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Admission Requirements
            </h4>
            <p>{formatValue(data.requirements)}</p>
          </div>
        )}
        
        {/* Scholarships Section */}
        {data.scholarships && (
          <div className="space-y-2">
            <h4 className="font-semibold text-uniquestPurple flex items-center gap-2">
              <Award className="h-5 w-5" />
              Scholarships
            </h4>
            <p>{formatValue(data.scholarships)}</p>
          </div>
        )}
        
        {/* Living Costs Section */}
        {data.living_costs && (
          <div className="space-y-2">
            <h4 className="font-semibold text-uniquestPurple flex items-center gap-2">
              <Home className="h-5 w-5" />
              Living Costs
            </h4>
            <p>{formatValue(data.living_costs)}</p>
          </div>
        )}
        
        {/* Rankings Section */}
        {data.rankings && (
          <div className="space-y-2">
            <h4 className="font-semibold text-uniquestPurple flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Rankings
            </h4>
            <p>{formatValue(data.rankings)}</p>
          </div>
        )}
        
        {/* Admission Rate Section */}
        {data.admission_rate && (
          <div className="space-y-2">
            <h4 className="font-semibold text-uniquestPurple flex items-center gap-2">
              <Users className="h-5 w-5" />
              Admission Rate
            </h4>
            <p>{formatValue(data.admission_rate)}</p>
          </div>
        )}
        
        {/* Campus Life Section */}
        {data.campus_life && (
          <div className="space-y-2">
            <h4 className="font-semibold text-uniquestPurple flex items-center gap-2">
              <Users className="h-5 w-5" />
              Campus Life
            </h4>
            <p>{formatValue(data.campus_life)}</p>
          </div>
        )}
        
        {/* Notable Alumni Section */}
        {data.notable_alumni && (
          <div className="space-y-2">
            <h4 className="font-semibold text-uniquestPurple flex items-center gap-2">
              <Users className="h-5 w-5" />
              Notable Alumni
            </h4>
            {Array.isArray(data.notable_alumni)
              ? renderList(data.notable_alumni, Users)
              : <p>{formatValue(data.notable_alumni)}</p>
            }
          </div>
        )}
        
        {/* Research Section */}
        {data.research && (
          <div className="space-y-2">
            <h4 className="font-semibold text-uniquestPurple flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Research
            </h4>
            <p>{formatValue(data.research)}</p>
          </div>
        )}
        
        {/* Student Body Section */}
        {data.student_body && (
          <div className="space-y-2">
            <h4 className="font-semibold text-uniquestPurple flex items-center gap-2">
              <Users className="h-5 w-5" />
              Student Body
            </h4>
            <p>{formatValue(data.student_body)}</p>
          </div>
        )}
      </div>
    );
  };
  
  // For user messages
  if (!isBot) {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[80%] p-3 rounded-lg bg-black text-white">
          {message.text}
        </div>
      </div>
    );
  }
  
  // For bot messages with structured data
  if (isBot && message.rawData && message.rawData.response && typeof message.rawData.response === 'object') {
    return (
      <div className="flex justify-start mb-4">
        <Card className="max-w-[85%] bg-gradient-to-br from-gray-50 to-white dark:from-slate-950 dark:to-slate-900 shadow-md border-uniquestPurple/20 overflow-hidden">
          <CardContent className="p-4">
            {renderStructuredResponse(message.rawData.response)}
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // For simple text bot messages
  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[80%] p-3 rounded-lg bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200">
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
