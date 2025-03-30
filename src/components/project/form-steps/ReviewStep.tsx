
import { UseFormReturn } from "react-hook-form";
import { ProjectFormValues } from "../project-form-schema";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  CircleDollarSign, 
  RefreshCcw, 
  Gift,
  Globe,
  Shield,
  Award
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

interface ReviewStepProps {
  form: UseFormReturn<ProjectFormValues>;
  tempCoverImage: string | null;
}

export function ReviewStep({ form, tempCoverImage }: ReviewStepProps) {
  const values = form.getValues();
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Review Project</h3>
      <p className="text-gray-400 text-sm mb-6">Please review your project before submitting.</p>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="funding">Funding</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="media">Media & Links</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="rounded-lg p-4 bg-secondary/20 space-y-2">
            <h4 className="font-medium text-base">{values.title || "Untitled Project"}</h4>
            <Badge variant="outline" className="bg-secondary/30">
              {values.category || "No category selected"}
            </Badge>
            <div className="mt-3 text-sm text-gray-300 whitespace-pre-line">
              {values.description || "No description provided."}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="funding" className="space-y-4">
          <div className="rounded-lg p-4 bg-secondary/20 space-y-4">
            <div className="flex items-start gap-4">
              <CircleDollarSign className="h-5 w-5 mt-1 text-purple-400" />
              <div>
                <h5 className="font-medium mb-1">Funding Goal</h5>
                <p className="text-2xl font-bold">{values.fundingGoal || "0"} HIVE</p>
              </div>
            </div>
            
            <Separator className="bg-gray-700" />
            
            {/* Subscription Tiers */}
            <div className="flex items-start gap-4">
              <RefreshCcw className="h-5 w-5 mt-1 text-purple-400" />
              <div className="w-full">
                <div className="flex items-center justify-between mb-1">
                  <h5 className="font-medium">Subscription Support</h5>
                  <Switch disabled checked={values.enableSubscription || false} />
                </div>
                
                {values.enableSubscription && values.subscriptionTiers && values.subscriptionTiers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    {values.subscriptionTiers.map(tier => (
                      <div key={tier.id} className="border border-gray-700 rounded-md p-3 bg-secondary/10">
                        <div className="flex justify-between">
                          <h6 className="font-medium">{tier.name}</h6>
                          <span className="text-sm font-bold">{tier.price} {tier.currency.toUpperCase()}</span>
                        </div>
                        <div className="mt-1 text-xs text-gray-400">
                          <span className="text-gray-500">Duration:</span> {tier.duration === 'monthly' ? 'Monthly' : 'Annual'}
                        </div>
                        <div className="mt-2">
                          <span className="text-xs text-gray-500">Benefits:</span>
                          <ul className="list-disc list-inside text-xs text-gray-300 mt-1">
                            {tier.benefits.map((benefit, idx) => (
                              <li key={idx}>{benefit}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No subscription tiers enabled.</p>
                )}
              </div>
            </div>
            
            <Separator className="bg-gray-700" />
            
            {/* Multi-Chain Support */}
            <div className="flex items-start gap-4">
              <Globe className="h-5 w-5 mt-1 text-purple-400" />
              <div className="w-full">
                <div className="flex items-center justify-between mb-1">
                  <h5 className="font-medium">Multi-Chain Support</h5>
                  <Switch disabled checked={values.enableMultiChain || false} />
                </div>
                
                {values.enableMultiChain && values.supportedBlockchains && values.supportedBlockchains.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {values.supportedBlockchains.map(blockchain => (
                      <Badge key={blockchain} variant="outline" className="bg-secondary/30">
                        {blockchain}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">Only Hive blockchain supported.</p>
                )}
              </div>
            </div>
            
            <Separator className="bg-gray-700" />
            
            {/* DAO Governance */}
            <div className="flex items-start gap-4">
              <Award className="h-5 w-5 mt-1 text-purple-400" />
              <div className="w-full">
                <div className="flex items-center justify-between mb-1">
                  <h5 className="font-medium">DAO Governance</h5>
                  <Switch disabled checked={values.enableDao || false} />
                </div>
                
                {values.enableDao ? (
                  <p className="text-sm text-gray-300">
                    Backers will receive governance tokens in proportion to their contributions, allowing them to vote on project decisions.
                  </p>
                ) : (
                  <p className="text-sm text-gray-400">DAO governance not enabled for this project.</p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="rewards" className="space-y-4">
          {/* NFT Rewards */}
          <div className="rounded-lg p-4 bg-secondary/20 space-y-4">
            <div className="flex items-start gap-4">
              <Gift className="h-5 w-5 mt-1 text-purple-400" />
              <div className="w-full">
                <div className="flex items-center justify-between mb-1">
                  <h5 className="font-medium">NFT Rewards</h5>
                  <Switch disabled checked={values.enableNftRewards || false} />
                </div>
                
                {values.enableNftRewards && values.nftRewards && values.nftRewards.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3 mt-3">
                    {values.nftRewards.map(reward => (
                      <div key={reward.id} className="border border-gray-700 rounded-md p-3 bg-secondary/10">
                        <div className="flex items-start gap-3">
                          {reward.image && (
                            <div className="w-16 h-16 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                              <img src={reward.image} alt={reward.name} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="flex-grow">
                            <div className="flex justify-between">
                              <h6 className="font-medium">{reward.name}</h6>
                              <Badge variant="outline" className="bg-secondary/30">
                                {reward.blockchain}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-300 mt-1">{reward.description}</p>
                            <div className="flex justify-between mt-2 text-xs text-gray-400">
                              <span>Supply: {reward.supply}</span>
                              <span>Min. Contribution: {reward.minContribution} HIVE</span>
                            </div>
                            
                            {reward.metadata.attributes && reward.metadata.attributes.length > 0 && (
                              <div className="mt-2">
                                <span className="text-xs text-gray-500">Attributes:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {reward.metadata.attributes.map((attr, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      {attr.trait_type}: {attr.value}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No NFT rewards enabled for this project.</p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="media" className="space-y-4">
          {/* Cover Image */}
          <div className="rounded-lg p-4 bg-secondary/20 space-y-4">
            <h5 className="font-medium mb-2">Cover Image</h5>
            {tempCoverImage ? (
              <div className="w-full h-40 bg-gray-800 rounded-lg overflow-hidden">
                <img src={tempCoverImage} alt="Cover preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-full h-40 bg-gray-800 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">No cover image uploaded</p>
              </div>
            )}
            
            <h5 className="font-medium mt-4 mb-2">Social Links</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(values.socialLinks).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-2 border border-gray-700 rounded-md">
                  <span className="capitalize text-sm">{key}:</span>
                  <span className="text-sm text-gray-400 truncate max-w-[150px]">
                    {value || 'Not provided'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="p-4 bg-secondary/20 rounded-lg mt-6">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-purple-500 mt-1" />
          <div>
            <h4 className="font-medium">Terms and Conditions</h4>
            <p className="text-sm text-gray-400 mt-1">
              By submitting this project, you agree to CrowdHive's terms of service and privacy policy.
            </p>
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox 
                id="terms" 
                checked={values.termsAccepted}
                onCheckedChange={(checked) => {
                  form.setValue("termsAccepted", checked === true);
                }}
              />
              <Label htmlFor="terms" className="text-sm text-gray-300">
                I agree to the terms and conditions
              </Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
