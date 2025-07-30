"use client";

import React from 'react';
import { Contestant } from '../types';
import { useVoting } from '../hooks/useVoting';
import { ErrorBoundary } from './ErrorBoundary';
import './ContestantCard.css';

interface ContestantCardProps {
  contestant: Contestant;
  votingWindowOpen: boolean;
}

export const ContestantCard: React.FC<ContestantCardProps> = ({
  contestant,
  votingWindowOpen
}) => {
  const { hasVoted, isSubmitting, error, hasVotedForOther, handleVote } = useVoting(contestant.id);

  const isVoteDisabled = !votingWindowOpen || hasVoted || hasVotedForOther || isSubmitting;

  return (
    <ErrorBoundary>
      <div className="contestant-card">
        <div className="contestant-image">
          <img
            src={contestant.imageUrl}
            alt={contestant.name}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/300x200?text=No+Image';
            }}
          />
        </div>

        <div className="contestant-info">
          <h3 className="contestant-name">{contestant.name}</h3>
          <p className="contestant-talent">{contestant.talent}</p>

          <div className="vote-count">
            <span className="vote-number">{contestant.voteCount.toLocaleString()}</span>
            <span className="vote-label">votes</span>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            className={`vote-button ${isVoteDisabled ? 'disabled' : ''} ${hasVoted ? 'voted' : ''}`}
            onClick={handleVote}
            disabled={isVoteDisabled}
          >
            {isSubmitting ? 'Submitting...' : hasVoted ? 'Voted ✓' : hasVotedForOther ? 'Already Voted' : 'Vote'}
          </button>

          {!votingWindowOpen && (
            <div className="voting-closed">
              Voting is currently closed
            </div>
          )}

          {hasVotedForOther && (
            <div className="voting-closed">
              You have already voted for another contestant
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}; 