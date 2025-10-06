import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import HomeAppBar from './HomeAppBar';
import HomeBody from './HomeBody';
import HomeNavBar from './HomeNavBar';

const HomeView = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appBarContainer}>
        <HomeAppBar />
      </View>
      <View style={styles.bodyContainer}>
        <HomeBody />
      </View>
      <View style={styles.navBarContainer}>
        <HomeNavBar />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  appBarContainer: {
    zIndex: 100,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  bodyContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  navBarContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
    backgroundColor: '#fff',
  },
});

export default HomeView;
