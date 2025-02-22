"use client";
import { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { IconButton, Box, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Snackbar, Alert } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { deleteUser, getUsers, updateUser } from "@/app/util/api";
import theme from "@/app/theme";

export default function BasicTable() {
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      fetchUsers();
      setSnackbarMessage("User deleted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Failed to delete user.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleSave = async () => {
    try {
      await updateUser(selectedUser.id, selectedUser);
      fetchUsers();
      setSnackbarMessage("User updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      handleDialogClose();
    } catch (error) {
      setSnackbarMessage("Failed to update user.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "grid", placeItems: "center", height: "100vh", padding: 2, overflowY: "auto" }}>
        <Box
          sx={{
            width: "100%",
            maxWidth: "1600px",
            borderRadius: 3,
            backgroundColor: "#ffffff",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            padding: 4,
            overflowY: "auto",
            maxHeight: "95vh",
          }}
        >
          <Typography variant="h4" gutterBottom textAlign="center" sx={{ color: "#004d40", fontWeight: "bold" }}>
            User Management Table
          </Typography>
          <TableContainer component={Paper} elevation={4} sx={{ maxHeight: "60vh", overflowY: "auto" }}>
            <Table sx={{ minWidth: 300, borderRadius: 2 }} aria-label="simple table">
              <TableHead sx={{ backgroundColor: "#004d40" }}>
                <TableRow>
                  {["Id", "Email", "Firstname", "Lastname", "Role", "Username", "Action"].map((header) => (
                    <TableCell key={header} align="right" sx={{ color: "#ffffff", fontWeight: "bold", textTransform: "uppercase" }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      "&:nth-of-type(odd)": { backgroundColor: "#f8f9fa" },
                      "&:nth-of-type(even)": { backgroundColor: "#ffffff" },
                      "&:hover": { backgroundColor: "#e0f7fa" },
                    }}
                  >
                    <TableCell align="right">{row.id}</TableCell>
                    <TableCell align="right">{row.email}</TableCell>
                    <TableCell align="right">{row.firstname}</TableCell>
                    <TableCell align="right">{row.lastname}</TableCell>
                    <TableCell align="right">{row.role}</TableCell>
                    <TableCell align="right">{row.username}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
                        <IconButton onClick={() => handleEdit(row)} sx={{ color: "#2e7d32", "&:hover": { color: "#1b5e20" } }}>
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(row.id)} sx={{ color: "#d32f2f", "&:hover": { color: "#b71c1c" } }}>
                          <Delete />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* Edit User Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "400px", mt: 2 }}>
              <TextField label="Email" value={selectedUser.email} fullWidth onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })} />
              <TextField label="Firstname" value={selectedUser.firstname} fullWidth onChange={(e) => setSelectedUser({ ...selectedUser, firstname: e.target.value })} />
              <TextField label="Lastname" value={selectedUser.lastname} fullWidth onChange={(e) => setSelectedUser({ ...selectedUser, lastname: e.target.value })} />
              <TextField label="Role" value={selectedUser.role} fullWidth onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })} />
              <TextField label="Username" value={selectedUser.username} fullWidth onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
          <Button onClick={handleSave} color="primary" variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
