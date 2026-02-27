export function StatusPill({ status }) {
  const normalized = String(status || "").toLowerCase();
  const cls =
    normalized === "approved" || normalized === "fulfilled"
      ? "status-approved"
      : normalized === "active"
        ? "status-active"
        : normalized === "returned"
          ? "status-returned"
      : normalized === "rejected"
        ? "status-rejected"
        : "status-pending";

  return (
    <span className={`status-pill ${cls}`}>
      <span className="status-dot" aria-hidden="true" />
      {status}
    </span>
  );
}

