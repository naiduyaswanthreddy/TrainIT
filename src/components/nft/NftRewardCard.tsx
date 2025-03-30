
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getConnectedUsername } from "@/utils/hive/auth";
import { NftReward } from "@/utils/hive/types";
import { useToast } from "@/hooks/use-toast";
import { Gift, ChevronRight, Check, Lock, AlertCircle } from "lucide-react";

interface NftRewardCardProps {
  reward: NftReward;
  userOwns: boolean;
  userContribution: number;
  onClaim: () => void;
}

export function NftRewardCard({ reward, userOwns, userContribution, onClaim }: NftRewardCardProps) {
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  const username = getConnectedUsername();
  
  // Use supply and remaining as fallbacks for totalSupply and issuedCount
  const totalSupply = reward.totalSupply || reward.supply || 0;
  const issuedCount = reward.issuedCount || (totalSupply - (reward.remaining || 0)) || 0;
  
  const isAvailable = issuedCount < totalSupply;
  // Convert minContribution to number for comparison
  const minContributionValue = typeof reward.minContribution === 'string' 
    ? parseFloat(reward.minContribution) 
    : (reward.minContribution || 0);
  const isEligible = userContribution >= minContributionValue;
  const supplyPercentage = totalSupply > 0 ? (issuedCount / totalSupply) * 100 : 0;
  
  const handleClaim = async () => {
    if (!username) {
      toast({
        title: "Authentication Required",
        description: "Please connect your wallet to claim this NFT",
        variant: "destructive",
      });
      return;
    }
    
    if (!isEligible) {
      toast({
        title: "Not Eligible",
        description: `You need to contribute at least ${reward.minContribution} HIVE to claim this NFT`,
        variant: "destructive",
      });
      return;
    }
    
    if (!isAvailable) {
      toast({
        title: "Sold Out",
        description: "All NFTs for this reward have been claimed",
        variant: "destructive",
      });
      return;
    }
    
    if (userOwns) {
      toast({
        title: "Already Owned",
        description: "You already own this NFT reward",
        variant: "destructive",
      });
      return;
    }
    
    setIsClaimLoading(true);
    
    try {
      // In a production app, this would trigger an on-chain transaction
      // For now, we'll just call the provided callback
      await onClaim();
    } catch (error) {
      console.error("Error claiming NFT:", error);
      toast({
        title: "Error",
        description: "Failed to claim NFT reward",
        variant: "destructive",
      });
    } finally {
      setIsClaimLoading(false);
    }
  };
  
  // Get the contribution difference needed
  const contributionDifference = minContributionValue - userContribution;
  
  const blockchainBadgeColors: Record<string, string> = {
    hive: "bg-blue-900/40 text-blue-300 border-blue-800",
    ethereum: "bg-purple-900/40 text-purple-300 border-purple-800",
    solana: "bg-green-900/40 text-green-300 border-green-800"
  };
  
  const blockchainBadgeColor = reward.blockchain && blockchainBadgeColors[reward.blockchain.toLowerCase()] || "bg-gray-900/40 text-gray-300 border-gray-800";
  
  // Use name as fallback for title
  const displayTitle = reward.title || reward.name || "NFT Reward";
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden border-gray-800 bg-card/30 h-full">
        <CardHeader className="relative p-0">
          <div className="h-48 relative overflow-hidden">
            <img
              src={reward.image}
              alt={displayTitle}
              className="w-full h-full object-cover transition-transform duration-500"
              style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
            
            <div className="absolute top-2 right-2 flex flex-col gap-2">
              <Badge
                variant="outline"
                className={`${blockchainBadgeColor}`}
              >
                {reward.blockchain ? reward.blockchain.toUpperCase() : 'HIVE'}
              </Badge>
              
              {userOwns && (
                <Badge className="bg-green-700/60 text-green-200 border-green-600">
                  <Check className="h-3 w-3 mr-1" /> Owned
                </Badge>
              )}
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <CardTitle className="text-white">{displayTitle}</CardTitle>
            <CardDescription className="text-gray-300 truncate">
              {reward.description}
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="pt-4 pb-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">
              Minimum Contribution
            </span>
            <span className="font-semibold text-white">
              {reward.minContribution} HIVE
            </span>
          </div>
          
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-400">
              Availability
            </span>
            <span className="font-semibold text-white">
              {issuedCount} / {totalSupply}
            </span>
          </div>
          
          <Progress value={supplyPercentage} className="h-2 mb-2 bg-gray-700 progress-animate" />
          
          <div className="text-xs text-right text-gray-400 mb-2">
            {isAvailable 
              ? `${totalSupply - issuedCount} remaining` 
              : "Sold out"
            }
          </div>
          
          {!isEligible && !userOwns && (
            <div className="bg-orange-900/20 border border-orange-800/30 rounded-md p-2 mb-3">
              <div className="flex items-center text-orange-300 text-xs">
                <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                <span>Contribute {contributionDifference > 0 ? contributionDifference : 0} more HIVE to unlock</span>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="pt-0">
          <Button
            className={`w-full ${
              userOwns
                ? "bg-green-700 hover:bg-green-800"
                : isEligible && isAvailable
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  : "bg-gray-700 hover:bg-gray-800"
            }`}
            disabled={!isEligible || !isAvailable || userOwns || isClaimLoading}
            onClick={handleClaim}
          >
            {isClaimLoading ? (
              <span className="flex items-center">
                Loading...
              </span>
            ) : userOwns ? (
              <span className="flex items-center">
                <Check className="h-4 w-4 mr-2" />
                Owned
              </span>
            ) : !isAvailable ? (
              <span className="flex items-center">
                Sold Out
              </span>
            ) : !isEligible ? (
              <span className="flex items-center">
                <Lock className="h-4 w-4 mr-2" />
                Locked
              </span>
            ) : (
              <span className="flex items-center">
                <Gift className="h-4 w-4 mr-2" />
                Claim NFT
                <ChevronRight className="h-4 w-4 ml-1" />
              </span>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
