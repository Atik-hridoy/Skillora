import React from 'react';
import { FlatList, Image, StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Sample data for the grid
const samplePins = [
  {
    id: '1',
    imageUrl: 'https://picsum.photos/400/600?random=1',
    title: 'Beautiful Landscape',
    user: 'nature_lover',
  },
  {
    id: '2',
    imageUrl: 'https://picsum.photos/400/800?random=2',
    title: 'Mountain View',
    user: 'adventurer',
  },
  {
    id: '3',
    imageUrl: 'https://picsum.photos/400/500?random=3',
    title: 'City Lights',
    user: 'urban_explorer',
  },
  {
    id: '4',
    imageUrl: 'https://picsum.photos/400/700?random=4',
    title: 'Beach Sunset',
    user: 'beach_bum',
  },
];

const numColumns = 2;
const { width } = Dimensions.get('window');
const itemWidth = (width - 36) / numColumns;

interface PinItemProps {
  item: {
    id: string;
    imageUrl: string;
    title: string;
    user: string;
  };
}

const PinItem = ({ item }: PinItemProps) => {
  return (
    <View style={[styles.pinContainer, { width: itemWidth }]}>
      <TouchableOpacity style={styles.pinButton}>
        <Image source={{ uri: item.imageUrl }} style={styles.pinImage} />
        <View style={styles.pinInfo}>
          <Text style={styles.pinTitle} numberOfLines={2}>{item.title}</Text>
          <View style={styles.pinUser}>
            <Ionicons name="person-circle-outline" size={16} color="#767676" />
            <Text style={styles.pinUsername}>{item.user}</Text>
          </View>
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const HomeBody = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={samplePins}
        renderItem={({ item }) => <PinItem item={item} />}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  pinContainer: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f8f8f8',
  },
  pinButton: {
    width: '100%',
  },
  pinImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#e1e1e1',
  },
  pinInfo: {
    padding: 8,
  },
  pinTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  pinUser: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pinUsername: {
    marginLeft: 4,
    fontSize: 12,
    color: '#767676',
  },
  saveButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#e60023',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
});

export default HomeBody;
