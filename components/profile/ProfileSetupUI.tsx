// ProfileSetupUI.tsx
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import {
    Animated,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { INTERESTS, useProfileSetup } from './useProfileSetup';

const { width } = Dimensions.get('window');

interface ProfileSetupUIProps {
  onComplete?: () => void;
}

const ProfileSetupUI: React.FC<ProfileSetupUIProps> = ({ onComplete }) => {
  const {
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
    pickImage,
    toggleInterest,
    handleNext,
    handleBack,
    isNextDisabled,
  } = useProfileSetup({ onComplete });

  const renderStepOne = () => (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.title}>Welcome to Skillora</Text>
      <Text style={styles.subtitle}>Let's set up your profile</Text>
      
      <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <MaterialIcons name="add-a-photo" size={32} color="#666" />
          </View>
        )}
        <View style={styles.cameraIcon}>
          <MaterialIcons name="photo-camera" size={20} color="white" />
        </View>
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Full Name *</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username *</Text>
        <View style={styles.inputWrapper}>
          <Text style={styles.prefix}>skillora.com/</Text>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="username"
            value={username}
            onChangeText={text => setUsername(text.replace(/\s+/g, '').toLowerCase())}
            autoCapitalize="none"
            placeholderTextColor="#999"
          />
        </View>
      </View>
    </Animated.View>
  );

  const renderStepTwo = () => (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.title}>What are you interested in?</Text>
      <Text style={[styles.subtitle, { marginBottom: 30 }]}>
        {selectedInterests.length < 3 
          ? `Choose at least ${3 - selectedInterests.length} more` 
          : 'Great! Choose more or continue'}
      </Text>
      
      <View style={styles.interestsGrid}>
        {INTERESTS.map((interest) => {
          const isSelected = selectedInterests.includes(interest.id);
          return (
            <TouchableOpacity
              key={interest.id}
              style={[
                styles.interestItem,
                isSelected && styles.selectedInterestItem
              ]}
              onPress={() => toggleInterest(interest.id)}
            >
              <MaterialCommunityIcons 
                name={interest.icon as any} 
                size={24} 
                color={isSelected ? '#fff' : '#333'} 
              />
              <Text style={[
                styles.interestText,
                isSelected && styles.selectedInterestText
              ]}>
                {interest.name}
              </Text>
              {isSelected && (
                <View style={styles.checkmark}>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );

  const renderStepThree = () => (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.title}>Tell us about yourself</Text>
      <Text style={styles.subtitle}>This will help others get to know you better</Text>
      
      <View style={[styles.inputContainer, { marginTop: 30 }]}>
        <Text style={styles.label}>Bio</Text>
        <View style={[styles.inputWrapper, { height: 120 }]}>
          <TextInput
            style={[styles.input, { height: '100%', textAlignVertical: 'top' }]}
            placeholder="Share a bit about yourself, your skills, and what you're looking for..."
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
            placeholderTextColor="#999"
          />
        </View>
      </View>
      
      <View style={styles.tipContainer}>
        <MaterialIcons name="lightbulb" size={20} color="#FFD700" />
        <Text style={styles.tipText}>
          A great bio helps others understand who you are and what you're passionate about.
        </Text>
      </View>
    </Animated.View>
  );

  const renderStepIndicator = () => (
    <View style={styles.stepIndicatorContainer}>
      {[1, 2, 3].map((i) => (
        <View 
          key={i} 
          style={[
            styles.stepDot, 
            i === step && styles.activeStepDot,
            i < step && styles.completedStepDot
          ]}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {renderStepIndicator()}
          
          {step === 1 && renderStepOne()}
          {step === 2 && renderStepTwo()}
          {step === 3 && renderStepThree()}
          
          <View style={styles.buttonContainer}>
            {step > 1 && (
              <TouchableOpacity 
                style={[styles.navButton, styles.backButton]} 
                onPress={handleBack}
                disabled={isLoading}
              >
                <Ionicons name="arrow-back" size={20} color="#333" />
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[
                styles.navButton, 
                styles.nextButton,
                isNextDisabled() && styles.nextButtonDisabled
              ]} 
              onPress={handleNext}
              disabled={isNextDisabled() || isLoading}
            >
              <Text style={styles.nextButtonText}>
                {step === 3 ? 'Complete Profile' : 'Continue'}
              </Text>
              {step < 3 && <Ionicons name="arrow-forward" size={20} color="white" />}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 40,
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 10,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 4,
  },
  activeStepDot: {
    width: 24,
    backgroundColor: '#E60023',
  },
  completedStepDot: {
    backgroundColor: '#4CAF50',
  },
  stepContainer: {
    flex: 1,
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 40,
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
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 30,
    backgroundColor: '#E60023',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
  },
  prefix: {
    fontSize: 16,
    color: '#666',
    marginRight: 4,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginTop: 8,
  },
  interestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    margin: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedInterestItem: {
    backgroundColor: '#E60023',
    borderColor: '#E60023',
  },
  interestText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    fontWeight: '500',
  },
  selectedInterestText: {
    color: '#fff',
  },
  checkmark: {
    marginLeft: 8,
  },
  tipContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff8e1',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#5d4037',
    marginLeft: 12,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    minWidth: 120,
  },
  backButton: {
    backgroundColor: '#f0f0f0',
  },
  backButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  nextButton: {
    backgroundColor: '#E60023',
    flex: 1,
    marginLeft: 16,
  },
  nextButtonDisabled: {
    backgroundColor: '#ffcdd2',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default ProfileSetupUI;