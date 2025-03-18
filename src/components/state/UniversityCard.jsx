
import { motion } from 'framer-motion';
import { Heart, GraduationCap, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

const UniversityCard = ({ college, isFavorite, isCompared, onFavoriteClick, onCompareClick, onClick }) => {
  const handleFavoriteClick = (e) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    if (onFavoriteClick) {
      onFavoriteClick(college.name);
    }
  };

  const handleCompareClick = (e) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    if (onCompareClick) {
      onCompareClick(college.name);
    }
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.03 }} 
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card 
        className="cursor-pointer relative overflow-hidden bg-gradient-to-br from-card/80 to-card/30 backdrop-blur-sm border-primary/10 hover:shadow-lg hover:shadow-primary/10 transition-all h-full group"
        onClick={onClick}
      >
        {/* Color overlay with gradient that animates on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* New decorative elements that appear on hover */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PHBhdGggZD0iTTAgMCBMNDAgNDAiIHN0cm9rZT0iIzMzMzMzMzIwIiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIgb3BhY2l0eT0iMC4yIi8+PC9zdmc+')] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        
        {/* Animated highlight line that appears from left to right on hover */}
        <div className="absolute h-1 bottom-0 left-0 w-0 group-hover:w-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-indigo-300 transition-all duration-300 ease-out" />
        
        {/* Action buttons positioned at top-right with proper spacing */}
        <div className="absolute top-3 right-3 z-20 flex gap-2">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={`w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border-primary/20 shadow-sm ${
                    isCompared 
                      ? 'bg-indigo-600/90 hover:bg-indigo-700/80 border-indigo-500/30' 
                      : 'hover:bg-background/90 hover:border-primary/30'
                  } transform transition-all duration-300 group-hover:scale-110`}
                  type="button"
                  onClick={handleCompareClick}
                >
                  <Check 
                    className={`h-4 w-4 transition-colors ${
                      isCompared 
                        ? 'text-white' 
                        : 'text-muted-foreground'
                    }`}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="bg-slate-800 text-white border-slate-700">
                {isCompared ? 'Remove from comparison' : 'Add to comparison'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={`w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border-primary/20 shadow-sm ${
                    isFavorite 
                      ? 'bg-primary/90 hover:bg-primary/80 border-primary/30' 
                      : 'hover:bg-background/90 hover:border-primary/30'
                  } transform transition-all duration-300 group-hover:scale-110`}
                  type="button"
                  onClick={handleFavoriteClick}
                >
                  <Heart 
                    className={`h-4 w-4 transition-colors ${
                      isFavorite 
                        ? 'text-white' 
                        : 'text-muted-foreground'
                    }`}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="bg-slate-800 text-white border-slate-700">
                {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <CardHeader className="relative z-10 pt-14">
          <div className="flex items-start gap-3">
            <div className="mt-1 p-2.5 rounded-full bg-primary/10 border border-primary/20 group-hover:bg-indigo-600/20 group-hover:border-indigo-500/30 transition-colors">
              <GraduationCap className="h-5 w-5 text-primary group-hover:text-indigo-500 transition-colors" />
            </div>
            <CardTitle className="text-xl leading-tight group-hover:text-indigo-800 dark:group-hover:text-indigo-200 transition-colors">
              <span className="relative">
                {college.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300 ease-out opacity-70"></span>
              </span>
            </CardTitle>
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  );
};

export default UniversityCard;
