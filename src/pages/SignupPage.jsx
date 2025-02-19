
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { UserRound, AtSign, KeyRound } from 'lucide-react';
import axios from 'axios';
import { USER_RESOURCE } from '../constants';

const SignupPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const validatePasswords = () => {
    if (password === '' || confirmPassword === '') {
      setPasswordError('');
      return false;
    }
    
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!validatePasswords()) {
      if (password !== confirmPassword) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Passwords do not match. Please try again.",
        });
        return;
      }
    }

    setIsLoading(true);

    try {
      const response = await axios.post(USER_RESOURCE, {
        name,
        email,
        password,
        role: 'user'
      });
      
      if (response.status === 200) {
        toast({
          title: "Success!",
          description: "Account created successfully! Please login.",
          duration: 3000,
        });
        
        // Clear form data
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        
        // Wait for toast to be visible before navigating
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 1000);
      }
    } catch (error) {
      let errorMessage = "Failed to create account. Please try again.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 409) {
        errorMessage = "Email already exists. Please use a different email.";
      }
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (confirmPassword) {
      if (newPassword === confirmPassword) {
        setPasswordError('');
      } else {
        setPasswordError('Passwords do not match');
      }
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    if (password) {
      if (password === newConfirmPassword) {
        setPasswordError('');
      } else {
        setPasswordError('Passwords do not match');
      }
    }
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
              Create Account
            </motion.h1>
            
            <form onSubmit={handleSignup} className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <div className="relative">
                  <UserRound className="absolute left-3 top-3 h-5 w-5 text-primary/70" />
                  <Input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                transition={{ delay: 0.5 }}
                className="space-y-2"
              >
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-5 w-5 text-primary/70" />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="pl-10 h-12 bg-background/50 backdrop-blur-sm transition-colors focus:bg-background/80"
                    required
                  />
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-2"
              >
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-5 w-5 text-primary/70" />
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className={`pl-10 h-12 bg-background/50 backdrop-blur-sm transition-colors focus:bg-background/80 ${
                      passwordError ? 'border-red-500' : ''
                    }`}
                    required
                  />
                </div>
                {passwordError && (
                  <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300"
                  disabled={isLoading || passwordError}
                >
                  {isLoading ? "Creating account..." : "Sign Up"}
                </Button>
              </motion.div>
            </form>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center mt-6 text-sm text-muted-foreground"
            >
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Login
              </Link>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;
