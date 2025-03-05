
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ComparisonBanner = ({ comparedUniversities, onClear }) => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show banner when we have at least one university selected
    setIsVisible(comparedUniversities.length > 0);
  }, [comparedUniversities]);

  const handleCompareClick = () => {
    if (comparedUniversities.length >= 2) {
      navigate(`/compare?universities=${comparedUniversities.join(',')}`);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 flex justify-center"
        >
          <div className="bg-black/80 backdrop-blur-md text-white px-6 py-3 rounded-t-lg shadow-lg flex items-center gap-4 max-w-xl">
            <div className="bg-green-500 rounded-full p-2">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Ready to Compare:</p>
              <p className="text-sm text-gray-300">{comparedUniversities.length} Schools</p>
            </div>
            <Button
              onClick={handleCompareClick}
              disabled={comparedUniversities.length < 2}
              className={`${
                comparedUniversities.length >= 2
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
            >
              Compare Schools
            </Button>
            <Button variant="ghost" size="sm" onClick={onClear} className="text-gray-300 hover:text-white">
              Clear All
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ComparisonBanner;
