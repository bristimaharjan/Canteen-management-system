'use client'
import React, { useState } from 'react';
import { Box, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Typography } from '@mui/material';

const App = () => {
  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [products, setProducts] = useState([]);

  // Add or Update product
  const handleAddOrUpdate = () => {
    if (!productId || !productName || !price || !quantity) {
      alert('Please fill out all fields.');
      return;
    }

    const existingProduct = products.find((p) => p.productId === productId);

    if (existingProduct) {
      // Update
      const updatedProducts = products.map((p) =>
        p.productId === productId
          ? { ...p, productName, price, quantity }
          : p
      );
      setProducts(updatedProducts);
    } else {
      // Add
      setProducts([
        ...products,
        { productId, productName, price, quantity },
      ]);
    }

    resetForm();
  };

  // Delete product
  const handleDelete = (id) => {
    setProducts(products.filter((p) => p.productId !== id));
  };

  // Reset form
  const resetForm = () => {
    setProductId('');
    setProductName('');
    setPrice('');
    setQuantity('');
  };

  return (
    <Box p={4}>
      {/* Header */}
      <Typography variant="h4" gutterBottom>
         Inventory Mgm
      </Typography>

      {/* Form Section */}
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        marginBottom={2}
      >
        <TextField
          label="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          variant="outlined"
          style={{ marginRight: 10 }}
        />
        <TextField
          label="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          variant="outlined"
          style={{ marginRight: 10 }}
        />
        <TextField
          label="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          variant="outlined"
          style={{ marginRight: 10 }}
        />
        <Select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          displayEmpty
          style={{ width: 100, marginRight: 10 }}
        >
          <MenuItem value="" disabled>
            Product ID
          </MenuItem>
          {Array.from({ length: 10 }).map((_, i) => (
            <MenuItem value={i + 1} key={i}>
              {i + 1}
            </MenuItem>
          ))}
        </Select>
        <Button variant="contained" onClick={handleAddOrUpdate}>
          Search
        </Button>
      </Box>

      {/* Action Buttons */}
      <Box marginBottom={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddOrUpdate}
          style={{ marginRight: 10 }}
        >
          Add
        </Button>
        <Button
          variant="contained"
          color="warning"
          style={{ marginRight: 10 }}
          onClick={() => alert('Update functionality is the same as Add in this setup.')}
        >
          Update
        </Button>
        <Button
          variant="contained"
          color="error"
          style={{ marginRight: 10 }}
          onClick={() => handleDelete(productId)}
        >
          Delete
        </Button>
        <Button variant="contained" color="success" onClick={resetForm}>
          New
        </Button>
      </Box>

      {/* Table Section */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product ID</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.productId}>
                <TableCell>{product.productId}</TableCell>
                <TableCell>{product.productName}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(product.productId)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default App;
