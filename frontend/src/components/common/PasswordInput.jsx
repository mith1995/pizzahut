import { forwardRef, useState } from "react";
import AnchorButton from "./AnchorButton";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

const PasswordInput = forwardRef(
  (
    { id, label, labelClass = "", name, forgetPasswordHref, error, ...props },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputid = id || name;

    return (
      <>
        <div className="password-label-row">
          <label htmlFor={inputid} className={labelClass}>
            {label}
          </label>
          {forgetPasswordHref && (
            <AnchorButton
              className="forgot-password-link"
              href={forgetPasswordHref}
            >
              Forgot password?
            </AnchorButton>
          )}
        </div>
        <div className="password-input-wrapper">
          <input
            ref={ref}
            id={inputid}
            name={name}
            className="form-control"
            type={showPassword ? "text" : "password"}
            {...props}
          />

          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
          </button>
        </div>
        {error && (
          <p className="error" role="alert">
            {error.message}
          </p>
        )}
      </>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
