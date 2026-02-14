
export interface PollOption {
  id: number;
  text: string;
  votes: number;
}


export interface Poll {
  id: string;
  creator: string;
  question: string;
  options: PollOption[];
  voteFee: number; // in microSTX
  rewardPool: number; // in microSTX
  endBlock: number;
  currentBlock: number;
  totalVotes: number;
  isActive: boolean;
  hasVoted?: boolean;
  userVote?: number;
  canClaim?: boolean;
}

export interface CreatePollData {
  question: string;
  options: string[];
  voteFee: number; // in STX
  endBlock: number;
  rewardAmount?: number; // in STX
}
