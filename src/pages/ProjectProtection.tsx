
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SmartContractDashboard } from "@/components/blockchain/SmartContractDashboard";
import { FraudDetectionPanel } from "@/components/security/FraudDetectionPanel";
import { DecentralizedStorageInfo } from "@/components/storage/DecentralizedStorageInfo";
import { GaslessTransactionsPanel } from "@/components/transactions/GaslessTransactionsPanel";
import { ImpactMetricsDashboard } from "@/components/dashboard/ImpactMetricsDashboard";

export default function ProjectProtection() {
  // Set page title on mount
  useEffect(() => {
    document.title = "Project Protection & Security | CrowdHive";
  }, []);

  // Use a mock project ID for demonstration purposes
  const mockProjectId = "demo-project-123";

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold gradient-text">Project Protection & Transparency</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Multi-layer security and transparency features to protect creators and backers
          </p>
        </div>
        
        <Tabs defaultValue="impact" className="space-y-8">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
            <TabsTrigger value="impact">Impact Metrics</TabsTrigger>
            <TabsTrigger value="contracts">Smart Contracts</TabsTrigger>
            <TabsTrigger value="fraud">Fraud Detection</TabsTrigger>
            <TabsTrigger value="storage">Decentralized Storage</TabsTrigger>
            <TabsTrigger value="gasless">Gasless Transactions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="impact" className="space-y-6">
            <ImpactMetricsDashboard />
          </TabsContent>
          
          <TabsContent value="contracts" className="space-y-6">
            <SmartContractDashboard projectId={mockProjectId} />
          </TabsContent>
          
          <TabsContent value="fraud" className="space-y-6">
            <FraudDetectionPanel projectId={mockProjectId} />
          </TabsContent>
          
          <TabsContent value="storage" className="space-y-6">
            <DecentralizedStorageInfo projectId={mockProjectId} />
          </TabsContent>
          
          <TabsContent value="gasless" className="space-y-6">
            <GaslessTransactionsPanel projectId={mockProjectId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
