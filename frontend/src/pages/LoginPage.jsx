import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Layout from '../components/Layout';
import AuthForm from '../components/AuthForm';

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleLogin = async (formData) => {
    setIsLoading(true);
    try {
      const credentials = { email: formData.email, password: formData.password };
      const response = await api.post('/auth/login', credentials);
      
      login(response.data.token); 
      
      toast.success('Login successful! Welcome back.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <AuthForm
        formType="login"
        onSubmit={handleLogin}
        isLoading={isLoading}
      />
    </Layout>
  );
};

export default LoginPage;