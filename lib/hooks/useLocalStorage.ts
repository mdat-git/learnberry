'use client';

import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): [T, Dispatch<SetStateAction<T>>, boolean] {
  const [value, setValue] = useState<T>(defaultValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setHydrated(true);
      return;
    }
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (isPlainObject(parsed) && isPlainObject(defaultValue)) {
          setValue({ ...(defaultValue as object), ...parsed } as T);
        } else {
          setValue(parsed as T);
        }
      }
    } catch {
      // ignore: corrupt JSON, quota errors, blocked storage
    }
    setHydrated(true);
    // defaultValue intentionally excluded — we only hydrate once per key
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    if (typeof window === 'undefined') return;
    const t = setTimeout(() => {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // ignore: quota errors, blocked storage
      }
    }, 500);
    return () => clearTimeout(t);
  }, [key, value, hydrated]);

  return [value, setValue, hydrated];
}
