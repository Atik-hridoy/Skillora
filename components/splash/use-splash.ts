import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export function useSplashScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const navigateToLogin = async () => {
      try {
        // Wait for 2 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Navigate to login
        console.log('Navigating to login...');
        router.replace('/login');
        
        // Hide the splash screen after navigation
        await SplashScreen.hideAsync();
      } catch (error) {
        console.error('Error during splash screen navigation:', error);
      } finally {
        setIsLoading(false);
      }
    };

    navigateToLogin();
  }, [router]);

  return { isLoading };
}