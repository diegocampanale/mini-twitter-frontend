"use client";

import Link from "next/link";
import { PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FloatingNewPostButton() {
  return (
    <Link
      href="/post"
      className="md:hidden fixed bottom-20 right-6 z-50"
    >
      <Button
        size="icon"
        className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
      >
        <PenSquare className="h-6 w-6" />
      </Button>
    </Link>
  );
}
