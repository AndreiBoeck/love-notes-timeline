import { useState } from "react";
import { cn } from "@/lib/utils";

interface TimelinePhotoFanProps {
  photos: string[];
}

export const TimelinePhotoFan = ({ photos }: TimelinePhotoFanProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="relative w-64 h-48 cursor-pointer"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {photos.map((photo, index) => {
        const rotation = isExpanded ? (index - 1) * 15 : 0;
        const translateX = isExpanded ? (index - 1) * 30 : 0;
        const zIndex = photos.length - index;

        return (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-smooth rounded-2xl overflow-hidden shadow-romantic",
              isExpanded && "shadow-romantic-hover"
            )}
            style={{
              transform: `rotate(${rotation}deg) translateX(${translateX}px)`,
              zIndex,
            }}
          >
            <img
              src={photo}
              alt={`Memória ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        );
      })}
    </div>
  );
};
