
// Collection of supported blockchain providers
export const blockchainProviders = {
  'hive': {
    name: 'Hive',
    icon: 'https://cryptologos.cc/logos/hive-blockchain-hive-logo.png',
    endpoint: 'https://api.hive.blog',
    keychain: true
  },
  'ethereum': {
    name: 'Ethereum',
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    endpoint: 'https://mainnet.infura.io/v3/',
    keychain: false
  },
  'polygon': {
    name: 'Polygon',
    icon: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
    endpoint: 'https://polygon-rpc.com',
    keychain: false
  },
  'solana': {
    name: 'Solana',
    icon: 'https://cryptologos.cc/logos/solana-sol-logo.png',
    endpoint: 'https://api.mainnet-beta.solana.com',
    keychain: false
  },
  'avalanche': {
    name: 'Avalanche',
    icon: 'https://cryptologos.cc/logos/avalanche-avax-logo.png',
    endpoint: 'https://api.avax.network/ext/bc/C/rpc',
    keychain: false
  }
};

// Return enabled blockchains with mocked state
export const getEnabledBlockchains = () => {
  // For now, return all blockchains
  return Object.entries(blockchainProviders).map(([key, value]) => ({
    name: value.name,
    icon: value.icon,
    enabled: true
  }));
};
