import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { useAuth } from "./context/AuthContext";
import { Login } from "./pages/Login";
import { DashboardLayout } from "./components/DashboardLayout";
import { Dashboard } from "./pages/Dashboard";
import { Academic } from "./pages/Academic";
import { Students } from "./pages/Students";
import { Teachers } from "./pages/Teachers";
import { Attendance } from "./pages/Attendance";
import { Fees } from "./pages/Fees";
import { Exams } from "./pages/Exams";
import { Library } from "./pages/Library";
import { Transport } from "./pages/Transport";
import { Accounts } from "./pages/Accounts";
import { Communication } from "./pages/Communication";
import { Reports } from "./pages/Reports"; 
function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <Typography
          variant="h3"
          color="text.secondary"
          sx={{ fontFamily: '"Roboto", "Arial", sans-serif' }}
        >
          Loading ERP...
        </Typography>
      </Box>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
  path="/login"
  element={
    !isAuthenticated ? (
      <DashboardLayout>
        <Login />
      </DashboardLayout>
    ) : (
      <Navigate to="/" />
    )
  }
/>

        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <DashboardLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/academic" element={<Academic />} />
                  <Route path="/students" element={<Students />} />
                  <Route path="/teachers" element={<Teachers />} />
                  <Route path="/attendance" element={<Attendance />} />
                  <Route path="/fees" element={<Fees />} />
                  <Route path="/exams" element={<Exams />} />
                  <Route path="/library" element={<Library />} />
                  <Route path="/transport" element={<Transport />} />
                  <Route path="/accounts" element={<Accounts />} />
                  <Route path="/communication" element={<Communication />} />
                  <Route path="/reports" element={<Reports />} />{" "}
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </DashboardLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
