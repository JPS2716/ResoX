import { Link } from "react-router-dom";
import { ArrowRightIcon } from "../../components/icons.jsx";

function HomeCard({ to, title, desc, chip }) {
  return (
    <Link to={to} className="card clickable">
      <h3 className="card-title">{title}</h3>
      <p className="card-desc">{desc}</p>
      <div className="card-footer">
        <span className="chip">{chip}</span>
        <span aria-hidden="true">
          <ArrowRightIcon />
        </span>
      </div>
    </Link>
  );
}

export function AdminHome() {
  return (
    <div>
      <h1 className="page-title">System Admin Dashboard</h1>
      <p className="page-subtitle">
        Central management system for all users, assets, and requests across the university.
      </p>

      <div className="grid-3">
        <HomeCard
          to="/dashboard/admin/users"
          title="Users"
          desc="View and manage all users across all roles and departments."
          chip="Users"
        />
        <HomeCard
          to="/dashboard/admin/assets"
          title="Assets"
          desc="Master inventory of all assets across all departments."
          chip="Assets"
        />
        <HomeCard
          to="/dashboard/admin/requests"
          title="Requests"
          desc="View all requests system-wide with complete approval chains."
          chip="Requests"
        />
        <HomeCard
          to="/dashboard/admin/reports"
          title="Reports"
          desc="Analytics and insights on asset usage and request trends."
          chip="Reports"
        />
      </div>
    </div>
  );
}
