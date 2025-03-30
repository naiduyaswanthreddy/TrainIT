import * as z from "zod";

export const CATEGORIES = [
  "Art",
  "Comics",
  "Community",
  "Crafts",
  "Dance",
  "Design",
  "Education",
  "Environment",
  "Fashion",
  "Film & Video",
  "Food",
  "Games",
  "Health",
  "Journalism",
  "Music",
  "Photography",
  "Publishing",
  "Technology",
  "Theater"
];

export const BLOCKCHAINS = [
  "Hive",
  "Ethereum",
  "Solana"
];

export const SDG_GOALS = [
  "No Poverty",
  "Zero Hunger",
  "Good Health and Well-being",
  "Quality Education",
  "Gender Equality",
  "Clean Water and Sanitation",
  "Affordable and Clean Energy",
  "Decent Work and Economic Growth",
  "Industry, Innovation and Infrastructure",
  "Reduced Inequality",
  "Sustainable Cities and Communities",
  "Responsible Consumption and Production",
  "Climate Action",
  "Life Below Water",
  "Life on Land",
  "Peace, Justice and Strong Institutions",
  "Partnerships for the Goals"
];

// Schema for subscription tiers
const subscriptionTierSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  price: z.number().min(1, "Price must be at least 1"),
  currency: z.string(),
  benefits: z.array(z.string()),
  duration: z.enum(["monthly", "annual"])
});

// Schema for NFT rewards
const nftRewardSchemaObject = z.object({
  id: z.string(),
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  image: z.string(),
  supply: z.number().min(1, "Supply must be at least 1"),
  remaining: z.number(),
  minContribution: z.number().min(1, "Minimum contribution must be at least 1"),
  blockchain: z.enum(["hive", "ethereum", "solana"]),
  metadata: z.object({
    attributes: z.array(z.object({
      trait_type: z.string(),
      value: z.string()
    })).optional(),
    external_url: z.string().optional(),
    animation_url: z.string().optional()
  })
});

// Schema for project milestones
const projectMilestoneSchema = z.object({
  id: z.string(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  fundingRequired: z.number().min(1, "Funding required must be at least 1"),
  completionDate: z.string(),
  status: z.enum(["pending", "active", "completed", "failed"])
});

// Schema for project impact metrics
const projectImpactMetricsSchema = z.object({
  transparencyScore: z.number().min(0).max(100).optional(),
  milestoneCompletionRate: z.number().min(0).max(100).optional(),
  backerSatisfactionScore: z.number().min(0).max(100).optional(),
  communityEngagement: z.number().min(0).max(100).optional(),
  socialImpactCategory: z.string().optional(),
  impactEvidence: z.array(z.string()).optional(),
  sdgGoals: z.array(z.string()).optional()
});

export const projectSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be less than 100 characters"),
  category: z.string().min(1, "Please select a category"),
  fundingGoal: z.string().min(1, "Please enter a funding goal"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  coverImage: z.string().optional(),
  socialLinks: z.object({
    website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    twitter: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    discord: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    github: z.string().url("Please enter a valid URL").optional().or(z.literal(""))
  }).transform(data => ({
    website: data.website || "",
    twitter: data.twitter || "",
    discord: data.discord || "",
    github: data.github || ""
  })),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  }),
  enableSubscription: z.boolean().optional(),
  subscriptionTiers: z.array(subscriptionTierSchema).optional(),
  enableMultiChain: z.boolean().optional(),
  supportedBlockchains: z.array(z.string()).optional(),
  enableDao: z.boolean().optional(),
  enableNftRewards: z.boolean().optional(),
  nftRewards: z.array(nftRewardSchemaObject).optional(),
  milestones: z.array(projectMilestoneSchema).optional(),
  impactMetrics: projectImpactMetricsSchema.optional()
});

export const FORM_STEPS = [
  { title: "Basic Info", description: "Project title and category" },
  { title: "Description", description: "Detailed information about your project" },
  { title: "Funding", description: "Set your funding goal and milestones" },
  { title: "NFT Rewards", description: "Create exclusive NFTs for backers" },
  { title: "Media", description: "Upload images and videos" },
  { title: "Links", description: "Add your social media links" },
  { title: "Review", description: "Review and publish your project" }
];

export type ProjectFormValues = z.infer<typeof projectSchema>;

// Subscription schema for subscription-based crowdfunding
export const subscriptionSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  price: z.number().min(1, "Price must be at least 1"),
  currency: z.string(),
  benefits: z.array(z.string()),
  duration: z.enum(["monthly", "annual"])
});

export type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;

// NFT Reward schema
export const nftRewardSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  image: z.string(),
  supply: z.number().min(1, "Supply must be at least 1"),
  minContribution: z.number().min(1, "Minimum contribution must be at least 1"),
  blockchain: z.enum(["hive", "ethereum", "solana"])
});

export type NFTRewardFormValues = z.infer<typeof nftRewardSchema>;

// DAO Governance proposal schema
export const governanceProposalSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  options: z.array(z.string()).min(2, "At least 2 options are required"),
  duration: z.number().min(1, "Duration must be at least 1 day")
});

export type GovernanceProposalFormValues = z.infer<typeof governanceProposalSchema>;
