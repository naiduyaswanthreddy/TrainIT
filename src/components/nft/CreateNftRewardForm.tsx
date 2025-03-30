
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Gift, Plus, X } from "lucide-react";
import { createNftReward } from "@/utils/hive/nft";
import { getConnectedUsername } from "@/utils/hive/auth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface CreateNftRewardFormProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  onRewardCreated?: () => void;
}

const nftRewardSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  image: z.string().url("Please enter a valid image URL"),
  minContribution: z.preprocess(
    (a) => parseFloat(z.string().parse(a)), 
    z.number().positive("Minimum contribution must be positive")
  ),
  totalSupply: z.preprocess(
    (a) => parseInt(z.string().parse(a)), 
    z.number().int().positive("Total supply must be a positive integer")
  ),
  blockchain: z.enum(["hive", "ethereum", "solana"])
});

type NftRewardFormValues = z.infer<typeof nftRewardSchema>;

export function CreateNftRewardForm({ projectId, isOpen, onClose, onRewardCreated }: CreateNftRewardFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<NftRewardFormValues>({
    resolver: zodResolver(nftRewardSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      minContribution: 10,
      totalSupply: 100,
      blockchain: "hive"
    }
  });
  
  const onSubmit = async (data: NftRewardFormValues) => {
    const username = getConnectedUsername();
    
    if (!username) {
      toast({
        title: "Authentication Required",
        description: "Please connect your Hive wallet to create an NFT reward",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create the NFT reward with the correct parameters to match the function signature
      // Updated to match the parameters expected by createNftReward
      await createNftReward(
        projectId,
        data.title,
        data.description,
        data.image,
        data.totalSupply,
        data.minContribution,
        data.blockchain,
        [] // Empty array for attributes
      );
      
      toast({
        title: "NFT Reward Created",
        description: "Your NFT reward has been created successfully",
      });
      
      // Reset form and close dialog
      form.reset();
      onClose();
      
      // Notify parent component
      if (onRewardCreated) {
        onRewardCreated();
      }
      
    } catch (error: any) {
      console.error("Error creating NFT reward:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create NFT reward",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const blockchainOptions = [
    { value: "hive", label: "Hive Blockchain" },
    { value: "ethereum", label: "Ethereum (Coming Soon)" },
    { value: "solana", label: "Solana (Coming Soon)" }
  ];
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-purple-400" />
            Create NFT Reward
          </DialogTitle>
          <DialogDescription>
            Create a new NFT reward for project backers.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reward Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Early Supporter Badge" {...field} />
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
                      placeholder="This exclusive NFT is awarded to early supporters of our project..." 
                      className="min-h-20 resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com/nft-image.jpg" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="minContribution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Contribution (HIVE)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1"
                        step="0.1"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="totalSupply"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Supply</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1"
                        step="1"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="blockchain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blockchain</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blockchain" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {blockchainOptions.map(option => (
                        <SelectItem 
                          key={option.value} 
                          value={option.value}
                          disabled={option.value !== "hive"}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Reward"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
