import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { LoginForm } from "@/modules/auth/login/components/LoginForm";
import { LoginTitle } from "@/modules/auth/login/components/LoginTitle";

export function LoginPage() {
  return (
    <AuthLayout>
      <LoginTitle title="Bienvenido a Logistica Express" />
      <LoginForm />
    </AuthLayout>
  );
}
