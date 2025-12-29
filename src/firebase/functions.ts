import { httpsCallable } from 'firebase/functions';
import { functions } from './client';

export const callFunction = async <T>(functionName: string, data?: object) => {
  const callable = httpsCallable(functions, functionName);
  const result = await callable(data);
  return result.data as T;
};
