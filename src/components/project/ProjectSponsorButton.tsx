
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  DollarSign, 
  AlertCircle, 
  Rocket, 
  CheckCircle, 
  Loader2 
} from "lucide-react";
import { getConnectedUsername, isKeychainInstalled } from "@/utils/hive/auth";
import { sendHiveTokens } from "@/utils/hive/transactions";
import { blockchainProviders } from "@/utils/blockchain";

interface ProjectSponsorButtonProps {
  projectId: string;
  projectTitle: string;
  projectAuthor: string;
}

export function ProjectSponsorButton({ projectId, projectTitle, projectAuthor }: ProjectSponsorButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [amount, setAmount] = useState("10");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [blockchain, setBlockchain] = useState(() => {
    return localStorage.getItem('connectedBlockchain') || "hive";
  });
  const { toast } = useToast();
  
  const username = getConnectedUsername();
  
  const handleOpenDialog = () => {
    if (!username) {
      toast({
        title: "Authentication Required",
        description: "Please connect your wallet to sponsor a project",
        variant: "destructive",
      });
      return;
    }
    
    setIsDialogOpen(true);
  };
  
  const handleSponsorProject = async () => {
    if (!username) {
      toast({
        title: "Authentication Error",
        description: "Please connect your wallet to sponsor a project",
        variant: "destructive"
      });
      return;
    }
    
    // For Hive blockchain, check if keychain is installed
    if (blockchain === "hive" && !isKeychainInstalled()) {
      toast({
        title: "Hive Keychain Required",
        description: "Please install the Hive Keychain browser extension to sponsor projects with Hive",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const memo = `Sponsoring project "${projectTitle}" on CrowdHive`;
      
      // If using Hive blockchain
      if (blockchain === "hive") {
        const result = await sendHiveTokens(
          username,
          projectAuthor,
          amount,
          memo
        );
        
        if (result.success) {
          showSuccessMessage();
        } else {
          throw new Error(result.message);
        }
      } 
      // For other blockchains (mock functionality)
      else {
        // Simulate a successful transaction for other blockchains
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Add to local storage for demonstration
        try {
          const transactions = JSON.parse(localStorage.getItem('mockTransactions') || '[]');
          transactions.push({
            from: username,
            to: projectAuthor,
            amount: amount,
            blockchain: blockchain,
            currency: getBlockchainCurrency(blockchain),
            timestamp: new Date().toISOString(),
            projectId: projectId,
            memo: memo
          });
          localStorage.setItem('mockTransactions', JSON.stringify(transactions));
        } catch (err) {
          console.error("Error storing mock transaction:", err);
        }
        
        showSuccessMessage();
      }
    } catch (error: any) {
      console.error("Error sponsoring project:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to process sponsorship. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getBlockchainCurrency = (blockchain: string): string => {
    switch (blockchain.toLowerCase()) {
      case "ethereum": 
        return "ETH";
      case "solana": 
        return "SOL";
      case "polygon": 
        return "MATIC";
      case "near": 
        return "NEAR";
      case "hive":
      default: 
        return "HIVE";
    }
  };
  
  const showSuccessMessage = () => {
    setIsSuccess(true);
    toast({
      title: "Sponsorship successful!",
      description: `You have successfully sponsored ${projectTitle} with ${amount} ${getBlockchainCurrency(blockchain)}`,
    });
    
    // Reset form after a delay
    setTimeout(() => {
      setIsSuccess(false);
      setIsDialogOpen(false);
      setAmount("10");
    }, 3000);
  };
  
  return (
    <>
      <Button 
        onClick={handleOpenDialog}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        size="lg"
      >
        <DollarSign className="mr-2 h-5 w-5" />
        Sponsor Project
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] glass-card border-white/10">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-primary" />
              Sponsor this Project
            </DialogTitle>
            <DialogDescription>
              Support this project by sending funds directly to the creator.
            </DialogDescription>
          </DialogHeader>
          
          {isSuccess ? (
            <div className="py-6 flex flex-col items-center justify-center text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mb-2" />
              <h3 className="text-xl font-semibold">Sponsorship Successful!</h3>
              <p className="text-gray-400 mt-2">
                Thank you for supporting this project with {amount} {getBlockchainCurrency(blockchain)}!
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="blockchain">Blockchain</Label>
                  <Select 
                    value={blockchain} 
                    onValueChange={setBlockchain}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select blockchain" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(blockchainProviders).map(([key, provider]) => (
                        <SelectItem key={key} value={key} disabled={!provider.enabled}>
                          <div className="flex items-center">
                            <img
                              src={provider.icon}
                              alt={provider.name}
                              className="w-4 h-4 mr-2"
                            />
                            {provider.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="amount">Sponsorship Amount</Label>
                  <div className="relative">
                    <Input
                      id="amount"
                      type="number"
                      min="1"
                      step="0.1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-16"
                      disabled={isSubmitting}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none text-gray-400 border-r border-gray-700">
                      {getBlockchainCurrency(blockchain)}
                    </div>
                  </div>
                </div>
                
                <div className="bg-secondary/20 p-3 rounded-md border border-secondary/30">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                    <p className="text-xs text-gray-300">
                      This will send {amount} {getBlockchainCurrency(blockchain)} directly to the project creator's wallet using the {blockchainProviders[blockchain]?.name || blockchain} blockchain.
                    </p>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSponsorProject}
                  disabled={isSubmitting || !amount || parseFloat(amount) <= 0}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing
                    </>
                  ) : (
                    <>
                      <Rocket className="mr-2 h-4 w-4" />
                      Sponsor Now
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
