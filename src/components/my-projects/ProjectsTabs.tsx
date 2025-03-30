
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LoadingState } from "./LoadingState";
import { NotConnectedState } from "./EmptyStates";
import { EmptyProjectsState } from "./EmptyStates";
import { ProjectsGrid } from "./ProjectsGrid";
import { useHiveWallet } from "@/hooks/use-hive-wallet";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useMemo, useCallback, memo } from "react";

interface ProjectsTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  isLoading: boolean;
  projects: any[];
  drafts: any[];
  contributions: any[];
  onProjectClick: (project: any) => void;
  onCreateProject: () => void;
  onDeleteDraft: (draftId: string) => void;
  onNavigateHome: () => void;
  onSaveProject: (() => void) | null;
}

// Use memo to prevent unnecessary re-renders
export const ProjectsTabs = memo(({
  activeTab,
  setActiveTab,
  isLoading,
  projects,
  drafts,
  contributions,
  onProjectClick,
  onCreateProject,
  onDeleteDraft,
  onNavigateHome,
  onSaveProject
}: ProjectsTabsProps) => {
  const { connectedUser } = useHiveWallet();
  const connected = !!connectedUser;

  // Memoize the tab content to prevent unnecessary recalculations
  const createdTabContent = useMemo(() => {
    if (!connected) {
      return <NotConnectedState onNavigateHome={onNavigateHome} />;
    }
    
    if (isLoading) {
      return <LoadingState />;
    }
    
    if (!projects || projects.length === 0) {
      return <EmptyProjectsState onCreateProject={onCreateProject} type="created" />;
    }
    
    return (
      <ProjectsGrid
        activeTab="created"
        projects={projects}
        drafts={[]}
        contributions={[]}
        onProjectClick={onProjectClick}
        onCreateProject={onCreateProject}
        onDeleteDraft={onDeleteDraft}
      />
    );
  }, [connected, isLoading, projects, onProjectClick, onCreateProject, onDeleteDraft, onNavigateHome]);

  const draftsTabContent = useMemo(() => {
    if (isLoading) {
      return <LoadingState />;
    }
    
    if (!drafts || drafts.length === 0) {
      return <EmptyProjectsState onCreateProject={onCreateProject} type="drafts" />;
    }
    
    return (
      <ProjectsGrid
        activeTab="drafts"
        projects={[]}
        drafts={drafts}
        contributions={[]}
        onProjectClick={onProjectClick}
        onCreateProject={onCreateProject}
        onDeleteDraft={onDeleteDraft}
      />
    );
  }, [isLoading, drafts, onProjectClick, onCreateProject, onDeleteDraft]);

  const contributedTabContent = useMemo(() => {
    if (!connected) {
      return <NotConnectedState onNavigateHome={onNavigateHome} />;
    }
    
    if (isLoading) {
      return <LoadingState />;
    }
    
    if (!contributions || contributions.length === 0) {
      return <EmptyProjectsState onCreateProject={onCreateProject} type="contributed" />;
    }
    
    return (
      <ProjectsGrid
        activeTab="contributed"
        projects={[]}
        drafts={[]}
        contributions={contributions}
        onProjectClick={onProjectClick}
        onCreateProject={onCreateProject}
        onDeleteDraft={onDeleteDraft}
      />
    );
  }, [connected, isLoading, contributions, onProjectClick, onCreateProject, onDeleteDraft, onNavigateHome]);

  // Memoize the save button to prevent unnecessary renders
  const saveButton = useMemo(() => {
    if (!onSaveProject) return null;
    
    return (
      <Button 
        onClick={onSaveProject}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Save className="h-4 w-4" />
        Save Project
      </Button>
    );
  }, [onSaveProject]);

  // Handle tab change without causing re-renders
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, [setActiveTab]);

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-10">
      <div className="flex justify-between items-center mb-4">
        <TabsList className="mb-4">
          <TabsTrigger value="created">Created Projects</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="contributed">Contributions</TabsTrigger>
        </TabsList>
        
        {saveButton}
      </div>
      
      <TabsContent value="created" className="mt-2">
        {createdTabContent}
      </TabsContent>
      
      <TabsContent value="drafts" className="mt-2">
        {draftsTabContent}
      </TabsContent>
      
      <TabsContent value="contributed" className="mt-2">
        {contributedTabContent}
      </TabsContent>
    </Tabs>
  );
});

ProjectsTabs.displayName = "ProjectsTabs";
