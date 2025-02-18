
import UniversityCard from './UniversityCard';
import { motion } from 'framer-motion';

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
              onFavoriteClick={(e) => onFavoriteClick(college.name, e)}
              onClick={() => onUniversityClick(college)}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default UniversitiesList;
