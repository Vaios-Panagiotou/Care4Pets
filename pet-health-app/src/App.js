import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import RequireAuth from "./components/RequireAuth"; // Προστασία διαδρομών

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Δημόσιες Σελίδες */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/lost-pets" element={<LostPets />} />
        <Route path="/news" element={<News />} />

        {/* Σελίδες Συνδεδεμένων Χρηστών (Owner) */}
        <Route
          path="/owner"
          element={
            <RequireAuth>
              <OwnerDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/owner/pets"
          element={
            <RequireAuth>
              <MyPets />
            </RequireAuth>
          }
        />
        <Route
          path="/owner/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path="/owner/health-book/:id"
          element={
            <RequireAuth>
              <PetHealthBook />
            </RequireAuth>
          }
        />
        <Route
          path="/owner/search"
          element={
            <RequireAuth>
              <VetSearch />
            </RequireAuth>
          }
        />
        <Route
          path="/owner/history"
          element={
            <RequireAuth>
              <History />
            </RequireAuth>
          }
        />
        <Route
          path="/owner/book"
          element={
            <RequireAuth>
              <PlaceholderPage title="Κλείσιμο Ραντεβού" />
            </RequireAuth>
          }
        />

        {/* Σελίδες Κτηνιάτρων (Vet) */}
        <Route
          path="/vet"
          element={
            <RequireAuth>
              <VetDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/vet/new-record"
          element={
            <RequireAuth>
              <NewRecord />
            </RequireAuth>
          }
        />
        <Route
          path="/vet/schedule"
          element={
            <RequireAuth>
              <VetSchedule />
            </RequireAuth>
          }
        />
        <Route
          path="/vet/profile"
          element={
            <RequireAuth>
              <VetClinic />
            </RequireAuth>
          }
        />
        <Route
          path="/vet/patients"
          element={
            <RequireAuth>
              <PlaceholderPage title="Διαχείριση Ασθενών" />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;