
import { ProjectCard } from "@/components/project/ProjectCard";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Project } from "@/utils/hive/types";

interface ProjectDraftItemProps {
  draft: any;
  onDraftClick: () => void;
  onDeleteDraft: (draftId: string) => void;
}

export const ProjectDraftItem = ({ draft, onDraftClick, onDeleteDraft }: ProjectDraftItemProps) => {
  // Create a proper Project object to satisfy TypeScript requirements
  const projectData: Project = {
    id: draft.id,
    title: draft.title || "Untitled Draft",
    author: draft.creator || "Anonymous",
    creator: draft.creator || "Anonymous",
    description: draft.description || "Draft project",
    body: draft.body || "",
    permlink: draft.permlink || "",
    image: draft.coverImage || "https://placehold.co/600x400/3a206e/e8b4b6?text=Draft",
    category: draft.category || "Uncategorized",
    target: `${draft.fundingGoal || 0} HIVE`,
    raised: "0 HIVE",
    progress: 0,
    created: draft.createdAt || new Date().toISOString(),
    createdAt: draft.createdAt || new Date().toISOString(),
    status: 'active', // Default status for drafts
    contributors: [], // Empty contributors array for drafts
    governanceEnabled: false,
    verificationStatus: 'unverified',
    // Add missing required properties
    fundingGoal: typeof draft.fundingGoal === 'string' 
      ? parseFloat(draft.fundingGoal) 
      : (draft.fundingGoal || 0),
    currentFunding: 0,
    backers: 0,
    daysLeft: 30,
    percentFunded: 0,
    socialLinks: draft.socialLinks || {
      website: "",
      twitter: "",
      discord: "",
      github: ""
    }
  };

  return (
    <div className="relative">
      <ProjectCard
        project={projectData}
        onClick={onDraftClick}
      />
      <div className="absolute top-2 right-2">
        <Button
          variant="destructive"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteDraft(draft.id);
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
