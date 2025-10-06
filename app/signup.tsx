// app/signup.tsx
import { SignupUI } from '@/components/signup/signup-ui';
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // TODO: Replace with your actual signup API call
      console.log('Signing up with:', { name, email, password });
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      // On successful signup, you might want to:
      // 1. Store the user token
      // 2. Navigate to the home screen
      // 3. Reset the navigation stack
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    };

    const handleLoginRedirect = () => {
      router.replace('/login');
    };

    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <SignupUI
          name={name}
          email={email}
          password={password}
          confirmPassword={confirmPassword}
          onNameChange={setName}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onConfirmPasswordChange={setConfirmPassword}
          onSignUp={handleSignUp}
        onLoginRedirect={handleLoginRedirect}
        isLoading={isLoading}
        error={error}
      />
    </View>
  );
}
}