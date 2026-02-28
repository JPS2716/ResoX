import { useMemo, useState } from "react";
import { useGlobal } from "../../state/GlobalContext.jsx";
import { useToast } from "../../state/ToastContext.jsx";
import { formatDate } from "../../utils/format.js";
import { StatusPill } from "../../components/StatusPill.jsx";
import { EmptyState } from "../../components/EmptyState.jsx";

export function RequestAsset() {
  const { currentUser, userRequests, submitUserRequest } = useGlobal();
  const { pushToast } = useToast();

  const [assetType, setAssetType] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState("");
  const [dateNeeded, setDateNeeded] = useState("");

  const myRequests = useMemo(() => {
    if (!currentUser) return [];
    return userRequests.filter((r) => r.userId === currentUser.id);
  }, [userRequests, currentUser]);

  function onSubmit(e) {
    e.preventDefault();

    if (!currentUser) {
      pushToast({ title: "Error", message: "You must be logged in" });
      return;
    }

    const res = submitUserRequest({
      userId: currentUser.id,
      userName: currentUser.name,
      department: currentUser.department,
      assetName: assetType,
      quantity,
      reason,
      dateNeeded,
    });

    if (!res.ok) {
      pushToast({ title: "Error", message: res.error || "Unable to submit request" });
      return;
    }

    pushToast({ title: "Success", message: "Request submitted to Department Head" });
    setAssetType("");
    setQuantity(1);
    setReason("");
    setDateNeeded("");
  }

  return (
    <div>
      <h1 className="page-title">Request an Asset</h1>
      <p className="page-subtitle">
        Submit a new asset request to your department head. Track the status of all your requests below.
      </p>

      <div className="card mb-24">
        <form onSubmit={onSubmit}>
          <div className="grid-2">
            <div className="field">
              <div className="label">Asset Type</div>
              <input
                className="input"
                value={assetType}
                onChange={(e) => setAssetType(e.target.value)}
                placeholder="e.g., Laptop, Projector"
                required
              />
            </div>
            <div className="field">
              <div className="label">Quantity Needed</div>
              <input
                className="input"
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <div className="label">Date Needed By</div>
              <input
                className="input"
                type="date"
                value={dateNeeded}
                onChange={(e) => setDateNeeded(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="field mt-12">
            <div className="label">Reason / Purpose</div>
            <textarea
              className="textarea"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why you need this asset..."
              required
            />
          </div>

          <div className="modal-actions">
            <button className="btn btn-primary" type="submit">
              Submit Request
            </button>
          </div>
        </form>
      </div>

      <h2 className="section-title">My Requests</h2>

      {myRequests.length === 0 ? (
        <EmptyState
          title="No requests submitted"
          message="Submit a request above to see it listed here."
        />
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Asset</th>
              <th>Qty</th>
              <th>Date Submitted</th>
              <th>Status</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {myRequests.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.assetName}</td>
                <td>{r.quantity}</td>
                <td>{formatDate(r.dateSubmitted)}</td>
                <td>
                  <StatusPill status={r.status} />
                </td>
                <td>
                  {r.note ? (
                    <span className="muted-small">{r.note}</span>
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
