"use client";
import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { setAuthTokenProvider, setAuthReady } from '@/lib/api';

export default function AuthTokenBridge() {
  const { getToken, isLoaded } = useAuth();

  useEffect(() => {
    setAuthReady(isLoaded);
    // Register a provider that fetches the latest JWT from Clerk on demand
    setAuthTokenProvider(async () => {
      if (!isLoaded) return null;
      try {
        return await getToken({ template: 'default' });
      } catch {
        return null;
      }
    });

    return () => {
      setAuthTokenProvider(null);
    };
  }, [getToken, isLoaded]);

  return null;
}


