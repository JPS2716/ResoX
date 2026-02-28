import { useMemo, useState } from "react";
import { useGlobal } from "../../state/GlobalContext.jsx";
import { useToast } from "../../state/ToastContext.jsx";
import { downloadCsv } from "../../utils/csv.js";
import { formatDate } from "../../utils/format.js";
import { EmptyState } from "../../components/EmptyState.jsx";
import { StatusPill } from "../../components/StatusPill.jsx";

export function Inventory() {
  const { currentUser, staffInventory, allocations, markAllocationReturned } = useGlobal();
  const { pushToast } = useToast();

  const [activeTab, setActiveTab] = useState("inventory");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const myInventory = useMemo(() => {
    if (!currentUser) return [];
    let items = staffInventory.filter((i) => i.department === currentUser.department);

    if (categoryFilter !== "All") {
      items = items.filter((i) => i.category === categoryFilter);
    }

    return items;
  }, [staffInventory, currentUser, categoryFilter]);

  const myAllocations = useMemo(() => {
    if (!currentUser) return [];
    return allocations.filter((a) => a.staffId === currentUser.id);
  }, [allocations, currentUser]);

  const categories = useMemo(() => {
    if (!currentUser) return [];
    const set = new Set(
      staffInventory
        .filter((i) => i.department === currentUser.department)
        .map((i) => i.category)
    );
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [staffInventory, currentUser]);

  function onExportInventory() {
    const rows = [];
    rows.push(["Asset Inventory"]);
    rows.push([
      "Asset ID",
      "Asset Name",
      "Category",
      "Total Qty",
      "In Use",
      "Available",
      "Condition",
      "Location",
    ]);
    myInventory.forEach((i) => {
      rows.push([
        i.id,
        i.assetName,
        i.category,
        i.totalQty,
        i.inUse,
        i.totalQty - i.inUse,
        i.condition,
        i.location,
      ]);
    });

    downloadCsv({ filename: "staff-inventory", rows });
    pushToast({ title: "Exported", message: "CSV downloaded successfully" });
  }

  function onMarkReturned(allocationId) {
    const res = markAllocationReturned(allocationId);
    if (!res.ok) {
      pushToast({ title: "Error", message: res.error || "Unable to mark as returned" });
      return;
    }
    pushToast({ title: "Updated", message: "Asset marked as returned" });
  }

  return (
    <div>
      <h1 className="page-title">My Asset Inventory</h1>
      <p className="page-subtitle">
        View and manage all assets allocated to your department. Track allocations and returns.
      </p>

      <div className="toolbar" style={{ marginBottom: "var(--space-5)" }}>
        <div className="field-row">
          <button
            className={`btn ${activeTab === "inventory" ? "btn-primary" : "btn-ghost"} btn-small`}
            onClick={() => setActiveTab("inventory")}
          >
            Inventory
          </button>
          <button
            className={`btn ${activeTab === "allocations" ? "btn-primary" : "btn-ghost"} btn-small`}
            onClick={() => setActiveTab("allocations")}
          >
            Allocation Records
          </button>
        </div>
      </div>

      {activeTab === "inventory" ? (
        <>
          <div className="toolbar">
            <div className="field-row">
              <div className="field w-240">
                <div className="label">Filter by category</div>
                <select
                  className="select"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="All">All</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button className="btn btn-primary" onClick={onExportInventory}>
              Export to CSV
            </button>
          </div>

          {myInventory.length === 0 ? (
            <EmptyState
              title="No assets in inventory"
              message="Assets allocated to your department will appear here."
            />
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Asset ID</th>
                  <th>Asset Name</th>
                  <th>Category</th>
                  <th>Total Qty</th>
                  <th>In Use</th>
                  <th>Available</th>
                  <th>Condition</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {myInventory.map((i) => (
                  <tr key={i.id}>
                    <td>{i.id}</td>
                    <td>{i.assetName}</td>
                    <td>{i.category}</td>
                    <td>{i.totalQty}</td>
                    <td>{i.inUse}</td>
                    <td>{i.totalQty - i.inUse}</td>
                    <td>{i.condition}</td>
                    <td>{i.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      ) : (
        <>
          <h2 className="section-title">Allocation Records</h2>

          {myAllocations.length === 0 ? (
            <EmptyState
              title="No allocation records"
              message="Allocations you make will be tracked here."
            />
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Record ID</th>
                  <th>Asset</th>
                  <th>Allocated To (User)</th>
                  <th>Qty</th>
                  <th>Date Allocated</th>
                  <th>Return Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {myAllocations.map((a) => (
                  <tr key={a.id}>
                    <td>{a.id}</td>
                    <td>{a.assetName}</td>
                    <td>{a.userName}</td>
                    <td>{a.quantity}</td>
                    <td>{formatDate(a.dateAllocated)}</td>
                    <td>{formatDate(a.returnDate)}</td>
                    <td>
                      <StatusPill status={a.status} />
                    </td>
                    <td>
                      {a.status === "Active" ? (
                        <button
                          className="btn btn-ghost btn-small"
                          onClick={() => onMarkReturned(a.id)}
                        >
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
        </>
      )}
    </div>
  );
}
