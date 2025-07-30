import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ContestantCard } from '../ContestantCard';
import { Contestant } from '../../types';

// Mock the hooks
jest.mock('../../hooks/useVoting', () => ({
    useVoting: jest.fn(),
}));

const mockUseVoting = require('../../hooks/useVoting').useVoting;

const mockContestant: Contestant = {
    id: '1',
    name: 'Sarah Johnson',
    talent: 'Opera Singer',
    imageUrl: 'https://example.com/image.jpg',
    voteCount: 1247,
    isActive: true,
};

describe('ContestantCard', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Clear localStorage before each test
        localStorage.clear();
    });

    it('renders contestant information correctly', () => {
        mockUseVoting.mockReturnValue({
            hasVoted: false,
            isSubmitting: false,
            error: null,
            handleVote: jest.fn(),
        });

        render(<ContestantCard contestant={mockContestant} votingWindowOpen={true} />);

        expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
        expect(screen.getByText('Opera Singer')).toBeInTheDocument();
        expect(screen.getByText('1,247')).toBeInTheDocument();
        expect(screen.getByText('votes')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Vote' })).toBeInTheDocument();
    });

    it('shows vote button as enabled when voting window is open and user has not voted', () => {
        mockUseVoting.mockReturnValue({
            hasVoted: false,
            isSubmitting: false,
            error: null,
            handleVote: jest.fn(),
        });

        render(<ContestantCard contestant={mockContestant} votingWindowOpen={true} />);

        const voteButton = screen.getByRole('button', { name: 'Vote' });
        expect(voteButton).toBeEnabled();
        expect(voteButton).not.toHaveClass('disabled');
    });

    it('shows vote button as disabled when voting window is closed', () => {
        mockUseVoting.mockReturnValue({
            hasVoted: false,
            isSubmitting: false,
            error: null,
            handleVote: jest.fn(),
        });

        render(<ContestantCard contestant={mockContestant} votingWindowOpen={false} />);

        const voteButton = screen.getByRole('button', { name: 'Vote' });
        expect(voteButton).toBeDisabled();
        expect(voteButton).toHaveClass('disabled');
        expect(screen.getByText('Voting is currently closed')).toBeInTheDocument();
    });

    it('shows vote button as disabled and "Voted ✓" when user has already voted', () => {
        mockUseVoting.mockReturnValue({
            hasVoted: true,
            isSubmitting: false,
            error: null,
            handleVote: jest.fn(),
        });

        render(<ContestantCard contestant={mockContestant} votingWindowOpen={true} />);

        const voteButton = screen.getByRole('button', { name: 'Voted ✓' });
        expect(voteButton).toBeDisabled();
        expect(voteButton).toHaveClass('voted');
    });

    it('shows "Submitting..." when vote is being submitted', () => {
        mockUseVoting.mockReturnValue({
            hasVoted: false,
            isSubmitting: true,
            error: null,
            handleVote: jest.fn(),
        });

        render(<ContestantCard contestant={mockContestant} votingWindowOpen={true} />);

        const voteButton = screen.getByRole('button', { name: 'Submitting...' });
        expect(voteButton).toBeDisabled();
    });

    it('displays error message when there is an error', () => {
        const errorMessage = 'Failed to submit vote';
        mockUseVoting.mockReturnValue({
            hasVoted: false,
            isSubmitting: false,
            error: errorMessage,
            handleVote: jest.fn(),
        });

        render(<ContestantCard contestant={mockContestant} votingWindowOpen={true} />);

        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('calls handleVote when vote button is clicked', () => {
        const mockHandleVote = jest.fn();
        mockUseVoting.mockReturnValue({
            hasVoted: false,
            isSubmitting: false,
            error: null,
            handleVote: mockHandleVote,
        });

        render(<ContestantCard contestant={mockContestant} votingWindowOpen={true} />);

        const voteButton = screen.getByRole('button', { name: 'Vote' });
        fireEvent.click(voteButton);

        expect(mockHandleVote).toHaveBeenCalledTimes(1);
    });

    it('does not call handleVote when vote button is disabled', () => {
        const mockHandleVote = jest.fn();
        mockUseVoting.mockReturnValue({
            hasVoted: true,
            isSubmitting: false,
            error: null,
            handleVote: mockHandleVote,
        });

        render(<ContestantCard contestant={mockContestant} votingWindowOpen={true} />);

        const voteButton = screen.getByRole('button', { name: 'Voted ✓' });
        fireEvent.click(voteButton);

        expect(mockHandleVote).not.toHaveBeenCalled();
    });

    it('handles image load error gracefully', () => {
        mockUseVoting.mockReturnValue({
            hasVoted: false,
            isSubmitting: false,
            error: null,
            handleVote: jest.fn(),
        });

        render(<ContestantCard contestant={mockContestant} votingWindowOpen={true} />);

        const image = screen.getByAltText('Sarah Johnson');
        fireEvent.error(image);

        // The image should have a fallback src after error
        expect(image).toHaveAttribute('src', 'https://via.placeholder.com/300x200?text=No+Image');
    });
}); 