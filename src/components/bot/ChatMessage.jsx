
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
  
  // Function to check if a field has a valid value to display
  const hasValue = (value) => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string' && value.trim() === '') return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
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
    
    // Define the sections and their corresponding icons
    const sections = [
      { key: 'universities', title: data.universities && data.universities.length > 1 ? 'Universities' : 'University', icon: School },
      { key: 'courses', title: 'Programs & Schools', icon: GraduationCap },
      { key: 'fees', title: 'Tuition & Fees', icon: DollarSign },
      { key: 'requirements', title: 'Admission Requirements', icon: ClipboardList },
      { key: 'scholarships', title: 'Scholarships', icon: Award },
      { key: 'living_costs', title: 'Living Costs', icon: Home },
      { key: 'rankings', title: 'Rankings', icon: Trophy },
      { key: 'admission_rate', title: 'Admission Rate', icon: Users },
      { key: 'campus_life', title: 'Campus Life', icon: Users },
      { key: 'notable_alumni', title: 'Notable Alumni', icon: Users },
      { key: 'research', title: 'Research', icon: Lightbulb },
      { key: 'student_body', title: 'Student Body', icon: Users }
    ];
    
    return (
      <div className="space-y-4">
        {sections.map(section => {
          // Only render sections that have valid values
          if (!hasValue(data[section.key])) return null;
          
          const IconComponent = section.icon;
          
          return (
            <div key={section.key} className="space-y-2">
              <h4 className="font-semibold text-uniquestPurple flex items-center gap-2">
                <IconComponent className="h-5 w-5" />
                {section.title}
              </h4>
              
              {Array.isArray(data[section.key]) 
                ? renderList(data[section.key], section.key === 'courses' ? GraduationCap : undefined)
                : <p>{formatValue(data[section.key])}</p>
              }
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
