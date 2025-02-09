
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const LogoutButton = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    toast({
      title: "Success",
      description: "Logged out successfully",
    });
    
    navigate('/login');
  };

  return (
    <Button onClick={handleLogout} variant="outline">
      Logout
    </Button>
  );
};

export default LogoutButton;
