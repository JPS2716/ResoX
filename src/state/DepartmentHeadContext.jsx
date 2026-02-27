import { createContext, useContext, useMemo, useState } from "react";
import {
  initialAssets,
  initialAssignments,
  initialIncomingRequests,
  initialNotifications,
  initialRegistrarRequests,
} from "./mockData.js";

const DepartmentHeadContext = createContext(null);

function clampNonNegative(n) {
  return Math.max(0, n);
}

function nowIso() {
  return new Date().toISOString();
}

function makeId(prefix) {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `${prefix}-${stamp}${rand}`;
}

export function DepartmentHeadProvider({ children }) {
  const [assets, setAssets] = useState(initialAssets);
  const [incomingRequests, setIncomingRequests] = useState(initialIncomingRequests);
  const [assignments, setAssignments] = useState(initialAssignments);
  const [registrarRequests, setRegistrarRequests] = useState(initialRegistrarRequests);
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const categories = useMemo(() => {
    const set = new Set(assets.map((a) => a.category));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [assets]);

  function markAllNotificationsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markNotificationRead(id) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  function acceptIncomingRequest(requestId) {
    const req = incomingRequests.find((r) => r.id === requestId);
    if (!req) return { ok: false, error: "Request not found" };
    if (req.status !== "Pending") return { ok: false, error: "Request not pending" };

    const asset = assets.find((a) => a.name === req.assetName);
    const available = asset ? asset.totalQty - asset.inUse : 0;
    if (!asset || available <= 0) return { ok: false, error: "Asset unavailable" };

    setIncomingRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: "Approved" } : r))
    );
    setAssets((prev) =>
      prev.map((a) =>
        a.name === req.assetName ? { ...a, inUse: a.inUse + 1 } : a
      )
    );
    setAssignments((prev) => [
      {
        id: makeId("ASN"),
        assetName: req.assetName,
        assignedTo: req.requestedBy,
        role: req.requestedByRole,
        dateAssigned: nowIso(),
        returnDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
        status: "Active",
      },
      ...prev,
    ]);
    setNotifications((prev) => [
      {
        id: makeId("N"),
        type: "incoming_request",
        title: "Request approved",
        message: `${req.requestedBy} approved for ${req.assetName}`,
        link: "/requests",
        createdAt: nowIso(),
        read: false,
      },
      ...prev,
    ]);

    return { ok: true };
  }

  function rejectIncomingRequest({ requestId, reason }) {
    const req = incomingRequests.find((r) => r.id === requestId);
    if (!req) return { ok: false, error: "Request not found" };
    if (req.status !== "Pending") return { ok: false, error: "Request not pending" };

    const cleanReason = (reason || "").trim();
    if (!cleanReason) return { ok: false, error: "Rejection reason required" };

    setIncomingRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: "Rejected", rejectionReason: cleanReason }
          : r
      )
    );
    setNotifications((prev) => [
      {
        id: makeId("N"),
        type: "incoming_request",
        title: "Request rejected",
        message: `${req.requestedBy} rejected for ${req.assetName}`,
        link: "/requests",
        createdAt: nowIso(),
        read: false,
      },
      ...prev,
    ]);

    return { ok: true };
  }

  function submitRegistrarRequest(payload) {
    const assetType = (payload.assetType || "").trim();
    const justification = (payload.justification || "").trim();
    const urgency = payload.urgency || "Low";
    const quantity = Number(payload.quantity) || 0;
    const dateNeededBy = payload.dateNeededBy || "";

    if (!assetType) return { ok: false, error: "Asset Type is required" };
    if (!justification) return { ok: false, error: "Justification is required" };
    if (quantity <= 0) return { ok: false, error: "Quantity must be at least 1" };
    if (!dateNeededBy) return { ok: false, error: "Date Needed By is required" };

    const newReq = {
      id: makeId("REG"),
      assetType,
      quantity,
      justification,
      urgency,
      dateNeededBy: new Date(dateNeededBy).toISOString(),
      dateSubmitted: nowIso(),
      status: "Pending",
    };

    setRegistrarRequests((prev) => [newReq, ...prev]);
    setNotifications((prev) => [
      {
        id: makeId("N"),
        type: "registrar_update",
        title: "Request sent to Registrar",
        message: `${assetType} × ${quantity} (${urgency})`,
        link: "/request-registrar",
        createdAt: nowIso(),
        read: false,
      },
      ...prev,
    ]);

    return { ok: true, created: newReq };
  }

  function markAssignmentReturned(assignmentId) {
    const asn = assignments.find((a) => a.id === assignmentId);
    if (!asn) return { ok: false, error: "Assignment not found" };
    if (asn.status !== "Active") return { ok: false, error: "Already returned" };

    setAssignments((prev) =>
      prev.map((a) => (a.id === assignmentId ? { ...a, status: "Returned" } : a))
    );
    setAssets((prev) =>
      prev.map((a) =>
        a.name === asn.assetName ? { ...a, inUse: clampNonNegative(a.inUse - 1) } : a
      )
    );
    setNotifications((prev) => [
      {
        id: makeId("N"),
        type: "incoming_request",
        title: "Asset returned",
        message: `${asn.assetName} returned by ${asn.assignedTo}`,
        link: "/my-assets",
        createdAt: nowIso(),
        read: false,
      },
      ...prev,
    ]);

    return { ok: true };
  }

  const value = {
    assets,
    incomingRequests,
    assignments,
    registrarRequests,
    notifications,
    unreadCount,
    categories,
    acceptIncomingRequest,
    rejectIncomingRequest,
    submitRegistrarRequest,
    markAssignmentReturned,
    markAllNotificationsRead,
    markNotificationRead,
  };

  return (
    <DepartmentHeadContext.Provider value={value}>
      {children}
    </DepartmentHeadContext.Provider>
  );
}

export function useDepartmentHead() {
  const ctx = useContext(DepartmentHeadContext);
  if (!ctx) throw new Error("useDepartmentHead must be used within provider");
  return ctx;
}

