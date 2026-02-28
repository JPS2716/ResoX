import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobal } from "../../state/GlobalContext.jsx";
import { formatDate } from "../../utils/format.js";
import { StatusPill } from "../../components/StatusPill.jsx";
import { EmptyState } from "../../components/EmptyState.jsx";

export function AdminUserDetail() {
  const { id } = useParams();
  const { users, allocations, userRequests } = useGlobal();
  const navigate = useNavigate();

  const user = useMemo(() => {
    return users.find((u) => u.id === id);
  }, [users, id]);

  const userAllocations = useMemo(() => {
    if (!user) return [];
    return allocations.filter((a) => a.userId === user.id);
  }, [allocations, user]);

  const userRequestHistory = useMemo(() => {
    if (!user) return [];
    return userRequests.filter((r) => r.userId === user.id);
  }, [userRequests, user]);

  if (!user) {
    return (
      <div>
        <h1 className="page-title">User Not Found</h1>
        <p className="page-subtitle">The user with ID {id} could not be found.</p>
        <button className="btn btn-primary" onClick={() => navigate("/dashboard/admin/users")}>
          Back to Users
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        className="btn btn-ghost btn-small"
        onClick={() => navigate("/dashboard/admin/users")}
        style={{ marginBottom: "var(--space-4)" }}
      >
        ← Back to Users
      </button>

      <h1 className="page-title">{user.name}</h1>
      <p className="page-subtitle">Full profile and activity history</p>

      <div className="card mb-24">
        <h3 className="card-title">Personal Details</h3>
        <div className="grid-2" style={{ marginTop: "var(--space-4)" }}>
          <div className="field">
            <div className="label">User ID</div>
            <div>{user.id}</div>
          </div>
          <div className="field">
            <div className="label">Full Name</div>
            <div>{user.name}</div>
          </div>
          <div className="field">
            <div className="label">Email</div>
            <div>{user.email}</div>
          </div>
          <div className="field">
            <div className="label">Role</div>
            <div>{user.role}</div>
          </div>
          <div className="field">
            <div className="label">Department</div>
            <div>{user.department}</div>
          </div>
          <div className="field">
            <div className="label">Join Date</div>
            <div>{formatDate(user.joinDate)}</div>
          </div>
          <div className="field">
            <div className="label">Status</div>
            <StatusPill status={user.status} />
          </div>
        </div>
      </div>

      <h2 className="section-title">Assets Currently In Use</h2>
      {userAllocations.filter((a) => a.status === "Active").length === 0 ? (
        <EmptyState
          title="No active allocations"
          message="This user does not currently have any assets allocated."
        />
      ) : (
        <table className="table mb-24">
          <thead>
            <tr>
              <th>Asset Name</th>
              <th>Qty</th>
              <th>Allocated By</th>
              <th>Date Allocated</th>
              <th>Expected Return</th>
            </tr>
          </thead>
          <tbody>
            {userAllocations
              .filter((a) => a.status === "Active")
              .map((a) => (
                <tr key={a.id}>
                  <td>{a.assetName}</td>
                  <td>{a.quantity}</td>
                  <td>{a.staffName}</td>
                  <td>{formatDate(a.dateAllocated)}</td>
                  <td>{formatDate(a.returnDate)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}

      <h2 className="section-title">Request History</h2>
      {userRequestHistory.length === 0 ? (
        <EmptyState
          title="No requests"
          message="This user has not submitted any requests."
        />
      ) : (
        <table className="table mb-24">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Asset</th>
              <th>Date Submitted</th>
              <th>Status</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {userRequestHistory.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.assetName}</td>
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

      <h2 className="section-title">Allocation History</h2>
      {userAllocations.length === 0 ? (
        <EmptyState
          title="No allocation history"
          message="This user has not had any assets allocated."
        />
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Record ID</th>
              <th>Asset</th>
              <th>Qty</th>
              <th>Date Allocated</th>
              <th>Return Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {userAllocations.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.assetName}</td>
                <td>{a.quantity}</td>
                <td>{formatDate(a.dateAllocated)}</td>
                <td>{formatDate(a.returnDate)}</td>
                <td>
                  <StatusPill status={a.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
