import { useState, useEffect, useCallback } from "react";
import {
  fetchAccountInfo as getHiveAccountInfo
} from "@/utils/hive";
import {
  isAuthenticated,
  getConnectedUsername,
  setConnectedUsername,
  clearConnectedUsername,
  isKeychainInstalled
} from "@/utils/hive/auth";
import { useToast } from "@/hooks/use-toast";
import { blockchainProviders, getEnabledBlockchains } from "@/utils/blockchain";

export const useHiveWallet = () => {
  const [username, setUsername] = useState<string>("");
  const [connected, setConnected] = useState<boolean>(false);
  const [connectedUser, setConnectedUser] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isKeychainAvailable, setIsKeychainAvailable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [accountInfo, setAccountInfo] = useState<any>(null);
  const [selectedBlockchain, setSelectedBlockchain] = useState<string>(
    localStorage.getItem("selectedBlockchain") || "hive"
  );
  const { toast } = useToast();

  const availableBlockchains = getEnabledBlockchains();

  const initializeWallet = useCallback(() => {
    // Check if keychain is installed
    const keychainAvailable = isKeychainInstalled();
    setIsKeychainAvailable(keychainAvailable);
    console.log("Hive Keychain installed:", keychainAvailable);

    // Check if user is already connected
    if (isAuthenticated()) {
      const username = getConnectedUsername();
      setConnected(true);
      setConnectedUser(username);
      
      // Fetch account info
      if (username) {
        fetchUserAccountInfo(username);
      }
    }
  }, []);

  useEffect(() => {
    initializeWallet();
  }, [initializeWallet]);

  // Save selected blockchain to localStorage
  useEffect(() => {
    localStorage.setItem("selectedBlockchain", selectedBlockchain);
  }, [selectedBlockchain]);

  const fetchUserAccountInfo = async (username: string) => {
    if (!username) return;

    setIsRefreshing(true);
    try {
      const accountData = await getHiveAccountInfo(username);
      setAccountInfo(accountData);
    } catch (error) {
      console.error("Error fetching account info:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleConnect = async () => {
    if (!username.trim()) {
      toast({
        title: "Error",
        description: "Please enter a username",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // For mockuser, always allow connection
      if (username === "mockuser") {
        setConnectedUsername(username, selectedBlockchain);
        setConnected(true);
        setConnectedUser(username);
        setIsDialogOpen(false);
        
        // Get mock account info
        await fetchUserAccountInfo(username);
        
        toast({
          title: "Connected successfully",
          description: `Connected as ${username} on ${blockchainProviders[selectedBlockchain]?.name || selectedBlockchain}`,
        });
        return;
      }

      // For Hive, check if keychain is available
      if (selectedBlockchain === "hive") {
        if (!isKeychainAvailable) {
          toast({
            title: "Hive Keychain not found",
            description: "Please install the Hive Keychain extension to connect",
            variant: "destructive",
          });
          return;
        }

        // In a real app, we would verify the user with keychain here
        // For now, just check if the account exists
        try {
          const accountInfo = await getHiveAccountInfo(username);
          if (accountInfo) {
            setConnectedUsername(username, selectedBlockchain);
            setConnected(true);
            setConnectedUser(username);
            setAccountInfo(accountInfo);
            setIsDialogOpen(false);
            
            toast({
              title: "Connected successfully",
              description: `Connected as ${username} on Hive blockchain`,
            });
          }
        } catch (error) {
          console.error("Error connecting:", error);
          toast({
            title: "Connection failed",
            description: "Could not connect to Hive. Please check your username and try again.",
            variant: "destructive",
          });
        }
      } else {
        // For other blockchains, just store the connection info
        // In a real app, we would use wallet connect or other providers
        setConnectedUsername(username, selectedBlockchain);
        setConnected(true);
        setConnectedUser(username);
        setIsDialogOpen(false);
        
        toast({
          title: "Connected successfully",
          description: `Connected as ${username} on ${blockchainProviders[selectedBlockchain]?.name || selectedBlockchain}`,
        });
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection failed",
        description: "Could not connect wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    clearConnectedUsername();
    setConnected(false);
    setConnectedUser(null);
    setAccountInfo(null);
    
    toast({
      title: "Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  return {
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
    availableBlockchains,
  };
};
