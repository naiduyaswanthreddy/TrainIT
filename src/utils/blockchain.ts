import { fetchAccountInfo } from './hive/account';

// Interface for blockchain provider configs
interface BlockchainConfig {
  name: string;
  icon: string;
  explorerURL: string;
  enabled: boolean;
  features: string[];
  fees: {
    low: number;
    average: number;
    high: number;
  };
  contractSupport: boolean;
  nftSupport: boolean;
  daoSupport: boolean;
  subscriptionSupport: boolean;
}

// Available blockchain providers with enhanced support details
export const blockchainProviders: Record<string, BlockchainConfig> = {
  hive: {
    name: 'Hive',
    icon: '/blockchains/hive.svg',
    explorerURL: 'https://hiveblocks.com',
    enabled: true,
    features: ['Feeless', 'Fast', 'Content Storage', 'Social'],
    fees: {
      low: 0,
      average: 0,
      high: 0
    },
    contractSupport: true,
    nftSupport: true,
    daoSupport: true,
    subscriptionSupport: true
  },
  ethereum: {
    name: 'Ethereum',
    icon: '/blockchains/ethereum.svg',
    explorerURL: 'https://etherscan.io',
    enabled: true,
    features: ['Smart Contracts', 'DeFi', 'NFTs', 'High Security'],
    fees: {
      low: 5,
      average: 15,
      high: 50
    },
    contractSupport: true,
    nftSupport: true,
    daoSupport: true,
    subscriptionSupport: true
  },
  solana: {
    name: 'Solana',
    icon: '/blockchains/solana.svg',
    explorerURL: 'https://explorer.solana.com',
    enabled: true,
    features: ['High Speed', 'Low Fees', 'NFTs', 'Scalable'],
    fees: {
      low: 0.001,
      average: 0.002,
      high: 0.005
    },
    contractSupport: true,
    nftSupport: true,
    daoSupport: true,
    subscriptionSupport: true
  },
  polygon: {
    name: 'Polygon',
    icon: '/blockchains/polygon.svg',
    explorerURL: 'https://polygonscan.com',
    enabled: true,
    features: ['Layer 2', 'Low Fees', 'EVM Compatible', 'Fast'],
    fees: {
      low: 0.01,
      average: 0.05,
      high: 0.1
    },
    contractSupport: true,
    nftSupport: true,
    daoSupport: true,
    subscriptionSupport: true
  },
  near: {
    name: 'NEAR',
    icon: '/blockchains/near.svg',
    explorerURL: 'https://explorer.near.org',
    enabled: true,
    features: ['User Friendly', 'Low Fees', 'Eco Friendly', 'Sharding'],
    fees: {
      low: 0.01,
      average: 0.05,
      high: 0.1
    },
    contractSupport: true,
    nftSupport: true,
    daoSupport: true,
    subscriptionSupport: false
  }
};

// Get enabled blockchain providers
export const getEnabledBlockchains = (): BlockchainConfig[] => {
  return Object.values(blockchainProviders).filter(provider => provider.enabled);
};

// Check user expertise level
export const assessUserExpertise = async (username: string): Promise<'beginner' | 'intermediate' | 'expert'> => {
  try {
    // Criteria for expertise assessment:
    // 1. Account age
    // 2. Number of transactions
    // 3. Account activity (posts, votes, etc.)
    
    const accountInfo = await fetchAccountInfo(username);
    
    // Get account creation date
    const accountCreationDate = new Date(accountInfo.created || new Date().toISOString());
    const now = new Date();
    const accountAgeInDays = Math.floor((now.getTime() - accountCreationDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Get account activity indicators
    const postCount = accountInfo.post_count || 0;
    const votingPower = accountInfo.voting_power || 0;
    
    // Calculate expertise score
    let expertiseScore = 0;
    
    // Account age score (max 30 points)
    if (accountAgeInDays > 365) {
      expertiseScore += 30; // > 1 year
    } else if (accountAgeInDays > 180) {
      expertiseScore += 20; // > 6 months
    } else if (accountAgeInDays > 30) {
      expertiseScore += 10; // > 1 month
    }
    
    // Activity score (max 40 points)
    if (postCount > 100) {
      expertiseScore += 20;
    } else if (postCount > 10) {
      expertiseScore += 10;
    }
    
    if (votingPower > 9000) { // 90% of max power
      expertiseScore += 20;
    } else if (votingPower > 5000) { // 50% of max power
      expertiseScore += 10;
    }
    
    // Determine expertise level
    if (expertiseScore >= 50) {
      return 'expert';
    } else if (expertiseScore >= 20) {
      return 'intermediate';
    } else {
      return 'beginner';
    }
  } catch (error) {
    console.error('Error assessing user expertise:', error);
    // Default to beginner if assessment fails
    return 'beginner';
  }
};

// Generate a mock blockchain transaction
export const generateMockTransaction = (
  blockchain: 'hive' | 'ethereum' | 'solana',
  from: string,
  to: string,
  amount: number
): string => {
  // Generate a mock transaction hash based on the blockchain
  const getRandomHash = (length: number): string => {
    const characters = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };
  
  switch (blockchain) {
    case 'ethereum':
      return `0x${getRandomHash(64)}`;
    case 'solana':
      return `${getRandomHash(87)}`;
    case 'hive':
    default:
      return `${getRandomHash(40)}`;
  }
};

// Get explorer URL for a transaction
export const getExplorerURL = (blockchain: 'hive' | 'ethereum' | 'solana', txHash: string): string => {
  switch (blockchain) {
    case 'ethereum':
      return `${blockchainProviders.ethereum.explorerURL}/tx/${txHash}`;
    case 'solana':
      return `${blockchainProviders.solana.explorerURL}/tx/${txHash}`;
    case 'hive':
    default:
      return `${blockchainProviders.hive.explorerURL}/tx/${txHash}`;
  }
};

// Map Hive projects to cross-chain deployments
export const getProjectBlockchainInfo = (projectId: string, supportedBlockchains: string[]) => {
  // This would normally fetch smart contract addresses and other details from a backend
  // For now, we'll just return mock data
  return {
    projectId,
    supportedBlockchains,
    contractAddresses: {
      ethereum: supportedBlockchains.includes('Ethereum') ? `0x${getRandomHash(40)}` : undefined,
      solana: supportedBlockchains.includes('Solana') ? getRandomHash(44) : undefined,
    }
  };
};

// Enhanced functions for cross-chain support

// Estimate gas fees for a transaction
export const estimateGasFees = (
  blockchain: 'ethereum' | 'solana' | 'polygon',
  transactionType: 'transfer' | 'contract' | 'nft' | 'subscription'
): { low: number; average: number; high: number; currency: string } => {
  const provider = blockchainProviders[blockchain];
  let multiplier = 1;
  
  switch (transactionType) {
    case 'transfer':
      multiplier = 1;
      break;
    case 'contract':
      multiplier = 2.5;
      break;
    case 'nft':
      multiplier = 3;
      break;
    case 'subscription':
      multiplier = 2;
      break;
  }
  
  return {
    low: provider.fees.low * multiplier,
    average: provider.fees.average * multiplier,
    high: provider.fees.high * multiplier,
    currency: blockchain === 'ethereum' ? 'ETH' : blockchain === 'solana' ? 'SOL' : 'MATIC'
  };
};

// Check if a project supports a specific blockchain feature
export const supportsFeature = (
  blockchain: string,
  feature: 'nft' | 'dao' | 'subscription' | 'contract'
): boolean => {
  const provider = blockchainProviders[blockchain.toLowerCase()];
  if (!provider) return false;
  
  switch (feature) {
    case 'nft':
      return provider.nftSupport;
    case 'dao':
      return provider.daoSupport;
    case 'subscription':
      return provider.subscriptionSupport;
    case 'contract':
      return provider.contractSupport;
    default:
      return false;
  }
};

// Simulate a layer 2 gasless transaction
export const executeGaslessTransaction = async (
  blockchain: 'ethereum' | 'polygon',
  from: string,
  to: string,
  amount: number,
  layer2Solution: 'zk-rollups' | 'optimistic-rollups' | 'sidechains'
): Promise<{ success: boolean; message: string; txHash?: string }> => {
  try {
    console.log(`Executing gasless transaction on ${blockchain} using ${layer2Solution}`);
    
    // In a real implementation, this would use actual layer 2 solutions
    // For now, we'll simulate the transaction
    return new Promise((resolve) => {
      setTimeout(() => {
        const txHash = `${layer2Solution}-${blockchain}-${getRandomHash(32)}`;
        
        resolve({
          success: true,
          message: `Successfully executed gasless transaction using ${layer2Solution}`,
          txHash
        });
      }, 1500);
    });
  } catch (error: any) {
    console.error('Error executing gasless transaction:', error);
    return {
      success: false,
      message: error.message || 'Failed to execute gasless transaction'
    };
  }
};

// Verify project on multiple blockchains
export const verifyProjectOnBlockchain = async (
  projectId: string,
  blockchain: 'hive' | 'ethereum' | 'solana'
): Promise<{ success: boolean; message: string; verified: boolean }> => {
  try {
    console.log(`Verifying project ${projectId} on ${blockchain}`);
    
    // In a real implementation, this would check the blockchain for project verification
    // For now, we'll simulate the verification
    return new Promise((resolve) => {
      setTimeout(() => {
        // 90% chance of successful verification
        const isVerified = Math.random() < 0.9;
        
        resolve({
          success: true,
          message: isVerified ? 'Project successfully verified' : 'Project verification failed',
          verified: isVerified
        });
      }, 1000);
    });
  } catch (error: any) {
    console.error('Error verifying project:', error);
    return {
      success: false,
      message: error.message || 'Failed to verify project',
      verified: false
    };
  }
};

// Helper for random hash generation
const getRandomHash = (length: number): string => {
  const characters = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Get supported layer 2 solutions for a blockchain
export const getLayer2Solutions = (blockchain: string): string[] => {
  switch (blockchain.toLowerCase()) {
    case 'ethereum':
      return ['Optimism', 'Arbitrum', 'zkSync', 'StarkNet', 'Polygon'];
    case 'solana':
      return []; // Solana doesn't need L2 solutions as it's already highly scalable
    case 'polygon':
      return ['Polygon zkEVM', 'Polygon Avail'];
    default:
      return [];
  }
};

// Simulate cross-chain asset transfer
export const simulateCrossChainTransfer = async (
  fromBlockchain: string,
  toBlockchain: string,
  amount: number,
  asset: string
): Promise<{ success: boolean; message: string; estimatedTime: number }> => {
  try {
    console.log(`Simulating transfer of ${amount} ${asset} from ${fromBlockchain} to ${toBlockchain}`);
    
    // Different blockchain pairs have different bridging times
    let estimatedTime = 5; // minutes
    
    if (
      (fromBlockchain.toLowerCase() === 'ethereum' && toBlockchain.toLowerCase() === 'solana') ||
      (fromBlockchain.toLowerCase() === 'solana' && toBlockchain.toLowerCase() === 'ethereum')
    ) {
      estimatedTime = 20; // Cross-chain bridges between different architectures take longer
    }
    
    return {
      success: true,
      message: `Transfer of ${amount} ${asset} from ${fromBlockchain} to ${toBlockchain} would take approximately ${estimatedTime} minutes`,
      estimatedTime
    };
  } catch (error: any) {
    console.error('Error simulating cross-chain transfer:', error);
    return {
      success: false,
      message: error.message || 'Failed to simulate cross-chain transfer',
      estimatedTime: 0
    };
  }
};
