import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Type a title above to begin!');

  const searchBooks = async () => {
    if (!query.trim()) {
      Alert.alert("Empty Search", "Please enter a book name first.");
      return;
    }
    
    setLoading(true);
    setStatusMessage('Searching Open Library...');
    setBooks([]);

    try {
      const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query.trim())}&limit=10`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.docs && data.docs.length > 0) {
        setBooks(data.docs);
        setStatusMessage('');
      } else {
        setStatusMessage(`No results found for "${query}".`);
      }
    } catch (error) {
      setStatusMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <TextInput 
          placeholder="Search by title or author..." 
          value={query} 
          onChangeText={setQuery}
          style={styles.input}
          placeholderTextColor="#888"
        />
        <Button title="Search" onPress={searchBooks} color="#2563eb" />
      </View>

      {loading ? (
  <ActivityIndicator size="large" color="#60a5fa" style={{ marginVertical: 20 }} />
) : null}
      {statusMessage ? <Text style={styles.infoText}>{statusMessage}</Text> : null}

      <FlatList 
        data={books}
        keyExtractor={(item, index) => item.key || index.toString()}
        renderItem={({ item }) => {
          const coverUrl = item.cover_i ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg` : null;

          return (
            // Wrapping the card in a TouchableOpacity to register screen clicks!
            <TouchableOpacity 
              style={styles.bookCard} 
              onPress={() => navigation.navigate('BookDetail', { item })}
            >
              {coverUrl ? (
                <Image source={{ uri: coverUrl }} style={styles.cover} resizeMode="contain" />
              ) : (
                <View style={[styles.cover, styles.placeholderCover]}><Text style={styles.placeholderText}>No Cover</Text></View>
              )}
              
              <View style={styles.details}>
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.author}>By: {item.author_name ? item.author_name.slice(0, 2).join(', ') : 'Unknown'}</Text>
                <Text style={styles.meta}>📅 Year: {item.first_publish_year || 'N/A'}</Text>
                <Text style={styles.viewLink}>View Full Profile →</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#0f172a',
  },
  
  searchBox: {
    flexDirection: 'row',
    marginBottom: 15,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#1e293b',
    color: '#ffffff',
    marginRight: 10,
  },

  infoText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#94a3b8',
    fontSize: 14,
    fontStyle: 'italic',
  },

  bookCard: {
    flexDirection: 'row',
    padding: 12,
    marginVertical: 8,
    backgroundColor: '#1e293b',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },

  cover: {
    width: 70,
    height: 100,
    borderRadius: 6,
  },

  placeholderCover: {
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },

  placeholderText: {
    fontSize: 10,
    color: '#cbd5e1',
  },

  details: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },

  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 4,
  },

  author: {
    fontSize: 13,
    color: '#cbd5e1',
    marginBottom: 4,
  },

  meta: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 8,
  },

  viewLink: {
    color: '#60a5fa',
    fontSize: 12,
    fontWeight: 'bold',
  },
});