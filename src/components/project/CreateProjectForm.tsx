
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Dialog,
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { 
  Form,
} from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowRight, 
  ArrowLeft, 
  Rocket,
  Save,
  Clock,
  Check,
  AlertCircle
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  getConnectedUsername, 
  isKeychainInstalled,
  getDidVerification
} from "@/utils/hive/auth";
import { postProject } from "@/utils/hive/projects";
import { useProjectDraft } from "@/hooks/use-project-draft";
import { projectSchema, FORM_STEPS, type ProjectFormValues } from "./project-form-schema";
import { ProjectFormSteps } from "./ProjectFormSteps";
import { BasicInfoStep } from "./form-steps/BasicInfoStep";
import { DescriptionStep } from "./form-steps/DescriptionStep";
import { FundingStep } from "./form-steps/FundingStep";
import { NftRewardsStep } from "./form-steps/NftRewardsStep";
import { MediaStep } from "./form-steps/MediaStep";
import { SocialLinksStep } from "./form-steps/SocialLinksStep";
import { ReviewStep } from "./form-steps/ReviewStep";
import { AuthRequiredDialog } from "./AuthRequiredDialogs";
import { DidVerification } from "@/utils/hive/types";
import { useHiveWallet } from "@/hooks/use-hive-wallet";

interface CreateProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  editDraftId?: string;
}

export function CreateProjectForm({ isOpen, onClose, editDraftId }: CreateProjectFormProps) {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempCoverImage, setTempCoverImage] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isKeychainAvailable, setIsKeychainAvailable] = useState(false);
  const [didVerification, setDidVerification] = useState<DidVerification | null>(null);
  const { connected, connectedUser, initializeWallet } = useHiveWallet();
  const username = getConnectedUsername();
  const draftId = editDraftId || 'new';
  const { draft, isLoading: isDraftLoading, updateDraft, autoSaveStatus, saveProjectDraft } = useProjectDraft(draftId, username || '');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      // Force initialize wallet to make sure we have the latest connection status
      initializeWallet();
      
      const name = getConnectedUsername();
      setIsAuthenticated(!!name);
      setIsKeychainAvailable(isKeychainInstalled());
      
      if (name) {
        const verification = await getDidVerification(name);
        setDidVerification(verification);
      }
    };
    
    checkAuth();
    
    if (isOpen) {
      checkAuth();
    }
  }, [isOpen, initializeWallet]);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
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
      enableSubscription: false,
      enableMultiChain: false,
      supportedBlockchains: ["Hive"],
      enableDao: false,
      enableNftRewards: false
    }
  });

  useEffect(() => {
    if (draft && !isDraftLoading) {
      form.reset({
        title: draft.title,
        category: draft.category,
        fundingGoal: draft.fundingGoal,
        description: draft.description,
        coverImage: draft.coverImage,
        socialLinks: {
          website: draft.socialLinks.website,
          twitter: draft.socialLinks.twitter,
          discord: draft.socialLinks.discord,
          github: draft.socialLinks.github
        },
        termsAccepted: draft.termsAccepted,
        enableSubscription: draft.enableSubscription,
        enableMultiChain: draft.enableMultiChain,
        supportedBlockchains: draft.supportedBlockchains,
        enableDao: draft.enableDao,
        enableNftRewards: draft.enableNftRewards
      });
      
      if (draft.coverImage) {
        setTempCoverImage(draft.coverImage);
      }
    }
  }, [draft, isDraftLoading, form]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (draft && !isDraftLoading) {
        const formValues = form.getValues();
        updateDraft({
          title: formValues.title,
          category: formValues.category,
          fundingGoal: formValues.fundingGoal,
          description: formValues.description,
          coverImage: formValues.coverImage,
          socialLinks: formValues.socialLinks,
          termsAccepted: formValues.termsAccepted,
          enableSubscription: formValues.enableSubscription,
          enableMultiChain: formValues.enableMultiChain,
          supportedBlockchains: formValues.supportedBlockchains,
          enableDao: formValues.enableDao,
          enableNftRewards: formValues.enableNftRewards
        });
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, updateDraft, draft, isDraftLoading]);

  useEffect(() => {
    if (!isOpen) {
      setStep(0);
    }
  }, [isOpen]);

  const onSubmit = async (data: ProjectFormValues) => {
    if (!username) {
      toast({
        title: "Authentication Error",
        description: "Please connect your Hive wallet before creating a project",
        variant: "destructive"
      });
      return;
    }
    
    if (!isKeychainAvailable) {
      toast({
        title: "Hive Keychain Required",
        description: "Please install the Hive Keychain browser extension to submit projects",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const projectBody = `
# ${data.title}

## About This Project
${data.description}

## Funding Goal
${data.fundingGoal} HIVE

## Creator
@${username}

${data.enableSubscription ? '## Subscription Tiers Available\nThis project offers subscription-based funding options!\n' : ''}
${data.enableMultiChain ? `## Multi-Chain Support\nThis project accepts funding on: ${data.supportedBlockchains?.join(', ')}\n` : ''}
${data.enableDao ? '## DAO Governance\nThis project includes community governance via DAO tokens!\n' : ''}
${data.enableNftRewards ? '## NFT Rewards\nThis project offers exclusive NFT rewards to backers!\n' : ''}

---
*Posted via CrowdHive - Decentralized crowdfunding on the Hive blockchain*
      `;
      
      const result = await postProject(
        username,
        data.title,
        projectBody,
        data.category,
        parseFloat(data.fundingGoal),
        data.coverImage || null,
        data.socialLinks,
        data.enableSubscription,
        data.enableMultiChain,
        data.supportedBlockchains,
        data.enableDao,
        data.enableNftRewards
      );
      
      if (result.success) {
        toast({
          title: "Project submitted!",
          description: "Your project has been successfully posted to the Hive blockchain.",
        });
        
        if (draft) {
          const drafts = JSON.parse(localStorage.getItem('projectDrafts') || '[]');
          const updatedDrafts = drafts.filter((d: any) => d.id !== draft.id);
          localStorage.setItem('projectDrafts', JSON.stringify(updatedDrafts));
        }
        
        onClose();
        navigate(`/project/${result.permlink}`);
      } else {
        throw new Error(result.message);
      }
      
    } catch (error: any) {
      console.error("Error creating project:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    switch (step) {
      case 0:
        form.trigger(["title", "category"]).then((isValid) => {
          if (isValid) setStep(step + 1);
        });
        break;
      case 1:
        form.trigger(["description"]).then((isValid) => {
          if (isValid) setStep(step + 1);
        });
        break;
      case 2:
        form.trigger(["fundingGoal"]).then((isValid) => {
          if (isValid) setStep(step + 1);
        });
        break;
      default:
        setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(Math.max(0, step - 1));
  };
  
  const handleSaveAsDraft = () => {
    if (!draft) return;
    
    try {
      const formValues = form.getValues();
      const updatedDraft = {
        ...draft,
        title: formValues.title || draft.title,
        category: formValues.category || draft.category,
        fundingGoal: formValues.fundingGoal || draft.fundingGoal,
        description: formValues.description || draft.description,
        socialLinks: {
          website: formValues.socialLinks?.website || draft.socialLinks.website,
          twitter: formValues.socialLinks?.twitter || draft.socialLinks.twitter,
          discord: formValues.socialLinks?.discord || draft.socialLinks.discord,
          github: formValues.socialLinks?.github || draft.socialLinks.github
        },
        coverImage: formValues.coverImage || draft.coverImage,
        enableSubscription: formValues.enableSubscription,
        enableMultiChain: formValues.enableMultiChain,
        supportedBlockchains: formValues.supportedBlockchains,
        enableDao: formValues.enableDao,
        enableNftRewards: formValues.enableNftRewards,
      };
      
      saveProjectDraft(updatedDraft);
      
      toast({
        title: "Saved as draft",
        description: "Your project has been saved as a draft.",
        duration: 3000,
      });
      
      // Close the modal after saving
      onClose();
      
      // Navigate to My Projects page with drafts tab active
      navigate('/my-projects');
      
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        title: "Error",
        description: "Failed to save project as draft.",
        variant: "destructive"
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <AuthRequiredDialog
        isOpen={isOpen}
        onClose={onClose}
        title="Connect to Start a Project"
        description="Please connect your Hive wallet to create a project on CrowdHive. Use the wallet connect button in the navigation bar."
        actionLabel="Got it"
      />
    );
  }

  if (!isKeychainAvailable) {
    return (
      <AuthRequiredDialog
        isOpen={isOpen}
        onClose={onClose}
        title="Hive Keychain Required"
        description="Hive Keychain extension is required to post content to the Hive blockchain. Please install it and reload the page."
        actionLabel="Get Hive Keychain"
        actionUrl="https://hive-keychain.com"
      />
    );
  }

  if (isDraftLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] glass-card border-white/10">
          <div className="flex flex-col items-center justify-center py-10">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-300">Loading project data...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Show DID verification warning if user is not verified
  if (didVerification && didVerification.level === 'unverified' && step === 0) {
    toast({
      title: "DID Verification Recommended",
      description: "Verifying your decentralized identity can increase trust in your project. Consider getting verified before publishing.",
      variant: "default",
      duration: 6000,
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass-card border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text flex items-center">
            <Rocket className="mr-2 h-5 w-5" />
            {editDraftId ? "Edit Project" : "Start a Project"}
            {didVerification && didVerification.level === 'verified' && (
              <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">
                Verified Creator
              </span>
            )}
          </DialogTitle>
          <DialogDescription className="text-gray-300 flex items-center justify-between">
            <span>Share your idea with the community and get the funding you need.</span>
            <div className="flex items-center ml-4">
              {autoSaveStatus === "saving" && (
                <span className="text-xs flex items-center text-amber-400">
                  <Clock className="animate-pulse h-3 w-3 mr-1" />
                  Saving...
                </span>
              )}
              {autoSaveStatus === "saved" && (
                <span className="text-xs flex items-center text-green-400">
                  <Check className="h-3 w-3 mr-1" />
                  Auto-saved
                </span>
              )}
              {autoSaveStatus === "error" && (
                <span className="text-xs flex items-center text-red-400">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Error saving
                </span>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Getting Started</span>
            <span>Ready to Submit</span>
          </div>
          <Progress value={(step / (FORM_STEPS.length - 1)) * 100} className="h-2" />
        </div>
        
        <ProjectFormSteps steps={FORM_STEPS} currentStep={step} />
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === 0 && <BasicInfoStep form={form} />}
            {step === 1 && <DescriptionStep form={form} />}
            {step === 2 && <FundingStep form={form} />}
            {step === 3 && <NftRewardsStep form={form} />}
            {step === 4 && (
              <MediaStep 
                form={form} 
                tempCoverImage={tempCoverImage} 
                setTempCoverImage={setTempCoverImage} 
              />
            )}
            {step === 5 && <SocialLinksStep form={form} />}
            {step === 6 && (
              <ReviewStep 
                form={form} 
                tempCoverImage={tempCoverImage} 
              />
            )}
            
            <div className="flex justify-between pt-4 border-t border-gray-800">
              <div className="flex items-center">
                {step > 0 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={prevStep}
                    className="bg-secondary/20 mr-2"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                )}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveAsDraft}
                  className="bg-secondary/20 text-white"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Draft
                </Button>
              </div>
              
              <div className="flex space-x-2">
                {step < FORM_STEPS.length - 1 ? (
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    type="submit"
                    disabled={isSubmitting || !form.watch("termsAccepted")}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Project"}
                    <Rocket className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
