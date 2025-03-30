
import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Info, CircleDollarSign, RefreshCcw, Plus, Trash2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ProjectFormValues, BLOCKCHAINS } from "../project-form-schema";
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";
import { SubscriptionTier } from "@/utils/hive/types";

interface FundingStepProps {
  form: UseFormReturn<ProjectFormValues>;
}

export function FundingStep({ form }: FundingStepProps) {
  const [enableMultiChain, setEnableMultiChain] = useState(form.watch("enableMultiChain") || false);
  const [enableSubscription, setEnableSubscription] = useState(form.watch("enableSubscription") || false);
  const [enableDao, setEnableDao] = useState(form.watch("enableDao") || false);
  const subscriptionTiers = form.watch("subscriptionTiers") || [];
  const supportedBlockchains = form.watch("supportedBlockchains") || ["Hive"];

  // Initialize with default tiers if none exist
  const initSubscriptionTiers = () => {
    if (!subscriptionTiers || subscriptionTiers.length === 0) {
      const defaultTiers: SubscriptionTier[] = [
        {
          id: nanoid(),
          name: "Basic Tier",
          price: 5,
          currency: "hive",
          benefits: ["Early access to updates"],
          duration: "monthly"
        },
        {
          id: nanoid(),
          name: "Premium Tier",
          price: 20,
          currency: "hive",
          benefits: ["Early access to updates", "Exclusive content"],
          duration: "monthly"
        }
      ];
      
      form.setValue("subscriptionTiers", defaultTiers);
      return defaultTiers;
    }
    return subscriptionTiers;
  };

  // Handle blockchain selection
  const toggleBlockchain = (blockchain: string) => {
    const currentBlockchains = supportedBlockchains || ["Hive"];
    
    if (blockchain === "Hive") return; // Hive is always supported
    
    const isSelected = currentBlockchains.includes(blockchain);
    let updatedBlockchains;
    
    if (isSelected) {
      updatedBlockchains = currentBlockchains.filter(b => b !== blockchain);
    } else {
      updatedBlockchains = [...currentBlockchains, blockchain];
    }
    
    form.setValue("supportedBlockchains", updatedBlockchains);
  };

  // Handle multi-chain toggle
  const handleMultiChainToggle = (checked: boolean) => {
    setEnableMultiChain(checked);
    form.setValue("enableMultiChain", checked);
    
    if (!checked) {
      form.setValue("supportedBlockchains", ["Hive"]);
    }
  };

  // Handle subscription toggle
  const handleSubscriptionToggle = (checked: boolean) => {
    setEnableSubscription(checked);
    form.setValue("enableSubscription", checked);
    
    if (checked && (!subscriptionTiers || subscriptionTiers.length === 0)) {
      initSubscriptionTiers();
    }
  };

  // Handle DAO toggle
  const handleDaoToggle = (checked: boolean) => {
    setEnableDao(checked);
    form.setValue("enableDao", checked);
  };

  // Add new subscription tier
  const addSubscriptionTier = () => {
    const newTier: SubscriptionTier = {
      id: nanoid(),
      name: `Tier ${subscriptionTiers.length + 1}`,
      price: 10,
      currency: "hive",
      benefits: [],
      duration: "monthly"
    };
    
    form.setValue("subscriptionTiers", [...subscriptionTiers, newTier]);
  };

  // Remove subscription tier
  const removeSubscriptionTier = (tierId: string) => {
    const updatedTiers = subscriptionTiers.filter(tier => tier.id !== tierId);
    form.setValue("subscriptionTiers", updatedTiers);
  };

  // Update tier benefit
  const updateTierBenefits = (tierId: string, benefitsStr: string) => {
    const updatedTiers = subscriptionTiers.map(tier => {
      if (tier.id === tierId) {
        return {
          ...tier,
          benefits: benefitsStr.split(",").map(b => b.trim()).filter(b => b)
        };
      }
      return tier;
    });
    
    form.setValue("subscriptionTiers", updatedTiers);
  };

  // Update tier price
  const updateTierPrice = (tierId: string, price: number) => {
    const updatedTiers = subscriptionTiers.map(tier => {
      if (tier.id === tierId) {
        return {
          ...tier,
          price
        };
      }
      return tier;
    });
    
    form.setValue("subscriptionTiers", updatedTiers);
  };

  // Update tier currency
  const updateTierCurrency = (tierId: string, currency: string) => {
    const updatedTiers = subscriptionTiers.map(tier => {
      if (tier.id === tierId) {
        return {
          ...tier,
          currency
        };
      }
      return tier;
    });
    
    form.setValue("subscriptionTiers", updatedTiers);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Funding Goals</h3>
      <p className="text-gray-400 text-sm">Set your funding target and milestones.</p>
      
      {/* Primary Funding Goal */}
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="fundingGoal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Funding Goal (HIVE)</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type="number" 
                    min="10"
                    step="0.1"
                    placeholder="e.g., 1000" 
                    {...field} 
                    className="bg-background/50 pl-16"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none text-gray-400 border-r border-gray-700">
                    HIVE
                  </div>
                </div>
              </FormControl>
              <FormDescription>
                Be realistic about what you need to complete your project. Minimum 10 HIVE.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
  
        {/* Cross-Blockchain Support */}
        <div className="p-4 bg-secondary/20 rounded-lg border border-secondary/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CircleDollarSign className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-medium">Multi-Chain Funding</h4>
            </div>
            <Switch 
              id="multi-chain" 
              checked={enableMultiChain} 
              onCheckedChange={handleMultiChainToggle}
            />
          </div>
          
          {enableMultiChain && (
            <div className="grid grid-cols-1 gap-3 mt-2">
              <p className="text-xs text-gray-400">
                Accept funding from multiple blockchains to expand your potential backer pool.
              </p>
              
              <div className="grid grid-cols-2 gap-2 mt-1">
                {BLOCKCHAINS.map((blockchain) => (
                  blockchain !== "Hive" && (
                    <div key={blockchain} className="flex items-center gap-2 p-2 border border-gray-700 rounded-md">
                      <Switch 
                        id={`blockchain-${blockchain}`} 
                        checked={supportedBlockchains.includes(blockchain)}
                        onCheckedChange={() => toggleBlockchain(blockchain)}
                      />
                      <label htmlFor={`blockchain-${blockchain}`} className="text-xs cursor-pointer">
                        {blockchain}
                      </label>
                    </div>
                  )
                ))}
              </div>
              
              <div className="bg-secondary/40 p-3 rounded-md mt-2">
                <p className="text-xs text-amber-300 flex items-center">
                  <Info className="h-3 w-3 mr-1 text-amber-300" />
                  Multi-chain support requires project creators to set up cross-chain smart contracts. Gas fees apply for Ethereum transactions.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Subscription-based funding */}
      <div className="p-4 bg-secondary/20 rounded-lg border border-secondary/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCcw className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-medium">Enable Subscription Support</h4>
          </div>
          <Switch 
            id="enable-subscription" 
            checked={enableSubscription}
            onCheckedChange={handleSubscriptionToggle}
          />
        </div>
        
        {enableSubscription && (
          <>
            <p className="text-xs text-gray-400">
              Allow backers to support your project with recurring monthly or annual contributions.
            </p>
            
            <div className="grid grid-cols-1 gap-4 mt-2">
              {initSubscriptionTiers().map((tier, index) => (
                <div key={tier.id} className="p-3 border border-gray-700 rounded-md relative">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="text-xs font-medium">{tier.name}</h5>
                    {subscriptionTiers.length > 1 && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-gray-400 hover:text-red-400"
                        onClick={() => removeSubscriptionTier(tier.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input 
                        type="number" 
                        min="1" 
                        placeholder="5" 
                        className="h-7 text-xs" 
                        value={tier.price}
                        onChange={(e) => updateTierPrice(tier.id, parseFloat(e.target.value) || 0)}
                      />
                      <Select 
                        value={tier.currency}
                        onValueChange={(value) => updateTierCurrency(tier.id, value)}
                      >
                        <SelectTrigger className="h-7 text-xs w-24">
                          <SelectValue placeholder="HIVE" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hive">HIVE</SelectItem>
                          <SelectItem value="eth">ETH</SelectItem>
                          <SelectItem value="sol">SOL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Input 
                      placeholder="Tier benefits (comma separated)" 
                      className="h-7 text-xs" 
                      value={tier.benefits.join(", ")}
                      onChange={(e) => updateTierBenefits(tier.id, e.target.value)}
                    />
                    <div className="flex justify-between items-center text-xs text-gray-400 mt-1">
                      <span>Duration:</span>
                      <RadioGroup 
                        value={tier.duration}
                        onValueChange={(value) => {
                          const updatedTiers = subscriptionTiers.map(t => 
                            t.id === tier.id ? {...t, duration: value as 'monthly' | 'annual'} : t
                          );
                          form.setValue("subscriptionTiers", updatedTiers);
                        }}
                        className="flex space-x-2"
                      >
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="monthly" id={`monthly-${tier.id}`} className="h-3 w-3" />
                          <label htmlFor={`monthly-${tier.id}`} className="text-xs">Monthly</label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="annual" id={`annual-${tier.id}`} className="h-3 w-3" />
                          <label htmlFor={`annual-${tier.id}`} className="text-xs">Annual</label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              ))}

              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 text-xs"
                onClick={addSubscriptionTier}
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Tier
              </Button>
            </div>
          </>
        )}
      </div>
      
      {/* Project milestones info */}
      <div className="bg-secondary/40 p-4 rounded-lg border border-purple-900/30">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-white mb-1">Project Milestones</h4>
            <p className="text-xs text-gray-300">
              Your project will automatically have these funding milestones:
            </p>
            <ul className="text-xs text-gray-300 mt-2 space-y-1 ml-4 list-disc">
              <li>25% - First milestone reached</li>
              <li>50% - Halfway to goal</li>
              <li>75% - Three-quarters funded</li>
              <li>100% - Fully funded</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* DAO Governance */}
      <div className="p-4 bg-secondary/20 rounded-lg border border-secondary/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <circle cx="12" cy="8" r="7" />
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
            </svg>
            <h4 className="text-sm font-medium">Enable DAO Governance</h4>
          </div>
          <Switch 
            id="enable-dao" 
            checked={enableDao}
            onCheckedChange={handleDaoToggle}
          />
        </div>
        
        {enableDao && (
          <>
            <p className="text-xs text-gray-400">
              Allow backers to vote on project decisions using governance tokens proportional to their funding amounts.
            </p>
            
            <div className="bg-secondary/40 p-3 rounded-md mt-2">
              <p className="text-xs text-gray-300">
                <span className="font-medium">How it works:</span> When enabled, backers will receive governance tokens in proportion to their contributions. They can use these tokens to vote on proposals you create regarding the project's direction.
              </p>
              <p className="text-xs text-gray-300 mt-2">
                <span className="font-medium">Governance features:</span>
              </p>
              <ul className="text-xs text-gray-300 mt-1 space-y-1 ml-4 list-disc">
                <li>Create proposals for project decisions</li>
                <li>Token-weighted voting system</li>
                <li>Transparent on-chain voting results</li>
                <li>Automatic execution of approved proposals</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
