import { Tabs } from 'expo-router';
import React from 'react';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { SafeAreaView, Platform, View, StatusBar } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors[colorScheme ?? 'light'].background }}>
      <ExpoStatusBar style={Platform.OS === 'ios' ? 'light' : 'dark'} />
      <View style={{ flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
            tabBarStyle: {
              backgroundColor: Colors[colorScheme ?? 'light'].background,
              borderTopWidth: 1,
              borderTopColor: Colors[colorScheme ?? 'light'].border,
              height: Platform.OS === 'ios' ? 90 : 60,
              paddingBottom: Platform.OS === 'ios' ? 30 : 8,
              paddingTop: 8,
              paddingHorizontal: 8,
            },
            headerShown: false,
            headerStatusBarHeight: 0,
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="explore"
            options={{
              title: 'Explore',
              tabBarIcon: ({ color }) => <Ionicons name="search" size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profile',
              tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={color} />,
            }}
          />
        </Tabs>
      </View>
    </SafeAreaView>
  );
}
