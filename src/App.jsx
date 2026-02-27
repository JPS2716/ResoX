import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./layouts/AppShell.jsx";
import { DepartmentHeadProvider } from "./state/DepartmentHeadContext.jsx";
import { ToastProvider } from "./state/ToastContext.jsx";
import { DashboardHome } from "./pages/DashboardHome.jsx";
import { RequestsPage } from "./pages/RequestsPage.jsx";
import { RequestRegistrarPage } from "./pages/RequestRegistrarPage.jsx";
import { MyAssetsPage } from "./pages/MyAssetsPage.jsx";

export default function App() {
  return (
    <ToastProvider>
      <DepartmentHeadProvider>
        <BrowserRouter>
          <AppShell>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardHome />} />
              <Route path="/requests" element={<RequestsPage />} />
              <Route path="/request-registrar" element={<RequestRegistrarPage />} />
              <Route path="/my-assets" element={<MyAssetsPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AppShell>
        </BrowserRouter>
      </DepartmentHeadProvider>
    </ToastProvider>
  );
}
