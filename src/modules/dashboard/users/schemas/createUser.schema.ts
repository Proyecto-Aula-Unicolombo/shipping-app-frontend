import { z } from "zod";

// Schema base compartido
const baseUserSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    lastName: z.string().min(1, "El apellido es requerido"),
    email: z.string().email("Email inválido"),
    role: z.enum(["coord", "driver", "admin"], {
        message: "Selecciona un rol válido",
    }),
    phoneNumber: z.string().optional(),
    license: z.string().optional(),
});

export const createUserSchema = baseUserSchema
    .extend({
        password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
        confirmPassword: z.string().min(1, "Confirma la contraseña"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    })
    .refine(
        (data) => {
            if (data.role === "driver") {
                return !!data.phoneNumber && !!data.license;
            }
            return true;
        },
        {
            message: "Número de teléfono y licencia son requeridos para conductores",
            path: ["phoneNumber"],
        }
    );

export const updateUserSchema = baseUserSchema
    .extend({
        password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").optional().or(z.literal("")),
        confirmPassword: z.string().optional().or(z.literal("")),
    })
    .refine(
        (data) => {
            // Solo validar coincidencia si se ingresó una contraseña
            if (data.password && data.password.length > 0) {
                return data.password === data.confirmPassword;
            }
            return true;
        },
        {
            message: "Las contraseñas no coinciden",
            path: ["confirmPassword"],
        }
    )
    .refine(
        (data) => {
            if (data.role === "driver") {
                return !!data.phoneNumber && !!data.license;
            }
            return true;
        },
        {
            message: "Número de teléfono y licencia son requeridos para conductores",
            path: ["phoneNumber"],
        }
    );

export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

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