import React, { useState } from 'react';
import { 
  Box, Container, Grid, Typography, Button, Paper, Accordion, 
  AccordionSummary, AccordionDetails, List, ListItem, ListItemIcon, 
  ListItemText, AppBar, Toolbar, IconButton, Menu, MenuItem, ListItemButton, Tooltip 
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';

// Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PetsIcon from '@mui/icons-material/Pets';
import HistoryIcon from '@mui/icons-material/History';
import SearchIcon from '@mui/icons-material/Search';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // <--- ΝΕΟ IMPORT

// Import PageHeader
import PageHeader from './PageHeader'; 
import Footer from '../components/Footer';

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
      { text: 'Δήλωση απώλειας', path: '/lost-pets' }
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

// --- NAVBAR ---
const Navbar = () => {
  const [anchorElGenika, setAnchorElGenika] = useState(null);
  const [anchorElVet, setAnchorElVet] = useState(null);
  const [anchorElOwner, setAnchorElOwner] = useState(null);

  const handleOpenMenu = (event, setAnchor) => setAnchor(event.currentTarget);
  const handleCloseMenu = (setAnchor) => setAnchor(null);
  const navigate = useNavigate();

  const navButtonStyle = { fontSize: '16px', color: '#546e7a', '&:hover': { color: '#00695c', backgroundColor: 'transparent' } };

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'white', borderBottom: '1px solid #e0e0e0' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: 80 }}>
          <Box component="a" href="/" sx={{ display: 'flex', alignItems: 'center', flexGrow: 0, mr: 4, textDecoration: 'none', cursor: 'pointer' }}>
            <Box sx={{ bgcolor: 'primary.main', borderRadius: '12px', p: 1, mr: 1.5, display: 'flex' }}>
              <PetsIcon sx={{ color: 'white', fontSize: 30 }} />
            </Box>
            <Typography variant="h5" color="primary">Care4Pets</Typography>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            <Box>
                <Button endIcon={<KeyboardArrowDownIcon />} onClick={(e) => handleOpenMenu(e, setAnchorElGenika)} sx={navButtonStyle}>Γενικά</Button>
                <Menu anchorEl={anchorElGenika} open={Boolean(anchorElGenika)} onClose={() => handleCloseMenu(setAnchorElGenika)}>
                    <MenuItem onClick={() => { handleCloseMenu(setAnchorElGenika); navigate('/lost-pets'); }}>Αναζήτηση</MenuItem>
                </Menu>
            </Box>
            <Box>
                <Button endIcon={<KeyboardArrowDownIcon />} onClick={(e) => handleOpenMenu(e, setAnchorElVet)} sx={navButtonStyle}>Κτηνίατροι</Button>
                <Menu anchorEl={anchorElVet} open={Boolean(anchorElVet)} onClose={() => handleCloseMenu(setAnchorElVet)}>
                    <MenuItem onClick={() => { handleCloseMenu(setAnchorElVet); navigate('/vet'); }}>Υπηρεσίες</MenuItem>
                </Menu>
            </Box>
            <Box>
                <Button endIcon={<KeyboardArrowDownIcon />} onClick={(e) => handleOpenMenu(e, setAnchorElOwner)} sx={navButtonStyle}>Ιδιοκτήτες</Button>
                <Menu anchorEl={anchorElOwner} open={Boolean(anchorElOwner)} onClose={() => handleCloseMenu(setAnchorElOwner)}>
                    <MenuItem onClick={() => { handleCloseMenu(setAnchorElOwner); navigate('/owner'); }}>Dashboard</MenuItem>
                </Menu>
            </Box>
            <Button onClick={() => navigate('/contact')} sx={navButtonStyle}>Επικοινωνία</Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {/* Search Icon */}
            <IconButton onClick={() => navigate('/owner/search')} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}><SearchIcon /></IconButton>
            
            {/* --- ΝΕΟ ΚΟΥΜΠΙ ΠΡΟΦΙΛ --- */}
            <IconButton 
                onClick={() => navigate('/owner/profile')}
                sx={{ color: 'primary.main', bgcolor: '#e0f2f1', '&:hover': { bgcolor: '#b2dfdb' } }}
            >
                <AccountCircleIcon fontSize="large" />
            </IconButton>
            {/* ------------------------- */}

            <Button variant="outlined" color="primary" onClick={() => { localStorage.removeItem('user'); navigate('/login'); }} sx={{ ml: 1 }}>
                Αποσύνδεση
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

// --- FOOTER ---

export default function OwnerDashboard() {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        
        {/* PAGE HEADER */}
        <Container maxWidth="xl" sx={{ pt: 2 }}>
            <PageHeader />
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
        <Box sx={{ display: 'flex', flex: 1, maxWidth: '100vw', overflow: 'hidden', p: 2, gap: 2 }}>
          {/* REUSABLE SIDEBAR */}
          <DashboardSidebar />

          {/* MAIN CONTENT AREA */}
          <Box sx={{ flex: 1, p: 4, overflowY: 'auto' }}>
            {/* QUICK ACTIONS */}
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 4, 
                fontWeight: 700, 
                color: '#1e293b',
                textAlign: 'center',
                letterSpacing: '-0.5px'
              }}
            >
              Γρήγορες Ενέργειες
            </Typography>
            <Grid container spacing={4} sx={{ mb: 4, justifyContent: 'center', maxWidth: '900px', mx: 'auto' }}>
              {[
                { label: 'Τα Κατοικίδια', icon: <PetsIcon fontSize="large" />, color: '#1976d2', path: '/owner/pets' },
                { label: 'Ιστορικό', icon: <HistoryIcon fontSize="large" />, color: '#1976d2', path: '/owner/history' },
                { label: 'Εύρεση Ιατρού', icon: <SearchIcon fontSize="large" />, color: '#1976d2', path: '/owner/search' }
              ].map((action) => (
                <Grid item xs={12} sm={4} key={action.label}>
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
                letterSpacing: '-0.5px'
              }}
            >
              Πρόσφατη Δραστηριότητα
            </Typography>
            <Grid container spacing={4} sx={{ justifyContent: 'center', maxWidth: '900px', mx: 'auto' }}>
              <Grid item xs={12} sm={6}>
                <Paper 
                  elevation={0} 
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
                    <Box sx={{ fontSize: '32px' }}>📅</Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2' }}>
                      Επόμενα Ραντεβού
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Δεν υπάρχουν προγραμματισμένα ραντεβού
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper 
                  elevation={0} 
                  onClick={() => navigate('/owner/pets')}
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
                    <Box sx={{ fontSize: '32px' }}>🐾</Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2' }}>
                      Τα Κατοικίδιά μου
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Προβολή όλων των κατοικιδίων σας
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={() => navigate('/owner/pets')}
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

        <Footer />
      </Box>
    </ThemeProvider>
  );
}