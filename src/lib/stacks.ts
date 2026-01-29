import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network';

// App configuration
export const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

// Network configuration - using testnet for development
export const network = STACKS_TESTNET;
export const mainnetNetwork = STACKS_MAINNET;

// Contract configuration - update these after deployment
export const CONTRACT_ADDRESS = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'; // Replace with your deployed contract address
export const CONTRACT_NAME = 'pollbag';

// Helper functions
export const connectWallet = (onSuccess?: () => void) => {
  showConnect({
    appDetails: {
      name: 'Pollbag',
      icon: window.location.origin + '/favicon.ico',
    },
    redirectTo: '/',
    onFinish: () => {
      if (onSuccess) onSuccess();
      window.location.reload();
    },
    userSession,
  });
};

export const disconnectWallet = () => {
  userSession.signUserOut('/');
};

export const isUserSignedIn = () => {
  return userSession.isUserSignedIn();
};

export const getUserAddress = () => {
  if (!isUserSignedIn()) return null;
  const userData = userSession.loadUserData();
  return userData.profile.stxAddress.testnet;
};

export const getMainnetAddress = () => {
  if (!isUserSignedIn()) return null;
  const userData = userSession.loadUserData();
  return userData.profile.stxAddress.mainnet;
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
