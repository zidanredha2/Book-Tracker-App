import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BookProvider } from './src/context/BookContext';
import SearchScreen from './src/screens/SearchScreen';

export default function App() {
  return (
    <BookProvider>
      <View style={styles.fallback}>
        <SearchScreen />
      </View>
    </BookProvider>
  );
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingTop: 50,
  },
});