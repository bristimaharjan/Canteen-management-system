"use client";
import {
  AccessTime,
  Add,
  ExpandLess,
  ExpandMore,
  ListAlt,
  Logout,
  Menu,
  Person,
  Fastfood,
  ShoppingCart,
} from "@mui/icons-material";
import {
  Box,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { removeToken } from "../../util/authUtil";

export default function AdminSidebar({ drawerOpen, toggleDrawer }) {
  const [openUser, setOpenUser] = useState(false); // State for User menu
  const [openMenu, setOpenMenu] = useState(false); // State for Canteen Menu
  const [openOrders, setOpenOrders] = useState(false); // State for Orders menu

  const router = useRouter();
  const routToPage = (url) => {
    router.push(url);
  };

  // Toggle the "User" menu
  const toggleUserMenu = () => setOpenUser(!openUser);

  // Toggle the "Menu" menu
  const toggleMenu = () => setOpenMenu(!openMenu);

  // Toggle the "Orders" menu
  const toggleOrders = () => setOpenOrders(!openOrders);

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerOpen ? 240 : 60,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerOpen ? 240 : 60,
          boxSizing: "border-box",
          transition: "width 0.3s ease", // Smooth transition for expansion
          backgroundColor: "#004d40", // Teal color
          color: "#ffffff", // White text
        },
      }}
    >
      <Box
        sx={{
          width: drawerOpen ? 240 : 60,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerOpen ? 240 : 60,
            boxSizing: "border-box",
            transition: "width 0.3s",
          },
        }}
      >
        {/* Hamburger menu (three lines) */}
        <IconButton
          onClick={toggleDrawer}
          sx={{ display: "block", marginBottom: 2, color: "#ffffff" }}
        >
          <Menu />
        </IconButton>

        {/* Project Name */}
        {drawerOpen && (
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
            Canteen Management System
          </Typography>
        )}
      </Box>

      {/* Space before the menu items */}
      <Box sx={{ paddingTop: 4 }} />

      <List>
        {/* User Management Menu */}
        <ListItem onClick={toggleUserMenu}>
          <ListItemIcon>
            <Person sx={{ color: "#ffffff" }} />
          </ListItemIcon>
          {drawerOpen && <ListItemText primary="User Management" />}
          {openUser ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openUser} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem sx={{ pl: 4 }} onClick={() => routToPage("/admin/adduser")}>
              <ListItemIcon>
                <Add sx={{ color: "#ffffff" }} />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="Add User" />}
            </ListItem>
            <ListItem sx={{ pl: 4 }} onClick={() => routToPage("/admin/viewuser")}>
              <ListItemIcon>
                <ListAlt sx={{ color: "#ffffff" }} />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="List Users" />}
            </ListItem>
          </List>
        </Collapse>

        <Divider sx={{ backgroundColor: "#ffffff" }} />

        {/* Canteen Menu Management */}
        <ListItem onClick={toggleMenu}>
          <ListItemIcon>
            <Fastfood sx={{ color: "#ffffff" }} />
          </ListItemIcon>
          {drawerOpen && <ListItemText primary="Menu Management" />}
          {openMenu ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openMenu} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem sx={{ pl: 4 }} onClick={() => routToPage("/admin/addmenu")}>
              <ListItemIcon>
                <Add sx={{ color: "#ffffff" }} />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="Add Menu Item" />}
            </ListItem>
            <ListItem sx={{ pl: 4 }} onClick={() => routToPage("/admin/viewmenu")}>
              <ListItemIcon>
                <ListAlt sx={{ color: "#ffffff" }} />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary= "View Menu Item" />}
            </ListItem>
          </List>
        </Collapse>

        <Divider sx={{ backgroundColor: "#ffffff" }} />

        {/* Orders Management */}
        <ListItem onClick={toggleOrders}>
          <ListItemIcon>
            <ShoppingCart sx={{ color: "#ffffff" }} />
          </ListItemIcon>
          {drawerOpen && <ListItemText primary="Orders" />}
          {openOrders ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openOrders} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem sx={{ pl: 4 }} onClick={() => routToPage("/admin/order")}>
              <ListItemIcon>
                <ListAlt sx={{ color: "#ffffff" }} />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="Order History" />}
            </ListItem>
          </List>
        </Collapse>

        <Divider sx={{ backgroundColor: "#ffffff" }} />
      </List>

      {/* Logout Button */}
      <Box sx={{ position: "absolute", bottom: 0, width: "100%" }}>
        <Divider sx={{ backgroundColor: "#ffffff" }} />
        <List>
          <ListItem alignItems="right" onClick={handleLogout}>
            <ListItemIcon>
              <Logout sx={{ color: "#ffffff" }} />
            </ListItemIcon>
            {drawerOpen && <ListItemText primary="Logout" />}
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}
