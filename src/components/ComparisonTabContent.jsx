
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import ComparisonCard from './ComparisonCard';
import { Building2, BookOpen, Award, Users, Percent, DollarSign, Calendar, Briefcase, GraduationCap } from 'lucide-react';

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
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
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
    <div className="space-y-12">
      {universityPairs.map((pair, rowIndex) => (
        <div 
          key={`academics-row-${rowIndex}`} 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {pair.map((item, index) => {
            // Define colors based on index
            const colorIndex = (rowIndex * 2 + index) % 4;
            const colors = [
              { bg: 'from-indigo-500/20 to-indigo-400/5', text: 'text-indigo-300', border: 'border-indigo-500/20', icon: 'text-indigo-400' },
              { bg: 'from-blue-500/20 to-blue-400/5', text: 'text-blue-300', border: 'border-blue-500/20', icon: 'text-blue-400' },
              { bg: 'from-violet-500/20 to-violet-400/5', text: 'text-violet-300', border: 'border-violet-500/20', icon: 'text-violet-400' },
              { bg: 'from-purple-500/20 to-purple-400/5', text: 'text-purple-300', border: 'border-purple-500/20', icon: 'text-purple-400' }
            ];
            
            return (
              <motion.div
                key={item.school.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (rowIndex * 2 + index) * 0.15 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 to-indigo-400/5 rounded-2xl blur-xl group-hover:opacity-75 transition duration-200 opacity-0"></div>
                <div className={cn(
                  "relative rounded-2xl border shadow-lg overflow-hidden h-full backdrop-blur-md",
                  "bg-indigo-950/40 border-indigo-500/20 text-white/90"
                )}>
                  <div className={cn(
                    "bg-gradient-to-r p-6 border-b",
                    `${colors[colorIndex].bg} ${colors[colorIndex].border}`
                  )}>
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-full", colors[colorIndex].bg)}>
                        <BookOpen className={cn("h-5 w-5", colors[colorIndex].icon)} />
                      </div>
                      <h3 className="text-xl font-semibold">{item.school.name}</h3>
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    <div>
                      <h4 className={cn("text-lg font-medium mb-4 flex items-center gap-2", colors[colorIndex].text)}>
                        <Award className="h-4 w-4" />
                        Programs
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {item.school.school_programs?.slice(0, 5).map((program, idx) => (
                          <div key={idx} className={cn(
                            "text-xs py-1.5 px-3 rounded-full",
                            `bg-gradient-to-r ${colors[colorIndex].bg} ${colors[colorIndex].text}`
                          )}>
                            {program}
                          </div>
                        ))}
                        {item.school.school_programs?.length > 5 && (
                          <div className="text-xs text-white/60 flex items-center">
                            +{item.school.school_programs.length - 5} more
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className={cn("text-lg font-medium mb-4 flex items-center gap-2", colors[colorIndex].text)}>
                        <Calendar className="h-4 w-4" />
                        Program Duration
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                          <span className="text-sm text-white/80">Undergraduate:</span>
                          <span className={cn("text-sm font-medium px-3 py-1.5 rounded-lg", 
                            `bg-gradient-to-r ${colors[colorIndex].bg} ${colors[colorIndex].text}`
                          )}>4 years</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                          <span className="text-sm text-white/80">Graduate:</span>
                          <span className={cn("text-sm font-medium px-3 py-1.5 rounded-lg", 
                            `bg-gradient-to-r ${colors[colorIndex].bg} ${colors[colorIndex].text}`
                          )}>2 years</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className={cn("text-lg font-medium mb-4 flex items-center gap-2", colors[colorIndex].text)}>
                        <GraduationCap className="h-4 w-4" />
                        Graduation Rate
                      </h4>
                      <div className={cn(
                        "text-xl font-semibold text-center py-4 px-4 rounded-xl border", 
                        `bg-gradient-to-r ${colors[colorIndex].bg} ${colors[colorIndex].text} ${colors[colorIndex].border}`
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
    <div className="space-y-12">
      {universityPairs.map((pair, rowIndex) => (
        <div 
          key={`admissions-row-${rowIndex}`} 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {pair.map((item, index) => {
            // Define colors based on index
            const colorIndex = (rowIndex * 2 + index) % 4;
            const colors = [
              { bg: 'from-indigo-500/20 to-indigo-400/5', text: 'text-indigo-300', border: 'border-indigo-500/20', icon: 'text-indigo-400' },
              { bg: 'from-blue-500/20 to-blue-400/5', text: 'text-blue-300', border: 'border-blue-500/20', icon: 'text-blue-400' },
              { bg: 'from-violet-500/20 to-violet-400/5', text: 'text-violet-300', border: 'border-violet-500/20', icon: 'text-violet-400' },
              { bg: 'from-purple-500/20 to-purple-400/5', text: 'text-purple-300', border: 'border-purple-500/20', icon: 'text-purple-400' }
            ];
            
            return (
              <motion.div
                key={item.school.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (rowIndex * 2 + index) * 0.15 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 to-indigo-400/5 rounded-2xl blur-xl group-hover:opacity-75 transition duration-200 opacity-0"></div>
                <div className={cn(
                  "relative rounded-2xl border shadow-lg overflow-hidden h-full backdrop-blur-md",
                  "bg-indigo-950/40 border-indigo-500/20 text-white/90"
                )}>
                  <div className={cn(
                    "bg-gradient-to-r p-6 border-b",
                    `${colors[colorIndex].bg} ${colors[colorIndex].border}`
                  )}>
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-full", colors[colorIndex].bg)}>
                        <GraduationCap className={cn("h-5 w-5", colors[colorIndex].icon)} />
                      </div>
                      <h3 className="text-xl font-semibold">{item.school.name}</h3>
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    <div>
                      <h4 className={cn("text-lg font-medium mb-4 flex items-center gap-2", colors[colorIndex].text)}>
                        <Percent className="h-4 w-4" />
                        Acceptance Rate
                      </h4>
                      <div className={cn("text-xl font-semibold text-center py-4 px-4 rounded-xl border", 
                        `bg-gradient-to-r ${colors[colorIndex].bg} ${colors[colorIndex].text} ${colors[colorIndex].border}`
                      )}>
                        {item.school.acceptance_rate || "N/A"}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className={cn("text-lg font-medium mb-4 flex items-center gap-2", colors[colorIndex].text)}>
                        <DollarSign className="h-4 w-4" />
                        Application Fee
                      </h4>
                      {item.school.application_fee ? (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                            <span className="text-sm text-white/80">Undergraduate (Local):</span>
                            <span className="text-sm font-medium text-white">
                              ${item.school.application_fee.undergraduate?.local_students || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                            <span className="text-sm text-white/80">Undergraduate (International):</span>
                            <span className="text-sm font-medium text-white">
                              ${item.school.application_fee.undergraduate?.international_students || "N/A"}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-white/60 text-center p-3 border border-white/10 rounded-xl">Information not available</div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className={cn("text-lg font-medium mb-4 flex items-center gap-2", colors[colorIndex].text)}>
                        <Calendar className="h-4 w-4" />
                        Application Deadlines
                      </h4>
                      {item.school.admission_deadlines ? (
                        <div className="space-y-3 p-4 border border-white/10 rounded-xl bg-white/5">
                          <div>
                            <div className="text-sm font-medium text-white flex items-center gap-2">
                              <div className={cn("h-2 w-2 rounded-full", colors[colorIndex].text)} />
                              Fall Semester
                            </div>
                            <div className="ml-4 mt-2 space-y-1">
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
                        </div>
                      ) : (
                        <div className="text-sm text-white/60 text-center p-3 border border-white/10 rounded-xl">Information not available</div>
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
    <div className="space-y-12">
      {universityPairs.map((pair, rowIndex) => (
        <div 
          key={`student-life-row-${rowIndex}`} 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {pair.map((item, index) => {
            // Define colors based on index
            const colorIndex = (rowIndex * 2 + index) % 4;
            const colors = [
              { bg: 'from-indigo-500/20 to-indigo-400/5', text: 'text-indigo-300', border: 'border-indigo-500/20', icon: 'text-indigo-400' },
              { bg: 'from-blue-500/20 to-blue-400/5', text: 'text-blue-300', border: 'border-blue-500/20', icon: 'text-blue-400' },
              { bg: 'from-violet-500/20 to-violet-400/5', text: 'text-violet-300', border: 'border-violet-500/20', icon: 'text-violet-400' },
              { bg: 'from-purple-500/20 to-purple-400/5', text: 'text-purple-300', border: 'border-purple-500/20', icon: 'text-purple-400' }
            ];
            
            return (
              <motion.div
                key={item.school.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (rowIndex * 2 + index) * 0.15 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 to-indigo-400/5 rounded-2xl blur-xl group-hover:opacity-75 transition duration-200 opacity-0"></div>
                <div className={cn(
                  "relative rounded-2xl border shadow-lg overflow-hidden h-full backdrop-blur-md",
                  "bg-indigo-950/40 border-indigo-500/20 text-white/90"
                )}>
                  <div className={cn(
                    "bg-gradient-to-r p-6 border-b",
                    `${colors[colorIndex].bg} ${colors[colorIndex].border}`
                  )}>
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-full", colors[colorIndex].bg)}>
                        <Users className={cn("h-5 w-5", colors[colorIndex].icon)} />
                      </div>
                      <h3 className="text-xl font-semibold">{item.school.name}</h3>
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    <div>
                      <h4 className={cn("text-lg font-medium mb-4 flex items-center gap-2", colors[colorIndex].text)}>
                        <Users className="h-4 w-4" />
                        Student Demographics
                      </h4>
                      {item.school.students ? (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                            <span className="text-sm text-white/80">Total Students:</span>
                            <span className={cn("text-sm font-medium px-3 py-1 rounded-lg", 
                              `bg-gradient-to-r ${colors[colorIndex].bg}`
                            )}>
                              {item.school.students.total_students || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                            <span className="text-sm text-white/80">Graduate Students:</span>
                            <span className={cn("text-sm font-medium px-3 py-1 rounded-lg", 
                              `bg-gradient-to-r ${colors[colorIndex].bg}`
                            )}>
                              {item.school.students.grad_students || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                            <span className="text-sm text-white/80">Gender Ratio:</span>
                            <span className="text-sm font-medium text-white">
                              {item.school.students.men || "N/A"} men / {item.school.students.women || "N/A"} women
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-white/60 text-center p-3 border border-white/10 rounded-xl">Information not available</div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className={cn("text-lg font-medium mb-4 flex items-center gap-2", colors[colorIndex].text)}>
                        <Briefcase className="h-4 w-4" />
                        Part-time Opportunities
                      </h4>
                      {item.school.part_time_opportunities ? (
                        <div className="space-y-4 p-4 border border-white/10 rounded-xl bg-white/5">
                          <div>
                            <div className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                              <div className={cn("h-2 w-2 rounded-full", colors[colorIndex].text)} />
                              On-campus Jobs
                            </div>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {item.school.part_time_opportunities.on_campus_jobs?.slice(0, 2).map((job, idx) => (
                                <span key={idx} className={cn(
                                  "text-xs py-1.5 px-3 rounded-full",
                                  `bg-gradient-to-r ${colors[colorIndex].bg} ${colors[colorIndex].text}`
                                )}>
                                  {job}
                                </span>
                              ))}
                              {item.school.part_time_opportunities.on_campus_jobs?.length > 2 && (
                                <span className="text-xs text-white/60 flex items-center">
                                  +{item.school.part_time_opportunities.on_campus_jobs.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                              <div className={cn("h-2 w-2 rounded-full", colors[colorIndex].text)} />
                              Internships
                            </div>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {item.school.part_time_opportunities.internships?.slice(0, 2).map((job, idx) => (
                                <span key={idx} className={cn(
                                  "text-xs py-1.5 px-3 rounded-full",
                                  `bg-gradient-to-r ${colors[colorIndex].bg} ${colors[colorIndex].text}`
                                )}>
                                  {job}
                                </span>
                              ))}
                              {item.school.part_time_opportunities.internships?.length > 2 && (
                                <span className="text-xs text-white/60 flex items-center">
                                  +{item.school.part_time_opportunities.internships.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-white/60 text-center p-3 border border-white/10 rounded-xl">Information not available</div>
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
