
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

  const renderOverviewTab = () => (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {data.map((item, index) => (
        <ComparisonCard 
          key={item.school.name} 
          university={item} 
          index={index}
          onViewDetails={onViewDetails}
        />
      ))}
    </motion.div>
  );

  const renderAcademicsTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {data.map((item, index) => {
        // Define colors based on index
        const colorIndex = index % 3;
        const bgGradient = [
          'from-uniquestPurple/10 to-transparent',
          'from-primary/10 to-transparent',
          'from-[#0ea5e9]/10 to-transparent'
        ];
        const textColor = [
          'text-uniquestPurple',
          'text-primary',
          'text-[#0ea5e9]'
        ];
        
        return (
          <motion.div
            key={item.school.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
          >
            <div className={cn(
              "rounded-lg border shadow-sm overflow-hidden h-full",
              "bg-card text-card-foreground"
            )}>
              <div className={cn(
                "bg-gradient-to-r p-6",
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
                        "text-sm py-1 px-2 rounded",
                        `bg-${colorIndex === 0 ? 'uniquestPurple' : colorIndex === 1 ? 'primary' : '[#0ea5e9]'}/5`
                      )}>
                        {program}
                      </div>
                    ))}
                    {item.school.school_programs?.length > 5 && (
                      <div className="text-sm text-muted-foreground">
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
                      <span className="text-sm">Undergraduate:</span>
                      <span className="text-sm font-medium">4 years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Graduate:</span>
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
  );

  const renderAdmissionsTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {data.map((item, index) => {
        // Define colors based on index
        const colorIndex = index % 3;
        const bgGradient = [
          'from-uniquestPurple/10 to-transparent',
          'from-primary/10 to-transparent',
          'from-[#0ea5e9]/10 to-transparent'
        ];
        const textColor = [
          'text-uniquestPurple',
          'text-primary',
          'text-[#0ea5e9]'
        ];
        
        return (
          <motion.div
            key={item.school.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
          >
            <div className={cn(
              "rounded-lg border shadow-sm overflow-hidden h-full",
              "bg-card text-card-foreground"
            )}>
              <div className={cn(
                "bg-gradient-to-r p-6",
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
                        <span className="text-sm">Undergraduate (Local):</span>
                        <span className="text-sm font-medium">
                          ${item.school.application_fee.undergraduate?.local_students || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Undergraduate (International):</span>
                        <span className="text-sm font-medium">
                          ${item.school.application_fee.undergraduate?.international_students || "N/A"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground text-center">Information not available</div>
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
                          <span className="text-xs text-muted-foreground">Local:</span>
                          <span className="text-xs">
                            {item.school.admission_deadlines.fall?.local_students || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">International:</span>
                          <span className="text-xs">
                            {item.school.admission_deadlines.fall?.international_students || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground text-center">Information not available</div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  const renderStudentLifeTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {data.map((item, index) => {
        // Define colors based on index
        const colorIndex = index % 3;
        const bgGradient = [
          'from-uniquestPurple/10 to-transparent',
          'from-primary/10 to-transparent',
          'from-[#0ea5e9]/10 to-transparent'
        ];
        const textColor = [
          'text-uniquestPurple',
          'text-primary',
          'text-[#0ea5e9]'
        ];
        
        return (
          <motion.div
            key={item.school.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
          >
            <div className={cn(
              "rounded-lg border shadow-sm overflow-hidden h-full",
              "bg-card text-card-foreground"
            )}>
              <div className={cn(
                "bg-gradient-to-r p-6",
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
                        <span className="text-sm">Total Students:</span>
                        <span className="text-sm font-medium">{item.school.students.total_students || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Graduate Students:</span>
                        <span className="text-sm font-medium">{item.school.students.grad_students || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Gender Ratio:</span>
                        <span className="text-sm font-medium">
                          {item.school.students.men || "N/A"} men / {item.school.students.women || "N/A"} women
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground text-center">Information not available</div>
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
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.school.part_time_opportunities.on_campus_jobs?.slice(0, 2).map((job, idx) => (
                            <span key={idx} className={cn(
                              "text-xs py-1 px-2 rounded",
                              `bg-${colorIndex === 0 ? 'uniquestPurple' : colorIndex === 1 ? 'primary' : '[#0ea5e9]'}/5`
                            )}>
                              {job}
                            </span>
                          ))}
                          {item.school.part_time_opportunities.on_campus_jobs?.length > 2 && (
                            <span className="text-xs text-muted-foreground">
                              +{item.school.part_time_opportunities.on_campus_jobs.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Internships</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.school.part_time_opportunities.internships?.slice(0, 2).map((job, idx) => (
                            <span key={idx} className={cn(
                              "text-xs py-1 px-2 rounded",
                              `bg-${colorIndex === 0 ? 'uniquestPurple' : colorIndex === 1 ? 'primary' : '[#0ea5e9]'}/5`
                            )}>
                              {job}
                            </span>
                          ))}
                          {item.school.part_time_opportunities.internships?.length > 2 && (
                            <span className="text-xs text-muted-foreground">
                              +{item.school.part_time_opportunities.internships.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground text-center">Information not available</div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
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
