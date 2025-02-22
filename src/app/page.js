"use client";
import {
  Box,
  Typography,
  Button,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setAuthenticated(true);
      router.push("/menu/menu");
    }
  }, [router]);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#f9fafb",
        overflow: "hidden",
      }}
    >
      {/* Main Content with Scrollbar */}
      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          overflowY: "auto",
          maxHeight: "100vh",
        }}
      >
        {/* AppBar */}
        <AppBar
          position="static"
          sx={{
            backgroundColor: "#26a69a",
            boxShadow: "none",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 20px",
          }}
        >
          <Toolbar sx={{ flexGrow: 1 }}>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Welcome to Canteen Management System
            </Typography>
          </Toolbar>
          <Button
            variant="contained"
            color="primary"
            sx={{
              borderRadius: "50px",
              padding: "10px 20px",
              fontWeight: "bold",
            }}
            onClick={() => router.push("/login")}
          >
            Login
          </Button>
        </AppBar>

        {/* Dashboard Content */}
        <Grid
          container
          spacing={4}
          justifyContent="center"
          sx={{ marginTop: 4 }}
        >
          {[
            {
              title: "Delicious Meals",
              img: "/images/food.jpg",
              desc: "Enjoy a variety of tasty dishes!",
            },
            {
              title: "Modern Canteen Facilities",
              img: "/images/canteen.jpg",
              desc: "Experience our clean and modern space.",
            },
            {
              title: "Refreshing Beverages",
              img: "/images/beverages.jpg",
              desc: "Enjoy a selection of refreshing drinks.",
            },
            {
              title: "Delicious Desserts",
              img: "/images/desserts.jpg",
              desc: "Satisfy your sweet tooth with our desserts.",
            },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box
                sx={{
                  padding: 3,
                  backgroundColor: "#ffffff",
                  borderRadius: 3,
                  textAlign: "center",
                  boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  style={{
                    width: "100%",
                    height: "160px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: "15px",
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{ color: "#26a69a", fontWeight: "bold" }}
                >
                  {item.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {item.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* About Us */}
        <Box sx={{ mt: 6, textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "#26a69a" }}
          >
            About Us
          </Typography>
          <Typography
            variant="body1"
            sx={{ mt: 2, maxWidth: "600px", margin: "auto" }}
          >
            Our canteen provides high-quality meals with a focus on hygiene and
            taste. We ensure the best dining experience with modern facilities
            and a variety of delicious meals prepared with love.
          </Typography>
        </Box>

        {/* Operating Hours */}
        <Box sx={{ mt: 6, textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "#26a69a" }}
          >
            Operating Hours
          </Typography>
          <Typography
            variant="body1"
            sx={{ mt: 2, maxWidth: "600px", margin: "auto" }}
          >
            Sunday - Friday: 8:00 AM - 8:00 PM
            <br />
            Saturday: 10:00 AM - 6:00 PM
          </Typography>
        </Box>

        {/* Contact Us Section */}
        <Box sx={{ mt: 6, textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "#26a69a" }}
          >
            Contact Us
          </Typography>
          <Typography
            variant="body1"
            sx={{ mt: 2, maxWidth: "600px", margin: "auto" }}
          >
            Phone: 9818940083, 9841538869
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
