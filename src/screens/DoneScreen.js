import React, { useContext } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { BookContext } from '../context/BookContext';

export default function DoneScreen({ navigation }) {
  const { doneReading } = useContext(BookContext);

  return (
    <View style={styles.container}>
      {doneReading.length === 0 ? (
        <Text style={styles.emptyText}>No finished books yet. Keep reading! 📖</Text>
      ) : (
        <FlatList
          data={doneReading}
          keyExtractor={(item) => item.id || item.key || Math.random().toString()}
          renderItem={({ item }) => {
            const displayTitle = item.volumeInfo?.title || item.title || 'Unknown Title';
            const displayCover = item.volumeInfo?.imageLinks?.thumbnail || 
                                 (item.cover_i ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg` : null);

            return (
              <TouchableOpacity 
                style={styles.bookCard}
                onPress={() => navigation.navigate('BookDetail', { item })}
              >
                {displayCover ? (
                  <Image source={{ uri: displayCover.replace('http://', 'https://') }} style={styles.cover} />
                ) : (
                  <View style={[styles.cover, styles.placeholderCover]}>
                    <Text style={styles.placeholderText}>No Image</Text>
                  </View>
                )}
                <View style={styles.details}>
                  <Text style={styles.title}>{displayTitle}</Text>
                  <Text style={styles.celebrate}>Completed! ✓</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#0f172a' },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#94a3b8', fontStyle: 'italic' },
  bookCard: { flexDirection: 'row', padding: 12, marginVertical: 6, backgroundColor: '#1e293b', borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  cover: { width: 50, height: 75, borderRadius: 4 },
  placeholderCover: { backgroundColor: '#334155', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 10, color: '#cbd5e1', textAlign: 'center' },
  details: { flex: 1, marginLeft: 12 },
  title: { fontSize: 14, fontWeight: 'bold', color: '#f8fafc' },
  celebrate: { fontSize: 12, color: '#10b981', marginTop: 4, fontWeight: '600' }
});