
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { Poll } from '@/types/poll';
import { cn } from '@/lib/utils';

interface VoteOptionsProps {
  poll: Poll;
  selectedOption: number | null;
  onSelect: (optionId: number) => void;
  disabled?: boolean;
}

export const VoteOptions = ({ poll, selectedOption, onSelect, disabled }: VoteOptionsProps) => {
  const [hoveredOption, setHoveredOption] = useState<number | null>(null);

  const showResults = poll.hasVoted || !poll.isActive;

  return (
    <div className="space-y-3">
      {poll.options.map((option) => {
        const percentage = poll.totalVotes > 0 
          ? Math.round((option.votes / poll.totalVotes) * 100) 
          : 0;
        const isSelected = selectedOption === option.id;
        const isHovered = hoveredOption === option.id;

        return (
          <motion.button
            key={option.id}
            onClick={() => !disabled && onSelect(option.id)}
            onMouseEnter={() => setHoveredOption(option.id)}
            onMouseLeave={() => setHoveredOption(null)}
            disabled={disabled || poll.hasVoted}
            className={cn(
              'relative w-full p-4 rounded-xl border text-left transition-all duration-300 overflow-hidden',
              isSelected || poll.userVote === option.id
                ? 'border-primary bg-primary/10'
                : 'border-border/50 bg-secondary/30 hover:border-border',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            whileHover={!disabled && !poll.hasVoted ? { scale: 1.01 } : {}}
            whileTap={!disabled && !poll.hasVoted ? { scale: 0.99 } : {}}
          >
            {/* Background progress bar */}
            {showResults && (
              <motion.div
                className="absolute inset-0 bg-primary/10"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            )}

            {/* Content */}
            <div className="relative flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors',
                    isSelected || poll.userVote === option.id
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground/30'
                  )}
                >
                  {(isSelected || poll.userVote === option.id) && (
                    <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                  )}
                </div>
                <span className="font-medium">{option.text}</span>
              </div>

              {showResults && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{option.votes} votes</span>
                  <span className="font-mono font-semibold text-primary">{percentage}%</span>
                </div>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};
