"use client";

import { CardMedia, CardColors } from "@/lib/types";
import Image from "next/image";

interface MediaDisplayProps {
  media: CardMedia;
  colors: CardColors;
  forceAspectRatio?: boolean;
  sizes?: string;
}

export function MediaDisplay({ 
  media, 
  colors, 
  forceAspectRatio = true,
  sizes = "(max-width: 640px) 100vw, 720px",
}: MediaDisplayProps) {
  const bgColor = `var(--card-module-bg, ${colors.light})`;
  const aspectRatioClass = forceAspectRatio ? "aspect-video" : "";

  if (media.type === "youtube") {
    return (
      <div className="mt-3">
        <div
          className={`relative w-full ${aspectRatioClass || "aspect-video"} rounded-lg overflow-hidden p-1`}
          style={{ backgroundColor: bgColor }}
        >
          <iframe
            src={`https://www.youtube.com/embed/${media.src}`}
            title={media.caption || "Video"}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-1 w-[calc(100%-8px)] h-[calc(100%-8px)] rounded-md"
          />
        </div>
        {media.caption && (
          <p className="text-[10px] text-muted-foreground mt-1.5 text-center italic">
            {media.caption}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mt-3">
      <div
        className={`relative w-full ${aspectRatioClass} rounded-lg overflow-hidden p-1`}
        style={{ backgroundColor: bgColor }}
      >
        <div className={`relative w-full ${forceAspectRatio ? "h-full" : "h-auto"} rounded-md overflow-hidden`}>
          <Image
            src={media.src}
            alt={media.caption || "Image"}
            fill={forceAspectRatio}
            width={!forceAspectRatio ? 800 : undefined}
            height={!forceAspectRatio ? 600 : undefined}
            sizes={sizes}
            className={forceAspectRatio ? "object-cover" : "w-full h-auto"}
          />
        </div>
      </div>
      {media.caption && (
        <p className="text-[10px] text-muted-foreground mt-1.5 text-center italic">
          {media.caption}
        </p>
      )}
    </div>
  );
}
