
import { useState } from 'react';
import { Check, X, School } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';

const ComparisonConfirmModal = ({ 
  open, 
  onOpenChange, 
  comparedUniversities, 
  onRemoveUniversity 
}) => {
  const navigate = useNavigate();
  
  const handleConfirmComparison = () => {
    onOpenChange(false);
    navigate(`/compare?universities=${comparedUniversities.join(',')}`);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-lg bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-md border border-slate-700/50 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <School className="h-6 w-6 text-[#0ea5e9]" />
            <span>Confirm University Comparison</span>
          </AlertDialogTitle>
        </AlertDialogHeader>
        
        <div className="py-4">
          <p className="text-slate-300 text-center mb-6">
            You've selected the following universities to compare:
          </p>
          
          <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
            {comparedUniversities.map((university, index) => (
              <motion.div
                key={university}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-slate-800/80 rounded-lg border border-slate-700/50 hover:bg-slate-700/60 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="bg-[#0ea5e9]/20 p-1.5 rounded-full">
                    <School className="h-4 w-4 text-[#0ea5e9]" />
                  </div>
                  <span className="text-white font-medium">{university}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-slate-600/50 hover:text-red-400"
                  onClick={() => onRemoveUniversity(university)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
        
        <AlertDialogFooter className="flex gap-3 border-t border-slate-700/50 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 bg-transparent text-white border-slate-600 hover:bg-slate-800 hover:text-white hover:border-slate-500"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleConfirmComparison}
            className="flex-1 bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] hover:from-[#0284c7] hover:to-[#0891b2] text-white"
          >
            Confirm Comparison
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ComparisonConfirmModal;
