import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "../state/GlobalContext.jsx";
import { useToast } from "../state/ToastContext.jsx";

export function Login() {
  const { login } = useGlobal();
  const { pushToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  function onSubmit(e) {
    e.preventDefault();

    const res = login(email);
    if (!res.ok) {
      pushToast({ title: "Error", message: res.error || "Login failed" });
      return;
    }

    const { user } = res;
    pushToast({ title: "Welcome", message: `Logged in as ${user.name}` });

    if (user.role === "User") {
      navigate("/dashboard/user");
    } else if (user.role === "Staff") {
      navigate("/dashboard/staff");
    } else if (user.role === "Department Head") {
      navigate("/dashboard/department-head");
    } else if (user.role === "Registrar") {
      navigate("/dashboard/registrar");
    } else if (user.role === "Admin") {
      navigate("/dashboard/admin");
    } else {
      navigate("/dashboard");
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="card" style={{ maxWidth: "460px", width: "100%" }}>
        <h1 className="card-title" style={{ fontSize: "24px", marginBottom: "var(--space-2)" }}>
          University Asset Management
        </h1>
        <p className="card-desc" style={{ marginBottom: "var(--space-6)" }}>
          Enter your university email to access the system.
        </p>

        <form onSubmit={onSubmit}>
          <div className="field">
            <div className="label">University Email</div>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@university.edu"
              required
            />
          </div>

          <button className="btn btn-primary" type="submit" style={{ width: "100%", marginTop: "var(--space-5)" }}>
            Login
          </button>
        </form>

        <div style={{ marginTop: "var(--space-6)", padding: "var(--space-4)", borderRadius: "var(--radius-md)", background: "rgba(255, 255, 255, 0.12)", fontSize: "13px" }}>
          <div style={{ fontWeight: 650, marginBottom: "var(--space-2)" }}>Demo Accounts:</div>
          <div>ananya@university.edu (User)</div>
          <div>kavita@university.edu (Staff)</div>
          <div>suresh@university.edu (Dept Head)</div>
          <div>rajesh@university.edu (Registrar)</div>
          <div>admin@university.edu (Admin)</div>
        </div>
      </div>
    </div>
  );
}
