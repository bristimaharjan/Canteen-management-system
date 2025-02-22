"use client";

import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import StudentSidebar from "./student/menu/student";
import { isTokenValid, removeToken } from "./util/authUtil";
import AdminSidebar from "./admin/menu/admin";
import theme from "./theme"; // Import your theme

export default function Layout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Tracks authentication
  const [userRole, setUserRole] = useState(null); // Tracks user role
  const [drawerOpen, setDrawerOpen] = useState(true); // Sidebar drawer state
  const [isLoading, setIsLoading] = useState(true); // Prevents flickering before token validation
  const router = useRouter();
  const pathname = usePathname();

  // Function to validate the user's token
  const validateToken = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    console.log("Validating token: ", token); // Debugging line
    console.log("User role: ", role); // Debugging line

    if (isTokenValid(token)) {
      setIsAuthenticated(true);
      setUserRole(role); // No need to re-fetch role again
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
      removeToken(); // Clear localStorage token
      // router.push("/login"); // Redirect to login page
    }
    setIsLoading(false); // Validation complete
  };

  // Run validation on mount or when pathname changes
  useEffect(() => {
    validateToken();
  }, [pathname, router]);

  // Function to toggle the sidebar drawer
  const toggleDrawer = () => setDrawerOpen((prev) => !prev);

  // Render nothing until validation is complete
  if (isLoading) {
    return null; // Or a loading spinner
  }

  // Check if the current page is either the login, home, or signup page
  const isLoginOrHomeOrSignup = pathname === "/login" || pathname === "/" || pathname === "/signup";

  // Render layout without theme and sidebar for login, home, and signup pages
  if (isLoginOrHomeOrSignup) {
    return (
      <html>
        <body>
          <Box component="main" sx={{ width: "100%", height: "100vh" }}>
            {children}
          </Box>
        </body>
      </html>
    );
  }

  // Render layout with theme and sidebar for other pages
  return (
    <ThemeProvider theme={theme}>
      <html>
        <body>
          <Box sx={{ display: "flex", width: "100%", height: "100vh" }}>
            <CssBaseline />

            {/* Conditionally render the sidebar based on authentication and user role */}
            {isAuthenticated && userRole === "student" && (
              <StudentSidebar drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />
            )}
            {isAuthenticated && userRole === "admin" && (
              <AdminSidebar drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />
            )}

            {/* Main Content Area */}
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                marginLeft: isAuthenticated ? (drawerOpen ? "240px" : "60px") : "0px",
                transition: "margin-left 0.1s ease",
                padding: 2,
              }}
            >
              {children}
            </Box>
          </Box>
        </body>
      </html>
    </ThemeProvider>
  );
}
