import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          email: email,
          password: password,
        }
      );

      if (response.status === 200) {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('user', JSON.stringify(response.data.data));
        sessionStorage.setItem('token', response.data.data.token);

        toast({
          title: 'Success',
          description: 'Login successful',
        });

        navigate('/', { replace: true, state: { fromLogin: true } });
      } else {
        toast({
          title: 'Error',
          description: 'Invalid credentials',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid credentials',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <button
            className="text-sm text-gray-600 hover:text-gray-800"
            onClick={() => navigate('/forgot-password')}
          >
            Forgot password?
          </button>
        </div>
        <div className="mt-4 text-center">
          Don't have an account?{' '}
          <button
            className="text-sm text-blue-600 hover:text-blue-800"
            onClick={() => navigate('/signup')}
          >
            Sign up
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
