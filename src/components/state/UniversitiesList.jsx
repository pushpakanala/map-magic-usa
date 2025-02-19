
import UniversityCard from './UniversityCard';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const UniversitiesList = ({ universities, favorites, onFavoriteClick, onUniversityClick }) => {
  if (universities.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center p-8 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-primary mb-2">No Favorites Yet</h3>
        <p className="text-muted-foreground max-w-md">
          Start exploring universities and add them to your favorites to see them here. Click on any state in the map to discover universities.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
          Universities ({universities.length})
        </h2>
      </div>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {universities.map((college, index) => (
          <motion.div key={college.name} variants={item}>
            <UniversityCard
              college={college}
              isFavorite={favorites.includes(college.name)}
              onFavoriteClick={onFavoriteClick}
              onClick={() => onUniversityClick(college)}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default UniversitiesList;
