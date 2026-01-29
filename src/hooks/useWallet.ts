import { useState, useEffect, useCallback } from 'react';
import { 
  userSession, 
  connectWallet as connect, 
  disconnectWallet as disconnect,
  getUserAddress,
  isUserSignedIn 
} from '@/lib/stacks';

export const useWallet = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkConnection = () => {
      const signedIn = isUserSignedIn();
      setIsConnected(signedIn);
      setAddress(signedIn ? getUserAddress() : null);
      setIsLoading(false);
    };

    // Check on mount
    checkConnection();

    // Check if there's a pending sign-in
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then(() => {
        checkConnection();
      });
    }
  }, []);

  const connectWallet = useCallback(() => {
    connect(() => {
      setIsConnected(true);
      setAddress(getUserAddress());
    });
  }, []);

  const disconnectWallet = useCallback(() => {
    disconnect();
    setIsConnected(false);
    setAddress(null);
  }, []);

  return {
    isConnected,
    address,
    isLoading,
    connectWallet,
    disconnectWallet,
  };
};
