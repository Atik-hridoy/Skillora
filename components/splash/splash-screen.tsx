import { useEffect } from 'react';
import { View } from 'react-native';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { SplashUI } from './splash-ui';
import { useSplashScreen } from './use-splash';

// Keep the splash screen visible while we fetch resources
ExpoSplashScreen.preventAutoHideAsync();

export function SplashScreenComponent() {
  const { isLoading } = useSplashScreen();
  
  // Hide splash screen when component mounts
  useEffect(() => {
    const hideSplash = async () => {
      try {
        await ExpoSplashScreen.hideAsync();
      } catch (e) {
        console.warn('Error hiding splash screen:', e);
      }
    };
    
    hideSplash();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <SplashUI appName="Skillora" isLoading={isLoading} />
    </View>
  );
}