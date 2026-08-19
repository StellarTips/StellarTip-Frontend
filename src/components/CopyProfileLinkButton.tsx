"use client";

import { useCallback } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/toast/ToastProvider";

interface CopyProfileLinkButtonProps {
  username: string;
}

export function CopyProfileLinkButton({ username }: CopyProfileLinkButtonProps) {
  const { addToast } = useToast();

  const handleCopy = useCallback(async () => {
    const url = `${window.location.origin}/u/${username}`;

    // navigator.clipboard is undefined outside a secure context, and even when
    // present writeText can reject on a denied permission. Both land the user
    // on the same failure toast rather than an unhandled rejection.
    if (!navigator.clipboard?.writeText) {
      addToast("Clipboard is unavailable in this browser", "error");
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      addToast("Profile link copied", "success");
    } catch {
      addToast("Could not copy the profile link", "error");
    }
  }, [username, addToast]);

  return (
    <Button variant="outline" size="lg" onClick={handleCopy}>
      <Copy className="h-4 w-4 mr-1.5" />
      Copy link
    </Button>
  );
}
