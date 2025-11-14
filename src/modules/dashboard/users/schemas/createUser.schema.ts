import { z } from "zod";

export const createUserSchema = z.object({
    // User personal information
    name: z.string().min(1, "El nombre es requerido."),
    lastName: z.string().min(1, "El apellido es requerido."),
    email: z.string().email("Ingresa un email válido."),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
    confirmPassword: z.string().min(1, "Confirma la contraseña."),
    role: z.enum(["coord", "driver", "admin"], {
        message: "Selecciona un rol válido."
    }),
    
    // Optional fields based on role
    phoneNumber: z.string().optional(),
    license: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
}).refine((data) => {
    // If role is conductor, phoneNumber and license are required
    if (data.role === "driver") {
        return data.phoneNumber && data.phoneNumber.length > 0 && data.license && data.license.length > 0;
    }
    return true;
}, {
    message: "Los conductores requieren número de teléfono y licencia.",
    path: ["phoneNumber"],
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;

export const createUserDefaultValues: CreateUserSchema = {
    name: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "coord",
    phoneNumber: "",
    license: "",
};
