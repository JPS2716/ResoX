import { Link } from "react-router-dom";
import { ArrowRightIcon } from "../components/icons.jsx";

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

export function DashboardHome() {
  return (
    <div>
      <h1 className="page-title">Department Head Dashboard</h1>
      <p className="page-subtitle">
        Review incoming requests, request resources from the Registrar, and track
        the assets allocated to your department.
      </p>

      <div className="grid-3">
        <HomeCard
          to="/requests"
          title="Incoming Asset Requests"
          desc="View requests you’ve received and accept or reject based on availability."
          chip="Requests"
        />
        <HomeCard
          to="/request-registrar"
          title="Request Resources from Registrar"
          desc="Submit a new resource request upward and track its status over time."
          chip="Registrar"
        />
        <HomeCard
          to="/my-assets"
          title="Allocated Assets Overview"
          desc="See what your department owns and who you’ve assigned assets to."
          chip="Assets"
        />
      </div>
    </div>
  );
}

