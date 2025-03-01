
import { motion } from 'framer-motion';
import { Heart, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

const UniversityCard = ({ college, isFavorite, onFavoriteClick, onClick }) => {
  const handleFavoriteClick = (e) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    if (onFavoriteClick) {
      onFavoriteClick(college.name);
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
        <div className="absolute top-2 right-2 z-20">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-primary/10 bg-background/40 backdrop-blur-sm"
            type="button"
            onClick={handleFavoriteClick}
          >
            <Heart 
              className={`h-5 w-5 transition-colors ${
                isFavorite 
                  ? 'fill-current text-primary' 
                  : 'text-muted-foreground'
              }`}
            />
          </Button>
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
