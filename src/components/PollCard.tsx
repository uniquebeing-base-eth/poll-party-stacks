import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Users, Coins, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Poll } from '@/types/poll';
import { formatSTX } from '@/lib/stacks';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface PollCardProps {
  poll: Poll;
  index?: number;
}

export const PollCard = ({ poll, index = 0 }: PollCardProps) => {
  const blocksRemaining = poll.endBlock - poll.currentBlock;
  const timeEstimate = Math.max(0, Math.floor((blocksRemaining * 10) / 60)); // ~10 min per block

  const leadingOption = poll.options.reduce((prev, current) =>
    prev.votes > current.votes ? prev : current
  );

  const leadingPercentage =
    poll.totalVotes > 0 ? Math.round((leadingOption.votes / poll.totalVotes) * 100) : 0;

  const statusBadge = poll.isActive ? (
    <Badge
      variant="default"
      className="bg-success/20 text-success border-success/30"
    >
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
      Active
    </Badge>
  ) : (
    <Badge variant="secondary">
      <CheckCircle2 className="mr-1.5 h-3 w-3" />
      Ended
    </Badge>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link to={`/poll/${poll.id}`}>
        <div className="glass-card glow-border p-6 transition-all duration-300 hover:border-primary/30">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            {statusBadge}
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>

          {/* Question */}
          <h3 className="text-lg font-semibold mb-4 line-clamp-2">{poll.question}</h3>

          {/* Leading Option */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Leading: {leadingOption.text}</span>
              <span className="font-medium text-primary">{leadingPercentage}%</span>
            </div>
            <Progress value={leadingPercentage} className="h-2" />
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span>{poll.totalVotes} votes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Coins className="h-4 w-4" />
              <span>{formatSTX(poll.voteFee)} STX</span>
            </div>
            {poll.isActive && (
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{timeEstimate}h left</span>
              </div>
            )}
          </div>

          {/* Reward Pool */}
          {poll.rewardPool > 0 && (
            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Reward Pool</span>
                <span className="font-mono font-semibold text-primary">
                  {formatSTX(poll.rewardPool)} STX
                </span>
              </div>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};
