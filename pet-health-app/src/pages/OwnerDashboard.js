import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Grid, Typography, Button, Paper, Accordion, 
  AccordionSummary, AccordionDetails, List, ListItem, ListItemIcon, 
  ListItemText, IconButton, ListItemButton, Tooltip, Avatar, Skeleton 
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardSidebar from '../components/DashboardSidebar';

// Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PetsIcon from '@mui/icons-material/Pets';
import HistoryIcon from '@mui/icons-material/History';
import SearchIcon from '@mui/icons-material/Search';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

// Import PageHeader
import PageHeader from './PageHeader'; 
import Footer from '../components/Footer';
import RoleHelpHint from '../components/RoleHelpHint';

// --- THEME ---
const theme = createTheme({
  palette: {
    primary: { main: '#00695c' },
    secondary: { main: '#ffb74d' },
    background: { default: '#f8f9fa' }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 16 }
});

// --- DATA ---
const OWNER_INFO = [
  {
    id: 'pets',
    title: 'Τα Κατοικίδιά μου',
    icon: <PetsIcon color="primary" />,
    path: '/owner/pets',
    items: [
      { text: 'Προβολή/Επεξεργασία προφίλ', path: '/owner/pets' },
      { text: 'Ηλεκτρονικό Βιβλιάριο', path: '/owner/pets' },
      { text: 'Δήλωση απώλειας', path: '/lost-pets?view=form' }
    ]
  },
  {
    id: 'history',
    title: 'Ιστορικό & Ραντεβού',
    icon: <HistoryIcon color="primary" />,
    path: '/owner/history',
    items: [
        { text: 'Ιστορικό ιατρικών πράξεων', path: '/owner/history' },
        { text: 'Προγραμματισμένα ραντεβού', path: '/owner/history' }
    ]
  },
  {
    id: 'vet',
    title: 'Κτηνίατροι & Υπηρεσίες',
    icon: <MedicalServicesIcon color="primary" />,
    path: '/owner/search',
    items: [
        { text: 'Αναζήτηση κτηνιάτρου', path: '/owner/search' },
        { text: 'Κλείσιμο ραντεβού', path: '/owner/book' }
    ]
  }
];

// (Navbar removed; global navbar from App.js is used)

// --- FOOTER ---

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      if (!user?.id) { 
        setLoading(false); 
        return; 
      }
      try {
        const res = await fetch(`http://localhost:3001/pets?ownerId=${user.id}`);
        const data = await res.json();
        setPets(data || []);
      } catch (e) {
        console.error('Error fetching pets:', e);
        setPets([]);
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated && user) {
      fetchPets();
    } else {
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
        {/* Global Navbar is rendered in App.js */}
        
        {/* PAGE HEADER */}
        <Container maxWidth="xl" sx={{ pt: 2 }}>
            <PageHeader />
          <RoleHelpHint role="owner" />
        </Container>

        {/* FULL WIDTH HERO */}
        <Box sx={{ 
          position: 'relative', 
          height: '400px', 
          width: '100%',
          bgcolor: '#1e293b',
          backgroundImage: 'url(https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80)',
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center'
        }}>
          <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.5)' }} />
          <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white' }}>
            <Typography variant="h2" fontWeight="800" sx={{ textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
              Καλωσήρθατε, Ιδιοκτήτη
            </Typography>
            <Typography variant="h6" sx={{ mt: 2, opacity: 0.95 }}>
              Διαχειριστείτε τα κατοικίδιά σας με ευκολία
            </Typography>
          </Box>
        </Box>

        {/* MAIN LAYOUT WITH SIDEBAR */}
        <Box sx={{ display: 'flex', flex: 1, maxWidth: '100vw', overflow: 'visible', p: 2, gap: 2 }}>
          {/* REUSABLE SIDEBAR (static in main dashboards) */}
          <DashboardSidebar static />

          {/* MAIN CONTENT AREA */}
          <Box sx={{ flex: 1, p: 4 }}>
            {/* QUICK ACTIONS */}
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 4, 
                fontWeight: 700, 
                color: '#1e293b',
                textAlign: 'center',
                letterSpacing: '-0.5px',
                maxWidth: '900px',
                mx: 'auto',
                ml: { md: '280px' }
              }}
            >
              Με μια Ματιά
            </Typography>
            <Grid container spacing={4} sx={{ mb: 4, justifyContent: 'center', maxWidth: '900px', mx: 'auto', ml: { md: '280px' } }}>
              {[
                { label: 'Τα Κατοικίδια', icon: <PetsIcon fontSize="large" />, color: '#1976d2', path: '/owner/pets' },
                { label: 'Ιστορικό', icon: <HistoryIcon fontSize="large" />, color: '#1976d2', path: '/owner/history' },
                { label: 'Εύρεση Ιατρού', icon: <SearchIcon fontSize="large" />, color: '#1976d2', path: '/owner/search' },
                { label: 'Δήλωση Απώλειας', icon: <NotificationsActiveIcon fontSize="large" />, color: '#1976d2', path: '/lost-pets?view=form' }
              ].map((action) => (
                <Grid item xs={12} sm={6} md={3} key={action.label}>
                  <Paper 
                    elevation={0}
                    onClick={() => navigate(action.path)} 
                    sx={{ 
                      p: 3, 
                      textAlign: 'center', 
                      borderRadius: 4, 
                      cursor: 'pointer',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', 
                      bgcolor: action.color, 
                      color: 'white',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': { 
                        transform: 'translateY(-8px) scale(1.02)', 
                        boxShadow: '0 12px 24px rgba(25,118,210,0.4)',
                        '& .icon-container': {
                          transform: 'rotate(360deg) scale(1.1)'
                        }
                      },
                      '&:active': {
                        transform: 'translateY(-4px) scale(0.98)'
                      }
                    }}
                  >
                    <Box 
                      className="icon-container"
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        width: 56, 
                        height: 56, 
                        borderRadius: '50%', 
                        display: 'flex',
                        transition: 'all 0.5s ease', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      mx: 'auto', 
                      mb: 2 
                    }}>
                      {action.icon}
                    </Box>
                    <Typography variant="h6" fontWeight="600">{action.label}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* INFO CARDS */}
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 4, 
                fontWeight: 700, 
                color: '#1e293b',
                textAlign: 'center',
                letterSpacing: '-0.5px',
                maxWidth: '900px',
                mx: 'auto',
                ml: { md: '280px' }
              }}
            >
              Τι Τρέχει Τώρα
            </Typography>
            <Grid container spacing={4} sx={{ justifyContent: 'center', maxWidth: '900px', mx: 'auto', ml: { md: '280px' } }}>
              <Grid item xs={12} sm={6}>
                <Paper 
                  elevation={0}
                  onClick={() => navigate('/owner/history')}
                  sx={{ 
                    p: 3, 
                    borderRadius: 4, 
                    bgcolor: '#f0f7ff',
                    border: '2px solid #1976d2',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': { 
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(25,118,210,0.3)',
                      bgcolor: '#e3f2fd'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ fontSize: '32px' }}>📘</Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2' }}>
                      Ιστορικό Επισκέψεων
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Δείτε όλες τις επισκέψεις και ιατρικές πράξεις
                  </Typography>
                  <Button 
                    variant="contained" 
                    size="small"
                    onClick={() => navigate('/owner/history')}
                    sx={{ 
                      borderRadius: 2,
                      bgcolor: '#1976d2',
                      textTransform: 'none',
                      fontSize: '14px',
                      fontWeight: 600,
                      '&:hover': { bgcolor: '#1565c0' }
                    }}
                  >
                    Μετάβαση →
                  </Button>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper 
                  elevation={0} 
                  onClick={() => navigate('/lost-pets')}
                  sx={{ 
                    p: 3, 
                    borderRadius: 4, 
                    bgcolor: '#f0fdf4',
                    border: '2px solid #1976d2',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': { 
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(25,118,210,0.3)',
                      bgcolor: '#e3f2fd',
                      borderColor: '#1976d2'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ fontSize: '32px' }}>🔎</Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2' }}>
                      Χαμένα Κατοικίδια
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Δημιουργήστε ή αναζητήστε αγγελίες απολεσθέντων ζώων
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={() => navigate('/lost-pets')}
                    sx={{ 
                      borderRadius: 2,
                      bgcolor: '#1976d2',
                      textTransform: 'none',
                      fontSize: '14px',
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor: '#1565c0'
                      }
                    }}
                  >
                    Μετάβαση →
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}