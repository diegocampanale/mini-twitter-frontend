
"use client";

import React from "react";

type AvatarProps = {
  username: string;
  src?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

export default function Avatar({ 
  username, 
  src, 
  size = "md", 
  className = "" 
}: AvatarProps) {
  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-20 w-20 text-xl"
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getBackgroundColor = (name: string) => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div 
      className={`
        relative inline-flex items-center justify-center rounded-full 
        bg-muted font-medium text-white
        ${sizeClasses[size]}
        ${className} // Aggiungi className qui
      `}
    >
      {src ? (
        <img
          src={src}
          alt={`Avatar di ${username}`}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <span className="select-none">{getInitials(username)}</span>
      )}
    </div>
  );
}