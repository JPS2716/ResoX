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

export function UserHome() {
  return (
    <div>
      <h1 className="page-title">User Dashboard</h1>
      <p className="page-subtitle">
        Request assets and track your requests.
      </p>

      <div className="grid-3">
        <HomeCard
          to="/dashboard/user/request-asset"
          title="Request an Asset"
          desc="Submit a new asset request and track all your submitted requests."
          chip="Requests"
        />
      </div>
    </div>
  );
}
