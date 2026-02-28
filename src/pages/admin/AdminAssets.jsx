import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "../../state/GlobalContext.jsx";
import { EmptyState } from "../../components/EmptyState.jsx";
import { Pagination } from "../../components/Pagination.jsx";
import { useToast } from "../../state/ToastContext.jsx";
import { downloadCsv } from "../../utils/csv.js";

const PAGE_SIZE = 10;

export function AdminAssets() {
  const { staffInventory } = useGlobal();
  const { pushToast } = useToast();
  const navigate = useNavigate();

  const [categoryFilter, setCategoryFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const categories = useMemo(() => {
    const set = new Set(staffInventory.map((a) => a.category));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [staffInventory]);

  const departments = useMemo(() => {
    const set = new Set(staffInventory.map((a) => a.department));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [staffInventory]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = staffInventory;

    if (categoryFilter !== "All") {
      rows = rows.filter((a) => a.category === categoryFilter);
    }
    if (departmentFilter !== "All") {
      rows = rows.filter((a) => a.department === departmentFilter);
    }
    if (q) {
      rows = rows.filter((a) => {
        return (
          a.assetName.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q)
        );
      });
    }

    return rows;
  }, [staffInventory, search, categoryFilter, departmentFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function resetToFirstPage() {
    setPage(1);
  }

  function onExport() {
    const rows = [];
    rows.push(["Master Asset Inventory"]);
    rows.push([
      "Asset ID",
      "Asset Name",
      "Category",
      "Total Qty",
      "In Use",
      "Available",
      "Department",
      "Condition",
      "Location",
    ]);
    filtered.forEach((a) => {
      rows.push([
        a.id,
        a.assetName,
        a.category,
        a.totalQty,
        a.inUse,
        a.totalQty - a.inUse,
        a.department,
        a.condition,
        a.location,
      ]);
    });

    downloadCsv({ filename: "master-asset-inventory", rows });
    pushToast({ title: "Exported", message: "CSV downloaded successfully" });
  }

  return (
    <div>
      <h1 className="page-title">Assets</h1>
      <p className="page-subtitle">
        Master inventory of all assets across all departments. Click on any asset to view details.
      </p>

      <div className="toolbar">
        <div className="field-row">
          <div className="field w-240">
            <div className="label">Search</div>
            <input
              className="input"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                resetToFirstPage();
              }}
              placeholder="Search by name, ID, or location..."
            />
          </div>
          <div className="field w-180">
            <div className="label">Category</div>
            <select
              className="select"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                resetToFirstPage();
              }}
            >
              <option>All</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="field w-180">
            <div className="label">Department</div>
            <select
              className="select"
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                resetToFirstPage();
              }}
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
        <EmptyState title="No assets found" message="Try changing your filters or search query." />
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Asset ID</th>
                <th>Asset Name</th>
                <th>Category</th>
                <th>Total Qty</th>
                <th>In Use</th>
                <th>Available</th>
                <th>Department</th>
                <th>Condition</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((a) => (
                <tr
                  key={a.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/dashboard/admin/assets/${a.id}`)}
                >
                  <td>{a.id}</td>
                  <td>{a.assetName}</td>
                  <td>{a.category}</td>
                  <td>{a.totalQty}</td>
                  <td>{a.inUse}</td>
                  <td>{a.totalQty - a.inUse}</td>
                  <td>{a.department}</td>
                  <td>{a.condition}</td>
                  <td>{a.location}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            page={safePage}
            pageCount={pageCount}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(pageCount, p + 1))}
          />
        </>
      )}
    </div>
  );
}
