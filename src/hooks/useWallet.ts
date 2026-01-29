import { useState, useEffect, useCallback } from 'react';
import { isConnected, getLocalStorage, disconnect } from '@stacks/connect';
import { connectWallet as connect } from '@/lib/stacks';

export const useWallet = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkConnection = useCallback(() => {
    const connected = isConnected();
    setIsWalletConnected(connected);
    
    if (connected) {
      const userData = getLocalStorage();
      if (userData?.addresses?.stx?.[0]?.address) {
        setAddress(userData.addresses.stx[0].address);
      }
    } else {
      setAddress(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Check connection on mount
    checkConnection();

    // Poll for connection status changes (wallet might connect/disconnect externally)
    const interval = setInterval(checkConnection, 1000);
    
    return () => clearInterval(interval);
  }, [checkConnection]);

  const connectWallet = useCallback(async () => {
    setIsLoading(true);
    await connect(() => {
      checkConnection();
    });
    // Also check immediately in case connect completes synchronously
    setTimeout(checkConnection, 500);
  }, [checkConnection]);

  const disconnectWallet = useCallback(() => {
    disconnect();
    setIsWalletConnected(false);
    setAddress(null);
  }, []);

  return {
    isConnected: isWalletConnected,
    address,
    isLoading,
    connectWallet,
    disconnectWallet,
  };
};
