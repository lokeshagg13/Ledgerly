import { Navbar, Nav, Container, Button } from "react-bootstrap";

import useAuth from "../../../store/hooks/useAuth";

import logo from "../../../images/logo.png";
import NavSkeleton from "../skeletons/NavSkeleton";
import ProfileMenu from "./ProfileMenu";
import useAppNavigate from "../../../store/hooks/useAppNavigate";
import { useState } from "react";

function NavbarComponent() {
  const { auth, authLoading } = useAuth();
  const { handleNavigateToPath } = useAppNavigate();
  const isLoggedIn = auth?.email && auth?.accessToken;

  const [expanded, setExpanded] = useState(false);

  const handleNavClick = (path) => {
    handleNavigateToPath(path);
    setExpanded(false);
  };

  return (
    <Navbar expand="lg" variant="dark" expanded={expanded}>
      <Container>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setExpanded(!expanded)}
        />
        <div className="brand-profile-row">
          <Navbar.Brand onClick={() => handleNavClick("/")}>
            <img src={logo} alt="Ledgerly Logo" className="nav-logo" />
            <span className="brand-text">Ledgerly</span>
          </Navbar.Brand>
          {isLoggedIn && (
            <div className="d-lg-none">
              <ProfileMenu handleNavCollapse={() => setExpanded(false)} />
            </div>
          )}
        </div>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {authLoading ? (
              <NavSkeleton />
            ) : !isLoggedIn ? (
              <>
                <Nav.Link onClick={() => handleNavClick("/home")}>
                  Home
                </Nav.Link>
                <Nav.Link onClick={() => handleNavClick("/login")}>
                  Login
                </Nav.Link>
                <Button
                  className="btn btn-dark"
                  onClick={() => handleNavClick("/register")}
                >
                  Get Started
                </Button>
              </>
            ) : (
              <>
                <Nav.Link onClick={() => handleNavClick("/dashboard")}>
                  Dashboard
                </Nav.Link>
                {auth?.type === "individual" ? (
                  <>
                    <Nav.Link onClick={() => handleNavClick("/transactions")}>
                      Your Transactions
                    </Nav.Link>
                    <Nav.Link onClick={() => handleNavClick("/categories")}>
                      Categories
                    </Nav.Link>
                  </>
                ) : (
                  <>
                    {" "}
                    <Nav.Link onClick={() => handleNavClick("/heads")}>
                      Heads
                    </Nav.Link>
                    <Nav.Link onClick={() => handleNavClick("/summary")}>
                      Summary
                    </Nav.Link>
                  </>
                )}
                <div className="d-none d-lg-block">
                  <ProfileMenu handleNavCollapse={() => setExpanded(false)} />
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
