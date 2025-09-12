import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useEffect, useCallback, useRef, useState } from 'react';
import { supabase, supabaseHelpers } from '@/lib/supabase';
import { useToast } from '@/shared/hooks/use-toast';
import { appStore } from '@/store/appStore';

export interface RealtimeSyncProps {
  pillar: 'hydration' | 'nutrition' | 'sleep' | 'workout';
  onUpdate: (payload: any) => void;
  userId?: string;
  autoSync?: boolean;
  syncInterval?: number; // in ms
}

export interface SyncStatus {
  isConnected: boolean;
  lastSync: Date | null;
  error: string | null;
  pendingChanges: number;
}

export const useRealtimeSync = ({
  pillar,
  onUpdate,
  userId: propUserId,
  autoSync = true,
  syncInterval = 30000, // 30 seconds
}: RealtimeSyncProps) => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isConnected: false,
    lastSync: null,
    error: null,
    pendingChanges: 0,
  });

  const { toast, success, info } = useToast();
  const channelRef = useRef<any>(null);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pendingChangesRef = useRef<any[]>([]);

  // Get user ID from props or store
  const storeUserId = appStore((state) => state.appStoreUser?.id);
  const userId = propUserId || storeUserId;

  // Get table name based on pillar
  const getTableName = useCallback((pillar: string) => {
    switch (pillar) {
      case 'hydration':
        return 'hydration_data';
      case 'nutrition':
        return 'nutrition_data';
      case 'sleep':
        return 'sleep_data';
      case 'workout':
        return 'workout_data';
      default:
        return '';
    }
  }, []);

  // Handle realtime updates
  const handleRealtimeUpdate = useCallback((payload: any) => {
    try {
      console.log(`Realtime update for ${pillar}:`, payload);
      
      setSyncStatus(prev => ({
        ...prev,
        lastSync: new Date(),
        error: null,
      }));

      // Call the provided update callback
      onUpdate(payload);

      // Show notification for changes from other sources
      if (payload.eventType !== 'INSERT' || payload.new?.user_id !== userId) {
        info('Données synchronisées', `Nouvelles données ${pillar} disponibles`);
      }
    } catch (error) {
      console.error('Error handling realtime update:', error);
      setSyncStatus(prev => ({
        ...prev,
        error: 'Erreur de synchronisation en temps réel',
      }));
    }
  }, [pillar, onUpdate, userId, toast]);

  // Connect to realtime channel
  const connectRealtime = useCallback(() => {
    if (!userId) {
      console.warn('Cannot connect to realtime: no user ID');
      return;
    }

    const tableName = getTableName(pillar);
    if (!tableName) {
      console.error('Invalid pillar for realtime sync:', pillar);
      return;
    }

    try {
      // Disconnect existing channel
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }

      // Create new channel
      const channel = supabase
        .channel(`${tableName}_${userId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: tableName,
            filter: `user_id=eq.${userId}`,
          },
          handleRealtimeUpdate
        )
        .subscribe((status: string) => {
          console.log(`Realtime subscription status for ${pillar}:`, status);
          setSyncStatus(prev => ({
            ...prev,
            isConnected: status === 'SUBSCRIBED',
            error: status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' 
              ? 'Erreur de connexion temps réel' 
              : null,
          }));

          if (status === 'SUBSCRIBED') {
            success('Synchronisation activée', `Données ${pillar} en temps réel`);
          }
        });

      channelRef.current = channel;
    } catch (error) {
      console.error('Error connecting to realtime:', error);
      setSyncStatus(prev => ({
        ...prev,
        isConnected: false,
        error: 'Impossible de se connecter à la synchronisation temps réel',
      }));
    }
  }, [userId, pillar, getTableName, handleRealtimeUpdate, toast]);

  // Disconnect from realtime
  const disconnectRealtime = useCallback(() => {
    if (channelRef.current) {
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }

    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
      syncIntervalRef.current = null;
    }

    setSyncStatus(prev => ({
      ...prev,
      isConnected: false,
    }));
  }, []);

  // Manual sync function
  const syncData = useCallback(async () => {
    if (!userId) return;

    try {
      const tableName = getTableName(pillar);
      if (!tableName) return;

      // Fetch latest data
      const data = await supabaseHelpers.fetchData(
        tableName,
        userId,
        undefined, // dateFrom
        undefined, // dateTo
        50 // limit to recent data
      );

      // Trigger update with fetched data
      onUpdate({
        eventType: 'SYNC',
        new: data,
        old: null,
        schema: 'public',
        table: tableName,
      });

      setSyncStatus(prev => ({
        ...prev,
        lastSync: new Date(),
        error: null,
      }));

      return data;
    } catch (error) {
      console.error('Error during manual sync:', error);
      setSyncStatus(prev => ({
        ...prev,
        error: 'Erreur lors de la synchronisation manuelle',
      }));
      throw error;
    }
  }, [userId, pillar, getTableName, onUpdate]);

  // Add pending change
  const addPendingChange = useCallback((change: any) => {
    pendingChangesRef.current.push(change);
    setSyncStatus(prev => ({
      ...prev,
      pendingChanges: pendingChangesRef.current.length,
    }));
  }, []);

  // Process pending changes
  const processPendingChanges = useCallback(async () => {
    if (pendingChangesRef.current.length === 0) return;

    try {
      const changes = [...pendingChangesRef.current];
      pendingChangesRef.current = [];
      
      setSyncStatus(prev => ({
        ...prev,
        pendingChanges: 0,
      }));

      // Process each change
      for (const change of changes) {
        await change.execute();
      }

      success('Synchronisation', 'Changements locaux synchronisés');
    } catch (error) {
      console.error('Error processing pending changes:', error);
      // Re-add failed changes
      pendingChangesRef.current.unshift(...pendingChangesRef.current);
      setSyncStatus(prev => ({
        ...prev,
        pendingChanges: pendingChangesRef.current.length,
        error: 'Erreur lors de la synchronisation des changements',
      }));
    }
  }, [toast]);

  // Setup auto-sync interval
  useEffect(() => {
    if (!autoSync || !userId) return;

    syncIntervalRef.current = setInterval(() => {
      if (syncStatus.isConnected && pendingChangesRef.current.length > 0) {
        processPendingChanges();
      }
    }, syncInterval);

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [autoSync, userId, syncInterval, processPendingChanges, syncStatus.isConnected]);

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    if (userId && autoSync) {
      connectRealtime();
    }

    return () => {
      disconnectRealtime();
    };
  }, [userId, autoSync, connectRealtime, disconnectRealtime]);

  // Reconnect when userId changes
  useEffect(() => {
    if (userId && syncStatus.isConnected) {
      disconnectRealtime();
      setTimeout(connectRealtime, 1000); // Small delay to ensure clean disconnect
    }
  }, [userId, connectRealtime, disconnectRealtime, syncStatus.isConnected]);

  return {
    syncStatus,
    syncData,
    connectRealtime,
    disconnectRealtime,
    addPendingChange,
    processPendingChanges,
    
    // Convenience getters
    isConnected: syncStatus.isConnected,
    lastSync: syncStatus.lastSync,
    hasError: !!syncStatus.error,
    error: syncStatus.error,
    hasPendingChanges: syncStatus.pendingChanges > 0,
    pendingChangesCount: syncStatus.pendingChanges,
  };
};

// Higher-order hook for specific pillars
export const useHydrationSync = (onUpdate: (payload: any) => void, userId?: string) =>
  useRealtimeSync({ pillar: 'hydration', onUpdate, userId });

export const useNutritionSync = (onUpdate: (payload: any) => void, userId?: string) =>
  useRealtimeSync({ pillar: 'nutrition', onUpdate, userId });

export const useSleepSync = (onUpdate: (payload: any) => void, userId?: string) =>
  useRealtimeSync({ pillar: 'sleep', onUpdate, userId });

export const useWorkoutSync = (onUpdate: (payload: any) => void, userId?: string) =>
  useRealtimeSync({ pillar: 'workout', onUpdate, userId });

export default useRealtimeSync;