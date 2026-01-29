import { connect, disconnect, isConnected, getLocalStorage, request } from '@stacks/connect';
import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network';

// Network configuration - using testnet for development
export const network = STACKS_TESTNET;
export const mainnetNetwork = STACKS_MAINNET;

// Contract configuration - update these after deployment
export const CONTRACT_ADDRESS = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'; // Replace with your deployed contract address
export const CONTRACT_NAME = 'pollbag';

// Helper functions using the new @stacks/connect API
export const connectWallet = async (onSuccess?: () => void) => {
  try {
    if (isConnected()) {
      console.log('Already connected');
      if (onSuccess) onSuccess();
      return;
    }
    
    const response = await connect();
    console.log('Connected:', response);
    if (onSuccess) onSuccess();
  } catch (error) {
    console.error('Failed to connect wallet:', error);
  }
};

export const disconnectWallet = () => {
  disconnect();
};

export const isUserSignedIn = () => {
  return isConnected();
};

export const getUserAddress = () => {
  const userData = getLocalStorage();
  if (userData?.addresses) {
    // Return testnet address
    return userData.addresses.stx?.[0]?.address || null;
  }
  return null;
};

export const getMainnetAddress = () => {
  const userData = getLocalStorage();
  if (userData?.addresses) {
    return userData.addresses.stx?.[0]?.address || null;
  }
  return null;
};

export const truncateAddress = (address: string, chars = 4) => {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

// STX formatting
export const formatSTX = (microSTX: number | bigint) => {
  const stx = Number(microSTX) / 1_000_000;
  return stx.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 });
};

export const parseSTX = (stx: number) => {
  return Math.floor(stx * 1_000_000);
};

// Contract interaction helpers (for future use when contract is deployed)
export const callContract = async (
  contractAddress: string,
  contractName: string,
  functionName: string,
  functionArgs: any[]
) => {
  try {
    const response = await request('stx_callContract', {
      contract: `${contractAddress}.${contractName}`,
      functionName,
      functionArgs,
    } as any);
    console.log('Transaction ID:', (response as any).txid);
    return response;
  } catch (error) {
    console.error('Contract call failed:', error);
    throw error;
  }
};
