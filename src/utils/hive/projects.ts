
import { HiveProject, Project } from './types';
import { fetchProjectDetails as fetchDetails } from './fetch';
import { formatPostToProject as formatPost } from './formatters';
import { postProject as post } from './posting';
import { deploySmartContract } from './smart-contracts';
import { uploadToDecentralizedStorage } from './storage';
import { createGovernanceProposal } from './governance';
import { issueNftReward } from './nft';
import { manageSubscription } from './subscription';
import { getUserExpertiseLevel } from './user';

// Re-export functions
export const fetchProjectDetails = fetchDetails;
export const formatPostToProject = formatPost;
export const postProject = post;
export const deployContract = deploySmartContract;
export const uploadStorage = uploadToDecentralizedStorage;
export const createProposal = createGovernanceProposal;
export const issueNft = issueNftReward;
export const manageUserSubscription = manageSubscription;
export const getExpertiseLevel = getUserExpertiseLevel;
