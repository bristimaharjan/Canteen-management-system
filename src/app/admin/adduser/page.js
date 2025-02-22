"use client";

import React, { useState } from "react";
import { Box, Button, TextField, Typography, Snackbar, Alert, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";  // Import visibility icons
import { addUser } from "../../util/api";  // Importing the addUser function
import { useRouter } from "next/navigation"; // Import useRouter

export default function SignUp() {
  const router = useRouter();  // Initialize router for navigation
  const [signUpData, setSignUpData] = useState({
    firstname: "",
    lastname: "",
    role: "",
    email: "",
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state
  const [showPassword, setShowPassword] = useState(false);  // State for toggling password visibility

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignUpData({
      ...signUpData,
      [name]: value,
    });

    // Reset errors for the current field
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    const newErrors = {};

    if (!signUpData.email.endsWith("@gmail.com")) {
      newErrors.email = "Email must end with @gmail.com";
      valid = false;
    }

    if (signUpData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
      valid = false;
    }

    if (!valid) {
      setErrors(newErrors);
      return;
    }

    console.log("Sign Up Data:", signUpData);

    try {
      await handleAdd(signUpData);
      console.log("User added successfully!");
      setSnackbarOpen(true);  // Open the Snackbar
      setTimeout(() => router.push("/admin/viewuser"), 3000);  // Redirect after a delay
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleAdd = async (user) => {
    try {
      await addUser(user);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);  // Toggle password visibility state
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "70%",
        maxWidth: "1600px",
        padding: 2,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Box bgcolor="white" p={4} borderRadius={4} boxShadow={4} width={400}>
        <Typography variant="h4" color="#004d40" align="center" gutterBottom>
          Add user
        </Typography>

        <TextField
          label="Firstname"
          name="firstname"
          variant="outlined"
          value={signUpData.firstname}
          fullWidth
          margin="normal"
          required
          onChange={handleChange}
        />
        <TextField
          label="Lastname"
          name="lastname"
          variant="outlined"
          value={signUpData.lastname}
          fullWidth
          margin="normal"
          required
          onChange={handleChange}
        />
        <TextField
          label="Role"
          name="role"
          variant="outlined"
          value={signUpData.role}
          fullWidth
          margin="normal"
          onChange={handleChange}
          error={Boolean(errors.role)}
          helperText={errors.role}
        />
        <TextField
          label="Email ID"
          name="email"
          variant="outlined"
          value={signUpData.email}
          fullWidth
          margin="normal"
          required
          onChange={handleChange}
          error={Boolean(errors.email)}
          helperText={errors.email}
        />
        <TextField
          label="Username"
          name="username"
          variant="outlined"
          value={signUpData.username}
          fullWidth
          margin="normal"
          onChange={handleChange}
          error={Boolean(errors.username)}
          helperText={errors.username}
        />
        <TextField
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}  // Conditionally show password
          variant="outlined"
          value={signUpData.password}
          fullWidth
          margin="normal"
          required
          onChange={handleChange}
          error={Boolean(errors.password)}
          helperText={errors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={togglePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button variant="contained" color="primary" fullWidth style={{ marginTop: "20px" }} onClick={handleSubmit}>
          Add
        </Button>
      </Box>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}  // Position Snackbar at top-center
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          User added successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}
