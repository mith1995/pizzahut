function BoxCard({ total, label }) {
  return (
    <div class="stat-box">
      <strong>{total}</strong>
      <span>{label}</span>
    </div>
  );
}

export default BoxCard;
