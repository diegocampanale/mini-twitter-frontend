// components/atoms/Icon.tsx
"use client";

import React from "react";
import { Heart, MessageCircle, Share2, MoreHorizontal, Pen } from "lucide-react";

type IconName = "heart" | "comment" | "share" | "more" | "edit";

type IconProps = {
  name: IconName;
  size?: number;
  className?: string;
};

const iconMap = {
  heart: Heart,
  comment: MessageCircle,
  share: Share2,
  more: MoreHorizontal,
  edit: Pen,
};

export default function Icon({ name, size = 16, className = "" }: IconProps) {
  const IconComponent = iconMap[name];
  return <IconComponent size={size} className={className} />;
}
