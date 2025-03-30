
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Check, Info } from "lucide-react";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

export const ImpactMetricsDashboard = () => {
  const [activeTab, setActiveTab] = useState("funds");
  
  // Mock data for fund allocation
  const fundAllocationData = [
    { name: 'Development', value: 40 },
    { name: 'Marketing', value: 20 },
    { name: 'Operations', value: 25 },
    { name: 'Community', value: 15 }
  ];
  
  // Mock data for milestones
  const milestoneData = [
    { name: 'Planning Phase', complete: true, percentage: 100 },
    { name: 'Alpha Development', complete: true, percentage: 100 },
    { name: 'Beta Release', complete: true, percentage: 100 },
    { name: 'User Testing', complete: true, percentage: 80 },
    { name: 'Final Launch', complete: false, percentage: 30 }
  ];
  
  // Mock data for impact metrics
  const impactMetricsData = [
    { name: 'Jan', users: 400, communities: 240 },
    { name: 'Feb', users: 300, communities: 139 },
    { name: 'Mar', users: 200, communities: 980 },
    { name: 'Apr', users: 278, communities: 390 },
    { name: 'May', users: 189, communities: 480 },
    { name: 'Jun', users: 239, communities: 380 }
  ];
  
  // Mock verification report data
  const verificationReports = [
    { id: 1, title: "Q1 Financial Report", date: "Apr 1, 2025", verified: true, link: "#" },
    { id: 2, title: "Development Milestone 1", date: "Feb 15, 2025", verified: true, link: "#" },
    { id: 3, title: "Community Impact Assessment", date: "Mar 10, 2025", verified: true, link: "#" },
    { id: 4, title: "Q2 Financial Report", date: "Jul 1, 2025", verified: false, link: "#" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold gradient-text">Impact & Transparency</h2>
          <p className="text-muted-foreground">Track project impact and fund allocation</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-800">
            <Check className="h-3 w-3 mr-1" />
            Verified
          </Badge>
          <Badge variant="outline" className="bg-blue-900/20 text-blue-400 border-blue-800">
            On-Chain Data
          </Badge>
        </div>
      </div>
      
      <Tabs defaultValue="funds" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="funds">Fund Allocation</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="impact">Impact Metrics</TabsTrigger>
          <TabsTrigger value="reports">Verification</TabsTrigger>
        </TabsList>
        
        <TabsContent value="funds" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fund Allocation</CardTitle>
              <CardDescription>
                Breakdown of how project funds are being utilized
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={fundAllocationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {fundAllocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Total Funds Raised:</span>
                  <span className="font-semibold">15,000 HIVE</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Funds Utilized:</span>
                  <span className="font-semibold">8,250 HIVE (55%)</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Funds Remaining:</span>
                  <span className="font-semibold">6,750 HIVE (45%)</span>
                </div>
                <Progress value={55} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="milestones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Milestones</CardTitle>
              <CardDescription>
                Track the project's progress through key milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {milestoneData.map((milestone, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${milestone.complete ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <span className="font-medium">{milestone.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {milestone.percentage}% Complete
                      </span>
                    </div>
                    <Progress value={milestone.percentage} className="h-2" />
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-4 bg-primary/10 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center">
                  <Info className="w-4 h-4 mr-2" />
                  Smart Contract Validation
                </h4>
                <p className="text-sm text-muted-foreground">
                  All milestones are validated and recorded on-chain through smart contracts.
                  Funds are released automatically when milestones are verified by community validators.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="impact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Impact Metrics</CardTitle>
              <CardDescription>
                Measuring the real-world impact of this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={impactMetricsData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="users" name="Active Users" fill="#8884d8" />
                    <Bar dataKey="communities" name="Communities Impacted" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <h4 className="text-sm font-semibold mb-1">Total Users</h4>
                  <p className="text-xl font-bold">1,606</p>
                  <span className="text-xs text-green-400">↑ 12% from last month</span>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg">
                  <h4 className="text-sm font-semibold mb-1">Communities Impacted</h4>
                  <p className="text-xl font-bold">2,609</p>
                  <span className="text-xs text-green-400">↑ 8% from last month</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Verification Reports</CardTitle>
              <CardDescription>
                Third-party verification of project claims and financial reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {verificationReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-3 border border-gray-800 rounded-lg">
                    <div>
                      <h4 className="font-medium">{report.title}</h4>
                      <p className="text-xs text-muted-foreground">Published: {report.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {report.verified ? (
                        <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-800">
                          <Check className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-900/20 text-amber-400 border-amber-800">
                          Pending
                        </Badge>
                      )}
                      <a 
                        href={report.link} 
                        className="text-sm text-purple-400 hover:text-purple-300 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                <h4 className="font-semibold mb-2">IPFS Storage</h4>
                <p className="text-sm text-muted-foreground">
                  All verification reports are permanently stored on IPFS for transparency and immutability.
                  <br />
                  IPFS Root CID: <span className="font-mono text-xs">QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
