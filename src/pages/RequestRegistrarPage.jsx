import { useMemo, useState } from "react";
import { useDepartmentHead } from "../state/DepartmentHeadContext.jsx";
import { useToast } from "../state/ToastContext.jsx";
import { formatDate } from "../utils/format.js";
import { StatusPill } from "../components/StatusPill.jsx";
import { EmptyState } from "../components/EmptyState.jsx";

export function RequestRegistrarPage() {
  const { registrarRequests, submitRegistrarRequest } = useDepartmentHead();
  const { pushToast } = useToast();

  const [assetType, setAssetType] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [justification, setJustification] = useState("");
  const [urgency, setUrgency] = useState("Low");
  const [dateNeededBy, setDateNeededBy] = useState("");

  const myRequests = useMemo(() => registrarRequests, [registrarRequests]);

  function onSubmit(e) {
    e.preventDefault();
    const res = submitRegistrarRequest({
      assetType,
      quantity,
      justification,
      urgency,
      dateNeededBy,
    });
    if (!res.ok) {
      pushToast({ title: "Error", message: res.error || "Unable to submit request" });
      return;
    }

    pushToast({ title: "Success", message: "Request sent to Registrar" });
    setAssetType("");
    setQuantity(1);
    setJustification("");
    setUrgency("Low");
    setDateNeededBy("");
  }

  return (
    <div>
      <h1 className="page-title">Request Resources from Registrar</h1>
      <p className="page-subtitle">
        Submit a resource request upward. After submitting, you can track its status below.
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
                placeholder="e.g., Laptop"
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
              />
            </div>
            <div className="field">
              <div className="label">Urgency Level</div>
              <select
                className="select"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <div className="field">
              <div className="label">Date Needed By</div>
              <input
                className="input"
                type="date"
                value={dateNeededBy}
                onChange={(e) => setDateNeededBy(e.target.value)}
              />
            </div>
          </div>

          <div className="field mt-12">
            <div className="label">Justification / Reason</div>
            <textarea
              className="textarea"
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Explain why you need these resources..."
            />
          </div>

          <div className="modal-actions">
            <button className="btn btn-primary" type="submit">
              Submit Request
            </button>
          </div>
        </form>
      </div>

      <h2 className="section-title">My Submitted Requests</h2>

      {myRequests.length === 0 ? (
        <EmptyState
          title="No submitted requests"
          message="Submit a request above to see it listed here."
        />
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Qty</th>
              <th>Urgency</th>
              <th>Date Submitted</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {myRequests.map((r) => (
              <tr key={r.id}>
                <td>{r.assetType}</td>
                <td>{r.quantity}</td>
                <td>{r.urgency}</td>
                <td>{formatDate(r.dateSubmitted)}</td>
                <td>
                  <StatusPill status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

