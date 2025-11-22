"use client";

import { memo, useMemo } from "react";
import ReactSelect, { SingleValue } from "react-select";
import { FormField } from "@/modules/shared/ui/FormField";

interface Driver {
    ID: number;
    Name: string;
    LastName: string;
    License: string;
}

interface DriverComboboxProps {
    drivers: Driver[];
    value: number | undefined;
    onChange: (value: number | undefined) => void;
    isLoading?: boolean;
}

type DriverOption = {
    value: number;
    label: string;
};

export const DriverCombobox = memo(function DriverCombobox({
    drivers,
    value,
    onChange,
    isLoading = false,
}: DriverComboboxProps) {
    const options = useMemo<DriverOption[]>(
        () =>
            drivers.map((driver) => ({
                value: driver.ID,
                label: `${driver.Name} ${driver.LastName} - ${driver.License}`,
            })),
        [drivers]
    );

    const selectedOption = useMemo(
        () => options.find((opt) => opt.value === value) || null,
        [options, value]
    );

    const handleChange = (newValue: SingleValue<DriverOption>) => {
        onChange(newValue?.value);
    };

    return (
        <FormField label="Conductor Asignado" htmlFor="driverId">
            <ReactSelect
                inputId="driverId"
                options={options}
                value={selectedOption}
                onChange={handleChange}
                isLoading={isLoading}
                placeholder="Seleccionar conductor"
                noOptionsMessage={() => "No hay conductores disponibles"}
                isSearchable
                styles={{
                    control: (base, state) => ({
                        ...base,
                        minHeight: "42px",
                        borderColor: state.isFocused ? "#3b82f6" : "#cbd5e1",
                        boxShadow: state.isFocused ? "0 0 0 4px rgba(59, 130, 246, 0.1)" : "none",
                        "&:hover": {
                            borderColor: "#3b82f6",
                        },
                    }),
                    option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isSelected
                            ? "#3b82f6"
                            : state.isFocused
                                ? "#eff6ff"
                                : "white",
                        color: state.isSelected ? "white" : "#334155",
                        cursor: "pointer",
                    }),
                }}
            />
        </FormField>
    );
});