import React, {useContext} from 'react';
import {View, Text, FlatList, Image, Button, StyleSheet} from 'react-native';
import {BookContext} from "../context/BookContext";

export default function ToReadScreen() {
    const {toRead, moveToDone} = useContext(BookContext);

    return(
        <View style={styles.container}>
            {toRead.length===0 ? (
                <Text style={styles.emptyText}>Your list is empty. Go search for some books!</Text>
            ): (
                <FlatList 
                    data={toRead}
                    keyExtractor={(item)=> item.id}
                    renderItem= {({item})=> (
                        <View style={styles.bookCard}>
                            <Image source={{uri: item.volumeInfo.imageLinks?.thumbnail?.replace('http://', 'https://')}} style={styles.cover} />
                            <View style={styles.details}>
                                <Text style={styles.title}>{item.volumeInfo.title}</Text>
                                <Button title="Mark as Done" onPress={() => moveToDone(item)} color="#9B59B6"/>
                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#888' },
  bookCard: { flexDirection: 'row', padding: 12, marginVertical: 6, backgroundColor: '#f9f9f9', borderRadius: 8, alignItems: 'center' },
  cover: { width: 50, height: 75, borderRadius: 4 },
  details: { flex: 1, marginLeft: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 14, fontWeight: 'bold', width: '60%' }
});