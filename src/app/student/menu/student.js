"use client";
import {
  ExpandLess,
  ExpandMore,
  ListAlt,
  Logout,
  Menu,
  ShoppingCart,
  RestaurantMenu,
  MenuBook,
  MenuOpen,
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

export default function StudentSidebar({ drawerOpen, toggleDrawer }) {
  const [openMenu, setOpenMenu] = useState(false); // State for Menu Management
  const [openOrders, setOpenOrders] = useState(false); // State for Orders menu
  const [openCart, setOpenCart] = useState(false); // State for Cart menu

  const router = useRouter();
  const routToPage = (url) => {
    router.push(url);
  };

  // Toggle Menu Sections
  const toggleMenu = () => setOpenMenu(!openMenu);
  const toggleOrders = () => setOpenOrders(!openOrders);
  const toggleCart = () => setOpenCart(!openCart);

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
          transition: "width 0.3s ease",
          backgroundColor: "#004d40",
          color: "#ffffff",
        },
      }}
    >
      <Box sx={{ padding: 2 }}>
        {/* Hamburger menu (three lines) */}
        <IconButton
          onClick={toggleDrawer}
          sx={{ color: "#ffffff", marginBottom: 2 }}
        >
          <Menu />
        </IconButton>

        {/* Project Name */}
        {drawerOpen && (
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#ffffff" }}>
            Canteen Management System
          </Typography>
        )}
      </Box>

      <List>
        {/* Menu Management */}
        <ListItem onClick={toggleMenu}>
          <ListItemIcon>
            <RestaurantMenu sx={{ color: "#ffffff" }} />
          </ListItemIcon>
          {drawerOpen && <ListItemText primary="Menu" />}
          {openMenu ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openMenu} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem sx={{ pl: 4 }} onClick={() => routToPage("/student/viewmenu")}>
              <ListItemIcon>
                <MenuBook sx={{ color: "#ffffff" }} />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="View Menu" />}
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
            <ListItem sx={{ pl: 4 }} onClick={() => routToPage("/student/order")}>
              <ListItemIcon>
                <ListAlt sx={{ color: "#ffffff" }} />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="View Orders" />}
            </ListItem>
          </List>
        </Collapse>

        <Divider sx={{ backgroundColor: "#ffffff" }} />

        {/* Cart Management */}
        <ListItem onClick={toggleCart}>
          <ListItemIcon>
            <MenuOpen sx={{ color: "#ffffff" }} />
          </ListItemIcon>
          {drawerOpen && <ListItemText primary="Cart" />}
          {openCart ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openCart} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem sx={{ pl: 4 }} onClick={() => routToPage("/student/cart")}>
              <ListItemIcon>
                <ListAlt sx={{ color: "#ffffff" }} />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="View Cart" />}
            </ListItem>
          </List>
        </Collapse>

        <Divider sx={{ backgroundColor: "#ffffff" }} />
      </List>

      {/* Logout Button */}
      <Box sx={{ position: "absolute", bottom: 0, width: "100%" }}>
        <Divider sx={{ backgroundColor: "#ffffff" }} />
        <List>
          <ListItem onClick={handleLogout}>
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
