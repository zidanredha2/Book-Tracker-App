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
    
    const addToRead = async (book) => {
        const updatedList = [...toRead, book];
        setToRead(updatedList);
        await AsyncStorage.setItem('toReadList', JSON.stringify(updatedList));
    }

    const moveToDone = async (book) => {
        const updatedToRead = toRead.filter(b => b.id !== book.id);
        setToRead(updatedToRead);
        await AsyncStorage.setItem('toReadList', JSON.stringify(updatedToRead));
        const UpdatedDone = [...doneReading, book];
        setDoneReading(UpdatedDone);
        await AsyncStorage.setItem('doneList', JSON.stringify(UpdatedDone));
    }
    return (
    <BookContext.Provider value={{ toRead, doneReading, addToRead, moveToDone }}>
      {children}
    </BookContext.Provider>
  );
}