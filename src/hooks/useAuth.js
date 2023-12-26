// src/hooks/useAuth.js
import { useContext } from 'react';
import { useAuth as useAuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
    return useAuthContext();
  };