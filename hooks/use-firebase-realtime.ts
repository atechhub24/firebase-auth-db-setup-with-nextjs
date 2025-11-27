"use client";

import { getArrFromNestedSnap, getArrFromSnap } from "@ashirbad/js-core";
import { getApps } from "firebase/app";
import {
  getDatabase,
  off,
  onValue,
  ref,
  type DataSnapshot,
} from "firebase/database";
import { useEffect, useState } from "react";

interface UseFirebaseRealtimeOptions<T> {
  asArray?: boolean; // default: true (converts object to array)
  nested?: boolean; // default: false (use getArrFromNestedSnap for nested data)
  filter?: (item: T) => boolean; // client-side filtering
  sort?: (a: T, b: T) => number; // sorting function
  enabled?: boolean; // allow disabling subscription (default: true)
}

interface UseFirebaseRealtimeReturn<T> {
  data: T[] | Record<string, T> | null;
  loading: boolean;
  error: Error | null;
}

export function useFirebaseRealtime<T>(
  path: string,
  options?: UseFirebaseRealtimeOptions<T>,
): UseFirebaseRealtimeReturn<T> {
  const {
    asArray = true,
    nested = false,
    filter,
    sort,
    enabled = true,
  } = options || {};

  const [data, setData] = useState<T[] | Record<string, T> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Don't subscribe if disabled
    if (!enabled) {
      setLoading(false);
      setData(null);
      setError(null);
      return;
    }

    // Get Firebase app
    const app = getApps().length ? getApps()[0] : undefined;
    if (!app) {
      const err = new Error("Firebase app not initialized");
      setError(err);
      setLoading(false);
      console.error("Firebase app not initialized");
      return;
    }

    // Get database instance
    const database = getDatabase(app);
    const databaseRef = ref(database, path);

    // Set loading to true when starting subscription
    setLoading(true);
    setError(null);

    // Subscribe to real-time updates
    const unsubscribe = onValue(
      databaseRef,
      (snapshot: DataSnapshot) => {
        try {
          // Check if snapshot exists
          if (!snapshot.exists()) {
            setData(asArray ? ([] as T[]) : ({} as Record<string, T>));
            setLoading(false);
            return;
          }

          let processedData: T[] | Record<string, T>;

          if (!asArray) {
            // Return object as-is
            processedData = snapshot.val() as Record<string, T>;
          } else if (nested) {
            // Use getArrFromNestedSnap for nested structures
            processedData = getArrFromNestedSnap(snapshot) as T[];
          } else {
            // Use getArrFromSnap for simple array conversion
            processedData = getArrFromSnap(snapshot) as T[];
          }

          // Apply filter if provided (only for arrays)
          if (asArray && Array.isArray(processedData) && filter) {
            processedData = processedData.filter(filter);
          }

          // Apply sort if provided (only for arrays)
          if (asArray && Array.isArray(processedData) && sort) {
            processedData = [...processedData].sort(sort);
          }

          setData(processedData);
          setLoading(false);
          setError(null);
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));
          setError(error);
          setLoading(false);
          console.error("Error processing Firebase snapshot:", error);
        }
      },
      (err) => {
        // Handle subscription errors
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        setLoading(false);
        console.error("Firebase subscription error:", error);
      },
    );

    // Cleanup function
    return () => {
      off(databaseRef);
      unsubscribe();
    };
    // Note: filter and sort are intentionally not in dependencies
    // They're applied in the onValue callback, avoiding unnecessary re-subscriptions
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, asArray, nested, enabled]);

  return {
    data,
    loading,
    error,
  };
}
