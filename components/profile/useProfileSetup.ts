// useProfileSetup.ts
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Easing } from 'react-native';
import { useAuth } from '../auth/useAuth';

export interface Interest {
  id: string;
  name: string;
  icon: string;
}

export const INTERESTS: Interest[] = [
  { id: 'design', name: 'Design', icon: 'palette' },
  { id: 'tech', name: 'Technology', icon: 'laptop' },
  { id: 'food', name: 'Food & Drink', icon: 'food' },
  { id: 'travel', name: 'Travel', icon: 'airplane' },
  { id: 'fitness', name: 'Fitness', icon: 'dumbbell' },
  { id: 'fashion', name: 'Fashion', icon: 'tshirt-crew' },
  { id: 'art', name: 'Art', icon: 'brush' },
  { id: 'photography', name: 'Photography', icon: 'camera' },
  { id: 'diy', name: 'DIY', icon: 'hammer-wrench' },
  { id: 'music', name: 'Music', icon: 'music' },
  { id: 'reading', name: 'Reading', icon: 'book-open' },
  { id: 'gaming', name: 'Gaming', icon: 'gamepad-variant' },
];

interface UseProfileSetupProps {
  onComplete?: () => void;
}

export const useProfileSetup = ({ onComplete = () => {} }: UseProfileSetupProps = {}) => {
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { updateProfile, isAuthenticated, handleAuth, user } = useAuth({ isLogin: true });
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  // Animation effect
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [step]);

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setUsername(user.email?.split('@')[0] || '');
      setBio(user.bio || '');
      setPhoto(user.photoUrl || null);
      setSelectedInterests(user.skillsToTeach || []);
    }
  }, [user]);

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission required', 'Please allow access to your photos to upload a profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick an image. Please try again.');
    }
  };

  const toggleInterest = (interestId: string) => {
    setSelectedInterests(prev => 
      prev.includes(interestId) 
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleNext = () => {
    if (step < 3) {
      fadeAnim.setValue(0);
      slideAnim.setValue(20);
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      fadeAnim.setValue(0);
      slideAnim.setValue(-20);
      setStep(step - 1);
    }
  };

  const isNextDisabled = () => {
    switch(step) {
      case 1: return !name.trim() || !username.trim();
      case 2: return selectedInterests.length < 3;
      default: return false;
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !username.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);

      if (!user) {
        const authResult = await handleAuth();
        if (!authResult?.success) {
          throw new Error('Authentication required. Please log in first.');
        }
      }
      
      await updateProfile({
        name: name.trim(),
        email: `${username.trim().toLowerCase()}@skillora.app`,
        bio: bio.trim(),
        photoUrl: photo || null,
        skillsToTeach: selectedInterests,
        skillsToLearn: [],
        isProfileComplete: true,
        updatedAt: new Date().toISOString()
      });
      
      router.replace('/(tabs)');
      onComplete();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // State
    step,
    name,
    username,
    bio,
    photo,
    selectedInterests,
    isLoading,
    fadeAnim,
    slideAnim,
    
    // Handlers
    setName,
    setUsername,
    setBio,
    setPhoto,
    setSelectedInterests,
    pickImage,
    toggleInterest,
    handleNext,
    handleBack,
    handleSubmit,
    isNextDisabled,
  };
};