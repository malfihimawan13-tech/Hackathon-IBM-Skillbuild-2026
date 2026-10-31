import React, { useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from './AuthContext';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import { colors } from './theme';

// Bungkus aplikasi: jika belum masuk tampil Login/Daftar; jika sudah, tampil `children`.
// <AuthProvider><AuthGate>{aplikasi}</AuthGate></AuthProvider>
export default function AuthGate({ children }) {
  const { user, loading } = useAuth();
  const [mode, setMode] = useState('login');
  if (loading) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={colors.green} /></View>;
  if (user) return children;
  if (mode === 'lupa') return <ForgotPasswordScreen onGoLogin={() => setMode('login')} onGoRegister={() => setMode('daftar')} />;
  return mode === 'login'
    ? <LoginScreen onGoRegister={() => setMode('daftar')} onGoForgot={() => setMode('lupa')} />
    : <RegisterScreen onGoLogin={() => setMode('login')} onDone={() => setMode('login')} />;
}
