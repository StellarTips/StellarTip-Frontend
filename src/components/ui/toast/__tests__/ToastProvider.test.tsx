import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastProvider, useToast, type ToastType } from "@/components/ui/toast/ToastProvider";

function Probe({ type = "success", duration }: { type?: ToastType; duration?: number }) {
  const { addToast } = useToast();
  return (
    <button onClick={() => addToast("hello world", type, duration)}>add</button>
  );
}

function renderProvider(props: { type?: ToastType; duration?: number } = {}) {
  return render(
    <ToastProvider>
      <Probe {...props} />
    </ToastProvider>
  );
}

describe("ToastProvider", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("renders nothing until a toast is added", () => {
    renderProvider();
    expect(screen.queryByText("hello world")).not.toBeInTheDocument();
  });

  it("renders a toast with the given message", async () => {
    renderProvider();
    await userEvent.click(screen.getByText("add"));
    expect(screen.getByText("hello world")).toBeInTheDocument();
  });

  it.each<ToastType>(["success", "error", "info", "warning"])(
    "renders a %s toast",
    async (type) => {
      renderProvider({ type });
      await userEvent.click(screen.getByText("add"));
      expect(screen.getByText("hello world")).toBeInTheDocument();
    }
  );

  it("removes the toast when its dismiss button is clicked", async () => {
    renderProvider();
    await userEvent.click(screen.getByText("add"));
    expect(screen.getByText("hello world")).toBeInTheDocument();

    await userEvent.click(screen.getByLabelText("Dismiss toast"));
    expect(screen.queryByText("hello world")).not.toBeInTheDocument();
  });

  it("auto-removes the toast after the default 5s duration", () => {
    vi.useFakeTimers();
    renderProvider();

    // fireEvent, not userEvent: userEvent advances fake timers as it works,
    // which would eat into the very window under test.
    fireEvent.click(screen.getByText("add"));
    expect(screen.getByText("hello world")).toBeInTheDocument();

    // Still present one tick before the deadline.
    act(() => {
      vi.advanceTimersByTime(4999);
    });
    expect(screen.getByText("hello world")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.queryByText("hello world")).not.toBeInTheDocument();
  });

  it("honours a custom duration", () => {
    vi.useFakeTimers();
    renderProvider({ duration: 1000 });

    fireEvent.click(screen.getByText("add"));
    expect(screen.getByText("hello world")).toBeInTheDocument();

    // Gone at 1000ms, well before the 5000ms default would have fired.
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.queryByText("hello world")).not.toBeInTheDocument();
  });

  it("stacks multiple toasts", async () => {
    renderProvider();
    await userEvent.click(screen.getByText("add"));
    await userEvent.click(screen.getByText("add"));
    expect(screen.getAllByText("hello world")).toHaveLength(2);
  });
});

describe("useToast", () => {
  it("throws when used outside a ToastProvider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow(/useToast must be used within a ToastProvider/);
    spy.mockRestore();
  });
});
