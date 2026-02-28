import { useMemo } from "react";
import { useGlobal } from "../../state/GlobalContext.jsx";
import { useToast } from "../../state/ToastContext.jsx";
import { formatDate } from "../../utils/format.js";
import { StatusPill } from "../../components/StatusPill.jsx";
import { EmptyState } from "../../components/EmptyState.jsx";

export function UnavailabilityAlerts() {
  const { currentUser, unavailabilityAlerts, registrarRequests, forwardToRegistrar } = useGlobal();
  const { pushToast } = useToast();

  const myAlerts = useMemo(() => {
    if (!currentUser) return [];
    return unavailabilityAlerts.filter((a) => a.department === currentUser.department);
  }, [unavailabilityAlerts, currentUser]);

  const myForwardedRequests = useMemo(() => {
    if (!currentUser) return [];
    return registrarRequests.filter((r) => r.forwardedBy === currentUser.id);
  }, [registrarRequests, currentUser]);

  function onForward(alertId) {
    if (!currentUser) return;

    const res = forwardToRegistrar(alertId, currentUser.id, currentUser.name);
    if (!res.ok) {
      pushToast({ title: "Error", message: res.error || "Unable to forward request" });
      return;
    }

    pushToast({ title: "Forwarded", message: "Request forwarded to Registrar" });
  }

  return (
    <div>
      <h1 className="page-title">Staff Unavailability Alerts</h1>
      <p className="page-subtitle">
        When staff reports an asset as unavailable, it appears here. You can forward these requests to the Registrar for procurement.
      </p>

      <h2 className="section-title">Pending Alerts</h2>

      {myAlerts.length === 0 ? (
        <EmptyState
          title="No alerts"
          message="Staff will notify you when assets are unavailable."
        />
      ) : (
        <table className="table mb-24">
          <thead>
            <tr>
              <th>Alert ID</th>
              <th>User</th>
              <th>Asset</th>
              <th>Qty</th>
              <th>Reported By</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {myAlerts.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.userName}</td>
                <td>{a.assetName}</td>
                <td>{a.quantity}</td>
                <td>{a.staffName}</td>
                <td>{formatDate(a.dateReported)}</td>
                <td>
                  <StatusPill status={a.status} />
                </td>
                <td>
                  {a.status === "Pending" && !a.forwardedToRegistrar ? (
                    <button
                      className="btn btn-primary btn-small"
                      onClick={() => onForward(a.id)}
                    >
                      Forward to Registrar
                    </button>
                  ) : (
                    <span className="muted-small">Forwarded</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 className="section-title">Forwarded to Registrar</h2>

      {myForwardedRequests.length === 0 ? (
        <EmptyState
          title="No forwarded requests"
          message="Requests you forward to the Registrar will appear here."
        />
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Original User</th>
              <th>Asset</th>
              <th>Qty</th>
              <th>Date Forwarded</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {myForwardedRequests.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.originalUserName}</td>
                <td>{r.assetName}</td>
                <td>{r.quantity}</td>
                <td>{formatDate(r.dateForwarded)}</td>
                <td>
                  <StatusPill status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
