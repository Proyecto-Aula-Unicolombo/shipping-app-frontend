"use client";

import { useCallback } from "react";
import { useLoginForm } from "@/modules/auth/login/hooks/useLoginForm";
import { Form } from "@/modules/shared/form/Form";
import { FormField } from "@/modules/shared/ui/FormField";
import { Input } from "@/modules/shared/ui/Input";
import { Button } from "@/modules/shared/ui/Button";
import type { LoginSchema } from "@/modules/auth/login/schemas/login.schema";
import { ROUTES } from "@/modules/shared/constants/routes";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const form = useLoginForm();
  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

  const handleLogin = useCallback(
    async (data: LoginSchema) => {
      await new Promise((resolve) => setTimeout(resolve, 750));
      console.log("Login submitted", data);
      router.push(ROUTES.dashboard.panel);
    },
    [router]
  );

  return (
    <Form form={form} onSubmit={handleLogin}>
      <FormField label="Email" htmlFor="email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          placeholder="Ingresa tu email"
          autoComplete="email"
          isInvalid={Boolean(errors.email)}
          {...register("email")}
        />
      </FormField>

      <FormField
        label="Password"
        htmlFor="password"
        error={errors.password?.message}
      >
        <Input
          id="password"
          type="password"
          placeholder="Ingresa tu contraseña"
          autoComplete="current-password"
          isInvalid={Boolean(errors.password)}
          {...register("password")}
        />
      </FormField>

      <div className="text-right">
        <button
          type="button"
          className="text-sm cursor-pointer font-medium text-blue-600 transition-colors hover:text-blue-500"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : "Iniciar sesión"}
      </Button>
    </Form>
  );
}

