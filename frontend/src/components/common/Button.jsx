function Button({
  className = "btn btn-default",
  type = "button",
  disabled = false,
  onClick,
  children,
}) {
  return (
    <button
      className={className}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
