import React from 'react';
import { Box, Breadcrumbs, Link, Typography, IconButton, Tooltip, Button } from '@mui/material';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Icons
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
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
  'new-record': 'Νέα Καταχώρηση'
};

export default function PageHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Σπάμε το URL σε κομμάτια (π.χ. /owner/history -> ['owner', 'history'])
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Αν είμαστε στην Αρχική, δεν δείχνουμε τίποτα
  if (pathnames.length === 0) return null;

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1.5, 
      py: 1.5, 
      px: { xs: 2, md: 0 },
      maxWidth: 'xl', 
      mx: 'auto',
      mb: 2
    }}>
      
      {/* 1. ΚΟΥΜΠΙ ΠΙΣΩ (MINIMAL) */}
      <Tooltip title="Επιστροφή">
        <IconButton 
          onClick={() => navigate(-1)} 
          size="small"
          sx={{ 
            color: '#64748b',
            '&:hover': { color: '#1976d2' }
          }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>

      {/* 2. BREADCRUMBS */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" sx={{ color: '#cbd5e1' }} />} 
        aria-label="breadcrumb"
        sx={{ 
            '& .MuiBreadcrumbs-li': { fontWeight: 400, fontSize: '0.875rem' }
        }}
      >
        {/* Link για την Αρχική */}
        <Link 
            component={RouterLink} 
            to="/" 
            underline="hover" 
            sx={{ display: 'flex', alignItems: 'center', color: '#64748b', '&:hover': { color: '#1976d2' } }}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} /> Αρχική
        </Link>

        {/* Δυναμικά Links για τα υπόλοιπα */}
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          
          // Μετάφραση ή χρήση του αγγλικού αν δεν υπάρχει στο λεξικό
          const name = routeNameMap[value] || value;

          return last ? (
            <Typography key={to} sx={{ color: '#1e293b', fontWeight: 500 }}>
              {name}
            </Typography>
          ) : (
            <Link component={RouterLink} to={to} underline="hover" key={to} sx={{ color: '#64748b', '&:hover': { color: '#1976d2' } }}>
              {name}
            </Link>
          );
        })}
      </Breadcrumbs>

      {/* 3. Logout button when authenticated */}
      {user && (
        <Button
          variant="text"
          size="small"
          onClick={() => { logout(); navigate('/login'); }}
          sx={{ ml: 'auto', color: '#64748b', '&:hover': { color: '#ef4444', bgcolor: 'transparent' } }}
        >
          Αποσύνδεση
        </Button>
      )}

    </Box>
  );
}