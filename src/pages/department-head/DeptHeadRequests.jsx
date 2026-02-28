import { useMemo, useState } from "react";
import { useGlobal } from "../../state/GlobalContext.jsx";
import { useToast } from "../../state/ToastContext.jsx";
import { formatDate } from "../../utils/format.js";
import { StatusPill } from "../../components/StatusPill.jsx";
import { EmptyState } from "../../components/EmptyState.jsx";
import { Pagination } from "../../components/Pagination.jsx";
import { Modal } from "../../components/Modal.jsx";

const PAGE_SIZE = 10;

export function DeptHeadRequests() {
  const { currentUser, userRequests, approveUserRequest, rejectUserRequest } = useGlobal();
  const { pushToast } = useToast();

  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);

  const [rejecting, setRejecting] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const filtered = useMemo(() => {
    if (!currentUser) return [];

    const q = search.trim().toLowerCase();
    let rows = userRequests.filter((r) => r.department === currentUser.department);

    if (statusFilter !== "All") {
      rows = rows.filter((r) => r.status === statusFilter);
    }
    if (q) {
      rows = rows.filter((r) => {
        return (
          r.userName.toLowerCase().includes(q) ||
          r.assetName.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q)
        );
      });
    }

    rows = [...rows].sort((a, b) => {
      const da = new Date(a.dateSubmitted).getTime();
      const db = new Date(b.dateSubmitted).getTime();
      return sortBy === "newest" ? db - da : da - db;
    });

    return rows;
  }, [userRequests, currentUser, search, sortBy, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function resetToFirstPage() {
    setPage(1);
  }

  function onApprove(id) {
    if (!currentUser) return;

    const res = approveUserRequest(id, currentUser.id);
    if (!res.ok) {
      pushToast({ title: "Error", message: res.error || "Unable to approve request" });
      return;
    }
    pushToast({ title: "Approved", message: "Request approved and forwarded to staff for allocation" });
  }

  function openReject(row) {
    setRejecting({ id: row.id, assetName: row.assetName, userName: row.userName });
    setRejectReason("");
  }

  function onConfirmReject() {
    if (!rejecting || !currentUser) return;
    const res = rejectUserRequest(rejecting.id, currentUser.id, rejectReason);
    if (!res.ok) {
      pushToast({ title: "Error", message: res.error || "Unable to reject request" });
      return;
    }
    pushToast({ title: "Rejected", message: "Request rejected with reason" });
    setRejecting(null);
  }

  return (
    <div>
      <h1 className="page-title">Incoming User Requests</h1>
      <p className="page-subtitle">
        Review asset requests received from users in your department and approve or reject them.
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
              <option>Allocated</option>
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
                <th>Requested By (User)</th>
                <th>Asset Name</th>
                <th>Qty</th>
                <th>Date Requested</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.userName}</td>
                  <td>{r.assetName}</td>
                  <td>{r.quantity}</td>
                  <td>{formatDate(r.dateSubmitted)}</td>
                  <td>
                    <StatusPill status={r.status} />
                  </td>
                  <td>
                    {r.status === "Pending" ? (
                      <div className="field-row">
                        <button
                          className="btn btn-primary btn-small"
                          onClick={() => onApprove(r.id)}
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
                    ) : r.status === "Rejected" && r.note ? (
                      <span className="muted-small">{r.note}</span>
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
            <strong>{rejecting.userName}</strong>'s request for{" "}
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
