import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Stack,
  Box,
  Avatar,
  CssBaseline,
  Drawer,
  Typography,
  MenuItem,
  Menu,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { List } from "@mui/material";
import { useState } from "react";
import logo from "@/assets/logo.png";
import { Outlet, useNavigate } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAuth } from "@/hooks/useAuth";
import useLogout from "@/hooks/useLogout";
import GroupIcon from '@mui/icons-material/Group';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const drawerWidth = 240;
const HomeLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const { user } = useAuth();
  const navigate = useNavigate();
  const logout = useLogout();

  const drawer = (
    <div>
      <Toolbar />
      <List>
        <ListItemButton onClick={() => navigate("")}>
          <ListItemIcon><GroupIcon /></ListItemIcon>
          <ListItemText primary="Usuarios" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate("")}>
          <ListItemIcon><PeopleOutlineIcon /></ListItemIcon>
          <ListItemText primary="Clientes" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate("")}>
          <ListItemIcon><AccessTimeIcon /></ListItemIcon>
          <ListItemText primary="Accesos" />
        </ListItemButton>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: "100%", zIndex: 9999, backgroundColor: "white" }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Stack direction="row">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { xs: "flex", md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <img src={logo} alt="Logo" style={{ width: 140, height: 60 }} />
          </Stack>

          <Box
            id="demo-positioned-button"
            aria-controls={open ? "demo-positioned-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <Stack
              sx={{ cursor: "pointer" }}
              direction="row"
              spacing={0.5}
              alignItems="center"
            >
              <Avatar alt="User Avatar" />
              <Typography color="info" fontWeight="bold" fontSize="18px">
                {user?.name}
              </Typography>
              <ExpandMoreIcon />
            </Stack>
          </Box>
          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            sx={{ zIndex: 999999 }}
          >
            <MenuItem onClick={logout}>Cerrar Sesion</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 }, mt: 8 }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 2,
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default HomeLayout;
