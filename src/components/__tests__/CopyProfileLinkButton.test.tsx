import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CopyProfileLinkButton } from "@/components/CopyProfileLinkButton";
import { ToastProvider } from "@/components/ui/toast/ToastProvider";

function renderButton(username = "alice") {
  return render(
    <ToastProvider>
      <CopyProfileLinkButton username={username} />
    </ToastProvider>
  );
}

/** Replace navigator.clipboard, which jsdom does not implement. */
function setClipboard(value: unknown) {
  Object.defineProperty(navigator, "clipboard", {
    value,
    configurable: true,
    writable: true,
  });
}

describe("CopyProfileLinkButton", () => {
  beforeEach(() => {
    setClipboard(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("copies the profile URL and confirms with a success toast", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard({ writeText });

    renderButton("alice");
    await userEvent.click(screen.getByRole("button", { name: /copy link/i }));

    expect(writeText).toHaveBeenCalledWith(`${window.location.origin}/u/alice`);
    expect(await screen.findByText("Profile link copied")).toBeInTheDocument();
  });

  it("reports an error toast when writeText rejects", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("denied"));
    setClipboard({ writeText });

    renderButton();
    await userEvent.click(screen.getByRole("button", { name: /copy link/i }));

    expect(await screen.findByText("Could not copy the profile link")).toBeInTheDocument();
  });

  it("degrades gracefully when the clipboard API is unavailable", async () => {
    // An insecure context leaves navigator.clipboard undefined entirely.
    setClipboard(undefined);

    renderButton();
    await userEvent.click(screen.getByRole("button", { name: /copy link/i }));

    expect(
      await screen.findByText("Clipboard is unavailable in this browser")
    ).toBeInTheDocument();
  });

  it("builds the URL from the username it is given", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard({ writeText });

    renderButton("bob");
    await userEvent.click(screen.getByRole("button", { name: /copy link/i }));

    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith(`${window.location.origin}/u/bob`)
    );
  });
});
