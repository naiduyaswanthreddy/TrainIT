
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { NftRewardCard } from "./NftRewardCard";
import { CreateNftRewardForm } from "./CreateNftRewardForm";
import { NftReward } from "@/utils/hive/types";
import { getProjectNftRewards, userHasNft } from "@/utils/hive/nft";
import { getConnectedUsername } from "@/utils/hive/auth";
import { useToast } from "@/hooks/use-toast";
import { Gift, PlusCircle, Loader2 } from "lucide-react";
import { userOwnsProject } from "@/utils/hive/auth";

interface NftRewardsTabProps {
  projectId: string;
}

export function NftRewardsTab({ projectId }: NftRewardsTabProps) {
  const [rewards, setRewards] = useState<NftReward[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [userNfts, setUserNfts] = useState<Record<string, boolean>>({});
  const [contributionAmount, setContributionAmount] = useState(0);
  const { toast } = useToast();
  const username = getConnectedUsername();
  const canCreateReward = userOwnsProject(projectId, username);
  
  useEffect(() => {
    const loadRewards = () => {
      setIsLoading(true);
      
      try {
        // Fetch all NFT rewards for this project
        const projectRewards = getProjectNftRewards(projectId);
        
        // If user is logged in, check which NFTs they own
        if (username) {
          const nftStatus: Record<string, boolean> = {};
          projectRewards.forEach(reward => {
            nftStatus[reward.id] = userHasNft(reward.id, username);
          });
          setUserNfts(nftStatus);
          
          // Get user's contribution amount
          // In a real app, this would be fetched from the blockchain
          const contributors = JSON.parse(localStorage.getItem('projectContributors') || '[]');
          const userContributions = contributors.filter(
            (c: any) => c.userId === username && c.projectId === projectId
          );
          
          let totalAmount = 0;
          userContributions.forEach((contribution: any) => {
            const amount = parseFloat(contribution.amount);
            if (!isNaN(amount)) {
              totalAmount += amount;
            }
          });
          
          setContributionAmount(totalAmount);
        }
        
        setRewards(projectRewards);
      } catch (error) {
        console.error("Error loading NFT rewards:", error);
        toast({
          title: "Error",
          description: "Failed to load NFT rewards",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRewards();
  }, [projectId, username, toast]);
  
  const handleRewardCreated = () => {
    // Refresh rewards
    const projectRewards = getProjectNftRewards(projectId);
    setRewards(projectRewards);
    
    toast({
      title: "Reward Created",
      description: "Your NFT reward has been created successfully",
    });
  };
  
  const handleClaimNft = async (rewardId: string) => {
    // This would trigger an on-chain transaction in a production app
    // For now, we'll just update the local state
    
    setUserNfts(prev => ({ ...prev, [rewardId]: true }));
    
    toast({
      title: "NFT Claimed",
      description: "You have successfully claimed this NFT reward!",
    });
  };
  
  const isEligibleForReward = (reward: NftReward) => {
    const minContribValue = typeof reward.minContribution === 'number'
      ? reward.minContribution
      : 0;
    return contributionAmount >= minContribValue;
  };
  
  return (
    <div className="mt-4 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-purple-400" />
          <h3 className="text-xl font-semibold">NFT Rewards</h3>
        </div>
        
        {canCreateReward && (
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create NFT Reward
          </Button>
        )}
      </div>
      
      {username && contributionAmount > 0 && (
        <div className="bg-purple-900/20 border border-purple-900/40 rounded-lg p-4 text-sm">
          <p className="flex items-center text-purple-300">
            <Gift className="h-4 w-4 mr-2 text-purple-400" />
            You have contributed <span className="font-bold mx-1">{contributionAmount} HIVE</span> to this project.
            {rewards.some(r => isEligibleForReward(r) && !userNfts[r.id]) && (
              <span className="ml-1">You are eligible for some rewards!</span>
            )}
          </p>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        </div>
      ) : rewards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward, index) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <NftRewardCard
                reward={reward}
                userOwns={userNfts[reward.id] || false}
                userContribution={contributionAmount}
                onClaim={() => handleClaimNft(reward.id)}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 glass-card rounded-xl">
          <Gift className="h-12 w-12 mx-auto text-gray-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No NFT Rewards</h3>
          <p className="text-gray-400 mb-4">
            This project hasn't created any NFT rewards yet.
          </p>
          {canCreateReward && (
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create NFT Reward
            </Button>
          )}
        </div>
      )}
      
      <CreateNftRewardForm
        projectId={projectId}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onRewardCreated={handleRewardCreated}
      />
    </div>
  );
}
