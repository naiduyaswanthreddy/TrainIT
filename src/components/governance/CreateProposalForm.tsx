
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, X, Plus, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getConnectedUsername } from "@/utils/hive/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { format } from "date-fns";
import { nanoid } from "nanoid";

// Governance proposal schema
const proposalSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  endDate: z.date().min(new Date(), "End date must be in the future"),
  options: z.array(z.string()).min(2, "At least 2 options are required")
});

type ProposalFormValues = z.infer<typeof proposalSchema>;

interface CreateProposalFormProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  onProposalCreated?: (proposalId: string) => void;
}

export function CreateProposalForm({ projectId, isOpen, onClose, onProposalCreated }: CreateProposalFormProps) {
  const [options, setOptions] = useState<string[]>(["Yes", "No"]);
  const [newOption, setNewOption] = useState("");
  const { toast } = useToast();
  
  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      title: "",
      description: "",
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 7 days from now
      options: ["Yes", "No"]
    }
  });
  
  const addOption = () => {
    if (newOption.trim() && !options.includes(newOption.trim())) {
      const updatedOptions = [...options, newOption.trim()];
      setOptions(updatedOptions);
      form.setValue("options", updatedOptions);
      setNewOption("");
    }
  };
  
  const removeOption = (index: number) => {
    if (options.length <= 2) {
      toast({
        title: "Cannot remove option",
        description: "At least 2 options are required for a proposal",
        variant: "destructive"
      });
      return;
    }
    
    const updatedOptions = [...options];
    updatedOptions.splice(index, 1);
    setOptions(updatedOptions);
    form.setValue("options", updatedOptions);
  };
  
  const onSubmit = async (data: ProposalFormValues) => {
    const username = getConnectedUsername();
    
    if (!username) {
      toast({
        title: "Authentication Required",
        description: "Please connect your Hive wallet to create a proposal",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Create a new governance proposal
      const proposalId = nanoid();
      
      // Mock proposal creation - in a real app, this would be stored on-chain
      const newProposal = {
        id: proposalId,
        projectId,
        title: data.title,
        description: data.description,
        options: data.options,
        startDate: new Date().toISOString(),
        endDate: data.endDate.toISOString(),
        status: 'active',
        creatorId: username
      };
      
      // Store the proposal (in a real app, this would interact with the blockchain)
      const storedProposals = JSON.parse(localStorage.getItem('governanceProposals') || '[]');
      storedProposals.push(newProposal);
      localStorage.setItem('governanceProposals', JSON.stringify(storedProposals));
      
      toast({
        title: "Proposal created",
        description: "Your governance proposal has been created successfully",
      });
      
      // Reset form and close dialog
      form.reset();
      onClose();
      
      // Notify parent component if callback provided
      if (onProposalCreated) {
        onProposalCreated(proposalId);
      }
      
    } catch (error: any) {
      console.error("Error creating proposal:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create proposal",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-400" />
            Create Governance Proposal
          </DialogTitle>
          <DialogDescription>
            Create a new proposal for project stakeholders to vote on.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proposal Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a clear, descriptive title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the proposal in detail" 
                      className="min-h-32 resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Voting End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="pl-3 text-left font-normal"
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <FormLabel>Voting Options</FormLabel>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input 
                      value={option}
                      onChange={(e) => {
                        const updatedOptions = [...options];
                        updatedOptions[index] = e.target.value;
                        setOptions(updatedOptions);
                        form.setValue("options", updatedOptions);
                      }}
                      className="flex-grow"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(index)}
                      disabled={options.length <= 2}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                <Input 
                  placeholder="Add new option"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  className="flex-grow"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                  disabled={!newOption.trim()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                Create Proposal
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
