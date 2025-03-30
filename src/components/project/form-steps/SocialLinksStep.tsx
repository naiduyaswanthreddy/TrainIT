
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ProjectFormValues } from "../project-form-schema";
import { HelpCircle, Globe, Twitter, Github, MessageSquare } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SocialLinksStepProps {
  form: UseFormReturn<ProjectFormValues>;
}

export function SocialLinksStep({ form }: SocialLinksStepProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Social Links</h3>
      <p className="text-gray-400 text-sm">Add links to your website and social media profiles. These help backers verify your identity and learn more about your work.</p>
      
      <FormField
        control={form.control}
        name="socialLinks.website"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              <Globe className="h-4 w-4 mr-2 text-blue-400" />
              Website
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 ml-1 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Your project or personal website (optional but recommended)</p>
                </TooltipContent>
              </Tooltip>
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="https://yourwebsite.com" 
                {...field} 
                className="bg-background/50"
              />
            </FormControl>
            <FormDescription>
              Your project's website or personal site (optional)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="socialLinks.twitter"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              <Twitter className="h-4 w-4 mr-2 text-blue-400" />
              Twitter
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="https://twitter.com/yourusername" 
                {...field} 
                className="bg-background/50"
              />
            </FormControl>
            <FormDescription>
              Your Twitter profile (optional)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="socialLinks.discord"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2 text-indigo-400" />
              Discord
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="https://discord.gg/invite" 
                {...field} 
                className="bg-background/50"
              />
            </FormControl>
            <FormDescription>
              Your Discord server invite link (optional)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="socialLinks.github"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              <Github className="h-4 w-4 mr-2 text-gray-400" />
              GitHub
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="https://github.com/yourusername" 
                {...field} 
                className="bg-background/50"
              />
            </FormControl>
            <FormDescription>
              Your GitHub profile or project repository (optional)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="p-4 rounded-lg bg-secondary/30 border border-gray-800 mt-6">
        <h4 className="text-sm font-medium mb-2">Why add social links?</h4>
        <p className="text-sm text-gray-400">
          Including your social profiles helps build trust with potential backers. Projects with verified social links typically receive more funding.
        </p>
      </div>
    </div>
  );
}
