"use client";

import React from 'react';
import { ContestantCard } from './ContestantCard';
import { useContestants } from '../hooks/useContestants';
import { ErrorBoundary } from './ErrorBoundary';
import './VotingInterface.css';

export const VotingInterface: React.FC = () => {
    const { contestants, votingWindow, isLoading, error, refetch } = useContestants();

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading contestants...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Unable to load contestants</h2>
                <p>{error}</p>
                <button onClick={refetch} className="retry-button">
                    Try Again
                </button>
            </div>
        );
    }

    const votingWindowOpen = votingWindow?.isOpen ?? false;

    return (
        <ErrorBoundary>
            <div className="voting-interface">
                <div className="header">
                    <h1>America's Got Talent Live Voting</h1>
                    <div className="voting-status">
                        <span className={`status-indicator ${votingWindowOpen ? 'open' : 'closed'}`}>
                            {votingWindowOpen ? '●' : '○'}
                        </span>
                        <span className="status-text">
                            {votingWindowOpen ? 'Voting is OPEN' : 'Voting is CLOSED'}
                        </span>
                    </div>
                </div>

                <div className="contestants-grid">
                    {contestants.map((contestant) => (
                        <ContestantCard
                            key={contestant.id}
                            contestant={contestant}
                            votingWindowOpen={votingWindowOpen}
                        />
                    ))}
                </div>

                {contestants.length === 0 && (
                    <div className="no-contestants">
                        <p>No contestants available at the moment.</p>
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
}; 