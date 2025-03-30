
import { useState, useEffect } from "react";
import { ProposalCard } from "./ProposalCard";
import { CreateProposalForm } from "./CreateProposalForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Award, PlusCircle, Loader2 } from "lucide-react";
import { GovernanceProposal } from "@/utils/hive/types";
import { useToast } from "@/hooks/use-toast";
import { getConnectedUsername } from "@/utils/hive/auth";
import { 
  fetchGovernanceProposals, 
  getUserGovernanceTokens,
  getUserVotes
} from "@/utils/hive/governance";
import { userOwnsProject } from "@/utils/hive/auth";

interface GovernanceTabProps {
  projectId: string;
}

export function GovernanceTab({ projectId }: GovernanceTabProps) {
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");
  const [proposals, setProposals] = useState<GovernanceProposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [userVotes, setUserVotes] = useState<Record<string, string>>({});
  const [governanceTokens, setGovernanceTokens] = useState(0);
  const { toast } = useToast();
  const username = getConnectedUsername();
  const canCreateProposal = userOwnsProject(projectId, username);
  
  useEffect(() => {
    const loadProposals = () => {
      setIsLoading(true);
      
      try {
        // Fetch all proposals for this project
        const allProposals = fetchGovernanceProposals(projectId);
        
        // Get user's existing votes
        if (username) {
          const votes = getUserVotes(username);
          setUserVotes(votes);
          
          // Get user's governance tokens
          const tokens = getUserGovernanceTokens(projectId, username);
          setGovernanceTokens(tokens);
        }
        
        // Sort proposals by start date
        allProposals.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        
        setProposals(allProposals);
      } catch (error) {
        console.error("Error loading governance proposals:", error);
        toast({
          title: "Error",
          description: "Failed to load governance proposals",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProposals();
  }, [projectId, username, toast]);
  
  const handleVote = async (proposalId: string, option: string) => {
    if (!username) {
      toast({
        title: "Authentication Required",
        description: "Please connect your wallet to vote on proposals",
        variant: "destructive",
      });
      return;
    }
    
    if (governanceTokens <= 0) {
      toast({
        title: "Insufficient Tokens",
        description: "You need governance tokens to vote on this proposal",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Update local state optimistically
      setUserVotes(prev => ({ ...prev, [proposalId]: option }));
      
      // In a production app, this would trigger an on-chain transaction
      // For now, we're just updating local state
      
      toast({
        title: "Vote Cast",
        description: `You voted for "${option}" with ${governanceTokens} tokens`,
      });
      
      // Refresh proposals to get updated results
      const allProposals = fetchGovernanceProposals(projectId);
      allProposals.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
      setProposals(allProposals);
      
    } catch (error) {
      console.error("Error casting vote:", error);
      toast({
        title: "Error",
        description: "Failed to cast vote",
        variant: "destructive",
      });
      
      // Revert the optimistic update
      setUserVotes(prev => {
        const newVotes = { ...prev };
        delete newVotes[proposalId];
        return newVotes;
      });
    }
  };
  
  const handleProposalCreated = (proposalId: string) => {
    // Refresh proposals
    const allProposals = fetchGovernanceProposals(projectId);
    allProposals.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    setProposals(allProposals);
    
    toast({
      title: "Proposal Created",
      description: "Your governance proposal has been created successfully",
    });
  };
  
  const activeProposals = proposals.filter(p => 
    p.status === 'active' && new Date(p.endDate) > new Date()
  );
  
  const completedProposals = proposals.filter(p => 
    p.status === 'completed' || new Date(p.endDate) <= new Date()
  );
  
  return (
    <div className="mt-4 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-purple-400" />
          <h3 className="text-xl font-semibold">Project Governance</h3>
        </div>
        
        {canCreateProposal && (
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Proposal
          </Button>
        )}
      </div>
      
      {username && governanceTokens > 0 && (
        <div className="bg-purple-900/20 border border-purple-900/40 rounded-lg p-4 text-sm">
          <p className="flex items-center text-purple-300">
            <Award className="h-4 w-4 mr-2 text-purple-400" />
            You have <span className="font-bold mx-1">{governanceTokens} governance tokens</span> for this project.
          </p>
        </div>
      )}
      
      <Tabs defaultValue="active" value={activeTab} onValueChange={(v) => setActiveTab(v as "active" | "completed")}>
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active Proposals</TabsTrigger>
          <TabsTrigger value="completed">Completed Proposals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : activeProposals.length > 0 ? (
            <>
              {activeProposals.map(proposal => (
                <ProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  userVotes={userVotes}
                  governanceTokens={governanceTokens}
                  onVote={handleVote}
                />
              ))}
            </>
          ) : (
            <div className="text-center py-12 glass-card rounded-xl">
              <Award className="h-12 w-12 mx-auto text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Active Proposals</h3>
              <p className="text-gray-400 mb-4">
                There are no active governance proposals for this project at the moment.
              </p>
              {canCreateProposal && (
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Proposal
                </Button>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : completedProposals.length > 0 ? (
            <>
              {completedProposals.map(proposal => (
                <ProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  userVotes={userVotes}
                  governanceTokens={governanceTokens}
                  onVote={handleVote}
                />
              ))}
            </>
          ) : (
            <div className="text-center py-12 glass-card rounded-xl">
              <Award className="h-12 w-12 mx-auto text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold">No Completed Proposals</h3>
              <p className="text-gray-400">
                There are no completed governance proposals for this project yet.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <CreateProposalForm
        projectId={projectId}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onProposalCreated={handleProposalCreated}
      />
    </div>
  );
}
