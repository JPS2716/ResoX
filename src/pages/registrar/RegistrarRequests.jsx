import { useMemo, useState } from "react";
import { useGlobal } from "../../state/GlobalContext.jsx";
import { useToast } from "../../state/ToastContext.jsx";
import { formatDate } from "../../utils/format.js";
import { StatusPill } from "../../components/StatusPill.jsx";
import { EmptyState } from "../../components/EmptyState.jsx";
import { Pagination } from "../../components/Pagination.jsx";
import { Modal } from "../../components/Modal.jsx";

const PAGE_SIZE = 10;

export function RegistrarRequests() {
  const { currentUser, registrarRequests, approveRegistrarRequest, rejectRegistrarRequest } =
    useGlobal();
  const { pushToast } = useToast();

  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [rejecting, setRejecting] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const departments = useMemo(() => {
    const set = new Set(registrarRequests.map((r) => r.department));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [registrarRequests]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = registrarRequests;

    if (statusFilter !== "All") {
      rows = rows.filter((r) => r.status === statusFilter);
    }
    if (departmentFilter !== "All") {
      rows = rows.filter((r) => r.department === departmentFilter);
    }
    if (q) {
      rows = rows.filter((r) => {
        return (
          r.forwardedByName.toLowerCase().includes(q) ||
          r.assetName.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q)
        );
      });
    }

    rows = [...rows].sort((a, b) => {
      const da = new Date(a.dateForwarded).getTime();
      const db = new Date(b.dateForwarded).getTime();
      return db - da;
    });

    return rows;
  }, [registrarRequests, search, statusFilter, departmentFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function resetToFirstPage() {
    setPage(1);
  }

  function onApprove(id) {
    if (!currentUser) return;

    const res = approveRegistrarRequest(id, currentUser.id);
    if (!res.ok) {
      pushToast({ title: "Error", message: res.error || "Unable to approve request" });
      return;
    }
    pushToast({
      title: "Approved",
      message: "Request approved and assets added to staff inventory",
    });
  }

  function openReject(row) {
    setRejecting({
      id: row.id,
      assetName: row.assetName,
      forwardedByName: row.forwardedByName,
    });
    setRejectReason("");
  }

  function onConfirmReject() {
    if (!rejecting || !currentUser) return;

    const res = rejectRegistrarRequest(rejecting.id, currentUser.id, rejectReason);
    if (!res.ok) {
      pushToast({ title: "Error", message: res.error || "Unable to reject request" });
      return;
    }
    pushToast({ title: "Rejected", message: "Request rejected with reason" });
    setRejecting(null);
  }

  return (
    <div>
      <h1 className="page-title">Incoming Requests</h1>
      <p className="page-subtitle">
        Review asset requests forwarded by Department Heads. Approved assets are automatically added to staff inventory.
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
              placeholder="Search by asset or department..."
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
                <th>Forwarded By</th>
                <th>Department</th>
                <th>Original User</th>
                <th>Asset</th>
                <th>Qty</th>
                <th>Urgency</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.forwardedByName}</td>
                  <td>{r.department}</td>
                  <td>{r.originalUserName}</td>
                  <td>{r.assetName}</td>
                  <td>{r.quantity}</td>
                  <td>{r.urgency}</td>
                  <td>{formatDate(r.dateForwarded)}</td>
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
                          Approve
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
            Provide a reason for rejecting the request for{" "}
            <strong>{rejecting.assetName}</strong> from{" "}
            <strong>{rejecting.forwardedByName}</strong>.
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
