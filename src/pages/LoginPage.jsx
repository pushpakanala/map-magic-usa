import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { AtSign, KeyRound, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { LOGIN } from '../constants';
import { useToast } from '@/hooks/use-toast';
import { logLoginEvent, logEvent } from '@/utils/logger';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  
  // Check if user is already logged in, redirect to explore page
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      navigate('/explore', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    logEvent('login_submit', { location: 'login_page', action: 'submit_form' });

    try {
      const response = await axios.post(`${LOGIN}?email=${email}&password=${password}`);
      
      if (response.data) {
        // Extract user role from the API response or default to 'user'
        const userRole = response.data.data.role || 'user';
        
        const userData = {
          email,
          name: response.data.data.name,
          role: userRole  // Store the role in the userData object
        };
        
        const token = response.data.data.access_token;
        
        sessionStorage.setItem('user', JSON.stringify(userData));
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('token', token);
        
        // Log successful login
        logLoginEvent(email);
        
        navigate('/explore', { replace: true });
        toast({
          title: "Success",
          description: "Successfully logged in!",
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      // Log login failure
      logEvent('login_failed', { email, reason: error.message });
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Login failed. Please check your credentials.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    logEvent('toggle_password', { location: 'login_page', action: 'toggle_visibility' });
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background flex items-center justify-center p-8">
      <div className="w-full max-w-[1100px] flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-[450px] h-[500px]"
        >
          <img 
            src="/lovable-uploads/e0689fd1-93f8-43da-8622-0ab01ffe42e8.png"
            alt="Graduate"
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-background/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-primary/20 p-8">
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-6"
            >
              <img 
                src="/lovable-uploads/3cb78e1e-9ba3-42b1-8f0f-03e4218fe231.png"
                alt="Logo"
                className="w-28 h-28 object-contain"
              />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
            >
              Welcome Back
            </motion.h1>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <div className="relative">
                  <AtSign className="absolute left-3 top-3 h-5 w-5 text-primary/70" />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 bg-background/50 backdrop-blur-sm transition-colors focus:bg-background/80"
                    required
                  />
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-5 w-5 text-primary/70" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 bg-background/50 backdrop-blur-sm transition-colors focus:bg-background/80"
                    required
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-3 text-primary/70 hover:text-primary focus:outline-none"
                    onClick={togglePasswordVisibility}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </motion.div>

              <div className="flex justify-end">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </motion.div>
            </form>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center mt-6 text-sm text-muted-foreground"
            >
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
