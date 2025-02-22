"use client";

import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { addUser } from "../util/api";  // Importing the addUser function
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
      router.push("/login");
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

  return (
    <Box
    sx={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width: "100%", // Increase the width to 80% of the viewport
    maxWidth: "1600px", // Optional: Max width to ensure it doesn't get too large
    padding: 2,
    backgroundImage: "url('/images/background.jpg')", // Background image
        backgroundSize: "cover", // Ensure the image covers the full screen
        backgroundPosition: "center", //
    // Center the background image
  }}
>
      <Box bgcolor="white" p={4} borderRadius={4} boxShadow={4} width={400}>
        <Typography variant="h4" color="#004d40" align="center" gutterBottom>
          Sign Up
        </Typography>

        <TextField label="firstname" name="firstname" variant="outlined" value={signUpData.firstname} fullWidth margin="normal" required onChange={handleChange} />
        <TextField label="lastname" name="lastname" variant="outlined" value={signUpData.lastname} fullWidth margin="normal" required onChange={handleChange} />
        <TextField label="Role" name="role" variant="outlined" value={signUpData.role} fullWidth margin="normal" onChange={handleChange} error={Boolean(errors.role)} helperText={errors.role} />
        <TextField label="Email ID" name="email" variant="outlined" value={signUpData.email} fullWidth margin="normal" required onChange={handleChange} error={Boolean(errors.email)} helperText={errors.email} />
        <TextField label="Username" name="username" variant="outlined" value={signUpData.username} fullWidth margin="normal" onChange={handleChange} error={Boolean(errors.username)} helperText={errors.username} />
        <TextField label="Password" name="password" type="password" variant="outlined" value={signUpData.password} fullWidth margin="normal" required onChange={handleChange} error={Boolean(errors.password)} helperText={errors.password} />

        <Box display="flex" justifyContent="space-between" alignItems="center" marginTop={2}>
          <Typography variant="body2">
            <a href="/login" style={{ textDecoration: "none", color: "#004d40" }}>
              Already have an account? Login here!
            </a>
          </Typography>
        </Box>

        <Button variant="contained" color="primary" fullWidth style={{ marginTop: "20px" }} onClick={handleSubmit}>
          Sign Up
        </Button>
      </Box>
    </Box>
  );
}
