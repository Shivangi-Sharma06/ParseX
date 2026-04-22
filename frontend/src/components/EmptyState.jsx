export default function EmptyState({ title, subtitle }) {
  return (
    <div className="panel empty">
      <h3>{title}</h3>
      <p>{subtitle}</p>
    </div>
  );
}
