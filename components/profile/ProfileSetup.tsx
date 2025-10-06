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
  StatusBar, 
  SafeAreaView,
  ViewStyle,
  TextStyle,
  ImageStyle
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useAuth } from '../auth/useAuth';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';

interface ProfileSetupProps {
  onComplete?: () => void;
}

const { width } = Dimensions.get('window');

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onComplete = () => {} }) => {
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

      if (!result.canceled && result.assets && result.assets[0].uri) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick an image. Please try again.');
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter your name');
      return;
    }

    try {
      setIsLoading(true);
      const profileData = {
        name,
        bio,
        skills: selectedSkills,
        photo,
      };

      await updateProfile(profileData);
      onComplete();
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderSkills = () => (
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={pickImage} style={styles.avatarButton}>
              {photo ? (
                <Image source={{ uri: photo }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>📷</Text>
                  <Text style={styles.avatarSubtext}>Add Photo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

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
              numberOfLines={4}
            />
          </View>

          {renderSkills()}

          <View style={styles.formGroup}>
            <Text style={styles.label}>
              {activeTab === 'teach' ? 'What can you teach?' : 'What do you want to learn?'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., React Native, UI/UX Design"
              value={activeTab === 'teach' ? teach : learn}
              onChangeText={activeTab === 'teach' ? setTeach : setLearn}
            />
            <Text style={styles.hint}>
              Press Enter after each skill to add it
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.button, (!name.trim() || isLoading) && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={!name.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Save Profile</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

interface Styles {
  safeArea: ViewStyle;
  container: ViewStyle;
  scrollContainer: ViewStyle;
  avatarContainer: ViewStyle;
  avatarButton: ViewStyle;
  avatar: ImageStyle;
  avatarPlaceholder: ViewStyle;
  avatarText: TextStyle;
  avatarSubtext: TextStyle;
  formGroup: ViewStyle;
  label: TextStyle;
  input: TextStyle;
  bioInput: TextStyle;
  button: ViewStyle;
  buttonDisabled: ViewStyle;
  buttonText: TextStyle;
  skillsContainer: ViewStyle;
  tabContainer: ViewStyle;
  tab: ViewStyle;
  activeTab: ViewStyle;
  tabText: TextStyle;
  activeTabText: TextStyle;
  skillsGrid: ViewStyle;
  skillItem: ViewStyle;
  selectedSkillItem: ViewStyle;
  skillText: TextStyle;
  selectedSkillText: TextStyle;
  hint: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarButton: {
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
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
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e1e4e8',
  },
  bioInput: {
    minHeight: 100,
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
    borderRadius: 8,
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
    shadowOffset: { width: 0, height: 2 },
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
  skillsGrid: {
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
  },
  selectedSkillItem: {
    backgroundColor: '#4A90E2',
  },
  skillText: {
    color: '#4A90E2',
    fontSize: 14,
  },
  selectedSkillText: {
    color: '#fff',
  },
});

export default ProfileSetup;
