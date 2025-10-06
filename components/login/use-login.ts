import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

export function useLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Implement actual login logic here
      // For now, we'll simulate a network request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // On successful login, navigate to the main app
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    password,
    isLoading,
    setEmail,
    setPassword,
    handleLogin,
  };
}
