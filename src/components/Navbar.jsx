import { useEffect, useRef, useState } from "react";
import { NotificationsPanel } from "./NotificationsPanel.jsx";
import { BellIcon } from "./icons.jsx";
import { useDepartmentHead } from "../state/DepartmentHeadContext.jsx";

export function Navbar() {
  const { unreadCount } = useDepartmentHead();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

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

  return (
    <header className="navbar">
      <div className="brand">University Asset Management</div>
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
        {open ? <NotificationsPanel onClose={() => setOpen(false)} /> : null}
      </div>
    </header>
  );
}

