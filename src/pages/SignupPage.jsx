
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { UserRound, AtSign } from 'lucide-react';
import axios from 'axios';
import { USER_RESOURCE } from '../constants';

const SignupPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Generate a random temporary password
      const tempPassword = Math.random().toString(36).slice(-8);
      
      const response = await axios.post(USER_RESOURCE, {
        name,
        email,
        password: tempPassword, // Send the temporary password to the backend
        role: 'user'
      });
      
      if (response.status === 200) {
        toast({
          title: "Success!",
          description: "Account created successfully! Please check your email for login credentials.",
          duration: 5000,
        });
        
        // Clear form data
        setName('');
        setEmail('');
        
        // Wait for toast to be visible before navigating
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <p className="text-sm text-muted-foreground text-center px-4 py-3 bg-primary/5 rounded-lg border border-primary/10">
                  Once you sign up, your login credentials will be sent to your email address.
                </p>
                
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Sign Up"}
                </Button>
              </motion.div>
            </form>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
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
