
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";

interface Milestone {
  id: string;
  title: string;
  description: string;
  fundPercentage: number;
  deadline: Date | null;
}

interface MilestoneInputProps {
  milestone: Milestone;
  index: number;
  onUpdate: (id: string, field: string, value: any) => void;
  onRemove: (id: string) => void;
  isLast: boolean;
}

export function MilestoneInput({ milestone, index, onUpdate, onRemove, isLast }: MilestoneInputProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      onUpdate(milestone.id, "fundPercentage", value);
    }
  };
  
  return (
    <div className="p-4 border border-gray-800 rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md font-medium">Milestone {index + 1}</h3>
        {!isLast && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(milestone.id)}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`milestone-title-${milestone.id}`}>Title</Label>
          <Input
            id={`milestone-title-${milestone.id}`}
            value={milestone.title}
            onChange={(e) => onUpdate(milestone.id, "title", e.target.value)}
            placeholder="e.g., Development Phase 1"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`milestone-description-${milestone.id}`}>Description</Label>
          <Textarea
            id={`milestone-description-${milestone.id}`}
            value={milestone.description}
            onChange={(e) => onUpdate(milestone.id, "description", e.target.value)}
            placeholder="What will be delivered in this milestone?"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`milestone-percentage-${milestone.id}`}>Fund Percentage (%)</Label>
            <Input
              id={`milestone-percentage-${milestone.id}`}
              type="number"
              value={milestone.fundPercentage}
              onChange={handlePercentageChange}
              min="1"
              max="100"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`milestone-deadline-${milestone.id}`}>Deadline</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  id={`milestone-deadline-${milestone.id}`}
                  variant={"outline"}
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {milestone.deadline ? (
                    format(milestone.deadline, "PPP")
                  ) : (
                    <span>Select deadline</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={milestone.deadline || undefined}
                  onSelect={(date) => {
                    onUpdate(milestone.id, "deadline", date);
                    setIsCalendarOpen(false);
                  }}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
}
