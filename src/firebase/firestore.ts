import { doc, getDoc, setDoc, updateDoc, DocumentData } from 'firebase/firestore';
import { db } from './client';

export const getDocument = async <T>(collectionName: string, docId: string): Promise<T | null> => {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as T) : null;
};

export const createDocument = async <T extends DocumentData>(collectionName: string, docId: string, data: T) => {
  const docRef = doc(db, collectionName, docId);
  await setDoc(docRef, data);
};

export const updateDocument = async <T extends DocumentData>(collectionName: string, docId: string, data: Partial<T>) => {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, data as DocumentData);
};
