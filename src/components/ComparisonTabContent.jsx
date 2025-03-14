
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import ComparisonCard from './ComparisonCard';

const ComparisonTabContent = ({ data, tabValue, onViewDetails }) => {
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

  // Custom function to chunk array into pairs for 2-column layout
  const chunkArray = (arr, size) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  };

  // Group universities into pairs - always display 2 per row
  const universityPairs = chunkArray(data, 2);

  const renderOverviewTab = () => (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {universityPairs.map((pair, rowIndex) => (
        <div 
          key={`row-${rowIndex}`} 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {pair.map((item, index) => (
            <ComparisonCard 
              key={item.school.name} 
              university={item} 
              index={rowIndex * 2 + index}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      ))}
    </motion.div>
  );

  const renderAcademicsTab = () => (
    <div className="space-y-8">
      {universityPairs.map((pair, rowIndex) => (
        <div 
          key={`academics-row-${rowIndex}`} 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {pair.map((item, index) => {
            // Define colors based on index - updated with more vibrant colors for dark mode
            const colorIndex = (rowIndex * 2 + index) % 4;
            const bgGradient = [
              'from-uniquestPurple/20 to-transparent',
              'from-[#0ea5e9]/20 to-transparent',
              'from-[#f97316]/20 to-transparent',
              'from-[#8b5cf6]/20 to-transparent'
            ];
            const textColor = [
              'text-uniquestPurple-light',
              'text-[#38bdf8]',
              'text-[#fb923c]',
              'text-[#a78bfa]'
            ];
            
            return (
              <motion.div
                key={item.school.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (rowIndex * 2 + index) * 0.15 }}
              >
                <div className={cn(
                  "rounded-lg border shadow-lg overflow-hidden h-full",
                  "bg-slate-900/90 border-slate-700/30 text-white/90 backdrop-blur-lg"
                )}>
                  <div className={cn(
                    "bg-gradient-to-r p-6 border-b border-slate-700/30",
                    bgGradient[colorIndex]
                  )}>
                    <h3 className="text-xl font-semibold">{item.school.name}</h3>
                  </div>
                  <div className="p-6 space-y-6">
                    <div>
                      <h4 className={cn("text-lg font-medium mb-4 flex items-center gap-2", textColor[colorIndex])}>
                        Programs
                      </h4>
                      <div className="space-y-2">
                        {item.school.school_programs?.slice(0, 5).map((program, idx) => (
                          <div key={idx} className={cn(
                            "text-sm py-1.5 px-3 rounded-full",
                            colorIndex === 0 ? "bg-uniquestPurple/20 text-uniquestPurple-light" :
                            colorIndex === 1 ? "bg-[#0ea5e9]/20 text-[#38bdf8]" :
                            colorIndex === 2 ? "bg-[#f97316]/20 text-[#fb923c]" :
                            "bg-[#8b5cf6]/20 text-[#a78bfa]"
                          )}>
                            {program}
                          </div>
                        ))}
                        {item.school.school_programs?.length > 5 && (
                          <div className="text-sm text-white/60">
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
                        <div className="flex justify-between items-center p-2 rounded-lg bg-slate-800/50">
                          <span className="text-sm text-white/80">Undergraduate:</span>
                          <span className={cn("text-sm font-medium px-2 py-1 rounded-md", 
                            colorIndex === 0 ? "bg-uniquestPurple/20 text-uniquestPurple-light" :
                            colorIndex === 1 ? "bg-[#0ea5e9]/20 text-[#38bdf8]" :
                            colorIndex === 2 ? "bg-[#f97316]/20 text-[#fb923c]" :
                            "bg-[#8b5cf6]/20 text-[#a78bfa]"
                          )}>4 years</span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded-lg bg-slate-800/50">
                          <span className="text-sm text-white/80">Graduate:</span>
                          <span className={cn("text-sm font-medium px-2 py-1 rounded-md", 
                            colorIndex === 0 ? "bg-uniquestPurple/20 text-uniquestPurple-light" :
                            colorIndex === 1 ? "bg-[#0ea5e9]/20 text-[#38bdf8]" :
                            colorIndex === 2 ? "bg-[#f97316]/20 text-[#fb923c]" :
                            "bg-[#8b5cf6]/20 text-[#a78bfa]"
                          )}>2 years</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className={cn("text-lg font-medium mb-4 flex items-center gap-2", textColor[colorIndex])}>
                        Graduation Rate
                      </h4>
                      <div className={cn(
                        "text-xl font-semibold text-center py-3 px-4 rounded-lg", 
                        colorIndex === 0 ? "bg-uniquestPurple/20 text-uniquestPurple-light" :
                        colorIndex === 1 ? "bg-[#0ea5e9]/20 text-[#38bdf8]" :
                        colorIndex === 2 ? "bg-[#f97316]/20 text-[#fb923c]" :
                        "bg-[#8b5cf6]/20 text-[#a78bfa]"
                      )}>
                        {item.school.graduation_rate || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ))}
    </div>
  );

  const renderAdmissionsTab = () => (
    <div className="space-y-8">
      {universityPairs.map((pair, rowIndex) => (
        <div 
          key={`admissions-row-${rowIndex}`} 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {pair.map((item, index) => {
            // Define colors based on index for dark theme
            const colorIndex = (rowIndex * 2 + index) % 4;
            const bgGradient = [
              'from-uniquestPurple/20 to-transparent',
              'from-[#0ea5e9]/20 to-transparent',
              'from-[#f97316]/20 to-transparent',
              'from-[#8b5cf6]/20 to-transparent'
            ];
            const textColor = [
              'text-uniquestPurple-light',
              'text-[#38bdf8]',
              'text-[#fb923c]',
              'text-[#a78bfa]'
            ];
            
            return (
              <motion.div
                key={item.school.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (rowIndex * 2 + index) * 0.15 }}
              >
                <div className={cn(
                  "rounded-lg border shadow-lg overflow-hidden h-full",
                  "bg-slate-900/90 border-slate-700/30 text-white/90 backdrop-blur-lg"
                )}>
                  <div className={cn(
                    "bg-gradient-to-r p-6 border-b border-slate-700/30",
                    bgGradient[colorIndex]
                  )}>
                    <h3 className="text-xl font-semibold">{item.school.name}</h3>
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
                            <span className="text-sm text-white/80">Undergraduate (Local):</span>
                            <span className="text-sm font-medium text-white">
                              ${item.school.application_fee.undergraduate?.local_students || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-white/80">Undergraduate (International):</span>
                            <span className="text-sm font-medium text-white">
                              ${item.school.application_fee.undergraduate?.international_students || "N/A"}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-white/60 text-center">Information not available</div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className={cn("text-lg font-medium mb-4 flex items-center gap-2", textColor[colorIndex])}>
                        Application Deadlines
                      </h4>
                      {item.school.admission_deadlines ? (
                        <div className="space-y-3">
                          <div>
                            <div className="text-sm font-medium text-white">Fall Semester</div>
                            <div className="flex justify-between">
                              <span className="text-xs text-white/60">Local:</span>
                              <span className="text-xs text-white">
                                {item.school.admission_deadlines.fall?.local_students || "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs text-white/60">International:</span>
                              <span className="text-xs text-white">
                                {item.school.admission_deadlines.fall?.international_students || "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-white/60 text-center">Information not available</div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ))}
    </div>
  );

  const renderStudentLifeTab = () => (
    <div className="space-y-8">
      {universityPairs.map((pair, rowIndex) => (
        <div 
          key={`student-life-row-${rowIndex}`} 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {pair.map((item, index) => {
            // Define colors based on index for dark theme
            const colorIndex = (rowIndex * 2 + index) % 4;
            const bgGradient = [
              'from-uniquestPurple/20 to-transparent',
              'from-[#0ea5e9]/20 to-transparent',
              'from-[#f97316]/20 to-transparent',
              'from-[#8b5cf6]/20 to-transparent'
            ];
            const textColor = [
              'text-uniquestPurple-light',
              'text-[#38bdf8]',
              'text-[#fb923c]',
              'text-[#a78bfa]'
            ];
            
            return (
              <motion.div
                key={item.school.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (rowIndex * 2 + index) * 0.15 }}
              >
                <div className={cn(
                  "rounded-lg border shadow-lg overflow-hidden h-full",
                  "bg-slate-900/90 border-slate-700/30 text-white/90 backdrop-blur-lg"
                )}>
                  <div className={cn(
                    "bg-gradient-to-r p-6 border-b border-slate-700/30",
                    bgGradient[colorIndex]
                  )}>
                    <h3 className="text-xl font-semibold">{item.school.name}</h3>
                  </div>
                  <div className="p-6 space-y-6">
                    <div>
                      <h4 className={cn("text-lg font-medium mb-4 flex items-center gap-2", textColor[colorIndex])}>
                        Student Demographics
                      </h4>
                      {item.school.students ? (
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-white/80">Total Students:</span>
                            <span className="text-sm font-medium text-white">{item.school.students.total_students || "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-white/80">Graduate Students:</span>
                            <span className="text-sm font-medium text-white">{item.school.students.grad_students || "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-white/80">Gender Ratio:</span>
                            <span className="text-sm font-medium text-white">
                              {item.school.students.men || "N/A"} men / {item.school.students.women || "N/A"} women
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-white/60 text-center">Information not available</div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className={cn("text-lg font-medium mb-4 flex items-center gap-2", textColor[colorIndex])}>
                        Part-time Opportunities
                      </h4>
                      {item.school.part_time_opportunities ? (
                        <div className="space-y-3">
                          <div>
                            <div className="text-sm font-medium text-white">On-campus Jobs</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.school.part_time_opportunities.on_campus_jobs?.slice(0, 2).map((job, idx) => (
                                <span key={idx} className={cn(
                                  "text-xs py-1 px-2 rounded",
                                  colorIndex === 0 ? "bg-uniquestPurple/20 text-uniquestPurple-light" :
                                  colorIndex === 1 ? "bg-[#0ea5e9]/20 text-[#38bdf8]" :
                                  colorIndex === 2 ? "bg-[#f97316]/20 text-[#fb923c]" :
                                  "bg-[#8b5cf6]/20 text-[#a78bfa]"
                                )}>
                                  {job}
                                </span>
                              ))}
                              {item.school.part_time_opportunities.on_campus_jobs?.length > 2 && (
                                <span className="text-xs text-white/60">
                                  +{item.school.part_time_opportunities.on_campus_jobs.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">Internships</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.school.part_time_opportunities.internships?.slice(0, 2).map((job, idx) => (
                                <span key={idx} className={cn(
                                  "text-xs py-1 px-2 rounded",
                                  colorIndex === 0 ? "bg-uniquestPurple/20 text-uniquestPurple-light" :
                                  colorIndex === 1 ? "bg-[#0ea5e9]/20 text-[#38bdf8]" :
                                  colorIndex === 2 ? "bg-[#f97316]/20 text-[#fb923c]" :
                                  "bg-[#8b5cf6]/20 text-[#a78bfa]"
                                )}>
                                  {job}
                                </span>
                              ))}
                              {item.school.part_time_opportunities.internships?.length > 2 && (
                                <span className="text-xs text-white/60">
                                  +{item.school.part_time_opportunities.internships.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-white/60 text-center">Information not available</div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ))}
    </div>
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
