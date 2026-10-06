function FormErrorList({ error }) {
  if (!error) {
    return null;
  }
  return (
    <div className="auth-message error" role="alert">
      {error.message}
    </div>
  );
}

export default FormErrorList;
