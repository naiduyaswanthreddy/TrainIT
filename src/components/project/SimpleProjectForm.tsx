
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Dialog,
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { getConnectedUsername } from "@/utils/hive/auth";
import { postProject } from "@/utils/hive/projects";
import { CATEGORIES } from "./project-form-schema";
import * as z from "zod";

interface SimpleProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
}

// Simplified schema for the basic project creation
const simpleProjectSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be less than 100 characters"),
  category: z.string().min(1, "Please select a category"),
  fundingGoal: z.string().min(1, "Please enter a funding goal"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  }),
});

type SimpleProjectFormValues = z.infer<typeof simpleProjectSchema>;

export function SimpleProjectForm({ isOpen, onClose }: SimpleProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const username = getConnectedUsername();

  const form = useForm<SimpleProjectFormValues>({
    resolver: zodResolver(simpleProjectSchema),
    defaultValues: {
      title: "",
      category: "",
      fundingGoal: "",
      description: "",
      termsAccepted: false,
    }
  });

  const onSubmit = async (data: SimpleProjectFormValues) => {
    if (!username) {
      toast({
        title: "Authentication Error",
        description: "Please connect your Hive wallet before creating a project",
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

---
*Posted via CrowdHive - Decentralized crowdfunding on the Hive blockchain*
      `;
      
      const result = await postProject(
        username,
        data.title,
        projectBody,
        data.category,
        parseFloat(data.fundingGoal),
        null, // No cover image in simple form
        { website: "", twitter: "", discord: "", github: "" }, // Empty social links
        false, // No subscription
        false, // No multi-chain
        ["Hive"], // Only Hive blockchain
        false, // No DAO
        false  // No NFT rewards
      );
      
      if (result.success) {
        toast({
          title: "Project submitted!",
          description: "Your project has been successfully posted to the Hive blockchain.",
        });
        
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] glass-card border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center justify-between">
            <span>Create a New Project</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-4 top-4 rounded-full" 
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Share your idea with the community and get the funding you need.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input 
                id="title" 
                placeholder="My Amazing Project" 
                className="bg-background/50"
                {...form.register("title")}
              />
              {form.formState.errors.title && (
                <p className="text-sm font-medium text-destructive">{form.formState.errors.title.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                onValueChange={(value) => form.setValue("category", value)}
                defaultValue={form.watch("category")}
              >
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.category && (
                <p className="text-sm font-medium text-destructive">{form.formState.errors.category.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fundingGoal">Funding Goal (HIVE)</Label>
              <Input 
                id="fundingGoal" 
                type="number"
                min="10"
                step="0.1"
                placeholder="1000"
                className="bg-background/50"
                {...form.register("fundingGoal")}
              />
              {form.formState.errors.fundingGoal && (
                <p className="text-sm font-medium text-destructive">{form.formState.errors.fundingGoal.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Project Description</Label>
              <Textarea 
                id="description" 
                placeholder="This is a demo project to showcase the CrowdHive platform. In a real project, you would describe your goals, timeline, and how you plan to use the funds."
                className="min-h-[150px] bg-background/50"
                {...form.register("description")}
              />
              {form.formState.errors.description && (
                <p className="text-sm font-medium text-destructive">{form.formState.errors.description.message}</p>
              )}
              <p className="text-xs text-gray-400">
                Minimum 50 characters. Describe your project goals, timeline, and how you plan to use the funds.
              </p>
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="terms" 
                checked={form.watch("termsAccepted")}
                onCheckedChange={(checked) => {
                  form.setValue("termsAccepted", checked === true);
                }}
              />
              <Label htmlFor="terms" className="text-sm">
                I agree to the terms and conditions
              </Label>
            </div>
            {form.formState.errors.termsAccepted && (
              <p className="text-sm font-medium text-destructive">{form.formState.errors.termsAccepted.message}</p>
            )}
          </div>
          
          <DialogFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              Cancel
            </Button>
            
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              Submit Project
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
