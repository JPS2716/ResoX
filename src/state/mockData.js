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

export const initialAssets = [
  { name: "Laptop", category: "Electronics", totalQty: 12, inUse: 8 },
  { name: "Projector", category: "Electronics", totalQty: 6, inUse: 4 },
  { name: "Lab Kit", category: "Lab", totalQty: 20, inUse: 12 },
  { name: "Tablet", category: "Electronics", totalQty: 10, inUse: 3 },
  { name: "Whiteboard", category: "Classroom", totalQty: 15, inUse: 9 },
];

export const initialIncomingRequests = [
  {
    id: "REQ-10421",
    requestedBy: "Ananya Rao",
    requestedByRole: "Student",
    assetName: "Laptop",
    dateRequested: isoDaysAgo(1),
    status: "Pending",
  },
  {
    id: "REQ-10418",
    requestedBy: "Dr. Naveen Kumar",
    requestedByRole: "Staff",
    assetName: "Projector",
    dateRequested: isoDaysAgo(3),
    status: "Pending",
  },
  {
    id: "REQ-10411",
    requestedBy: "Sana Iqbal",
    requestedByRole: "Student",
    assetName: "Lab Kit",
    dateRequested: isoDaysAgo(7),
    status: "Approved",
  },
  {
    id: "REQ-10405",
    requestedBy: "Harish Mehta",
    requestedByRole: "Staff",
    assetName: "Tablet",
    dateRequested: isoDaysAgo(10),
    status: "Rejected",
    rejectionReason: "Currently reserved for examination duty.",
  },
];

export const initialAssignments = [
  {
    id: "ASN-9001",
    assetName: "Lab Kit",
    assignedTo: "Sana Iqbal",
    role: "Student",
    dateAssigned: isoDaysAgo(6),
    returnDate: isoDaysFromNow(24),
    status: "Active",
  },
  {
    id: "ASN-9002",
    assetName: "Whiteboard",
    assignedTo: "Prof. V. Suresh",
    role: "Staff",
    dateAssigned: isoDaysAgo(14),
    returnDate: isoDaysFromNow(10),
    status: "Active",
  },
];

export const initialRegistrarRequests = [
  {
    id: "REG-3004",
    assetType: "Laptop",
    quantity: 5,
    justification: "New lab batch intake",
    urgency: "Medium",
    dateNeededBy: isoDaysFromNow(21),
    dateSubmitted: isoDaysAgo(2),
    status: "Pending",
  },
  {
    id: "REG-3001",
    assetType: "Projector",
    quantity: 1,
    justification: "Seminar hall upgrade",
    urgency: "Low",
    dateNeededBy: isoDaysFromNow(40),
    dateSubmitted: isoDaysAgo(12),
    status: "Fulfilled",
  },
];

export const initialNotifications = [
  {
    id: "N-1",
    type: "incoming_request",
    title: "New incoming request",
    message: "Ananya Rao requested Laptop",
    link: "/requests",
    createdAt: isoDaysAgo(1),
    read: false,
  },
  {
    id: "N-2",
    type: "incoming_request",
    title: "New incoming request",
    message: "Dr. Naveen Kumar requested Projector",
    link: "/requests",
    createdAt: isoDaysAgo(3),
    read: false,
  },
  {
    id: "N-3",
    type: "registrar_update",
    title: "Registrar update",
    message: "Projector request fulfilled",
    link: "/request-registrar",
    createdAt: isoDaysAgo(11),
    read: true,
  },
];

