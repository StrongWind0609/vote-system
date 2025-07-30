import { renderHook, act } from '@testing-library/react';
import { useVoting } from '../useVoting';
import { getVoteState, setVoteState, getGlobalVoteState, setGlobalVoteState } from '../../utils/storage';
import { submitVote } from '../../utils/api';

// Mock the dependencies
jest.mock('../../utils/storage');
jest.mock('../../utils/api');

const mockGetVoteState = getVoteState as jest.MockedFunction<typeof getVoteState>;
const mockSetVoteState = setVoteState as jest.MockedFunction<typeof setVoteState>;
const mockGetGlobalVoteState = getGlobalVoteState as jest.MockedFunction<typeof getGlobalVoteState>;
const mockSetGlobalVoteState = setGlobalVoteState as jest.MockedFunction<typeof setGlobalVoteState>;
const mockSubmitVote = submitVote as jest.MockedFunction<typeof submitVote>;

describe('useVoting', () => {
    const contestantId = 'test-contestant-1';

    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    it('initializes with default state when no vote exists', () => {
        mockGetGlobalVoteState.mockReturnValue(null);

        const { result } = renderHook(() => useVoting(contestantId));

        expect(result.current.hasVoted).toBe(false);
        expect(result.current.hasVotedForOther).toBe(false);
        expect(result.current.isSubmitting).toBe(false);
        expect(result.current.error).toBe(null);
        expect(mockGetGlobalVoteState).toHaveBeenCalled();
    });

    it('loads existing vote state from localStorage', () => {
        const mockGlobalVoteState = {
            contestantId,
            hasVoted: true,
            timestamp: Date.now(),
        };
        mockGetGlobalVoteState.mockReturnValue(mockGlobalVoteState);

        const { result } = renderHook(() => useVoting(contestantId));

        expect(result.current.hasVoted).toBe(true);
        expect(result.current.hasVotedForOther).toBe(false);
        expect(mockGetGlobalVoteState).toHaveBeenCalled();
    });

    it('shows hasVotedForOther when user voted for different contestant', () => {
        const mockGlobalVoteState = {
            contestantId: 'different-contestant',
            hasVoted: true,
            timestamp: Date.now(),
        };
        mockGetGlobalVoteState.mockReturnValue(mockGlobalVoteState);

        const { result } = renderHook(() => useVoting(contestantId));

        expect(result.current.hasVoted).toBe(false);
        expect(result.current.hasVotedForOther).toBe(true);
        expect(mockGetGlobalVoteState).toHaveBeenCalled();
    });

    it('handles successful vote submission', async () => {
        mockGetGlobalVoteState.mockReturnValue(null);
        mockSubmitVote.mockResolvedValue({
            data: { success: true },
            success: true,
            message: 'Vote submitted successfully!',
        });

        const { result } = renderHook(() => useVoting(contestantId));

        expect(result.current.hasVoted).toBe(false);

        await act(async () => {
            await result.current.handleVote();
        });

        expect(mockSubmitVote).toHaveBeenCalledWith(contestantId);
        expect(mockSetGlobalVoteState).toHaveBeenCalledWith(contestantId, true);
        expect(result.current.hasVoted).toBe(true);
        expect(result.current.error).toBe(null);
    });

    it('handles failed vote submission', async () => {
        mockGetGlobalVoteState.mockReturnValue(null);
        const errorMessage = 'Vote submission failed';
        mockSubmitVote.mockResolvedValue({
            data: { success: false },
            success: false,
            message: errorMessage,
        });

        const { result } = renderHook(() => useVoting(contestantId));

        await act(async () => {
            await result.current.handleVote();
        });

        expect(mockSubmitVote).toHaveBeenCalledWith(contestantId);
        expect(mockSetGlobalVoteState).not.toHaveBeenCalled();
        expect(result.current.hasVoted).toBe(false);
        expect(result.current.error).toBe(errorMessage);
    });

    it('handles network errors during vote submission', async () => {
        mockGetGlobalVoteState.mockReturnValue(null);
        const errorMessage = 'Network error';
        mockSubmitVote.mockRejectedValue(new Error(errorMessage));

        const { result } = renderHook(() => useVoting(contestantId));

        await act(async () => {
            await result.current.handleVote();
        });

        expect(mockSubmitVote).toHaveBeenCalledWith(contestantId);
        expect(mockSetGlobalVoteState).not.toHaveBeenCalled();
        expect(result.current.hasVoted).toBe(false);
        expect(result.current.error).toBe(errorMessage);
    });

    it('prevents multiple vote submissions when already voted', async () => {
        mockGetGlobalVoteState.mockReturnValue({
            contestantId,
            hasVoted: true,
            timestamp: Date.now(),
        });

        const { result } = renderHook(() => useVoting(contestantId));

        expect(result.current.hasVoted).toBe(true);

        await act(async () => {
            await result.current.handleVote();
        });

        expect(mockSubmitVote).not.toHaveBeenCalled();
    });

    it('prevents vote when user has already voted for another contestant', async () => {
        mockGetGlobalVoteState.mockReturnValue({
            contestantId: 'different-contestant',
            hasVoted: true,
            timestamp: Date.now(),
        });

        const { result } = renderHook(() => useVoting(contestantId));

        expect(result.current.hasVotedForOther).toBe(true);

        await act(async () => {
            await result.current.handleVote();
        });

        expect(result.current.error).toBe('You have already voted for a contestant. You can only vote once.');
        expect(mockSubmitVote).not.toHaveBeenCalled();
    });

    it('prevents multiple vote submissions when submitting', async () => {
        mockGetGlobalVoteState.mockReturnValue(null);
        mockSubmitVote.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

        const { result } = renderHook(() => useVoting(contestantId));

        // Start first vote submission
        act(() => {
            result.current.handleVote();
        });

        expect(result.current.isSubmitting).toBe(true);

        // Try to submit another vote while first is still processing
        await act(async () => {
            await result.current.handleVote();
        });

        // Should only call submitVote once
        expect(mockSubmitVote).toHaveBeenCalledTimes(1);
    });

    it('resets vote state correctly', () => {
        mockGetGlobalVoteState.mockReturnValue({
            contestantId,
            hasVoted: true,
            timestamp: Date.now(),
        });

        const { result } = renderHook(() => useVoting(contestantId));

        expect(result.current.hasVoted).toBe(true);

        act(() => {
            result.current.resetVote();
        });

        expect(result.current.hasVoted).toBe(false);
        expect(result.current.error).toBe(null);
        expect(mockSetGlobalVoteState).toHaveBeenCalledWith(null, false);
    });

    it('persists vote state across component re-renders', () => {
        mockGetGlobalVoteState.mockReturnValue({
            contestantId,
            hasVoted: true,
            timestamp: Date.now(),
        });

        const { result, rerender } = renderHook(() => useVoting(contestantId));

        expect(result.current.hasVoted).toBe(true);

        // Re-render the component
        rerender();

        expect(result.current.hasVoted).toBe(true);
        // In React 18, useEffect might not run on every render, so we check it was called at least once
        expect(mockGetGlobalVoteState).toHaveBeenCalled();
    });
}); 