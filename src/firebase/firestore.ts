const API_URL = 'http://localhost:5050/api';

export const getDocument = async <T>(collectionName: string, docId: string): Promise<T | null> => {
  const response = await fetch(`${API_URL}/${collectionName}/${docId}`);
  if (!response.ok) return null;
  return await response.json();
};

export const getCollection = async <T>(collectionName: string): Promise<T[]> => {
  const response = await fetch(`${API_URL}/${collectionName}`);
  if (!response.ok) return [];
  return await response.json();
};

export const createDocument = async <T>(collectionName: string, data: T) => {
  await fetch(`${API_URL}/${collectionName}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
};

export const updateDocument = async <T>(collectionName: string, docId: string, data: Partial<T>) => {
  await fetch(`${API_URL}/${collectionName}/${docId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
};
