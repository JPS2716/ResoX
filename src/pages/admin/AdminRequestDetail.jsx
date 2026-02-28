import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobal } from "../../state/GlobalContext.jsx";
import { formatDate } from "../../utils/format.js";
import { StatusPill } from "../../components/StatusPill.jsx";

export function AdminRequestDetail() {
  const { id } = useParams();
  const { userRequests, users } = useGlobal();
  const navigate = useNavigate();

  const request = useMemo(() => {
    return userRequests.find((r) => r.id === id);
  }, [userRequests, id]);

  const timeline = useMemo(() => {
    if (!request) return [];

    const events = [
      {
        stage: "User Request",
        timestamp: request.dateSubmitted,
        actor: request.userName,
        status: "Submitted",
      },
    ];

    if (request.status === "Approved" || request.status === "Allocated") {
      const approver = users.find((u) => u.id === request.approvedBy);
      events.push({
        stage: "Department Head Review",
        timestamp: request.dateSubmitted,
        actor: approver?.name || "Department Head",
        status: "Approved",
      });
    }

    if (request.status === "Rejected") {
      const rejector = users.find((u) => u.id === request.rejectedBy);
      events.push({
        stage: "Department Head Review",
        timestamp: request.dateSubmitted,
        actor: rejector?.name || "Department Head",
        status: "Rejected",
      });
    }

    if (request.status === "Allocated") {
      const allocator = users.find((u) => u.id === request.allocatedBy);
      events.push({
        stage: "Staff Allocation",
        timestamp: request.allocationDate || request.dateSubmitted,
        actor: allocator?.name || "Staff",
        status: "Allocated",
      });
    }

    return events;
  }, [request, users]);

  if (!request) {
    return (
      <div>
        <h1 className="page-title">Request Not Found</h1>
        <p className="page-subtitle">The request with ID {id} could not be found.</p>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/dashboard/admin/requests")}
        >
          Back to Requests
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        className="btn btn-ghost btn-small"
        onClick={() => navigate("/dashboard/admin/requests")}
        style={{ marginBottom: "var(--space-4)" }}
      >
        ← Back to Requests
      </button>

      <h1 className="page-title">Request {request.id}</h1>
      <p className="page-subtitle">Full request details and approval timeline</p>

      <div className="card mb-24">
        <h3 className="card-title">Request Details</h3>
        <div className="grid-2" style={{ marginTop: "var(--space-4)" }}>
          <div className="field">
            <div className="label">Request ID</div>
            <div>{request.id}</div>
          </div>
          <div className="field">
            <div className="label">Requested By</div>
            <div>{request.userName}</div>
          </div>
          <div className="field">
            <div className="label">Department</div>
            <div>{request.department}</div>
          </div>
          <div className="field">
            <div className="label">Asset</div>
            <div>{request.assetName}</div>
          </div>
          <div className="field">
            <div className="label">Quantity</div>
            <div>{request.quantity}</div>
          </div>
          <div className="field">
            <div className="label">Date Submitted</div>
            <div>{formatDate(request.dateSubmitted)}</div>
          </div>
          <div className="field">
            <div className="label">Date Needed By</div>
            <div>{formatDate(request.dateNeeded)}</div>
          </div>
          <div className="field">
            <div className="label">Current Stage</div>
            <div>{request.stage}</div>
          </div>
          <div className="field">
            <div className="label">Status</div>
            <StatusPill status={request.status} />
          </div>
          {request.note ? (
            <div className="field" style={{ gridColumn: "1 / -1" }}>
              <div className="label">Note</div>
              <div>{request.note}</div>
            </div>
          ) : null}
          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <div className="label">Reason</div>
            <div>{request.reason}</div>
          </div>
        </div>
      </div>

      <h2 className="section-title">Request Timeline</h2>
      <div className="card">
        <div style={{ display: "grid", gap: "var(--space-4)" }}>
          {timeline.map((event, idx) => (
            <div
              key={idx}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr 1fr 1fr",
                gap: "var(--space-3)",
                paddingBottom: "var(--space-4)",
                borderBottom:
                  idx < timeline.length - 1 ? "1px solid rgba(255, 255, 255, 0.12)" : "none",
              }}
            >
              <div>
                <div className="label">Stage</div>
                <div>{event.stage}</div>
              </div>
              <div>
                <div className="label">Actor</div>
                <div>{event.actor}</div>
              </div>
              <div>
                <div className="label">Status</div>
                <StatusPill status={event.status} />
              </div>
              <div>
                <div className="label">Timestamp</div>
                <div>{formatDate(event.timestamp)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
