import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";

const STORAGE_KEY = "stellartip-theme";

/** Drive matchMedia("(prefers-color-scheme: dark)") from a single boolean. */
function mockMatchMedia(prefersDark: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("dark") ? prefersDark : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

function Probe() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved">{resolvedTheme}</span>
      <button onClick={toggleTheme}>toggle</button>
      <button onClick={() => setTheme("dark")}>set-dark</button>
      <button onClick={() => setTheme("light")}>set-light</button>
      <button onClick={() => setTheme("system")}>set-system</button>
    </div>
  );
}

function renderProvider() {
  return render(
    <ThemeProvider>
      <Probe />
    </ThemeProvider>
  );
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
    mockMatchMedia(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("starts on the system theme", () => {
    renderProvider();
    expect(screen.getByTestId("theme")).toHaveTextContent("system");
  });

  it("resolves system to light when the OS does not prefer dark", () => {
    mockMatchMedia(false);
    renderProvider();
    expect(screen.getByTestId("resolved")).toHaveTextContent("light");
    expect(document.documentElement).not.toHaveClass("dark");
  });

  it("resolves system to dark when the OS prefers dark", () => {
    mockMatchMedia(true);
    renderProvider();
    expect(screen.getByTestId("resolved")).toHaveTextContent("dark");
    expect(document.documentElement).toHaveClass("dark");
  });

  it("adds the dark class on the html element when set to dark", async () => {
    renderProvider();
    await userEvent.click(screen.getByText("set-dark"));
    expect(document.documentElement).toHaveClass("dark");
    expect(screen.getByTestId("resolved")).toHaveTextContent("dark");
  });

  it("removes the dark class when set back to light", async () => {
    renderProvider();
    await userEvent.click(screen.getByText("set-dark"));
    expect(document.documentElement).toHaveClass("dark");
    await userEvent.click(screen.getByText("set-light"));
    expect(document.documentElement).not.toHaveClass("dark");
  });

  it("toggleTheme flips to dark and back", async () => {
    renderProvider();
    await userEvent.click(screen.getByText("toggle"));
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    await userEvent.click(screen.getByText("toggle"));
    expect(screen.getByTestId("theme")).toHaveTextContent("light");
  });

  it("persists the chosen theme to localStorage", async () => {
    renderProvider();
    await userEvent.click(screen.getByText("set-dark"));
    expect(localStorage.getItem(STORAGE_KEY)).toBe("dark");
    await userEvent.click(screen.getByText("set-light"));
    expect(localStorage.getItem(STORAGE_KEY)).toBe("light");
  });

  it("restores a persisted theme on mount", () => {
    localStorage.setItem(STORAGE_KEY, "dark");
    renderProvider();
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    expect(document.documentElement).toHaveClass("dark");
  });

  it("keeps system as the theme while still resolving it concretely", async () => {
    mockMatchMedia(true);
    renderProvider();
    await userEvent.click(screen.getByText("set-system"));
    expect(screen.getByTestId("theme")).toHaveTextContent("system");
    expect(screen.getByTestId("resolved")).toHaveTextContent("dark");
  });
});

describe("useTheme", () => {
  it("throws when used outside a ThemeProvider", () => {
    // React logs the error boundary trace; silence it for this expected throw.
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow(/useTheme must be used within ThemeProvider/);
    spy.mockRestore();
  });
});
