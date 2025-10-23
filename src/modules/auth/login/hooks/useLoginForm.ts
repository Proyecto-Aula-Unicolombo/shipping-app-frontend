import { useForm, type UseFormProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginDefaultValues, loginSchema, type LoginSchema } from "@/modules/auth/login/schemas/login.schema";

export function useLoginForm(options?: UseFormProps<LoginSchema>) {
    return useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: loginDefaultValues,
        mode: "onBlur",
        ...options,
    });
}
