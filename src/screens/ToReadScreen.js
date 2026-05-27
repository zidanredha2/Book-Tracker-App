import React, { useState, useContext } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { BookContext } from "../context/BookContext";

export default function ToReadScreen({ navigation }) {
    const { toRead, moveToDone } = useContext(BookContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [finishedTitle, setFinishedTitle] = useState('');

    const handleMarkAsDone = (e, item) => {
        e.stopPropagation();
        
        const titleText = item.volumeInfo?.title || item.title || 'This book';
        setFinishedTitle(titleText);
        
        moveToDone(item);
        setModalVisible(true);
    };

    return (
        <View style={styles.container}>
            {toRead.length === 0 ? (
                <Text style={styles.emptyText}>Your list is empty. Go search for some books!</Text>
            ) : (
                <FlatList 
                    data={toRead}
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
                                    <Text style={styles.title} numberOfLines={2}>{displayTitle}</Text>
                                    <TouchableOpacity 
                                        style={styles.doneButton} 
                                        onPress={(e) => handleMarkAsDone(e, item)}
                                    >
                                        <Text style={styles.doneButtonText}>Mark as Done</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            )}

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Congratulations! 🎉</Text>
                        <Text style={styles.modalMessage}>You finished reading "{finishedTitle}"!</Text>
                        <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.modalButtonText}>Awesome</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
  details: { flex: 1, marginLeft: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 14, fontWeight: 'bold', width: '50%', color: '#f8fafc' },
  doneButton: { backgroundColor: '#2563eb', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  doneButtonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: 280, backgroundColor: '#1e293b', borderRadius: 12, borderWidth: 1, borderColor: '#334155', padding: 20, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#f8fafc', marginBottom: 10 },
  modalMessage: { fontSize: 14, color: '#cbd5e1', textAlign: 'center', marginBottom: 20 },
  modalButton: { backgroundColor: '#10b981', paddingHorizontal: 30, paddingVertical: 8, borderRadius: 6 },
  modalButtonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 }
});