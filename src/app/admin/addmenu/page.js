"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Paper,
  CssBaseline,
  createTheme,
  ThemeProvider,
  Snackbar,
  Alert,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { addMenuItems } from "../../util/api";

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
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: "url('/images/background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "100vh",
          margin: 0,
          padding: 0,
          display: "flex",
        },
      },
    },
  },
});

const AddMenuItem = () => {
  const [newMenuItem, setNewMenuItem] = useState({
    itemName: "",
    itemPrice: "",
    itemCategory: "",
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Snackbar type (success/error)

  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMenuItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async () => {
    try {
      await addMenuItems(newMenuItem);
      setSnackbarMessage("Menu item added successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
  
      // Delay navigation until after the Snackbar appears
      setTimeout(() => {
        router.push("/admin/viewmenu");
      }, 2000); // Adjust delay as needed
    } catch (error) {
      console.error("Error adding menu item:", error);
      setSnackbarMessage("Failed to add menu item.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false); // Close Snackbar
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
        <Paper
          elevation={6}
          sx={{
            padding: "50px",
            maxWidth: "800px",
            width: "100%",
            minHeight: "550px",
            borderRadius: "20px",
            backgroundColor: "#ffffff",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            marginTop: "50px",
          }}
        >
          <Typography
            variant="h4"
            textAlign="center"
            gutterBottom
            sx={{
              color: theme.palette.primary.main,
              fontSize: "2rem",
            }}
          >
            Add Menu Item
          </Typography>
          <TextField
            margin="dense"
            name="itemName"
            label="Item Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newMenuItem.itemName}
            onChange={handleInputChange}
            sx={{ marginBottom: "20px" }}
          />
          <TextField
            margin="dense"
            name="itemCategory"
            label="Item Category"
            select
            fullWidth
            variant="outlined"
            value={newMenuItem.itemCategory}
            onChange={handleInputChange}
            sx={{ marginBottom: "20px" }}
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
            value={newMenuItem.itemPrice}
            onChange={handleInputChange}
            sx={{ marginBottom: "20px" }}
          />
          <Box
            sx={{
              marginTop: "30px",
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Button
              onClick={handleAdd}
              variant="contained"
              color="primary"
              sx={{
                padding: "15px 30px",
                borderRadius: "8px",
                fontSize: "1.25rem",
                height: "60px",
                width: "50%",
              }}
            >
              Add
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000} // Duration of 3 seconds
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // Position at the top center
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity} // Dynamic severity (success or error)
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default AddMenuItem;
