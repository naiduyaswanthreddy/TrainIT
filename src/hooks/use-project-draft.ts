import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { SocialLinks } from "@/utils/hive/types";

export interface ProjectDraftData {
  id: string;
  title: string;
  category: string;
  fundingGoal: string;
  description: string;
  coverImage: string;
  socialLinks: SocialLinks;
  termsAccepted: boolean;
  creator: string;
  lastUpdated: string;
  enableSubscription?: boolean;
  enableMultiChain?: boolean;
  supportedBlockchains?: string[];
  enableDao?: boolean;
  enableNftRewards?: boolean;
}

export function useProjectDraft(draftId: string, creator: string) {
  const [draft, setDraft] = useState<ProjectDraftData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [autoSaveStatus, setAutoSaveStatus] = useState("idle");
  const { toast } = useToast();
  
  useEffect(() => {
    const loadDraft = () => {
      try {
        setIsLoading(true);
        const drafts = JSON.parse(localStorage.getItem('projectDrafts') || '[]');
        const existingDraft = drafts.find((d: any) => d.id === draftId);
        
        if (existingDraft) {
          const socialLinks = existingDraft.socialLinks || {};
          existingDraft.socialLinks = {
            website: socialLinks.website || "",
            twitter: socialLinks.twitter || "",
            discord: socialLinks.discord || "",
            github: socialLinks.github || ""
          };
          
          setDraft(existingDraft);
        } else if (draftId === 'new') {
          const newDraft: ProjectDraftData = {
            id: `draft-${Date.now()}`,
            title: "",
            category: "",
            fundingGoal: "",
            description: "",
            coverImage: "",
            socialLinks: {
              website: "",
              twitter: "",
              discord: "",
              github: ""
            },
            termsAccepted: false,
            creator,
            lastUpdated: new Date().toISOString(),
            enableSubscription: false,
            enableMultiChain: false,
            supportedBlockchains: [],
            enableDao: false,
            enableNftRewards: false
          };
          setDraft(newDraft);
          
          saveProjectDraft(newDraft);
        }
      } catch (error) {
        console.error("Error loading draft:", error);
        toast({
          title: "Error",
          description: "Failed to load draft data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDraft();
  }, [draftId, creator, toast]);
  
  const saveProjectDraft = useCallback((updatedDraft: ProjectDraftData) => {
    try {
      setAutoSaveStatus("saving");
      
      const drafts = JSON.parse(localStorage.getItem('projectDrafts') || '[]');
      const draftIndex = drafts.findIndex((d: any) => d.id === updatedDraft.id);
      
      const draftToSave = {
        ...updatedDraft,
        socialLinks: {
          website: updatedDraft.socialLinks?.website || "",
          twitter: updatedDraft.socialLinks?.twitter || "",
          discord: updatedDraft.socialLinks?.discord || "",
          github: updatedDraft.socialLinks?.github || ""
        },
        lastUpdated: new Date().toISOString()
      };
      
      if (draftIndex >= 0) {
        drafts[draftIndex] = draftToSave;
      } else {
        drafts.push(draftToSave);
      }
      
      localStorage.setItem('projectDrafts', JSON.stringify(drafts));
      setAutoSaveStatus("saved");
      
      setTimeout(() => {
        setAutoSaveStatus("idle");
      }, 2000);
      
      return draftToSave;
    } catch (error) {
      console.error("Error saving draft:", error);
      setAutoSaveStatus("error");
      toast({
        title: "Error",
        description: "Failed to save draft changes",
        variant: "destructive"
      });
      return null;
    }
  }, [toast]);
  
  const updateDraft = useCallback((updates: Partial<ProjectDraftData>) => {
    if (!draft) return;
    
    let updatedSocialLinks = draft.socialLinks;
    if (updates.socialLinks) {
      updatedSocialLinks = {
        website: updates.socialLinks.website || draft.socialLinks.website || "",
        twitter: updates.socialLinks.twitter || draft.socialLinks.twitter || "",
        discord: updates.socialLinks.discord || draft.socialLinks.discord || "",
        github: updates.socialLinks.github || draft.socialLinks.github || ""
      };
    }
    
    const updatedDraft = {
      ...draft,
      ...updates,
      socialLinks: updatedSocialLinks
    };
    
    setDraft(updatedDraft);
    saveProjectDraft(updatedDraft);
  }, [draft, saveProjectDraft]);
  
  return {
    draft,
    isLoading,
    updateDraft,
    saveProjectDraft,
    autoSaveStatus
  };
}
