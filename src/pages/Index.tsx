
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import USAMap from '@/components/USAMap';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFavorites } from '@/hooks/use-favorites';
import UniversitiesList from '@/components/state/UniversitiesList';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { favorites, handleFavoriteClick } = useFavorites();

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('user');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/login', { replace: true });
  };

  const handleCollegeClick = (college) => {
    navigate(`/college/${encodeURIComponent(college.name)}`);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            UNIQUEST
          </h1>
          <Button 
            variant="outline"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="map" className="mb-8">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px] mx-auto">
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="favorites">Favorites ({favorites.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="map">
            <p className="text-center text-muted-foreground mb-12">
              Click on a state to learn more about its Universities, or hover to see its population
            </p>
            <USAMap />
          </TabsContent>
          
          <TabsContent value="favorites">
            <div className="max-w-7xl mx-auto">
              {favorites.length > 0 ? (
                <UniversitiesList
                  universities={favorites.map(name => ({ name }))}
                  favorites={favorites}
                  onFavoriteClick={handleFavoriteClick}
                  onUniversityClick={handleCollegeClick}
                />
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  <p>No favorite universities yet.</p>
                  <p>Click on a state and add universities to your favorites!</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
