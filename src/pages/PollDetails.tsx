

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Users, Coins, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VoteOptions } from '@/components/VoteOptions';
import { mockPolls } from '@/lib/mockData';
import { formatSTX, truncateAddress } from '@/lib/stacks';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/hooks/use-toast';


const PollDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isConnected, connectWallet } = useWallet();
  const { toast } = useToast();
  
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  const poll = mockPolls.find(p => p.id === id);

  if (!poll) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 max-w-md text-center"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold mb-2">Poll Not Found</h2>
          <p className="text-muted-foreground mb-6">
            This poll doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/')}>
            Back to Polls
          </Button>
        </motion.div>
      </div>
    );
  }

  const blocksRemaining = poll.endBlock - poll.currentBlock;
  const timeEstimate = Math.max(0, Math.floor(blocksRemaining * 10 / 60));

  const handleVote = async () => {
    if (!isConnected) {
      connectWallet();
      return;
    }

    if (selectedOption === null) {
      toast({ title: 'Error', description: 'Please select an option', variant: 'destructive' });
      return;
    }

    setIsVoting(true);

    // TODO: Implement actual contract call
    setTimeout(() => {
      toast({
        title: 'Vote Submitted!',
        description: `You voted for: ${poll.options[selectedOption].text}`,
      });
      setIsVoting(false);
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Polls
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header Card */}
        <div className="glass-card p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <Badge 
              variant={poll.isActive ? 'default' : 'secondary'}
              className={poll.isActive ? 'bg-success/20 text-success border-success/30' : ''}
            >
              {poll.isActive ? (
                <>
                  <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  Active
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-1.5 h-3 w-3" />
                  Ended
                </>
              )}
            </Badge>
            <span className="stx-address">
              by {truncateAddress(poll.creator)}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-6">
            {poll.question}
          </h1>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50">
              <Users className="h-4 w-4 text-primary" />
              <span>{poll.totalVotes} votes</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50">
              <Coins className="h-4 w-4 text-primary" />
              <span>{formatSTX(poll.voteFee)} STX / vote</span>
            </div>
            {poll.isActive && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50">
                <Clock className="h-4 w-4 text-primary" />
                <span>~{timeEstimate}h remaining</span>
              </div>
            )}
          </div>
        </div>

        {/* Voting Section */}
        <div className="glass-card p-6 md:p-8">
          <h2 className="text-lg font-semibold mb-6">
            {poll.hasVoted ? 'Your Vote' : poll.isActive ? 'Cast Your Vote' : 'Results'}
          </h2>

          <VoteOptions
            poll={poll}
            selectedOption={selectedOption}
            onSelect={setSelectedOption}
            disabled={!poll.isActive || isVoting}
          />

          {/* Vote Button */}
          {poll.isActive && !poll.hasVoted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 pt-6 border-t border-border/50"
            >
              {!isConnected ? (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20 mb-4">
                  <AlertCircle className="h-5 w-5 text-primary shrink-0" />
                  <p className="text-sm">Connect your wallet to vote on this poll.</p>
                </div>
              ) : null}

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-muted-foreground">Cost to vote</span>
                  <div className="font-mono font-bold text-lg text-primary">
                    {formatSTX(poll.voteFee)} STX
                  </div>
                </div>
                <Button
                  onClick={handleVote}
                  size="lg"
                  className="btn-primary-glow"
                  disabled={!isConnected || selectedOption === null || isVoting}
                >
                  {isVoting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Voting...
                    </>
                  ) : isConnected ? (
                    'Submit Vote'
                  ) : (
                    'Connect to Vote'
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Reward Pool */}
        {poll.rewardPool > 0 && (
          <div className="glass-card p-6 md:p-8 border-primary/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Reward Pool</h3>
                <p className="text-sm text-muted-foreground">
                  {poll.isActive 
                    ? 'Rewards will be distributed after the poll ends'
                    : poll.canClaim 
                      ? 'You can claim your share of rewards!'
                      : 'Rewards have been distributed'
                  }
                </p>
              </div>
              <div className="text-right">
                <div className="font-mono font-bold text-2xl text-primary">
                  {formatSTX(poll.rewardPool)} STX
                </div>
                {!poll.isActive && poll.canClaim && (
                  <Button size="sm" className="mt-2 btn-primary-glow">
                    Claim Reward
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PollDetails;
