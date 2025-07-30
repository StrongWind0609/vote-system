"use client";

import { useState, useEffect, useCallback } from 'react';
import { Contestant, VotingWindow } from '../types';
import { fetchContestants, getVotingWindow } from '../utils/api';

interface UseContestantsReturn {
  contestants: Contestant[];
  votingWindow: VotingWindow | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useContestants = (pollingInterval: number = 5000): UseContestantsReturn => {
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [votingWindow, setVotingWindow] = useState<VotingWindow | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      
      // Fetch contestants and voting window in parallel
      const [contestantsResponse, votingWindowResponse] = await Promise.all([
        fetchContestants(),
        getVotingWindow(),
      ]);

      if (contestantsResponse.success) {
        setContestants(contestantsResponse.data);
      } else {
        setError(contestantsResponse.message || 'Failed to fetch contestants');
      }

      if (votingWindowResponse.success) {
        setVotingWindow(votingWindowResponse.data);
      } else {
        setError(votingWindowResponse.message || 'Failed to fetch voting window');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Set up polling for real-time updates
  useEffect(() => {
    if (pollingInterval <= 0) return;

    const interval = setInterval(() => {
      fetchData();
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [fetchData, pollingInterval]);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    await fetchData();
  }, [fetchData]);

  return {
    contestants,
    votingWindow,
    isLoading,
    error,
    refetch,
  };
}; 