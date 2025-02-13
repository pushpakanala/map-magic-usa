
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { USER_RESOURCE } from '../constants';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const { toast } = useToast();

  const { refetch: refetchUserData } = useQuery({
    queryKey: ['userFavorites'],
    queryFn: async () => {
      const user = JSON.parse(sessionStorage.getItem('user'));
      if (!user) return null;
      const response = await axios.get(`${USER_RESOURCE}{id}?email=${user.email}`);
      return response.data;
    },
    onSuccess: (data) => {
      if (data && data.data && data.data[0].favourites) {
        setFavorites(data.data[0].favourites);
      }
    },
    keepPreviousData: true
  });

  const updateFavoritesMutation = useMutation({
    mutationFn: async (newFavorites) => {
      const userData = JSON.parse(sessionStorage.getItem('user'));
      const currentResponse = await axios.get(`${USER_RESOURCE}{id}?email=${userData.email}`);
      const currentFavorites = currentResponse.data.data[0].favourites || [];
      
      const updatedFavorites = newFavorites;
      
      const response = await axios.put(`${USER_RESOURCE}`, {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        favourites: updatedFavorites
      });
      return response.data;
    },
    onSuccess: () => {
      refetchUserData();
      toast({
        title: "Success",
        description: "Favorites updated successfully",
      });
    },
    onError: () => {
      refetchUserData();
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update favorites",
      });
    }
  });

  const handleFavoriteClick = async (collegeName, e) => {
    e.stopPropagation();
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please login to add favorites",
      });
      return;
    }

    const currentFavorites = [...favorites];
    let updatedFavorites;

    if (currentFavorites.includes(collegeName)) {
      updatedFavorites = currentFavorites.filter(name => name !== collegeName);
    } else {
      updatedFavorites = [...currentFavorites, collegeName];
    }

    setFavorites(updatedFavorites);
    updateFavoritesMutation.mutate(updatedFavorites);
  };

  return {
    favorites,
    handleFavoriteClick
  };
};
