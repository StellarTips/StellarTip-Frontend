import { describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { ToastProvider, useToast } from "@/components/ui/toast/ToastProvider";

function ToastTrigger() {
  const { addToast } = useToast();
  return (
    <div>
      <button onClick={() => addToast("Saved!", "success")}>add-success</button>
      <button onClick={() => addToast("Something went wrong", "error")}>add-error</button>
      <button onClick={() => addToast("Heads up", "info", 1000)}>add-info-short</button>
    </div>
  );
}

function renderToastApp() {
  return render(
    <ToastProvider>
      <ToastTrigger />
    </ToastProvider>
  );
}

describe("ToastProvider", () => {
  it("renders a success toast with its message and type styling", () => {
    renderToastApp();

    fireEvent.click(screen.getByRole("button", { name: "add-success" }));

    const message = screen.getByText("Saved!");
    expect(message).toBeInTheDocument();
    expect(message.closest("div")).toHaveClass("border-green-200");
  });

  it("renders an error toast with error type styling", () => {
    renderToastApp();

    fireEvent.click(screen.getByRole("button", { name: "add-error" }));

    const message = screen.getByText("Something went wrong");
    expect(message).toBeInTheDocument();
    expect(message.closest("div")).toHaveClass("border-red-200");
  });

  it("removes a toast when dismissed", () => {
    renderToastApp();

    fireEvent.click(screen.getByRole("button", { name: "add-success" }));
    expect(screen.getByText("Saved!")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Dismiss toast" }));

    expect(screen.queryByText("Saved!")).not.toBeInTheDocument();
  });

  it("auto-removes a toast after its default duration", () => {
    renderToastApp();

    vi.useFakeTimers();
    try {
      fireEvent.click(screen.getByRole("button", { name: "add-success" }));
      expect(screen.getByText("Saved!")).toBeInTheDocument();

      act(() => vi.advanceTimersByTime(4999));
      expect(screen.getByText("Saved!")).toBeInTheDocument();

      act(() => vi.advanceTimersByTime(1));
      expect(screen.queryByText("Saved!")).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("auto-removes a toast after a custom duration", () => {
    renderToastApp();

    vi.useFakeTimers();
    try {
      fireEvent.click(screen.getByRole("button", { name: "add-info-short" }));
      expect(screen.getByText("Heads up")).toBeInTheDocument();

      act(() => vi.advanceTimersByTime(999));
      expect(screen.getByText("Heads up")).toBeInTheDocument();

      act(() => vi.advanceTimersByTime(1));
      expect(screen.queryByText("Heads up")).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });
});
