import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert, 
  ScrollView, 
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ImageBackground
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useAuth } from '../auth/useAuth';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

type ProfileSetupProps = {
  onComplete: () => void;
};

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [teach, setTeach] = useState('');
  const [learn, setLearn] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'teach' | 'learn'>('teach');
  const router = useRouter();
  const { updateProfile } = useAuth({ isLogin: true });
  
  const skills = [
    'Web Development', 'Mobile Development', 'UI/UX Design',
    'Graphic Design', 'Digital Marketing', 'Content Writing',
    'Data Science', 'Machine Learning', 'Photography',
    'Video Editing', 'Music Production', 'Language Teaching'
  ];
  
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  
  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

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
        quality: 0.8,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick an image. Please try again.');
    }
  };
  
  const renderSkills = () => {
    return (
      <View style={styles.skillsContainer}>
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'teach' && styles.activeTab]}
            onPress={() => setActiveTab('teach')}
          >
            <Text style={[styles.tabText, activeTab === 'teach' && styles.activeTabText]}>
              I can teach
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'learn' && styles.activeTab]}
            onPress={() => setActiveTab('learn')}
          >
            <Text style={[styles.tabText, activeTab === 'learn' && styles.activeTabText]}>
              I want to learn
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.skillsGrid}>
          {skills.map((skill) => (
            <TouchableOpacity
              key={skill}
              style={[
                styles.skillItem,
                selectedSkills.includes(skill) && styles.selectedSkillItem
              ]}
              onPress={() => toggleSkill(skill)}
            >
              <Text style={[
                styles.skillText,
                selectedSkills.includes(skill) && styles.selectedSkillText
              ]}>
                {skill}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter your name');
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, you would upload the photo to a storage service first
      // and then save the profile data to your database
      const profileData = {
        name: name.trim(),
        bio: bio.trim(),
        skillsToTeach: teach.split(',').map(skill => skill.trim()).filter(Boolean),
        skillsToLearn: learn.split(',').map(skill => skill.trim()).filter(Boolean),
        photoUrl: photo,
        isProfileComplete: true,
      };

      await updateProfile(profileData);
      
      // Navigate to home after successful profile setup
      onComplete();
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Your Profile</Text>
      <Text style={styles.subtitle}>Help others get to know you better</Text>

      <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>📷</Text>
            <Text style={styles.avatarSubtext}>Add Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="John Doe"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, styles.bioInput]}
          placeholder="Tell us about yourself..."
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>I can teach</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., React Native, Guitar, Cooking"
          value={teach}
          onChangeText={setTeach}
        />
        <Text style={styles.hint}>Separate skills with commas</Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>I want to learn</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Photography, Spanish, Yoga"
          value={learn}
          onChangeText={setLearn}
        />
        <Text style={styles.hint}>Separate skills with commas</Text>
      </View>

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleSave}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save Profile</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#4A90E2',
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  avatarText: {
    fontSize: 32,
    marginBottom: 8,
  },
  avatarSubtext: {
    color: '#666',
    fontSize: 14,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e1e4e8',
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  hint: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#a0c4ff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  skillsContainer: {
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 3,
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tabText: {
    color: '#666',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#4A90E2',
    fontWeight: '700',
  },
  skillChip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  skillItem: {
    backgroundColor: '#e9f0ff',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedSkillItem: {
    backgroundColor: '#4A90E2',
  },
  skillText: {
    color: '#4A90E2',
    marginRight: 6,
  },
  selectedSkillText: {
    color: '#fff',
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});
