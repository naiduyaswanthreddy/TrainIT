
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ProjectFormValues, CATEGORIES } from "../project-form-schema";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface BasicInfoStepProps {
  form: UseFormReturn<ProjectFormValues>;
}

export function BasicInfoStep({ form }: BasicInfoStepProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Project Basics</h3>
      <p className="text-gray-400 text-sm">Let's start with the fundamentals of your project.</p>
      
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Project Title <span className="text-red-500 ml-1">*</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 ml-1 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>A clear, catchy name for your project (5-100 characters)</p>
                </TooltipContent>
              </Tooltip>
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter a clear, specific title" 
                {...field} 
                className="bg-background/50"
              />
            </FormControl>
            <FormDescription>
              Make it catchy, clear, and memorable (5-100 characters)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Project Category <span className="text-red-500 ml-1">*</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 ml-1 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select a category that best represents your project</p>
                </TooltipContent>
              </Tooltip>
            </FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Choose the category that best fits your project
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
