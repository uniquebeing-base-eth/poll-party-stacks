import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WalletButton } from './WalletButton';
import { Plus, Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import pollbagLogo from '@/assets/pollbag-logo.png';

const NAV_ITEMS = [
  { path: '/', label: 'Polls', icon: null },
  { path: '/create', label: 'Create', icon: Plus },
  { path: '/rewards', label: 'Rewards', icon: Gift },
];

export const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <motion.div 
              className="flex h-10 w-10 items-center justify-center"
              whileHover={{ rotate: 10, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <img src={pollbagLogo} alt="Pollbag Logo" className="h-10 w-10" />
            </motion.div>
            <span className="text-xl font-bold">
              Poll<span className="text-gradient">bag</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
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
                  {Icon && <Icon className="h-4 w-4" />}
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
