
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import ComparisonCard from './ComparisonCard';
import { AlertTriangle } from 'lucide-react';

const ComparisonTabContent = ({ data, tabValue, onViewDetails }) => {
  // Limit to showing only 2 universities
  const limitedData = data.slice(0, 2);
  
  // Show warning if more than 2 universities
  const hasExtraUniversities = data.length > 2;
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const renderOverviewTab = () => (
    <>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto"
      >
        {limitedData.map((item, index) => (
          <ComparisonCard 
            key={item.school.name} 
            university={item} 
            index={index}
            onViewDetails={onViewDetails}
          />
        ))}
      </motion.div>
      
      {hasExtraUniversities && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-4 rounded-lg flex items-center gap-3 max-w-2xl mx-auto"
        >
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0" />
          <p className="text-sm text-amber-800 dark:text-amber-400">
            Showing only 2 universities for optimal comparison. 
            {data.length - 2 === 1 
              ? "1 additional university" 
              : `${data.length - 2} additional universities`} not displayed.
          </p>
        </motion.div>
      )}
    </>
  );

  const renderAcademicsTab = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {limitedData.map((item, index) => {
          // Define colors based on index
          const colorIndex = index % 2;
          const bgGradient = [
            'bg-gradient-to-br from-[#4A148C]/90 to-[#7B1FA2]/80',
            'bg-gradient-to-br from-[#0D47A1]/90 to-[#1976D2]/80',
          ];
          const textColor = [
            'text-[#E1BEE7]',
            'text-[#BBDEFB]',
          ];
          
          return (
            <motion.div
              key={item.school.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <div className="rounded-lg border-0 shadow-xl bg-gradient-to-br from-gray-900/95 to-gray-800/95 text-white overflow-hidden h-full">
                <div className={cn(
                  "p-6 relative",
                  bgGradient[colorIndex]
                )}>
                  <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjEiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIyOCAwIDIuMjIxLjk5MyAyLjIyMSAyLjIyMXYxNS41NThjMCAxLjIyOC0uOTkzIDIuMjIxLTIuMjIxIDIuMjIxaC05LjU1OGMtMS4yMjggMC0yLjIyMS0uOTkzLTIuMjIxLTIuMjIxVjIwLjIyMWMwLTEuMjI4Ljk5My0yLjIyMSAyLjIyMS0yLjIyMWg5LjU1OHoiLz48cGF0aCBkPSJNMzAgMGMxLjIyOCAwIDIuMjIxLjk5MyAyLjIyMSAyLjIyMXYxNS41NThjMCAxLjIyOC0uOTkzIDIuMjIxLTIuMjIxIDIuMjIxaC05LjU1OGMtMS4yMjggMC0yLjIyMS0uOTkzLTIuMjIxLTIuMjIxVjIuMjIxQzE4LjIyMS45OTMgMTkuMjE0IDAgMjAuNDQyIDBoOS41NTh6Ii8+PHBhdGggZD0iTTEyIDE4YzEuMjI4IDAgMi4yMjEuOTkzIDIuMjIxIDIuMjIxdjE1LjU1OGMwIDEuMjI4LS45OTMgMi4yMjEtMi4yMjEgMi4yMjFIMi40NDJDMS4yMTQgMzggLjIyMSAzNy4wMDcuMjIxIDM1Ljc3OVYyMC4yMjFjMC0xLjIyOC45OTMtMi4yMjEgMi4yMjEtMi4yMjFIMTJ6Ii8+PHBhdGggZD0iTTU0IDBjMS4yMjggMCAyLjIyMS45OTMgMi4yMjEgMi4yMjF2MTUuNTU4YzAgMS4yMjgtLjk5MyAyLjIyMS0yLjIyMSAyLjIyMWgtOS41NThjLTEuMjI4IDAgLTIuMjIxLS45OTMtMi4yMjEtMi4yMjFWMi4yMjFDNDIuMjIxLjk5MyA0My4yMTQgMCA0NC40NDIgMGg5LjU1OHoiLz48cGF0aCBkPSJNMTIgMzZjMS4yMjggMCAyLjIyMS45OTMgMi4yMjEgMi4yMjF2MTUuNTU4YzAgMS4yMjgtLjk5MyAyLjIyMS0yLjIyMSAyLjIyMUgyLjQ0MkMxLjIxNCA1NiAuMjIxIDU1LjAwNy4yMjEgNTMuNzc5VjM4LjIyMWMwLTEuMjI4Ljk5My0yLjIyMSAyLjIyMS0yLjIyMUgxMnoiLz48cGF0aCBkPSJNMzYgMzZjMS4yMjggMCAyLjIyMS45OTMgMi4yMjEgMi4yMjF2MTUuNTU4YzAgMS4yMjgtLjk5MyAyLjIyMS0yLjIyMSAyLjIyMWgtOS41NThjLTEuMjI4IDAtMi4yMjEtLjk5My0yLjIyMS0yLjIyMVYzOC4yMjFjMC0xLjIyOC45OTMtMi4yMjEgMi4yMjEtMi4yMjFoOS41NTh6Ii8+PHBhdGggZD0iTTYwIDE4YzEuMjI4IDAgMi4yMjEuOTkzIDIuMjIxIDIuMjIxdjE1LjU1OGMwIDEuMjI4LS45OTMgMi4yMjEtMi4yMjEgMi4yMjFoLTkuNTU4Yy0xLjIyOCAwLTIuMjIxLS45OTMtMi4yMjEtMi4yMjFWMjAuMjIxYzAtMS4yMjguOTkzLTIuMjIxIDIuMjIxLTIuMjIxaDkuNTU4eiIvPjxwYXRoIGQ9Ik02MCAzNmMxLjIyOCAwIDIuMjIxLjk5MyAyLjIyMSAyLjIyMXYxNS41NThjMCAxLjIyOC0uOTkzIDIuMjIxLTIuMjIxIDIuMjIxaC05LjU1OGMtMS4yMjggMC0yLjIyMS0uOTkzLTIuMjIxLTIuMjIxVjM4LjIyMWMwLTEuMjI4Ljk5My0yLjIyMSAyLjIyMS0yLjIyMWg5LjU1OHoiLz48L2c+PC9nPjwvc3ZnPg==')] bg-repeat"></div>
                  <h3 className="text-xl font-bold z-10 relative">{item.school.name}</h3>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <h4 className={cn("text-lg font-medium mb-4 flex items-center gap-2", textColor[colorIndex])}>
                      Programs
                    </h4>
                    <div className="space-y-2">
                      {item.school.school_programs?.slice(0, 5).map((program, idx) => (
                        <div key={idx} className="text-sm py-1.5 px-3 rounded-full bg-white/5 border border-white/10">
                          {program}
                        </div>
                      ))}
                      {item.school.school_programs?.length > 5 && (
                        <div className="text-sm text-white/70">
                          +{item.school.school_programs.length - 5} more programs
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className={cn("text-lg font-medium mb-4 flex items-center gap-2", textColor[colorIndex])}>
                      Program Duration
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-white/70">Undergraduate:</span>
                        <span className="text-sm font-medium">4 years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-white/70">Graduate:</span>
                        <span className="text-sm font-medium">2 years</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className={cn("text-lg font-medium mb-4 flex items-center gap-2", textColor[colorIndex])}>
                      Graduation Rate
                    </h4>
                    <div className={cn("text-xl font-semibold text-center", textColor[colorIndex])}>
                      {item.school.graduation_rate || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {hasExtraUniversities && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-4 rounded-lg flex items-center gap-3 max-w-2xl mx-auto"
        >
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0" />
          <p className="text-sm text-amber-800 dark:text-amber-400">
            Showing only 2 universities for optimal comparison. 
            {data.length - 2 === 1 
              ? "1 additional university" 
              : `${data.length - 2} additional universities`} not displayed.
          </p>
        </motion.div>
      )}
    </>
  );

  // Modify other tabs similarly - just showing two examples for brevity
  const renderAdmissionsTab = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {limitedData.map((item, index) => {
          // Define colors based on index
          const colorIndex = index % 2;
          const bgGradient = [
            'bg-gradient-to-br from-[#4A148C]/90 to-[#7B1FA2]/80',
            'bg-gradient-to-br from-[#0D47A1]/90 to-[#1976D2]/80',
          ];
          const textColor = [
            'text-[#E1BEE7]',
            'text-[#BBDEFB]',
          ];
          
          return (
            <motion.div
              key={item.school.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <div className="rounded-lg border-0 shadow-xl bg-gradient-to-br from-gray-900/95 to-gray-800/95 text-white overflow-hidden h-full">
                <div className={cn(
                  "p-6 relative",
                  bgGradient[colorIndex]
                )}>
                  <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjEiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIyOCAwIDIuMjIxLjk5MyAyLjIyMSAyLjIyMXYxNS41NThjMCAxLjIyOC0uOTkzIDIuMjIxLTIuMjIxIDIuMjIxaC05LjU1OGMtMS4yMjggMC0yLjIyMS0uOTkzLTIuMjIxLTIuMjIxVjIwLjIyMWMwLTEuMjI4Ljk5My0yLjIyMSAyLjIyMS0yLjIyMWg5LjU1OHoiLz48cGF0aCBkPSJNMzAgMGMxLjIyOCAwIDIuMjIxLjk5MyAyLjIyMSAyLjIyMXYxNS41NThjMCAxLjIyOC0uOTkzIDIuMjIxLTIuMjIxIDIuMjIxaC05LjU1OGMtMS4yMjggMC0yLjIyMS0uOTkzLTIuMjIxLTIuMjIxVjIuMjIxQzE4LjIyMS45OTMgMTkuMjE0IDAgMjAuNDQyIDBoOS41NTh6Ii8+PHBhdGggZD0iTTEyIDE4YzEuMjI4IDAgMi4yMjEuOTkzIDIuMjIxIDIuMjIxdjE1LjU1OGMwIDEuMjI4LS45OTMgMi4yMjEtMi4yMjEgMi4yMjFIMi40NDJDMS4yMTQgMzggLjIyMSAzNy4wMDcuMjIxIDM1Ljc3OVYyMC4yMjFjMC0xLjIyOC45OTMtMi4yMjEgMi4yMjEtMi4yMjFIMTJ6Ii8+PHBhdGggZD0iTTU0IDBjMS4yMjggMCAyLjIyMS45OTMgMi4yMjEgMi4yMjF2MTUuNTU4YzAgMS4yMjgtLjk5MyAyLjIyMS0yLjIyMSAyLjIyMWgtOS41NThjLTEuMjI4IDAgLTIuMjIxLS45OTMtMi4yMjEtMi4yMjFWMi4yMjFDNDIuMjIxLjk5MyA0My4yMTQgMCA0NC40NDIgMGg5LjU1OHoiLz48cGF0aCBkPSJNMTIgMzZjMS4yMjggMCAyLjIyMS45OTMgMi4yMjEgMi4yMjF2MTUuNTU4YzAgMS4yMjgtLjk5MyAyLjIyMS0yLjIyMSAyLjIyMUgyLjQ0MkMxLjIxNCA1NiAuMjIxIDU1LjAwNy4yMjEgNTMuNzc5VjM4LjIyMWMwLTEuMjI4Ljk5My0yLjIyMSAyLjIyMS0yLjIyMUgxMnoiLz48cGF0aCBkPSJNMzYgMzZjMS4yMjggMCAyLjIyMS45OTMgMi4yMjEgMi4yMjF2MTUuNTU4YzAgMS4yMjgtLjk5MyAyLjIyMS0yLjIyMSAyLjIyMWgtOS41NThjLTEuMjI4IDAtMi4yMjEtLjk5My0yLjIyMS0yLjIyMVYzOC4yMjFjMC0xLjIyOC45OTMtMi4yMjEgMi4yMjEtMi4yMjFoOS41NTh6Ii8+PHBhdGggZD0iTTYwIDE4YzEuMjI4IDAgMi4yMjEuOTkzIDIuMjIxIDIuMjIxdjE1LjU1OGMwIDEuMjI4LS45OTMgMi4yMjEtMi4yMjEgMi4yMjFoLTkuNTU4Yy0xLjIyOCAwLTIuMjIxLS45OTMtMi4yMjEtMi4yMjFWMjAuMjIxYzAtMS4yMjguOTkzLTIuMjIxIDIuMjIxLTIuMjIxaDkuNTU4eiIvPjxwYXRoIGQ9Ik02MCAzNmMxLjIyOCAwIDIuMjIxLjk5MyAyLjIyMSAyLjIyMXYxNS41NThjMCAxLjIyOC0uOTkzIDIuMjIxLTIuMjIxIDIuMjIxaC05LjU1OGMtMS4yMjggMC0yLjIyMS0uOTkzLTIuMjIxLTIuMjIxVjM4LjIyMWMwLTEuMjI4Ljk5My0yLjIyMSAyLjIyMS0yLjIyMWg5LjU1OHoiLz48L2c+PC9nPjwvc3ZnPg==')] bg-repeat"></div>
                  <h3 className="text-xl font-bold z-10 relative">{item.school.name}</h3>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <h4 className={cn("text-lg font-medium mb-4 flex items-center gap-2", textColor[colorIndex])}>
                      Acceptance Rate
                    </h4>
                    <div className={cn("text-xl font-semibold text-center", textColor[colorIndex])}>
                      {item.school.acceptance_rate || "N/A"}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className={cn("text-lg font-medium mb-4 flex items-center gap-2", textColor[colorIndex])}>
                      Application Fee
                    </h4>
                    {item.school.application_fee ? (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-white/70">Undergraduate (Local):</span>
                          <span className="text-sm font-medium">
                            ${item.school.application_fee.undergraduate?.local_students || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-white/70">Undergraduate (International):</span>
                          <span className="text-sm font-medium">
                            ${item.school.application_fee.undergraduate?.international_students || "N/A"}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-white/50 text-center">Information not available</div>
                    )}
                  </div>
                  
                  <div>
                    <h4 className={cn("text-lg font-medium mb-4 flex items-center gap-2", textColor[colorIndex])}>
                      Application Deadlines
                    </h4>
                    {item.school.admission_deadlines ? (
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm font-medium">Fall Semester</div>
                          <div className="flex justify-between">
                            <span className="text-xs text-white/70">Local:</span>
                            <span className="text-xs">
                              {item.school.admission_deadlines.fall?.local_students || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-white/70">International:</span>
                            <span className="text-xs">
                              {item.school.admission_deadlines.fall?.international_students || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-white/50 text-center">Information not available</div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {hasExtraUniversities && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-4 rounded-lg flex items-center gap-3 max-w-2xl mx-auto"
        >
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0" />
          <p className="text-sm text-amber-800 dark:text-amber-400">
            Showing only 2 universities for optimal comparison. 
            {data.length - 2 === 1 
              ? "1 additional university" 
              : `${data.length - 2} additional universities`} not displayed.
          </p>
        </motion.div>
      )}
    </>
  );

  const renderStudentLifeTab = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {limitedData.map((item, index) => {
          // Define colors based on index
          const colorIndex = index % 2;
          const bgGradient = [
            'bg-gradient-to-br from-[#4A148C]/90 to-[#7B1FA2]/80',
            'bg-gradient-to-br from-[#0D47A1]/90 to-[#1976D2]/80',
          ];
          const textColor = [
            'text-[#E1BEE7]',
            'text-[#BBDEFB]',
          ];
          
          return (
            <motion.div
              key={item.school.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <div className="rounded-lg border-0 shadow-xl bg-gradient-to-br from-gray-900/95 to-gray-800/95 text-white overflow-hidden h-full">
                <div className={cn(
                  "p-6 relative",
                  bgGradient[colorIndex]
                )}>
                  <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjEiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIyOCAwIDIuMjIxLjk5MyAyLjIyMSAyLjIyMXYxNS41NThjMCAxLjIyOC0uOTkzIDIuMjIxLTIuMjIxIDIuMjIxaC05LjU1OGMtMS4yMjggMC0yLjIyMS0uOTkzLTIuMjIxLTIuMjIxVjIwLjIyMWMwLTEuMjI4Ljk5My0yLjIyMSAyLjIyMS0yLjIyMWg5LjU1OHoiLz48cGF0aCBkPSJNMzAgMGMxLjIyOCAwIDIuMjIxLjk5MyAyLjIyMSAyLjIyMXYxNS41NThjMCAxLjIyOC0uOTkzIDIuMjIxLTIuMjIxIDIuMjIxaC05LjU1OGMtMS4yMjggMC0yLjIyMS0uOTkzLTIuMjIxLTIuMjIxVjIuMjIxQzE4LjIyMS45OTMgMTkuMjE0IDAgMjAuNDQyIDBoOS41NTh6Ii8+PHBhdGggZD0iTTEyIDE4YzEuMjI4IDAgMi4yMjEuOTkzIDIuMjIxIDIuMjIxdjE1LjU1OGMwIDEuMjI4LS45OTMgMi4yMjEtMi4yMjEgMi4yMjFIMi40NDJDMS4yMTQgMzggLjIyMSAzNy4wMDcuMjIxIDM1Ljc3OVYyMC4yMjFjMC0xLjIyOC45OTMtMi4yMjEgMi4yMjEtMi4yMjFIMTJ6Ii8+PHBhdGggZD0iTTU0IDBjMS4yMjggMCAyLjIyMS45OTMgMi4yMjEgMi4yMjF2MTUuNTU4YzAgMS4yMjgtLjk5MyAyLjIyMS0yLjIyMSAyLjIyMWgtOS41NThjLTEuMjI4IDAgLTIuMjIxLS45OTMtMi4yMjEtMi4yMjFWMi4yMjFDNDIuMjIxLjk5MyA0My4yMTQgMCA0NC40NDIgMGg5LjU1OHoiLz48cGF0aCBkPSJNMTIgMzZjMS4yMjggMCAyLjIyMS45OTMgMi4yMjEgMi4yMjF2MTUuNTU4YzAgMS4yMjgtLjk5MyAyLjIyMS0yLjIyMSAyLjIyMUgyLjQ0MkMxLjIxNCA1NiAuMjIxIDU1LjAwNy4yMjEgNTMuNzc5VjM4LjIyMWMwLTEuMjI4Ljk5My0yLjIyMSAyLjIyMS0yLjIyMUgxMnoiLz48cGF0aCBkPSJNMzYgMzZjMS4yMjggMCAyLjIyMS45OTMgMi4yMjEgMi4yMjF2MTUuNTU4YzAgMS4yMjgtLjk5MyAyLjIyMS0yLjIyMSAyLjIyMWgtOS41NThjLTEuMjI4IDAtMi4yMjEtLjk5My0yLjIyMS0yLjIyMVYzOC4yMjFjMC0xLjIyOC45OTMtMi4yMjEgMi4yMjEtMi4yMjFoOS41NTh6Ii8+PHBhdGggZD0iTTYwIDE4YzEuMjI4IDAgMi4yMjEuOTkzIDIuMjIxIDIuMjIxdjE1LjU1OGMwIDEuMjI4LS45OTMgMi4yMjEtMi4yMjEgMi4yMjFoLTkuNTU4Yy0xLjIyOCAwLTIuMjIxLS45OTMtMi4yMjEtMi4yMjFWMjAuMjIxYzAtMS4yMjguOTkzLTIuMjIxIDIuMjIxLTIuMjIxaDkuNTU4eiIvPjxwYXRoIGQ9Ik02MCAzNmMxLjIyOCAwIDIuMjIxLjk5MyAyLjIyMSAyLjIyMXYxNS41NThjMCAxLjIyOC0uOTkzIDIuMjIxLTIuMjIxIDIuMjIxaC05LjU1OGMtMS4yMjggMC0yLjIyMS0uOTkzLTIuMjIxLTIuMjIxVjM4LjIyMWMwLTEuMjI4Ljk5My0yLjIyMSAyLjIyMS0yLjIyMWg5LjU1OHoiLz48L2c+PC9nPjwvc3ZnPg==')] bg-repeat"></div>
                  <h3 className="text-xl font-bold z-10 relative">{item.school.name}</h3>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <h4 className={cn("text-lg font-medium mb-4 flex items-center gap-2", textColor[colorIndex])}>
                      Student Demographics
                    </h4>
                    {item.school.students ? (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-white/70">Total Students:</span>
                          <span className="text-sm font-medium">{item.school.students.total_students || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-white/70">Graduate Students:</span>
                          <span className="text-sm font-medium">{item.school.students.grad_students || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-white/70">Gender Ratio:</span>
                          <span className="text-sm font-medium">
                            {item.school.students.men || "N/A"} men / {item.school.students.women || "N/A"} women
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-white/50 text-center">Information not available</div>
                    )}
                  </div>
                  
                  <div>
                    <h4 className={cn("text-lg font-medium mb-4 flex items-center gap-2", textColor[colorIndex])}>
                      Part-time Opportunities
                    </h4>
                    {item.school.part_time_opportunities ? (
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm font-medium">On-campus Jobs</div>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {item.school.part_time_opportunities.on_campus_jobs?.slice(0, 2).map((job, idx) => (
                              <span key={idx} className="text-xs py-1 px-3 rounded-full bg-white/5 border border-white/10">
                                {job}
                              </span>
                            ))}
                            {item.school.part_time_opportunities.on_campus_jobs?.length > 2 && (
                              <span className="text-xs text-white/70">
                                +{item.school.part_time_opportunities.on_campus_jobs.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-white/50 text-center">Information not available</div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {hasExtraUniversities && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-4 rounded-lg flex items-center gap-3 max-w-2xl mx-auto"
        >
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0" />
          <p className="text-sm text-amber-800 dark:text-amber-400">
            Showing only 2 universities for optimal comparison. 
            {data.length - 2 === 1 
              ? "1 additional university" 
              : `${data.length - 2} additional universities`} not displayed.
          </p>
        </motion.div>
      )}
    </>
  );

  // Render content based on selected tab
  const renderTabContent = () => {
    switch (tabValue) {
      case "overview":
        return renderOverviewTab();
      case "academics":
        return renderAcademicsTab();
      case "admissions":
        return renderAdmissionsTab();
      case "student-life":
        return renderStudentLifeTab();
      default:
        return renderOverviewTab();
    }
  };

  return renderTabContent();
};

export default ComparisonTabContent;
