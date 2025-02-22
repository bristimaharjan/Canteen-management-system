"use client";
import React, { useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, TextField, Typography, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material"; // Import visibility icons
import { login } from "../util/api";
import { useRouter } from "next/navigation";

export default function Login() {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
    role: "",
  });

  const [showPassword, setShowPassword] = useState(false); // Track password visibility
  const [errorDialogOpen, setErrorDialogOpen] = useState(false); // Track error dialog visibility
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Submitted Data: ", loginData);
      const response = await login(loginData);
      console.log("API Response: ", response);

      if (response?.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("userRole", loginData.role.toLowerCase());

        const normalizedRole = loginData.role.toLowerCase();
        if (normalizedRole === "admin") {
          router.push("/admin");
        } else if (normalizedRole === "student") {
          router.push("/student");
        } else {
          console.error("Invalid role provided!");
          alert("Invalid role! Please enter 'Admin' or 'Student'.");
        }
      } else {
        console.error("Login failed: Missing token");
        setErrorDialogOpen(true);
      }
    } catch (error) {
      console.error("Login Error: ", error);
      setErrorDialogOpen(true);
    }
  };

  const handleDialogClose = () => {
    setErrorDialogOpen(false);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage: "url('/images/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        imageRendering: "auto",
      }}
    >
      <Box
        sx={{
          width: 350,
          padding: 4,
          borderRadius: 3,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Typography variant="h4" gutterBottom textAlign="center" color="primary">
          Welcome Back!
        </Typography>
        <Typography variant="body2" textAlign="center" gutterBottom sx={{ color: "#636e72" }}>
          Login to continue to your dashboard.
        </Typography>
        <Grid container direction="column" spacing={3}>
          <Grid item>
            <TextField
              label="Role (Admin/Student)"
              variant="outlined"
              name="role"
              fullWidth
              value={loginData.role}
              onChange={handleChange}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Username"
              variant="outlined"
              name="username"
              fullWidth
              value={loginData.username}
              onChange={handleChange}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Password"
              variant="outlined"
              name="password"
              fullWidth
              type={showPassword ? "text" : "password"} // Toggle between text and password
              value={loginData.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePasswordVisibility}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit}
              sx={{
                backgroundColor: "#6c5ce7",
                color: "#fff",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#5a4dcb",
                },
              }}
            >
              Login
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Error Dialog */}
      <Dialog open={errorDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Login Failed</DialogTitle>
        <DialogContent>
          <DialogContentText>Invalid credentials!</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
