import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "../../state/GlobalContext.jsx";
import { formatDate } from "../../utils/format.js";
import { StatusPill } from "../../components/StatusPill.jsx";
import { EmptyState } from "../../components/EmptyState.jsx";
import { Pagination } from "../../components/Pagination.jsx";
import { useToast } from "../../state/ToastContext.jsx";
import { downloadCsv } from "../../utils/csv.js";

const PAGE_SIZE = 10;

export function AdminRequests() {
  const { userRequests } = useGlobal();
  const { pushToast } = useToast();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState("All");
  const [stageFilter, setStageFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const stages = useMemo(() => {
    const set = new Set(userRequests.map((r) => r.stage));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [userRequests]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = userRequests;

    if (statusFilter !== "All") {
      rows = rows.filter((r) => r.status === statusFilter);
    }
    if (stageFilter !== "All") {
      rows = rows.filter((r) => r.stage === stageFilter);
    }
    if (q) {
      rows = rows.filter((r) => {
        return (
          r.userName.toLowerCase().includes(q) ||
          r.assetName.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q)
        );
      });
    }

    rows = [...rows].sort((a, b) => {
      const da = new Date(a.dateSubmitted).getTime();
      const db = new Date(b.dateSubmitted).getTime();
      return db - da;
    });

    return rows;
  }, [userRequests, search, statusFilter, stageFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function resetToFirstPage() {
    setPage(1);
  }

  function onExport() {
    const rows = [];
    rows.push(["All Requests System-Wide"]);
    rows.push([
      "Request ID",
      "Requested By",
      "Department",
      "Asset",
      "Qty",
      "Date Submitted",
      "Current Stage",
      "Status",
      "Note",
    ]);
    filtered.forEach((r) => {
      rows.push([
        r.id,
        r.userName,
        r.department,
        r.assetName,
        r.quantity,
        formatDate(r.dateSubmitted),
        r.stage,
        r.status,
        r.note || "",
      ]);
    });

    downloadCsv({ filename: "all-requests", rows });
    pushToast({ title: "Exported", message: "CSV downloaded successfully" });
  }

  return (
    <div>
      <h1 className="page-title">Requests</h1>
      <p className="page-subtitle">
        All requests system-wide with complete approval chains. Click on any request to view the full timeline.
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
              placeholder="Search by user, asset, or ID..."
            />
          </div>
          <div className="field w-180">
            <div className="label">Status</div>
            <select
              className="select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                resetToFirstPage();
              }}
            >
              <option>All</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
              <option>Allocated</option>
            </select>
          </div>
          <div className="field w-180">
            <div className="label">Stage</div>
            <select
              className="select"
              value={stageFilter}
              onChange={(e) => {
                setStageFilter(e.target.value);
                resetToFirstPage();
              }}
            >
              <option>All</option>
              {stages.map((s) => (
                <option key={s} value={s}>
                  {s}
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
          title="No requests found"
          message="Try changing your filters or search query."
        />
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Requested By</th>
                <th>Asset</th>
                <th>Qty</th>
                <th>Current Stage</th>
                <th>Status</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((r) => (
                <tr
                  key={r.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/dashboard/admin/requests/${r.id}`)}
                >
                  <td>{r.id}</td>
                  <td>{r.userName}</td>
                  <td>{r.assetName}</td>
                  <td>{r.quantity}</td>
                  <td>{r.stage}</td>
                  <td>
                    <StatusPill status={r.status} />
                  </td>
                  <td>{formatDate(r.dateSubmitted)}</td>
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
