import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { BOT_RESPONSE_TYPES } from '@/constants';
import { GraduationCap, Book, DollarSign, ClipboardList, Award, Home, Trophy, BookOpen, Users, Globe, Lightbulb, School, MessageCircle } from 'lucide-react';

const ChatMessage = ({ message }) => {
  const isBot = message.sender === 'bot';
  
  // Recursive helper function to check if a field has any valid values
  const hasValue = (value) => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string' && value.trim() === '') return false;
    if (Array.isArray(value) && value.length === 0) return false;
    
    // For objects, check if any property has a valid value
    if (typeof value === 'object' && !Array.isArray(value)) {
      return Object.values(value).some(prop => hasValue(prop));
    }
    
    return true;
  };
  
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
      // For objects, return as is - we'll handle them differently
      return value;
    }
    
    return String(value);
  };
  
  // Recursive function to render nested objects
  const renderNestedObject = (obj, level = 0) => {
    if (!obj || typeof obj !== 'object') return null;
    
    // Handle array of objects
    if (Array.isArray(obj)) {
      if (obj.length === 0) return null;
      
      return (
        <div className="space-y-2">
          {obj.map((item, index) => (
            <div key={index} className={`${level > 0 ? 'ml-4' : ''}`}>
              {typeof item === 'object' && item !== null ? 
                renderNestedObject(item, level + 1) : 
                <span>{formatValue(item)}</span>
              }
            </div>
          ))}
        </div>
      );
    }
    
    // For regular objects, show each property that has a value
    return (
      <div className="space-y-1">
        {Object.entries(obj).map(([key, value], idx) => {
          // Skip properties without values
          if (!hasValue(value)) return null;
          
          const formattedKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
          
          return (
            <div key={idx} className={`${level > 0 ? 'ml-4 mt-1' : ''}`}>
              {typeof value === 'object' && value !== null ? (
                <div className="mb-1">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{formattedKey}:</span>
                  <div className="ml-3 mt-1">
                    {Array.isArray(value) ? 
                      renderList(value) : 
                      renderNestedObject(value, level + 1)
                    }
                  </div>
                </div>
              ) : (
                <div className="mb-1">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{formattedKey}:</span>{' '}
                  <span className="text-gray-800 dark:text-gray-200">{formatValue(value)}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  
  // Helper function to render a list of items
  const renderList = (items, icon) => {
    if (!items || items.length === 0) return null;
    
    const IconComponent = icon || Book;
    
    return (
      <div className="space-y-2 mt-2">
        {Array.isArray(items) && items.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            <IconComponent className="h-4 w-4 text-uniquestPurple/70 flex-shrink-0 mt-1" />
            <div className="flex-1">
              {typeof item === 'object' && item !== null ? 
                renderNestedObject(item) : 
                <span>{formatValue(item)}</span>
              }
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const renderStructuredResponse = (data) => {
    if (!data) return null;
    
    // If the response contains just a message field, render it as a simple message
    if (data.message && Object.keys(data).filter(key => hasValue(data[key])).length === 1) {
      return (
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MessageCircle className="h-5 w-5 text-uniquestPurple mt-1 flex-shrink-0" />
            <p className="text-gray-800 dark:text-gray-200">{formatValue(data.message)}</p>
          </div>
        </div>
      );
    }
    
    // Dynamically display all fields in the response that have values
    const fieldsToRender = Object.keys(data).filter(key => hasValue(data[key]));
    
    // Define icons for known fields
    const fieldIcons = {
      universities: School,
      courses: GraduationCap,
      fees: DollarSign,
      requirements: ClipboardList,
      scholarships: Award,
      living_costs: Home,
      rankings: Trophy,
      admission_rate: Users,
      campus_life: Users,
      notable_alumni: Users,
      research: Lightbulb,
      student_body: Users,
      message: MessageCircle
    };
    
    // Define human-readable titles for fields
    const fieldTitles = {
      universities: data.universities && data.universities.length > 1 ? 'Universities' : 'University',
      courses: 'Programs & Schools',
      fees: 'Tuition & Fees',
      requirements: 'Admission Requirements',
      scholarships: 'Scholarships',
      living_costs: 'Living Costs',
      rankings: 'Rankings',
      admission_rate: 'Admission Rate',
      campus_life: 'Campus Life',
      notable_alumni: 'Notable Alumni',
      research: 'Research',
      student_body: 'Student Body',
      message: 'Message',
      tuition: 'Tuition',
      additional_costs: 'Additional Costs',
      financial_aid: 'Financial Aid'
    };
    
    return (
      <div className="space-y-4">
        {fieldsToRender.map(field => {
          const IconComponent = fieldIcons[field] || Book;
          const title = fieldTitles[field] || field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, ' ');
          
          return (
            <div key={field} className="space-y-2">
              <h4 className="font-semibold text-uniquestPurple flex items-center gap-2">
                <IconComponent className="h-5 w-5" />
                {title}
              </h4>
              
              {Array.isArray(data[field]) ? (
                data[field].length > 0 && data[field][0] && typeof data[field][0] === 'object' ? (
                  <div className="space-y-4 mt-2">
                    {data[field].map((item, index) => (
                      <div key={index} className="bg-white/50 dark:bg-slate-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                        <h5 className="font-medium mb-2">{item.name || `Item ${index + 1}`}</h5>
                        {Object.keys(item).filter(key => key !== 'name' && hasValue(item[key])).map(key => (
                          <div key={key} className="mb-2">
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}:
                            </span>
                            <div className="ml-4 mt-1">
                              {typeof item[key] === 'object' && item[key] !== null ? 
                                renderNestedObject(item[key]) : 
                                <span className="text-gray-800 dark:text-gray-200">{formatValue(item[key])}</span>
                              }
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  renderList(data[field], field === 'courses' ? GraduationCap : fieldIcons[field])
                )
              ) : typeof data[field] === 'object' ? (
                renderNestedObject(data[field])
              ) : (
                <p>{formatValue(data[field])}</p>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  
  // For user messages
  if (!isBot) {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[85%] md:max-w-[70%] p-3 rounded-lg bg-black text-white">
          {message.text}
        </div>
      </div>
    );
  }
  
  // For bot messages with structured data
  if (isBot && message.rawData && message.rawData.response && typeof message.rawData.response === 'object') {
    return (
      <div className="flex justify-start mb-4 w-full">
        <Card className="max-w-[95%] md:max-w-[85%] w-full bg-gradient-to-br from-gray-50 to-white dark:from-slate-950 dark:to-slate-900 shadow-md border-uniquestPurple/20 overflow-hidden">
          <CardContent className="p-4">
            {renderStructuredResponse(message.rawData.response)}
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // For simple text bot messages
  return (
    <div className="flex justify-start mb-4 w-full">
      <div className="max-w-[95%] md:max-w-[85%] p-3 rounded-lg bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200">
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
