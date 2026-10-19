import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export function useStoredData<T>(
  key: string,
  initialValue: T,
  transform?: (stored: T) => T
) {
  const [data, setData] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const saved = await AsyncStorage.getItem(key);
        if (saved !== null && isMounted) {
          let parsed: T;
          try {
            parsed = JSON.parse(saved) as T;
          } catch {
            // Fallback for plain string values stored without JSON.stringify (e.g., '@language')
            parsed = saved as unknown as T;
          }
          setData(transform ? transform(parsed) : parsed);
        }
      } catch (e) {
        console.error(`Failed to load data for key "${key}"`, e);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [key]);

  const setStoredData = async (value: T | ((prev: T) => T)) => {
    try {
      const nextValue = value instanceof Function ? value(data) : value;
      setData(nextValue);
      const serialized =
        typeof nextValue === 'string' ? nextValue : JSON.stringify(nextValue);
      await AsyncStorage.setItem(key, serialized);
    } catch (e) {
      console.error(`Failed to save data for key "${key}"`, e);
    }
  };

  return [data, setStoredData, isLoading] as const;
}
