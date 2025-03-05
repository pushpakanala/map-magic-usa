
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ComparisonConfirmModal from './ComparisonConfirmModal';

const ComparisonBanner = ({ comparedUniversities, onClear }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show banner when we have at least one university selected
    setIsVisible(comparedUniversities.length > 0);
  }, [comparedUniversities]);

  const handleCompareClick = () => {
    if (comparedUniversities.length >= 2) {
      setIsModalOpen(true);
    }
  };

  const handleRemoveUniversity = (university) => {
    const updatedList = comparedUniversities.filter(name => name !== university);
    
    // If after removing, only 0 or 1 universities remain, close the modal
    if (updatedList.length < 2) {
      setIsModalOpen(false);
    }
    
    // Update the comparison list through the parent component
    const newList = comparedUniversities.filter(name => name !== university);
    sessionStorage.setItem('comparedUniversities', JSON.stringify(newList));
    window.dispatchEvent(new Event('storage'));
  };

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
            <div className="bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-md text-white px-8 py-4 rounded-2xl shadow-xl flex items-center gap-6 max-w-xl border border-slate-700/50">
              <div className="bg-gradient-to-br from-[#0ea5e9] to-[#06b6d4] rounded-full p-3 shadow-lg shadow-blue-500/20">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-lg tracking-tight">Compare Universities</p>
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
                  } px-5 py-2 h-auto font-medium rounded-xl transition-all`}
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

      <ComparisonConfirmModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        comparedUniversities={comparedUniversities}
        onRemoveUniversity={handleRemoveUniversity}
      />
    </>
  );
};

export default ComparisonBanner;
