// components/molecules/PostHeader.tsx
"use client";

import React from "react";
import Avatar from "@/components/atoms/Avatar";
import Timestamp from "@/components/atoms/Timestamp";

type PostHeaderProps = {
  author?: {
    username?: string;
    avatar?: string;
  };
  createdAt?: string;
};

export default function PostHeader({ author, createdAt }: PostHeaderProps) {
  return (
    <header className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <Avatar username={author?.username} src={author?.avatar} size="md" />
        <div className="flex flex-col">
          <div className="text-sm font-semibold text-foreground">
            {author?.username ?? "Utente sconosciuto"}
          </div>
          <Timestamp date={createdAt} />
        </div>
      </div>
    </header>
  );
}
