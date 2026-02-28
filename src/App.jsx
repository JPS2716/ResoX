import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { GlobalProvider } from "./state/GlobalContext.jsx";
import { ToastProvider } from "./state/ToastContext.jsx";
import { Login } from "./pages/Login.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { UniversalAppShell } from "./layouts/UniversalAppShell.jsx";

import { UserHome } from "./pages/user/UserHome.jsx";
import { RequestAsset } from "./pages/user/RequestAsset.jsx";

import { StaffHome } from "./pages/staff/StaffHome.jsx";
import { AllocationQueue } from "./pages/staff/AllocationQueue.jsx";
import { Inventory } from "./pages/staff/Inventory.jsx";

import { DeptHeadHome } from "./pages/department-head/DeptHeadHome.jsx";
import { DeptHeadRequests } from "./pages/department-head/DeptHeadRequests.jsx";
import { UnavailabilityAlerts } from "./pages/department-head/UnavailabilityAlerts.jsx";
import { MyAssetsPage } from "./pages/MyAssetsPage.jsx";

import { RegistrarHome } from "./pages/registrar/RegistrarHome.jsx";
import { RegistrarRequests } from "./pages/registrar/RegistrarRequests.jsx";
import { RegistrarHistory } from "./pages/registrar/RegistrarHistory.jsx";

import { AdminHome } from "./pages/admin/AdminHome.jsx";
import { AdminUsers } from "./pages/admin/AdminUsers.jsx";
import { AdminUserDetail } from "./pages/admin/AdminUserDetail.jsx";
import { AdminAssets } from "./pages/admin/AdminAssets.jsx";
import { AdminAssetDetail } from "./pages/admin/AdminAssetDetail.jsx";
import { AdminRequests } from "./pages/admin/AdminRequests.jsx";
import { AdminRequestDetail } from "./pages/admin/AdminRequestDetail.jsx";
import { AdminReports } from "./pages/admin/AdminReports.jsx";

export default function App() {
  return (
    <ToastProvider>
      <GlobalProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/dashboard/user" element={<ProtectedRoute role="User" />}>
              <Route path="" element={<UniversalAppShell><UserHome /></UniversalAppShell>} />
              <Route path="request-asset" element={<UniversalAppShell><RequestAsset /></UniversalAppShell>} />
            </Route>

            <Route path="/dashboard/staff" element={<ProtectedRoute role="Staff" />}>
              <Route path="" element={<UniversalAppShell><StaffHome /></UniversalAppShell>} />
              <Route path="allocation-queue" element={<UniversalAppShell><AllocationQueue /></UniversalAppShell>} />
              <Route path="inventory" element={<UniversalAppShell><Inventory /></UniversalAppShell>} />
            </Route>

            <Route path="/dashboard/department-head" element={<ProtectedRoute role="Department Head" />}>
              <Route path="" element={<UniversalAppShell><DeptHeadHome /></UniversalAppShell>} />
              <Route path="requests" element={<UniversalAppShell><DeptHeadRequests /></UniversalAppShell>} />
              <Route path="unavailability" element={<UniversalAppShell><UnavailabilityAlerts /></UniversalAppShell>} />
              <Route path="my-assets" element={<UniversalAppShell><MyAssetsPage /></UniversalAppShell>} />
            </Route>

            <Route path="/dashboard/registrar" element={<ProtectedRoute role="Registrar" />}>
              <Route path="" element={<UniversalAppShell><RegistrarHome /></UniversalAppShell>} />
              <Route path="requests" element={<UniversalAppShell><RegistrarRequests /></UniversalAppShell>} />
              <Route path="history" element={<UniversalAppShell><RegistrarHistory /></UniversalAppShell>} />
            </Route>

            <Route path="/dashboard/admin" element={<ProtectedRoute role="Admin" />}>
              <Route path="" element={<UniversalAppShell><AdminHome /></UniversalAppShell>} />
              <Route path="users" element={<UniversalAppShell><AdminUsers /></UniversalAppShell>} />
              <Route path="users/:id" element={<UniversalAppShell><AdminUserDetail /></UniversalAppShell>} />
              <Route path="assets" element={<UniversalAppShell><AdminAssets /></UniversalAppShell>} />
              <Route path="assets/:id" element={<UniversalAppShell><AdminAssetDetail /></UniversalAppShell>} />
              <Route path="requests" element={<UniversalAppShell><AdminRequests /></UniversalAppShell>} />
              <Route path="requests/:id" element={<UniversalAppShell><AdminRequestDetail /></UniversalAppShell>} />
              <Route path="reports" element={<UniversalAppShell><AdminReports /></UniversalAppShell>} />
            </Route>

            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </GlobalProvider>
    </ToastProvider>
  );
}
