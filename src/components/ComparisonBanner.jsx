
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BarChart3, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ComparisonConfirmModal from './ComparisonConfirmModal';
import { useComparison } from '@/hooks/use-comparison';
import { toast } from 'sonner';

const ComparisonBanner = ({ comparedUniversities, onClear }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localUniversities, setLocalUniversities] = useState([]);
  const navigate = useNavigate();
  const { removeFromComparison } = useComparison();

  useEffect(() => {
    // Update local state when prop changes
    setLocalUniversities([...comparedUniversities]);
    
    // Show banner when we have at least one university selected
    setIsVisible(comparedUniversities.length > 0);
  }, [comparedUniversities]);

  const handleCompareClick = () => {
    if (localUniversities.length >= 2) {
      setIsModalOpen(true);
    } else {
      toast.info("Please select at least 2 universities to compare");
    }
  };

  // Use useCallback to prevent recreating this function on every render
  const handleRemoveUniversity = useCallback((university) => {
    console.log("Removing university from comparison in ComparisonBanner:", university);
    
    // Call the removeFromComparison function with the university to remove
    removeFromComparison(university);
  }, [removeFromComparison]);

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-4"
          >
            <div className="bg-gradient-to-r from-[#1a1f3c] to-[#101329] backdrop-blur-md text-white px-8 py-4 rounded-2xl shadow-lg shadow-indigo-500/10 border border-indigo-500/20 flex items-center gap-6 max-w-xl">
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full p-3 shadow-lg shadow-indigo-500/20">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-lg tracking-tight text-white">Compare Universities</p>
                <p className="text-sm text-indigo-200">
                  {localUniversities.length === 1 
                    ? "Select at least one more university to compare" 
                    : `${localUniversities.length} universities selected`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleCompareClick}
                  disabled={localUniversities.length < 2}
                  className={`${
                    localUniversities.length >= 2
                      ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-md shadow-indigo-500/20'
                      : 'bg-slate-700 text-slate-300 cursor-not-allowed'
                  } px-5 py-2 h-auto font-medium rounded-xl transition-all`}
                >
                  Compare
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onClear} 
                  className="text-indigo-200 hover:text-white hover:bg-indigo-800/50 rounded-xl"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ComparisonConfirmModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        comparedUniversities={localUniversities}
        onRemoveUniversity={handleRemoveUniversity}
      />
    </>
  );
};

export default ComparisonBanner;
