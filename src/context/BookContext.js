import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BookContext = createContext();

export const BookProvider = ({children}) => {
    const [toRead, setToRead] = useState([]);
    const [doneReading, setDoneReading] = useState([]);

    useEffect(()=> {
        const loadStoredData = async () => {
            const savedToRead = await AsyncStorage.getItem('toReadList');
            const savedDone = await AsyncStorage.getItem('doneReadingList');
            if (savedToRead) setToRead(JSON.parse(savedToRead));
            if (savedDone) setDoneReading(JSON.parse(savedDone));
        };
        loadStoredData();
    }, []);
    
    const getCleanId = (book) => {
        if (!book) return '';
        const rawId = book.id || book.key || '';
        return rawId.replace(/[^a-zA-Z0-9]/g, '');
    };

    const addToRead = async (book) => {
        const targetId = getCleanId(book);
        if (!targetId) return;

        const isAlreadyInToRead = toRead.some(b => getCleanId(b) === targetId);
        if (isAlreadyInToRead) return;

        const updatedToRead = [...toRead, book];
        const updatedDone = doneReading.filter(b => getCleanId(b) !== targetId);

        setToRead(updatedToRead);
        setDoneReading(updatedDone);

        await AsyncStorage.setItem('toReadList', JSON.stringify(updatedToRead));
        await AsyncStorage.setItem('doneReadingList', JSON.stringify(updatedDone));
    };

    const moveToDone = async (book) => {
        const targetId = getCleanId(book);
        if (!targetId) return;

        const updatedToRead = toRead.filter(b => getCleanId(b) !== targetId);
        
        let sanitizedBook = { ...book };
        if (!sanitizedBook.volumeInfo) {
            sanitizedBook = {
                id: book.key || book.id,
                volumeInfo: {
                  title: book.title || 'Unknown Title',
                  authors: book.author_name || ['Unknown Author'],
                  imageLinks: {
                    thumbnail: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null
                  }
                }
            };
        }

        const updatedDone = [...doneReading, sanitizedBook];
        
        setToRead(updatedToRead);
        setDoneReading(updatedDone);
        
        await AsyncStorage.setItem('toReadList', JSON.stringify(updatedToRead));
        await AsyncStorage.setItem('doneReadingList', JSON.stringify(updatedDone));
    };

    return (
    <BookContext.Provider value={{ toRead, doneReading, addToRead, moveToDone }}>
      {children}
    </BookContext.Provider>
  );
};