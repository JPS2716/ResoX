import { useMemo } from "react";
import { useGlobal } from "../../state/GlobalContext.jsx";
import { formatDate } from "../../utils/format.js";
import { EmptyState } from "../../components/EmptyState.jsx";

export function AdminReports() {
  const { staffInventory, userRequests, allocations } = useGlobal();

  const assetsByDepartment = useMemo(() => {
    const map = {};
    staffInventory.forEach((asset) => {
      if (!map[asset.department]) {
        map[asset.department] = { total: 0, inUse: 0, available: 0 };
      }
      map[asset.department].total += asset.totalQty;
      map[asset.department].inUse += asset.inUse;
      map[asset.department].available += asset.totalQty - asset.inUse;
    });
    return Object.entries(map).map(([dept, data]) => ({ department: dept, ...data }));
  }, [staffInventory]);

  const pendingRequestsByStage = useMemo(() => {
    const map = {};
    userRequests
      .filter((r) => r.status === "Pending" || r.status === "Approved")
      .forEach((r) => {
        if (!map[r.stage]) {
          map[r.stage] = 0;
        }
        map[r.stage]++;
      });
    return Object.entries(map).map(([stage, count]) => ({ stage, count }));
  }, [userRequests]);

  const activeAllocations = useMemo(() => {
    return allocations.filter((a) => a.status === "Active");
  }, [allocations]);

  const overdueReturns = useMemo(() => {
    const now = new Date();
    return allocations.filter((a) => {
      if (a.status !== "Active") return false;
      const returnDate = new Date(a.returnDate);
      return returnDate < now;
    });
  }, [allocations]);

  return (
    <div>
      <h1 className="page-title">Reports</h1>
      <p className="page-subtitle">
        Analytics and insights on asset usage, requests, and allocation trends across the university.
      </p>

      <div className="grid-2" style={{ marginBottom: "var(--space-8)" }}>
        <div className="card">
          <h3 className="card-title">Total Assets by Department</h3>
          {assetsByDepartment.length === 0 ? (
            <EmptyState title="No data" message="No assets in inventory." />
          ) : (
            <table className="table" style={{ marginTop: "var(--space-4)" }}>
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Total</th>
                  <th>In Use</th>
                  <th>Available</th>
                </tr>
              </thead>
              <tbody>
                {assetsByDepartment.map((d) => (
                  <tr key={d.department}>
                    <td>{d.department}</td>
                    <td>{d.total}</td>
                    <td>{d.inUse}</td>
                    <td>{d.available}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card">
          <h3 className="card-title">Pending Requests by Stage</h3>
          {pendingRequestsByStage.length === 0 ? (
            <EmptyState title="No pending requests" message="All requests have been processed." />
          ) : (
            <table className="table" style={{ marginTop: "var(--space-4)" }}>
              <thead>
                <tr>
                  <th>Stage</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequestsByStage.map((s) => (
                  <tr key={s.stage}>
                    <td>{s.stage}</td>
                    <td>{s.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <h2 className="section-title">Assets Currently Out on Allocation</h2>
      {activeAllocations.length === 0 ? (
        <EmptyState
          title="No active allocations"
          message="All assets are currently available."
        />
      ) : (
        <table className="table mb-24">
          <thead>
            <tr>
              <th>Record ID</th>
              <th>Asset</th>
              <th>Allocated To</th>
              <th>Department</th>
              <th>Qty</th>
              <th>Date Allocated</th>
              <th>Expected Return</th>
            </tr>
          </thead>
          <tbody>
            {activeAllocations.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.assetName}</td>
                <td>{a.userName}</td>
                <td>{a.department}</td>
                <td>{a.quantity}</td>
                <td>{formatDate(a.dateAllocated)}</td>
                <td>{formatDate(a.returnDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 className="section-title">Overdue Returns</h2>
      {overdueReturns.length === 0 ? (
        <EmptyState
          title="No overdue returns"
          message="All allocations are on schedule."
        />
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Record ID</th>
              <th>Asset</th>
              <th>Allocated To</th>
              <th>Department</th>
              <th>Qty</th>
              <th>Expected Return</th>
              <th>Days Overdue</th>
            </tr>
          </thead>
          <tbody>
            {overdueReturns.map((a) => {
              const now = new Date();
              const returnDate = new Date(a.returnDate);
              const daysOverdue = Math.floor((now - returnDate) / (1000 * 60 * 60 * 24));
              return (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.assetName}</td>
                  <td>{a.userName}</td>
                  <td>{a.department}</td>
                  <td>{a.quantity}</td>
                  <td>{formatDate(a.returnDate)}</td>
                  <td style={{ color: "rgba(220, 38, 38, 0.95)", fontWeight: 650 }}>
                    {daysOverdue} days
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
