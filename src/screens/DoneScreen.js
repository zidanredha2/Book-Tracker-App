import React, { useContext } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { BookContext } from '../context/BookContext';

export default function DoneScreen() {
  const { doneReading } = useContext(BookContext);

  return (
    <View style={styles.container}>
      {doneReading.length === 0 ? (
        <Text style={styles.emptyText}>No finished books yet. Keep reading! 📖</Text>
      ) : (
        <FlatList
          data={doneReading}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.bookCard}>
              <Image source={{ uri: item.volumeInfo.imageLinks?.thumbnail?.replace('http://', 'https://') }} style={styles.cover} />
              <View style={styles.details}>
                <Text style={styles.title}>{item.volumeInfo.title}</Text>
                <Text style={styles.celebrate}>Completed! ✓</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#888' },
  bookCard: { flexDirection: 'row', padding: 12, marginVertical: 6, backgroundColor: '#f1f8e9', borderRadius: 8, alignItems: 'center' },
  cover: { width: 50, height: 75, borderRadius: 4 },
  details: { flex: 1, marginLeft: 12 },
  title: { fontSize: 14, fontWeight: 'bold' },
  celebrate: { fontSize: 12, color: 'green', marginTop: 4, fontWeight: '600' }
});