
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdvancedChat from '@/components/advanced-ai/AdvancedChat';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const AIAdvancedPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
    } else {
      const userStr = sessionStorage.getItem('user');
      if (userStr) {
        setUserData(JSON.parse(userStr));
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-700/20 bg-[linear-gradient(to_right,transparent_0%,transparent_49.5%,#e2e8f0_49.5%,#e2e8f0_50.5%,transparent_50.5%,transparent_100%),linear-gradient(to_bottom,transparent_0%,transparent_49.5%,#e2e8f0_49.5%,#e2e8f0_50.5%,transparent_50.5%,transparent_100%)] dark:bg-[linear-gradient(to_right,transparent_0%,transparent_49.5%,#1e293b_49.5%,#1e293b_50.5%,transparent_50.5%,transparent_100%),linear-gradient(to_bottom,transparent_0%,transparent_49.5%,#1e293b_49.5%,#1e293b_50.5%,transparent_50.5%,transparent_100%)] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] [background-size:4%_4%] -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto py-6"
      >
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate('/explore')}
            className="mr-4 bg-white dark:bg-gray-800 shadow-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">AI Advanced Assistant</h1>
        </div>
        
        <div className="max-w-6xl mx-auto bg-transparent">
          <AdvancedChat />
        </div>
      </motion.div>
    </div>
  );
};

export default AIAdvancedPage;
