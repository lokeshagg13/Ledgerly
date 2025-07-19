import { Navbar, Nav, Container, Button } from "react-bootstrap";

import useAuth from "../../../store/hooks/useAuth";

import logo from "../../../images/logo.png";
import NavSkeleton from "../skeletons/NavSkeleton";
import ProfileMenu from "./ProfileMenu";

function NavbarComponent() {
  const { auth, authLoading } = useAuth();
  const isLoggedIn = auth?.email && auth?.accessToken;

  return (
    <Navbar expand="lg" variant="dark">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <div className="brand-profile-row">
          <Navbar.Brand href="/">
            <img src={logo} alt="Ledgerly Logo" className="nav-logo" />
            <span className="brand-text">Ledgerly</span>
          </Navbar.Brand>
          {isLoggedIn && (
            <div className="d-lg-none">
              <ProfileMenu />
            </div>
          )}
        </div>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {authLoading ? (
              <NavSkeleton />
            ) : !isLoggedIn ? (
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
                <div className="d-none d-lg-block">
                  <ProfileMenu />
                </div>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
