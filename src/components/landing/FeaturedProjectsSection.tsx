
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ProjectModal } from "@/components/project/ProjectModal";
import { Input } from "@/components/ui/input";
import { Search, X, Check, Trophy, Star, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import debounce from 'lodash/debounce';
import { SocialLinks } from "@/utils/hive/types";

// Define local interfaces to avoid conflicts with imported types
interface ProjectContributor {
  username: string;
  amount: string;
  date: string;
  role?: string;
  contribution?: string;
}

interface LocalProject {
  id: string;
  title: string;
  creator: string;
  image: string;
  progress: number;
  target: string;
  raised: string;
  category: string;
  description: string;
  contributors: ProjectContributor[];
  fundingGoal: string;
  currentFunding: string;
  createdAt: string;
  socialLinks: SocialLinks;
}

const projectDescriptions = [
  "This innovative decentralized art gallery aims to showcase digital artworks as NFTs while providing artists with fair compensation. By leveraging blockchain technology, we're creating a transparent marketplace where creators retain more control and earnings from their work. The platform will feature curated exhibitions, virtual reality galleries, and direct artist-to-collector connections.",
  "Building a community-powered podcast network that democratizes content creation and distribution. Our platform enables independent podcasters to receive direct funding from listeners without intermediaries taking large cuts. Features include exclusive content for supporters, community voting on topics, and fair monetization options for creators of all sizes.",
  "A revolutionary blockchain gaming platform that lets players truly own their in-game assets as NFTs. We're developing a suite of games with interoperable assets, meaning items purchased or earned in one game can be used across our entire ecosystem. The platform will feature PvP tournaments with HIVE token prizes and a player-driven marketplace.",
  "Creating a decentralized tracking system for renewable energy production and consumption. This platform helps individuals and communities monitor and verify their sustainable energy usage while earning rewards for positive environmental impact. The system interfaces with smart meters and uses blockchain for immutable record-keeping."
];

const sampleContributors = [
  { username: "hive_enthusiast", amount: "500 HIVE", date: "2 days ago", role: "backer", contribution: "funding" },
  { username: "crypto_whale", amount: "1,000 HIVE", date: "3 days ago", role: "backer", contribution: "funding" },
  { username: "web3_believer", amount: "250 HIVE", date: "5 days ago", role: "backer", contribution: "funding" },
  { username: "future_builder", amount: "100 HIVE", date: "1 week ago", role: "backer", contribution: "funding" },
  { username: "defi_explorer", amount: "75 HIVE", date: "1 week ago", role: "backer", contribution: "funding" }
];

const categoryImages = {
  Art: "https://placehold.co/600x400/7928CA/ffffff?text=Art+Project",
  Tech: "https://placehold.co/600x400/0070F3/ffffff?text=Tech+Project",
  Community: "https://placehold.co/600x400/F5A623/ffffff?text=Community+Project",
  Gaming: "https://placehold.co/600x400/6EE7B7/333333?text=Gaming+Project",
  Environment: "https://placehold.co/600x400/10B981/ffffff?text=Green+Project",
  Education: "https://placehold.co/600x400/3B82F6/ffffff?text=Education+Project",
  Finance: "https://placehold.co/600x400/6366F1/ffffff?text=Finance+Project",
  Health: "https://placehold.co/600x400/EC4899/ffffff?text=Health+Project"
};

const generateProjects = (count: number, startId: number): LocalProject[] => {
  const categories = ["Art", "Tech", "Community", "Gaming", "Environment", "Education", "Finance", "Health"];
  
  return Array.from({ length: count }).map((_, index) => {
    const id = startId + index;
    const progress = Math.floor(Math.random() * 100);
    const target = `${(Math.floor(Math.random() * 20) + 5) * 1000} HIVE`;
    const raised = `${Math.floor(progress * parseInt(target) / 100)} HIVE`;
    const category = categories[id % categories.length];
    
    return {
      id: id.toString(),
      title: `Project ${id}`,
      creator: `Creator${id}`,
      image: categoryImages[category as keyof typeof categoryImages] || `https://placehold.co/600x400/3a206e/e8b4b6?text=Project+${id}`,
      progress,
      target,
      raised,
      category,
      description: projectDescriptions[id % projectDescriptions.length],
      contributors: sampleContributors.slice(0, (id % 5) + 1),
      fundingGoal: target,
      currentFunding: raised,
      createdAt: new Date().toISOString(),
      socialLinks: {
        website: "",
        twitter: "",
        discord: "",
        github: ""
      }
    };
  });
};

export const FeaturedProjectsSection = () => {
  const [projects, setProjects] = useState<LocalProject[]>([
    {
      id: "1",
      title: "Decentralized Art Gallery",
      creator: "ArtisTech",
      image: categoryImages["Art"],
      progress: 75,
      target: "10,000 HIVE",
      raised: "7,500 HIVE",
      category: "Art",
      description: projectDescriptions[0],
      contributors: sampleContributors.slice(0, 3),
      fundingGoal: "10,000 HIVE",
      currentFunding: "7,500 HIVE",
      createdAt: new Date().toISOString(),
      socialLinks: {
        website: "",
        twitter: "",
        discord: "",
        github: ""
      }
    },
    {
      id: "2",
      title: "Community Podcast Network",
      creator: "Voice DAO",
      image: categoryImages["Community"],
      progress: 45,
      target: "5,000 HIVE",
      raised: "2,250 HIVE",
      category: "Community",
      description: projectDescriptions[1],
      contributors: sampleContributors.slice(1, 4),
      fundingGoal: "5,000 HIVE",
      currentFunding: "2,250 HIVE",
      createdAt: new Date().toISOString(),
      socialLinks: {
        website: "",
        twitter: "",
        discord: "",
        github: ""
      }
    },
    {
      id: "3",
      title: "Blockchain Gaming Platform",
      creator: "GameChain",
      image: categoryImages["Gaming"],
      progress: 90,
      target: "20,000 HIVE",
      raised: "18,000 HIVE",
      category: "Gaming",
      description: projectDescriptions[2],
      contributors: sampleContributors.slice(0, 5),
      fundingGoal: "20,000 HIVE",
      currentFunding: "18,000 HIVE",
      createdAt: new Date().toISOString(),
      socialLinks: {
        website: "",
        twitter: "",
        discord: "",
        github: ""
      }
    },
    {
      id: "4",
      title: "Sustainable Energy Tracker",
      creator: "GreenBlock",
      image: categoryImages["Environment"],
      progress: 30,
      target: "15,000 HIVE",
      raised: "4,500 HIVE",
      category: "Environment",
      description: projectDescriptions[3],
      contributors: sampleContributors.slice(2, 4),
      fundingGoal: "15,000 HIVE",
      currentFunding: "4,500 HIVE",
      createdAt: new Date().toISOString(),
      socialLinks: {
        website: "",
        twitter: "",
        discord: "",
        github: ""
      }
    },
  ]);

  const [selectedProject, setSelectedProject] = useState<LocalProject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [highlightedTerms, setHighlightedTerms] = useState<string[]>([]);
  const [leaderboardUsers, setLeaderboardUsers] = useState([
    { username: "hive_enthusiast", contributions: 2500, tier: "gold", avatar: "https://placehold.co/100/gold/white?text=HE" },
    { username: "crypto_whale", contributions: 2000, tier: "gold", avatar: "https://placehold.co/100/gold/white?text=CW" },
    { username: "web3_believer", contributions: 1500, tier: "silver", avatar: "https://placehold.co/100/silver/white?text=WB" },
    { username: "future_builder", contributions: 1000, tier: "silver", avatar: "https://placehold.co/100/silver/white?text=FB" },
    { username: "defi_explorer", contributions: 750, tier: "bronze", avatar: "https://placehold.co/100/bronze/white?text=DE" },
    { username: "blockchain_fan", contributions: 500, tier: "bronze", avatar: "https://placehold.co/100/bronze/white?text=BF" },
    { username: "hive_supporter", contributions: 350, tier: "bronze", avatar: "https://placehold.co/100/bronze/white?text=HS" },
  ]);
  const { toast } = useToast();

  const categories = ["Art", "Tech", "Community", "Gaming", "Environment", "Education", "Finance", "Health"];

  // Fix for the infinite loop: useEffect instead of direct state update
  useEffect(() => {
    if (searchTerm.trim()) {
      setHighlightedTerms(searchTerm.trim().toLowerCase().split(/\s+/));
    } else {
      setHighlightedTerms([]);
    }
  }, [searchTerm]);

  // Memoize the loadMoreProjects function to prevent recreation on each render
  const loadMoreProjects = useCallback(() => {
    const newProjects = generateProjects(8, projects.length + 1);
    setProjects(prev => [...prev, ...newProjects]);
    
    toast({
      title: "Projects loaded",
      description: "8 more projects have been loaded",
    });
  }, [projects.length, toast]);

  // Memoize the openProjectModal function
  const openProjectModal = useCallback((project: LocalProject) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  }, []);

  // Memoize the toggleCategoryFilter function
  const toggleCategoryFilter = useCallback((category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  }, []);

  // Memoize the search function with debounce
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  }, [debouncedSearch]);

  // Memoize filteredProjects calculation to prevent recalculation on every render
  const filteredProjects = useCallback(() => {
    return projects.filter(project => {
      const matchesSearch = !searchTerm.trim() || 
                            project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            project.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            project.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategories.length === 0 || 
                              selectedCategories.includes(project.category);
      
      return matchesSearch && matchesCategory;
    });
  }, [projects, searchTerm, selectedCategories]);

  const highlightText = useCallback((text: string) => {
    if (highlightedTerms.length === 0) return text;
    
    let highlightedText = text;
    highlightedTerms.forEach(term => {
      if (term.length > 2) {
        const regex = new RegExp(`(${term})`, 'gi');
        highlightedText = highlightedText.replace(regex, '<mark class="bg-purple-400/30 text-inherit px-1 rounded">$1</mark>');
      }
    });
    
    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
  }, [highlightedTerms]);

  // Memoize this computation
  const topProjects = useCallback(() => {
    return [...projects]
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 5);
  }, [projects]);

  const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.classList.add('loaded');
  }, []);

  const getContributorTierBadge = useCallback((tier: string) => {
    switch(tier) {
      case "gold":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500">
            <Trophy className="h-3 w-3 mr-1" />
            Gold Tier
          </Badge>
        );
      case "silver":
        return (
          <Badge className="bg-gray-400/20 text-gray-300 border-gray-400">
            <Star className="h-3 w-3 mr-1" />
            Silver Tier
          </Badge>
        );
      case "bronze":
        return (
          <Badge className="bg-amber-700/20 text-amber-600 border-amber-700">
            <Award className="h-3 w-3 mr-1" />
            Bronze Tier
          </Badge>
        );
      default:
        return null;
    }
  }, []);

  // Get filtered projects once to avoid recalculation
  const currentFilteredProjects = filteredProjects();

  return (
    <section className="py-12">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-bold gradient-text mb-2">Featured Projects</h2>
            <p className="text-gray-400 max-w-2xl">
              Discover innovative projects on CrowdHive that are changing the world through 
              community-powered funding and transparent blockchain technology.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 relative w-full md:w-auto flex">
            <Input
              placeholder="Search projects..."
              onChange={handleSearchChange}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 mb-6">
          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Checkbox
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => toggleCategoryFilter(category)}
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
        
        {currentFilteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-2xl font-semibold mb-3">No projects found</h3>
            <p className="text-gray-400">
              Try adjusting your search or filter criteria to find more projects.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentFilteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-card/30 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                      onLoad={handleImageLoad}
                    />
                    <div className="absolute top-3 right-3">
                      <Badge variant="outline" className="bg-black/50 backdrop-blur-sm border-white/20">
                        {project.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-1">
                      {highlightText(project.title)}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3">
                      by {highlightText(project.creator)}
                    </p>
                    
                    <p className="text-sm line-clamp-3 mb-4 h-14">
                      {highlightText(project.description)}
                    </p>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                    
                    <div className="flex justify-between text-sm mb-4">
                      <span>Target: {project.target}</span>
                      <span>Raised: {project.raised}</span>
                    </div>
                    
                    <Button 
                      onClick={() => openProjectModal(project)}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    >
                      View Project
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Button 
                onClick={loadMoreProjects}
                variant="outline"
                className="border-purple-600/30 hover:border-purple-600 text-purple-400 hover:text-purple-300"
              >
                Load More Projects
              </Button>
            </div>
          </>
        )}
        
        <div className="mt-16 bg-card/30 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center">
            <Trophy className="text-yellow-500 mr-2 h-5 w-5" />
            Top Contributors
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leaderboardUsers.map((user, index) => (
              <div 
                key={user.username} 
                className="flex items-center p-3 border border-white/10 rounded-lg"
              >
                <div className="flex-shrink-0 mr-3">
                  <img 
                    src={user.avatar} 
                    alt={user.username} 
                    className="w-10 h-10 rounded-full"
                  />
                </div>
                <div className="flex-grow">
                  <div className="font-medium">@{user.username}</div>
                  <div className="text-sm text-gray-400">{user.contributions} HIVE</div>
                </div>
                <div className="flex-shrink-0">
                  {getContributorTierBadge(user.tier)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {selectedProject && (
        <ProjectModal
          project={selectedProject as any}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </section>
  );
};
