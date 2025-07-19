import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

import useAuth from "../../../store/hooks/useAuth";
import useAxiosPrivate from "../../../store/hooks/useAxiosPrivate";

import logo from "../../../images/logo.png";
import NavSkeleton from "../skeletons/NavSkeleton";

function NavbarComponent() {
  const { auth, setAuth, authLoading } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await axiosPrivate.get("/user/logout");
      setAuth({});
      navigate("/", { replace: true });
    } catch (error) {
      if (!error?.response) {
        alert("No server response.");
      } else if (error.response?.error) {
        alert(`${error.response?.error}`);
      } else {
        alert("Logout failed.");
      }
    }
  }

  return (
    <Navbar expand="lg" variant="dark">
      <Container>
        <Navbar.Brand href="/">
          <img src={logo} alt="Ledgerly Logo" className="logo" />
          <span className="brand-text">Ledgerly</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {authLoading ? (
              <NavSkeleton />
            ) : !auth?.email || !auth?.accessToken ? (
              <>
                <Nav.Link href="#features">Features</Nav.Link>
                <Nav.Link href="/login">Login</Nav.Link>
                <Button className="btn btn-dark" href="/register">
                  Get Started
                </Button>
              </>
            ) : (
              <>
                <Nav.Link href="#features">Features</Nav.Link>
                <Nav.Link href="/transactions">Your Transactions</Nav.Link>
                <Nav.Link href="/categories">Categories</Nav.Link>
                <Button onClick={handleLogout} className="logout-button">
                  Logout
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
