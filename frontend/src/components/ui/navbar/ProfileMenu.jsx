import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import useAuth from "../../../store/hooks/useAuth";
import KeyIcon from "../icons/KeyIcon";
import LogoutIcon from "../icons/LogoutIcon";
import useAxiosPrivate from "../../../store/hooks/useAxiosPrivate";
import { toast } from "react-toastify";

function ProfileMenu() {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth } = useAuth();
  const anchorElementRef = useRef();
  const [isMenuOpened, setIsMenuOpened] = useState(false);

  const handleOpenMenu = (event) => {
    anchorElementRef.current = event.target;
    setIsMenuOpened(true);
  };

  const handleCloseMenu = () => {
    anchorElementRef.current = null;
    setIsMenuOpened(false);
  };

  const handleToggleMenu = (e) => {
    if (isMenuOpened) handleCloseMenu();
    else handleOpenMenu(e);
  };

  async function handleLogout() {
    try {
      await axiosPrivate.get("/user/logout");
      toast.success("Logout successful.", {
        position: "top-center",
        autoClose: 3000,
      });
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
    } finally {
      handleCloseMenu();
    }
  }

  return (
    <div className="profile-menu-container">
      <div className="profile-menu-icon-container">
        <Tooltip title="Your profile">
          <IconButton
            onClick={handleToggleMenu}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={isMenuOpened ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={isMenuOpened ? "true" : undefined}
          >
            <Avatar className="profile-avatar" sx={{ width: 36, height: 36 }}>
              {auth?.name?.[0]?.toUpperCase() || "U"}
            </Avatar>
          </IconButton>
        </Tooltip>
      </div>
      <Menu
        ref={anchorElementRef}
        anchorEl={anchorElementRef.current}
        id="profileMenu"
        open={isMenuOpened}
        onClose={handleCloseMenu}
        onClick={handleCloseMenu}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              minWidth: 180,
              backgroundColor: "#2b2d30",
              color: "#f5f5f5",
              borderRadius: "10px",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
                bgcolor: "#2ca5a5",
                color: "#fff",
              },
              "& .MuiMenuItem-root": {
                "&:hover": {
                  backgroundColor: "#3a3d42",
                },
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "#2b2d30",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box
          sx={{
            px: 2,
            py: 1,
            fontSize: "1.1rem",
            letterSpacing: "0.5px",
          }}
        >
          Hello <strong>{auth?.name?.split(" ")?.[0] || "User"},</strong>
        </Box>
        <MenuItem
          component={Link}
          to="/user/profile#profile-info"
          className="profile-menu-list-item"
          onClick={handleCloseMenu}
        >
          <Avatar /> Manage Profile
        </MenuItem>
        <MenuItem
          component={Link}
          to="/user/profile#change-password"
          className="profile-menu-list-item"
          onClick={handleCloseMenu}
        >
          <Avatar>
            <KeyIcon fill="#fff" width="0.9rem" height="0.9rem" />
          </Avatar>
          Change Password
        </MenuItem>
        <MenuItem className="profile-menu-list-item" onClick={handleLogout}>
          <Avatar>
            <LogoutIcon fill="#fff" width="0.9rem" height="0.9rem" />
          </Avatar>
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
}

export default ProfileMenu;
