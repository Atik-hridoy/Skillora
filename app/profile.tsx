import { View } from 'react-native';
import ProfileSetup from '../components/profile/ProfileSetup';

export default function ProfileScreen() {
  const handleComplete = () => {
    // Handle profile completion if needed
    console.log('Profile setup completed');
  };

  return (
    <View style={{ flex: 1 }}>
      <ProfileSetup onComplete={handleComplete} />
    </View>
  );
}
