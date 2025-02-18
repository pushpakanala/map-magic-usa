
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UniversitiesList from '@/components/state/UniversitiesList';
import PopulationStats from '@/components/state/PopulationStats';
import { statesData } from '@/lib/states-data';
import { useFavorites } from '@/hooks/use-favorites';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const StatePage = () => {
  const { stateName } = useParams();
  const navigate = useNavigate();
  const { favorites, handleFavoriteClick } = useFavorites();
  const [universities, setUniversities] = useState([]);
  const decodedStateName = decodeURIComponent(stateName);
  const stateData = statesData.find(state => 
    state.name.toLowerCase() === decodedStateName.toLowerCase()
  );

  useEffect(() => {
    if (stateData) {
      setUniversities(stateData.universities || []);
    }
  }, [stateData]);

  return (
    <div className="min-h-[1024px] max-w-[1440px] mx-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              {decodedStateName}
            </h1>
          </div>
          <PopulationStats population={stateData?.population} />
        </div>

        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-slate-200/50 dark:border-slate-700/50">
          <UniversitiesList
            universities={universities}
            favorites={favorites}
            onFavoriteClick={handleFavoriteClick}
            onUniversityClick={(college) => navigate(`/college/${encodeURIComponent(college.name)}`)}
          />
        </div>
      </div>
    </div>
  );
};

export default StatePage;
