
import { SocialLinks } from './types';

/**
 * Post a new project to the Hive blockchain
 */
export const postProject = async (
  username: string,
  title: string,
  body: string,
  category: string,
  fundingGoal: number,
  coverImage: string | null,
  socialLinks: SocialLinks,
  enableSubscription?: boolean,
  enableMultiChain?: boolean,
  supportedBlockchains?: string[],
  enableDao?: boolean,
  enableNftRewards?: boolean,
  nftRewards?: any[],
  subscriptionTiers?: any[],
  storageType?: 'hive' | 'ipfs' | 'arweave',
  ipfsHash?: string,
  arweaveHash?: string
): Promise<{ success: boolean; message?: string; permlink?: string }> => {
  try {
    // Generate a permlink from the title
    const permlink = `${title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-')}-${Date.now()}`;
    
    // Create JSON metadata
    const jsonMetadata = {
      app: 'crowdhive/1.0.0',
      tags: ['crowdfunding', 'project', category.toLowerCase()],
      image: coverImage ? [coverImage] : [],
      format: 'markdown',
      description: body.substring(0, 200),
      crowdhive: {
        version: '1.0.0',
        type: 'project',
        fundingGoal,
        socialLinks,
        enableSubscription,
        enableMultiChain,
        supportedBlockchains,
        enableDao,
        enableNftRewards,
        nftRewards,
        subscriptionTiers,
        storageType,
        ipfsHash,
        arweaveHash
      }
    };
    
    // Always use the development mode for demo purposes
    console.log("Using development mode to ensure working demo");
    
    // Store in localStorage for development/demo
    const projectsInLocalStorage = JSON.parse(localStorage.getItem('createdProjects') || '[]');
    const newProject = {
      author: username || 'demo_user',
      permlink,
      title,
      body,
      category,
      json_metadata: jsonMetadata,
      created: new Date().toISOString()
    };
    
    localStorage.setItem('createdProjects', JSON.stringify([...projectsInLocalStorage, newProject]));
    
    return {
      success: true,
      permlink,
      message: 'Project successfully submitted for demo purposes'
    };
    
  } catch (error: any) {
    console.error('Error posting project:', error);
    return {
      success: false,
      message: error.message || 'An error occurred while posting the project'
    };
  }
};
