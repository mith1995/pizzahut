import { Controller } from "react-hook-form";
import AsyncSelect from "react-select/async";

function FormLocationAsyncSelect({
  label,
  name,
  control,
  options = true,
  loadOptions,
  error,
  placeholder = "Select...",
  isDisabled = false,
  isClearable = false,
  onChange,
}) {
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <AsyncSelect
            {...field}
            inputId={name}
            cacheOptions
            defaultOptions={options}
            loadOptions={loadOptions}
            placeholder={placeholder}
            classNamePrefix="pizza-select"
            isDisabled={isDisabled}
            isClearable={isClearable}
            onChange={(option) => {
              field.onChange(option);
              onChange?.(option);
            }}
          />
        )}
      />
      {error && (
        <p className="error" role="alert">
          {error.message}
        </p>
      )}
    </>
  );
}

export default FormLocationAsyncSelect;
