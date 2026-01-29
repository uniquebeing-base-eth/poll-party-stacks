import { Wallet, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useWallet } from '@/hooks/useWallet';
import { truncateAddress } from '@/lib/stacks';
import { motion } from 'framer-motion';

export const WalletButton = () => {
  const { isConnected, address, isLoading, connectWallet, disconnectWallet } = useWallet();

  if (isLoading) {
    return (
      <Button variant="outline" disabled className="min-w-[160px]">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </Button>
    );
  }

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 font-mono">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            {truncateAddress(address)}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem 
            onClick={disconnectWallet}
            className="gap-2 cursor-pointer text-destructive focus:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button 
        onClick={connectWallet}
        className="gap-2 btn-primary-glow"
      >
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </Button>
    </motion.div>
  );
};
