
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, TrendingUp, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PollCard } from '@/components/PollCard';
import { mockPolls } from '@/lib/mockData';
import { useWallet } from '@/hooks/useWallet';

const Index = () => {
  const { isConnected } = useWallet();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'ended'>('all');

  const filteredPolls = useMemo(() => {
    return mockPolls.filter(poll => {
      const matchesSearch = poll.question.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filter === 'all' 
        ? true 
        : filter === 'active' 
          ? poll.isActive 
          : !poll.isActive;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, filter]);

  const stats = useMemo(() => ({
    totalPolls: mockPolls.length,
    activePolls: mockPolls.filter(p => p.isActive).length,
    totalVotes: mockPolls.reduce((acc, p) => acc + p.totalVotes, 0),
  }), []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Powered by Stacks</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              Create & Vote on
              <span className="text-gradient block">Paid Poll Pools</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Create polls with STX fees, let the community vote, and distribute rewards. 
              All transactions secured on Bitcoin via Stacks.
            </p>

            {!isConnected && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-muted-foreground"
              >
                Connect your wallet to create polls and vote
              </motion.p>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-12"
          >
            {[
              { label: 'Total Polls', value: stats.totalPolls, icon: TrendingUp },
              { label: 'Active Now', value: stats.activePolls, icon: Sparkles },
              { label: 'Total Votes', value: stats.totalVotes, icon: TrendingUp },
            ].map((stat, index) => (
              <div key={stat.label} className="glass-card p-4 text-center">
                <stat.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Polls List */}
      <section className="container mx-auto px-4 py-12">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search polls..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/30 border-border/50"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'active', 'ended'] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(f)}
                className="capitalize"
              >
                {f}
              </Button>
            ))}
          </div>
        </div>

        {/* Polls Grid */}
        {filteredPolls.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPolls.map((poll, index) => (
              <PollCard key={poll.id} poll={poll} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🗳️</div>
            <h3 className="text-xl font-semibold mb-2">No polls found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? 'Try a different search term' : 'Be the first to create a poll!'}
            </p>
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default Index;
