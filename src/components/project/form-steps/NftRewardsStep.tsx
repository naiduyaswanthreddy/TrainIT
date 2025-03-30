import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { ProjectFormValues, BLOCKCHAINS } from "../project-form-schema";
import { NftReward } from "@/utils/hive/types";
import { nanoid } from "nanoid";
import { Badge } from "@/components/ui/badge";
import { Camera, Plus, Trash2, Gift, ArrowRight } from "lucide-react";

interface NftRewardsStepProps {
  form: UseFormReturn<ProjectFormValues>;
}

interface FormNftReward {
  id: string;
  title: string;
  description: string;
  image: string;
  supply: number;
  remaining: number;
  minContribution: number;
  blockchain: "hive" | "ethereum" | "solana";
  metadata: {
    attributes?: Array<{trait_type: string, value: string}>;
    external_url?: string;
    animation_url?: string;
  };
}

export function NftRewardsStep({ form }: NftRewardsStepProps) {
  const [enableNftRewards, setEnableNftRewards] = useState(form.watch("enableNftRewards") || false);
  const nftRewards = form.watch("nftRewards") || [];

  const handleNftRewardsToggle = (checked: boolean) => {
    setEnableNftRewards(checked);
    form.setValue("enableNftRewards", checked);
    
    if (checked && (!nftRewards || nftRewards.length === 0)) {
      addNftReward();
    }
  };

  const addNftReward = () => {
    const newReward: FormNftReward = {
      id: nanoid(),
      title: `Backer NFT`,
      description: "Exclusive NFT for project backers",
      image: "",
      supply: 100,
      remaining: 100,
      minContribution: 10,
      blockchain: "hive",
      metadata: {
        attributes: [
          { trait_type: "Tier", value: "Supporter" }
        ]
      }
    };
    
    form.setValue("nftRewards", [...(nftRewards || []), newReward]);
  };

  const removeNftReward = (rewardId: string) => {
    const updatedRewards = nftRewards.filter(reward => reward.id !== rewardId);
    form.setValue("nftRewards", updatedRewards);
  };

  const handleImageUpload = (rewardId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        const updatedRewards = nftRewards.map(reward => {
          if (reward.id === rewardId) {
            return {
              ...reward,
              image: imageUrl
            };
          }
          return reward;
        });
        form.setValue("nftRewards", updatedRewards);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateNftField = (rewardId: string, field: keyof FormNftReward, value: any) => {
    const updatedRewards = nftRewards.map(reward => {
      if (reward.id === rewardId) {
        return {
          ...reward,
          [field]: value
        };
      }
      return reward;
    });
    form.setValue("nftRewards", updatedRewards);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">NFT Rewards</h3>
          <p className="text-gray-400 text-sm">Create exclusive NFTs for your backers</p>
        </div>
        <Switch 
          id="enable-nft-rewards" 
          checked={enableNftRewards}
          onCheckedChange={handleNftRewardsToggle}
        />
      </div>
      
      {enableNftRewards && (
        <div className="space-y-6">
          <div className="bg-secondary/40 p-4 rounded-lg border border-purple-900/30">
            <div className="flex items-start gap-3">
              <Gift className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-white mb-1">NFT Rewards for Backers</h4>
                <p className="text-xs text-gray-300">
                  Create unique, collectible NFTs to reward your supporters. NFTs can be minted on Hive, Ethereum, or Solana blockchains.
                </p>
                <ul className="text-xs text-gray-300 mt-2 space-y-1 ml-4 list-disc">
                  <li>NFTs are stored on decentralized storage (IPFS)</li>
                  <li>Backers receive NFTs based on contribution amount</li>
                  <li>Limited editions increase value and exclusivity</li>
                  <li>Add special utility or benefits to your NFTs</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {nftRewards && nftRewards.map((reward, index) => (
              <div key={reward.id} className="border border-gray-700 rounded-lg p-4 bg-secondary/10 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium flex items-center">
                    <Badge variant="outline" className="mr-2 bg-purple-900/50 text-xs">NFT #{index + 1}</Badge>
                    {(reward as FormNftReward).title || "Unnamed Reward"}
                  </h4>
                  {nftRewards.length > 1 && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-6 w-6 text-gray-400 hover:text-red-400"
                      onClick={() => removeNftReward(reward.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">NFT Image</label>
                      {reward.image ? (
                        <div className="relative w-full h-36 bg-gray-800 rounded-lg overflow-hidden">
                          <img 
                            src={reward.image} 
                            alt="NFT preview" 
                            className="w-full h-full object-cover"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 rounded-full"
                            onClick={() => updateNftField(reward.id, 'image', "")}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-lg cursor-pointer border-gray-700 bg-background/30 hover:bg-background/50">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Camera className="w-6 h-6 mb-2 text-gray-400" />
                              <p className="mb-1 text-xs text-gray-400">
                                <span className="font-semibold">Click to upload</span>
                              </p>
                              <p className="text-xs text-gray-500">
                                PNG, JPG or GIF
                              </p>
                            </div>
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={(e) => handleImageUpload(reward.id, e)}
                            />
                          </label>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-1">This image will be stored on IPFS when you publish the project</p>
                    </div>
                    
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">NFT Name</label>
                      <Input 
                        value={(reward as FormNftReward).title}
                        onChange={(e) => updateNftField(reward.id, 'title', e.target.value)}
                        placeholder="e.g., Early Supporter Badge"
                        className="h-8 text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Blockchain</label>
                      <Select 
                        value={reward.blockchain}
                        onValueChange={(value) => updateNftField(reward.id, 'blockchain', value)}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder="Select blockchain" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hive">Hive</SelectItem>
                          <SelectItem value="ethereum">Ethereum</SelectItem>
                          <SelectItem value="solana">Solana</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Description</label>
                      <Textarea 
                        value={reward.description}
                        onChange={(e) => updateNftField(reward.id, 'description', e.target.value)}
                        placeholder="Describe what makes this NFT special..."
                        className="h-20 text-sm resize-none"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Supply</label>
                        <Input 
                          type="number"
                          min="1"
                          value={reward.supply}
                          onChange={(e) => updateNftField(reward.id, 'supply', parseInt(e.target.value) || 1)}
                          className="h-8 text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Min. Contribution</label>
                        <Input 
                          type="number"
                          min="1"
                          value={reward.minContribution}
                          onChange={(e) => updateNftField(reward.id, 'minContribution', parseInt(e.target.value) || 1)}
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Attributes/Traits (optional)</label>
                      <div className="flex flex-wrap gap-2 border border-gray-700 p-2 rounded-md">
                        {reward.metadata.attributes?.map((attr, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs flex items-center gap-1">
                            {attr.trait_type}: {attr.value}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-4 w-4 ml-1 text-gray-400 hover:text-red-400 p-0"
                              onClick={() => {
                                const updatedAttrs = [...(reward.metadata.attributes || [])];
                                updatedAttrs.splice(idx, 1);
                                updateNftField(reward.id, 'metadata', {
                                  ...reward.metadata,
                                  attributes: updatedAttrs
                                });
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs"
                          onClick={() => {
                            const trait = prompt("Enter trait (e.g. Rarity: Epic)");
                            if (trait) {
                              const [trait_type, value] = trait.split(':').map(s => s.trim());
                              if (trait_type && value) {
                                const attributes = [...(reward.metadata.attributes || []), { trait_type, value }];
                                updateNftField(reward.id, 'metadata', {
                                  ...reward.metadata,
                                  attributes
                                });
                              }
                            }
                          }}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Trait
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2"
              onClick={addNftReward}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another NFT Reward
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
