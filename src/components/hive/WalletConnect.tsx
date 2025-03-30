
import { Button } from "@/components/ui/button";
import { Wallet, AlertCircle, ExternalLink } from "lucide-react";
import { getKeychainDownloadLink } from "@/utils/hive";
import { useHiveWallet } from "@/hooks/use-hive-wallet";
import { WalletMenu } from "./WalletMenu";
import { ConnectWalletDialog } from "./ConnectWalletDialog";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { blockchainProviders } from "@/utils/blockchain";

export const WalletConnect = () => {
  const { toast } = useToast();
  const [keychainDetectionAttempts, setKeychainDetectionAttempts] = useState(0);
  const {
    username,
    setUsername,
    connected,
    connectedUser,
    isDialogOpen,
    setIsDialogOpen,
    isKeychainAvailable,
    isLoading,
    isRefreshing,
    accountInfo,
    handleConnect,
    handleDisconnect,
    fetchUserAccountInfo,
    initializeWallet,
    selectedBlockchain,
    setSelectedBlockchain,
    availableBlockchains
  } = useHiveWallet();

  // This effect will run when the component mounts on any page
  // ensuring the keychain availability is checked on every page
  useEffect(() => {
    // Force reinitialize wallet when component is mounted
    initializeWallet();
    console.log("WalletConnect: Initialized wallet, keychain available:", isKeychainAvailable);
    
    // Also check for keychain availability periodically (every 3 seconds)
    // but limit to 20 attempts to avoid infinite checking
    const intervalId = setInterval(() => {
      if (keychainDetectionAttempts < 20 && !isKeychainAvailable) {
        initializeWallet();
        setKeychainDetectionAttempts(prev => prev + 1);
        console.log("WalletConnect: Checking keychain attempt", keychainDetectionAttempts + 1);
      } else if (isKeychainAvailable) {
        // Once keychain is detected, we can reduce the frequency of checks
        console.log("WalletConnect: Keychain detected, reducing check frequency");
        clearInterval(intervalId);
        
        // Set up a less frequent check to handle cases where extension might be disabled
        const longIntervalId = setInterval(() => {
          initializeWallet();
          console.log("WalletConnect: Periodic keychain check");
        }, 10000); // every 10 seconds
        
        return () => clearInterval(longIntervalId);
      }
    }, 3000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [initializeWallet, isKeychainAvailable, keychainDetectionAttempts]);

  const openConnectDialog = () => {
    // For Hive, check keychain before opening dialog
    if (selectedBlockchain === "hive") {
      const keychainAvailable = typeof window !== 'undefined' && 
        window.hive_keychain !== undefined;
      
      console.log("WalletConnect: Opening dialog, keychain available:", keychainAvailable);
      
      if (!keychainAvailable) {
        // Don't show error, just auto-switch to another blockchain
        // This makes the UX better for users without Hive Keychain
        
        // Automatically switch to another blockchain if Hive is not available
        if (availableBlockchains.length > 1) {
          const otherBlockchain = availableBlockchains.find(b => b.name.toLowerCase() !== "hive");
          if (otherBlockchain) {
            setSelectedBlockchain(otherBlockchain.name.toLowerCase());
          }
        }
      }
    }
    
    // Always open the dialog, even if Hive Keychain is not available
    // This allows the user to select other blockchains
    setIsDialogOpen(true);
  };

  const handleRefreshBalance = () => {
    if (connectedUser) {
      fetchUserAccountInfo(connectedUser);
    }
  };

  // Get blockchain display name
  const getBlockchainName = () => {
    const savedBlockchain = localStorage.getItem('connectedBlockchain') || selectedBlockchain;
    return blockchainProviders[savedBlockchain]?.name || "Blockchain";
  };

  return (
    <>
      {connected && connectedUser ? (
        <WalletMenu
          connectedUser={connectedUser}
          accountInfo={accountInfo}
          isRefreshing={isRefreshing}
          onRefresh={handleRefreshBalance}
          onDisconnect={handleDisconnect}
          blockchainName={getBlockchainName()}
        />
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={openConnectDialog}
          className="flex items-center gap-2 border-input text-foreground"
        >
          {(!isKeychainAvailable && selectedBlockchain === "hive") ? (
            <AlertCircle size={16} className="text-yellow-500" />
          ) : (
            <Wallet size={16} className="text-foreground" />
          )}
          <span>Connect Wallet</span>
        </Button>
      )}

      <ConnectWalletDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        username={username}
        onUsernameChange={setUsername}
        selectedBlockchain={selectedBlockchain}
        onBlockchainChange={setSelectedBlockchain}
        onConnect={handleConnect}
        isLoading={isLoading}
      />
    </>
  );
};
