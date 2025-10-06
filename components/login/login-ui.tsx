import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator
} from "react-native";

type LoginUIProps = {
  email: string;
  password: string;
  onEmailChange: (text: string) => void;
  onPasswordChange: (text: string) => void;
  onLogin: () => void;
  onSignUp: (name: string, email: string, password: string) => void;
  isLoading: boolean;
};

export function LoginUI({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onLogin,
  onSignUp,
  isLoading,
}: LoginUIProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');

  const handleAuth = () => {
    if (isLogin) {
      onLogin();
    } else {
      onSignUp(name, email, password);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo / Branding */}
      <Image
        source={{ uri: "https://i.ibb.co/VJYJhF0/logo.png" }}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Welcome to Skillora 🚀</Text>
      <Text style={styles.subtitle}>
        {isLogin ? "Login to continue" : "Create a new account"}
      </Text>

      {/* Input Fields */}
      {!isLogin && (
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#999"
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={onEmailChange}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#999"
        autoComplete="email"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={onPasswordChange}
        secureTextEntry
        placeholderTextColor="#999"
        autoComplete={isLogin ? "current-password" : "new-password"}
      />

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleAuth}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {isLogin ? 'Log In' : 'Sign Up'}
          </Text>
        )}
      </TouchableOpacity>
      <View style={styles.toggleContainer}>
        {isLogin ? (
          <Text style={styles.toggleText}>
            Don't have an account?{' '}
            <Text style={styles.toggleLink} onPress={() => setIsLogin(false)}>
              Sign up
            </Text>
          </Text>
        ) : (
          <Text style={styles.toggleText}>
            Already have an account?{' '}
            <Text style={styles.toggleLink} onPress={() => setIsLogin(true)}>
              Log in
            </Text>
          </Text>
        )}
      </View>
      <View style={styles.socialContainer}>
        <TouchableOpacity
          style={[styles.socialButton, styles.facebookButton]}
          disabled={isLoading}
        >
          <Text style={[styles.socialText, styles.facebookText]}>Continue with Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.socialButton, styles.googleButton]}
          disabled={isLoading}
        >
          <Text style={[styles.socialText, styles.googleText]}>Continue with Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#666',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  toggleText: {
    color: '#666',
    fontSize: 14,
  },
  toggleLink: {
    color: '#007AFF',
    fontWeight: '600',
  },
  socialContainer: {
    marginTop: 24,
  },
  socialButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  facebookButton: {
    backgroundColor: '#1877F2',
    borderColor: '#1877F2',
  },
  googleButton: {
    backgroundColor: '#fff',
    borderColor: '#e0e0e0',
  },
  socialText: {
    fontSize: 16,
    fontWeight: '500',
  },
  facebookText: {
    color: '#fff',
  },
  googleText: {
    color: '#333',
  },
});
