import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { BookContext } from '../context/BookContext';

export default function BookDetailScreen({ route }) {
  // Get the book item passed from the Search Screen
  const { item } = route.params;
  const { addToRead } = useContext(BookContext);

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState({ description: '', rating: 'N/A', publishers: 'N/A' });

  useEffect(() => {
    const fetchFullDetails = async () => {
      try {
        const res = await fetch(`https://openlibrary.org${item.key}.json`);
        const data = await res.json();

        let fullDesc = 'No summary available for this book profile.';
        if (data.description) {
          fullDesc = typeof data.description === 'string' ? data.description : data.description.value;
        }

        const ratingRes = await fetch(`https://openlibrary.org${item.key}/ratings.json`);
        const ratingData = await ratingRes.json();
        const finalRating = ratingData.summary?.average ? `${ratingData.summary.average.toFixed(1)} / 5.0` : 'No reviews yet';

        setDetails({
          description: fullDesc,
          rating: finalRating,
          publishers: item.publisher ? item.publisher.slice(0, 3).join(', ') : 'Unknown'
        });
      } catch (error) {
        setDetails(prev => ({ ...prev, description: 'Failed to load deeper insights.' }));
      } finally {
        setLoading(false);
      }
    };

    fetchFullDetails();
  }, [item]);

  const coverUrl = item.cover_i ? `https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg` : null; // Uses '-L' for Large High-Res image

  const normalizedBook = {
    id: item.key,
    volumeInfo: {
      title: item.title,
      authors: item.author_name || ['Unknown Author'],
      imageLinks: { thumbnail: coverUrl }
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerSection}>
        {coverUrl ? (
          <Image source={{ uri: coverUrl }} style={styles.mainCover} resizeMode="cover" />
        ) : (
          <View style={styles.placeholderCover}><Text>No Image</Text></View>
        )}
        <View style={styles.headerMeta}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.author}>By: {item.author_name ? item.author_name.join(', ') : 'Unknown'}</Text>
          <Text style={styles.ratingBadge}>⭐ {loading ? '...' : details.rating}</Text>
        </View>
      </View>

      <Button title="+ Add to Want to Read List" onPress={() => addToRead(normalizedBook)} color="#2ECC71" />

      <View style={styles.divider} />

      <View style={styles.specsBox}>
        <Text style={styles.specTitle}>Book Details</Text>
        <Text style={styles.specText}><Text style={styles.boldLabel}>First Published:</Text> {item.first_publish_year || 'N/A'}</Text>
        <Text style={styles.specText}><Text style={styles.boldLabel}>Publishers:</Text> {loading ? '...' : details.publishers}</Text>
        <Text style={styles.specText}><Text style={styles.boldLabel}>Languages Available:</Text> {item.language ? item.language.slice(0, 4).join(', ').toUpperCase() : 'N/A'}</Text>
      </View>

      <View style={styles.divider} />

      {/* Synopsis Section */}
      <Text style={styles.sectionHeading}>Synopsis</Text>
      {loading ? (
        <ActivityIndicator size="small" color="#4A90E2" style={{ marginVertical: 20 }} />
      ) : (
        <Text style={styles.synopsisText}>{details.description}</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20, paddingBottom: 40 },
  headerSection: { flexDirection: 'row', marginBottom: 20, gap: 15 },
  mainCover: { width: 110, height: 165, borderRadius: 6, elevation: 5 },
  placeholderCover: { width: 110, height: 165, backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center', borderRadius: 6 },
  headerMeta: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#111', marginBottom: 6 },
  author: { fontSize: 14, color: '#555', marginBottom: 8 },
  ratingBadge: { backgroundColor: '#f1c40f', color: '#000', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, fontWeight: 'bold', alignSelf: 'flex-start', fontSize: 13 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 20 },
  specsBox: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
  specTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  specText: { fontSize: 13, color: '#666', marginBottom: 6 },
  boldLabel: { fontWeight: 'bold', color: '#444' },
  sectionHeading: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#222' },
  synopsisText: { fontSize: 14, lineHeight: 22, color: '#444', textAlign: 'justify' }
});