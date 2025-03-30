
import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ProjectFormValues } from "../project-form-schema";
import { ContentAnalysis } from "./ContentAnalysis";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface DescriptionStepProps {
  form: UseFormReturn<ProjectFormValues>;
}

export function DescriptionStep({ form }: DescriptionStepProps) {
  const description = form.watch("description");
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Project Description</h3>
      <p className="text-gray-400 text-sm">
        Provide a detailed description of your project. Be clear about your goals and how you plan to achieve them.
      </p>
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Description <span className="text-red-500 ml-1">*</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 ml-1 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Explain your project goals, vision, and plans in detail (at least 50 characters)</p>
                </TooltipContent>
              </Tooltip>
            </FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe your project in detail..." 
                className="min-h-[200px] bg-background/50"
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Use markdown formatting for better presentation. Minimum 50 characters required.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Character count and requirements */}
      <div className="flex justify-between text-sm text-gray-400">
        <span>Min: 50 characters</span>
        <span className={`${description.length < 50 ? "text-red-400" : "text-green-400"}`}>
          Current: {description.length} characters
        </span>
      </div>
      
      {/* AI-powered content analysis */}
      <ContentAnalysis 
        content={description} 
        onSuggestionAccept={(improvedContent) => {
          form.setValue("description", improvedContent);
        }}
      />
      
      <div className="p-4 rounded-lg bg-secondary/30 border border-gray-800">
        <h4 className="text-sm font-medium mb-2">Markdown Formatting Tips</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-gray-400 mb-1">Headers</p>
            <pre className="text-xs bg-gray-800 p-1 rounded"># Main Header</pre>
            <pre className="text-xs bg-gray-800 p-1 rounded mt-1">## Subheader</pre>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Emphasis</p>
            <pre className="text-xs bg-gray-800 p-1 rounded">*italic* or **bold**</pre>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Lists</p>
            <pre className="text-xs bg-gray-800 p-1 rounded">- Item 1{'\n'}- Item 2</pre>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Links</p>
            <pre className="text-xs bg-gray-800 p-1 rounded">[Link text](URL)</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
