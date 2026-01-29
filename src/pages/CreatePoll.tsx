import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Minus, Coins, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/hooks/use-toast';

const CreatePoll = () => {
  const navigate = useNavigate();
  const { isConnected, connectWallet } = useWallet();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [voteFee, setVoteFee] = useState('0.1');
  const [duration, setDuration] = useState('24');
  const [rewardAmount, setRewardAmount] = useState('');

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      connectWallet();
      return;
    }

    // Validation
    if (!question.trim()) {
      toast({ title: 'Error', description: 'Please enter a question', variant: 'destructive' });
      return;
    }

    const validOptions = options.filter(o => o.trim());
    if (validOptions.length < 2) {
      toast({ title: 'Error', description: 'Please add at least 2 options', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);

    // TODO: Implement actual contract call
    // This is a placeholder for the contract interaction
    setTimeout(() => {
      toast({
        title: 'Poll Created!',
        description: 'Your poll has been submitted to the blockchain.',
      });
      setIsSubmitting(false);
      navigate('/');
    }, 2000);
  };

  const totalCost = parseFloat(rewardAmount || '0');

  if (!isConnected) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 max-w-md text-center"
        >
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-muted-foreground mb-6">
            You need to connect your Stacks wallet to create a poll.
          </p>
          <Button onClick={connectWallet} className="btn-primary-glow">
            Connect Wallet
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Create a Poll</h1>
        <p className="text-muted-foreground mb-8">
          Set up your poll and let the community vote with STX.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Question */}
          <div className="glass-card p-6 space-y-4">
            <Label htmlFor="question" className="text-base font-semibold">
              Poll Question
            </Label>
            <Textarea
              id="question"
              placeholder="What do you want to ask?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[100px] bg-secondary/30 border-border/50 resize-none"
            />
          </div>

          {/* Options */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Options</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
                disabled={options.length >= 6}
                className="gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Option
              </Button>
            </div>
            
            <div className="space-y-3">
              {options.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-2"
                >
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    className="bg-secondary/30 border-border/50"
                  />
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(index)}
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="glass-card p-6 space-y-6">
            <h3 className="text-base font-semibold">Poll Settings</h3>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="voteFee" className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-primary" />
                  Vote Fee (STX)
                </Label>
                <Input
                  id="voteFee"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.1"
                  value={voteFee}
                  onChange={(e) => setVoteFee(e.target.value)}
                  className="bg-secondary/30 border-border/50 font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration" className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Duration (hours)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  max="720"
                  placeholder="24"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="bg-secondary/30 border-border/50 font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reward" className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-primary" />
                Reward Pool (STX) - Optional
              </Label>
              <Input
                id="reward"
                type="number"
                step="0.1"
                min="0"
                placeholder="Add STX rewards for voters"
                value={rewardAmount}
                onChange={(e) => setRewardAmount(e.target.value)}
                className="bg-secondary/30 border-border/50 font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Rewards will be distributed to voters after the poll ends.
              </p>
            </div>
          </div>

          {/* Summary */}
          {totalCost > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="glass-card p-4 border-primary/30"
            >
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Cost</span>
                <span className="font-mono font-bold text-lg text-primary">
                  {totalCost.toFixed(2)} STX
                </span>
              </div>
            </motion.div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            size="lg"
            className="w-full btn-primary-glow"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating Poll...
              </>
            ) : (
              'Create Poll'
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreatePoll;
