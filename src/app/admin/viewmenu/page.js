"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  CssBaseline,
  createTheme,
  ThemeProvider,
  Snackbar,
  Alert,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material"; // Import Material UI Icons
import { fetchMenuItems, deleteMenuItem, updateMenuItem, findByItemId } from "../../util/api";

const theme = createTheme({
  palette: {
    primary: {
      main: "#004d40", // Green theme color
    },
    secondary: {
      main: "#66bb6a",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    fontSize: 14,
    h4: {
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
    },
  },
});

const MenuItemList = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [editMenuItem, setEditMenuItem] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    getMenuItems();
  }, []);

  const getMenuItems = async () => {
    try {
      const response = await fetchMenuItems();
      setMenuItems(response);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await deleteMenuItem(itemId);
      getMenuItems();
      showSnackbar("Menu item deleted successfully.");
    } catch (error) {
      console.error("Error deleting menu item:", error);
    }
  };

  const handleUpdate = async (itemId) => {
    try {
      const itemToEdit = await findByItemId(itemId);
      setEditMenuItem(itemToEdit);
      setEditOpen(true);
    } catch (error) {
      console.error("Error fetching menu item for edit:", error);
    }
  };

  const handleCloseEditDialog = () => {
    setEditOpen(false);
    setEditMenuItem(null);
  };

  const handleSaveEdit = async () => {
    try {
      const updatedItem = { ...editMenuItem, itemPrice: editMenuItem.itemPrice.toString() };
      await updateMenuItem(updatedItem, editMenuItem.itemId);
      setEditOpen(false);
      getMenuItems();
      showSnackbar("Menu item updated successfully.");
    } catch (error) {
      console.error("Error updating menu item:", error);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditMenuItem((prev) => ({ ...prev, [name]: value }));
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        
          padding: "20px",
        }}
      >
        <Paper elevation={6} sx={{ padding: "50px", maxWidth: "900px", width: "100%", borderRadius: "10px" }}>
          <Typography variant="h4" textAlign="center" gutterBottom>
            Menu
          </Typography>
          <TableContainer
            component={Paper}
            sx={{
              marginTop: "20px",
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            <Table>
              <TableHead sx={{ backgroundColor: "#004d40" }}>
                <TableRow>
                  <TableCell sx={{ color: "#ffffff", fontSize: "18px" }}>Item ID</TableCell>
                  <TableCell sx={{ color: "#ffffff", fontSize: "18px" }}>Menu Item</TableCell>
                  <TableCell sx={{ color: "#ffffff", fontSize: "18px" }}>Category</TableCell>
                  <TableCell sx={{ color: "#ffffff", fontSize: "18px" }}>Price</TableCell>
                  <TableCell sx={{ color: "#ffffff", fontSize: "18px" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {menuItems.length > 0 ? (
                  menuItems.map((menuItem) => (
                    <TableRow key={menuItem.itemId}>
                      <TableCell>{menuItem.itemId}</TableCell>
                      <TableCell>{menuItem.itemName || "No Name"}</TableCell>
                      <TableCell>{menuItem.itemCategory || "No Category"}</TableCell>
                      <TableCell>{`Rs ${menuItem.itemPrice || "N/A"}`}</TableCell>
                      <TableCell>
                        <IconButton color="primary" onClick={() => handleUpdate(menuItem.itemId)}>
                          <Edit />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(menuItem.itemId)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No menu items available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Edit Menu Item Dialog */}
        <Dialog open={editOpen} onClose={handleCloseEditDialog}>
          <DialogTitle>Edit Menu Item</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              name="itemName"
              label="Item Name"
              type="text"
              fullWidth
              variant="outlined"
              value={editMenuItem?.itemName || ""}
              onChange={handleEditInputChange}
            />
            <TextField
              margin="dense"
              name="itemCategory"
              label="Item Category"
              select
              fullWidth
              variant="outlined"
              value={editMenuItem?.itemCategory || ""}
              onChange={handleEditInputChange}
            >
              {["SNACK", "BEVERAGE", "MEAL", "DESSERT"].map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="dense"
              name="itemPrice"
              label="Item Price"
              type="number"
              fullWidth
              variant="outlined"
              value={editMenuItem?.itemPrice || ""}
              onChange={handleEditInputChange}
            />
          </DialogContent>
          <DialogActions>
            <IconButton onClick={handleCloseEditDialog} color="secondary">
              <Delete />
            </IconButton>
            <IconButton onClick={handleSaveEdit} color="primary">
              <Edit />
            </IconButton>
          </DialogActions>
        </Dialog>

        {/* Snackbar Notification */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default MenuItemList;
