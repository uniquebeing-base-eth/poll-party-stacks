import { Link, useLocation } from 'react-router-dom';
import { WalletButton } from './WalletButton';
import { Vote, Plus, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

export const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Polls', icon: Vote },
    { path: '/create', label: 'Create', icon: Plus },
    { path: '/rewards', label: 'Rewards', icon: Gift },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <motion.div 
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary"
              whileHover={{ rotate: 10, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <Vote className="h-5 w-5 text-primary-foreground" />
            </motion.div>
            <span className="text-xl font-bold">
              Poll<span className="text-gradient">bag</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-primary/10 rounded-lg -z-10"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Wallet */}
          <WalletButton />
        </div>
      </div>
    </header>
  );
};
