
import React from 'react';
import { Shield } from 'lucide-react';

const AdminManagement = () => {
  return (
    <div className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-black/10 p-2 rounded-full">
          <Shield className="h-5 w-5 text-black dark:text-white" />
        </div>
        <h2 className="text-2xl font-bold">Admin Management</h2>
      </div>
      
      <div className="space-y-6">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold mb-2">University Management</h3>
          <p className="text-muted-foreground">
            Manage university data, update information, and handle verification requests.
          </p>
        </div>
        
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold mb-2">User Management</h3>
          <p className="text-muted-foreground">
            Review user accounts, manage permissions, and monitor activity.
          </p>
        </div>
        
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold mb-2">Content Moderation</h3>
          <p className="text-muted-foreground">
            Review and moderate user-generated content across the platform.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;
