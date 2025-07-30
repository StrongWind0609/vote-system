export interface Contestant {
  id: string;
  name: string;
  talent: string;
  imageUrl: string;
  voteCount: number;
  isActive: boolean;
}

export interface VoteState {
  contestantId: string;
  hasVoted: boolean;
  timestamp: number;
}

export interface GlobalVoteState {
  hasVoted: boolean;
  contestantId: string | null;
  timestamp: number;
}

export interface VotingWindow {
  isOpen: boolean;
  startTime: number;
  endTime: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  message: string;
  retry?: () => void;
} 