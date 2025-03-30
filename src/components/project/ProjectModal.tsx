
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Info } from "lucide-react";
import { format } from "date-fns";
import { Project } from "@/utils/hive/types";

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  if (!project) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] glass-card border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{project.title}</DialogTitle>
          <DialogDescription className="flex items-center space-x-1">
            <span>by {project.creator}</span>
            <span className="text-gray-500">•</span>
            <Badge variant="outline" className="bg-black/50 border-white/20">
              {project.category}
            </Badge>
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-2 space-y-4">
          <div className="relative rounded-md overflow-hidden h-48">
            <img
              src={project.image || 'https://placehold.co/600x400?text=Project+Image'}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <p className="text-sm text-gray-300">{project.description}</p>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
            <div className="flex justify-between text-sm text-gray-400">
              <span>Target: {project.target}</span>
              <span>Raised: {project.raised}</span>
            </div>
          </div>
          
          <div className="bg-primary/10 rounded-md p-3 text-sm">
            <h4 className="font-medium flex items-center mb-2">
              <Users className="h-4 w-4 mr-2" />
              Recent Contributors
            </h4>
            {project.contributors && project.contributors.length > 0 ? (
              <ul className="space-y-2">
                {project.contributors.map((contributor, i) => (
                  <li key={i} className="flex justify-between">
                    <span>@{contributor.username}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{contributor.amount}</span>
                      <span className="text-xs text-gray-500">{contributor.date}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No contributors yet</p>
            )}
          </div>
        </div>
        
        <DialogFooter className="mt-4 flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="sm:w-auto flex-1"
          >
            Close
          </Button>
          <Button
            className="sm:w-auto flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            onClick={() => window.location.href = `/project/${project.id}`}
          >
            View Full Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
