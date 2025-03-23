
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

  // Helper function to safely format any value
  const formatValue = (value) => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  // Helper function to format nested object data
  const formatNestedObject = (obj) => {
    if (!obj || typeof obj !== 'object') return null;
    
    return (
      <div className="space-y-2 mt-2">
        {Object.entries(obj).map(([key, value], index) => (
          <div key={index} className="ml-2">
            <div className="font-medium capitalize">{key.replace(/_/g, ' ')}:</div>
            <div className="ml-4 text-gray-600 dark:text-gray-300">
              {typeof value === 'object' ? JSON.stringify(value) : formatValue(value)}
            </div>
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

  // Function to render a university item
  const renderUniversityItem = (university, index) => {
    return (
      <div key={index} className="mb-6 p-4 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800/70 dark:to-gray-900/70 rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-md hover:shadow-lg transition-all">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
          <School className="h-5 w-5 text-uniquestPurple" />
          {university.name}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {university.requirements && (
            <div className="p-3 rounded-md bg-gray-100/70 dark:bg-gray-800/70 border-l-2 border-modernRose">
              <h4 className="font-semibold text-modernRose flex items-center gap-2 text-sm">
                <ClipboardList className="h-4 w-4" />
                Requirements
              </h4>
              <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">{formatValue(university.requirements)}</p>
            </div>
          )}
          
          {university.courses && (
            <div className="p-3 rounded-md bg-gray-100/70 dark:bg-gray-800/70 border-l-2 border-modernTeal">
              <h4 className="font-semibold text-modernTeal flex items-center gap-2 text-sm">
                <GraduationCap className="h-4 w-4" />
                Courses
              </h4>
              <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">{formatValue(university.courses)}</p>
            </div>
          )}
          
          {university.fees && (
            <div className="p-3 rounded-md bg-gray-100/70 dark:bg-gray-800/70 border-l-2 border-modernIndigo">
              <h4 className="font-semibold text-modernIndigo flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4" />
                Fees
              </h4>
              <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">{formatValue(university.fees)}</p>
            </div>
          )}
          
          {university.scholarships && (
            <div className="p-3 rounded-md bg-gray-100/70 dark:bg-gray-800/70 border-l-2 border-modernAmber">
              <h4 className="font-semibold text-modernAmber flex items-center gap-2 text-sm">
                <Award className="h-4 w-4" />
                Scholarships
              </h4>
              <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">{formatValue(university.scholarships)}</p>
            </div>
          )}
          
          {university.living_costs && (
            <div className="p-3 rounded-md bg-gray-100/70 dark:bg-gray-800/70 border-l-2 border-uniquestPurple">
              <h4 className="font-semibold text-uniquestPurple flex items-center gap-2 text-sm">
                <Home className="h-4 w-4" />
                Living Costs
              </h4>
              <div className="text-sm mt-1 text-gray-700 dark:text-gray-300">
                {typeof university.living_costs === 'string' ? (
                  <p>{university.living_costs}</p>
                ) : (
                  formatValue(university.living_costs)
                )}
              </div>
            </div>
          )}
          
          {university.ielts_requirement && (
            <div className="p-3 rounded-md bg-gray-100/70 dark:bg-gray-800/70 border-l-2 border-modernTeal">
              <h4 className="font-semibold text-modernTeal flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4" />
                IELTS Requirement
              </h4>
              <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">{formatValue(university.ielts_requirement)}</p>
            </div>
          )}
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
            <p className="text-gray-800 dark:text-gray-200">{formatValue(data.message)}</p>
          </div>
          <div className="absolute -bottom-4 -right-4 opacity-20">
            <Zap className="h-10 w-10 text-uniquestPurple" />
          </div>
        </div>
      );
    }

    // If the response contains assistant info (name, role, capabilities)
    if ((data.name || data.role || data.capabilities) && 
        !data.universities && !data.courses) {
      return renderAssistantInfo(data);
    }
    
    // Handle array of universities
    if (data.universities && Array.isArray(data.universities)) {
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <School className="h-5 w-5 text-uniquestPurple" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {data.universities.length} {data.universities.length === 1 ? 'University' : 'Universities'} Found
            </h3>
          </div>
          {data.universities.map((university, index) => renderUniversityItem(university, index))}
        </div>
      );
    }
    
    // For single university or other structured data (not in an array)
    return (
      <div className="space-y-4 relative">
        {/* Universities Section */}
        {data.universities && !Array.isArray(data.universities) && (
          <div className="space-y-2 bg-gradient-to-r from-gray-100/30 to-gray-100/10 dark:from-gray-800/30 dark:to-gray-800/10 p-3 rounded-lg border-l-2 border-uniquestPurple">
            <h4 className="font-semibold text-uniquestPurple flex items-center gap-2">
              <School className="h-5 w-5" />
              {typeof data.universities === 'object' && 'length' in data.universities && data.universities.length > 1 
                ? 'Universities' : 'University'}
            </h4>
            {typeof data.universities === 'string' 
              ? <p>{data.universities}</p> 
              : Array.isArray(data.universities) 
                ? renderList(data.universities, School) 
                : formatValue(data.universities)}
          </div>
        )}
        
        {/* Courses Section */}
        {data.courses && (
          <div className="space-y-2 bg-gradient-to-r from-gray-100/30 to-gray-100/10 dark:from-gray-800/30 dark:to-gray-800/10 p-3 rounded-lg border-l-2 border-modernTeal">
            <h4 className="font-semibold text-modernTeal flex items-center gap-2">
              <Book className="h-5 w-5" />
              Programs & Schools
            </h4>
            {Array.isArray(data.courses) 
              ? renderList(data.courses, GraduationCap) 
              : <p>{formatValue(data.courses)}</p>}
          </div>
        )}
        
        {/* Fees Section */}
        {data.fees && (
          <div className="space-y-2 bg-gradient-to-r from-gray-100/30 to-gray-100/10 dark:from-gray-800/30 dark:to-gray-800/10 p-3 rounded-lg border-l-2 border-modernIndigo">
            <h4 className="font-semibold text-modernIndigo flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Tuition & Fees
            </h4>
            <p>{formatValue(data.fees)}</p>
          </div>
        )}
        
        {/* Requirements Section */}
        {data.requirements && (
          <div className="space-y-2 bg-gradient-to-r from-gray-100/30 to-gray-100/10 dark:from-gray-800/30 dark:to-gray-800/10 p-3 rounded-lg border-l-2 border-modernRose">
            <h4 className="font-semibold text-modernRose flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Admission Requirements
            </h4>
            <p>{formatValue(data.requirements)}</p>
          </div>
        )}
        
        {/* Scholarships Section */}
        {data.scholarships && (
          <div className="space-y-2 bg-gradient-to-r from-gray-100/30 to-gray-100/10 dark:from-gray-800/30 dark:to-gray-800/10 p-3 rounded-lg border-l-2 border-modernAmber">
            <h4 className="font-semibold text-modernAmber flex items-center gap-2">
              <Award className="h-5 w-5" />
              Scholarships
            </h4>
            <p>{formatValue(data.scholarships)}</p>
          </div>
        )}
        
        {/* Living Costs Section */}
        {data.living_costs && (
          <div className="space-y-2 bg-gradient-to-r from-gray-100/30 to-gray-100/10 dark:from-gray-800/30 dark:to-gray-800/10 p-3 rounded-lg border-l-2 border-uniquestPurple">
            <h4 className="font-semibold text-uniquestPurple flex items-center gap-2">
              <Home className="h-5 w-5" />
              Living Costs
            </h4>
            {typeof data.living_costs === 'string' ? (
              <p>{data.living_costs}</p>
            ) : (
              <p>{formatValue(data.living_costs)}</p>
            )}
          </div>
        )}
        
        {/* Rankings Section */}
        {data.rankings && (
          <div className="space-y-2 bg-gradient-to-r from-gray-100/30 to-gray-100/10 dark:from-gray-800/30 dark:to-gray-800/10 p-3 rounded-lg border-l-2 border-modernTeal">
            <h4 className="font-semibold text-modernTeal flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Rankings
            </h4>
            <p>{formatValue(data.rankings)}</p>
          </div>
        )}
        
        {/* Admission Rate Section */}
        {data.admission_rate && (
          <div className="space-y-2 bg-gradient-to-r from-gray-100/30 to-gray-100/10 dark:from-gray-800/30 dark:to-gray-800/10 p-3 rounded-lg border-l-2 border-modernIndigo">
            <h4 className="font-semibold text-modernIndigo flex items-center gap-2">
              <Users className="h-5 w-5" />
              Admission Rate
            </h4>
            <p>{formatValue(data.admission_rate)}</p>
          </div>
        )}
        
        {/* Campus Life Section */}
        {data.campus_life && (
          <div className="space-y-2 bg-gradient-to-r from-gray-100/30 to-gray-100/10 dark:from-gray-800/30 dark:to-gray-800/10 p-3 rounded-lg border-l-2 border-modernRose">
            <h4 className="font-semibold text-modernRose flex items-center gap-2">
              <Users className="h-5 w-5" />
              Campus Life
            </h4>
            <p>{formatValue(data.campus_life)}</p>
          </div>
        )}
        
        {/* Notable Alumni Section */}
        {data.notable_alumni && (
          <div className="space-y-2 bg-gradient-to-r from-gray-100/30 to-gray-100/10 dark:from-gray-800/30 dark:to-gray-800/10 p-3 rounded-lg border-l-2 border-modernAmber">
            <h4 className="font-semibold text-modernAmber flex items-center gap-2">
              <Users className="h-5 w-5" />
              Notable Alumni
            </h4>
            {Array.isArray(data.notable_alumni) 
              ? renderList(data.notable_alumni, Users) 
              : <p>{formatValue(data.notable_alumni)}</p>}
          </div>
        )}
        
        {/* Research Section */}
        {data.research && (
          <div className="space-y-2 bg-gradient-to-r from-gray-100/30 to-gray-100/10 dark:from-gray-800/30 dark:to-gray-800/10 p-3 rounded-lg border-l-2 border-uniquestPurple">
            <h4 className="font-semibold text-uniquestPurple flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Research
            </h4>
            <p>{formatValue(data.research)}</p>
          </div>
        )}
        
        {/* Student Body Section */}
        {data.student_body && (
          <div className="space-y-2 bg-gradient-to-r from-gray-100/30 to-gray-100/10 dark:from-gray-800/30 dark:to-gray-800/10 p-3 rounded-lg border-l-2 border-modernTeal">
            <h4 className="font-semibold text-modernTeal flex items-center gap-2">
              <Users className="h-5 w-5" />
              Student Body
            </h4>
            <p>{formatValue(data.student_body)}</p>
          </div>
        )}
        
        {/* IELTS Requirement Section */}
        {data.ielts_requirement && (
          <div className="space-y-2 bg-gradient-to-r from-gray-100/30 to-gray-100/10 dark:from-gray-800/30 dark:to-gray-800/10 p-3 rounded-lg border-l-2 border-modernTeal">
            <h4 className="font-semibold text-modernTeal flex items-center gap-2">
              <Globe className="h-5 w-5" />
              IELTS Requirement
            </h4>
            <p>{formatValue(data.ielts_requirement)}</p>
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
