import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobal } from "../../state/GlobalContext.jsx";
import { formatDate } from "../../utils/format.js";
import { StatusPill } from "../../components/StatusPill.jsx";
import { EmptyState } from "../../components/EmptyState.jsx";

export function AdminAssetDetail() {
  const { id } = useParams();
  const { staffInventory, allocations } = useGlobal();
  const navigate = useNavigate();

  const asset = useMemo(() => {
    return staffInventory.find((a) => a.id === id);
  }, [staffInventory, id]);

  const assetAllocations = useMemo(() => {
    if (!asset) return [];
    return allocations.filter((a) => a.assetId === asset.id);
  }, [allocations, asset]);

  const currentAllocations = useMemo(() => {
    return assetAllocations.filter((a) => a.status === "Active");
  }, [assetAllocations]);

  if (!asset) {
    return (
      <div>
        <h1 className="page-title">Asset Not Found</h1>
        <p className="page-subtitle">The asset with ID {id} could not be found.</p>
        <button className="btn btn-primary" onClick={() => navigate("/dashboard/admin/assets")}>
          Back to Assets
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        className="btn btn-ghost btn-small"
        onClick={() => navigate("/dashboard/admin/assets")}
        style={{ marginBottom: "var(--space-4)" }}
      >
        ← Back to Assets
      </button>

      <h1 className="page-title">{asset.assetName}</h1>
      <p className="page-subtitle">Asset details and allocation history</p>

      <div className="card mb-24">
        <h3 className="card-title">Asset Details</h3>
        <div className="grid-2" style={{ marginTop: "var(--space-4)" }}>
          <div className="field">
            <div className="label">Asset ID</div>
            <div>{asset.id}</div>
          </div>
          <div className="field">
            <div className="label">Asset Name</div>
            <div>{asset.assetName}</div>
          </div>
          <div className="field">
            <div className="label">Category</div>
            <div>{asset.category}</div>
          </div>
          <div className="field">
            <div className="label">Total Quantity</div>
            <div>{asset.totalQty}</div>
          </div>
          <div className="field">
            <div className="label">In Use</div>
            <div>{asset.inUse}</div>
          </div>
          <div className="field">
            <div className="label">Available</div>
            <div>{asset.totalQty - asset.inUse}</div>
          </div>
          <div className="field">
            <div className="label">Department</div>
            <div>{asset.department}</div>
          </div>
          <div className="field">
            <div className="label">Condition</div>
            <div>{asset.condition}</div>
          </div>
          <div className="field">
            <div className="label">Location</div>
            <div>{asset.location}</div>
          </div>
        </div>
      </div>

      <h2 className="section-title">Current Allocations</h2>
      {currentAllocations.length === 0 ? (
        <EmptyState
          title="No current allocations"
          message="This asset is not currently allocated to anyone."
        />
      ) : (
        <table className="table mb-24">
          <thead>
            <tr>
              <th>Allocated To</th>
              <th>Qty</th>
              <th>Date Allocated</th>
              <th>Expected Return</th>
              <th>Staff</th>
            </tr>
          </thead>
          <tbody>
            {currentAllocations.map((a) => (
              <tr key={a.id}>
                <td>{a.userName}</td>
                <td>{a.quantity}</td>
                <td>{formatDate(a.dateAllocated)}</td>
                <td>{formatDate(a.returnDate)}</td>
                <td>{a.staffName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 className="section-title">Full Allocation History</h2>
      {assetAllocations.length === 0 ? (
        <EmptyState
          title="No allocation history"
          message="This asset has never been allocated."
        />
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Record ID</th>
              <th>Allocated To</th>
              <th>Qty</th>
              <th>Date Allocated</th>
              <th>Return Date</th>
              <th>Status</th>
              <th>Staff</th>
            </tr>
          </thead>
          <tbody>
            {assetAllocations.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.userName}</td>
                <td>{a.quantity}</td>
                <td>{formatDate(a.dateAllocated)}</td>
                <td>{formatDate(a.returnDate)}</td>
                <td>
                  <StatusPill status={a.status} />
                </td>
                <td>{a.staffName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
