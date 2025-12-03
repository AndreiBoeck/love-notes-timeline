import { useState } from "react";
import { cn } from "@/lib/utils";

interface TimelinePhotoFanProps {
    photos: string[];
}

// Dominio onde as imagens realmente moram
const S3_BASE_URL =
    "https://love-notes-timeline-api-files-dev.s3.us-east-2.amazonaws.com";

export const TimelinePhotoFan = ({ photos }: TimelinePhotoFanProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Função que corrige a URL da imagem automaticamente
    const resolvePhotoUrl = (photo: string) => {
        // Se já é uma URL completa, retorna como está
        if (photo.startsWith("http://") || photo.startsWith("https://")) {
            return photo;
        }

        // Remove "/" inicial caso venha em formato "/memories/..."
        const normalized = photo.startsWith("/") ? photo.slice(1) : photo;

        return `${S3_BASE_URL}/${normalized}`;
    };

    console.log(resolvePhotoUrl);

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
                            src={resolvePhotoUrl(photo)}
                            alt={`Memória ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                );
            })}
        </div>
    );
};
