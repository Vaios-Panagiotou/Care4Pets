import React from 'react';
import { Box, Breadcrumbs, Link, Typography, IconButton, Tooltip, Button } from '@mui/material';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Εικονίδια
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import HomeIcon from '@mui/icons-material/Home';

// --- ΛΕΞΙΚΟ ΜΕΤΑΦΡΑΣΗΣ ---
// Εδώ ορίζουμε πώς θα φαίνεται κάθε κομμάτι του URL στα Ελληνικά
const routeNameMap = {
  'owner': 'Ιδιοκτήτης',
  'vet': 'Κτηνίατρος',
  'login': 'Σύνδεση',
  'register': 'Εγγραφή',
  'contact': 'Επικοινωνία',
  'lost-pets': 'Απολεσθέντα',
  'history': 'Ιστορικό',
  'pets': 'Τα Κατοικίδιά μου',
  'search': 'Αναζήτηση Κτηνιάτρου',
  'profile': 'Προφίλ',
  'patients': 'Ασθενείς',
  'schedule': 'Πρόγραμμα',
  'book': 'Ραντεβού',
  'dashboard': 'Πίνακας Ελέγχου',
  'news': 'Νέα',
  'health-book': 'Βιβλιάριο Υγείας',
  'clinic': 'Κλινική',
  'new-record': 'Νέα Καταχώρηση',
  'find-vet': 'Εύρεση Κτηνιάτρου',  'found-pets': 'Δήλωση Εύρεσης',};

export default function PageHeader() {
  // Αυτό το component δεν εμφανίζει περιεχόμενο — τα breadcrumbs χειρίζεται το πάνω Navbar.
  return null;
}