import { useMemo, useState } from "react";
import { useDepartmentHead } from "../state/DepartmentHeadContext.jsx";
import { useToast } from "../state/ToastContext.jsx";
import { formatDate } from "../utils/format.js";
import { StatusPill } from "../components/StatusPill.jsx";
import { EmptyState } from "../components/EmptyState.jsx";
import { Pagination } from "../components/Pagination.jsx";
import { Modal } from "../components/Modal.jsx";

const PAGE_SIZE = 10;

export function RequestsPage() {
  const { incomingRequests, acceptIncomingRequest, rejectIncomingRequest } =
    useDepartmentHead();
  const { pushToast } = useToast();

  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);

  const [rejecting, setRejecting] = useState(null); // { id, assetName, requestedBy }
  const [rejectReason, setRejectReason] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = incomingRequests;

    if (statusFilter !== "All") {
      rows = rows.filter((r) => r.status === statusFilter);
    }
    if (q) {
      rows = rows.filter((r) => {
        return (
          r.requestedBy.toLowerCase().includes(q) ||
          r.assetName.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q)
        );
      });
    }

    rows = [...rows].sort((a, b) => {
      const da = new Date(a.dateRequested).getTime();
      const db = new Date(b.dateRequested).getTime();
      return sortBy === "newest" ? db - da : da - db;
    });

    return rows;
  }, [incomingRequests, search, sortBy, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function resetToFirstPage() {
    setPage(1);
  }

  function onAccept(id) {
    const res = acceptIncomingRequest(id);
    if (!res.ok) {
      if (res.error === "Asset unavailable") {
        pushToast({ title: "Asset unavailable", message: "Asset unavailable" });
      } else {
        pushToast({ title: "Error", message: res.error || "Unable to approve request" });
      }
      return;
    }
    pushToast({ title: "Approved", message: "Request approved and asset allocated." });
  }

  function openReject(row) {
    setRejecting({ id: row.id, assetName: row.assetName, requestedBy: row.requestedBy });
    setRejectReason("");
  }

  function onConfirmReject() {
    if (!rejecting) return;
    const res = rejectIncomingRequest({ requestId: rejecting.id, reason: rejectReason });
    if (!res.ok) {
      pushToast({ title: "Error", message: res.error || "Unable to reject request" });
      return;
    }
    pushToast({ title: "Rejected", message: "Request rejected with reason." });
    setRejecting(null);
  }

  return (
    <div>
      <h1 className="page-title">Incoming Asset Requests</h1>
      <p className="page-subtitle">
        Review asset requests received by your department and accept or reject based on availability.
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
              placeholder="Search by ID, name, or asset..."
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
            </select>
          </div>
          <div className="field w-180">
            <div className="label">Sort by</div>
            <select
              className="select"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                resetToFirstPage();
              }}
            >
              <option value="newest">Date (newest)</option>
              <option value="oldest">Date (oldest)</option>
            </select>
          </div>
        </div>
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
                <th>Asset Name</th>
                <th>Date Requested</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.requestedBy}</td>
                  <td>{r.assetName}</td>
                  <td>{formatDate(r.dateRequested)}</td>
                  <td>
                    <StatusPill status={r.status} />
                  </td>
                  <td>
                    {r.status === "Pending" ? (
                      <div className="field-row">
                        <button
                          className="btn btn-primary btn-small"
                          onClick={() => onAccept(r.id)}
                        >
                          Accept
                        </button>
                        <button
                          className="btn btn-danger btn-small"
                          onClick={() => openReject(r)}
                        >
                          Reject
                        </button>
                      </div>
                    ) : r.status === "Rejected" && r.rejectionReason ? (
                      <span className="muted-small">{r.rejectionReason}</span>
                    ) : (
                      <span className="muted-small">—</span>
                    )}
                  </td>
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

      {rejecting ? (
        <Modal title="Reject request" onClose={() => setRejecting(null)}>
          <p className="page-subtitle mb-12">
            Provide a short reason for rejecting{" "}
            <strong>{rejecting.requestedBy}</strong>’s request for{" "}
            <strong>{rejecting.assetName}</strong>.
          </p>
          <div className="field">
            <div className="label">Rejection reason</div>
            <textarea
              className="textarea"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reason..."
            />
          </div>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => setRejecting(null)}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={onConfirmReject}>
              Confirm Reject
            </button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}

