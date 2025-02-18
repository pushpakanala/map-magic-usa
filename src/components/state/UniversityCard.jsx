
import { motion } from 'framer-motion';
import { Heart, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

const UniversityCard = ({ college, isFavorite, onFavoriteClick, onClick }) => {
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onFavoriteClick(college.name, e);
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
      <Card 
        className="cursor-pointer relative overflow-hidden bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-primary/10 hover:shadow-lg hover:shadow-primary/5 transition-all"
        onClick={onClick}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10 hover:bg-primary/10"
          onClick={handleFavoriteClick}
          type="button"
        >
          <Heart 
            className={`h-5 w-5 transition-colors ${
              isFavorite 
                ? 'fill-current text-primary' 
                : 'text-muted-foreground'
            }`}
          />
        </Button>
        <CardHeader className="relative z-10">
          <div className="flex items-start gap-3">
            <div className="mt-1 p-2 rounded-full bg-primary/10">
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
