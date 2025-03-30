
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileCode, CheckCircle, AlertTriangle, ExternalLink } from "lucide-react";
import { SmartContractDashboardProps } from "@/utils/hive/types";

export const SmartContractDashboard = ({ projectId }: SmartContractDashboardProps) => {
  console.log(`Loading smart contract dashboard for project: ${projectId}`);
  
  const contracts = [
    {
      name: "Funding Contract",
      address: "0x8a9424745056Eb399FD19830231d0b92146a382C",
      verified: true,
      blockchain: "Ethereum",
      status: "Active"
    },
    {
      name: "Milestone Escrow",
      address: "0x7Da7F4b731DBcD7FE22fB8d4f77B1219920a2A63",
      verified: true,
      blockchain: "Ethereum",
      status: "Active"
    },
    {
      name: "NFT Distribution",
      address: "0x2C3cB3aAe1e42d90209a3ef7F099Cd4C9415DB20",
      verified: false,
      blockchain: "Solana",
      status: "Pending"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold gradient-text">Smart Contract Dashboard</h2>
        <p className="text-muted-foreground">Transparent and trustless contract management for your project</p>
      </div>
      
      <div className="space-y-4">
        {contracts.map((contract, index) => (
          <Card key={index} className="glass-card border-white/10">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCode className="h-5 w-5 text-primary" />
                  <CardTitle>{contract.name}</CardTitle>
                </div>
                <Badge variant={contract.status === "Active" ? "default" : "outline"}>
                  {contract.status}
                </Badge>
              </div>
              <CardDescription>
                {contract.blockchain} • {contract.address.substring(0, 6)}...{contract.address.substring(contract.address.length - 4)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {contract.verified ? (
                    <Badge variant="outline" className="bg-green-900/20 text-green-500 border-green-700/30 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-amber-900/20 text-amber-500 border-amber-700/30 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Pending Verification
                    </Badge>
                  )}
                </div>
                <div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">View on Explorer</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="bg-primary/5 rounded-md p-4 border border-white/5">
        <h3 className="text-sm font-medium mb-2">Smart Contract Security</h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• All contracts are open source and verified on respective block explorers</li>
          <li>• Funds are released based on milestone completion and community validation</li>
          <li>• Multi-signature requirements for administrative functions</li>
          <li>• Time-locked operations for potentially risky actions</li>
        </ul>
      </div>
    </div>
  );
};
