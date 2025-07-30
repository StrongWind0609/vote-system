import { VoteState, GlobalVoteState } from '../types';

const VOTE_STORAGE_KEY = 'talent_vote_state';
const GLOBAL_VOTE_STORAGE_KEY = 'talent_global_vote_state';

export const getVoteState = (contestantId: string): VoteState | null => {
  try {
    const stored = localStorage.getItem(VOTE_STORAGE_KEY);
    if (!stored) return null;
    
    const voteStates: VoteState[] = JSON.parse(stored);
    return voteStates.find(state => state.contestantId === contestantId) || null;
  } catch (error) {
    console.error('Error reading vote state from localStorage:', error);
    return null;
  }
};

export const setVoteState = (contestantId: string, hasVoted: boolean): void => {
  try {
    const stored = localStorage.getItem(VOTE_STORAGE_KEY);
    const voteStates: VoteState[] = stored ? JSON.parse(stored) : [];
    
    const existingIndex = voteStates.findIndex(state => state.contestantId === contestantId);
    const newVoteState: VoteState = {
      contestantId,
      hasVoted,
      timestamp: Date.now(),
    };
    
    if (existingIndex >= 0) {
      voteStates[existingIndex] = newVoteState;
    } else {
      voteStates.push(newVoteState);
    }
    
    localStorage.setItem(VOTE_STORAGE_KEY, JSON.stringify(voteStates));
  } catch (error) {
    console.error('Error writing vote state to localStorage:', error);
  }
};

export const clearVoteStates = (): void => {
  try {
    localStorage.removeItem(VOTE_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing vote states from localStorage:', error);
  }
};

// Global vote state functions for single vote restriction
export const getGlobalVoteState = (): GlobalVoteState | null => {
  try {
    const stored = localStorage.getItem(GLOBAL_VOTE_STORAGE_KEY);
    if (!stored) return null;
    
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading global vote state from localStorage:', error);
    return null;
  }
};

export const setGlobalVoteState = (contestantId: string | null, hasVoted: boolean): void => {
  try {
    const globalVoteState: GlobalVoteState = {
      hasVoted,
      contestantId,
      timestamp: Date.now(),
    };
    
    localStorage.setItem(GLOBAL_VOTE_STORAGE_KEY, JSON.stringify(globalVoteState));
  } catch (error) {
    console.error('Error writing global vote state to localStorage:', error);
  }
};

export const clearGlobalVoteState = (): void => {
  try {
    localStorage.removeItem(GLOBAL_VOTE_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing global vote state from localStorage:', error);
  }
}; 