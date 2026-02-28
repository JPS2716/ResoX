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

export function DeptHeadHome() {
  return (
    <div>
      <h1 className="page-title">Department Head Dashboard</h1>
      <p className="page-subtitle">
        Review incoming user requests, manage staff unavailability alerts, and request resources from the Registrar.
      </p>

      <div className="grid-3">
        <HomeCard
          to="/dashboard/department-head/requests"
          title="Incoming User Requests"
          desc="View requests from users and approve or reject based on department policies."
          chip="Requests"
        />
        <HomeCard
          to="/dashboard/department-head/unavailability"
          title="Staff Unavailability Alerts"
          desc="View assets reported as unavailable by staff and forward requests to Registrar."
          chip="Alerts"
        />
        <HomeCard
          to="/dashboard/department-head/my-assets"
          title="Department Assets Overview"
          desc="See what your department owns and track asset allocations."
          chip="Assets"
        />
      </div>
    </div>
  );
}
