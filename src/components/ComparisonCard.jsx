
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, MapPin, School, GraduationCap, 
  Users, Calendar, Award, GlobeIcon, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const ComparisonCard = ({ university, index, onViewDetails }) => {
  const navigate = useNavigate();
  
  // Animation values
  const delay = index * 0.15;
  
  // Dark gradient backgrounds
  const headerColors = [
    'bg-gradient-to-br from-[#4A148C]/90 to-[#7B1FA2]/80',
    'bg-gradient-to-br from-[#0D47A1]/90 to-[#1976D2]/80',
  ];
  
  // Accent colors
  const accentColors = [
    'text-[#E1BEE7]',
    'text-[#BBDEFB]',
  ];
  
  const buttonGradients = [
    'bg-gradient-to-r from-[#BA68C8] to-[#9C27B0] hover:from-[#9C27B0] hover:to-[#7B1FA2]',
    'bg-gradient-to-r from-[#64B5F6] to-[#2196F3] hover:from-[#2196F3] hover:to-[#1976D2]',
  ];
  
  const colorIndex = index % 2;
  
  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(university.school.name);
    }
  };

  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 py-2">
      <div className={cn("rounded-full p-1.5 bg-white/10", accentColors[colorIndex])}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-white/70 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-white line-clamp-1">{value || "N/A"}</p>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="h-full flex-1"
    >
      <Card className="h-full overflow-hidden border-0 shadow-xl bg-gradient-to-br from-gray-900/95 to-gray-800/95 text-white">
        <CardHeader className={cn(
          "px-6 py-7 relative overflow-hidden", 
          headerColors[colorIndex]
        )}>
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjEiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIyOCAwIDIuMjIxLjk5MyAyLjIyMSAyLjIyMXYxNS41NThjMCAxLjIyOC0uOTkzIDIuMjIxLTIuMjIxIDIuMjIxaC05LjU1OGMtMS4yMjggMC0yLjIyMS0uOTkzLTIuMjIxLTIuMjIxVjIwLjIyMWMwLTEuMjI4Ljk5My0yLjIyMSAyLjIyMS0yLjIyMWg5LjU1OHoiLz48cGF0aCBkPSJNMzAgMGMxLjIyOCAwIDIuMjIxLjk5MyAyLjIyMSAyLjIyMXYxNS41NThjMCAxLjIyOC0uOTkzIDIuMjIxLTIuMjIxIDIuMjIxaC05LjU1OGMtMS4yMjggMC0yLjIyMS0uOTkzLTIuMjIxLTIuMjIxVjIuMjIxQzE4LjIyMS45OTMgMTkuMjE0IDAgMjAuNDQyIDBoOS41NTh6Ii8+PHBhdGggZD0iTTEyIDE4YzEuMjI4IDAgMi4yMjEuOTkzIDIuMjIxIDIuMjIxdjE1LjU1OGMwIDEuMjI4LS45OTMgMi4yMjEtMi4yMjEgMi4yMjFIMi40NDJDMS4yMTQgMzggLjIyMSAzNy4wMDcuMjIxIDM1Ljc3OVYyMC4yMjFjMC0xLjIyOC45OTMtMi4yMjEgMi4yMjEtMi4yMjFIMTJ6Ii8+PHBhdGggZD0iTTU0IDBjMS4yMjggMCAyLjIyMS45OTMgMi4yMjEgMi4yMjF2MTUuNTU4YzAgMS4yMjgtLjk5MyAyLjIyMS0yLjIyMSAyLjIyMWgtOS41NThjLTEuMjI4IDAgLTIuMjIxLS45OTMtMi4yMjEtMi4yMjFWMi4yMjFDNDIuMjIxLjk5MyA0My4yMTQgMCA0NC40NDIgMGg5LjU1OHoiLz48cGF0aCBkPSJNMTIgMzZjMS4yMjggMCAyLjIyMS45OTMgMi4yMjEgMi4yMjF2MTUuNTU4YzAgMS4yMjgtLjk5MyAyLjIyMS0yLjIyMSAyLjIyMUgyLjQ0MkMxLjIxNCA1NiAuMjIxIDU1LjAwNy4yMjEgNTMuNzc5VjM4LjIyMWMwLTEuMjI4Ljk5My0yLjIyMSAyLjIyMS0yLjIyMUgxMnoiLz48cGF0aCBkPSJNMzYgMzZjMS4yMjggMCAyLjIyMS45OTMgMi4yMjEgMi4yMjF2MTUuNTU4YzAgMS4yMjgtLjk5MyAyLjIyMS0yLjIyMSAyLjIyMWgtOS41NThjLTEuMjI4IDAtMi4yMjEtLjk5My0yLjIyMS0yLjIyMVYzOC4yMjFjMC0xLjIyOC45OTMtMi4yMjEgMi4yMjEtMi4yMjFoOS41NTh6Ii8+PHBhdGggZD0iTTYwIDE4YzEuMjI4IDAgMi4yMjEuOTkzIDIuMjIxIDIuMjIxdjE1LjU1OGMwIDEuMjI4LS45OTMgMi4yMjEtMi4yMjEgMi4yMjFoLTkuNTU4Yy0xLjIyOCAwLTIuMjIxLS45OTMtMi4yMjEtMi4yMjFWMjAuMjIxYzAtMS4yMjguOTkzLTIuMjIxIDIuMjIxLTIuMjIxaDkuNTU4eiIvPjxwYXRoIGQ9Ik02MCAzNmMxLjIyOCAwIDIuMjIxLjk5MyAyLjIyMSAyLjIyMXYxNS41NThjMCAxLjIyOC0uOTkzIDIuMjIxLTIuMjIxIDIuMjIxaC05LjU1OGMtMS4yMjggMC0yLjIyMS0uOTkzLTIuMjIxLTIuMjIxVjM4LjIyMWMwLTEuMjI4Ljk5My0yLjIyMSAyLjIyMS0yLjIyMWg5LjU1OHoiLz48L2c+PC9nPjwvc3ZnPg==')] bg-repeat"></div>
          <CardTitle className="flex items-start gap-3 z-10">
            <div className="bg-white/20 p-2 rounded-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{university.school.name}</h3>
              <p className="text-sm font-normal mt-1 text-white/70 flex items-center">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                {university.school.city}, {university.school.state}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-1">
            <InfoItem 
              icon={School} 
              label="Ranking" 
              value={`#${university.school.us_ranking}`} 
            />
            
            <InfoItem 
              icon={GraduationCap} 
              label="Type" 
              value={university.school.type} 
            />
            
            <InfoItem 
              icon={Users} 
              label="Students" 
              value={university.school.students?.total_students} 
            />
            
            <InfoItem 
              icon={Calendar} 
              label="Founded" 
              value={university.school.founded_in} 
            />
            
            <InfoItem 
              icon={Award} 
              label="Acceptance Rate" 
              value={university.school.acceptance_rate} 
            />
          </div>
          
          {university.school.school_url && (
            <div className="pt-2">
              <a 
                href={university.school.school_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={cn("text-sm flex items-center gap-1.5", accentColors[colorIndex])}
              >
                <GlobeIcon className="h-3.5 w-3.5" />
                <span className="underline underline-offset-2">
                  {university.school.school_url.replace(/^https?:\/\//, '')}
                </span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
          
          <Separator className="bg-white/10 my-4" />
          
          <div className="pt-2">
            <Button 
              onClick={handleViewDetails} 
              className={cn("w-full text-white border-0", buttonGradients[colorIndex])}
            >
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ComparisonCard;
