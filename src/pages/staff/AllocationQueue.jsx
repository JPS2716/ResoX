import { useMemo, useState } from "react";
import { useGlobal } from "../../state/GlobalContext.jsx";
import { useToast } from "../../state/ToastContext.jsx";
import { formatDate } from "../../utils/format.js";
import { EmptyState } from "../../components/EmptyState.jsx";
import { Modal } from "../../components/Modal.jsx";

export function AllocationQueue() {
  const {
    currentUser,
    userRequests,
    staffInventory,
    allocateAsset,
    reportAssetUnavailable,
  } = useGlobal();
  const { pushToast } = useToast();

  const [allocating, setAllocating] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [returnDate, setReturnDate] = useState("");

  const queueItems = useMemo(() => {
    if (!currentUser) return [];
    return userRequests.filter(
      (r) => r.status === "Approved" && r.department === currentUser.department
    );
  }, [userRequests, currentUser]);

  function getAssetAvailability(assetName) {
    if (!currentUser) return null;
    const asset = staffInventory.find(
      (a) => a.assetName === assetName && a.department === currentUser.department
    );
    if (!asset) return null;
    return {
      asset,
      available: asset.totalQty - asset.inUse,
    };
  }

  function openAllocateModal(request) {
    setAllocating(request);
    setQuantity(request.quantity);
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    setReturnDate(futureDate.toISOString().split("T")[0]);
  }

  function onConfirmAllocate() {
    if (!allocating || !currentUser) return;

    const res = allocateAsset({
      requestId: allocating.id,
      staffId: currentUser.id,
      staffName: currentUser.name,
      quantity,
      returnDate,
    });

    if (!res.ok) {
      pushToast({ title: "Error", message: res.error || "Unable to allocate asset" });
      return;
    }

    pushToast({ title: "Allocated", message: "Asset allocated successfully" });
    setAllocating(null);
  }

  function onReportUnavailable(request) {
    if (!currentUser) return;

    const res = reportAssetUnavailable({
      requestId: request.id,
      staffId: currentUser.id,
      staffName: currentUser.name,
    });

    if (!res.ok) {
      pushToast({ title: "Error", message: res.error || "Unable to report unavailability" });
      return;
    }

    pushToast({
      title: "Reported",
      message: "Department Head has been notified of unavailability",
    });
  }

  return (
    <div>
      <h1 className="page-title">Allocation Queue</h1>
      <p className="page-subtitle">
        These are user requests approved by the Department Head. Allocate assets if available, or report unavailability.
      </p>

      {queueItems.length === 0 ? (
        <EmptyState
          title="No pending allocations"
          message="Approved requests will appear here for processing."
        />
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>User Name</th>
              <th>Asset</th>
              <th>Qty</th>
              <th>Approved Date</th>
              <th>Available</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {queueItems.map((r) => {
              const avail = getAssetAvailability(r.assetName);
              const isAvailable = avail && avail.available >= r.quantity;

              return (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.userName}</td>
                  <td>{r.assetName}</td>
                  <td>{r.quantity}</td>
                  <td>{formatDate(r.dateSubmitted)}</td>
                  <td>
                    {avail ? (
                      <span className={isAvailable ? "" : "muted-small"}>
                        {avail.available} / {avail.asset.totalQty}
                      </span>
                    ) : (
                      <span className="muted-small">Not in inventory</span>
                    )}
                  </td>
                  <td>
                    {isAvailable ? (
                      <button
                        className="btn btn-primary btn-small"
                        onClick={() => openAllocateModal(r)}
                      >
                        Allocate
                      </button>
                    ) : (
                      <button
                        className="btn btn-danger btn-small"
                        onClick={() => onReportUnavailable(r)}
                      >
                        Report Unavailable
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {allocating ? (
        <Modal title="Allocate Asset" onClose={() => setAllocating(null)}>
          <p className="page-subtitle mb-12">
            Allocating <strong>{allocating.assetName}</strong> to{" "}
            <strong>{allocating.userName}</strong>
          </p>

          <div className="grid-2">
            <div className="field">
              <div className="label">Allocated To</div>
              <input className="input" value={allocating.userName} disabled />
            </div>
            <div className="field">
              <div className="label">Asset</div>
              <input className="input" value={allocating.assetName} disabled />
            </div>
            <div className="field">
              <div className="label">Quantity</div>
              <input
                className="input"
                type="number"
                min={1}
                max={getAssetAvailability(allocating.assetName)?.available || 1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="field">
              <div className="label">Expected Return Date</div>
              <input
                className="input"
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => setAllocating(null)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={onConfirmAllocate}>
              Confirm Allocation
            </button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
