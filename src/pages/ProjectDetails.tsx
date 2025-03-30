
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectSponsorButton } from "@/components/project/ProjectSponsorButton";
import { useToast } from "@/hooks/use-toast";

import { 
  HiveProject,
  ImpactMetricsDisplayProps, 
  GovernanceTabProps, 
  NftRewardsTabProps,
  SmartContractDashboardProps,
  FraudDetectionPanelProps,
  DecentralizedStorageInfoProps,
  GaslessTransactionsPanelProps  
} from "@/utils/hive/types";

import { ImpactMetricsDisplay } from "@/components/dashboard/ImpactMetricsDisplay";
import { GovernanceTab } from "@/components/governance/GovernanceTab";
import { NftRewardsTab } from "@/components/nft/NftRewardsTab";
import { SmartContractDashboard } from "@/components/blockchain/SmartContractDashboard";
import { FraudDetectionPanel } from "@/components/security/FraudDetectionPanel";
import { DecentralizedStorageInfo } from "@/components/storage/DecentralizedStorageInfo";
import { GaslessTransactionsPanel } from "@/components/transactions/GaslessTransactionsPanel";
import { fetchProjectDetails, formatPostToProject } from "@/utils/hive";

function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProject() {
      if (!id) {
        setError("Project ID not found");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching project with ID:", id);
        
        // Check if the ID has author-permlink format (standard Hive format)
        if (id.includes("-")) {
          const [author, permlink] = id.split("-");
          const hiveProject = await fetchProjectDetails(author, permlink);
          
          if (hiveProject) {
            console.log("Found Hive project:", hiveProject);
            const formattedProject = formatPostToProject(hiveProject);
            setProject(formattedProject);
          } else {
            console.log("Hive project not found, checking local storage");
            // If not found on Hive, check local storage
            tryLocalStorageProject();
          }
        } else {
          console.log("ID doesn't contain author-permlink format, checking local storage");
          // Try to find in local storage by just ID
          tryLocalStorageProject();
        }
      } catch (err: any) {
        console.error("Error fetching project:", err);
        setError(err.message || "Failed to load project details");
        toast({
          title: "Error loading project",
          description: "Could not fetch project details. Please try again.",
          variant: "destructive"
        });
        
        // Even if there's an error, try local storage as fallback
        tryLocalStorageProject();
      } finally {
        setLoading(false);
      }
    }

    function tryLocalStorageProject() {
      console.log("Trying to find project in local storage");
      // Get projects from both regular projects and drafts
      const projects = JSON.parse(localStorage.getItem('projects') || '[]');
      const drafts = JSON.parse(localStorage.getItem('projectDrafts') || '[]');
      
      console.log("Local projects:", projects.length, "Drafts:", drafts.length);
      
      // Find the project with the matching ID in either array
      const foundProject = [...projects, ...drafts].find((p: any) => {
        // Try both exact match and author-permlink pattern
        const projectId = String(p.id);
        return projectId === id || 
               (id && id.includes(p.creator) && id.includes(projectId));
      });
      
      if (foundProject) {
        console.log("Found project in local storage:", foundProject);
        setProject(foundProject);
      } else {
        console.log("Project not found in local storage, creating mock");
        // Create a mock project for demonstration
        const mockProject = {
          id: id,
          title: "Demo Project: " + id,
          creator: "mockuser",
          description: "This is a demonstration project to showcase the CrowdHive platform features.",
          image: "https://placehold.co/1200x600/3a206e/e8b4b6?text=Project+Demo",
          category: "Technology",
          target: "1000 HIVE",
          raised: "650 HIVE",
          progress: 65,
          createdAt: new Date().toISOString(),
          status: 'active',
          contributors: [],
          milestones: [
            { title: "Planning Phase", completed: true },
            { title: "Development", completed: false },
            { title: "Testing", completed: false },
            { title: "Launch", completed: false }
          ]
        };
        
        setProject(mockProject);
        
        // Store for future use
        projects.push(mockProject);
        localStorage.setItem('projects', JSON.stringify(projects));
      }
    }

    fetchProject();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-muted-foreground">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <h2 className="text-lg font-bold">Error</h2>
          <p>{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-amber-500/10 text-amber-500 p-4 rounded-md">
          <h2 className="text-lg font-bold">Project Not Found</h2>
          <p>The requested project could not be found.</p>
          <button 
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-8 min-h-screen">
      {/* Project Header */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3">
          <img 
            src={project.image} 
            alt={project.title} 
            className="rounded-lg w-full object-cover aspect-video" 
          />
        </div>
        <div className="lg:w-1/3 space-y-4">
          <h1 className="text-3xl font-bold">{project.title}</h1>
          <p className="text-muted-foreground">By @{project.creator}</p>
          
          <div className="bg-secondary/20 rounded-md p-4">
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Raised</span>
              <span className="font-bold">{project.raised}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Target</span>
              <span>{project.target}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
              <div 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2.5 rounded-full" 
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{project.progress}% funded</span>
              <span className="text-muted-foreground">{project.contributors?.length || 0} contributors</span>
            </div>
          </div>
          
          <ProjectSponsorButton 
            projectId={project.id} 
            projectTitle={project.title} 
            projectAuthor={project.creator} 
          />
        </div>
      </div>
      
      {/* Project Description */}
      <div className="prose prose-invert prose-sm sm:prose-base max-w-none">
        <h2>About this project</h2>
        <div className="whitespace-pre-wrap">{project.description}</div>
      </div>
      
      {/* Tabs for additional sections */}
      <Tabs defaultValue="metrics" className="mt-8">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="metrics">Impact Metrics</TabsTrigger>
          <TabsTrigger value="governance">Governance</TabsTrigger>
          <TabsTrigger value="rewards">NFT Rewards</TabsTrigger>
          <TabsTrigger value="advanced">Tech Features</TabsTrigger>
        </TabsList>
        
        <TabsContent value="metrics">
          <ImpactMetricsDisplay projectId={project?.id || ''} />
        </TabsContent>
        
        <TabsContent value="governance">
          <GovernanceTab projectId={project?.id || ''} />
        </TabsContent>
        
        <TabsContent value="rewards">
          <NftRewardsTab projectId={project?.id || ''} />
        </TabsContent>
        
        <TabsContent value="advanced">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SmartContractDashboard projectId={project?.id || ''} />
            <FraudDetectionPanel projectId={project?.id || ''} />
            <DecentralizedStorageInfo projectId={project?.id || ''} />
            <GaslessTransactionsPanel projectId={project?.id || ''} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ProjectDetails;
