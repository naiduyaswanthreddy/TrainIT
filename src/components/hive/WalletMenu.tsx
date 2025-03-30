
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, RefreshCw, User, ExternalLink } from "lucide-react";

interface WalletMenuProps {
  connectedUser: string;
  accountInfo: any;
  isRefreshing: boolean;
  onRefresh: () => void;
  onDisconnect: () => void;
  blockchainName?: string;
}

export function WalletMenu({ 
  connectedUser, 
  accountInfo, 
  isRefreshing,
  onRefresh,
  onDisconnect,
  blockchainName = "Hive"
}: WalletMenuProps) {
  const userInitial = connectedUser ? connectedUser[0].toUpperCase() : "U";
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage 
              src={accountInfo?.profile_image || undefined} 
              alt={connectedUser}
            />
            <AvatarFallback className="text-xs bg-primary/20 border border-primary/30">
              {userInitial}
            </AvatarFallback>
          </Avatar>
          <span className="max-w-[80px] truncate">{connectedUser}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 glass-card border-white/10">
        <DropdownMenuLabel className="flex flex-col">
          <span className="text-sm font-semibold">{connectedUser}</span>
          <span className="text-xs text-muted-foreground">Connected to {blockchainName}</span>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <div className="px-2 py-2">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Balance:</span>
              <span className="text-sm font-medium">
                {accountInfo?.balance || "Loading..."}
              </span>
            </div>
            {accountInfo?.hbd_balance && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">HBD:</span>
                <span className="text-sm font-medium">
                  {accountInfo.hbd_balance}
                </span>
              </div>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="w-full mt-2 h-8 text-xs"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-1 h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Balance
          </Button>
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <a 
            href={`https://hiveblocks.com/@${connectedUser}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="cursor-pointer flex items-center"
          >
            <User className="mr-2 h-4 w-4" />
            View Profile
            <ExternalLink className="ml-auto h-3 w-3 opacity-50" />
          </a>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onDisconnect}>
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
