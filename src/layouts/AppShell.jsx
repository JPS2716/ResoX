import { Navbar } from "../components/Navbar.jsx";
import { ToastRegion } from "../state/ToastContext.jsx";

export function AppShell({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <div className="container">{children}</div>
      </main>
      <ToastRegion />
    </div>
  );
}

