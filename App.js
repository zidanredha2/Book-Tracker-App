import React, { useState, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, Button, Text, TouchableOpacity, Platform, StatusBar, ScrollView, Dimensions } from 'react-native';
import { BookProvider } from './src/context/BookContext';
import SearchScreen from './src/screens/SearchScreen';
import BookDetailScreen from './src/screens/BookDetailScreen';
import ToReadScreen from './src/screens/ToReadScreen';
import DoneScreen from './src/screens/DoneScreen';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function App() {
  const [currentTab, setCurrentTab] = useState('Search');
  const [selectedBook, setSelectedBook] = useState(null);
  
  const scrollRef = useRef(null);
  const tabs = ['Search', 'ToRead', 'Done'];

  const navigateToDetail = (bookItem) => {
    setSelectedBook(bookItem);
  };

  const navigateBack = () => {
    setSelectedBook(null);
  };

  const handleTabChange = (tabName, index) => {
    setCurrentTab(tabName);
    scrollRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
  };

  const handleScrollGesture = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const computedIndex = Math.round(offsetX / SCREEN_WIDTH);
    
    if (tabs[computedIndex] && tabs[computedIndex] !== currentTab) {
      setCurrentTab(tabs[computedIndex]);
    }
  };

  return (
    <BookProvider>
      <SafeAreaView style={styles.fallback}>
        <View style={styles.container}>
          
          {/* Top Navbar Section */}
          <View style={styles.navbar}>
            <TouchableOpacity 
              style={currentTab === 'Search' ? [styles.navButton, styles.navButtonActive] : styles.navButton} 
              onPress={() => handleTabChange('Search', 0)}
            >
              <Text style={currentTab === 'Search' ? [styles.navText, styles.navTextActive] : styles.navText}>Search</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={currentTab === 'ToRead' ? [styles.navButton, styles.navButtonActive] : styles.navButton} 
              onPress={() => handleTabChange('ToRead', 1)}
            >
              <Text style={currentTab === 'ToRead' ? [styles.navText, styles.navTextActive] : styles.navText}>To Read</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={currentTab === 'Done' ? [styles.navButton, styles.navButtonActive] : styles.navButton} 
              onPress={() => handleTabChange('Done', 2)}
            >
              <Text style={currentTab === 'Done' ? [styles.navText, styles.navTextActive] : styles.navText}>Finished</Text>
            </TouchableOpacity>
          </View>

          {/* Core Content Area */}
          <View style={styles.mainArea}>
            <ScrollView
              ref={scrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleScrollGesture}
              style={styles.swipeCanvas}
            >
              <View style={{ width: SCREEN_WIDTH }}>
                <SearchScreen navigation={{ navigate: (screenName, params) => navigateToDetail(params.item) }} />
              </View>
              
              <View style={{ width: SCREEN_WIDTH }}>
                <ToReadScreen navigation={{ navigate: (screenName, params) => navigateToDetail(params.item) }} />
              </View>
              
              <View style={{ width: SCREEN_WIDTH }}>
                <DoneScreen navigation={{ navigate: (screenName, params) => navigateToDetail(params.item) }} />
              </View>
            </ScrollView>
          </View>

          {/* Full-Screen Overlay Detail Layer */}
          {selectedBook ? (
            <View style={styles.detailOverlay}>
              <SafeAreaView style={styles.overlaySafeView}>
                <Button title={`← Back to ${currentTab}`} onPress={navigateBack} color="#2563eb" />
                <BookDetailScreen route={{ params: { item: !selectedBook.volumeInfo ? selectedBook : {
                  key: selectedBook.id?.startsWith('/') ? selectedBook.id : `/${selectedBook.id}`,
                  title: selectedBook.volumeInfo?.title,
                  author_name: selectedBook.volumeInfo?.authors,
                  cover_i: selectedBook.volumeInfo?.imageLinks?.thumbnail 
                    ? selectedBook.volumeInfo.imageLinks.thumbnail.split('/').pop().split('-')[0] 
                    : null
                } } }} />
              </SafeAreaView>
            </View>
          ) : null}

        </View>
      </SafeAreaView>
    </BookProvider>
  );
}

const styles = StyleSheet.create({
  fallback: { 
    flex: 1, 
    backgroundColor: '#0f172a',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: { 
    flex: 1, 
  },
  navbar: { 
    flexDirection: 'row', 
    height: 55, 
    backgroundColor: '#1e293b', 
    borderBottomWidth: 1, 
    borderColor: '#334155',
  },
  mainArea: { 
    flex: 1, 
  },
  swipeCanvas: {
    flex: 1,
  },
  navButton: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderBottomWidth: 3,
    borderColor: 'transparent',
  },
  navButtonActive: { 
    borderColor: '#2563eb', 
    backgroundColor: '#0f172a',
  },
  navText: { 
    color: '#94a3b8', 
    fontSize: 13, 
    fontWeight: '600',
  },
  navTextActive: { 
    color: '#ffffff', 
    fontWeight: 'bold',
  },
  detailOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0f172a',
    zIndex: 999,
  },
  overlaySafeView: {
    flex: 1,
  }
});