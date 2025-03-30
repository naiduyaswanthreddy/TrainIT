
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Loader2, Image, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onImageUploaded: (imageUrl: string) => void;
}

export function FileUpload({ onImageUploaded }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Please upload an image file");
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit");
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    setError(null);
    setIsUploading(true);

    // Create a mock upload delay (in a real app, this would be an actual upload to a server)
    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        onImageUploaded(imageUrl);
        setIsUploading(false);
        toast({
          title: "Image uploaded",
          description: "Your image has been uploaded successfully",
        });
      };
      reader.readAsDataURL(file);
    }, 1500);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <Input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <div className="border-2 border-dashed border-gray-700 rounded-md p-6 text-center hover:border-gray-500 transition-colors">
        {isUploading ? (
          <div className="flex flex-col items-center justify-center space-y-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-gray-400">Uploading image...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2">
            {error ? (
              <AlertCircle className="h-8 w-8 text-red-500" />
            ) : (
              <Image className="h-8 w-8 text-gray-400" />
            )}
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-300">
                Drag and drop an image, or click to upload
              </p>
              <p className="text-xs text-gray-400">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button
              type="button"
              variant="outline"
              onClick={triggerFileInput}
              disabled={isUploading}
            >
              <Upload className="mr-2 h-4 w-4" />
              Select Image
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
