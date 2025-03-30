
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HardDrive, Database, FileText, Image, FileCode, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DecentralizedStorageInfoProps } from "@/utils/hive/types";

interface StorageType {
  name: string;
  description: string;
  icon: JSX.Element;
  active: boolean;
}

export const DecentralizedStorageInfo = ({ projectId }: DecentralizedStorageInfoProps) => {
  const storageTypes: StorageType[] = [
    { 
      name: "IPFS", 
      description: "InterPlanetary File System - Content-addressable, peer-to-peer method of storing and sharing data", 
      icon: <HardDrive className="h-5 w-5" />, 
      active: true 
    },
    { 
      name: "Arweave", 
      description: "Permanent, decentralized data storage with one-time payment", 
      icon: <Database className="h-5 w-5" />, 
      active: true 
    },
    { 
      name: "Hive", 
      description: "Blockchain-based content storage for project data", 
      icon: <FileText className="h-5 w-5" />, 
      active: true 
    }
  ];

  const storedFiles = [
    {
      name: "Project Cover Image",
      type: "image/png",
      size: "1.2 MB",
      storage: "IPFS",
      hash: "QmX7yK2o6gAhx3...kFTu",
      icon: <Image className="h-4 w-4" />
    },
    {
      name: "Project Description",
      type: "text/markdown",
      size: "8 KB",
      storage: "Arweave",
      hash: "ar://Tk9AzE...7nPQ",
      icon: <FileText className="h-4 w-4" />
    },
    {
      name: "Project Metadata",
      type: "application/json",
      size: "4 KB",
      storage: "IPFS",
      hash: "QmZ8dJk...3nFt",
      icon: <FileCode className="h-4 w-4" />
    }
  ];

  console.log(`Loading decentralized storage info for project: ${projectId}`);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold gradient-text">Decentralized Storage</h2>
        <p className="text-muted-foreground">Project content stored permanently on decentralized networks</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {storageTypes.map((storage) => (
          <Card key={storage.name} className={`glass-card border-white/10 ${storage.active ? '' : 'opacity-50'}`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {storage.icon}
                  <CardTitle>{storage.name}</CardTitle>
                </div>
                <Badge variant={storage.active ? "default" : "outline"} className="ml-2">
                  {storage.active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <CardDescription>{storage.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
      
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle>Stored Project Files</CardTitle>
          <CardDescription>Files stored permanently on decentralized networks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {storedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-primary/5 rounded-md border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-md">
                    {file.icon}
                  </div>
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{file.type} • {file.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-primary/10">
                    {file.storage}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 bg-primary/5 p-4 rounded-md border border-white/5">
            <h4 className="text-sm font-medium mb-2">Permanent Storage Benefits</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Data stored permanently without recurring costs</li>
              <li>• Content accessible even if original websites go down</li>
              <li>• Censorship resistance for critical project information</li>
              <li>• Content addressable via cryptographic hash (CID)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
