
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, MapPin, School, GraduationCap, 
  Users, Calendar, Award, GlobeIcon, ExternalLink 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const ComparisonCard = ({ university, index, onViewDetails }) => {
  const navigate = useNavigate();
  
  // Animation values
  const delay = index * 0.15;
  
  // Card accent colors - modern, unique gradients with glow effects
  const accentColors = [
    'from-uniquestPurple/40 to-uniquestPurple-light/20 shadow-[0_0_20px_rgba(214,188,250,0.15)]',
    'from-[#0ea5e9]/40 to-[#06b6d4]/20 shadow-[0_0_20px_rgba(6,182,212,0.15)]',
    'from-[#f97316]/40 to-[#fb923c]/20 shadow-[0_0_20px_rgba(251,146,60,0.15)]',
    'from-[#8b5cf6]/40 to-[#a78bfa]/20 shadow-[0_0_20px_rgba(167,139,250,0.15)]'
  ];
  
  // Icon colors - vibrant colors that work on dark backgrounds
  const iconColors = [
    'text-uniquestPurple-light',
    'text-[#38bdf8]',
    'text-[#fb923c]',
    'text-[#a78bfa]'
  ];

  // Highlight gradient backgrounds for stats
  const statBgGradients = [
    'bg-gradient-to-r from-uniquestPurple/20 to-uniquestPurple/5',
    'bg-gradient-to-r from-[#0ea5e9]/20 to-[#0ea5e9]/5',
    'bg-gradient-to-r from-[#f97316]/20 to-[#f97316]/5',
    'bg-gradient-to-r from-[#8b5cf6]/20 to-[#8b5cf6]/5'
  ];
  
  const colorIndex = index % 4;
  
  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(university.school.name);
    }
  };

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5, 
        delay 
      } 
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className="h-full"
    >
      <Card className={cn(
        "h-full overflow-hidden border shadow-xl backdrop-blur-sm transition-all duration-300 group",
        "bg-gradient-to-br from-slate-950/90 to-slate-900/90 border-slate-800/50",
        "hover:shadow-2xl hover:translate-y-[-4px]"
      )}>
        <CardHeader className={cn(
          "relative bg-gradient-to-br px-6 py-5 border-b border-slate-800/50", 
          accentColors[colorIndex]
        )}>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PHBhdGggZD0iTTAgMCBMNDAgNDAiIHN0cm9rZT0iIzMzMzMzMzIwIiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIgb3BhY2l0eT0iMC4yIi8+PC9zdmc+')] opacity-10" />
          <CardTitle className="flex items-start gap-3 text-xl">
            <div className="p-2 bg-black/20 backdrop-blur-sm rounded-lg border border-white/10 shadow-inner">
              <Building2 className={cn("h-5 w-5", iconColors[colorIndex])} />
            </div>
            <div className="space-y-1">
              <span className="font-semibold text-white/90 group-hover:text-white transition-colors">{university.school.name}</span>
              <div className="flex items-center gap-2 text-xs font-normal text-white/60">
                <MapPin className="h-3 w-3" />
                <span>{university.school.city}, {university.school.state}</span>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className={cn(
              "p-3 rounded-lg flex flex-col gap-1 border border-slate-800/50",
              statBgGradients[colorIndex]
            )}>
              <div className="flex items-center gap-2 text-xs text-white/60">
                <School className="h-3.5 w-3.5" />
                <span>Ranking</span>
              </div>
              <p className={cn(
                "text-lg font-semibold", 
                iconColors[colorIndex]
              )}>
                #{university.school.us_ranking || "N/A"}
              </p>
            </div>
            
            <div className={cn(
              "p-3 rounded-lg flex flex-col gap-1 border border-slate-800/50",
              statBgGradients[colorIndex]
            )}>
              <div className="flex items-center gap-2 text-xs text-white/60">
                <GraduationCap className="h-3.5 w-3.5" />
                <span>Type</span>
              </div>
              <p className="text-lg font-semibold text-white">
                {university.school.type || "N/A"}
              </p>
            </div>
            
            <div className={cn(
              "p-3 rounded-lg flex flex-col gap-1 border border-slate-800/50",
              statBgGradients[colorIndex]
            )}>
              <div className="flex items-center gap-2 text-xs text-white/60">
                <Users className="h-3.5 w-3.5" />
                <span>Students</span>
              </div>
              <p className="text-lg font-semibold text-white">
                {university.school.students?.total_students || "N/A"}
              </p>
            </div>
            
            <div className={cn(
              "p-3 rounded-lg flex flex-col gap-1 border border-slate-800/50",
              statBgGradients[colorIndex]
            )}>
              <div className="flex items-center gap-2 text-xs text-white/60">
                <Calendar className="h-3.5 w-3.5" />
                <span>Founded</span>
              </div>
              <p className="text-lg font-semibold text-white">
                {university.school.founded_in || "N/A"}
              </p>
            </div>
          </div>
          
          <div className={cn(
            "p-4 rounded-lg border border-slate-800/50 flex items-center justify-between",
            statBgGradients[colorIndex]
          )}>
            <div className="flex items-center gap-2">
              <Award className={cn("h-4 w-4", iconColors[colorIndex])} />
              <span className="text-sm text-white/80">Acceptance Rate</span>
            </div>
            <span className={cn(
              "text-sm font-semibold px-3 py-1 rounded-full", 
              "bg-black/20 backdrop-blur-sm border border-white/10",
              iconColors[colorIndex]
            )}>
              {university.school.acceptance_rate || "N/A"}
            </span>
          </div>
          
          {university.school.school_url && (
            <div className="flex items-center gap-2 text-sm text-white/60 hover:text-white/80 transition-colors">
              <GlobeIcon className={cn("h-3.5 w-3.5", iconColors[colorIndex])} />
              <a 
                href={university.school.school_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="truncate hover:underline flex-1"
                onClick={(e) => e.stopPropagation()}
              >
                {university.school.school_url.replace(/^https?:\/\//, '')}
              </a>
              <ExternalLink className="h-3 w-3" />
            </div>
          )}
          
          <Separator className="!my-4 bg-slate-800/50" />
          
          <Button 
            onClick={handleViewDetails} 
            variant="outline" 
            className={cn(
              "w-full relative overflow-hidden group z-10",
              "border-slate-800/50 bg-transparent text-white/80",
              "hover:bg-transparent hover:border-slate-700/70 hover:text-white"
            )}
          >
            <span className={cn(
              "absolute inset-0 w-0 transition-all duration-300 group-hover:w-full -z-10",
              colorIndex === 0 ? "bg-gradient-to-r from-uniquestPurple/30 to-uniquestPurple-light/20" :
              colorIndex === 1 ? "bg-gradient-to-r from-[#0ea5e9]/30 to-[#06b6d4]/20" :
              colorIndex === 2 ? "bg-gradient-to-r from-[#f97316]/30 to-[#fb923c]/20" :
              "bg-gradient-to-r from-[#8b5cf6]/30 to-[#a78bfa]/20"
            )}></span>
            <span className="mr-2">View Details</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ComparisonCard;
