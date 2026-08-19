"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { api, ApiClientError } from "@/lib/api";
import type { SignupRequest } from "@/types/index";

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  displayName: string;
}

type FieldName = keyof RegisterFormValues;

type FieldErrors = Partial<Record<FieldName, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

function validate(values: RegisterFormValues): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.username.trim()) {
    errors.username = "Username is required.";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  } else if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  return errors;
}

function toFieldErrors(errors?: Record<string, string[]>): FieldErrors {
  if (!errors) {
    return {};
  }

  const fields: FieldName[] = ["username", "email", "password", "displayName"];
  return fields.reduce<FieldErrors>((mapped, field) => {
    const messages = errors[field];
    if (messages && messages.length > 0) {
      mapped[field] = messages[0];
    }
    return mapped;
  }, {});
}

export default function RegisterForm() {
  const router = useRouter();
  const { addToast } = useToast();
  const [values, setValues] = useState<RegisterFormValues>({
    username: "",
    email: "",
    password: "",
    displayName: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (field: FieldName) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setFormError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validate(values);
    if (Object.values(validationErrors).some(Boolean)) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setFormError(null);

    const payload: SignupRequest = {
      username: values.username.trim(),
      email: values.email.trim(),
      password: values.password,
      displayName: values.displayName.trim() || undefined,
    };

    try {
      await api.register(payload);
      addToast("Account created — you can now sign in.", "success");
      router.push("/login");
    } catch (error) {
      if (error instanceof ApiClientError) {
        const fieldErrors = toFieldErrors(error.errors);
        if (Object.values(fieldErrors).some(Boolean)) {
          setErrors(fieldErrors);
          setFormError(null);
        } else {
          setFormError(error.message);
        }
        addToast(error.message, "error");
      } else {
        setFormError("Something went wrong. Please try again.");
        addToast("Something went wrong. Please try again.", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Input
        label="Username"
        placeholder="creatorname"
        value={values.username}
        onChange={handleChange("username")}
        error={errors.username}
        autoComplete="username"
        disabled={isSubmitting}
        aria-invalid={errors.username ? true : undefined}
        required
      />
      <Input
        label="Display name"
        placeholder="Your name (optional)"
        value={values.displayName}
        onChange={handleChange("displayName")}
        error={errors.displayName}
        autoComplete="name"
        disabled={isSubmitting}
        aria-invalid={errors.displayName ? true : undefined}
      />
      <Input
        type="email"
        label="Email"
        placeholder="you@example.com"
        value={values.email}
        onChange={handleChange("email")}
        error={errors.email}
        autoComplete="email"
        disabled={isSubmitting}
        aria-invalid={errors.email ? true : undefined}
        required
      />
      <Input
        type="password"
        label="Password"
        placeholder="Create a password"
        value={values.password}
        onChange={handleChange("password")}
        error={errors.password}
        helperText={`At least ${MIN_PASSWORD_LENGTH} characters`}
        autoComplete="new-password"
        disabled={isSubmitting}
        aria-invalid={errors.password ? true : undefined}
        required
      />

      {formError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300"
        >
          {formError}
        </div>
      )}

      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        Create account
      </Button>
    </form>
  );
}
