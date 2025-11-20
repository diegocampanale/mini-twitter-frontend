// components/atoms/Timestamp.tsx
"use client";

import React from "react";

type TimestampProps = {
  date?: string;
  className?: string;
};

export default function Timestamp({ date, className = "" }: TimestampProps) {
  if (!date) return null;

  const formattedDate = new Date(date).toLocaleString("it-IT", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <time dateTime={date} className={`text-xs text-muted-foreground ${className}`}>
      {formattedDate}
    </time>
  );
}
