import React from 'react';
import { Box, Breadcrumbs, Link, Typography, IconButton, Tooltip } from '@mui/material';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';

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
  'search': 'Αναζήτηση',
  'profile': 'Προφίλ',
  'patients': 'Ασθενείς',
  'schedule': 'Πρόγραμμα',
  'book': 'Ραντεβού'
};

export default function PageHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Σπάμε το URL σε κομμάτια (π.χ. /owner/history -> ['owner', 'history'])
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Αν είμαστε στην Αρχική, δεν δείχνουμε τίποτα
  if (pathnames.length === 0) return null;

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 2, 
      py: 2, 
      px: { xs: 2, md: 0 }, // Padding στα κινητά
      maxWidth: 'lg', 
      mx: 'auto',
      mb: 2
    }}>
      
      {/* 1. ΚΟΥΜΠΙ ΠΙΣΩ (MINIMAL) */}
      <Tooltip title="Επιστροφή">
        <IconButton 
          onClick={() => navigate(-1)} 
          sx={{ 
            bgcolor: 'white', 
            border: '1px solid #eee', 
            borderRadius: '12px',
            width: 40, height: 40,
            color: '#555',
            transition: '0.3s',
            '&:hover': { bgcolor: '#f5f5f5', transform: 'translateX(-3px)' }
          }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Tooltip>

      {/* 2. BREADCRUMBS */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" sx={{ color: '#999' }} />} 
        aria-label="breadcrumb"
        sx={{ 
            '& .MuiBreadcrumbs-li': { fontWeight: 500, fontSize: '0.95rem' }
        }}
      >
        {/* Link για την Αρχική */}
        <Link 
            component={RouterLink} 
            to="/" 
            underline="hover" 
            sx={{ display: 'flex', alignItems: 'center', color: '#777' }}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} /> Αρχική
        </Link>

        {/* Δυναμικά Links για τα υπόλοιπα */}
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          
          // Μετάφραση ή χρήση του αγγλικού αν δεν υπάρχει στο λεξικό
          const name = routeNameMap[value] || value;

          return last ? (
            <Typography key={to} color="primary" fontWeight="bold">
              {name}
            </Typography>
          ) : (
            <Link component={RouterLink} to={to} underline="hover" key={to} color="inherit">
              {name}
            </Link>
          );
        })}
      </Breadcrumbs>

    </Box>
  );
}