
import { Link } from "react-router-dom";
import { Project } from "@/utils/hive/types";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

export const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  // Ensure project ID is properly formatted for the route
  const projectRoute = `/project/${project.id}`;

  const handleClick = (e: React.MouseEvent) => {
    // Only prevent default if onClick is provided
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Link to={projectRoute} onClick={handleClick} className="block no-underline">
      <motion.div 
        className="rounded-lg overflow-hidden bg-card hover:bg-card/80 transition-all cursor-pointer border border-border/40 h-full"
        whileHover={{ y: -5 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative">
          <img 
            src={project.image || 'https://placehold.co/600x400?text=Project+Image'} 
            alt={project.title} 
            className="w-full aspect-video object-cover"
          />
          <div className="absolute top-2 right-2">
            <Badge className="bg-black/50 hover:bg-black/60 text-white border-0">
              {project.category}
            </Badge>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-bold text-lg text-foreground truncate">{project.title}</h3>
          <p className="text-sm text-gray-300 line-clamp-2 h-10 mb-2">{project.description}</p>
          
          <div className="text-xs text-muted-foreground mb-2">by @{project.creator}</div>
          
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Progress</span>
            <span>{project.progress}%</span>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full" 
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-xs mt-2">
            <span className="text-muted-foreground">{project.raised} raised</span>
            <span className="text-muted-foreground">{project.target} goal</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
