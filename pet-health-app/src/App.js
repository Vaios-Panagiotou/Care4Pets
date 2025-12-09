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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Βασικές Σελίδες */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/lost-pets" element={<LostPets />} />
        <Route path="/owner/pets" element={<MyPets />} />
        <Route path="/owner/profile" element={<Profile />} />
        <Route path="/vet/profile" element={<Profile />} />
        <Route path="/owner/health-book/:id" element={<PetHealthBook />} />
        <Route path="/owner/search" element={<VetSearch />} />
        <Route path="/owner/history" element={<History />} />
        <Route path="/vet/new-record" element={<NewRecord />} />
        <Route path="/vet/schedule" element={<VetSchedule />} />
        <Route path="/vet/profile" element={<VetClinic />} /> {/* Το συνδέουμε εδώ */}
        <Route path="/news" element={<News />} />

        {/* Dashboards */}
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/vet" element={<VetDashboard />} />

        {/* Υπο-σελίδες Ιδιοκτήτη (Λειτουργούν με το Placeholder προς το παρόν) */}
        <Route path="/owner/pets" element={<PlaceholderPage title="Τα Κατοικίδιά μου" />} />
        <Route path="/owner/history" element={<PlaceholderPage title="Ιστορικό & Ραντεβού" />} />
        <Route path="/owner/search" element={<PlaceholderPage title="Εύρεση Κτηνίατρου" />} />
        <Route path="/owner/book" element={<PlaceholderPage title="Κλείσιμο Ραντεβού" />} />

        {/* Υπο-σελίδες Κτηνίατρου */}
        <Route path="/vet/patients" element={<PlaceholderPage title="Διαχείριση Ασθενών" />} />
        <Route path="/vet/schedule" element={<PlaceholderPage title="Πρόγραμμα & Ραντεβού" />} />
        <Route path="/vet/profile" element={<PlaceholderPage title="Επαγγελματικό Προφίλ" />} />
        

      </Routes>
    </BrowserRouter>
  );
}

export default App;