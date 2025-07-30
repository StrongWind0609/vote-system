import { getVoteState, setVoteState, clearVoteStates } from '../storage';

describe('Storage Utils', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('getVoteState', () => {
    it('returns null when no vote state exists', () => {
      const result = getVoteState('contestant-1');
      expect(result).toBeNull();
    });

    it('returns vote state when it exists', () => {
      const voteState = {
        contestantId: 'contestant-1',
        hasVoted: true,
        timestamp: Date.now(),
      };
      
      localStorage.setItem('talent_vote_state', JSON.stringify([voteState]));
      
      const result = getVoteState('contestant-1');
      expect(result).toEqual(voteState);
    });

    it('returns null for non-existent contestant', () => {
      const voteState = {
        contestantId: 'contestant-1',
        hasVoted: true,
        timestamp: Date.now(),
      };
      
      localStorage.setItem('talent_vote_state', JSON.stringify([voteState]));
      
      const result = getVoteState('contestant-2');
      expect(result).toBeNull();
    });

    it('handles malformed localStorage data gracefully', () => {
      localStorage.setItem('talent_vote_state', 'invalid-json');
      
      const result = getVoteState('contestant-1');
      expect(result).toBeNull();
    });
  });

  describe('setVoteState', () => {
    it('creates new vote state when none exists', () => {
      setVoteState('contestant-1', true);
      
      const stored = localStorage.getItem('talent_vote_state');
      const voteStates = JSON.parse(stored!);
      
      expect(voteStates).toHaveLength(1);
      expect(voteStates[0]).toEqual({
        contestantId: 'contestant-1',
        hasVoted: true,
        timestamp: expect.any(Number),
      });
    });

    it('updates existing vote state', () => {
      const existingVoteState = {
        contestantId: 'contestant-1',
        hasVoted: false,
        timestamp: Date.now() - 1000,
      };
      
      localStorage.setItem('talent_vote_state', JSON.stringify([existingVoteState]));
      
      setVoteState('contestant-1', true);
      
      const stored = localStorage.getItem('talent_vote_state');
      const voteStates = JSON.parse(stored!);
      
      expect(voteStates).toHaveLength(1);
      expect(voteStates[0].hasVoted).toBe(true);
      expect(voteStates[0].timestamp).toBeGreaterThan(existingVoteState.timestamp);
    });

    it('adds new vote state to existing array', () => {
      const existingVoteState = {
        contestantId: 'contestant-1',
        hasVoted: true,
        timestamp: Date.now(),
      };
      
      localStorage.setItem('talent_vote_state', JSON.stringify([existingVoteState]));
      
      setVoteState('contestant-2', false);
      
      const stored = localStorage.getItem('talent_vote_state');
      const voteStates = JSON.parse(stored!);
      
      expect(voteStates).toHaveLength(2);
      expect(voteStates[0]).toEqual(existingVoteState);
      expect(voteStates[1]).toEqual({
        contestantId: 'contestant-2',
        hasVoted: false,
        timestamp: expect.any(Number),
      });
    });

    it('handles localStorage errors gracefully', () => {
      // Mock localStorage.setItem to throw an error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn().mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });
      
      // Should not throw an error
      expect(() => setVoteState('contestant-1', true)).not.toThrow();
      
      // Restore original function
      localStorage.setItem = originalSetItem;
    });
  });

  describe('clearVoteStates', () => {
    it('removes all vote states', () => {
      const voteStates = [
        { contestantId: 'contestant-1', hasVoted: true, timestamp: Date.now() },
        { contestantId: 'contestant-2', hasVoted: false, timestamp: Date.now() },
      ];
      
      localStorage.setItem('talent_vote_state', JSON.stringify(voteStates));
      
      clearVoteStates();
      
      const stored = localStorage.getItem('talent_vote_state');
      expect(stored).toBeNull();
    });

    it('handles localStorage errors gracefully', () => {
      // Mock localStorage.removeItem to throw an error
      const originalRemoveItem = localStorage.removeItem;
      localStorage.removeItem = jest.fn().mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      // Should not throw an error
      expect(() => clearVoteStates()).not.toThrow();
      
      // Restore original function
      localStorage.removeItem = originalRemoveItem;
    });
  });

  describe('integration', () => {
    it('maintains multiple vote states correctly', () => {
      // Set vote states for multiple contestants
      setVoteState('contestant-1', true);
      setVoteState('contestant-2', false);
      setVoteState('contestant-3', true);
      
      // Verify all states are stored correctly
      expect(getVoteState('contestant-1')?.hasVoted).toBe(true);
      expect(getVoteState('contestant-2')?.hasVoted).toBe(false);
      expect(getVoteState('contestant-3')?.hasVoted).toBe(true);
      
      // Update one state
      setVoteState('contestant-2', true);
      
      // Verify the update
      expect(getVoteState('contestant-2')?.hasVoted).toBe(true);
      
      // Verify other states are unchanged
      expect(getVoteState('contestant-1')?.hasVoted).toBe(true);
      expect(getVoteState('contestant-3')?.hasVoted).toBe(true);
    });
  });
}); 