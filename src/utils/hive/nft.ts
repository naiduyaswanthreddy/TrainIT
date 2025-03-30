
/**
 * Issue NFT rewards to project backers
 */
export const issueNftReward = async (
  projectId: string,
  nftId: string,
  recipient: string,
  blockchain: 'hive' | 'ethereum' | 'solana'
): Promise<{ success: boolean; message: string; txId?: string }> => {
  try {
    console.log(`Issuing NFT ${nftId} from project ${projectId} to ${recipient} on ${blockchain}`);
    
    // In a real implementation, this would mint and transfer an NFT on the blockchain
    // For now, we'll simulate the process
    return new Promise((resolve) => {
      setTimeout(() => {
        const txId = `${blockchain}-tx-${Math.random().toString(16).substr(2, 16)}`;
        
        resolve({
          success: true,
          message: `NFT successfully issued to ${recipient}`,
          txId
        });
      }, 1500);
    });
  } catch (error: any) {
    console.error('Error issuing NFT reward:', error);
    return {
      success: false,
      message: error.message || 'Failed to issue NFT reward'
    };
  }
};

/**
 * Create a new NFT reward for a project
 */
export const createNftReward = async (
  projectId: string,
  title: string,
  description: string,
  imageUrl: string,
  totalSupply: number,
  minContribution: number,
  blockchain: 'hive' | 'ethereum' | 'solana',
  attributes: any[] = []
): Promise<{ success: boolean; message: string; nftId?: string }> => {
  try {
    console.log(`Creating NFT reward for project ${projectId} on ${blockchain}`);
    
    // Generate a unique NFT ID
    const nftId = `nft-${Date.now()}-${Math.random().toString(16).substr(2, 8)}`;
    
    // In a real implementation, this would interact with the blockchain
    // For now, we'll store in localStorage for demo purposes
    const nftData = {
      id: nftId,
      projectId,
      title,
      description,
      image: imageUrl,
      totalSupply,
      minContribution,
      blockchain,
      attributes,
      createdAt: new Date().toISOString()
    };
    
    // Store the NFT reward in localStorage
    const storedRewards = JSON.parse(localStorage.getItem('nftRewards') || '[]');
    storedRewards.push(nftData);
    localStorage.setItem('nftRewards', JSON.stringify(storedRewards));
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'NFT reward created successfully',
          nftId
        });
      }, 1000);
    });
  } catch (error: any) {
    console.error('Error creating NFT reward:', error);
    return {
      success: false,
      message: error.message || 'Failed to create NFT reward'
    };
  }
};

/**
 * Get all NFT rewards for a specific project
 */
export const getProjectNftRewards = (projectId: string) => {
  try {
    // In a real implementation, this would fetch NFTs from the blockchain
    // For now, we'll retrieve from localStorage
    const storedRewards = JSON.parse(localStorage.getItem('nftRewards') || '[]');
    return storedRewards.filter((reward: any) => reward.projectId === projectId);
  } catch (error) {
    console.error('Error getting project NFT rewards:', error);
    return [];
  }
};

/**
 * Check if a user has a specific NFT
 */
export const userHasNft = (nftId: string, userId: string) => {
  try {
    // In a real implementation, this would check the user's wallet on the blockchain
    // For now, we'll retrieve from localStorage for demo purposes
    const userNfts = JSON.parse(localStorage.getItem(`${userId}_nfts`) || '[]');
    return userNfts.includes(nftId);
  } catch (error) {
    console.error('Error checking user NFT ownership:', error);
    return false;
  }
};
