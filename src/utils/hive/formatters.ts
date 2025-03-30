
import { HiveProject, SocialLinks, Project } from './types';

/**
 * Format a Hive post to a Project object
 */
export const formatPostToProject = (post: HiveProject): Project => {
  try {
    const metadata = typeof post.json_metadata === 'string' 
      ? JSON.parse(post.json_metadata) 
      : post.json_metadata;
    
    const crowdhiveData = metadata?.crowdhive || {};
    
    // Calculate progress as a percentage of the funding goal
    const fundingGoal = crowdhiveData.fundingGoal || 1000;
    const raisedAmount = post.payout || 0;
    const progressPercentage = Math.min(100, Math.round((raisedAmount / fundingGoal) * 100));

    return {
      id: `${post.author}-${post.permlink}`,
      title: post.title,
      author: post.author,
      creator: post.author, // Add creator alias for compatibility
      permlink: post.permlink,
      body: post.body,
      description: post.body.substring(0, 200) + (post.body.length > 200 ? '...' : ''),
      image: metadata?.image?.[0] || 'https://placehold.co/600x400/222/ccc?text=Project+Image',
      category: post.category,
      target: `${fundingGoal} HIVE`,
      raised: `${raisedAmount.toFixed(2)} HIVE`,
      progress: progressPercentage,
      created: post.created,
      createdAt: post.created, // Add createdAt alias for compatibility
      status: progressPercentage >= 100 ? 'funded' : 'active',
      contributors: [],
      backers: 0,
      daysLeft: 30, // Default value
      percentFunded: progressPercentage,
      fundingGoal: fundingGoal,
      currentFunding: raisedAmount,
      socialLinks: crowdhiveData.socialLinks || {
        website: '',
        twitter: '',
        discord: '',
        github: ''
      } as SocialLinks,
      governanceEnabled: crowdhiveData.enableDao || false,
      verificationStatus: 'unverified'
    };
  } catch (error) {
    console.error('Error formatting post to project:', error);
    // Provide default values that match the Project interface
    return {
      id: `${post.author}-${post.permlink}`,
      title: post.title,
      author: post.author,
      creator: post.author, // Add creator alias for compatibility
      permlink: post.permlink,
      body: post.body,
      description: post.body.substring(0, 200) + (post.body.length > 200 ? '...' : ''),
      image: 'https://placehold.co/600x400/222/ccc?text=Project+Image',
      category: post.category,
      target: '1000 HIVE',
      raised: '0 HIVE',
      progress: 0,
      created: post.created,
      createdAt: post.created, // Add createdAt alias for compatibility
      status: 'active',
      contributors: [],
      backers: 0,
      daysLeft: 30,
      percentFunded: 0,
      fundingGoal: 1000,
      currentFunding: 0,
      socialLinks: {
        website: '',
        twitter: '',
        discord: '',
        github: ''
      }
    };
  }
};
