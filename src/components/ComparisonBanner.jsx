
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Building2, BarChart3 } from 'lucide-react';
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
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-4"
        >
          <div className="bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-lg text-white px-8 py-4 rounded-2xl shadow-xl flex items-center gap-6 max-w-xl border border-slate-700/50">
            <div className="bg-gradient-to-br from-[#0ea5e9] to-[#06b6d4] rounded-full p-3 shadow-inner shadow-blue-400/20">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-lg">Compare Universities</p>
              <p className="text-sm text-blue-200/90">
                {comparedUniversities.length === 1 
                  ? "Select at least one more university to compare" 
                  : `${comparedUniversities.length} universities selected`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleCompareClick}
                disabled={comparedUniversities.length < 2}
                className={`${
                  comparedUniversities.length >= 2
                    ? 'bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] hover:from-[#0284c7] hover:to-[#0891b2] text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-700 text-slate-300 cursor-not-allowed'
                } px-5 font-medium rounded-xl`}
              >
                Compare
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClear} 
                className="text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl"
              >
                Clear
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ComparisonBanner;
