// components/atoms/Avatar.tsx
"use client";

import React from "react";

type AvatarProps = {
  username?: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  alt?: string;
};

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-12 w-12 text-base",
};

export default function Avatar({ username, src, size = "md", alt }: AvatarProps) {
  const initial = username?.[0]?.toUpperCase() ?? "U";

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary shrink-0`}
      aria-label={alt ?? `Avatar di ${username ?? "utente"}`}
    >
      {src ? (
        <img src={src} alt={alt ?? username ?? "Avatar"} className="w-full h-full rounded-full object-cover" />
      ) : (
        initial
      )}
    </div>
  );
}
