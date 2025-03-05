
import { motion } from 'framer-motion';
import { Heart, GraduationCap, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
        className="cursor-pointer relative overflow-hidden bg-gradient-to-br from-card/80 to-card/30 backdrop-blur-sm border-primary/10 hover:shadow-lg hover:shadow-primary/10 transition-all h-full"
        onClick={onClick}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-70" />
        <div className="absolute top-2 right-2 z-20 flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 rounded-full bg-background/70 hover:bg-background/90 backdrop-blur-sm border-primary/20 shadow-sm"
                  type="button"
                  onClick={handleCompareClick}
                >
                  <Check 
                    className={`h-4 w-4 transition-colors ${
                      isCompared 
                        ? 'text-white fill-[#0ea5e9]' 
                        : 'text-muted-foreground'
                    }`}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                {isCompared ? 'Remove from comparison' : 'Add to comparison'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 rounded-full bg-background/70 hover:bg-background/90 backdrop-blur-sm border-primary/20 shadow-sm"
                  type="button"
                  onClick={handleFavoriteClick}
                >
                  <Heart 
                    className={`h-4 w-4 transition-colors ${
                      isFavorite 
                        ? 'text-white fill-primary' 
                        : 'text-muted-foreground'
                    }`}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardHeader className="relative z-10">
          <div className="flex items-start gap-3">
            <div className="mt-1 p-2.5 rounded-full bg-primary/10 border border-primary/20">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-xl leading-tight">
              {college.name}
            </CardTitle>
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  );
};

export default UniversityCard;
