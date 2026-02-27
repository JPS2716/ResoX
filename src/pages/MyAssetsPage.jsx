import { useMemo, useState } from "react";
import { useDepartmentHead } from "../state/DepartmentHeadContext.jsx";
import { useToast } from "../state/ToastContext.jsx";
import { downloadCsv } from "../utils/csv.js";
import { formatDate } from "../utils/format.js";
import { EmptyState } from "../components/EmptyState.jsx";
import { StatusPill } from "../components/StatusPill.jsx";

function computeAvailable(asset) {
  return Math.max(0, asset.totalQty - asset.inUse);
}

export function MyAssetsPage() {
  const { assets, assignments, categories, markAssignmentReturned } =
    useDepartmentHead();
  const { pushToast } = useToast();

  const [category, setCategory] = useState("All");

  const filteredAssets = useMemo(() => {
    if (category === "All") return assets;
    return assets.filter((a) => a.category === category);
  }, [assets, category]);

  const filteredAssignments = useMemo(() => {
    if (category === "All") return assignments;
    const allowed = new Set(
      assets.filter((a) => a.category === category).map((a) => a.name)
    );
    return assignments.filter((a) => allowed.has(a.assetName));
  }, [assignments, assets, category]);

  function onExportCsv() {
    const rows = [];
    rows.push(["Assets I Own"]);
    rows.push(["Asset Name", "Category", "Total Qty", "In Use", "Available"]);
    filteredAssets.forEach((a) => {
      rows.push([a.name, a.category, a.totalQty, a.inUse, computeAvailable(a)]);
    });
    rows.push([]);
    rows.push(["Who I've Assigned To"]);
    rows.push(["Asset Name", "Assigned To", "Role", "Date Assigned", "Return Date", "Status"]);
    filteredAssignments.forEach((a) => {
      rows.push([
        a.assetName,
        a.assignedTo,
        a.role,
        formatDate(a.dateAssigned),
        formatDate(a.returnDate),
        a.status,
      ]);
    });

    downloadCsv({ filename: "department-assets", rows });
    pushToast({ title: "Exported", message: "CSV downloaded successfully." });
  }

  function onReturn(id) {
    const res = markAssignmentReturned(id);
    if (!res.ok) {
      pushToast({ title: "Error", message: res.error || "Unable to mark returned" });
      return;
    }
    pushToast({ title: "Updated", message: "Asset marked as returned and availability updated." });
  }

  return (
    <div>
      <h1 className="page-title">Allocated Assets Overview</h1>
      <p className="page-subtitle">
        View department-owned assets and see who you’ve assigned them to. Returned assets automatically increase availability.
      </p>

      <div className="toolbar">
        <div className="field-row">
          <div className="field w-240">
            <div className="label">Filter by category</div>
            <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="All">All</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button className="btn btn-primary" onClick={onExportCsv}>
          Export to CSV
        </button>
      </div>

      <h2 className="section-title">Section A — Assets I Own</h2>
      {filteredAssets.length === 0 ? (
        <EmptyState
          title="No assets in this category"
          message="Try selecting a different category."
        />
      ) : (
        <table className="table mb-24">
          <thead>
            <tr>
              <th>Asset Name</th>
              <th>Category</th>
              <th>Total Qty</th>
              <th>In Use</th>
              <th>Available</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.map((a) => (
              <tr key={a.name}>
                <td>{a.name}</td>
                <td>{a.category}</td>
                <td>{a.totalQty}</td>
                <td>{a.inUse}</td>
                <td>{computeAvailable(a)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 className="section-title">Section B — Who I've Assigned To</h2>
      {filteredAssignments.length === 0 ? (
        <EmptyState
          title="No assignments found"
          message="Approved requests and manual assignments will show up here."
        />
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Asset Name</th>
              <th>Assigned To</th>
              <th>Role</th>
              <th>Date Assigned</th>
              <th>Return Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssignments.map((a) => (
              <tr key={a.id}>
                <td>{a.assetName}</td>
                <td>{a.assignedTo}</td>
                <td>{a.role}</td>
                <td>{formatDate(a.dateAssigned)}</td>
                <td>{formatDate(a.returnDate)}</td>
                <td>
                  <StatusPill status={a.status} />
                </td>
                <td>
                  {a.status === "Active" ? (
                    <button className="btn btn-ghost btn-small" onClick={() => onReturn(a.id)}>
                      Mark Returned
                    </button>
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

