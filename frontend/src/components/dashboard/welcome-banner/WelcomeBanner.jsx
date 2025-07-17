import useAuth from "../../../store/hooks/useAuth";

function WelcomeBanner() {
  const { auth } = useAuth();

  return (
    <div className="dashboard-header">
      <h1>
        Welcome, <span className="username">{auth?.name}!</span>
      </h1>
    </div>
  );
}

export default WelcomeBanner;
