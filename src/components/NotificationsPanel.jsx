import { Link } from "react-router-dom";
import { useDepartmentHead } from "../state/DepartmentHeadContext.jsx";

function fmtWhen(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
  });
}

export function NotificationsPanel({ onClose }) {
  const {
    notifications,
    markAllNotificationsRead,
    markNotificationRead,
  } = useDepartmentHead();

  const incoming = notifications.filter((n) => n.type === "incoming_request");
  const registrar = notifications.filter((n) => n.type === "registrar_update");

  function onItemClick(id) {
    markNotificationRead(id);
    onClose?.();
  }

  return (
    <div className="panel" role="dialog" aria-label="Notifications">
      <div className="panel-header">
        <div className="panel-title">Notifications</div>
        <button
          className="text-button"
          onClick={() => markAllNotificationsRead()}
        >
          Mark all as read
        </button>
      </div>

      <div className="panel-body">
        <div>
          <div className="panel-section-title">Incoming requests</div>
          {incoming.length === 0 ? (
            <div className="notif-item">
              <div className="notif-title">No new requests</div>
              <div className="notif-meta">You’re all caught up.</div>
            </div>
          ) : (
            incoming.slice(0, 6).map((n) => (
              <Link
                key={n.id}
                to={n.link}
                className={`notif-item ${n.read ? "" : "unread"}`}
                onClick={() => onItemClick(n.id)}
              >
                <div className="notif-title">
                  <span>{n.title}</span>
                  <span className="notif-meta">{fmtWhen(n.createdAt)}</span>
                </div>
                <div className="notif-meta">{n.message}</div>
              </Link>
            ))
          )}
        </div>

        <div>
          <div className="panel-section-title">Registrar updates</div>
          {registrar.length === 0 ? (
            <div className="notif-item">
              <div className="notif-title">No updates yet</div>
              <div className="notif-meta">Your submitted requests will appear here.</div>
            </div>
          ) : (
            registrar.slice(0, 6).map((n) => (
              <Link
                key={n.id}
                to={n.link}
                className={`notif-item ${n.read ? "" : "unread"}`}
                onClick={() => onItemClick(n.id)}
              >
                <div className="notif-title">
                  <span>{n.title}</span>
                  <span className="notif-meta">{fmtWhen(n.createdAt)}</span>
                </div>
                <div className="notif-meta">{n.message}</div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

