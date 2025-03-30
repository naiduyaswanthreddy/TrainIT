
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function Banner() {
  return (
    <div className="w-full bg-primary/10 border-t border-b border-primary/20 py-3 px-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Shield className="h-5 w-5 mr-2 text-primary" />
          <p className="text-sm">
            <span className="font-semibold">Enhanced Security:</span> 
            <span className="hidden sm:inline"> Multi-chain support, fraud detection, and smart contracts now available.</span>
          </p>
        </div>
        <Link to="/protection">
          <Button variant="link" size="sm" className="text-primary hover:text-primary/80">
            Learn more
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
