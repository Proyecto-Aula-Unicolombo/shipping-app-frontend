import { z } from "zod";

export const loginSchema = z.object({
    email: z.email("Ingresa un email válido."),
    password: z.string().min(1, "La contraseña es requerida."),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const loginDefaultValues: LoginSchema = {
    email: "",
    password: "",
};
