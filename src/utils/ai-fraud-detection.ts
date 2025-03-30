
import { HiveProject } from "./hive/types";

/**
 * AI-powered fraud detection for project screening
 * In a real implementation, this would use AI models to analyze projects
 * For now, we'll implement a rule-based system as a demonstration
 */

// Risk factors
const HIGH_RISK_KEYWORDS = [
  'guaranteed returns', 
  'risk-free investment', 
  'get rich quick', 
  'double your money', 
  'limited time offer',
  'secret investment',
  'exclusive opportunity',
  'revolutionary algorithm',
  'financial freedom',
  'passive income',
  'money making scheme',
  'investment opportunity',
  'no risk',
  'guaranteed profit',
  '100% secure',
  'hidden strategy',
  'insider information',
  'secret formula',
  'instant results'
];

const MEDIUM_RISK_KEYWORDS = [
  'huge profits',
  'massive returns',
  'incredible opportunity',
  'amazing results',
  'revolutionary',
  'ground-breaking',
  'life-changing',
  'exponential growth',
  'minimal effort',
  'quick returns',
  'exclusive access',
  'proprietary system',
  'breakthrough',
  'high returns',
  'once in a lifetime'
];

// Scan a project for potential fraud indicators
export const scanProjectForFraud = (project: HiveProject): {
  riskScore: number;
  flags: string[];
  recommendation: 'approve' | 'review' | 'reject';
  aiConfidence: number;
  riskFactors: {
    category: string;
    score: number;
    explanation: string;
  }[];
} => {
  let riskScore = 0;
  const flags: string[] = [];
  const riskFactors: {
    category: string;
    score: number;
    explanation: string;
  }[] = [];
  
  // Check for suspicious content in the project
  const projectText = `${project.title} ${project.body}`.toLowerCase();
  
  // Check for high-risk keywords
  HIGH_RISK_KEYWORDS.forEach(keyword => {
    if (projectText.includes(keyword.toLowerCase())) {
      const addedScore = 15;
      riskScore += addedScore;
      flags.push(`High-risk keyword detected: "${keyword}"`);
      
      riskFactors.push({
        category: 'Language',
        score: addedScore,
        explanation: `Contains suspicious phrase: "${keyword}"`
      });
    }
  });
  
  // Check for medium-risk keywords
  MEDIUM_RISK_KEYWORDS.forEach(keyword => {
    if (projectText.includes(keyword.toLowerCase())) {
      const addedScore = 5;
      riskScore += addedScore;
      flags.push(`Medium-risk keyword detected: "${keyword}"`);
      
      riskFactors.push({
        category: 'Language',
        score: addedScore,
        explanation: `Contains potentially misleading phrase: "${keyword}"`
      });
    }
  });
  
  // Check for excessively short or vague descriptions
  if (project.body.length < 200) {
    const addedScore = 20;
    riskScore += addedScore;
    flags.push("Unusually short project description");
    
    riskFactors.push({
      category: 'Content',
      score: addedScore,
      explanation: 'Project description is too short to provide adequate information'
    });
  }
  
  // Check for recently created accounts
  const accountAge = calculateAccountAge(project.author);
  if (accountAge < 30) { // Less than 30 days
    const addedScore = 15;
    riskScore += addedScore;
    flags.push("Recently created account");
    
    riskFactors.push({
      category: 'Account',
      score: addedScore,
      explanation: 'Account is less than 30 days old'
    });
  }
  
  // Check for lack of social media links or website
  let metadata;
  try {
    metadata = typeof project.json_metadata === 'string' 
      ? JSON.parse(project.json_metadata) 
      : project.json_metadata;
    
    const socialLinks = metadata?.crowdhive?.socialLinks || {};
    
    if (!socialLinks.website && !socialLinks.twitter && !socialLinks.discord && !socialLinks.github) {
      const addedScore = 10;
      riskScore += addedScore;
      flags.push("No social media or website links provided");
      
      riskFactors.push({
        category: 'Verification',
        score: addedScore,
        explanation: 'Project lacks social media presence or website for verification'
      });
    }
  } catch (e) {
    // If we can't parse the metadata, consider it a risk factor
    const addedScore = 5;
    riskScore += addedScore;
    flags.push("Invalid metadata format");
    
    riskFactors.push({
      category: 'Technical',
      score: addedScore,
      explanation: 'Project metadata is malformed or missing'
    });
  }
  
  // Check for unrealistic funding goals
  const fundingGoal = metadata?.crowdhive?.fundingGoal || 0;
  if (fundingGoal > 100000) {
    const addedScore = 10;
    riskScore += addedScore;
    flags.push("Unusually high funding goal");
    
    riskFactors.push({
      category: 'Financial',
      score: addedScore,
      explanation: 'Funding goal is unrealistically high'
    });
  }
  
  // Check for excessive promises in the content
  const promiseCount = countPromises(projectText);
  if (promiseCount > 5) {
    const addedScore = 10;
    riskScore += addedScore;
    flags.push("Excessive promises detected");
    
    riskFactors.push({
      category: 'Content',
      score: addedScore,
      explanation: 'Project makes an unusually high number of promises'
    });
  }
  
  // Determine recommendation based on risk score
  let recommendation: 'approve' | 'review' | 'reject' = 'approve';
  if (riskScore >= 50) {
    recommendation = 'reject';
  } else if (riskScore >= 20) {
    recommendation = 'review';
  }
  
  // Calculate AI confidence level (simulated)
  const aiConfidence = Math.min(100, Math.max(60, 100 - (flags.length * 5)));
  
  return {
    riskScore: Math.min(riskScore, 100), // Cap at 100
    flags,
    recommendation,
    aiConfidence,
    riskFactors
  };
};

// Analyze project content for sentiment and quality
export const analyzeProjectContent = (content: string): {
  qualityScore: number;
  sentimentScore: number;
  suggestions: string[];
  readabilityScore: number;
  technicalComplexity: number;
  keyTopics: string[];
} => {
  // In a real implementation, this would use NLP/AI to analyze the content
  // For now, we'll use simple heuristics
  
  const wordCount = content.split(/\s+/).length;
  const sentences = content.split(/[.!?]+/).length;
  const avgSentenceLength = wordCount / (sentences || 1);
  
  let qualityScore = 50; // Default middle score
  const suggestions: string[] = [];
  
  // Check content length
  if (wordCount < 100) {
    qualityScore -= 20;
    suggestions.push("Content is too short. Add more details about your project.");
  } else if (wordCount > 500) {
    qualityScore += 20;
  }
  
  // Check average sentence length
  if (avgSentenceLength > 25) {
    qualityScore -= 10;
    suggestions.push("Sentences are too long. Try to break up complex ideas into shorter sentences.");
  }
  
  // Check for formatting elements
  if (!content.includes('#') && !content.includes('*')) {
    qualityScore -= 10;
    suggestions.push("Add formatting like headers (# Title) and emphasis (*italics* or **bold**) to improve readability.");
  }
  
  // Check for lists
  if (!content.includes('- ') && !content.includes('1. ')) {
    qualityScore -= 5;
    suggestions.push("Consider using bullet points or numbered lists to organize information.");
  }
  
  // Check for technical details and specificity
  const technicalTerms = [
    'blockchain', 'smart contract', 'nft', 'dao', 'token', 'defi', 'consensus', 
    'protocol', 'scaling', 'implementation', 'algorithm', 'security', 'authentication',
    'distributed', 'governance', 'mechanism', 'architecture', 'api', 'interface',
    'decentralized', 'immutable', 'layer 2', 'rollup', 'node', 'hash', 'encryption'
  ];
  
  let technicalCount = 0;
  technicalTerms.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    const matches = content.match(regex);
    if (matches) technicalCount += matches.length;
  });
  
  const technicalComplexity = Math.min(100, Math.max(0, technicalCount * 5));
  
  if (technicalCount < 3 && wordCount > 200) {
    qualityScore -= 10;
    suggestions.push("Add more technical details about how your project will be implemented.");
  } else if (technicalCount > 10) {
    qualityScore += 15;
  }
  
  // Sentiment analysis (very simplified)
  const positiveWords = ['amazing', 'great', 'excellent', 'innovative', 'revolutionary', 'exciting', 'opportunity', 'success', 'beneficial', 'efficient', 'sustainable', 'secure', 'transparent', 'reliable', 'scalable'];
  const negativeWords = ['problem', 'difficult', 'challenging', 'risk', 'failure', 'concern', 'issue', 'limitation', 'obstacle', 'drawback', 'expensive', 'complex', 'complicated', 'slow', 'insecure'];
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  const contentLower = content.toLowerCase();
  
  positiveWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = contentLower.match(regex);
    if (matches) positiveCount += matches.length;
  });
  
  negativeWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = contentLower.match(regex);
    if (matches) negativeCount += matches.length;
  });
  
  // Calculate sentiment score (0-100, where 50 is neutral)
  const totalSentimentWords = positiveCount + negativeCount;
  let sentimentScore = 50; // Neutral by default
  
  if (totalSentimentWords > 0) {
    sentimentScore = Math.min(100, Math.max(0, 50 + (positiveCount - negativeCount) / totalSentimentWords * 50));
  }
  
  // Balance between positive and negative
  if (sentimentScore > 80) {
    suggestions.push("Content may be overly positive. Consider addressing potential challenges for more balance.");
  } else if (sentimentScore < 30) {
    suggestions.push("Content seems negative. Try to focus more on solutions and positive aspects of your project.");
  }
  
  // Readability score (based on simplified Flesch-Kincaid)
  const readabilityScore = 100 - Math.min(100, Math.max(0, (avgSentenceLength * 10) / 15));
  
  if (readabilityScore < 60) {
    suggestions.push("Content may be difficult to read. Consider simplifying your language and shortening sentences.");
  }
  
  // Extract key topics (simplified version)
  const words = contentLower.split(/\s+/);
  const wordFrequency: Record<string, number> = {};
  const stopWords = ['the', 'a', 'an', 'and', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'this', 'that', 'these', 'those'];
  
  words.forEach(word => {
    word = word.replace(/[^a-z0-9]/gi, '');
    if (word.length < 3 || stopWords.includes(word)) return;
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });
  
  const keyTopics = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
  
  // Cap quality score between 0-100
  qualityScore = Math.min(100, Math.max(0, qualityScore));
  
  return {
    qualityScore,
    sentimentScore,
    suggestions,
    readabilityScore,
    technicalComplexity,
    keyTopics
  };
};

// Helper function to count promises in text
const countPromises = (text: string): number => {
  const promisePatterns = [
    'will provide', 'will offer', 'will enable', 'will allow', 'will help',
    'guarantees', 'promises', 'ensures', 'guaranteed to', 'promised to',
    'can expect', 'expect to', 'going to', 'plan to'
  ];
  
  let count = 0;
  promisePatterns.forEach(pattern => {
    const regex = new RegExp(pattern, 'gi');
    const matches = text.match(regex);
    if (matches) count += matches.length;
  });
  
  return count;
};

// Helper function to calculate account age in days
const calculateAccountAge = (username: string): number => {
  // In a real implementation, this would fetch the account creation date
  // For now, we'll return a random age between 1 and 1000 days
  return Math.floor(Math.random() * 1000) + 1;
};

// Enhanced AI fraud detection features
export const simulateDeepLearningDetection = (projectId: string, content: string): {
  fraudProbability: number;
  confidenceScore: number;
  detectionMethod: string;
  analysisTime: number;
} => {
  // This would use advanced machine learning models in a real implementation
  // For now, we'll simulate the detection
  
  // Calculate simulated fraud probability based on content length and keyword presence
  const contentLength = content.length;
  let baseProbability = Math.random() * 20; // Base random probability up to 20%
  
  // Longer content generally indicates more legitimate projects
  if (contentLength < 300) {
    baseProbability += 30;
  } else if (contentLength < 1000) {
    baseProbability += 10;
  } else if (contentLength > 3000) {
    baseProbability -= 10;
  }
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    'guaranteed', 'risk-free', 'secret', 'exclusive', 'revolution', 'passive income',
    'get rich', 'easy money', 'opportunity', 'free', 'limited time', 'instant'
  ];
  
  suspiciousPatterns.forEach(pattern => {
    if (content.toLowerCase().includes(pattern)) {
      baseProbability += 5;
    }
  });
  
  // Cap the probability at 95%
  const fraudProbability = Math.min(95, Math.max(5, baseProbability));
  
  // Simulate confidence score
  const confidenceScore = Math.min(98, 100 - (Math.random() * 30));
  
  // Determine detection method based on fraud probability
  let detectionMethod = '';
  if (fraudProbability > 70) {
    detectionMethod = 'Neural Network + Pattern Recognition';
  } else if (fraudProbability > 40) {
    detectionMethod = 'Natural Language Processing + Semantic Analysis';
  } else {
    detectionMethod = 'Statistical Analysis + Historical Data Comparison';
  }
  
  // Simulate analysis time (faster for more obvious cases)
  const analysisTime = fraudProbability > 60 ? 0.8 : 2.3;
  
  return {
    fraudProbability,
    confidenceScore,
    detectionMethod,
    analysisTime
  };
};

// Analyze project team credibility
export const analyzeTeamCredibility = (
  teamMembers: Array<{
    username: string;
    role: string;
    bio: string;
    socialLinks?: Record<string, string>;
  }>
): {
  credibilityScore: number;
  flags: string[];
  suggestions: string[];
} => {
  // In a real implementation, this would check team members' history and credibility
  // For now, we'll use basic heuristics
  
  let credibilityScore = 50;
  const flags: string[] = [];
  const suggestions: string[] = [];
  
  // Check if team has enough members
  if (teamMembers.length < 2) {
    credibilityScore -= 20;
    flags.push("Too few team members");
    suggestions.push("Add more team members to increase project credibility");
  }
  
  // Check if team has diverse roles
  const roles = new Set(teamMembers.map(member => member.role.toLowerCase()));
  if (roles.size < 2) {
    credibilityScore -= 10;
    flags.push("Lack of role diversity");
    suggestions.push("Ensure team has diverse skills (technical, business, etc.)");
  }
  
  // Check for complete bios and social links
  let incompleteBios = 0;
  let missingLinks = 0;
  
  teamMembers.forEach(member => {
    if (!member.bio || member.bio.length < 50) incompleteBios++;
    if (!member.socialLinks || Object.keys(member.socialLinks).length < 1) missingLinks++;
  });
  
  if (incompleteBios > 0) {
    credibilityScore -= 5 * incompleteBios;
    flags.push(`${incompleteBios} team member(s) have incomplete bios`);
    suggestions.push("Provide detailed bios for all team members");
  }
  
  if (missingLinks > 0) {
    credibilityScore -= 5 * missingLinks;
    flags.push(`${missingLinks} team member(s) have no social or professional links`);
    suggestions.push("Add LinkedIn, GitHub, or other professional links for verification");
  }
  
  // Cap credibility score
  credibilityScore = Math.min(100, Math.max(0, credibilityScore));
  
  return {
    credibilityScore,
    flags,
    suggestions
  };
};

// Generate report for moderators
export const generateFraudDetectionReport = (
  projectId: string, 
  riskScore: number, 
  flags: string[],
  deepLearningResults: {
    fraudProbability: number;
    confidenceScore: number;
    detectionMethod: string;
  }
): string => {
  const timestamp = new Date().toISOString();
  const reportId = `REPORT-${projectId.substring(0, 8)}-${Date.now().toString(36)}`;
  
  // Risk level categorization
  let riskLevel = 'Low';
  if (riskScore > 70) riskLevel = 'High';
  else if (riskScore > 30) riskLevel = 'Medium';
  
  // Generate colored ASCII risk visualization
  const riskBar = `[${'-'.repeat(Math.floor(riskScore / 10))}${' '.repeat(10 - Math.floor(riskScore / 10))}] ${riskScore}/100`;
  
  return `
Fraud Detection Report
=====================
Report ID: ${reportId}
Generated: ${timestamp}
Project ID: ${projectId}

Risk Assessment
--------------
Risk Score: ${riskScore}/100 (${riskLevel} Risk)
Risk Visualization: ${riskBar}
AI Confidence: ${deepLearningResults.confidenceScore.toFixed(2)}%
Detection Method: ${deepLearningResults.detectionMethod}
Fraud Probability: ${deepLearningResults.fraudProbability.toFixed(2)}%

Risk Flags (${flags.length})
-----------
${flags.map((flag, i) => `${i + 1}. ${flag}`).join('\n')}

Recommendation
-------------
${riskScore > 70 ? 'REJECT: This project shows multiple high-risk indicators and should be rejected.' :
  riskScore > 30 ? 'REVIEW: This project shows some risk indicators and requires manual review.' :
  'APPROVE: This project appears legitimate based on automated screening.'}

Notes for Moderators
-------------------
- Verify identity of project creator if possible
- Check for similar projects that may indicate copy-paste fraud
- Review project goals and funding targets for realism
- Examine creator's transaction history if available
`;
};
