

import { motion } from 'framer-motion';
import { Gift, AlertCircle, CheckCircle2, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockPolls } from '@/lib/mockData';
import { formatSTX, truncateAddress } from '@/lib/stacks';
import { useWallet } from '@/hooks/useWallet';


const Rewards = () => {
  const { isConnected, connectWallet } = useWallet();

  // Filter polls with claimable rewards (ended polls with reward pool)
  const rewardPolls = mockPolls.filter(p => !p.isActive && p.rewardPool > 0);
  const claimablePolls = rewardPolls.filter(p => p.canClaim);
  const totalClaimable = claimablePolls.reduce((acc, p) => acc + p.rewardPool / 10, 0); // Mock calculation

  if (!isConnected) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 max-w-md text-center"
        >
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Gift className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">View Your Rewards</h2>
          <p className="text-muted-foreground mb-6">
            Connect your wallet to see claimable rewards from polls you've participated in.
          </p>
          <Button onClick={connectWallet} className="btn-primary-glow">
            Connect Wallet
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Gift className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Your Rewards</h1>
        </div>
        <p className="text-muted-foreground mb-8">
          Claim STX rewards from polls you've participated in.
        </p>

        {/* Summary Card */}
        <div className="glass-card p-6 mb-8 border-primary/30">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-muted-foreground">Total Claimable</span>
              <div className="font-mono font-bold text-3xl text-primary">
                {formatSTX(totalClaimable * 1_000_000)} STX
              </div>
            </div>
            {totalClaimable > 0 && (
              <Button size="lg" className="btn-primary-glow">
                Claim All
              </Button>
            )}
          </div>
        </div>

        {/* Reward List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Reward History</h2>
          
          {rewardPolls.length > 0 ? (
            rewardPolls.map((poll, index) => (
              <motion.div
                key={poll.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        Ended
                      </Badge>
                      <span className="text-xs text-muted-foreground font-mono">
                        {truncateAddress(poll.creator)}
                      </span>
                    </div>
                    <h3 className="font-medium mb-2 line-clamp-1">
                      {poll.question}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Coins className="h-4 w-4" />
                      <span>Pool: {formatSTX(poll.rewardPool)} STX</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    {poll.canClaim ? (
                      <>
                        <div className="font-mono font-semibold text-primary mb-2">
                          +{formatSTX(poll.rewardPool / 10)} STX
                        </div>
                        <Button size="sm" variant="outline">
                          Claim
                        </Button>
                      </>
                    ) : (
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4" />
                        Claimed
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-8 text-center"
            >
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold mb-2">No Rewards Yet</h3>
              <p className="text-muted-foreground">
                Participate in polls with reward pools to earn STX.
              </p>
            </motion.div>
          )}
        </div>

        {/* Info */}
        <div className="flex items-start gap-3 p-4 mt-8 rounded-lg bg-secondary/30 border border-border/50">
          <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">How rewards work</p>
            <p>
              Rewards are distributed proportionally among all voters after a poll ends. 
              The more you participate, the more you can earn!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Rewards;
