import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import useAuth from "../../store/hooks/useAuth";
import useAxiosPrivate from "../../store/hooks/useAxiosPrivate";

import logo from "../../images/logo.png";

function NavbarComponent() {
  const { auth, setAuth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await axiosPrivate.get("/user/logout");
      setAuth({});
      navigate("/", { replace: true });
    } catch (error) {
      console.log("Error while logout:", error);
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
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {(!auth?.email || !auth?.accessToken) && (
              <>
                <Nav.Link href="#features">Features</Nav.Link>
                <Nav.Link href="/login">Login</Nav.Link>
                <Button className="btn btn-dark" href="/register">
                  Get Started
                </Button>
              </>
            )}
            {auth?.email && auth.accessToken && (
              <>
                <Nav.Link href="#features">Features</Nav.Link>
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
