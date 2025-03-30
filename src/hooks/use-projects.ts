
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { getConnectedUsername, fetchLatestProjects, formatPostToProject } from "@/utils/hive";
import { useHiveWallet } from "@/hooks/use-hive-wallet";

export const useProjects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [drafts, setDrafts] = useState<any[]>([]);
  const [contributions, setContributions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { initializeWallet } = useHiveWallet();

  // Load projects function
  const loadProjects = useCallback(async () => {
    try {
      setIsLoading(true);

      // Get draft projects from localStorage - these don't require connection
      const storedDrafts = JSON.parse(localStorage.getItem('projectDrafts') || '[]');
      setDrafts(storedDrafts);

      const username = getConnectedUsername();
      
      if (username) {
        try {
          // Fetch projects created by the user from Hive
          const hivePosts = await fetchLatestProjects('crowdhive', 'created', 50);
          
          // Filter posts by the current user
          const userPosts = hivePosts.filter(post => post.author === username);
          
          // Format the posts to match our project structure
          const formattedProjects = userPosts
            .map(post => formatPostToProject(post))
            .filter(Boolean); // Remove null values
          
          setProjects(formattedProjects);
          
          // Filter drafts for the connected user
          const userDrafts = storedDrafts.filter((draft: any) => draft.creator === username);
          setDrafts(userDrafts);
          
          // For contributions, we would fetch transfers from the blockchain
          // This is simplified for now
          setContributions([]);
        } catch (error) {
          console.error("Error fetching projects:", error);
        }
      }
    } catch (error) {
      console.error("Error loading projects:", error);
      toast({
        title: "Error",
        description: "Failed to load your projects. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Initialize and load projects
  useEffect(() => {
    const init = async () => {
      await initializeWallet();
      await loadProjects();
    };
    
    init();
  }, [initializeWallet, loadProjects]);

  // Handle draft deletion
  const handleDeleteDraft = useCallback((draftId: string) => {
    try {
      // Get drafts from localStorage
      const storedDrafts = JSON.parse(localStorage.getItem('projectDrafts') || '[]');
      // Filter out the draft to delete
      const updatedDrafts = storedDrafts.filter((draft: any) => draft.id !== draftId);
      // Save updated drafts back to localStorage
      localStorage.setItem('projectDrafts', JSON.stringify(updatedDrafts));
      // Update state
      setDrafts(updatedDrafts);
      
      toast({
        title: "Draft deleted",
        description: "Your project draft has been removed",
      });
    } catch (error) {
      console.error("Error deleting draft:", error);
      toast({
        title: "Error",
        description: "Failed to delete the draft. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Refresh projects
  const refreshProjects = useCallback(() => {
    initializeWallet();
    loadProjects();
  }, [initializeWallet, loadProjects]);

  return {
    projects,
    drafts,
    contributions,
    isLoading,
    handleDeleteDraft,
    refreshProjects
  };
};
