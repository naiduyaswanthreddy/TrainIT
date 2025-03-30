
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, AlertTriangle, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { FraudDetectionPanelProps } from "@/utils/hive/types";

interface RiskFactor {
  name: string;
  level: "low" | "medium" | "high";
  description: string;
}

export const FraudDetectionPanel = ({ projectId }: FraudDetectionPanelProps) => {
  console.log(`Loading fraud detection panel for project: ${projectId}`);
  
  // This would typically come from an API that analyzes the project's data
  const trustScore = 86;
  const riskFactors: RiskFactor[] = [
    {
      name: "Creator Verification",
      level: "low",
      description: "Creator has verified identity and reputation"
    },
    {
      name: "Project Milestones",
      level: "low",
      description: "Clear milestones with achievable timelines"
    },
    {
      name: "Financial Transparency",
      level: "medium",
      description: "Some budget details could be more specific"
    }
  ];
  
  const getBadgeColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-900/20 text-green-500 border-green-700/30";
      case "medium":
        return "bg-amber-900/20 text-amber-500 border-amber-700/30";
      case "high":
        return "bg-red-900/20 text-red-500 border-red-700/30";
      default:
        return "";
    }
  };
  
  const getIcon = (level: string) => {
    switch (level) {
      case "low":
        return <ShieldCheck className="h-3 w-3" />;
      case "medium":
        return <AlertTriangle className="h-3 w-3" />;
      case "high":
        return <AlertCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold gradient-text">Fraud Prevention & Risk Analysis</h2>
        <p className="text-muted-foreground">AI-powered detection and analysis to ensure project legitimacy</p>
      </div>
      
      <Card className="glass-card border-white/10">
        <CardHeader className="pb-2">
          <CardTitle>Project Trust Score</CardTitle>
          <CardDescription>Overall assessment of project credibility</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-end mb-2">
            <span className="text-3xl font-bold">{trustScore}/100</span>
            <Badge variant="outline" className="bg-green-900/20 text-green-500 border-green-700/30">
              Low Risk
            </Badge>
          </div>
          <Progress value={trustScore} className="h-2" />
          
          <div className="mt-6 space-y-2">
            <h4 className="text-sm font-medium mb-3">Risk Factors</h4>
            
            {riskFactors.map((factor, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-primary/5 rounded-md border border-white/5">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getBadgeColor(factor.level)}>
                    {getIcon(factor.level)}
                    <span className="ml-1 capitalize">{factor.level}</span>
                  </Badge>
                  <span className="font-medium">{factor.name}</span>
                </div>
                <span className="text-xs text-muted-foreground max-w-[50%] text-right">
                  {factor.description}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-6 bg-primary/5 p-4 rounded-md border border-white/5">
            <h4 className="text-sm font-medium mb-2">How We Determine Risk</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Identity verification through decentralized ID attestations</li>
              <li>• Machine learning analysis of project description and goals</li>
              <li>• Verification of creator reputation across platforms</li>
              <li>• Analysis of project mockups, demos, and progress reports</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
