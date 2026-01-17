import React from 'react';
import { Box, Breadcrumbs, Link, Typography, IconButton, Tooltip, Button } from '@mui/material';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Icons
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
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Σπάμε το URL σε κομμάτια (π.χ. /owner/history -> ['owner', 'history'])
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Αν είμαστε στην Αρχική, δεν δείχνουμε τίποτα
  if (pathnames.length === 0) return null;

  // Σελίδες όπου δεν πρέπει να εμφανίζεται το κουμπί αποσύνδεσης (δημόσιες σελίδες)
  const publicPages = ['/login', '/register', '/contact', '/lost-pets', '/news'];
  const isPublicPage = publicPages.some(page => location.pathname.startsWith(page));

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1, 
      py: 1, 
      px: { xs: 2, md: 3 },
      maxWidth: 'xl', 
      mx: 'auto',
      mb: 1.5,
      bgcolor: 'rgba(255,255,255,0.92)', // ensure contrast on any background
      border: '1px solid #e2e8f0',
      boxShadow: '0 8px 24px rgba(15,23,42,0.08)',
      backdropFilter: 'blur(8px)',
      borderRadius: 2
    }}>
      
      {/* 1. ΚΟΥΜΠΙ ΠΙΣΩ (MINIMAL) */}
      <Tooltip title="Επιστροφή">
        <IconButton 
          onClick={() => navigate(-1)} 
          size="small"
          sx={{ 
            color: '#94a3b8',
            '&:hover': { 
              color: '#1976d2',
              bgcolor: 'rgba(25, 118, 210, 0.05)'
            },
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>

      {/* 2. BREADCRUMBS - DISCRETE & ELEGANT */}
      <Breadcrumbs 
        separator={<Typography sx={{ color: '#475569', mx: '2px', fontSize: '0.75rem' }}>•</Typography>} 
        aria-label="breadcrumb"
        sx={{ 
          '& .MuiBreadcrumbs-li': { 
            fontWeight: 400, 
            fontSize: '0.8rem',
            '&:last-child': { 
              fontWeight: 600 
            }
          },
          '& .MuiBreadcrumbs-separator': {
            mx: 0.5
          }
        }}
      >
        {/* Link για την Αρχική */}
        <Link 
            component={RouterLink} 
            to="/" 
            underline="none" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              color: '#0f172a',
              fontWeight: 600,
              transition: 'all 0.2s ease',
              '&:hover': { 
                color: '#1d4ed8'
              }
            }}
        >
          <HomeIcon sx={{ mr: 0.3, fontSize: 16 }} /> Αρχική
        </Link>

        {/* Δυναμικά Links για τα υπόλοιπα */}
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          
          // Μετάφραση ή χρήση του αγγλικού αν δεν υπάρχει στο λεξικό
          const name = routeNameMap[value] || value;
          
          // Role indicators should link to their dashboards
          const isRoleIndicator = value === 'owner' || value === 'vet';
          const roleLink = value === 'owner' ? '/owner' : value === 'vet' ? '/vet' : null;

          return last ? (
            <Typography 
              key={to} 
              sx={{ 
                color: '#0f172a', 
                fontWeight: 600,
                fontSize: '0.8rem'
              }}
            >
              {name}
            </Typography>
          ) : isRoleIndicator && roleLink ? (
            <Link 
              component={RouterLink} 
              to={roleLink} 
              underline="none" 
              key={to} 
              sx={{ 
                color: '#0f172a',
                fontWeight: 600,
                fontSize: '0.8rem',
                transition: 'all 0.2s ease',
                '&:hover': { 
                  color: '#1d4ed8'
                }
              }}
            >
              {name}
            </Link>
          ) : (
            <Link 
              component={RouterLink} 
              to={to} 
              underline="none" 
              key={to} 
              sx={{ 
                color: '#0f172a',
                fontWeight: 600,
                transition: 'all 0.2s ease',
                '&:hover': { 
                  color: '#1d4ed8'
                }
              }}
            >
              {name}
            </Link>
          );
        })}
      </Breadcrumbs>

      {/* 3. Logout button when authenticated AND not on public pages */}
      {user && !isPublicPage && (
        <Button
          variant="text"
          size="small"
          onClick={() => { logout(); navigate('/login'); }}
          sx={{ 
            ml: 'auto', 
            color: '#64748b', 
            fontSize: '0.8rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { 
              color: '#ef4444',
              bgcolor: 'rgba(239, 68, 68, 0.05)'
            },
            transition: 'all 0.2s ease'
          }}
        >
          Αποσύνδεση
        </Button>
      )}

    </Box>
  );
}