
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
  
  // Card accent colors - updated with more vibrant gradients
  const accentColors = [
    'from-uniquestPurple/30 to-uniquestPurple-light/20',
    'from-[#0ea5e9]/30 to-[#06b6d4]/20',
    'from-[#f97316]/30 to-[#fb923c]/20',
    'from-[#8b5cf6]/30 to-[#a78bfa]/20'
  ];
  
  // Icon colors - updated with matching vibrant colors
  const iconColors = [
    'text-uniquestPurple',
    'text-[#0ea5e9]',
    'text-[#f97316]',
    'text-[#8b5cf6]'
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
        "h-full overflow-hidden border shadow-lg hover:shadow-xl transition-all duration-300",
        "bg-gradient-to-br from-white to-slate-50/90 dark:from-slate-900/95 dark:to-slate-800/90 backdrop-blur-md"
      )}>
        <CardHeader className={cn(
          "bg-gradient-to-br px-6 py-5", 
          accentColors[colorIndex]
        )}>
          <CardTitle className="flex items-start gap-2.5 text-xl">
            <Building2 className={cn("h-5 w-5 mt-1", iconColors[colorIndex])} />
            <span className="font-semibold">{university.school.name}</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 group hover:bg-slate-100/50 dark:hover:bg-slate-800/50 p-1.5 rounded-md transition-colors">
              <MapPin className={cn("h-4 w-4 shrink-0 group-hover:scale-110 transition-transform", iconColors[colorIndex])} />
              <span className="text-sm">
                {university.school.city}, {university.school.state}
              </span>
            </div>
            
            <div className="flex items-center gap-2 group hover:bg-slate-100/50 dark:hover:bg-slate-800/50 p-1.5 rounded-md transition-colors">
              <School className={cn("h-4 w-4 shrink-0 group-hover:scale-110 transition-transform", iconColors[colorIndex])} />
              <span className="text-sm">Ranking: #{university.school.us_ranking || "N/A"}</span>
            </div>
            
            <div className="flex items-center gap-2 group hover:bg-slate-100/50 dark:hover:bg-slate-800/50 p-1.5 rounded-md transition-colors">
              <GraduationCap className={cn("h-4 w-4 shrink-0 group-hover:scale-110 transition-transform", iconColors[colorIndex])} />
              <span className="text-sm">Type: {university.school.type}</span>
            </div>
            
            <div className="flex items-center gap-2 group hover:bg-slate-100/50 dark:hover:bg-slate-800/50 p-1.5 rounded-md transition-colors">
              <Users className={cn("h-4 w-4 shrink-0 group-hover:scale-110 transition-transform", iconColors[colorIndex])} />
              <span className="text-sm">
                Students: {university.school.students?.total_students || "N/A"}
              </span>
            </div>
            
            <div className="flex items-center gap-2 group hover:bg-slate-100/50 dark:hover:bg-slate-800/50 p-1.5 rounded-md transition-colors">
              <Calendar className={cn("h-4 w-4 shrink-0 group-hover:scale-110 transition-transform", iconColors[colorIndex])} />
              <span className="text-sm">Founded: {university.school.founded_in || "N/A"}</span>
            </div>
            
            <div className="flex items-center gap-2 group hover:bg-slate-100/50 dark:hover:bg-slate-800/50 p-1.5 rounded-md transition-colors">
              <Award className={cn("h-4 w-4 shrink-0 group-hover:scale-110 transition-transform", iconColors[colorIndex])} />
              <span className="text-sm">
                Acceptance Rate: {university.school.acceptance_rate || "N/A"}
              </span>
            </div>
            
            <div className="flex items-center gap-2 group hover:bg-slate-100/50 dark:hover:bg-slate-800/50 p-1.5 rounded-md transition-colors overflow-hidden">
              <GlobeIcon className={cn("h-4 w-4 shrink-0 group-hover:scale-110 transition-transform", iconColors[colorIndex])} />
              <span className="text-sm text-ellipsis overflow-hidden whitespace-nowrap">
                {university.school.school_url && (
                  <a 
                    href={university.school.school_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={cn("hover:underline", iconColors[colorIndex])}
                  >
                    {university.school.school_url.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </span>
            </div>
          </div>
          
          <Separator className="!my-4" />
          
          <div className="pt-2">
            <Button 
              onClick={handleViewDetails} 
              variant="outline" 
              className={cn(
                "w-full relative overflow-hidden group",
                "border border-slate-200 dark:border-slate-700 bg-transparent",
                "hover:bg-transparent hover:border-transparent"
              )}
            >
              <span className={cn(
                "absolute inset-0 w-0 bg-gradient-to-r transition-all duration-300 group-hover:w-full -z-10",
                colorIndex === 0 ? "from-uniquestPurple/20 to-uniquestPurple-light/10" :
                colorIndex === 1 ? "from-[#0ea5e9]/20 to-[#06b6d4]/10" :
                colorIndex === 2 ? "from-[#f97316]/20 to-[#fb923c]/10" :
                "from-[#8b5cf6]/20 to-[#a78bfa]/10"
              )}></span>
              <span className={cn(
                "group-hover:text-white dark:group-hover:text-white transition-colors duration-300",
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
