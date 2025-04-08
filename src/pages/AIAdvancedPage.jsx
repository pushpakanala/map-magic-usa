
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, BrainCircuit } from 'lucide-react';
import AdvancedChat from '@/components/advanced-ai/AdvancedChat';
import { motion } from 'framer-motion';

const AIAdvancedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-700/20 bg-[linear-gradient(to_right,transparent_0%,transparent_49.5%,#e2e8f0_49.5%,#e2e8f0_50.5%,transparent_50.5%,transparent_100%),linear-gradient(to_bottom,transparent_0%,transparent_49.5%,#e2e8f0_49.5%,#e2e8f0_50.5%,transparent_50.5%,transparent_100%)] dark:bg-[linear-gradient(to_right,transparent_0%,transparent_49.5%,#1e293b_49.5%,#1e293b_50.5%,transparent_50.5%,transparent_100%),linear-gradient(to_bottom,transparent_0%,transparent_49.5%,#1e293b_49.5%,#1e293b_50.5%,transparent_50.5%,transparent_100%)] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] [background-size:4%_4%] -z-10" />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="rounded-full bg-white/80 dark:bg-slate-800/80 shadow-md hover:shadow-lg transition-all"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                AI Advanced Assistant
              </h1>
              <p className="text-sm text-muted-foreground">
                Get detailed insights about universities and educational options
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 px-4 py-2 rounded-full">
            <BrainCircuit className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Powered by Advanced AI</span>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50"
        >
          <div className="max-w-4xl mx-auto">
            <AdvancedChat />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AIAdvancedPage;
