
import { useState, useCallback, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const useProjectModal = () => {
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isSimpleCreateOpen, setIsSimpleCreateOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const draftsRef = useRef<any[]>([]);
  // Store last saved drafts to prevent unnecessary re-renders
  const lastSavedRef = useRef<string | null>(null);

  // Project click handler
  const handleProjectClick = useCallback((project: any) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  }, []);
  
  // Create project handler (detailed form)
  const handleCreateProject = useCallback(() => {
    setIsCreateProjectOpen(true);
  }, []);

  // Create project handler (simple form)
  const handleSimpleCreateProject = useCallback(() => {
    setIsSimpleCreateOpen(true);
  }, []);

  // Close create project modal (detailed form)
  const closeCreateProjectModal = useCallback(() => {
    setIsCreateProjectOpen(false);
  }, []);

  // Close create project modal (simple form)
  const closeSimpleCreateModal = useCallback(() => {
    setIsSimpleCreateOpen(false);
  }, []);

  // Save project handler with stable dependencies
  const handleSaveProject = useCallback(() => {
    if (!selectedProject) {
      toast({
        title: "No project selected",
        description: "Please select a project to save",
        variant: "destructive"
      });
      return draftsRef.current;
    }

    // Prevent saving the same project multiple times in a row
    const projectHash = JSON.stringify(selectedProject);
    if (lastSavedRef.current === projectHash) {
      return draftsRef.current;
    }
    
    setIsSaving(true);

    try {
      // Create a simplified draft save mechanism
      const existingDrafts = JSON.parse(localStorage.getItem('projectDrafts') || '[]');
      
      // Check if the project already exists in drafts
      const existingDraftIndex = existingDrafts.findIndex((draft: any) => draft.id === selectedProject.id);
      
      let updatedDrafts;
      if (existingDraftIndex >= 0) {
        // Update existing draft
        updatedDrafts = [...existingDrafts];
        updatedDrafts[existingDraftIndex] = {
          ...selectedProject,
          lastSaved: new Date().toISOString()
        };
      } else {
        // Add as new draft
        updatedDrafts = [
          ...existingDrafts,
          {
            ...selectedProject,
            lastSaved: new Date().toISOString()
          }
        ];
      }
      
      // Save back to localStorage
      localStorage.setItem('projectDrafts', JSON.stringify(updatedDrafts));
      
      toast({
        title: "Project saved",
        description: "Your project has been saved as a draft"
      });
      
      // Update the refs without triggering re-renders
      draftsRef.current = updatedDrafts;
      lastSavedRef.current = projectHash;
      
      return updatedDrafts;
    } catch (error) {
      console.error("Error saving project:", error);
      toast({
        title: "Error",
        description: "Failed to save your project. Please try again.",
        variant: "destructive"
      });
      return draftsRef.current;
    } finally {
      setIsSaving(false);
    }
  }, [selectedProject, toast]);

  return {
    selectedProject,
    isModalOpen,
    isCreateProjectOpen,
    isSimpleCreateOpen,
    isSaving,
    handleProjectClick,
    handleCreateProject,
    handleSimpleCreateProject,
    handleSaveProject,
    closeCreateProjectModal,
    closeSimpleCreateModal,
    setIsModalOpen,
    setDrafts: useCallback((drafts: any[]) => {
      draftsRef.current = drafts;
    }, [])
  };
};
