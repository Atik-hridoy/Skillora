import { useState } from 'react';
import { View } from 'react-native';
import { AuthUI } from '@/components/auth/AuthUI';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const handleToggleAuth = () => {
    setIsLogin(!isLogin);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <AuthUI 
        isLogin={isLogin} 
        onToggleAuth={handleToggleAuth} 
      />
    </View>
  );
}
