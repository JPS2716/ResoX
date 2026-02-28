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

export function StaffHome() {
  return (
    <div>
      <h1 className="page-title">Staff Dashboard</h1>
      <p className="page-subtitle">
        Manage allocation requests from approved user requests and maintain your department's asset inventory.
      </p>

      <div className="grid-3">
        <HomeCard
          to="/dashboard/staff/allocation-queue"
          title="Allocation Queue"
          desc="Process approved user requests by allocating available assets or reporting unavailability."
          chip="Queue"
        />
        <HomeCard
          to="/dashboard/staff/inventory"
          title="My Asset Inventory"
          desc="View and manage all assets allocated to your department."
          chip="Inventory"
        />
      </div>
    </div>
  );
}
