import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterForm from "@/components/RegisterForm";
import { api, ApiClientError } from "@/lib/api";

const { pushMock, addToastMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
  addToastMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("@/components/ui/toast/ToastProvider", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/components/ui/toast/ToastProvider")>();
  return {
    ...actual,
    useToast: () => ({ addToast: addToastMock, removeToast: vi.fn() }),
  };
});

vi.mock("@/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api")>();
  return {
    ...actual,
    api: {
      register: vi.fn(),
    },
  };
});

const registerMock = vi.mocked(api.register);

function renderForm() {
  return render(<RegisterForm />);
}

describe("RegisterForm", () => {
  beforeEach(() => {
    registerMock.mockReset();
    pushMock.mockReset();
    addToastMock.mockReset();
  });

  it("shows validation errors and skips the network call when fields are empty", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(screen.getByText("Username is required.")).toBeInTheDocument();
    expect(screen.getByText("Email is required.")).toBeInTheDocument();
    expect(screen.getByText("Password is required.")).toBeInTheDocument();
    expect(registerMock).not.toHaveBeenCalled();
  });

  it("rejects a malformed email and a short password without a network call", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText("Username"), "alice");
    await user.type(screen.getByLabelText("Email"), "not-an-email");
    await user.type(screen.getByLabelText("Password"), "short");

    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
    expect(screen.getByText("Password must be at least 8 characters.")).toBeInTheDocument();
    expect(registerMock).not.toHaveBeenCalled();
  });

  it("submits valid data and redirects to the login page", async () => {
    registerMock.mockResolvedValue({
      access_token: "at",
      refresh_token: "rt",
      expires_in: 3600,
      user: {
        id: "1",
        username: "alice",
        walletAddress: "GABC...",
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      },
    });

    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText("Username"), "  alice  ");
    await user.type(screen.getByLabelText("Display name"), "Alice");
    await user.type(screen.getByLabelText("Email"), "alice@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");

    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledTimes(1);
    });

    expect(registerMock).toHaveBeenCalledWith({
      username: "alice",
      email: "alice@example.com",
      password: "password123",
      displayName: "Alice",
    });

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/login");
    });
  });

  it("surfaces a backend error message inline", async () => {
    registerMock.mockRejectedValue(
      new ApiClientError({
        statusCode: 409,
        message: "Email already registered",
        requestId: "req-1",
      })
    );

    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText("Username"), "alice");
    await user.type(screen.getByLabelText("Email"), "alice@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");

    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Email already registered");
    });
    expect(pushMock).not.toHaveBeenCalled();
  });
});
