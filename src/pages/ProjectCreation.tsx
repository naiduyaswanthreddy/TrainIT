
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { getConnectedUsername } from "@/utils/hive/auth";
import { nanoid } from "nanoid";
import { FileUpload } from "@/components/project/FileUpload";
import { MilestoneInput } from "@/components/project/MilestoneInput";
import { ChevronRight, ChevronLeft, Save, AlertCircle, HelpCircle, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Milestone = {
  id: string;
  title: string;
  description: string;
  fundPercentage: number;
  deadline: Date | null;
};

type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  socialLink: string;
};

const ProjectCreation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basics");
  const [submitting, setSubmitting] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: nanoid(), title: "", description: "", fundPercentage: 20, deadline: null }
  ]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: nanoid(), name: "", role: "", bio: "", socialLink: "" }
  ]);
  
  const [formData, setFormData] = useState({
    // Basic Information
    title: "",
    shortDescription: "",
    category: "",
    tags: "",
    
    // Detailed Information
    fullDescription: "",
    problem: "",
    solution: "",
    targetAudience: "",
    
    // Funding Details
    fundingGoal: "",
    minContribution: "",
    deadline: "",
    tokenRewards: false,
    transparencyReports: true,
    
    // Smart Contract Options
    useSmartContracts: true,
    milestone1: { description: "", percentage: 20, deadline: "" },
    milestone2: { description: "", percentage: 40, deadline: "" },
    milestone3: { description: "", percentage: 40, deadline: "" },
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };
  
  const addMilestone = () => {
    if (milestones.length < 5) {
      setMilestones([
        ...milestones,
        { id: nanoid(), title: "", description: "", fundPercentage: 20, deadline: null }
      ]);
    } else {
      toast({
        title: "Maximum milestones reached",
        description: "You can add up to 5 milestones for your project",
        variant: "destructive",
      });
    }
  };
  
  const updateMilestone = (id: string, field: string, value: any) => {
    setMilestones(milestones.map(milestone =>
      milestone.id === id ? { ...milestone, [field]: value } : milestone
    ));
  };
  
  const removeMilestone = (id: string) => {
    if (milestones.length > 1) {
      setMilestones(milestones.filter(milestone => milestone.id !== id));
    } else {
      toast({
        title: "Cannot remove milestone",
        description: "Your project must have at least one milestone",
        variant: "destructive",
      });
    }
  };
  
  const addTeamMember = () => {
    if (teamMembers.length < 10) {
      setTeamMembers([
        ...teamMembers,
        { id: nanoid(), name: "", role: "", bio: "", socialLink: "" }
      ]);
    } else {
      toast({
        title: "Maximum team members reached",
        description: "You can add up to 10 team members for your project",
        variant: "destructive",
      });
    }
  };
  
  const updateTeamMember = (id: string, field: string, value: string) => {
    setTeamMembers(teamMembers.map(member =>
      member.id === id ? { ...member, [field]: value } : member
    ));
  };
  
  const removeTeamMember = (id: string) => {
    if (teamMembers.length > 1) {
      setTeamMembers(teamMembers.filter(member => member.id !== id));
    } else {
      toast({
        title: "Cannot remove team member",
        description: "Your project must have at least one team member",
        variant: "destructive",
      });
    }
  };
  
  const handleImageUpload = (imageUrl: string) => {
    setCoverImage(imageUrl);
  };
  
  const validateForm = () => {
    // Validate required fields
    if (!formData.title) {
      toast({
        title: "Missing project title",
        description: "Please provide a title for your project",
        variant: "destructive",
      });
      setActiveTab("basics");
      return false;
    }
    
    if (!formData.shortDescription) {
      toast({
        title: "Missing project description",
        description: "Please provide a short description for your project",
        variant: "destructive",
      });
      setActiveTab("basics");
      return false;
    }
    
    if (!formData.category) {
      toast({
        title: "Missing category",
        description: "Please select a category for your project",
        variant: "destructive",
      });
      setActiveTab("basics");
      return false;
    }
    
    if (!coverImage) {
      toast({
        title: "Missing cover image",
        description: "Please upload a cover image for your project",
        variant: "destructive",
      });
      setActiveTab("basics");
      return false;
    }
    
    if (!formData.fundingGoal || isNaN(parseFloat(formData.fundingGoal))) {
      toast({
        title: "Invalid funding goal",
        description: "Please enter a valid funding goal amount",
        variant: "destructive",
      });
      setActiveTab("funding");
      return false;
    }
    
    // Validate milestones
    const totalPercentage = milestones.reduce((sum, milestone) => sum + milestone.fundPercentage, 0);
    if (totalPercentage !== 100) {
      toast({
        title: "Invalid milestone allocation",
        description: "The sum of milestone percentages must equal 100%",
        variant: "destructive",
      });
      setActiveTab("milestones");
      return false;
    }
    
    const invalidMilestones = milestones.filter(m => !m.title || !m.description || !m.deadline);
    if (invalidMilestones.length > 0) {
      toast({
        title: "Incomplete milestones",
        description: "Please fill in all milestone details",
        variant: "destructive",
      });
      setActiveTab("milestones");
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is connected with wallet
    const username = getConnectedUsername();
    if (!username) {
      toast({
        title: "Authentication required",
        description: "Please connect your wallet to create a project",
        variant: "destructive",
      });
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Here we would normally submit to backend/blockchain
      // For now, we'll simulate it with a delay
      
      // Create a new project object
      const newProject = {
        id: nanoid(),
        title: formData.title,
        shortDescription: formData.shortDescription,
        fullDescription: formData.fullDescription,
        creator: username,
        image: coverImage,
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()),
        fundingGoal: parseFloat(formData.fundingGoal),
        minContribution: formData.minContribution ? parseFloat(formData.minContribution) : 1,
        progress: 0,
        raised: "0 HIVE",
        target: `${formData.fundingGoal} HIVE`,
        milestones: milestones,
        teamMembers: teamMembers,
        useSmartContracts: formData.useSmartContracts,
        tokenRewards: formData.tokenRewards,
        transparencyReports: formData.transparencyReports,
        createdAt: new Date().toISOString(),
        status: 'active'
      };
      
      // For demonstration, store in localStorage
      const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      storedProjects.push(newProject);
      localStorage.setItem('projects', JSON.stringify(storedProjects));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Project created successfully",
        description: "Your project has been published and is now live",
      });
      
      // Redirect to project page
      navigate(`/project/${newProject.id}`);
      
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Error creating project",
        description: "There was an error creating your project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  // Navigation between tabs
  const nextTab = () => {
    if (activeTab === "basics") setActiveTab("details");
    else if (activeTab === "details") setActiveTab("funding");
    else if (activeTab === "funding") setActiveTab("milestones");
    else if (activeTab === "milestones") setActiveTab("team");
  };
  
  const prevTab = () => {
    if (activeTab === "team") setActiveTab("milestones");
    else if (activeTab === "milestones") setActiveTab("funding");
    else if (activeTab === "funding") setActiveTab("details");
    else if (activeTab === "details") setActiveTab("basics");
  };
  
  return (
    <div className="container max-w-4xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold gradient-text mb-2">Create New Project</h1>
        <p className="text-gray-400 mb-8">
          Fill out the form below to create your crowdfunding project on CrowdHive.
        </p>
        
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 mb-8">
              <TabsTrigger value="basics">Basics</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="funding">Funding</TabsTrigger>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>
            
            {/* Basic Information Tab */}
            <TabsContent value="basics" className="space-y-6">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Provide the essential details about your project
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Project Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter a clear, attention-grabbing title"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="shortDescription">
                      Short Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="shortDescription"
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={handleInputChange}
                      placeholder="Brief summary of your project (50-150 characters)"
                      required
                      maxLength={150}
                    />
                    <div className="text-xs text-gray-400 text-right">
                      {formData.shortDescription.length}/150
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleSelectChange("category", value)}
                      required
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Art">Art</SelectItem>
                        <SelectItem value="Tech">Technology</SelectItem>
                        <SelectItem value="Community">Community</SelectItem>
                        <SelectItem value="Gaming">Gaming</SelectItem>
                        <SelectItem value="Environment">Environment</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Health">Health</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      placeholder="Enter tags separated by commas (e.g., blockchain, art, education)"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="coverImage">
                        Cover Image <span className="text-red-500">*</span>
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info size={16} className="text-gray-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-[250px] text-xs">
                              Upload a high-quality image that represents your project. Recommended size: 1200x630px.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FileUpload onImageUploaded={handleImageUpload} />
                    {coverImage && (
                      <div className="relative mt-2 overflow-hidden rounded-md">
                        <img 
                          src={coverImage} 
                          alt="Project cover" 
                          className="w-full h-48 object-cover rounded-md" 
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => setCoverImage(null)}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button 
                    type="button" 
                    onClick={nextTab}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    Next Step <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Detailed Information Tab */}
            <TabsContent value="details" className="space-y-6">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                  <CardDescription>
                    Provide comprehensive information about your project
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullDescription">Full Description</Label>
                    <Textarea
                      id="fullDescription"
                      name="fullDescription"
                      value={formData.fullDescription}
                      onChange={handleInputChange}
                      placeholder="Provide a detailed description of your project"
                      className="min-h-32"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="problem">Problem Statement</Label>
                    <Textarea
                      id="problem"
                      name="problem"
                      value={formData.problem}
                      onChange={handleInputChange}
                      placeholder="What problem does your project solve?"
                      className="min-h-20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="solution">Solution</Label>
                    <Textarea
                      id="solution"
                      name="solution"
                      value={formData.solution}
                      onChange={handleInputChange}
                      placeholder="How does your project solve this problem?"
                      className="min-h-20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="targetAudience">Target Audience</Label>
                    <Textarea
                      id="targetAudience"
                      name="targetAudience"
                      value={formData.targetAudience}
                      onChange={handleInputChange}
                      placeholder="Who will benefit from your project?"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={prevTab}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous Step
                  </Button>
                  <Button 
                    type="button" 
                    onClick={nextTab}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    Next Step <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Funding Details Tab */}
            <TabsContent value="funding" className="space-y-6">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Funding Details</CardTitle>
                  <CardDescription>
                    Set your funding goals and options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fundingGoal">
                      Funding Goal (HIVE) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fundingGoal"
                      name="fundingGoal"
                      type="number"
                      value={formData.fundingGoal}
                      onChange={handleInputChange}
                      placeholder="Enter your funding goal in HIVE"
                      required
                      min="1"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="minContribution">
                      Minimum Contribution (HIVE)
                    </Label>
                    <Input
                      id="minContribution"
                      name="minContribution"
                      type="number"
                      value={formData.minContribution}
                      onChange={handleInputChange}
                      placeholder="Default: 1 HIVE"
                      min="0.01"
                      step="0.01"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="deadline">
                      Funding Deadline
                    </Label>
                    <Input
                      id="deadline"
                      name="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="useSmartContracts">Use Smart Contracts</Label>
                        <p className="text-sm text-gray-400">
                          Enable blockchain-based smart contracts for transparent fund management
                        </p>
                      </div>
                      <Switch
                        id="useSmartContracts"
                        checked={formData.useSmartContracts}
                        onCheckedChange={(checked) => handleSwitchChange("useSmartContracts", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="tokenRewards">Token Rewards</Label>
                        <p className="text-sm text-gray-400">
                          Offer token rewards to backers based on contribution level
                        </p>
                      </div>
                      <Switch
                        id="tokenRewards"
                        checked={formData.tokenRewards}
                        onCheckedChange={(checked) => handleSwitchChange("tokenRewards", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="transparencyReports">Transparency Reports</Label>
                        <p className="text-sm text-gray-400">
                          Commit to providing regular transparency reports on fund usage
                        </p>
                      </div>
                      <Switch
                        id="transparencyReports"
                        checked={formData.transparencyReports}
                        onCheckedChange={(checked) => handleSwitchChange("transparencyReports", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={prevTab}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous Step
                  </Button>
                  <Button 
                    type="button" 
                    onClick={nextTab}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    Next Step <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Milestones Tab */}
            <TabsContent value="milestones" className="space-y-6">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Project Milestones</CardTitle>
                  <CardDescription>
                    Define key milestones for your project. Each milestone releases a percentage of funds.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {milestones.map((milestone, index) => (
                    <MilestoneInput
                      key={milestone.id}
                      milestone={milestone}
                      index={index}
                      onUpdate={updateMilestone}
                      onRemove={removeMilestone}
                      isLast={index === milestones.length - 1}
                    />
                  ))}
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm">
                      Total allocation: <span className={milestones.reduce((sum, m) => sum + m.fundPercentage, 0) === 100 ? "text-green-500" : "text-red-500"}>
                        {milestones.reduce((sum, m) => sum + m.fundPercentage, 0)}%
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addMilestone}
                      disabled={milestones.length >= 5}
                    >
                      Add Milestone
                    </Button>
                  </div>
                  
                  {milestones.reduce((sum, m) => sum + m.fundPercentage, 0) !== 100 && (
                    <div className="flex items-center mt-2 p-3 bg-red-900/20 border border-red-900/30 rounded-md text-red-400 text-sm">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Milestone percentages must total exactly 100%
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={prevTab}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous Step
                  </Button>
                  <Button 
                    type="button" 
                    onClick={nextTab}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    Next Step <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Team Tab */}
            <TabsContent value="team" className="space-y-6">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Project Team</CardTitle>
                  <CardDescription>
                    Add information about your team members
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {teamMembers.map((member, index) => (
                    <div key={member.id} className="space-y-4 p-4 border border-gray-800 rounded-md">
                      <div className="flex justify-between items-center">
                        <h3 className="text-md font-medium">Team Member {index + 1}</h3>
                        {teamMembers.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeTeamMember(member.id)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`name-${member.id}`}>Name</Label>
                          <Input
                            id={`name-${member.id}`}
                            value={member.name}
                            onChange={(e) => updateTeamMember(member.id, "name", e.target.value)}
                            placeholder="Full Name"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`role-${member.id}`}>Role</Label>
                          <Input
                            id={`role-${member.id}`}
                            value={member.role}
                            onChange={(e) => updateTeamMember(member.id, "role", e.target.value)}
                            placeholder="e.g., Project Lead, Developer"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`bio-${member.id}`}>Short Bio</Label>
                        <Textarea
                          id={`bio-${member.id}`}
                          value={member.bio}
                          onChange={(e) => updateTeamMember(member.id, "bio", e.target.value)}
                          placeholder="Brief professional background"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`socialLink-${member.id}`}>Social Link</Label>
                        <Input
                          id={`socialLink-${member.id}`}
                          value={member.socialLink}
                          onChange={(e) => updateTeamMember(member.id, "socialLink", e.target.value)}
                          placeholder="LinkedIn, Twitter, or personal website"
                        />
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTeamMember}
                    disabled={teamMembers.length >= 10}
                    className="mt-4"
                  >
                    Add Team Member
                  </Button>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={prevTab}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous Step
                  </Button>
                  <Button 
                    type="submit"
                    disabled={submitting}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Project...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Create Project
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </motion.div>
    </div>
  );
};

export default ProjectCreation;
