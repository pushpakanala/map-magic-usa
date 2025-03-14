
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, MapPin, School, GraduationCap, 
  Users, Calendar, Award, GlobeIcon 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const ComparisonCard = ({ university, index, onViewDetails }) => {
  const navigate = useNavigate();
  
  // Animation values
  const delay = index * 0.15;
  
  // Card accent colors - updated with dark theme gradients
  const accentColors = [
    'from-uniquestPurple/20 to-uniquestPurple-light/10',
    'from-[#0ea5e9]/20 to-[#06b6d4]/10',
    'from-[#f97316]/20 to-[#fb923c]/10',
    'from-[#8b5cf6]/20 to-[#a78bfa]/10'
  ];
  
  // Icon colors - vibrant colors that work on dark backgrounds
  const iconColors = [
    'text-uniquestPurple-light',
    'text-[#38bdf8]',
    'text-[#fb923c]',
    'text-[#a78bfa]'
  ];
  
  const colorIndex = index % 4;
  
  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(university.school.name);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="h-full"
    >
      <Card className={cn(
        "h-full overflow-hidden border shadow-xl transition-all duration-300 group",
        "bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-lg border-slate-700/30",
        "hover:shadow-2xl hover:shadow-uniquestPurple/10 hover:border-uniquestPurple/20"
      )}>
        <CardHeader className={cn(
          "bg-gradient-to-br px-6 py-5 border-b border-slate-700/30", 
          accentColors[colorIndex]
        )}>
          <CardTitle className="flex items-start gap-2.5 text-xl">
            <Building2 className={cn("h-5 w-5 mt-1", iconColors[colorIndex])} />
            <span className="font-semibold text-white/90 group-hover:text-white transition-colors">{university.school.name}</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 group hover:bg-slate-700/30 p-1.5 rounded-md transition-colors">
              <MapPin className={cn("h-4 w-4 shrink-0 group-hover:scale-110 transition-transform", iconColors[colorIndex])} />
              <span className="text-sm text-white/80 group-hover:text-white/100 transition-colors">
                {university.school.city}, {university.school.state}
              </span>
            </div>
            
            <div className="flex items-center gap-2 group hover:bg-slate-700/30 p-1.5 rounded-md transition-colors">
              <School className={cn("h-4 w-4 shrink-0 group-hover:scale-110 transition-transform", iconColors[colorIndex])} />
              <span className="text-sm text-white/80 group-hover:text-white/100 transition-colors">Ranking: #{university.school.us_ranking || "N/A"}</span>
            </div>
            
            <div className="flex items-center gap-2 group hover:bg-slate-700/30 p-1.5 rounded-md transition-colors">
              <GraduationCap className={cn("h-4 w-4 shrink-0 group-hover:scale-110 transition-transform", iconColors[colorIndex])} />
              <span className="text-sm text-white/80 group-hover:text-white/100 transition-colors">Type: {university.school.type}</span>
            </div>
            
            <div className="flex items-center gap-2 group hover:bg-slate-700/30 p-1.5 rounded-md transition-colors">
              <Users className={cn("h-4 w-4 shrink-0 group-hover:scale-110 transition-transform", iconColors[colorIndex])} />
              <span className="text-sm text-white/80 group-hover:text-white/100 transition-colors">
                Students: {university.school.students?.total_students || "N/A"}
              </span>
            </div>
            
            <div className="flex items-center gap-2 group hover:bg-slate-700/30 p-1.5 rounded-md transition-colors">
              <Calendar className={cn("h-4 w-4 shrink-0 group-hover:scale-110 transition-transform", iconColors[colorIndex])} />
              <span className="text-sm text-white/80 group-hover:text-white/100 transition-colors">Founded: {university.school.founded_in || "N/A"}</span>
            </div>
            
            <div className="flex items-center gap-2 group hover:bg-slate-700/30 p-1.5 rounded-md transition-colors">
              <Award className={cn("h-4 w-4 shrink-0 group-hover:scale-110 transition-transform", iconColors[colorIndex])} />
              <span className="text-sm text-white/80 group-hover:text-white/100 transition-colors">
                Acceptance Rate: {university.school.acceptance_rate || "N/A"}
              </span>
            </div>
            
            <div className="flex items-center gap-2 group hover:bg-slate-700/30 p-1.5 rounded-md transition-colors overflow-hidden">
              <GlobeIcon className={cn("h-4 w-4 shrink-0 group-hover:scale-110 transition-transform", iconColors[colorIndex])} />
              <span className="text-sm text-ellipsis overflow-hidden whitespace-nowrap text-white/80 group-hover:text-white/100 transition-colors">
                {university.school.school_url && (
                  <a 
                    href={university.school.school_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={cn("hover:underline", iconColors[colorIndex])}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {university.school.school_url.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </span>
            </div>
          </div>
          
          <Separator className="!my-4 bg-slate-700/30" />
          
          <div className="pt-2">
            <Button 
              onClick={handleViewDetails} 
              variant="outline" 
              className={cn(
                "w-full relative overflow-hidden group",
                "border-slate-700 bg-transparent text-white/80",
                "hover:bg-transparent hover:border-transparent hover:text-white"
              )}
            >
              <span className={cn(
                "absolute inset-0 w-0 transition-all duration-300 group-hover:w-full -z-10",
                colorIndex === 0 ? "bg-gradient-to-r from-uniquestPurple/30 to-uniquestPurple-light/20" :
                colorIndex === 1 ? "bg-gradient-to-r from-[#0ea5e9]/30 to-[#06b6d4]/20" :
                colorIndex === 2 ? "bg-gradient-to-r from-[#f97316]/30 to-[#fb923c]/20" :
                "bg-gradient-to-r from-[#8b5cf6]/30 to-[#a78bfa]/20"
              )}></span>
              <span className={cn(
                "group-hover:text-white transition-colors duration-300",
                iconColors[colorIndex]
              )}>
                View Details
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ComparisonCard;
