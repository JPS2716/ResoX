import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BellIcon } from "./icons.jsx";
import { useGlobal } from "../state/GlobalContext.jsx";
import { UniversalNotificationsPanel } from "./UniversalNotificationsPanel.jsx";

export function UniversalNavbar() {
  const { currentUser, notifications, logout } = useGlobal();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const userNotifications = useMemo(() => {
    if (!currentUser) return [];
    return notifications.filter((n) => n.userId === currentUser.id);
  }, [notifications, currentUser]);

  const unreadCount = useMemo(() => {
    return userNotifications.filter((n) => !n.read).length;
  }, [userNotifications]);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    function onPointerDown(e) {
      const el = wrapRef.current;
      if (!el) return;
      if (!el.contains(e.target)) setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  if (!currentUser) return null;

  return (
    <header className="navbar">
      <div className="brand">University Asset Management</div>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
        <span style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.82)" }}>
          {currentUser.name}
        </span>
        <div className="bell-wrap" ref={wrapRef}>
          <button
            className="icon-button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Open notifications"
            aria-expanded={open}
          >
            <BellIcon />
            {unreadCount > 0 ? <span className="badge">{unreadCount}</span> : null}
          </button>
          {open ? (
            <UniversalNotificationsPanel
              onClose={() => setOpen(false)}
              notifications={userNotifications}
            />
          ) : null}
        </div>
        <button className="btn btn-ghost btn-small" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
