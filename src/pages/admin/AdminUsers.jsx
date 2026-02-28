import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "../../state/GlobalContext.jsx";
import { StatusPill } from "../../components/StatusPill.jsx";
import { EmptyState } from "../../components/EmptyState.jsx";
import { Pagination } from "../../components/Pagination.jsx";

const PAGE_SIZE = 10;

export function AdminUsers() {
  const { users } = useGlobal();
  const navigate = useNavigate();

  const [roleFilter, setRoleFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const roles = useMemo(() => {
    const set = new Set(users.map((u) => u.role));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [users]);

  const departments = useMemo(() => {
    const set = new Set(users.map((u) => u.department));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [users]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = users;

    if (roleFilter !== "All") {
      rows = rows.filter((u) => u.role === roleFilter);
    }
    if (departmentFilter !== "All") {
      rows = rows.filter((u) => u.department === departmentFilter);
    }
    if (statusFilter !== "All") {
      rows = rows.filter((u) => u.status === statusFilter);
    }
    if (q) {
      rows = rows.filter((u) => {
        return (
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.id.toLowerCase().includes(q)
        );
      });
    }

    return rows;
  }, [users, search, roleFilter, departmentFilter, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function resetToFirstPage() {
    setPage(1);
  }

  return (
    <div>
      <h1 className="page-title">Users</h1>
      <p className="page-subtitle">
        Master table of all users across all roles. Click on any user to view their full profile.
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
              placeholder="Search by name, email, or ID..."
            />
          </div>
          <div className="field w-180">
            <div className="label">Role</div>
            <select
              className="select"
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                resetToFirstPage();
              }}
            >
              <option>All</option>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
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
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No users found" message="Try changing your filters or search query." />
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((u) => (
                <tr
                  key={u.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/dashboard/admin/users/${u.id}`)}
                >
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.department}</td>
                  <td>
                    <StatusPill status={u.status} />
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
    </div>
  );
}
