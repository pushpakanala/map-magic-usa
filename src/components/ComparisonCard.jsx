
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
  
  // Card accent colors
  const accentColors = [
    'from-uniquestPurple-light/20 to-uniquestPurple/10',
    'from-primary/20 to-primary/5',
    'from-[#0ea5e9]/20 to-[#0ea5e9]/5'
  ];
  
  // Icon colors
  const iconColors = [
    'text-uniquestPurple',
    'text-primary',
    'text-[#0ea5e9]'
  ];
  
  const colorIndex = index % 3;
  
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
        "h-full overflow-hidden border shadow-md hover:shadow-lg transition-all duration-300",
        "bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm"
      )}>
        <CardHeader className={cn(
          "bg-gradient-to-br px-6 py-5", 
          accentColors[colorIndex]
        )}>
          <CardTitle className="flex items-start gap-2.5">
            <Building2 className={cn("h-5 w-5 mt-1", iconColors[colorIndex])} />
            <span className="font-semibold">{university.school.name}</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className={cn("h-4 w-4", iconColors[colorIndex])} />
              <span className="text-sm">
                {university.school.city}, {university.school.state}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <School className={cn("h-4 w-4", iconColors[colorIndex])} />
              <span className="text-sm">Ranking: #{university.school.us_ranking}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <GraduationCap className={cn("h-4 w-4", iconColors[colorIndex])} />
              <span className="text-sm">Type: {university.school.type}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className={cn("h-4 w-4", iconColors[colorIndex])} />
              <span className="text-sm">
                Students: {university.school.students?.total_students || "N/A"}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className={cn("h-4 w-4", iconColors[colorIndex])} />
              <span className="text-sm">Founded: {university.school.founded_in || "N/A"}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Award className={cn("h-4 w-4", iconColors[colorIndex])} />
              <span className="text-sm">
                Acceptance Rate: {university.school.acceptance_rate || "N/A"}
              </span>
            </div>
            
            <div className="flex items-center gap-2 overflow-hidden">
              <GlobeIcon className={cn("h-4 w-4 shrink-0", iconColors[colorIndex])} />
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
          
          <Separator />
          
          <div className="pt-2">
            <Button 
              onClick={handleViewDetails} 
              variant="outline" 
              className="w-full hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ComparisonCard;
