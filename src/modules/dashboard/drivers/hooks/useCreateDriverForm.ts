import { useForm, type UseFormProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
    createDriverDefaultValues, 
    createDriverSchema, 
    type CreateDriverSchema 
} from "../schemas/createDriver.schema";

export function useCreateDriverForm(options?: UseFormProps<CreateDriverSchema>) {
    return useForm<CreateDriverSchema>({
        resolver: zodResolver(createDriverSchema),
        defaultValues: createDriverDefaultValues,
        mode: "onBlur",
        ...options,
    });
}
