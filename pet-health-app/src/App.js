import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register"; // Νέα σελίδα
import LostPets from "./pages/lostpets";
import Contact from "./pages/contact";
import OwnerDashboard from "./pages/OwnerDashboard";
import VetDashboard from "./pages/VetDashboard";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* Νέο Route */}
        <Route path="/lost-pets" element={<LostPets />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/vet" element={<VetDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;