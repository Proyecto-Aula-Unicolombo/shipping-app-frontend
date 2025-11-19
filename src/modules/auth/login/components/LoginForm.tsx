"use client";

import { useCallback } from "react";
import { useLoginForm } from "@/modules/auth/login/hooks/useLoginForm";
import { Form } from "@/modules/shared/form/Form";
import { FormField } from "@/modules/shared/ui/FormField";
import { Input } from "@/modules/shared/ui/Input";
import { Button } from "@/modules/shared/ui/Button";
import type { LoginSchema } from "@/modules/auth/login/schemas/login.schema";
import { useAuthQuery } from "../hooks/useAuthQuery";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/modules/shared/constants/routes";

export function LoginForm() {
  const router = useRouter();
  const form = useLoginForm();
  const { loginAsync, isLoggingIn, loginError } = useAuthQuery();

  const {
    register,
    formState: { errors },
  } = form;

  const handleLogin = useCallback(
    async (data: LoginSchema) => {
      try {
        const response = await loginAsync({
          email: data.email,
          password: data.password,
        });

        if (response.user.role === 'driver') {
          router.push(ROUTES.driver.orders);
        } else {
          router.push(ROUTES.dashboard.panel);
        }
      } catch (error) {
        console.error("Login failed:", error);
      }
    },
    [loginAsync, router]
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

      {/* Mostrar error de login */}
      {loginError && (
        <div className="rounded-lg bg-red-50 p-3">
          <p className="text-sm text-red-700">
            {loginError instanceof Error
              ? loginError.message
              : 'Error al iniciar sesión. Verifica tus credenciales.'}
          </p>
        </div>
      )}

      <div className="text-right">
        <button
          type="button"
          className="text-sm cursor-pointer font-medium text-blue-600 transition-colors hover:text-blue-500"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <Button type="submit" className="w-full" disabled={isLoggingIn}>
        {isLoggingIn ? "Iniciando sesión..." : "Iniciar sesión"}
      </Button>
    </Form>
  );
}