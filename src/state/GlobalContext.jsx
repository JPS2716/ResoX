import { createContext, useContext, useMemo, useState } from "react";

const GlobalContext = createContext(null);

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

function isoDaysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function isoDaysFromNow(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

const initialUsers = [
  { id: "U001", name: "Ananya Rao", email: "ananya@university.edu", role: "User", department: "Computer Science", status: "Active", joinDate: isoDaysAgo(180) },
  { id: "U002", name: "Rahul Verma", email: "rahul@university.edu", role: "User", department: "Electronics", status: "Active", joinDate: isoDaysAgo(120) },
  { id: "U003", name: "Priya Singh", email: "priya@university.edu", role: "User", department: "Computer Science", status: "Active", joinDate: isoDaysAgo(90) },
  { id: "S001", name: "Kavita Sharma", email: "kavita@university.edu", role: "Staff", department: "Computer Science", status: "Active", joinDate: isoDaysAgo(400) },
  { id: "S002", name: "Amit Patel", email: "amit@university.edu", role: "Staff", department: "Electronics", status: "Active", joinDate: isoDaysAgo(350) },
  { id: "DH001", name: "Dr. Suresh Kumar", email: "suresh@university.edu", role: "Department Head", department: "Computer Science", status: "Active", joinDate: isoDaysAgo(800) },
  { id: "DH002", name: "Dr. Meena Iyer", email: "meena@university.edu", role: "Department Head", department: "Electronics", status: "Active", joinDate: isoDaysAgo(750) },
  { id: "R001", name: "Prof. Rajesh Nair", email: "rajesh@university.edu", role: "Registrar", department: "Administration", status: "Active", joinDate: isoDaysAgo(1000) },
  { id: "A001", name: "Admin User", email: "admin@university.edu", role: "Admin", department: "Administration", status: "Active", joinDate: isoDaysAgo(1200) },
];

const initialStaffInventory = [
  { id: "INV001", assetName: "Laptop", category: "Electronics", totalQty: 12, inUse: 3, department: "Computer Science", condition: "Good", location: "Room 101" },
  { id: "INV002", assetName: "Projector", category: "Electronics", totalQty: 6, inUse: 2, department: "Computer Science", condition: "Good", location: "Room 102" },
  { id: "INV003", assetName: "Lab Kit", category: "Lab Equipment", totalQty: 20, inUse: 5, department: "Computer Science", condition: "Excellent", location: "Lab A" },
  { id: "INV004", assetName: "Oscilloscope", category: "Electronics", totalQty: 8, inUse: 3, department: "Electronics", condition: "Good", location: "Lab B" },
  { id: "INV005", assetName: "Multimeter", category: "Electronics", totalQty: 15, inUse: 4, department: "Electronics", condition: "Good", location: "Lab B" },
];

const initialUserRequests = [
  { id: "UR001", userId: "U001", userName: "Ananya Rao", department: "Computer Science", assetName: "Laptop", quantity: 1, reason: "Final year project work", dateNeeded: isoDaysFromNow(7), dateSubmitted: isoDaysAgo(2), status: "Pending", stage: "Department Head", note: "" },
  { id: "UR002", userId: "U002", userName: "Rahul Verma", department: "Electronics", assetName: "Oscilloscope", quantity: 1, reason: "Circuit testing for semester project", dateNeeded: isoDaysFromNow(5), dateSubmitted: isoDaysAgo(4), status: "Approved", stage: "Staff Allocation", approvedBy: "DH002", note: "" },
  { id: "UR003", userId: "U003", userName: "Priya Singh", department: "Computer Science", assetName: "Lab Kit", quantity: 1, reason: "Embedded systems coursework", dateNeeded: isoDaysFromNow(10), dateSubmitted: isoDaysAgo(8), status: "Allocated", stage: "Complete", allocatedBy: "S001", allocationDate: isoDaysAgo(6), note: "Allocated by Kavita Sharma" },
  { id: "UR004", userId: "U001", userName: "Ananya Rao", department: "Computer Science", assetName: "Projector", quantity: 1, reason: "Presentation practice", dateNeeded: isoDaysFromNow(3), dateSubmitted: isoDaysAgo(10), status: "Rejected", stage: "Department Head", rejectedBy: "DH001", note: "Not available for student presentations" },
];

const initialAllocations = [
  { id: "AL001", assetId: "INV003", assetName: "Lab Kit", userId: "U003", userName: "Priya Singh", staffId: "S001", staffName: "Kavita Sharma", quantity: 1, dateAllocated: isoDaysAgo(6), returnDate: isoDaysFromNow(24), status: "Active", department: "Computer Science" },
  { id: "AL002", assetId: "INV001", assetName: "Laptop", userId: "U002", userName: "Rahul Verma", staffId: "S001", staffName: "Kavita Sharma", quantity: 1, dateAllocated: isoDaysAgo(20), returnDate: isoDaysAgo(2), status: "Returned", department: "Computer Science" },
];

const initialRegistrarRequests = [
  { id: "RR001", forwardedBy: "DH001", forwardedByName: "Dr. Suresh Kumar", originalUser: "U001", originalUserName: "Ananya Rao", department: "Computer Science", assetName: "Tablet", quantity: 3, urgency: "Medium", reason: "Student projects require additional devices", dateForwarded: isoDaysAgo(5), status: "Pending" },
];

const initialUnavailabilityAlerts = [
  { id: "UA001", requestId: "UR002", userId: "U002", userName: "Rahul Verma", staffId: "S002", staffName: "Amit Patel", assetName: "Oscilloscope", quantity: 1, department: "Electronics", dateReported: isoDaysAgo(1), status: "Pending", forwardedToRegistrar: false },
];

export function GlobalProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(initialUsers);
  const [staffInventory, setStaffInventory] = useState(initialStaffInventory);
  const [userRequests, setUserRequests] = useState(initialUserRequests);
  const [allocations, setAllocations] = useState(initialAllocations);
  const [registrarRequests, setRegistrarRequests] = useState(initialRegistrarRequests);
  const [unavailabilityAlerts, setUnavailabilityAlerts] = useState(initialUnavailabilityAlerts);
  const [notifications, setNotifications] = useState([]);

  function login(email) {
    const user = users.find((u) => u.email === email);
    if (user) {
      setCurrentUser(user);
      return { ok: true, user };
    }
    return { ok: false, error: "User not found" };
  }

  function logout() {
    setCurrentUser(null);
  }

  function addNotification(notification) {
    setNotifications((prev) => [
      {
        id: makeId("N"),
        createdAt: nowIso(),
        read: false,
        ...notification,
      },
      ...prev,
    ]);
  }

  function markAllNotificationsRead(userId) {
    setNotifications((prev) =>
      prev.map((n) => (n.userId === userId ? { ...n, read: true } : n))
    );
  }

  function markNotificationRead(id) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  function submitUserRequest({ userId, userName, department, assetName, quantity, reason, dateNeeded }) {
    if (!assetName || !quantity || !reason || !dateNeeded) {
      return { ok: false, error: "All fields are required" };
    }

    const newRequest = {
      id: makeId("UR"),
      userId,
      userName,
      department,
      assetName,
      quantity: Number(quantity),
      reason,
      dateNeeded: new Date(dateNeeded).toISOString(),
      dateSubmitted: nowIso(),
      status: "Pending",
      stage: "Department Head",
      note: "",
    };

    setUserRequests((prev) => [newRequest, ...prev]);

    const deptHead = users.find((u) => u.role === "Department Head" && u.department === department);
    if (deptHead) {
      addNotification({
        userId: deptHead.id,
        type: "user_request",
        title: "New user request",
        message: `${userName} requested ${assetName} (Qty: ${quantity})`,
        link: "/dashboard/department-head/requests",
      });
    }

    return { ok: true, request: newRequest };
  }

  function approveUserRequest(requestId, approvedBy) {
    const request = userRequests.find((r) => r.id === requestId);
    if (!request) return { ok: false, error: "Request not found" };

    setUserRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: "Approved", stage: "Staff Allocation", approvedBy }
          : r
      )
    );

    const staff = users.find((u) => u.role === "Staff" && u.department === request.department);
    if (staff) {
      addNotification({
        userId: staff.id,
        type: "allocation_pending",
        title: "New allocation request",
        message: `${request.userName} needs ${request.assetName} - check availability`,
        link: "/dashboard/staff/allocation-queue",
      });
    }

    addNotification({
      userId: request.userId,
      type: "request_approved",
      title: "Request approved",
      message: `Your request for ${request.assetName} has been approved`,
      link: "/dashboard/user/request-asset",
    });

    return { ok: true };
  }

  function rejectUserRequest(requestId, rejectedBy, reason) {
    const request = userRequests.find((r) => r.id === requestId);
    if (!request) return { ok: false, error: "Request not found" };

    setUserRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: "Rejected", stage: "Department Head", rejectedBy, note: reason }
          : r
      )
    );

    addNotification({
      userId: request.userId,
      type: "request_rejected",
      title: "Request rejected",
      message: `Your request for ${request.assetName} was rejected: ${reason}`,
      link: "/dashboard/user/request-asset",
    });

    return { ok: true };
  }

  function allocateAsset({ requestId, staffId, staffName, quantity, returnDate }) {
    const request = userRequests.find((r) => r.id === requestId);
    if (!request) return { ok: false, error: "Request not found" };

    const asset = staffInventory.find(
      (a) => a.assetName === request.assetName && a.department === request.department
    );
    if (!asset) return { ok: false, error: "Asset not found in inventory" };

    const available = asset.totalQty - asset.inUse;
    if (available < quantity) return { ok: false, error: "Insufficient quantity available" };

    setStaffInventory((prev) =>
      prev.map((a) =>
        a.id === asset.id ? { ...a, inUse: a.inUse + Number(quantity) } : a
      )
    );

    const newAllocation = {
      id: makeId("AL"),
      assetId: asset.id,
      assetName: asset.assetName,
      userId: request.userId,
      userName: request.userName,
      staffId,
      staffName,
      quantity: Number(quantity),
      dateAllocated: nowIso(),
      returnDate: new Date(returnDate).toISOString(),
      status: "Active",
      department: request.department,
    };

    setAllocations((prev) => [newAllocation, ...prev]);

    setUserRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: "Allocated",
              stage: "Complete",
              allocatedBy: staffId,
              allocationDate: nowIso(),
              note: `Allocated by ${staffName}`,
            }
          : r
      )
    );

    addNotification({
      userId: request.userId,
      type: "asset_allocated",
      title: "Asset allocated",
      message: `Your asset ${asset.assetName} has been allocated by ${staffName}`,
      link: "/dashboard/user/request-asset",
    });

    return { ok: true, allocation: newAllocation };
  }

  function reportAssetUnavailable({ requestId, staffId, staffName }) {
    const request = userRequests.find((r) => r.id === requestId);
    if (!request) return { ok: false, error: "Request not found" };

    const newAlert = {
      id: makeId("UA"),
      requestId,
      userId: request.userId,
      userName: request.userName,
      staffId,
      staffName,
      assetName: request.assetName,
      quantity: request.quantity,
      department: request.department,
      dateReported: nowIso(),
      status: "Pending",
      forwardedToRegistrar: false,
    };

    setUnavailabilityAlerts((prev) => [newAlert, ...prev]);

    const deptHead = users.find(
      (u) => u.role === "Department Head" && u.department === request.department
    );
    if (deptHead) {
      addNotification({
        userId: deptHead.id,
        type: "asset_unavailable",
        title: "Asset unavailable",
        message: `${request.assetName} requested by ${request.userName} is not available`,
        link: "/dashboard/department-head/unavailability",
      });
    }

    return { ok: true, alert: newAlert };
  }

  function forwardToRegistrar(alertId, forwardedBy, forwardedByName) {
    const alert = unavailabilityAlerts.find((a) => a.id === alertId);
    if (!alert) return { ok: false, error: "Alert not found" };

    const newRegistrarRequest = {
      id: makeId("RR"),
      forwardedBy,
      forwardedByName,
      originalUser: alert.userId,
      originalUserName: alert.userName,
      department: alert.department,
      assetName: alert.assetName,
      quantity: alert.quantity,
      urgency: "High",
      reason: `Asset unavailable in staff inventory. Requested by ${alert.userName}`,
      dateForwarded: nowIso(),
      status: "Pending",
      alertId,
    };

    setRegistrarRequests((prev) => [newRegistrarRequest, ...prev]);

    setUnavailabilityAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId ? { ...a, forwardedToRegistrar: true, status: "Forwarded" } : a
      )
    );

    const registrar = users.find((u) => u.role === "Registrar");
    if (registrar) {
      addNotification({
        userId: registrar.id,
        type: "registrar_request",
        title: "New request from Department Head",
        message: `${forwardedByName} needs ${alert.assetName} (Qty: ${alert.quantity})`,
        link: "/dashboard/registrar/requests",
      });
    }

    return { ok: true, request: newRegistrarRequest };
  }

  function approveRegistrarRequest(requestId, approvedBy) {
    const request = registrarRequests.find((r) => r.id === requestId);
    if (!request) return { ok: false, error: "Request not found" };

    setRegistrarRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: "Approved", approvedBy } : r))
    );

    const existingAsset = staffInventory.find(
      (a) => a.assetName === request.assetName && a.department === request.department
    );

    if (existingAsset) {
      setStaffInventory((prev) =>
        prev.map((a) =>
          a.id === existingAsset.id
            ? { ...a, totalQty: a.totalQty + request.quantity }
            : a
        )
      );
    } else {
      const newAsset = {
        id: makeId("INV"),
        assetName: request.assetName,
        category: "General",
        totalQty: request.quantity,
        inUse: 0,
        department: request.department,
        condition: "New",
        location: "Storage",
      };
      setStaffInventory((prev) => [newAsset, ...prev]);
    }

    const staff = users.find((u) => u.role === "Staff" && u.department === request.department);
    if (staff) {
      addNotification({
        userId: staff.id,
        type: "inventory_added",
        title: "Asset added to inventory",
        message: `${request.assetName} (Qty: ${request.quantity}) has been added by the Registrar`,
        link: "/dashboard/staff/inventory",
      });
    }

    const deptHead = users.find((u) => u.id === request.forwardedBy);
    if (deptHead) {
      addNotification({
        userId: deptHead.id,
        type: "registrar_approved",
        title: "Registrar approved request",
        message: `Your request for ${request.assetName} has been approved`,
        link: "/dashboard/department-head/unavailability",
      });
    }

    return { ok: true };
  }

  function rejectRegistrarRequest(requestId, rejectedBy, reason) {
    const request = registrarRequests.find((r) => r.id === requestId);
    if (!request) return { ok: false, error: "Request not found" };

    setRegistrarRequests((prev) =>
      prev.map((r) =>
        r.id === requestId ? { ...r, status: "Rejected", rejectedBy, rejectionReason: reason } : r
      )
    );

    const deptHead = users.find((u) => u.id === request.forwardedBy);
    if (deptHead) {
      addNotification({
        userId: deptHead.id,
        type: "registrar_rejected",
        title: "Registrar rejected request",
        message: `Request for ${request.assetName} was rejected: ${reason}`,
        link: "/dashboard/department-head/unavailability",
      });
    }

    return { ok: true };
  }

  function markAllocationReturned(allocationId) {
    const allocation = allocations.find((a) => a.id === allocationId);
    if (!allocation) return { ok: false, error: "Allocation not found" };

    setAllocations((prev) =>
      prev.map((a) => (a.id === allocationId ? { ...a, status: "Returned" } : a))
    );

    setStaffInventory((prev) =>
      prev.map((a) =>
        a.id === allocation.assetId
          ? { ...a, inUse: Math.max(0, a.inUse - allocation.quantity) }
          : a
      )
    );

    return { ok: true };
  }

  const value = useMemo(
    () => ({
      currentUser,
      users,
      staffInventory,
      userRequests,
      allocations,
      registrarRequests,
      unavailabilityAlerts,
      notifications,
      login,
      logout,
      addNotification,
      markAllNotificationsRead,
      markNotificationRead,
      submitUserRequest,
      approveUserRequest,
      rejectUserRequest,
      allocateAsset,
      reportAssetUnavailable,
      forwardToRegistrar,
      approveRegistrarRequest,
      rejectRegistrarRequest,
      markAllocationReturned,
    }),
    [
      currentUser,
      users,
      staffInventory,
      userRequests,
      allocations,
      registrarRequests,
      unavailabilityAlerts,
      notifications,
    ]
  );

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
}

export function useGlobal() {
  const ctx = useContext(GlobalContext);
  if (!ctx) throw new Error("useGlobal must be used within GlobalProvider");
  return ctx;
}
