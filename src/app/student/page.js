"use client";
import { Box, Typography, Grid } from "@mui/material";

export default function StudentHomepage() {
  return (
    <html>
      <body>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            gap: 4,
            padding: 3,
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
            width: "60%",
            margin: "auto",
            position: "absolute",
            top: "50%",
            left: "calc(50% + 40px)", // Adjusted to shift slightly right
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#26a69a" }}
          >
            Welcome to the Canteen Management System!
          </Typography>
          <Typography variant="body1" sx={{ color: "#616161" }} paragraph>
            Simplify ordering, streamline inventory, and optimize operations for a
            seamless canteen experience.
          </Typography>

          {/* Grid for Features */}
          <Grid container spacing={4} justifyContent="center">
            {/* Delicious Meals */}
            <Grid item xs={12} sm={6} md={3}>
              <Box
                sx={{
                  padding: 2,
                  backgroundColor: "#e0f2f1",
                  borderRadius: 2,
                  textAlign: "center",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <img
                  src="/images/food.jpg"
                  alt="Food"
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: "10px",
                  }}
                />
                <Typography variant="h6" sx={{ color: "#26a69a", fontWeight: "bold" }}>
                  Delicious Meals
                </Typography>
                <Typography variant="body2" sx={{ color: "#616161" }}>
                  Enjoy a variety of tasty dishes!
                </Typography>
              </Box>
            </Grid>

            {/* Modern Canteen Facilities */}
            <Grid item xs={12} sm={6} md={3}>
              <Box
                sx={{
                  padding: 2,
                  backgroundColor: "#e0f2f1",
                  borderRadius: 2,
                  textAlign: "center",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <img
                  src="/images/canteen.jpg"
                  alt="Canteen"
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: "10px",
                  }}
                />
                <Typography variant="h6" sx={{ color: "#26a69a", fontWeight: "bold" }}>
                  Modern Canteen Facilities
                </Typography>
                <Typography variant="body2" sx={{ color: "#616161" }}>
                  Experience our clean and modern space.
                </Typography>
              </Box>
            </Grid>

            {/* Refreshing Beverages */}
            <Grid item xs={12} sm={6} md={3}>
              <Box
                sx={{
                  padding: 2,
                  backgroundColor: "#e0f2f1",
                  borderRadius: 2,
                  textAlign: "center",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <img
                  src="/images/beverages.jpg"
                  alt="Beverages"
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: "10px",
                  }}
                />
                <Typography variant="h6" sx={{ color: "#26a69a", fontWeight: "bold" }}>
                  Refreshing Beverages
                </Typography>
                <Typography variant="body2" sx={{ color: "#616161" }}>
                  Enjoy a selection of refreshing drinks.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </body>
    </html>
  );
}

