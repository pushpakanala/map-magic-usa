
import { useState, useEffect } from 'react';
import { Check, X, School, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { useComparison } from '@/hooks/use-comparison';

const ComparisonConfirmModal = ({ 
  open, 
  onOpenChange, 
  comparedUniversities, 
  onRemoveUniversity 
}) => {
  // Local state to manage universities within the modal
  const [localUniversities, setLocalUniversities] = useState([]);
  const navigate = useNavigate();
  const { removeFromComparison } = useComparison();
  
  // Update local state when comparedUniversities prop changes
  useEffect(() => {
    setLocalUniversities([...comparedUniversities]);
  }, [comparedUniversities]);
  
  const handleConfirmComparison = () => {
    onOpenChange(false);
    navigate(`/compare?universities=${localUniversities.join(',')}`);
  };

  const handleRemoveUniversity = (universityName, event) => {
    // Make sure to stop the event from propagating up to parent elements
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    console.log("Removing university from ComparisonConfirmModal:", universityName);
    
    // Update local state immediately for UI
    const updatedList = localUniversities.filter(name => name !== universityName);
    setLocalUniversities(updatedList);
    
    // Call the hook function to update global state
    removeFromComparison(universityName);
    
    // Then call the callback from parent component if it exists
    if (onRemoveUniversity) {
      onRemoveUniversity(universityName);
    }
    
    // If after removal there's less than 2 universities, close the modal with a delay
    if (updatedList.length < 2) {
      setTimeout(() => onOpenChange(false), 300); // Small delay to allow animation
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent 
        className="max-w-lg bg-gradient-to-br from-[#1a1f3c] to-[#101329] backdrop-blur-md border border-indigo-500/20 text-white rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.15)]"
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Building2 className="h-6 w-6 text-indigo-400" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-indigo-100">
              Confirm University Comparison
            </span>
          </AlertDialogTitle>
          <AlertDialogDescription className="sr-only">
            Select universities to compare
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-4">
          <p className="text-indigo-200 text-center mb-6">
            You've selected the following universities to compare:
          </p>
          
          <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence>
              {localUniversities.map((university, index) => (
                <motion.div
                  key={university}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-indigo-900/30 rounded-lg border border-indigo-500/30 hover:bg-indigo-800/40 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="bg-indigo-500/20 p-1.5 rounded-full">
                      <School className="h-4 w-4 text-indigo-300" />
                    </div>
                    <span className="text-white font-medium">{university}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-red-500/20 hover:text-red-400 transition-colors"
                    onClick={(event) => handleRemoveUniversity(university, event)}
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        
        <AlertDialogFooter className="flex gap-3 border-t border-indigo-500/20 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 bg-transparent text-indigo-200 border-indigo-500/30 hover:bg-indigo-800/30 hover:text-white hover:border-indigo-400"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleConfirmComparison}
            disabled={localUniversities.length < 2}
            className={`flex-1 ${
              localUniversities.length >= 2
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                : 'bg-slate-700 text-slate-300 cursor-not-allowed'
            }`}
          >
            <Check className="mr-2 h-4 w-4" />
            Confirm Comparison
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ComparisonConfirmModal;
