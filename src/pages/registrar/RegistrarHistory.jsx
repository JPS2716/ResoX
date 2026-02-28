import { useMemo, useState } from "react";
import { useGlobal } from "../../state/GlobalContext.jsx";
import { useToast } from "../../state/ToastContext.jsx";
import { downloadCsv } from "../../utils/csv.js";
import { formatDate } from "../../utils/format.js";
import { StatusPill } from "../../components/StatusPill.jsx";
import { EmptyState } from "../../components/EmptyState.jsx";

export function RegistrarHistory() {
  const { registrarRequests } = useGlobal();
  const { pushToast } = useToast();

  const [departmentFilter, setDepartmentFilter] = useState("All");

  const departments = useMemo(() => {
    const set = new Set(registrarRequests.map((r) => r.department));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [registrarRequests]);

  const filtered = useMemo(() => {
    let rows = registrarRequests.filter((r) => r.status !== "Pending");

    if (departmentFilter !== "All") {
      rows = rows.filter((r) => r.department === departmentFilter);
    }

    rows = [...rows].sort((a, b) => {
      const da = new Date(a.dateForwarded).getTime();
      const db = new Date(b.dateForwarded).getTime();
      return db - da;
    });

    return rows;
  }, [registrarRequests, departmentFilter]);

  function onExport() {
    const rows = [];
    rows.push(["Registrar Request History"]);
    rows.push([
      "Request ID",
      "Forwarded By",
      "Department",
      "Original User",
      "Asset",
      "Qty",
      "Urgency",
      "Date Forwarded",
      "Status",
      "Rejection Reason",
    ]);
    filtered.forEach((r) => {
      rows.push([
        r.id,
        r.forwardedByName,
        r.department,
        r.originalUserName,
        r.assetName,
        r.quantity,
        r.urgency,
        formatDate(r.dateForwarded),
        r.status,
        r.rejectionReason || "",
      ]);
    });

    downloadCsv({ filename: "registrar-history", rows });
    pushToast({ title: "Exported", message: "CSV downloaded successfully" });
  }

  return (
    <div>
      <h1 className="page-title">Request History</h1>
      <p className="page-subtitle">
        View all past decisions on asset requests. Export data for reporting and analysis.
      </p>

      <div className="toolbar">
        <div className="field-row">
          <div className="field w-240">
            <div className="label">Filter by department</div>
            <select
              className="select"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option>All</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button className="btn btn-primary" onClick={onExport}>
          Export to CSV
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No history records"
          message="Completed requests will appear here."
        />
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Forwarded By</th>
              <th>Department</th>
              <th>Asset</th>
              <th>Qty</th>
              <th>Date Forwarded</th>
              <th>Status</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.forwardedByName}</td>
                <td>{r.department}</td>
                <td>{r.assetName}</td>
                <td>{r.quantity}</td>
                <td>{formatDate(r.dateForwarded)}</td>
                <td>
                  <StatusPill status={r.status} />
                </td>
                <td>
                  {r.rejectionReason ? (
                    <span className="muted-small">{r.rejectionReason}</span>
                  ) : (
                    <span className="muted-small">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
