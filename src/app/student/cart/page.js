"use client";
import { useState, useEffect } from "react";
import { fetchCartItems, removeCartItem, updateCartItemQuantity, fetchByUserId, makeApiCall, addOrder } from "../../util/api";
import { jwtDecode } from "jwt-decode";
import { 
  Container, Table, TableHead, TableBody, TableRow, TableCell, 
  Typography, CircularProgress, Alert, Button, TextField,
  Box,
  TableContainer,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar
} from "@mui/material";
import { Close, Delete} from "@mui/icons-material";
import { useRouter } from "next/navigation";


export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const router = useRouter();


  useEffect(() => {
      const fetchUserId = async () => {
        try {
          const token = localStorage.getItem('authToken');
          if (token) {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.id;
            setUserId(userId);
            localStorage.setItem('userId', userId);
    
            if (userId) {
              console.log('User ID:', userId);
              const response = await makeApiCall(`/api/carts/${userId}`);
              console.log('Response:', response);
            } else {
              console.error("User ID not found in the decoded token");
            }
          } else {
            console.error("No auth token found");
          }
        } catch (error) {
          console.error('Error fetching User ID:', error);
        }
      };
    
      fetchUserId();
      getUserCart();
    }, []);  

  const getUserCart = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authentication required.");
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken?.id;

      if (!userId) {
        setError("User ID not found.");
        return;
      }

      const cartResponse = await fetchByUserId(userId);
      const cartId = cartResponse?.cartId;

      if (!cartId) {
        setError("Cart data not found.");
        return;
      }

      setCartId(cartId);
      await fetchCartItemsFromAPI(cartId);
    } catch (error) {
      setError("Failed to retrieve user cart.");
    }
  };

  const fetchCartItemsFromAPI = async (cartId) => {
    try {
      setLoading(true);
      const data = await fetchCartItems(cartId);
      if (Array.isArray(data)) {
        setCartItems(data);
        calculateTotalPrice(data);
      } else {
        throw new Error("Invalid cart data format");
      }
    } catch {
      setError("Failed to load cart items.");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = (items) => {
    const total = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    setTotalPrice(total.toFixed(2));
  };

  const handleRemoveCartItem = async (userId, itemId) => {
    try {
      await removeCartItem(userId, itemId);
      fetchCartItemsFromAPI(cartId); // Fetch updated cart items after removal
    } catch {
      alert("Failed to remove item.");
    }
  };

  const handleUpdateCartItemQuantity = async (cartItemId, newQuantity) => {
    try {
      await updateCartItemQuantity(cartItemId, newQuantity);
      fetchCartItemsFromAPI(cartId);
    } catch {
      alert("Failed to update quantity.");
    }
  };
  const handleProceed = async () => {
    if (!cartId || !userId) {
      alert("Cart or User information is missing!");
      return;
    }
  
    const orderData = {
      status: "Unpaid",
      totalAmount: totalPrice,
      user: { id: userId },
      cart: { cartId: cartId },
      // Passing cart items to the backend
      cartItems: cartItems.map(item => ({
        menuItem: item.menuItem,  // Include item details for the order
        quantity: item.quantity,
        totalPrice: item.totalPrice,
      }))
    };
  
    try {
      const response = await addOrder(orderData);
      console.log("Order Response:", response);
  
      if (response?.id && response?.status === "Unpaid") {
        setSnackbarMessage("Order placed successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        console.log("Closing dialog...");
        setOpenDialog(false);
  
        console.log("Clearing cart...");
        await handleClearCart();
        setTimeout(() => router.push("/student/order"), 1000);
        
      } else {
        alert("Failed to place order. The response does not match the expected format.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing the order.");
    }
  };
  
  const handleBuyNow = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty! Add items before proceeding.");
      return;
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleClearCart = async () => {
    try {
      if (!cartItems.length) return; // Avoid unnecessary execution
  
      console.log("Clearing cart items...");
      
      await Promise.all(
        cartItems.map((item) => removeCartItem(userId, item.menuItem.itemId))
      );
  
      console.log("Cart items removed. Updating state...");
      setCartItems([]); 
      setTotalPrice(0);
      console.log("Cart cleared successfully!");
      
    } catch (error) {
      console.error("Failed to clear cart:", error);
      alert("Failed to clear cart.");
    }
  };  

  if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;
  if (error) return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;

  return (
    <Box
      sx={{
        padding: "20px",
        background: "#f9f9f9",
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        maxWidth: "80%",
        margin: "auto",
        marginTop: "20px",
      }}
    >
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          🛒 Your Cart
        </Typography>

        {cartItems.length === 0 ? (
          <Typography align="center" color="textSecondary" variant="h6">
            Your cart is empty.
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: "12px" }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#004d40" }}>
                <TableRow>
                  <TableCell sx={{ color: "white" }}>Item Name</TableCell>
                  <TableCell align="center" sx={{ color: "white" }}>Quantity</TableCell>
                  <TableCell align="right" sx={{ color: "white" }}>Price</TableCell>
                  <TableCell align="center" sx={{ color: "white" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item) => (
                  <TableRow key={item.cartItemId} hover>
                    <TableCell>{item.menuItem?.itemName || "Unnamed Item"}</TableCell>
                    <TableCell align="center">
                      <TextField
                        type="number"
                        variant="outlined"
                        size="small"
                        defaultValue={item.quantity}
                        onBlur={(e) => handleUpdateCartItemQuantity(item.cartItemId, parseInt(e.target.value))}
                        sx={{ width:80 }}
                        />
                      </TableCell>
                      <TableCell align="right">Rs {item.totalPrice?.toFixed(2) || "0.00"}</TableCell>
                      <TableCell align="center">
                      <Button 
                        onClick={() => handleRemoveCartItem(userId, item.menuItem.itemId)}
                        sx={{ color: "#00695c" }}
                      >
                        <Delete/>
                      </Button>
                      </TableCell> 
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
  
          {/* Total Price & Buy Now Button in the Same Box */}
          <Box
            sx={{
              mt: 4,
              p: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#ffffff",
              borderRadius: "10px",
              color: "black",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Total: Rs {totalPrice}
            </Typography>
  
            <Button 
              variant="contained" 
              sx={{ backgroundColor: "#004d40"}} 
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>
          </Box>
          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
    <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.5rem", textAlign: "center" }}>
      Bill
      <Button onClick={handleCloseDialog} sx={{ position: "absolute", right: 10, top: 10 }}>
        <Close />
      </Button>
    </DialogTitle>
    <DialogContent sx={{ p: 3, background: "#f4f4f4" }}>
      <TableContainer component={Paper} sx={{ borderRadius: "12px", overflow: "hidden" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#004d40" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Item</TableCell>
              <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>Quantity</TableCell>
              <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cartItems.map((item) => (
              <TableRow key={item.cartItemId}>
                <TableCell sx={{ fontSize: "1.1rem" }}>{item.menuItem?.itemName || "Unnamed Item"}</TableCell>
                <TableCell align="center" sx={{ fontSize: "1.1rem" }}>{item.quantity}</TableCell>
                <TableCell align="right" sx={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                  Rs {item.totalPrice?.toFixed(2) || "0.00"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
  
      {/* Total & Proceed Button */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3, p: 2, background: "#fff", borderRadius: "8px" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Total: Rs {cartItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0).toFixed(2)}
        </Typography>
        <Button variant="contained" color="primary"onClick={handleProceed}>
          Proceed
        </Button>
      </Box>
      </DialogContent>
          </Dialog>
          <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // Set to top-center
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
  
          {/* Clear Cart Button */}
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Button 
              variant="contained"             
              sx={{ backgroundColor: "#004d40"}} 
              onClick={handleClearCart}
            >
              Clear Cart
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }