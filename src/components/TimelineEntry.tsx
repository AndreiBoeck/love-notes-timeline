import { TimelinePhotoFan } from "./TimelinePhotoFan";

interface TimelineEntryProps {
  title: string;
  date: string;
  photos: string[];
  isLeft?: boolean;
}

export const TimelineEntry = ({ title, date, photos, isLeft = false }: TimelineEntryProps) => {
  return (
    <div className={cn(
      "flex items-center gap-8 mb-16 animate-fade-in",
      isLeft ? "flex-row" : "flex-row-reverse"
    )}>
      <TimelinePhotoFan photos={photos} />
      <div className={cn(
        "flex-1",
        isLeft ? "text-left" : "text-right"
      )}>
        <p className="text-sm text-muted-foreground mb-2">{date}</p>
        <h3 className="text-2xl font-bold text-primary">{title}</h3>
      </div>
    </div>
  );
};

import { cn } from "@/lib/utils";
