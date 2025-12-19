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
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchIcon from '@mui/icons-material/Search';
import PetsIcon from '@mui/icons-material/Pets';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // IMPORT

// Import PageHeader
import PageHeader from './PageHeader'; 
import Footer from '../components/Footer';

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

const Navbar = () => {
  const [anchorElGenika, setAnchorElGenika] = useState(null);
  const [anchorElVet, setAnchorElVet] = useState(null);
  const [anchorElOwner, setAnchorElOwner] = useState(null);
  const navigate = useNavigate();

  const handleOpenMenu = (event, setAnchor) => setAnchor(event.currentTarget);
  const handleCloseMenu = (setAnchor) => setAnchor(null);

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
            <IconButton onClick={() => navigate('/owner/search')} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}><SearchIcon /></IconButton>
            <IconButton 
              onClick={() => navigate('/vet/profile')}
              sx={{ color: 'primary.main', bgcolor: '#e0f2f1', '&:hover': { bgcolor: '#b2dfdb' } }}
            >
              <AccountCircleIcon fontSize="large" />
            </IconButton>
            <Button variant="outlined" color="primary" onClick={() => { localStorage.removeItem('user'); navigate('/login'); }} sx={{ ml: 1 }}>
              Αποσύνδεση
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

const VET_INFO = [
  {
    id: 'profile',
    title: 'Επαγγελματικό Προφίλ',
    icon: <AssignmentIndIcon color="primary" />,
    path: '/vet/profile',
    items: [{ text: 'Επεξεργασία στοιχείων', path: '/vet/profile' }, { text: 'Διαχείριση διαθεσιμότητας', path: '/vet/schedule' }]
  },
  {
    id: 'medical',
    title: 'Διαχείριση Ασθενών',
    icon: <MedicalInformationIcon color="primary" />,
    path: '/vet/patients',
    items: [{ text: 'Καταγραφή νέου ζώου', path: '/vet/patients' }, { text: 'Ιατρικές Πράξεις', path: '/vet/patients' }]
  },
  {
    id: 'schedule',
    title: 'Πρόγραμμα & Ραντεβού',
    icon: <EventAvailableIcon color="primary" />,
    path: '/vet/schedule',
    items: [{ text: 'Ημερήσιο πρόγραμμα', path: '/vet/schedule' }, { text: 'Ιστορικό επισκέψεων', path: '/vet/schedule' }]
  }
];

export default function VetDashboard() {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        
        {/* --- PAGE HEADER --- */}
        <Container maxWidth="xl">
            <PageHeader />
        </Container>

        {/* FULL WIDTH HERO */}
        <Box sx={{ 
          position: 'relative', 
          height: '400px', 
          width: '100%',
          bgcolor: '#263238',
          backgroundImage: 'url(https://images.unsplash.com/photo-1628009368231-760335298025?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80)',
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center'
        }}>
          <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.6)' }} />
          <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white' }}>
            <Typography variant="h2" fontWeight="800" sx={{ textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
              Καλωσήρθατε, Γιατρέ
            </Typography>
          </Box>
        </Box>

        {/* MAIN LAYOUT: SIDEBAR + CONTENT */}
        <Box sx={{ display: 'flex', flexGrow: 1, p: 2, gap: 2 }}>
          {/* REUSABLE SIDEBAR */}
          <DashboardSidebar />

          {/* MAIN CONTENT */}
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
                { label: 'Νέα Καταγραφή', icon: <VaccinesIcon fontSize="large" />, color: '#00897B', path: '/vet/new-record' },
                { label: 'Ραντεβού', icon: <EventAvailableIcon fontSize="large" />, color: '#00897B', path: '/vet/schedule' },
                { label: 'Το Ιατρείο', icon: <AssignmentIndIcon fontSize="large" />, color: '#00897B', path: '/vet/clinic' }
              ].map((action) => (
                <Grid item xs={12} sm={4} key={action.label}>
                  <Paper elevation={0} onClick={() => navigate(action.path)} sx={{ 
                      p: 3, textAlign: 'center', borderRadius: 4, cursor: 'pointer',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', bgcolor: action.color, color: 'white',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': { 
                        transform: 'translateY(-8px) scale(1.02)', 
                        boxShadow: '0 12px 24px rgba(0,137,123,0.4)',
                        '& .icon-container': {
                          transform: 'rotate(360deg) scale(1.1)'
                        }
                      },
                      '&:active': {
                        transform: 'translateY(-4px) scale(0.98)'
                      }
                    }}>
                    <Box 
                      className="icon-container"
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 60, height: 60, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, transition: 'all 0.5s ease' }}>
                      {action.icon}
                    </Box>
                    <Typography variant="h6" fontWeight="bold">{action.label}</Typography>
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
              Δραστηριότητα Ιατρείου
            </Typography>
            <Grid container spacing={4} sx={{ justifyContent: 'center', maxWidth: '900px', mx: 'auto' }}>
              <Grid item xs={12} sm={6}>
                <Paper 
                  elevation={0} 
                  onClick={() => navigate('/vet/schedule')}
                  sx={{ 
                    p: 3, 
                    borderRadius: 4, 
                    bgcolor: '#f0f9f8',
                    border: '2px solid #00897B',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': { 
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,137,123,0.3)',
                      bgcolor: '#e0f2f1'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ fontSize: '32px' }}>📅</Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#00897B' }}>
                      Σημερινά Ραντεβού
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Δείτε τα προγραμματισμένα ραντεβού σας για σήμερα
                  </Typography>
                  <Button 
                    variant="contained" 
                    size="small" 
                    onClick={() => navigate('/vet/schedule')}
                    sx={{ 
                      borderRadius: 2,
                      bgcolor: '#00897B',
                      textTransform: 'none',
                      fontSize: '14px',
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor: '#00695c'
                      }
                    }}
                  >
                    Προβολή
                  </Button>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper 
                  elevation={0} 
                  onClick={() => navigate('/vet/clinic')}
                  sx={{ 
                    p: 3, 
                    borderRadius: 4, 
                    bgcolor: '#f0f9f8',
                    border: '2px solid #00897B',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': { 
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,137,123,0.3)',
                      bgcolor: '#e0f2f1'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ fontSize: '32px' }}>🏥</Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#00897B' }}>
                      Το Ιατρείο μου
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Διαχείριση πληροφοριών ιατρείου
                  </Typography>
                  <Button 
                    variant="contained" 
                    size="small" 
                    onClick={() => navigate('/vet/clinic')}
                    sx={{ 
                      borderRadius: 2,
                      bgcolor: '#00897B',
                      textTransform: 'none',
                      fontSize: '14px',
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor: '#00695c'
                      }
                    }}
                  >
                    Προβολή
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