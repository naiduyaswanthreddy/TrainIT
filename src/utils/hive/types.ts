export interface SocialLinks {
  website: string;
  twitter: string;
  discord: string;
  github: string;
}

export interface DidVerification {
  username: string;
  level: 'verified' | 'unverified' | 'pending' | 'basic';
  verificationDate?: string;
  verifier?: string;
  lastVerified?: string;
  provider?: string;
  linkedAccounts?: {
    platform: string;
    username: string;
    verified: boolean;
  }[];
}

export interface HiveProject {
  author: string;
  permlink: string;
  title: string;
  body: string;
  category: string;
  created: string;
  payout?: number;
  json_metadata: {
    app: string;
    tags: string[];
    image?: string[];
    format: string;
    description: string;
    crowdhive: {
      version: string;
      type: string;
      fundingGoal: number;
      socialLinks: SocialLinks;
      enableSubscription?: boolean;
      enableMultiChain?: boolean;
      supportedBlockchains?: string[];
      enableDao?: boolean;
      enableNftRewards?: boolean;
      nftRewards?: any[];
      subscriptionTiers?: any[];
      storageType?: 'hive' | 'ipfs' | 'arweave';
      ipfsHash?: string;
      arweaveHash?: string;
    }
  }
  id?: string;
}

export interface HiveAccount {
  name: string;
  balance: string;
  hbd_balance: string;
  vesting_shares: string;
  reputation: number;
  profile_image?: string;
  did?: any;
  created?: string;
  post_count?: number;
  voting_power?: number;
}

export interface Project {
  id: string;
  author: string;
  permlink: string;
  title: string;
  description: string;
  body: string;
  category: string;
  fundingGoal: number;
  currentFunding: number;
  coverImage?: string | null;
  socialLinks: SocialLinks;
  created: string;
  backers: number;
  daysLeft: number;
  percentFunded: number;
  enableSubscription?: boolean;
  enableMultiChain?: boolean;
  supportedBlockchains?: string[];
  enableDao?: boolean;
  enableNftRewards?: boolean;
  nftRewards?: any[];
  subscriptionTiers?: any[];
  // Added properties that components are using
  image?: string;
  creator?: string;
  progress?: number;
  target?: string;
  raised?: string;
  contributors?: Array<{username: string, amount: string, date: string}>;
  createdAt?: string;
  status?: 'active' | 'funded' | 'completed';
  governanceEnabled?: boolean;
  rewards?: NftReward[];
  verificationStatus?: string;
}

export interface ProjectWithMetrics extends Project {
  viewCount?: number;
  bookmarkCount?: number;
  shareCount?: number;
  engagementScore?: number;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  benefits: string[];
  duration: 'monthly' | 'annual';
}

export interface NftReward {
  id: string;
  name: string;
  description: string;
  image: string;
  supply: number;
  remaining: number;
  minContribution: number;
  blockchain: 'hive' | 'ethereum' | 'solana';
  metadata: {
    attributes?: Array<{
      trait_type: string;
      value: string;
    }>;
    external_url?: string;
    animation_url?: string;
  };
  // Added missing properties used in components
  title?: string;
  issuedCount?: number;
  totalSupply?: number;
}

export interface KeychainResponse {
  success: boolean;
  message?: string;
  result?: any;
  error?: string;
}

export interface SmartContractDashboardProps {
  projectId: string;
}

export interface FraudDetectionPanelProps {
  projectId: string;
}

export interface DecentralizedStorageInfoProps {
  projectId: string;
}

export interface GaslessTransactionsPanelProps {
  projectId: string;
}

export interface GovernanceProposal {
  id: string;
  projectId: string;
  title: string;
  description: string;
  options: string[];
  startDate: string;
  endDate: string;
  creatorId: string;
  status: 'pending' | 'active' | 'completed';
  results?: Record<string, number>;
}

export interface GovernanceVote {
  userId: string;
  proposalId: string;
  option: string;
  votingPower: number;
  timestamp: string;
}

export interface ImpactMetricsDisplayProps {
  projectId: string;
}

export interface GovernanceTabProps {
  projectId: string;
}

export interface NftRewardsTabProps {
  projectId: string;
}
