"use client";
import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  IconButton,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { Close, VisibilityOutlined } from "@mui/icons-material";
import { fetchOrderItemsByOrderId, fetchOrdersByUserId } from "@/app/util/api";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { jwtDecode } from "jwt-decode";

const theme = createTheme({
  palette: {
    primary: { main: "#004d40" },
    secondary: { main: "#66bb6a" },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h4: { fontWeight: 600 },
  },
});

export default function OrderDashboard() {
  const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrderItems, setSelectedOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchUserIdAndOrders = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const decodedToken = jwtDecode(token);
        const userIdFromToken = decodedToken?.id;
        if (!userIdFromToken) return;

        setUserId(userIdFromToken);
        fetchUserOrders(userIdFromToken);
      } catch (error) {
        console.error("Error fetching User ID:", error);
      }
    };
    fetchUserIdAndOrders();
  }, []);

  const fetchUserOrders = async (userId) => {
    try {
      const response = await fetchOrdersByUserId(userId);
      // Ensure newest orders are displayed at the top
      setOrders(response ? response.reverse() : []);
    } catch (error) {
      console.error("Error fetching user orders:", error);
    }
  };

  const handleViewClick = async (orderId) => {
    setLoading(true);
    try {
      const orderItems = await fetchOrderItemsByOrderId(orderId);
      setSelectedOrderItems(orderItems);
      setTotalPrice(orderItems.reduce((acc, item) => acc + item.totalPrice, 0));
      setError("");
    } catch (err) {
      setError("Failed to fetch order items.");
      setSelectedOrderItems([]);
    } finally {
      setLoading(false);
    }
    setDialogOpen(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "grid", placeItems: "center", minHeight: "100vh", padding: 2 }}>
        <Box sx={{ width: "90%", maxWidth: 1200, borderRadius: 3, backgroundColor: "rgba(255, 255, 255, 0.9)", padding: 4 }}>
          <Typography variant="h4" textAlign="center" sx={{ color: "#004d40", fontWeight: "bold" }}>
            Order History
          </Typography>

          <TableContainer component={Paper} elevation={4} sx={{ maxHeight: 400, overflowY: "auto" }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ backgroundColor: "#004d40" }}>
                <TableRow>
                  {['Order ID', 'Order Number', 'Order Date', 'Status', 'Total Amount', 'Action'].map(header => (
                    <TableCell key={header} align="right" sx={{ color: "#ffffff", fontWeight: "bold" }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.length > 0 ? (
                  orders.map(row => (
                    <TableRow key={row.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: "#f8f9fa" } }}>
                      <TableCell align="right">{row.id}</TableCell>
                      <TableCell align="right">{row.orderNumber}</TableCell>
                      <TableCell align="right">{row.orderDate}</TableCell>
                      <TableCell align="right">{row.status}</TableCell>
                      <TableCell align="right">{row.totalAmount}</TableCell>
                      <TableCell align="right">
                        <IconButton color="primary" onClick={() => handleViewClick(row.id)}>
                          <VisibilityOutlined />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">No orders available.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle
            sx={{
              display: "flex", // Use flex to position the close button
              justifyContent: "space-between",
              alignItems: "center",
              color: "#004d40",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Order Details
            <IconButton onClick={() => setDialogOpen(false)}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {loading ? (
              <Typography textAlign="center">Loading...</Typography>
            ) : error ? (
              <Typography color="error" textAlign="center">{error}</Typography>
            ) : selectedOrderItems.length > 0 ? (
              <>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead sx={{backgroundColor: "#004d40", }}>
                      <TableRow>
                        <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>
                          Item Name
                        </TableCell>
                        <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>
                           Quantity
                        </TableCell>
                        <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>
                          Unit Price
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedOrderItems.map(item => (
                        <TableRow key={item.id}>
                          <TableCell>{item.menuItem?.itemName || "N/A"}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.menuItem?.itemPrice || "N/A"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box
                          sx={{
                            mt: 2,textAlign: "right",
                          }}
                        >
                          <Typography variant="h6" color="primary" fontWeight="bold">
                            Total Price: Rs {totalPrice}
                          </Typography>
                        </Box>
              </>
            ) : (
              <Typography textAlign="center">No items available for this order.</Typography>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}
