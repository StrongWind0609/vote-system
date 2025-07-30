"use client";

import { useState, useEffect, useCallback } from 'react';
import { Contestant, VoteState, GlobalVoteState } from '../types';
import { getVoteState, setVoteState, getGlobalVoteState, setGlobalVoteState } from '../utils/storage';
import { submitVote } from '../utils/api';

interface UseVotingReturn {
  hasVoted: boolean;
  isSubmitting: boolean;
  error: string | null;
  hasVotedForOther: boolean;
  handleVote: () => Promise<void>;
  resetVote: () => void;
}

export const useVoting = (contestantId: string): UseVotingReturn => {
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasVotedForOther, setHasVotedForOther] = useState<boolean>(false);

  // Load global vote state from localStorage on mount
  useEffect(() => {
    const globalVoteState = getGlobalVoteState();
    if (globalVoteState?.hasVoted) {
      // Check if this contestant is the one that was voted for
      if (globalVoteState.contestantId === contestantId) {
        setHasVoted(true);
        setHasVotedForOther(false);
      } else {
        // User has voted for a different contestant, so this one should be disabled
        setHasVoted(false);
        setHasVotedForOther(true);
      }
    } else {
      setHasVoted(false);
      setHasVotedForOther(false);
    }
  }, [contestantId]);

  // Auto-clear error messages after 4 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleVote = useCallback(async () => {
    if (hasVoted || isSubmitting) {
      return;
    }

    // Check if user has already voted for any contestant
    const globalVoteState = getGlobalVoteState();
    if (globalVoteState?.hasVoted) {
      setError('You have already voted for a contestant. You can only vote once.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await submitVote(contestantId);
      
      if (response.success) {
        setHasVoted(true);
        // Set global vote state instead of per-contestant state
        setGlobalVoteState(contestantId, true);
      } else {
        setError(response.message || 'Failed to submit vote');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }, [contestantId, hasVoted, isSubmitting]);

  const resetVote = useCallback(() => {
    setHasVoted(false);
    setError(null);
    setGlobalVoteState(null, false);
  }, []);

  return {
    hasVoted,
    isSubmitting,
    error,
    hasVotedForOther,
    handleVote,
    resetVote,
  };
}; 