import { HiveProject } from './types';

/**
 * Fetch project details from the Hive blockchain
 */
export const fetchProjectDetails = async (author: string, permlink: string): Promise<HiveProject | null> => {
  try {
    // Check if Hive Keychain is available
    if (!window.hive_keychain) {
      console.warn('Hive Keychain extension is not installed');
      return null;
    }
    
    // In a real implementation, this would query the Hive blockchain
    // For now, we'll simulate the API call
    const response = await fetch(`https://api.hive.blog/condenser_api/get_content?author=${author}&permlink=${permlink}`);
    const data = await response.json();
    
    if (!data.result || !data.result.author) {
      return null;
    }
    
    // Calculate progress as a percentage of the funding goal
    const fundingGoal = 1000;
    const raisedAmount = parseFloat(data.result.pending_payout_value.split(' ')[0]) || 0;
    const progressPercentage = Math.min(100, Math.round((raisedAmount / fundingGoal) * 100));
    
    // Create a properly typed object using HiveProject interface
    const project: HiveProject = {
      author: data.result.author,
      permlink: data.result.permlink,
      title: data.result.title,
      body: data.result.body,
      category: data.result.category,
      created: data.result.created,
      json_metadata: data.result.json_metadata,
      // Add other required fields
      payout: parseFloat(data.result.pending_payout_value.split(' ')[0])
    };
    
    return project;
  } catch (error) {
    console.error('Error fetching project details:', error);
    return null;
  }
};
