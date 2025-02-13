
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

const UniversityCard = ({ college, isFavorite, onFavoriteClick, onClick }) => {
  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
      <Card 
        className="cursor-pointer hover:shadow-lg transition-shadow relative"
        onClick={onClick}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10"
          onClick={(e) => onFavoriteClick(e)}
        >
          <Heart 
            className={`h-5 w-5 transition-colors ${
              isFavorite 
                ? 'fill-current text-primary' 
                : 'text-muted-foreground'
            }`}
          />
        </Button>
        <CardHeader>
          <CardTitle className="text-xl">{college.name}</CardTitle>
        </CardHeader>
      </Card>
    </motion.div>
  );
};

export default UniversityCard;
