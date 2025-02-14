import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/slices/productsSlice";
import { addToCart } from "../store/slices/cartSlice";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Pagination,
  Modal,
  Box,
  IconButton,
  CircularProgress,
  Container,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ProductGrid = () => {
  const dispatch = useDispatch();
  const { items, selectedCategory, searchQuery, status } = useSelector(
    (state) => state.products
  );
  const cartItems = useSelector((state) => state.cart.items);

  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = items.filter((product) => {
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCartQuantity = (productId) => {
    const item = cartItems.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleOpen = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (status === "loading") {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (status === "failed") {
    return (
      <Typography variant="h6" align="center" color="error" sx={{ mt: 4 }}>
        Error loading products. Please try again later.
      </Typography>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container spacing={3} justifyContent="flex-start">
        {paginatedProducts.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                boxShadow: 3,
                cursor: "pointer",
              }}
              onClick={() => handleOpen(product)}
            >
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.title}
                sx={{ objectFit: "contain", p: 2, bgcolor: "#f8f8f8" }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h6"
                  sx={{ fontSize: "1rem", fontWeight: 500 }}
                >
                  {product.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {product.category}
                </Typography>
                <Typography color="primary" sx={{ fontWeight: 600, mt: 1 }}>
                  ${product.price}
                </Typography>
              </CardContent>
              <Button
                variant="contained"
                sx={{ m: 2 }}
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(addToCart(product));
                }}
              >
                Add to Cart{" "}
                {getCartQuantity(product.id) > 0 &&
                  `(${getCartQuantity(product.id)})`}
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={Math.ceil(filteredProducts.length / itemsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {/* Product Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 700,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          {selectedProduct && (
            <>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6" component="h2">
                  {selectedProduct.title}
                </Typography>
                <IconButton onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                style={{
                  width: "100%",
                  maxHeight: "250px",
                  objectFit: "contain",
                  marginTop: "10px",
                }}
              />
              <Typography variant="body1" sx={{ mt: 2 }}>
                {selectedProduct.description}
              </Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Price: ${selectedProduct.price}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => dispatch(addToCart(selectedProduct))}
              >
                Add to Cart
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default ProductGrid;
