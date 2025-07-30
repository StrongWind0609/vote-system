import { Contestant, ApiResponse, VotingWindow } from '../types';

// Simulated API delay
const API_DELAY = 500;

// Mock data for contestants
const mockContestants: Contestant[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    talent: 'Opera Singer',
    imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop&crop=face',
    voteCount: 1247,
    isActive: true,
  },
  {
    id: '2',
    name: 'Mike Chen',
    talent: 'Magician',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face',
    voteCount: 892,
    isActive: true,
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    talent: 'Dancer',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop&crop=face',
    voteCount: 1563,
    isActive: true,
  },
  {
    id: '4',
    name: 'David Thompson',
    talent: 'Comedian',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop&crop=face',
    voteCount: 734,
    isActive: true,
  },
  {
    id: '5',
    name: 'Lisa Park',
    talent: 'Violinist',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop&crop=face',
    voteCount: 1102,
    isActive: true,
  },
  {
    id: '6',
    name: 'Alex Rivera',
    talent: 'Acrobat',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=300&fit=crop&crop=face',
    voteCount: 945,
    isActive: true,
  },
  {
    id: '7',
    name: 'Sophie Williams',
    talent: 'Pianist',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=300&fit=crop&crop=face',
    voteCount: 1328,
    isActive: true,
  },
  {
    id: '8',
    name: 'Marcus Johnson',
    talent: 'Beatboxer',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=300&fit=crop&crop=face',
    voteCount: 678,
    isActive: true,
  },
  {
    id: '9',
    name: 'Isabella Chen',
    talent: 'Painter',
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=300&fit=crop&crop=face',
    voteCount: 1156,
    isActive: true,
  },
  {
    id: '10',
    name: 'Ryan O\'Connor',
    talent: 'Juggler',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop&crop=face',
    voteCount: 823,
    isActive: true,
  },
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate random network errors (2% chance)
const shouldFail = () => Math.random() < 0.02;

export const fetchContestants = async (): Promise<ApiResponse<Contestant[]>> => {
  try {
    await delay(API_DELAY);
    
    if (shouldFail()) {
      throw new Error('Network error occurred');
    }
    
    // Simulate real-time vote count updates
    const updatedContestants = mockContestants.map(contestant => ({
      ...contestant,
      voteCount: contestant.voteCount + Math.floor(Math.random() * 50),
    }));
    
    return {
      data: updatedContestants,
      success: true,
    };
  } catch (error) {
    return {
      data: [],
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch contestants',
    };
  }
};

export const submitVote = async (contestantId: string): Promise<ApiResponse<{ success: boolean }>> => {
  try {
    await delay(API_DELAY);
    
    if (shouldFail()) {
      throw new Error('Vote submission failed');
    }
    
    // Simulate vote processing
    const contestant = mockContestants.find(c => c.id === contestantId);
    if (!contestant) {
      throw new Error('Contestant not found');
    }
    
    return {
      data: { success: true },
      success: true,
      message: 'Vote submitted successfully!',
    };
  } catch (error) {
    return {
      data: { success: false },
      success: false,
      message: error instanceof Error ? error.message : 'Failed to submit vote',
    };
  }
};

export const getVotingWindow = async (): Promise<ApiResponse<VotingWindow>> => {
  try {
    await delay(API_DELAY);
    
    if (shouldFail()) {
      throw new Error('Failed to get voting window');
    }
    
    const now = Date.now();
    const votingWindow: VotingWindow = {
      isOpen: true, // Always open for demo
      startTime: now - 3600000, // 1 hour ago
      endTime: now + 3600000, // 1 hour from now
    };
    
    return {
      data: votingWindow,
      success: true,
    };
  } catch (error) {
    return {
      data: { isOpen: false, startTime: 0, endTime: 0 },
      success: false,
      message: error instanceof Error ? error.message : 'Failed to get voting window',
    };
  }
}; 