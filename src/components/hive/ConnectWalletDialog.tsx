
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Info } from "lucide-react";
import { blockchainProviders, getEnabledBlockchains } from "@/utils/blockchain";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ConnectWalletDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  username: string;
  onUsernameChange: (username: string) => void;
  selectedBlockchain?: string;
  onBlockchainChange?: (blockchain: string) => void;
  onConnect: () => void;
  isLoading: boolean;
}

export function ConnectWalletDialog({
  isOpen,
  onOpenChange,
  username,
  onUsernameChange,
  selectedBlockchain = "hive",
  onBlockchainChange,
  onConnect,
  isLoading
}: ConnectWalletDialogProps) {
  const enabledBlockchains = getEnabledBlockchains();
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] glass-card border-white/10">
        <DialogHeader>
          <DialogTitle className="gradient-text">Connect Wallet</DialogTitle>
          <DialogDescription className="text-gray-400">
            Connect your blockchain wallet to interact with projects.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="blockchain" className="flex items-center gap-2">
              Select Blockchain
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={14} className="text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[200px] text-xs">
                      For testing, you can use any blockchain with the username "mockuser"
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Select 
              defaultValue={selectedBlockchain} 
              onValueChange={onBlockchainChange}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select blockchain" />
              </SelectTrigger>
              <SelectContent>
                {enabledBlockchains.map((blockchain) => (
                  <SelectItem key={blockchain.name.toLowerCase()} value={blockchain.name.toLowerCase()}>
                    <div className="flex items-center">
                      <img
                        src={blockchain.icon}
                        alt={blockchain.name}
                        className="w-4 h-4 mr-2"
                      />
                      {blockchain.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-xs text-muted-foreground mt-1">
              {selectedBlockchain === "hive" 
                ? "Requires Hive Keychain browser extension" 
                : `Connect to ${blockchainProviders[selectedBlockchain]?.name || "blockchain"}`}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder={`Enter your ${blockchainProviders[selectedBlockchain]?.name || "blockchain"} username`}
              value={username}
              onChange={(e) => onUsernameChange(e.target.value)}
              disabled={isLoading}
              className="bg-gray-800"
            />
            <div className="text-xs text-muted-foreground font-bold bg-gray-800/50 p-2 rounded border border-gray-700">
              For testing: Use "mockuser" with any blockchain
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={onConnect} 
            disabled={isLoading || !username.trim()}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
