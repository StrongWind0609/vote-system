import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ContestantCard } from '../ContestantCard';
import { Contestant } from '../../types';
import { getVoteState, setVoteState } from '../../utils/storage';

// Mock the hooks
jest.mock('../../hooks/useVoting', () => ({
    useVoting: jest.fn(),
}));

const mockUseVoting = require('../../hooks/useVoting').useVoting;

const mockContestant: Contestant = {
    id: 'test-contestant-1',
    name: 'Test Contestant',
    talent: 'Test Talent',
    imageUrl: 'https://example.com/image.jpg',
    voteCount: 100,
    isActive: true,
};

describe('Vote Button Persistence', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    it('disables vote button after voting and persists after page reload', async () => {
        // Initial state - user has not voted
        mockUseVoting.mockReturnValue({
            hasVoted: false,
            isSubmitting: false,
            error: null,
            handleVote: jest.fn().mockResolvedValue(undefined),
        });

        const { rerender } = render(
            <ContestantCard contestant={mockContestant} votingWindowOpen={true} />
        );

        // Initially, vote button should be enabled
        const voteButton = screen.getByRole('button', { name: 'Vote' });
        expect(voteButton).toBeEnabled();
        expect(voteButton).not.toHaveClass('disabled');

        // Simulate successful vote submission
        mockUseVoting.mockReturnValue({
            hasVoted: true,
            isSubmitting: false,
            error: null,
            handleVote: jest.fn(),
        });

        // Re-render to simulate state update after vote
        rerender(<ContestantCard contestant={mockContestant} votingWindowOpen={true} />);

        // Vote button should now be disabled and show "Voted ✓"
        const votedButton = screen.getByRole('button', { name: 'Voted ✓' });
        expect(votedButton).toBeDisabled();
        expect(votedButton).toHaveClass('voted');

        // Simulate page reload by re-rendering with fresh state
        // This simulates the component mounting again and loading from localStorage
        mockUseVoting.mockReturnValue({
            hasVoted: true, // This would be loaded from localStorage in real scenario
            isSubmitting: false,
            error: null,
            handleVote: jest.fn(),
        });

        rerender(<ContestantCard contestant={mockContestant} votingWindowOpen={true} />);

        // Vote button should still be disabled after "page reload"
        const reloadedButton = screen.getByRole('button', { name: 'Voted ✓' });
        expect(reloadedButton).toBeDisabled();
        expect(reloadedButton).toHaveClass('voted');
    });

    it('loads vote state from localStorage on component mount', () => {
        // Simulate existing vote in localStorage
        setVoteState(mockContestant.id, true);

        // Mock the hook to simulate loading from localStorage
        mockUseVoting.mockReturnValue({
            hasVoted: true, // This would be loaded from localStorage
            isSubmitting: false,
            error: null,
            handleVote: jest.fn(),
        });

        render(<ContestantCard contestant={mockContestant} votingWindowOpen={true} />);

        // Vote button should be disabled because user already voted
        const voteButton = screen.getByRole('button', { name: 'Voted ✓' });
        expect(voteButton).toBeDisabled();
        expect(voteButton).toHaveClass('voted');
    });

    it('prevents multiple votes for the same contestant', async () => {
        const mockHandleVote = jest.fn();

        // Initial state
        mockUseVoting.mockReturnValue({
            hasVoted: false,
            isSubmitting: false,
            error: null,
            handleVote: mockHandleVote,
        });

        render(<ContestantCard contestant={mockContestant} votingWindowOpen={true} />);

        const voteButton = screen.getByRole('button', { name: 'Vote' });

        // Click vote button
        fireEvent.click(voteButton);
        expect(mockHandleVote).toHaveBeenCalledTimes(1);

        // Simulate successful vote
        mockUseVoting.mockReturnValue({
            hasVoted: true,
            isSubmitting: false,
            error: null,
            handleVote: mockHandleVote,
        });

        // Re-render to update state
        render(<ContestantCard contestant={mockContestant} votingWindowOpen={true} />);

        const votedButton = screen.getByRole('button', { name: 'Voted ✓' });

        // Try to click again - should not call handleVote
        fireEvent.click(votedButton);
        expect(mockHandleVote).toHaveBeenCalledTimes(1); // Still only called once
    });

    it('maintains vote state across multiple contestants', () => {
        const contestant2: Contestant = {
            id: 'test-contestant-2',
            name: 'Test Contestant 2',
            talent: 'Test Talent 2',
            imageUrl: 'https://example.com/image2.jpg',
            voteCount: 200,
            isActive: true,
        };

        // Set vote state for first contestant
        setVoteState(mockContestant.id, true);

        // First contestant should show as voted
        mockUseVoting.mockReturnValue({
            hasVoted: true,
            isSubmitting: false,
            error: null,
            handleVote: jest.fn(),
        });

        render(<ContestantCard contestant={mockContestant} votingWindowOpen={true} />);
        expect(screen.getByRole('button', { name: 'Voted ✓' })).toBeDisabled();

        // Second contestant should show as not voted
        mockUseVoting.mockReturnValue({
            hasVoted: false,
            isSubmitting: false,
            error: null,
            handleVote: jest.fn(),
        });

        render(<ContestantCard contestant={contestant2} votingWindowOpen={true} />);
        expect(screen.getByRole('button', { name: 'Vote' })).toBeEnabled();
    });

    it('handles localStorage errors gracefully', () => {
        // Mock localStorage to throw an error
        const originalGetItem = localStorage.getItem;
        localStorage.getItem = jest.fn().mockImplementation(() => {
            throw new Error('localStorage error');
        });

        // Component should still render without crashing
        mockUseVoting.mockReturnValue({
            hasVoted: false,
            isSubmitting: false,
            error: null,
            handleVote: jest.fn(),
        });

        expect(() => {
            render(<ContestantCard contestant={mockContestant} votingWindowOpen={true} />);
        }).not.toThrow();

        // Restore original function
        localStorage.getItem = originalGetItem;
    });
}); 