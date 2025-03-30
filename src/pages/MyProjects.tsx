
import { useState, useCallback, useMemo } from "react";
import { FooterSection } from "@/components/landing/FooterSection";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ProjectModal } from "@/components/project/ProjectModal";
import { DemoProjectModal } from "@/components/project/DemoProjectModal";
import { PlusCircle, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProjectsTabs } from "@/components/my-projects/ProjectsTabs";
import { useProjects } from "@/hooks/use-projects";
import { useProjectModal } from "@/hooks/use-project-modal";

const MyProjects = () => {
  const [activeTab, setActiveTab] = useState("drafts"); // Start with drafts tab as it doesn't require connection
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Use our custom hooks
  const { 
    projects, 
    drafts, 
    contributions, 
    isLoading, 
    handleDeleteDraft, 
    refreshProjects 
  } = useProjects();
  
  const { 
    selectedProject,
    isModalOpen,
    handleProjectClick,
    handleSaveProject,
    setIsModalOpen
  } = useProjectModal();

  // Refresh handler with feedback - stable with dependencies
  const handleRefresh = useCallback(() => {
    refreshProjects();
    toast({
      title: "Refreshed",
      description: "Your projects have been refreshed",
    });
  }, [refreshProjects, toast]);

  // Navigate home handler - stable
  const handleNavigateHome = useCallback(() => {
    navigate('/');
  }, [navigate]);
  
  // Create a stable save project handler that's null when no project is selected
  const saveProjectHandler = useMemo(() => {
    return selectedProject ? handleSaveProject : null;
  }, [selectedProject, handleSaveProject]);
  
  // Active tab setter - using a callback to avoid re-renders
  const setActiveTabCallback = useCallback((value: string) => {
    setActiveTab(value);
  }, []);
  
  // Simple handlers for the demo create project modal
  const handleCreateProject = useCallback(() => {
    setIsCreateProjectOpen(true);
  }, []);
  
  const handleCloseCreateProject = useCallback(() => {
    setIsCreateProjectOpen(false);
  }, []);
  
  // Handle closing the project modal - stable callback
  const handleCloseProjectModal = useCallback(() => {
    setIsModalOpen(false);
  }, [setIsModalOpen]);
  
  // Memoize projects data to avoid unnecessary re-renders
  const projectsData = useMemo(() => ({ 
    projects: projects || [], 
    drafts: drafts || [], 
    contributions: contributions || [] 
  }), [projects, drafts, contributions]);
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="py-10">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold gradient-text">My Projects</h1>
            <div className="flex gap-2">
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="icon"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          
          <p className="text-xl text-gray-400 max-w-2xl">
            Manage your created projects, drafts, and contributions
          </p>
          
          <ProjectsTabs
            activeTab={activeTab}
            setActiveTab={setActiveTabCallback}
            isLoading={isLoading}
            projects={projectsData.projects}
            drafts={projectsData.drafts}
            contributions={projectsData.contributions}
            onProjectClick={handleProjectClick}
            onCreateProject={handleCreateProject}
            onDeleteDraft={handleDeleteDraft}
            onNavigateHome={handleNavigateHome}
            onSaveProject={saveProjectHandler}
          />
        </div>
      </div>
      
      <div className="container px-4 mx-auto py-8">
        <Button
          onClick={handleCreateProject}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Project
        </Button>
      </div>
      
      <FooterSection />
      
      {isModalOpen && selectedProject && (
        <ProjectModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={handleCloseProjectModal}
        />
      )}

      {/* Simple Demo Project Modal */}
      {isCreateProjectOpen && (
        <DemoProjectModal
          isOpen={isCreateProjectOpen}
          onClose={handleCloseCreateProject}
        />
      )}
    </div>
  );
};

export default MyProjects;
