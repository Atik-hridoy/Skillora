import { StyleSheet, View, Image, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type SplashUIProps = {
  appName: string;
  isLoading: boolean;
};

export function SplashUI({ appName, isLoading }: SplashUIProps) {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoPlaceholder}>
          <MaterialIcons name="rocket-launch" size={80} color="#007AFF" />
        </View>
        <Text style={styles.appName}>{appName}</Text>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <MaterialIcons name="cached" size={24} color="#007AFF" style={styles.spinner} />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 20,
    marginBottom: 40,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  spinner: {
    marginRight: 10,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  logo: {
    width: 200,
    height: 200,
  },
});
