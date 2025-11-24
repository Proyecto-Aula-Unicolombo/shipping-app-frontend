"use client";

import { memo, useMemo } from "react";
import ReactSelect, { SingleValue } from "react-select";
import { FormField } from "@/modules/shared/ui/FormField";

interface Vehicle {
  ID: number;
  Plate: string;
  Brand: string;
  Model: string;
  VehicleType: string;
}

interface VehicleComboboxProps {
  vehicles: Vehicle[];
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  isLoading?: boolean;
  label?: string;
}

type VehicleOption = {
  value: number;
  label: string;
};

export const VehicleCombobox = memo(function VehicleCombobox({
  vehicles,
  value,
  onChange,
  isLoading = false,
  label = "Vehículo a asignar",
}: VehicleComboboxProps) {
  const options = useMemo<VehicleOption[]>(
    () =>
      vehicles.map((vehicle) => ({
        value: vehicle.ID,
        label: `${vehicle.Plate} - ${vehicle.Brand} ${vehicle.Model} (${vehicle.VehicleType})`,
      })),
    [vehicles]
  );

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value) || null,
    [options, value]
  );

  const handleChange = (newValue: SingleValue<VehicleOption>) => {
    onChange(newValue?.value);
  };

  return (
    <FormField label={label} htmlFor="vehicleId">
      <ReactSelect
        inputId="vehicleId"
        options={options}
        value={selectedOption}
        onChange={handleChange}
        isLoading={isLoading}
        placeholder="Seleccionar vehículo"
        noOptionsMessage={() => "No hay vehículos disponibles"}
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