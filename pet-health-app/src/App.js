import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import Navbar from "./components/Navbar";
import { createTheme, ThemeProvider } from '@mui/material/styles';

function PrivateRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (role && user.role !== role) {
    // Redirect based on role mismatch
    return <Navigate to={user.role === 'owner' ? '/owner' : '/vet'} replace />;
  }
  return children;
}

function App() {
  const theme = createTheme({
    palette: {
      primary: { main: '#00695c' },
      secondary: { main: '#ffb74d' },
      background: { default: '#f4f6f8', paper: '#ffffff' },
      text: { primary: '#263238', secondary: '#546e7a' }
    },
    typography: {
      fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif',
      h5: { fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 600 }
    }
  });
  return (
    <AuthProvider>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <NavWrapper />
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
      </ThemeProvider>
    </BrowserRouter>
    </AuthProvider>
  );
}

// Conditionally render Navbar based on current route
function NavWrapper() {
  const location = useLocation();
  const hidePaths = ['/login', '/register'];
  const hide = hidePaths.includes(location.pathname);
  if (hide) return null;
  return (
    <>
      <Navbar />
      {/* Spacer so content doesn't go under fixed navbar */}
      <div style={{ height: 80 }}></div>
    </>
  );
}

export default App;