import axios from "axios";
import { getToken, saveToken } from "./authUtil";

const API_BASE_URL = "http://localhost:8080";

export async function makeApiCall(endpoint, method = "GET", body = null) {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers,
    };

    if (body) {
      config.data = body;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Error in API call to ${endpoint}:`, error);

    // Check if the error is a response error
    if (error.response) {
      throw new Error(error.response.data.message || "API error");
    } else {
      throw new Error(error.message);
    }
  }
}

export function getUsers(){
    return makeApiCall("/users/list", "GET");
}

export async function login(data) {
    console.log("Making api call");
    const response = await makeApiCall("/auth/login", "POST", data);
    saveToken(response.token); 
    return response;
    
}

export async function deleteUser(id) {
    return await makeApiCall(`/users/${id}`,"DELETE");
    
}
export async function addUser(User){
  console.log("Adding user to database");
  return await makeApiCall(`/users/add`,"POST",User);
}
export async function updateUser(id, userData) {
  return await makeApiCall(`/users/update/${id}`, "PUT", userData);
}


export async function fetchMenuItems() {
    console.log("Fetching menu items");
    return await makeApiCall("/menu_items/list", "GET");
}

export async function addMenuItems(MenuItem){
    console.log("Adding menu items");
    return await makeApiCall(`/menu_items/add`,"POST",MenuItem);
}

export async function deleteMenuItem(itemId) {
    console.log("Deleting menu items");
    return await makeApiCall(`/menu_items/${itemId}`,"DELETE");
    
}

export async function updateMenuItem(MenuItem, itemId) {
    console.log("Updating menu items");
    return await makeApiCall(`/menu_items/${itemId}`, "PUT", MenuItem);
}

export async function findByItemId  (itemId) {
    return await makeApiCall(`/menu_items/${itemId}`, "GET");
}
export async function fetchOrders() {
  return await makeApiCall("/orders/list", "GET");
}
export async function fetchOrdersByStatus(status) {
  return await makeApiCall(`/orders/status/${status}`, "GET");
}
//export async function fetchOrdersByUserId(userId) {
  //return await makeApiCall(`/orders/user/${userId}`, "GET");
//}
export async function fetchOrderById(orderId) {
  return await makeApiCall(`/orders/${orderId}`, "GET");
}
export async function fetchOrdersByMenuItemId(itemId) {
  return await makeApiCall(`/orders/menu_items/${itemId}`, "GET");
}
// Function to fetch cart items
export const fetchCartItems = async (cartId) => {
  try {
    const response = await makeApiCall(`/api/cart-items/cart/${cartId}`);
    return response;
  } catch (err) {
    console.error("Error fetching cart items:", err);
    throw err;
  }
};

export const addToCart = async (userId, itemId, quantity) => {
  console.log(userId, itemId, quantity);
  try {
    const response = await makeApiCall(
      `/api/carts/${userId}/add?itemId=${itemId}&quantity=${quantity}`, // Append query params to URL
      "POST",  // Correctly specify HTTP method
      null  // No request body needed
    );
    console.log("Item added to cart:", response);
    return response;
  } catch (err) {
    console.error(
      "Error adding item to cart:",
      err.response ? err.response.data : err.message
    );
    throw err;
  }
};

// Function to remove an item from the cart
export const removeCartItem = async (userId, itemId) => {
  try {
    // Make API call to remove the item from the cart
    const response = await makeApiCall(`/api/carts/${userId}/remove?itemId=${itemId}`,"DELETE");
    if (response.status === 200) {
      console.log('Item successfully removed from the cart');
      return true;
    }
  } catch (err) {
    if (err.response) {
      console.error("Error removing cart item:", err.response);
    } else {
      console.error("Error removing cart item:", err.message);
    }
    throw new Error("Failed to remove item");
  }
};

// Function to update the quantity of a cart item
export const updateCartItemQuantity = async (cartItemId, newQuantity) => {
  try {
    await makeApiCall(`/api/cart-items/${cartItemId}/quantity?newQuantity=${newQuantity}`,"PUT",
      null,
      { params: { newQuantity } }
    );
    return true;
  } catch (err) {
    console.error("Error updating quantity:", err);
    throw new Error("Failed to update quantity");
  }
};

export async function fetchByUserId(userId) {
  return await makeApiCall(`/api/carts/${userId}`,"GET");
}
export async function addOrder(order) {
  console.log("Adding order", order);
  return await makeApiCall(`/orders/add`, "POST", order);
}

// Function to fetch total users
export async function fetchTotalUsers() {
  return await makeApiCall("/users/total-users", "GET");
}
// Fetch total orders
export async function fetchTotalOrders() {
  return await makeApiCall("/orders/total-orders", "GET");
}

// Fetch total sales
export async function fetchTotalSales() {
  return await makeApiCall("/orders/total-sales", "GET");
}
export const fetchOrdersByUserId = async (userId) => {
  try {
    const token = localStorage.getItem("authToken"); // Get token from storage
    if (!token) {
      throw new Error("No authentication token found.");
    }

    // Make API call with Authorization header
    const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Log full response for debugging
    console.log("API Response:", response);

    if (!response.ok) {
      throw new Error(`Error fetching orders: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Fetched Orders:", data);

    return data;
  } catch (error) {
    console.error("Failed to fetch user orders:", error);
    return []; // Return an empty array in case of failure
  }

};

// Update order status
export const updateOrderStatus = async (id, status) => {
  try {
    const response = await makeApiCall(`/orders/${id}/status`,"PUT", {
      status,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

export async function fetchOrderItemsByOrderId(orderId) {
  console.log("Fetching order items for order ID:", orderId);
  return await makeApiCall(`/orderItem/order/${orderId}/items`, "GET");
}
export const fetchOrdersByDate = async (date) => {
  return await makeApiCall(`/orders/by-date?date=${date}`,"GET");
  
};