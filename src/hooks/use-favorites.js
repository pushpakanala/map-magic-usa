import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { USER_RESOURCE } from '../constants';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const { toast } = useToast();
  const token = sessionStorage.getItem("token");

  const { data: userData, refetch: refetchUserData } = useQuery({
    queryKey: ['userFavorites'],
    queryFn: async () => {
      const user = JSON.parse(sessionStorage.getItem('user'));
      if (!user) return null;
      const response = await axios.get(`${USER_RESOURCE}{id}?email=${user.email}`,{
        headers: { Authorization: `Bearer ${token}` }
    });
      console.log('Fetched favorites:', response.data?.data[0]?.favourites);
      return response.data;
    },
    onSuccess: (data) => {
      if (data && data.data && data.data[0].favourites) {
        setFavorites(data.data[0].favourites);
        console.log('Updated favorites state:', data.data[0].favourites);
      }
    },
    refetchOnWindowFocus: true,
    keepPreviousData: true
  });

  useEffect(() => {
    if (userData?.data?.[0]?.favourites) {
      setFavorites(userData.data[0].favourites);
    }
  }, [userData]);

  const updateFavoritesMutation = useMutation({
    mutationFn: async (newFavorites) => {
      const user = JSON.parse(sessionStorage.getItem('user'));
      if (!user) throw new Error('User not logged in');

      const currentResponse = await axios.get(`${USER_RESOURCE}{id}?email=${user.email}`,{
        headers: { Authorization: `Bearer ${token}` }
    });
      const currentFavorites = currentResponse.data.data[0].favourites || [];
      
      console.log('Current favorites before update:', currentFavorites);
      console.log('New favorites to save:', newFavorites);

      const response = await axios.put(`${USER_RESOURCE}`, {
        name: user.name,
        email: user.email,
        role: user.role,
        favourites: newFavorites,
      },
      {
        headers: { Authorization: `Bearer ${token}` }
    }
    );
      
      return response.data;
    },
    onSuccess: (data) => {
      refetchUserData();
      toast({
        title: "Success",
        description: "Favorites updated successfully",
      });
    },
    onError: (error) => {
      refetchUserData();
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update favorites",
      });
      console.error('Error updating favorites:', error);
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

    console.log('Updating favorites:', updatedFavorites);
    
    setFavorites(updatedFavorites);
    updateFavoritesMutation.mutate(updatedFavorites);
  };

  return {
    favorites,
    handleFavoriteClick
  };
};
