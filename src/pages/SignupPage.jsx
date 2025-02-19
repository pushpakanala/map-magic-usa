
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { User, Mail, Lock } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-72 h-72 md:w-96 md:h-96">
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
        className="w-full max-w-md relative z-10 ml-auto mr-12 lg:mr-24"
      >
        <div className="bg-background/80 backdrop-blur-lg rounded-lg shadow-lg p-8 border border-primary/20">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/3cb78e1e-9ba3-42b1-8f0f-03e4218fe231.png"
              alt="Logo"
              className="w-24 h-24 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-center mb-8">Create Account</h1>
          
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

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
                  onChange={handlePasswordChange}
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
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className={`pl-10 ${passwordError ? 'border-red-500' : ''}`}
                  required
                />
              </div>
              {passwordError && (
                <p className="text-sm text-red-500 mt-1">{passwordError}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading || passwordError}
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
