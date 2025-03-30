import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Lightbulb, BarChart2, AlertTriangle, Check } from "lucide-react";
import { analyzeProjectContent } from "@/utils/ai-fraud-detection";

interface ContentAnalysisProps {
  content: string;
  onSuggestionAccept?: (improvedContent: string) => void;
}

type AnalysisResult = {
  qualityScore: number;
  sentimentScore: number;
  suggestions: string[];
} | null;

export function ContentAnalysis({ content, onSuggestionAccept }: ContentAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult>(null);
  
  useEffect(() => {
    if (content.length > 50) {
      setIsAnalyzing(true);
      
      // Artificial delay to simulate AI processing
      const timer = setTimeout(() => {
        const result = analyzeProjectContent(content);
        setAnalysis(result);
        setIsAnalyzing(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    } else {
      setAnalysis(null);
    }
  }, [content]);
  
  const getQualityScoreColor = (score: number) => {
    if (score >= 70) return "text-green-400";
    if (score >= 40) return "text-amber-400";
    return "text-red-400";
  };
  
  const getSentimentScoreLabel = (score: number) => {
    if (score >= 75) return "Very Positive";
    if (score >= 60) return "Positive";
    if (score >= 40) return "Neutral";
    if (score >= 25) return "Negative";
    return "Very Negative";
  };
  
  const getSentimentScoreColor = (score: number) => {
    if (score >= 75) return "text-green-400";
    if (score >= 60) return "text-emerald-400";
    if (score >= 40) return "text-blue-400";
    if (score >= 25) return "text-amber-400";
    return "text-red-400";
  };
  
  const getProgressColor = (score: number) => {
    if (score >= 70) return "bg-green-500";
    if (score >= 40) return "bg-amber-500";
    return "bg-red-500";
  };
  
  if (!content || content.length < 50) {
    return null;
  }
  
  return (
    <div className="mt-4 p-3 bg-secondary/20 rounded-lg border border-gray-800">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="h-4 w-4 text-blue-400" />
        <h4 className="text-sm font-medium">AI-Powered Content Analysis</h4>
      </div>
      
      {isAnalyzing ? (
        <div className="flex flex-col items-center justify-center py-3">
          <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mb-2"></div>
          <p className="text-xs text-gray-400">Analyzing your description...</p>
        </div>
      ) : analysis ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Quality Score</span>
                <span className={`text-xs font-medium ${getQualityScoreColor(analysis.qualityScore)}`}>
                  {analysis.qualityScore}/100
                </span>
              </div>
              <Progress 
                value={analysis.qualityScore} 
                className="h-1.5"
                indicatorClassName={getProgressColor(analysis.qualityScore)}
              />
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Sentiment</span>
                <span className={`text-xs font-medium ${getSentimentScoreColor(analysis.sentimentScore)}`}>
                  {getSentimentScoreLabel(analysis.sentimentScore)}
                </span>
              </div>
              <Progress 
                value={analysis.sentimentScore} 
                className="h-1.5"
                indicatorClassName="bg-blue-500"
              />
            </div>
          </div>
          
          {analysis.suggestions.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-xs font-medium flex items-center">
                <BarChart2 className="h-3 w-3 mr-1 text-amber-400" />
                Improvement Suggestions
              </h5>
              <ul className="space-y-1.5">
                {analysis.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-xs flex items-start gap-1.5">
                    <AlertTriangle className="h-3 w-3 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {analysis.qualityScore < 60 && onSuggestionAccept && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs w-full mt-2"
              onClick={() => {
                const improvedContent = `# ${content.split('\n')[0] || 'Project Description'}

## Overview
${content}

## Key Features
- Feature 1
- Feature 2
- Feature 3

## Timeline
1. First milestone
2. Second milestone
3. Final delivery

*Thank you for considering our project!*
`;
                onSuggestionAccept(improvedContent);
              }}
            >
              <Check className="h-3 w-3 mr-1" />
              Apply AI Improvements
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
}
