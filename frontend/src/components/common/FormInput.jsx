import { forwardRef } from "react";

const FormInput = forwardRef(
  ({ label, name, error, labelClass = "", ...props }, ref) => {
    const inputId = props.id || name;

    return (
      <>
        <label htmlFor={inputId} className={labelClass}>
          {label}
        </label>

        <input
          ref={ref}
          id={inputId}
          name={name}
          className="form-control"
          {...props}
        />

        {error && (
          <p className="error" role="alert">
            {error.message}
          </p>
        )}
      </>
    );
  },
);

FormInput.displayName = "FormInput";

export default FormInput;
