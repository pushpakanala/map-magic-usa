
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
import axios from 'axios';
import { LOGIN } from '../constants';
import { useToast } from '@/hooks/use-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${LOGIN}?email=${email}&password=${password}`);
      
      if (response.data) {
        const userData = {
          email,
          name: response.data.data.name,
          role: 'user'
        };
        
        const token = response.data.data.access_token;
        
        sessionStorage.setItem('user', JSON.stringify(userData));
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('token', token);
        
        navigate('/', { replace: true });
        toast({
          title: "Success",
          description: "Successfully logged in!",
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Login failed. Please check your credentials.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex items-center justify-center p-4">
      <div className="absolute top-0 right-0 w-72 h-72 md:w-96 md:h-96">
        <img 
          src="/lovable-uploads/e0689fd1-93f8-43da-8622-0ab01ffe42e8.png"
          alt="Graduate"
          className="w-full h-full object-contain opacity-50"
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-background/80 backdrop-blur-lg rounded-lg shadow-lg p-8 border border-primary/20">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/3cb78e1e-9ba3-42b1-8f0f-03e4218fe231.png"
              alt="Logo"
              className="w-24 h-24 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-center mb-8">Welcome Back</h1>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
