
import React from "react";
import { 
  Dialog,
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Rocket, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DemoProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoProjectModal({ isOpen, onClose }: DemoProjectModalProps) {
  const { toast } = useToast();
  
  const handleSubmit = () => {
    toast({
      title: "Project Created!",
      description: "Your demo project has been successfully submitted.",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl glass-card border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text flex items-center">
            <Rocket className="mr-2 h-5 w-5" />
            Create a New Project
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Share your idea with the community and get the funding you need.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Project Title</h3>
              <input 
                type="text" 
                placeholder="Enter your project title"
                className="w-full p-3 rounded-md border border-gray-600 bg-gray-800 text-white"
                defaultValue="My Amazing Project"
              />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Category</h3>
              <select 
                className="w-full p-3 rounded-md border border-gray-600 bg-gray-800 text-white"
                defaultValue="technology"
              >
                <option value="technology">Technology</option>
                <option value="arts">Arts</option>
                <option value="community">Community</option>
                <option value="education">Education</option>
                <option value="environment">Environment</option>
              </select>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Funding Goal (HIVE)</h3>
              <input 
                type="number" 
                placeholder="Enter amount in HIVE"
                className="w-full p-3 rounded-md border border-gray-600 bg-gray-800 text-white"
                defaultValue="1000"
              />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Project Description</h3>
              <textarea 
                rows={5}
                placeholder="Describe your project in detail..."
                className="w-full p-3 rounded-md border border-gray-600 bg-gray-800 text-white"
                defaultValue="This is a demo project to showcase the CrowdHive platform. In a real project, you would describe your goals, timeline, and how you plan to use the funds."
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="terms" className="rounded border-gray-600 bg-gray-800" defaultChecked />
              <label htmlFor="terms" className="text-gray-300">I agree to the terms and conditions</label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between pt-4 border-t border-gray-800">
          <Button 
            variant="outline"
            onClick={onClose}
            className="bg-secondary/20 text-white"
          >
            Cancel
          </Button>
          
          <Button 
            onClick={handleSubmit}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            Submit Project
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
