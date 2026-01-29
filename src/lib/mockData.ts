import { Poll } from '@/types/poll';
import { parseSTX } from './stacks';

// Mock data for development - replace with actual contract calls
export const mockPolls: Poll[] = [
  {
    id: '1',
    creator: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    question: 'What should be the next major feature for Stacks?',
    options: [
      { id: 0, text: 'sBTC Integration', votes: 45 },
      { id: 1, text: 'Layer 2 Scaling', votes: 32 },
      { id: 2, text: 'NFT Improvements', votes: 28 },
      { id: 3, text: 'DeFi Tooling', votes: 19 },
    ],
    voteFee: parseSTX(0.5),
    rewardPool: parseSTX(50),
    endBlock: 150000,
    currentBlock: 145000,
    totalVotes: 124,
    isActive: true,
  },
  {
    id: '2',
    creator: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
    question: 'Best time for community calls?',
    options: [
      { id: 0, text: '9 AM UTC', votes: 67 },
      { id: 1, text: '3 PM UTC', votes: 89 },
      { id: 2, text: '9 PM UTC', votes: 54 },
    ],
    voteFee: parseSTX(0.1),
    rewardPool: parseSTX(10),
    endBlock: 148000,
    currentBlock: 145000,
    totalVotes: 210,
    isActive: true,
  },
  {
    id: '3',
    creator: 'ST3AM1A56AK2C1XAFJ4115ZSV26EB49BVQ10MGCS0',
    question: 'Which blockchain has the best developer experience?',
    options: [
      { id: 0, text: 'Stacks', votes: 156 },
      { id: 1, text: 'Ethereum', votes: 98 },
      { id: 2, text: 'Solana', votes: 45 },
      { id: 3, text: 'Other', votes: 23 },
    ],
    voteFee: parseSTX(0.25),
    rewardPool: parseSTX(100),
    endBlock: 140000,
    currentBlock: 145000,
    totalVotes: 322,
    isActive: false,
    canClaim: true,
  },
];
