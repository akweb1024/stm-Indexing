import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './client';
import { useAuthStore } from '../store/authStore';

export const subscribeToAuthStateChanges = () => {
  onAuthStateChanged(auth, (user) => {
    useAuthStore.getState().setUser(user);
  });
};
