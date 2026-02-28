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

export function RegistrarHome() {
  return (
    <div>
      <h1 className="page-title">Registrar Dashboard</h1>
      <p className="page-subtitle">
        Review and approve asset requests forwarded by Department Heads when staff inventory is insufficient.
      </p>

      <div className="grid-3">
        <HomeCard
          to="/dashboard/registrar/requests"
          title="Incoming Requests"
          desc="Review requests forwarded from Department Heads and approve or reject them."
          chip="Requests"
        />
        <HomeCard
          to="/dashboard/registrar/history"
          title="Request History"
          desc="View all past decisions and track request outcomes."
          chip="History"
        />
      </div>
    </div>
  );
}
