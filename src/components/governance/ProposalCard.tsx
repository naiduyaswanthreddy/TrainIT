import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Award, Calendar, Users, CheckCircle, XCircle } from "lucide-react";
import { GovernanceProposal, GovernanceVote } from "@/utils/hive/types";
import { useToast } from "@/hooks/use-toast";
import { getConnectedUsername } from "@/utils/hive/auth";
import { format, formatDistance } from "date-fns";
import { nanoid } from "nanoid";

interface ProposalCardProps {
  proposal: GovernanceProposal;
  userVotes?: Record<string, string>;
  governanceTokens?: number;
  onVote?: (proposalId: string, option: string) => void;
}

export function ProposalCard({ proposal, userVotes, governanceTokens = 0, onVote }: ProposalCardProps) {
  const [isVoting, setIsVoting] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(userVotes?.[proposal.id] || null);
  const { toast } = useToast();
  
  const endDate = new Date(proposal.endDate);
  const startDate = new Date(proposal.startDate);
  const now = new Date();
  const isActive = proposal.status === 'active' && endDate > now;
  const isCompleted = proposal.status === 'completed' || endDate <= now;
  // Fix pending comparison by checking for string "pending" instead of comparing with type
  const isPending = proposal.status === 'pending' || false;
  const isExpired = endDate <= now && proposal.status === 'active';
  
  const timeLeft = isActive 
    ? formatDistance(endDate, now, { addSuffix: true })
    : '';
  
  const userHasVoted = !!selectedOption;
  
  // Calculate vote results
  const calculateResults = () => {
    if (!proposal.results) return {};
    
    // Ensure all values are numbers before summing
    const totalVotes = Object.values(proposal.results).reduce((sum, count) => {
      const numCount = typeof count === 'number' ? count : 0;
      return sum + numCount;
    }, 0);
    
    return Object.entries(proposal.results).reduce((acc, [option, count]) => {
      const numCount = typeof count === 'number' ? count : 0;
      const percentage = totalVotes > 0 ? Math.round((numCount / totalVotes) * 100) : 0;
      
      return {
        ...acc,
        [option]: { count: numCount, percentage }
      };
    }, {} as Record<string, { count: number; percentage: number }>);
  };
  
  const results = calculateResults();
  
  const handleVote = async (option: string) => {
    const username = getConnectedUsername();
    
    if (!username) {
      toast({
        title: "Authentication Required",
        description: "Please connect your Hive wallet to vote on proposals",
        variant: "destructive"
      });
      return;
    }
    
    if (governanceTokens <= 0) {
      toast({
        title: "Insufficient Tokens",
        description: "You need governance tokens to vote on this proposal",
        variant: "destructive"
      });
      return;
    }
    
    setIsVoting(true);
    
    try {
      // In a real implementation, this would be an on-chain vote
      // For now, we'll simulate it with localStorage
      
      // Create a new vote
      const vote: GovernanceVote = {
        userId: username,
        proposalId: proposal.id,
        option,
        votingPower: governanceTokens,
        timestamp: new Date().toISOString()
      };
      
      // Store the vote
      const storedVotes = JSON.parse(localStorage.getItem('governanceVotes') || '[]');
      
      // Remove any existing votes by this user for this proposal
      const filteredVotes = storedVotes.filter(
        (v: GovernanceVote) => !(v.userId === username && v.proposalId === proposal.id)
      );
      
      // Add the new vote
      filteredVotes.push(vote);
      localStorage.setItem('governanceVotes', JSON.stringify(filteredVotes));
      
      // Update displayed option
      setSelectedOption(option);
      
      // Update proposal results (in a real app, this would be calculated on-chain)
      const proposalsData = JSON.parse(localStorage.getItem('governanceProposals') || '[]');
      const updatedProposals = proposalsData.map((p: GovernanceProposal) => {
        if (p.id === proposal.id) {
          // Calculate new results
          const allVotes = filteredVotes.filter((v: GovernanceVote) => v.proposalId === proposal.id);
          const resultsByOption = allVotes.reduce((acc: Record<string, number>, v: GovernanceVote) => {
            const voteCount = typeof v.votingPower === 'number' ? v.votingPower : 0;
            acc[v.option] = (acc[v.option] || 0) + voteCount;
            return acc;
          }, {});
          
          return {
            ...p,
            results: resultsByOption
          };
        }
        return p;
      });
      
      localStorage.setItem('governanceProposals', JSON.stringify(updatedProposals));
      
      toast({
        title: "Vote cast successfully",
        description: `You voted for "${option}" with ${governanceTokens} tokens`,
      });
      
      // Notify parent component if callback provided
      if (onVote) {
        onVote(proposal.id, option);
      }
      
    } catch (error: any) {
      console.error("Error voting on proposal:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to cast vote",
        variant: "destructive"
      });
    } finally {
      setIsVoting(false);
    }
  };
  
  return (
    <Card className="overflow-hidden border-gray-800 bg-card/30">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-400" />
              {proposal.title}
            </CardTitle>
            <CardDescription className="mt-1 flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              <span>
                {format(startDate, 'MMM d, yyyy')} - {format(endDate, 'MMM d, yyyy')}
              </span>
              {isActive && (
                <Badge variant="outline" className="ml-2 bg-green-900/20 text-green-400 border-green-800">
                  {timeLeft}
                </Badge>
              )}
              {isExpired && (
                <Badge variant="outline" className="ml-2 bg-amber-900/20 text-amber-400 border-amber-800">
                  Expired
                </Badge>
              )}
              {isCompleted && !isExpired && (
                <Badge variant="outline" className="ml-2 bg-blue-900/20 text-blue-400 border-blue-800">
                  Completed
                </Badge>
              )}
              {isPending && (
                <Badge variant="outline" className="ml-2 bg-gray-900/20 text-gray-400 border-gray-800">
                  Pending
                </Badge>
              )}
            </CardDescription>
          </div>
          
          {proposal.results && Object.keys(proposal.results).length > 0 && (
            <Badge 
              variant="outline" 
              className="bg-secondary/30 border-gray-700 flex items-center gap-1"
            >
              <Users className="h-3 w-3 mr-1" />
              {Object.values(proposal.results).reduce((sum, count) => {
                // Handle the count properly
                return typeof count === 'number' ? sum + 1 : sum;
              }, 0)} Voters
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <p className="text-sm text-gray-300 mb-4">{proposal.description}</p>
        
        <div className="space-y-3">
          {proposal.options.map((option) => {
            const result = results[option];
            const isSelected = selectedOption === option;
            
            return (
              <div key={option} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center">
                    {isSelected && (
                      <CheckCircle className="h-4 w-4 text-green-400 mr-1" />
                    )}
                    {option}
                  </span>
                  {result && (
                    <span className="text-sm text-gray-400">
                      {result.percentage}% ({result.count} tokens)
                    </span>
                  )}
                </div>
                
                {result ? (
                  <Progress value={result.percentage} className="h-2" />
                ) : (
                  <Progress value={0} className="h-2" />
                )}
                
                {isActive && !userHasVoted && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="mt-1 w-full hover:bg-primary/20"
                    onClick={() => handleVote(option)}
                    disabled={isVoting || governanceTokens <= 0}
                  >
                    Vote
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
      
      <CardFooter className="pt-3 border-t border-gray-800 flex justify-between">
        <span className="text-xs text-gray-400">
          Created by @{proposal.creatorId}
        </span>
        
        {isActive && userHasVoted && (
          <Button 
            variant="outline" 
            size="sm"
            className="text-xs"
            onClick={() => setSelectedOption(null)}
          >
            <XCircle className="h-3 w-3 mr-1" />
            Change Vote
          </Button>
        )}
        
        {!isActive && !isCompleted && (
          <Badge variant="outline" className="bg-gray-800">
            Voting ended
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
}
