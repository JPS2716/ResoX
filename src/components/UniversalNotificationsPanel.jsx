import { Link } from "react-router-dom";
import { useGlobal } from "../state/GlobalContext.jsx";

function fmtWhen(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
  });
}

export function UniversalNotificationsPanel({ onClose, notifications }) {
  const { markAllNotificationsRead, markNotificationRead, currentUser } = useGlobal();

  function onItemClick(id) {
    markNotificationRead(id);
    onClose?.();
  }

  function onMarkAllRead() {
    if (currentUser) {
      markAllNotificationsRead(currentUser.id);
    }
  }

  return (
    <div className="panel" role="dialog" aria-label="Notifications">
      <div className="panel-header">
        <div className="panel-title">Notifications</div>
        <button className="text-button" onClick={onMarkAllRead}>
          Mark all as read
        </button>
      </div>

      <div className="panel-body">
        {notifications.length === 0 ? (
          <div className="notif-item">
            <div className="notif-title">No notifications</div>
            <div className="notif-meta">You're all caught up.</div>
          </div>
        ) : (
          notifications.slice(0, 8).map((n) => (
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
  );
}
