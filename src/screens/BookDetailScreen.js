import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, Button, Modal, TouchableOpacity } from 'react-native';
import { BookContext } from '../context/BookContext';

export default function BookDetailScreen({ route }) {
  const { item } = route.params;
  const { addToRead } = useContext(BookContext);

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState({ description: '', rating: 'N/A', publishers: 'N/A' });
  const [modalVisible, setModalVisible] = useState(false);

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

  const coverUrl = item.cover_i 
    ? (typeof item.cover_i === 'number' || !item.cover_i.startsWith('http') 
        ? `https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg` 
        : item.cover_i)
    : null; 

  const handleAddToRead = () => {
    try {
      const formattedBook = {
        id: item.key || Math.random().toString(),
        volumeInfo: {
          title: item.title || 'Unknown Title',
          authors: item.author_name || ['Unknown Author'],
          imageLinks: {
            thumbnail: coverUrl
          }
        }
      };
      addToRead(formattedBook);
      setModalVisible(true);
    } catch (error) {
      alert("Could not save the book.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.headerSection}>
          {coverUrl ? (
            <Image source={{ uri: coverUrl }} style={styles.mainCover} resizeMode="cover" />
          ) : (
            <View style={styles.placeholderCover}>
              <Text style={styles.placeholderText}>No Image</Text>
            </View>
          )}
          <View style={styles.headerMeta}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.author}>By: {item.author_name ? item.author_name.join(', ') : 'Unknown'}</Text>
            <Text style={styles.ratingBadge}>⭐ {loading ? '...' : details.rating}</Text>
          </View>
        </View>

        <Button title="+ Add to Want to Read List" onPress={handleAddToRead} color="#2563eb" />

        <View style={styles.divider} />

        <View style={styles.specsBox}>
          <Text style={styles.specTitle}>Book Details</Text>
          <Text style={styles.specText}><Text style={styles.boldLabel}>First Published:</Text> {item.first_publish_year || 'N/A'}</Text>
          <Text style={styles.specText}><Text style={styles.boldLabel}>Publishers:</Text> {loading ? '...' : details.publishers}</Text>
          <Text style={styles.specText}><Text style={styles.boldLabel}>Languages Available:</Text> {item.language ? item.language.slice(0, 4).join(', ').toUpperCase() : 'N/A'}</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionHeading}>Synopsis</Text>
        {loading ? (
          <ActivityIndicator size="small" color="#60a5fa" style={{ marginVertical: 20 }} />
        ) : (
          <Text style={styles.synopsisText}>{details.description}</Text>
        )}
      </ScrollView>

      {/* Re-added & Dark-Mode Theme Matched Modal Layer */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>List Updated! 📚</Text>
            <Text style={styles.modalMessage}>"{item.title}" has been added back to your Want to Read list.</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 20, paddingBottom: 40 },
  headerSection: { flexDirection: 'row', marginBottom: 20, gap: 15 },
  mainCover: { width: 110, height: 165, borderRadius: 6 },
  placeholderCover: { width: 110, height: 165, backgroundColor: '#334155', justifyContent: 'center', alignItems: 'center', borderRadius: 6 },
  placeholderText: { fontSize: 12, color: '#cbd5e1' },
  headerMeta: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#f8fafc', marginBottom: 6 },
  author: { fontSize: 14, color: '#cbd5e1', marginBottom: 8 },
  ratingBadge: { backgroundColor: '#f1c40f', color: '#000000', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, fontWeight: 'bold', alignSelf: 'flex-start', fontSize: 13 },
  divider: { height: 1, backgroundColor: '#334155', marginVertical: 20 },
  specsBox: { backgroundColor: '#1e293b', padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#334155' },
  specTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 10, color: '#f8fafc' },
  specText: { fontSize: 13, color: '#94a3b8', marginBottom: 6 },
  boldLabel: { fontWeight: 'bold', color: '#cbd5e1' },
  sectionHeading: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#f8fafc' },
  synopsisText: { fontSize: 14, lineHeight: 22, color: '#cbd5e1', textAlign: 'justify' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: 280, backgroundColor: '#1e293b', borderRadius: 12, borderWidth: 1, borderColor: '#334155', padding: 20, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#f8fafc', marginBottom: 10 },
  modalMessage: { fontSize: 14, color: '#cbd5e1', textAlign: 'center', marginBottom: 20 },
  modalButton: { backgroundColor: '#2563eb', paddingHorizontal: 30, paddingVertical: 8, borderRadius: 6 },
  modalButtonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 }
});