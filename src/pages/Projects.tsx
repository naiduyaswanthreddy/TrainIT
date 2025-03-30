import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ProjectCard } from "@/components/project/ProjectCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Project } from "@/utils/hive/types";
import { Search, Award, Gift, ChevronRight, ListFilter, CheckCircle, XCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<{
    hasGovernance: boolean;
    hasNftRewards: boolean;
    isVerified: boolean;
  }>({
    hasGovernance: false,
    hasNftRewards: false,
    isVerified: false,
  });
  const [sortOption, setSortOption] = useState<string>("newest");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      
      try {
        const storedProjects = localStorage.getItem('projects');
        const projectsList = storedProjects ? JSON.parse(storedProjects) : [];
        
        if (!projectsList.length) {
          const sampleProjects = generateMockProjects(12);
          localStorage.setItem('projects', JSON.stringify(sampleProjects));
          setProjects(sampleProjects);
        } else {
          setProjects(projectsList);
        }
      } catch (error) {
        console.error("Error loading projects:", error);
        toast({
          title: "Error",
          description: "Failed to load projects",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [toast]);

  useEffect(() => {
    let results = [...projects];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        project => 
          project.title.toLowerCase().includes(term) ||
          project.creator.toLowerCase().includes(term) ||
          project.description.toLowerCase().includes(term) ||
          project.category.toLowerCase().includes(term)
      );
    }
    
    if (selectedCategories.length > 0) {
      results = results.filter(project => 
        selectedCategories.includes(project.category)
      );
    }
    
    if (selectedFilters.hasGovernance) {
      results = results.filter(project => project.governanceEnabled);
    }
    
    if (selectedFilters.hasNftRewards) {
      results = results.filter(project => project.rewards && project.rewards.length > 0);
    }
    
    if (selectedFilters.isVerified) {
      results = results.filter(project => project.verificationStatus === 'verified');
    }
    
    results = sortProjects(results, sortOption);
    
    setFilteredProjects(results);
  }, [projects, searchTerm, selectedCategories, selectedFilters, sortOption]);

  const handleProjectClick = (project: Project) => {
    navigate(`/project/${project.id}`);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleFilter = (filter: keyof typeof selectedFilters) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  const handleSortChange = (value: string) => {
    setSortOption(value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedFilters({
      hasGovernance: false,
      hasNftRewards: false,
      isVerified: false,
    });
    setSortOption("newest");
  };

  const sortProjects = (projectList: Project[], option: string): Project[] => {
    switch (option) {
      case "newest":
        return [...projectList].sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
      case "oldest":
        return [...projectList].sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateA - dateB;
        });
      case "most_funded":
        return [...projectList].sort((a, b) => b.progress - a.progress);
      case "least_funded":
        return [...projectList].sort((a, b) => a.progress - b.progress);
      default:
        return projectList;
    }
  };

  const categories = [...new Set(projects.map(project => project.category))];

  const generateMockProjects = (count: number): Project[] => {
    const adjectives = ["Innovative", "Decentralized", "Community", "Revolutionary", "Community", "Educational", "Financial", "Health"];
    const nouns = ["Art", "Tech", "Gaming", "Environment", "Education", "Finance", "Health"];
    const creators = ["Creator1", "Creator2", "Creator3", "Creator4", "Creator5"];
    const descriptions = [
      "This innovative decentralized art gallery aims to showcase digital artworks as NFTs while providing artists with fair compensation. By leveraging blockchain technology, we're creating a transparent marketplace where creators retain more control and earnings from their work.",
      "Building a community-powered podcast network that democratizes content creation and distribution. Our platform enables independent podcasters to receive direct funding from listeners without intermediaries taking large cuts.",
      "A revolutionary blockchain gaming platform that lets players truly own their in-game assets as NFTs. We're developing a suite of games with interoperable assets, meaning items purchased or earned in one game can be used across our entire ecosystem.",
      "Creating a decentralized tracking system for renewable energy production and consumption. This platform helps individuals and communities monitor and verify their sustainable energy usage while earning rewards for positive environmental impact."
    ];
    const images = [
      "https://placehold.co/600x400/3a206e/e8b4b6?text=Art+Project",
      "https://placehold.co/600x400/3a206e/e8b4b6?text=Tech+Project",
      "https://placehold.co/600x400/3a206e/e8b4b6?text=Gaming+Project",
      "https://placehold.co/600x400/3a206e/e8b4b6?text=Environment+Project",
      "https://placehold.co/600x400/3a206e/e8b4b6?text=Education+Project",
      "https://placehold.co/600x400/3a206e/e8b4b6?text=Finance+Project",
      "https://placehold.co/600x400/3a206e/e8b4b6?text=Health+Project"
    ];
    
    return Array.from({ length: count }).map((_, index) => {
      const id = `project-${index}`;
      const title = `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
      const creator = creators[Math.floor(Math.random() * creators.length)];
      const author = creator;
      const permlink = `${title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-')}-${Date.now()}`;
      const description = descriptions[Math.floor(Math.random() * descriptions.length)];
      const body = description;
      const image = images[Math.floor(Math.random() * images.length)];
      const category = nouns[Math.floor(Math.random() * nouns.length)];
      const fundingGoal = Math.floor(Math.random() * 10000) + 1000;
      const raisedAmount = Math.floor(Math.random() * fundingGoal);
      const progress = Math.floor((raisedAmount / fundingGoal) * 100);
      const createdDate = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
      const isVerified = Math.random() > 0.7;
      const hasGovernance = Math.random() > 0.6;
      
      const hasRewards = Math.random() > 0.5;
      const rewards = hasRewards ? [
        {
          id: `reward-${id}-1`,
          projectId: id,
          title: "Early Supporter",
          name: "Early Supporter NFT",
          description: "Get exclusive access to project updates",
          image: "https://placehold.co/300x300/3a206e/e8b4b6?text=NFT",
          minContribution: 100,
          supply: 50,
          remaining: Math.floor(Math.random() * 50),
          blockchain: "hive" as "hive" | "ethereum" | "solana",
          price: `${Math.floor(Math.random() * 50) + 10} HIVE`,
          issuedCount: Math.floor(Math.random() * 25),
          totalSupply: 50,
          metadata: {
            attributes: [
              { trait_type: "Type", value: "Early Access" },
              { trait_type: "Rarity", value: "Common" }
            ],
            external_url: "https://example.com/nft/early-supporter"
          }
        }
      ] : [];
      
      return {
        id,
        title,
        creator,
        author,
        permlink,
        description,
        body,
        image,
        category,
        target: `${fundingGoal} HIVE`,
        raised: `${raisedAmount} HIVE`,
        progress,
        rewards,
        governanceEnabled: hasGovernance,
        verificationStatus: isVerified ? 'verified' : 'unverified',
        created: createdDate.toISOString(),
        createdAt: createdDate.toISOString(),
        contributors: [],
        status: progress >= 100 ? 'funded' : 'active',
        fundingGoal,
        currentFunding: raisedAmount,
        socialLinks: {
          website: "",
          twitter: "",
          discord: "",
          github: ""
        },
        backers: Math.floor(Math.random() * 30),
        daysLeft: Math.floor(Math.random() * 30) + 1,
        percentFunded: progress
      };
    });
  };

  const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 gradient-text">Explore Projects</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover innovative creators and become part of their journey on the Hive blockchain
          </p>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6 mb-10">
        <div className="hidden lg:block w-64 space-y-6">
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                  />
                  <Label 
                    htmlFor={`category-${category}`}
                    className="text-sm cursor-pointer"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="has-governance"
                  checked={selectedFilters.hasGovernance}
                  onCheckedChange={() => toggleFilter('hasGovernance')}
                />
                <Label 
                  htmlFor="has-governance"
                  className="text-sm cursor-pointer flex items-center"
                >
                  <Award className="h-3 w-3 mr-1" />
                  DAO Governance
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="has-nft-rewards"
                  checked={selectedFilters.hasNftRewards}
                  onCheckedChange={() => toggleFilter('hasNftRewards')}
                />
                <Label 
                  htmlFor="has-nft-rewards"
                  className="text-sm cursor-pointer flex items-center"
                >
                  <Gift className="h-3 w-3 mr-1" />
                  NFT Rewards
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="is-verified"
                  checked={selectedFilters.isVerified}
                  onCheckedChange={() => toggleFilter('isVerified')}
                />
                <Label 
                  htmlFor="is-verified"
                  className="text-sm cursor-pointer flex items-center"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified Projects
                </Label>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={clearFilters}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search projects..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={sortOption} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="most_funded">Most Funded</SelectItem>
                <SelectItem value="least_funded">Least Funded</SelectItem>
              </SelectContent>
            </Select>
            
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" className="md:hidden">
                  <ListFilter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                  <DrawerHeader>
                    <DrawerTitle>Filters</DrawerTitle>
                    <DrawerDescription>
                      Narrow down your project search
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4 pb-0">
                    <div className="mb-6">
                      <h3 className="text-sm font-medium mb-2">Categories</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map(category => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`drawer-category-${category}`}
                              checked={selectedCategories.includes(category)}
                              onCheckedChange={() => toggleCategory(category)}
                            />
                            <Label 
                              htmlFor={`drawer-category-${category}`}
                              className="text-sm cursor-pointer"
                            >
                              {category}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-sm font-medium mb-2">Features</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="drawer-has-governance"
                            checked={selectedFilters.hasGovernance}
                            onCheckedChange={() => toggleFilter('hasGovernance')}
                          />
                          <Label 
                            htmlFor="drawer-has-governance"
                            className="text-sm cursor-pointer flex items-center"
                          >
                            <Award className="h-3 w-3 mr-1" />
                            DAO Governance
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="drawer-has-nft-rewards"
                            checked={selectedFilters.hasNftRewards}
                            onCheckedChange={() => toggleFilter('hasNftRewards')}
                          />
                          <Label 
                            htmlFor="drawer-has-nft-rewards"
                            className="text-sm cursor-pointer flex items-center"
                          >
                            <Gift className="h-3 w-3 mr-1" />
                            NFT Rewards
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="drawer-is-verified"
                            checked={selectedFilters.isVerified}
                            onCheckedChange={() => toggleFilter('isVerified')}
                          />
                          <Label 
                            htmlFor="drawer-is-verified"
                            className="text-sm cursor-pointer flex items-center"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified Projects
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DrawerFooter>
                    <Button
                      onClick={clearFilters}
                      variant="outline"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                    <DrawerClose asChild>
                      <Button>Apply Filters</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>
          </div>

          {(selectedCategories.length > 0 || Object.values(selectedFilters).some(v => v)) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedCategories.map(category => (
                <Badge 
                  key={category}
                  variant="outline"
                  className="bg-purple-900/20 border-purple-900/40 flex items-center"
                >
                  {category}
                  <XCircle 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => toggleCategory(category)}
                  />
                </Badge>
              ))}
              
              {selectedFilters.hasGovernance && (
                <Badge 
                  variant="outline"
                  className="bg-blue-900/20 border-blue-900/40 flex items-center"
                >
                  <Award className="h-3 w-3 mr-1" />
                  DAO Governance
                  <XCircle 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => toggleFilter('hasGovernance')}
                  />
                </Badge>
              )}
              
              {selectedFilters.hasNftRewards && (
                <Badge 
                  variant="outline"
                  className="bg-green-900/20 border-green-900/40 flex items-center"
                >
                  <Gift className="h-3 w-3 mr-1" />
                  NFT Rewards
                  <XCircle 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => toggleFilter('hasNftRewards')}
                  />
                </Badge>
              )}
              
              {selectedFilters.isVerified && (
                <Badge 
                  variant="outline"
                  className="bg-amber-900/20 border-amber-900/40 flex items-center"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified Projects
                  <XCircle 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => toggleFilter('isVerified')}
                  />
                </Badge>
              )}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="h-16 w-16 rounded-full border-4 border-t-transparent border-primary animate-spin"></div>
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index % 6 * 0.1 }}
                >
                  <ProjectCard 
                    project={project} 
                    onClick={() => handleProjectClick(project)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="glass-card py-16 px-8 rounded-xl text-center">
              <XCircle className="h-16 w-16 mx-auto text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold mb-4">No Projects Found</h3>
              <p className="text-gray-400 mb-6">
                No projects match your current search criteria. Try adjusting your filters or search term.
              </p>
              <Button 
                onClick={clearFilters}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                Clear All Filters
              </Button>
            </div>
          )}
          
          {!isLoading && filteredProjects.length > 0 && (
            <div className="mt-10 text-center">
              <Button 
                className="gradient-border bg-accent/30 hover:bg-accent/50 px-6 py-3 rounded-lg text-white font-medium transition-all duration-300"
                onClick={() => navigate("/projects")}
              >
                View All Projects
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
