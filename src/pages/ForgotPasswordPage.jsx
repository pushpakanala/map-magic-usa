
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { AtSign, KeyRound } from 'lucide-react';
import axios from 'axios';
import { VERIFY_MAIL, UPDATE_PWD } from '../constants';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setIsVerifying(true);

    try {
      // Sample API endpoint - Replace with your actual endpoint
      const response = await axios.post(`${VERIFY_MAIL}?email=${email}`);
      
      if (response.status === 200) {
        setIsEmailVerified(true);
        toast({
          title: "Success",
          description: "Email verified successfully! Please check your email for OTP.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to verify email. Please try again.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match.",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Sample API endpoint - Replace with your actual endpoint
      const response = await axios.put(`${UPDATE_PWD}`, {
        email,
        otp,
        password
      });
      
      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Password reset successful!",
        });
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reset password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
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
            Reset Password
          </motion.h1>
          
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-2">
              <div className="relative flex gap-2">
                <div className="flex-1">
                  <AtSign className="absolute left-3 top-3 h-5 w-5 text-primary/70" />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isEmailVerified}
                    className="pl-10 h-12 bg-background/50 backdrop-blur-sm transition-colors focus:bg-background/80"
                    required
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleVerifyEmail}
                  disabled={!email || isEmailVerified || isVerifying}
                  className="h-12 px-6"
                >
                  {isVerifying ? "Verifying..." : "Verify"}
                </Button>
              </div>
            </div>

            <motion.div 
              animate={{ opacity: isEmailVerified ? 1 : 0.5 }}
              className="space-y-6"
            >
              <div className="relative">
                <Input
                  type="text"
                  placeholder="OTP Code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={!isEmailVerified}
                  className="h-12 bg-background/50 backdrop-blur-sm transition-colors focus:bg-background/80"
                  required
                />
              </div>

              <div className="relative">
                <KeyRound className="absolute left-3 top-3 h-5 w-5 text-primary/70" />
                <Input
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={!isEmailVerified}
                  className="pl-10 h-12 bg-background/50 backdrop-blur-sm transition-colors focus:bg-background/80"
                  required
                />
              </div>

              <div className="relative">
                <KeyRound className="absolute left-3 top-3 h-5 w-5 text-primary/70" />
                <Input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={!isEmailVerified}
                  className="pl-10 h-12 bg-background/50 backdrop-blur-sm transition-colors focus:bg-background/80"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300"
                disabled={!isEmailVerified || isLoading || !otp || !password || !confirmPassword}
              >
                {isLoading ? "Resetting Password..." : "Reset Password"}
              </Button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
