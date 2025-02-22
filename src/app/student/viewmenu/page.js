"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
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
  IconButton,
  Snackbar,
  Alert,
  MenuItem,
  FormControl,
  Select,
  InputLabel
} from "@mui/material";
import { Add, Remove, ShoppingCart } from "@mui/icons-material";
import { fetchMenuItems, addToCart, makeApiCall } from "../../util/api";
import { jwtDecode } from "jwt-decode";

const MenuItemList = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [quantityDialogOpen, setQuantityDialogOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.id;
          setUserId(userId);
          localStorage.setItem("userId", userId);

          if (userId) {
            console.log("User ID:", userId);
            const response = await makeApiCall(`/api/carts/${userId}`);
            console.log("Response:", response);
          } else {
            console.error("User ID not found in the decoded token");
          }
        } else {
          console.error("No auth token found");
        }
      } catch (error) {
        console.error("Error fetching User ID:", error);
      }
    };

    fetchUserId();
    getMenuItems();
  }, []);

  const getMenuItems = async () => {
    try {
      const response = await fetchMenuItems();
      setMenuItems(response);
      setFilteredMenuItems(response);
  
      // Extract unique categories from itemCategory field
      const uniqueCategories = ["All", ...new Set(response.map(item => item.itemCategory))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };  

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
  
    if (category === "All") {
      setFilteredMenuItems(menuItems);
    } else {
      setFilteredMenuItems(menuItems.filter(item => item.itemCategory === category));
    }
  };  

  const handleOpenQuantityDialog = (menuItem) => {
    setSelectedItem(menuItem);
    setQuantity(1);
    setQuantityDialogOpen(true);
  };

  const handleCloseQuantityDialog = () => {
    setQuantityDialogOpen(false);
    setSelectedItem(null);
    setQuantity(1);
  };

  const handleAddToCart = async () => {
    if (!selectedItem || !userId) {
      console.error("Missing selected item or user ID");
      return;
    }

    console.log(`Adding item: ${selectedItem.itemName}, User ID: ${userId}`);

    try {
      const response = await addToCart(userId, selectedItem.itemId, quantity);
      console.log("Item added to cart:", response);

      handleCloseQuantityDialog();
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  return (
    <Box
      sx={{
        padding: "20px",
        background: "#f0f0f0",
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        maxWidth: "80%",
        margin: "auto",
        marginTop: "20px"
      }}
    >
      <Typography variant="h4" textAlign="center" sx={{ marginBottom: "20px", color: "#333" }}>
        MENU
      </Typography>

      {/* Category Filter Dropdown */}
      <FormControl sx={{ width: "350px", marginBottom: "20px" }}>
      <InputLabel>Filter by Category</InputLabel>
        <Select value={selectedCategory} onChange={handleCategoryChange}>
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TableContainer component={Paper} sx={{ borderRadius: "12px" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#004d40" }}>
            <TableRow>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Item ID</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Menu Item</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Category</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Price</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMenuItems.map((menuItem) => (
              <TableRow key={menuItem.itemId} sx={{ "&:hover": { backgroundColor: "#e0f7fa" } }}>
                <TableCell>{menuItem.itemId}</TableCell>
                <TableCell>{menuItem.itemName}</TableCell>
                <TableCell>{menuItem.itemCategory}</TableCell>
                <TableCell>{`Rs ${menuItem.itemPrice}`}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleOpenQuantityDialog(menuItem)}
                    sx={{ color: "#00695c" }}
                  >
                    <ShoppingCart />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={quantityDialogOpen} onClose={handleCloseQuantityDialog}>
      <DialogTitle sx={{ fontWeight: "bold" }}>Add to Cart</DialogTitle>
      <DialogContent>
          <Typography>{selectedItem?.itemName}</Typography>
          <Box
           sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "10px",
            width: "250px", // Make it take full width
            padding: "15px", // Add some padding
            minHeight: "60px" // Increase height
          }}
          
          >
            <IconButton onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}>
              <Remove />
            </IconButton>
            <Typography sx={{ marginX: "10px" }}>{quantity}</Typography>
            <IconButton onClick={() => setQuantity((prev) => prev + 1)}>
              <Add />
            </IconButton>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseQuantityDialog}>Cancel</Button>
          <Button onClick={handleAddToCart} variant="contained" color="primary">
            Add to Cart
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: "100%" }}>
          Item added to cart successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MenuItemList;