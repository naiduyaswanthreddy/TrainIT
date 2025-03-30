
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Zap, RefreshCw, ArrowLeftRight, FileCheck } from "lucide-react";
import { GaslessTransactionsPanelProps } from "@/utils/hive/types";

export const GaslessTransactionsPanel = ({ projectId }: GaslessTransactionsPanelProps) => {
  console.log(`Loading gasless transactions panel for project: ${projectId}`);
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold gradient-text">Gasless Transactions</h2>
        <p className="text-muted-foreground">Support the project without paying blockchain gas fees</p>
      </div>

      <Card className="glass-card border-white/10">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Transaction Relayer Status</CardTitle>
            <Badge variant="default" className="bg-green-700">Active</Badge>
          </div>
          <CardDescription>Meta-transaction relayer service for gas-free project funding</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium">Meta Transactions</p>
                  <p className="text-xs text-muted-foreground">Pay gas fees in the background</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Auto Gas Optimization</p>
                  <p className="text-xs text-muted-foreground">Wait for lower gas prices</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Cross-Chain Forwarding</p>
                  <p className="text-xs text-muted-foreground">Automatic routing to cheapest chain</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="font-medium">Transaction Bundling</p>
                  <p className="text-xs text-muted-foreground">Group multiple actions in one transaction</p>
                </div>
              </div>
              <Switch />
            </div>
          </div>
          
          <Tabs defaultValue="stats" className="mt-6">
            <TabsList className="w-full">
              <TabsTrigger value="stats" className="flex-1">Transaction Stats</TabsTrigger>
              <TabsTrigger value="chains" className="flex-1">Supported Chains</TabsTrigger>
            </TabsList>
            <TabsContent value="stats" className="pt-4">
              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-muted-foreground">Total Relayed Transactions</span>
                  <span className="font-medium">157</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-muted-foreground">Gas Fees Saved for Users</span>
                  <span className="font-medium">$423.45</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-muted-foreground">Average Transaction Time</span>
                  <span className="font-medium">32 seconds</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Failed Transactions</span>
                  <span className="font-medium">2 (1.3%)</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="chains" className="pt-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-2 bg-primary/5 rounded-md border border-white/5">
                  <Badge>Ethereum</Badge>
                  <span className="text-xs text-green-500">Active</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-primary/5 rounded-md border border-white/5">
                  <Badge>Polygon</Badge>
                  <span className="text-xs text-green-500">Active</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-primary/5 rounded-md border border-white/5">
                  <Badge>Solana</Badge>
                  <span className="text-xs text-green-500">Active</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-primary/5 rounded-md border border-white/5">
                  <Badge>Avalanche</Badge>
                  <span className="text-xs text-amber-500">Beta</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
