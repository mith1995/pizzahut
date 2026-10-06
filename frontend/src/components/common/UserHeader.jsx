function UserHeader({ kicker, title, description }) {
  return (
    <div className="customer-heading">
      <span className="auth-kicker col_1">{kicker}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}

export default UserHeader;
