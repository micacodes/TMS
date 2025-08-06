import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import Layout from '../components/Layout';
import AuthForm from '../components/AuthForm';

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (formData) => {
    setIsLoading(true);
    try {
      await api.post('/auth/register', formData);
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      const errorMsg = error.response?.data?.errors 
        ? error.response.data.errors[0].msg 
        : error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <AuthForm
        formType="register"
        onSubmit={handleRegister}
        isLoading={isLoading}
      />
    </Layout>
  );
};

export default RegisterPage;