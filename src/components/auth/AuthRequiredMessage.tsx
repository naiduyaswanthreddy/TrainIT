
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHiveWallet } from "@/hooks/use-hive-wallet";

interface AuthRequiredMessageProps {
  title?: string;
  description?: string;
  actionText?: string;
}

export const AuthRequiredMessage = ({
  title = "Authentication Required",
  description = "Please connect your wallet to access this feature",
  actionText = "Connect Wallet"
}: AuthRequiredMessageProps) => {
  const { initializeWallet } = useHiveWallet();
  
  const handleConnect = () => {
    initializeWallet();
    // Get the connect wallet dialog element and open it
    const connectButton = document.querySelector('[aria-label="Connect wallet"]') as HTMLButtonElement;
    if (connectButton) {
      connectButton.click();
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 bg-primary/5 rounded-xl border border-primary/10">
      <AlertCircle className="h-12 w-12 text-primary/70" />
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground max-w-md">{description}</p>
      <Button onClick={handleConnect} className="mt-4">
        {actionText}
      </Button>
    </div>
  );
};
