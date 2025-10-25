// components/molecules/PostHeader.tsx
"use client";

import React from "react";
import Link from "next/link";
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
  const username = author?.username ?? "unknown";

  return (
    <header className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <Link href={`/user/${username}`} className="hover:opacity-80 transition-opacity">
          <Avatar username={username} src={author?.avatar} size="md" />
        </Link>
        <div className="flex flex-col">
          <Link 
            href={`/user/${username}`}
            className="text-sm font-semibold text-foreground hover:underline"
          >
            @{username}
          </Link>
          <Timestamp date={createdAt} />
        </div>
      </div>
    </header>
  );
}
