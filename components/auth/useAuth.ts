import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

type UserProfile = {
  id: string;
  email: string;
  name: string;
  bio?: string;
  photoUrl?: string | null;
  skillsToTeach: string[];
  skillsToLearn: string[];
  isProfileComplete: boolean;
  createdAt: string;
  updatedAt: string;
};

type AuthState = {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | undefined;
};

const AUTH_STORAGE_KEY = '@skillora_auth';
const PROFILE_STORAGE_KEY = '@skillora_profile';

type AuthOptions = {
  isLogin?: boolean;
  onSuccess?: () => void;
};

export const useAuth = ({ isLogin = true, onSuccess }: AuthOptions = {}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: undefined,
  });

  // Load saved auth state from storage on initial load
  const loadAuthState = useCallback(async () => {
    try {
      const authData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (authData) {
        const { user, token } = JSON.parse(authData);
        setAuthState({
          user,
          token,
          isAuthenticated: !!token,
          isLoading: false,
          error: undefined,
        });
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Failed to load auth state:', error);
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Failed to load authentication data',
      });
    }
  }, []);

  // Save auth state to storage
  const saveAuthState = useCallback(async (user: UserProfile | null, token: string | null) => {
    try {
      const authData = JSON.stringify({ user, token });
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, authData);
      
      setAuthState({
        user,
        token,
        isAuthenticated: !!token,
        isLoading: false,
        error: undefined,
      });
    } catch (error) {
      console.error('Failed to save auth state:', error);
      throw new Error('Failed to save authentication data');
    }
  }, []);

  // Handle user authentication (login/register)
  const handleAuth = useCallback(async (): Promise<{success: boolean; isNewUser?: boolean; user?: UserProfile; error?: string}> => {
    if (isLoading) {
      return { success: false, error: 'Operation in progress' };
    }

    // Basic validation
    if (!email || !password || (!isLogin && !name)) {
      const errorMsg = 'Please fill in all fields';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      const errorMsg = 'Please enter a valid email address';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    try {
      setIsLoading(true);
      setError(undefined);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would get this from your API
      const mockToken = `mock-jwt-token-${Date.now()}`;
      const userId = `user-${Math.random().toString(36).substr(2, 9)}`;
      
      const userProfile: UserProfile = {
        id: userId,
        email,
        name: isLogin ? 'Existing User' : name, // In a real app, this would come from the API
        bio: '',
        skillsToTeach: [],
        skillsToLearn: [],
        isProfileComplete: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Save the auth state
      await saveAuthState(userProfile, mockToken);
      
      console.log(isLogin ? 'Logged in successfully' : 'Registered successfully', { email, name });
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      return {
        success: true,
        isNewUser: !isLogin,
        user: userProfile,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during authentication';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [isLogin, email, password, name, isLoading]);

  // Update user profile
  const updateProfile = useCallback(async (profileData: Partial<UserProfile>) => {
    if (!authState.user) {
      throw new Error('User not authenticated');
    }

    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedUser: UserProfile = {
        ...authState.user,
        ...profileData,
        updatedAt: new Date().toISOString(),
      };
      
      // Save updated user to storage
      await saveAuthState(updatedUser, authState.token);
      
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw new Error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  }, [authState.user, authState.token, saveAuthState]);

  // Logout user
  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: undefined,
      });
      return { success: true };
    } catch (error) {
      console.error('Failed to logout:', error);
      return { success: false, error: 'Failed to logout' };
    }
  }, []);

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    return authState.isAuthenticated && !!authState.user;
  }, [authState.isAuthenticated, authState.user]);

  // Get current user
  const getCurrentUser = useCallback(() => {
    return authState.user;
  }, [authState.user]);

  return {
    // Auth state
    ...authState,
    
    // Form state
    email,
    password,
    name,
    isLoading,
    error,
    
    // Methods
    setEmail,
    setPassword,
    setName,
    handleAuth,
    updateProfile,
    logout,
    isAuthenticated,
    getCurrentUser,
    loadAuthState,
  };
};
