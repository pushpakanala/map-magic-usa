
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { BOT_RESPONSE_TYPES } from '@/constants';
import { GraduationCap, Book, DollarSign, ClipboardList, Award, Home, Trophy, BookOpen, Users, Globe, Lightbulb, School, MessageCircle } from 'lucide-react';

const ChatMessage = ({ message }) => {
  const isBot = message.sender === 'bot';
  
  // Helper function to safely format any value for display
  const formatValue = (value) => {
    if (value === null || value === undefined) {
      return '';
    }
    
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }
    
    if (Array.isArray(value)) {
      return value.map(item => formatValue(item)).join(', ');
    }
    
    if (typeof value === 'object') {
      // For objects, convert to a readable string
      try {
        if (value.name) {
          return String(value.name);
        }
        // Format object as JSON string
        return JSON.stringify(value, null, 2);
      } catch (e) {
        return '[Object]';
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
        {Array.isArray(items) && items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <IconComponent className="h-4 w-4 text-uniquestPurple/70 flex-shrink-0" />
            <span>{formatValue(item)}</span>
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
            <p className="text-gray-800 dark:text-gray-200">{formatValue(data.message)}</p>
          </div>
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
              {Array.isArray(data.universities) && data.universities.length > 1 ? 'Universities' : 'University'}
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
