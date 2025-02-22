"use client";
import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import {
  IconButton,
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { FilterList } from "@mui/icons-material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  fetchOrderById,
  fetchOrders,
  fetchOrdersByStatus,
  fetchOrdersByUserId,
  updateOrderStatus,
  fetchOrderItemsByOrderId,
  fetchOrdersByDate,
} from "@/app/util/api";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#004d40" },
    secondary: { main: "#66bb6a" },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    fontSize: 14,
    h4: { fontWeight: 600 },
    body1: { fontSize: "1rem" },
  },
});

const filterOptions = [
  { label: "Order Status", value: "status" },
  { label: "User ID", value: "user_id" },
  { label: "Order ID", value: "order_id" },
  { label: "Order Date", value: "date" },

];

export default function OrderDashboard() {
  const [orders, setOrders] = useState([]);
  const [filterType, setFilterType] = useState("status");
  const [filterValue, setFilterValue] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrderItems, setSelectedOrderItems] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      const response = await fetchOrders();
      // Ensure newest orders are displayed at the top
      setOrders(response ? response.reverse() : []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const applyFilter = async () => {
    try {
      let response;
      if (filterType === "status") {
        response = await fetchOrdersByStatus(filterValue);
      } else if (filterType === "user_id") {
        response = await fetchOrdersByUserId(filterValue);
      } else if (filterType === "order_id") {
        response = await fetchOrderById(filterValue);
        response = response ? [response] : [];
      }else if(filterType === "date"){
        response = await fetchOrdersByDate(filterValue);
      }
      setOrders(response || []);
    } catch (error) {
      console.error("Error applying filter:", error);
    }
  };

  const calculateTotalPrice = (items) => {
    const sum = items.reduce((acc, item) => acc + item.totalPrice, 0);
    setTotalPrice(sum);
  };

  const handleViewClick = async (order) => {
    setSelectedOrder(order);
    setLoading(true);
    try {
      const orderItems = await fetchOrderItemsByOrderId(order.id);
      setSelectedOrderItems(orderItems);
      calculateTotalPrice(orderItems);
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
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          minHeight: "100vh",
          padding: 2,
        }}
      >
        <Box
          sx={{
            width: "90%",
            maxWidth: 1200,
            borderRadius: 3,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            padding: 4,
          }}
        >
          <Typography
            variant="h4"
            textAlign="center"
            sx={{ color: "#004d40", fontWeight: "bold" }}
          >
            Order Management Dashboard
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <TextField
              select
              label="Filter By"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              sx={{ width: "30%" }}
            >
              {filterOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            {filterType === "status" ? (
              <TextField
                select
                label="Select Status"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                sx={{ width: "30%" }}
              >
                {["Paid", "Unpaid"].map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            ) : filterType === "date" ? (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Select Date"
                  value={filterValue ? dayjs(filterValue) : null}
                  onChange={(newValue) => setFilterValue(newValue ? newValue.format("YYYY-MM-DD") : "")}
                  sx={{ width: "30%" }}
                />
              </LocalizationProvider>
            ) : (
              <TextField
                label="Filter Value"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                sx={{ width: "30%" }}
              />
            )}

            <Button
              variant="contained"
              startIcon={<FilterList />}
              onClick={applyFilter}
              sx={{ width: "20%", backgroundColor: "#004d40" }}
            >
              Apply Filter
            </Button>
          </Box>


          <TableContainer
            component={Paper}
            elevation={4}
            sx={{ maxHeight: 400, overflowY: "auto" }}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ backgroundColor: "#004d40" }}>
                <TableRow>
                  {[
                    "Order ID",
                    "User ID",
                    "Order Number",
                    "Order Date",
                    "Status",
                    "Total Amount",
                    "Action",
                  ].map((header) => (
                    <TableCell key={header}
                    align="right"
                    sx={{ color: "#ffffff", fontWeight: "bold" }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {orders.length > 0 ? (
                <>
                  {orders.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ "&:hover": { backgroundColor: "#dfe6e9" } }}
                    >
                      <TableCell align="right">{row.id}</TableCell>
                      <TableCell align="right">
                        {row.user?.id || "N/A"}
                      </TableCell>
                      <TableCell align="right">{row.orderNumber}</TableCell>
                      <TableCell align="right">{row.orderDate}</TableCell>
                      <TableCell align="right">
                          <TextField
                            select
                            value={row.status || "Unpaid"}
                            onChange={async (e) => {
                              const newStatus = e.target.value;
                              try {
                                await updateOrderStatus(row.id, newStatus);setOrders((prevOrders) =>
                                  prevOrders.map((order) =>
                                    order.id === row.id
                                      ? { ...order, status: newStatus }
                                      : order
                                  )
                                );
                              } catch (error) {
                                console.error(
                                  "Failed to update order status:",
                                  error
                                );
                              }
                            }}
                            size="small"
                          >
                            <MenuItem value="Paid">Paid</MenuItem>
                            <MenuItem value="Unpaid">Unpaid</MenuItem>
                          </TextField>
                        </TableCell>
                      <TableCell align="right">{row.totalAmount}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() => handleViewClick(row)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}

                  <TableRow sx={{ backgroundColor: "#004d40" }}>
                    <TableCell
                      colSpan={6}
                      align="right"
                      sx={{ color: "#ffffff", fontWeight: "bold" }}
                    >
                      Total Amount:
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ color: "#ffffff", fontWeight: "bold" }}
                    >
                      {orders.reduce(
                        (sum, order) => sum + (order.totalAmount || 0),
                        0
                      )}
                    </TableCell>
                  </TableRow>
                </>
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No orders available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>

    <Dialog
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiPaper-root": {
          borderRadius: 3,
          backgroundColor: "#f7f7f7",
        },
      }}
    >
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
<IconButton
  onClick={() => setDialogOpen(false)}
  aria-label="close"
  sx={{ marginLeft: "auto", color: "black" }} // Align right and set color to black
>
  <CloseIcon />
</IconButton>
</DialogTitle>

<DialogContent sx={{ padding: 3 }}>
  {loading ? (
    <Typography variant="body1" textAlign="center">
      Loading...
    </Typography>
  ) : error ? (
    <Typography color="error" textAlign="center">
      {error}
    </Typography>
  ) : selectedOrderItems.length > 0 ? (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="body1" fontWeight="bold">
        User ID: {selectedOrder?.user?.id || "N/A"}
        </Typography>
        <Typography variant="body1" fontWeight="bold">
          Username: {selectedOrder?.user?.username || "N/A"}
        </Typography>
      </Box>

      {/* Order Items Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead
            sx={{
              backgroundColor: "#004d40",
            }}
          >
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
            {selectedOrderItems.map((item) => (
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
          mt: 2,
          textAlign: "right",
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
  </ThemeProvider>
);
}