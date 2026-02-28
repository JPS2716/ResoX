import { UniversalNavbar } from "../components/UniversalNavbar.jsx";
import { ToastRegion } from "../state/ToastContext.jsx";

export function UniversalAppShell({ children }) {
  return (
    <div className="app-shell">
      <UniversalNavbar />
      <main className="app-main">
        <div className="container">{children}</div>
      </main>
      <ToastRegion />
    </div>
  );
}
