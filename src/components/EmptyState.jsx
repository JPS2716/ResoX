export function EmptyState({ title, message }) {
  return (
    <div className="empty">
      <div className="empty-title">{title}</div>
      <div className="empty-msg">{message}</div>
    </div>
  );
}

