
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import AdminManagement from '@/components/AdminManagement';

const AdminPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate('/explore')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Explore
        </Button>
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage universities, users, and system settings</p>
        </div>
        
        <AdminManagement />
      </div>
    </div>
  );
};

export default AdminPage;
