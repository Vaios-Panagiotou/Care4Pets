import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Alert, Box, Button, Container, Typography } from "@mui/material";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Contact from "./pages/contact";
import LostPets from "./pages/lostpets";
import OwnerDashboard from "./pages/OwnerDashboard";
import VetDashboard from "./pages/VetDashboard";
import PlaceholderPage from "./pages/PlaceholderPage"; // Το νέο αρχείο
import MyPets from "./pages/MyPets";
import Profile from "./pages/Profile";
import PetHealthBook from "./pages/PetHealthBook"; // IMPORT
import VetSearch from "./pages/VetSearch"; // IMPORT
import History from "./pages/History"; // <--- IMPORT
import NewRecord from "./pages/NewRecord"; // IMPORT
import VetSchedule from "./pages/VetSchedule"; // IMPORT
import VetClinic from "./pages/VetClinic"; // IMPORT
import News from "./pages/News"; // IMPORT
import NewsDetail from "./pages/NewsDetail"; // IMPORT
import { AuthProvider, useAuth } from "./context/AuthContext";
import Footer from "./components/Footer";

function PrivateRoute({ children, role }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (role && user.role !== role) {
    // Show unauthorized access page
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Μη Εξουσιοδοτημένη Πρόσβαση
            </Typography>
            <Typography variant="body2">
              Προσπαθείτε να αποκτήσετε πρόσβαση σε περιοχή {role === 'owner' ? 'ιδιοκτήτη' : 'κτηνιάτρου'}, αλλά είστε συνδεδεμένοι ως {user.role === 'owner' ? 'ιδιοκτήτης' : 'κτηνίατρος'}.
            </Typography>
          </Alert>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
            <Button 
              variant="contained" 
              onClick={() => window.location.href = user.role === 'owner' ? '/owner' : '/vet'}
            >
              Μετάβαση στο Dashboard μου
            </Button>
            <Button 
              variant="outlined" 
              color="error"
              onClick={() => {
                logout();
                window.location.href = '/login';
              }}
            >
              Αποσύνδεση
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }
  
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
        {/* Δημόσιες Σελίδες */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/lost-pets" element={<LostPets />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsDetail />} />

        {/* Σελίδες Συνδεδεμένων Χρηστών (Owner) */}
        <Route
          path="/owner"
          element={
            <PrivateRoute role="owner">
              <OwnerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/owner/pets"
          element={
            <PrivateRoute role="owner">
              <MyPets />
            </PrivateRoute>
          }
        />
        <Route
          path="/owner/profile"
          element={
            <PrivateRoute role="owner">
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/owner/health-book/:id"
          element={
            <PrivateRoute role="owner">
              <PetHealthBook />
            </PrivateRoute>
          }
        />
        <Route
          path="/owner/search"
          element={
            <PrivateRoute role="owner">
              <VetSearch />
            </PrivateRoute>
          }
        />
        <Route
          path="/owner/history"
          element={
            <PrivateRoute role="owner">
              <History />
            </PrivateRoute>
          }
        />
        <Route
          path="/owner/book"
          element={
            <PrivateRoute role="owner">
              <PlaceholderPage title="Κλείσιμο Ραντεβού" />
            </PrivateRoute>
          }
        />

        {/* Σελίδες Κτηνιάτρων (Vet) */}
        <Route
          path="/vet"
          element={
            <PrivateRoute role="vet">
              <VetDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/vet/new-record"
          element={
            <PrivateRoute role="vet">
              <NewRecord />
            </PrivateRoute>
          }
        />
        <Route
          path="/vet/schedule"
          element={
            <PrivateRoute role="vet">
              <VetSchedule />
            </PrivateRoute>
          }
        />
        <Route
          path="/vet/profile"
          element={
            <PrivateRoute role="vet">
              <VetClinic />
            </PrivateRoute>
          }
        />
        <Route
          path="/vet/clinic"
          element={
            <PrivateRoute role="vet">
              <VetClinic />
            </PrivateRoute>
          }
        />
        <Route
          path="/vet/patients"
          element={
            <PrivateRoute role="vet">
              <PlaceholderPage title="Διαχείριση Ασθενών" />
            </PrivateRoute>
          }
        />
      </Routes>
      </div>
      <Footer />
      </div>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;