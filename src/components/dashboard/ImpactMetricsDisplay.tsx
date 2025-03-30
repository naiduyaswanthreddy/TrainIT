
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Shield, Eye, DollarSign, Clock, Users } from "lucide-react";

interface ImpactMetricsDisplayProps {
  projectId: string;
}

export function ImpactMetricsDisplay({ projectId }: ImpactMetricsDisplayProps) {
  // This would normally fetch data from the blockchain
  // For now, we'll use mock data
  const mockData = {
    totalFunding: "1,250 HIVE",
    totalContributors: 48,
    avgContribution: "26 HIVE",
    projectViews: 1257,
    transparencyScore: 85,
    milestones: [
      { name: "Project Planning", complete: true, funds: "250 HIVE" },
      { name: "Development Phase 1", complete: true, funds: "500 HIVE" },
      { name: "Development Phase 2", complete: false, funds: "250 HIVE" },
      { name: "Testing & Launch", complete: false, funds: "250 HIVE" }
    ],
    fundingOverTime: [
      { day: "Day 1", amount: 100 },
      { day: "Day 2", amount: 220 },
      { day: "Day 3", amount: 380 },
      { day: "Day 4", amount: 420 },
      { day: "Day 5", amount: 550 },
      { day: "Day 6", amount: 780 },
      { day: "Day 7", amount: 1250 }
    ],
    contributorsByDay: [
      { day: "Day 1", contributors: 5 },
      { day: "Day 2", contributors: 8 },
      { day: "Day 3", contributors: 12 },
      { day: "Day 4", contributors: 9 },
      { day: "Day 5", contributors: 6 },
      { day: "Day 6", contributors: 4 },
      { day: "Day 7", contributors: 4 }
    ],
    fundUsage: [
      { category: "Development", percentage: 60 },
      { category: "Marketing", percentage: 20 },
      { category: "Operations", percentage: 15 },
      { category: "Legal", percentage: 5 }
    ]
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Impact & Transparency</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Funding</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.totalFunding}</div>
            <p className="text-xs text-muted-foreground">
              From {mockData.totalContributors} contributors
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Transparency Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.transparencyScore}%</div>
            <Progress value={mockData.transparencyScore} className="h-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Project Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.projectViews}</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Contribution</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.avgContribution}</div>
            <p className="text-xs text-muted-foreground">
              Per contributor
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="funding">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="funding">Funding Analytics</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="usage">Fund Usage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="funding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Funding Over Time</CardTitle>
              <CardDescription>
                Cumulative funding received during the campaign
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={mockData.fundingOverTime}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Contributors Per Day</CardTitle>
              <CardDescription>
                Number of new contributors each day
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={mockData.contributorsByDay}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="contributors" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="milestones">
          <Card>
            <CardHeader>
              <CardTitle>Project Milestones</CardTitle>
              <CardDescription>
                Tracked on-chain for maximum transparency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockData.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                      milestone.complete ? 'bg-green-500' : 'bg-gray-500'
                    }`}>
                      {milestone.complete ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <Clock className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="text-sm font-medium">{milestone.name}</div>
                      <div className="text-xs text-muted-foreground">{milestone.funds} allocated</div>
                    </div>
                    <div className={`text-xs font-medium ${
                      milestone.complete ? 'text-green-500' : 'text-gray-400'
                    }`}>
                      {milestone.complete ? 'Completed' : 'Pending'}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle>Fund Allocation</CardTitle>
              <CardDescription>
                How project funds are being used
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-4">
                {mockData.fundUsage.map((category, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">{category.category}</div>
                      <div className="text-sm font-medium">{category.percentage}%</div>
                    </div>
                    <Progress value={category.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Blockchain Verification</CardTitle>
          <CardDescription>
            All transactions and milestones are recorded on the blockchain for full transparency
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <Button variant="outline" className="flex gap-2">
              <Shield className="h-4 w-4" />
              Verify Project On-Chain
            </Button>
            <Button variant="outline" className="flex gap-2">
              <Eye className="h-4 w-4" />
              View Transaction History
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Add missing Button component (used in the component)
const Button = ({ children, variant = "default", className = "" }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "outline":
        return "border border-gray-700 hover:bg-gray-800";
      default:
        return "bg-primary text-primary-foreground hover:bg-primary/90";
    }
  };
  
  return (
    <button className={`inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${getVariantClasses()} ${className}`}>
      {children}
    </button>
  );
};
