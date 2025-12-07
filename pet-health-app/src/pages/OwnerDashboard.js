import React, { useState } from 'react';
import { 
  Box, Container, Grid, Typography, Button, Paper, Accordion, 
  AccordionSummary, AccordionDetails, List, ListItem, ListItemIcon, 
  ListItemText, AppBar, Toolbar, IconButton, Menu, MenuItem 
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PetsIcon from '@mui/icons-material/Pets';
import HistoryIcon from '@mui/icons-material/History';
import SearchIcon from '@mui/icons-material/Search';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

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

// --- NAVBAR COMPONENT (Ενσωματωμένο) ---
const Navbar = () => {
  const [anchorElGenika, setAnchorElGenika] = useState(null);
  const [anchorElVet, setAnchorElVet] = useState(null);
  const [anchorElOwner, setAnchorElOwner] = useState(null);

  const handleOpenMenu = (event, setAnchor) => setAnchor(event.currentTarget);
  const handleCloseMenu = (setAnchor) => setAnchor(null);

  const navButtonStyle = {
    fontSize: '16px', color: '#546e7a', 
    '&:hover': { color: '#00695c', backgroundColor: 'transparent' }
  };

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
                <MenuItem onClick={() => handleCloseMenu(setAnchorElGenika)}>Αναζήτηση</MenuItem>
              </Menu>
            </Box>
            <Box>
              <Button endIcon={<KeyboardArrowDownIcon />} onClick={(e) => handleOpenMenu(e, setAnchorElVet)} sx={navButtonStyle}>Κτηνίατροι</Button>
              <Menu anchorEl={anchorElVet} open={Boolean(anchorElVet)} onClose={() => handleCloseMenu(setAnchorElVet)}>
                <MenuItem onClick={() => handleCloseMenu(setAnchorElVet)}>Υπηρεσίες</MenuItem>
              </Menu>
            </Box>
            <Box>
              <Button endIcon={<KeyboardArrowDownIcon />} onClick={(e) => handleOpenMenu(e, setAnchorElOwner)} sx={navButtonStyle}>Ιδιοκτήτες</Button>
              <Menu anchorEl={anchorElOwner} open={Boolean(anchorElOwner)} onClose={() => handleCloseMenu(setAnchorElOwner)}>
                <MenuItem onClick={() => handleCloseMenu(setAnchorElOwner)}>Dashboard</MenuItem>
              </Menu>
            </Box>
            <Button href="/contact" sx={navButtonStyle}>Επικοινωνία</Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton sx={{ color: 'text.secondary' }}><SearchIcon /></IconButton>
            <Button variant="outlined" color="primary" href="/login">Αποσύνδεση</Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

// --- FOOTER COMPONENT (Ενσωματωμένο) ---
const Footer = () => (
  <Box sx={{ bgcolor: '#1a2327', color: '#b0bec5', py: 8, mt: 'auto' }}>
    <Container>
      <Grid container spacing={5}>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PetsIcon sx={{ color: 'secondary.main', mr: 1 }} />
            <Typography variant="h6" color="white">Care4Pets</Typography>
          </Box>
          <Typography variant="body2">Η πλατφόρμα φροντίδας κατοικιδίων.</Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" color="white">Επικοινωνία</Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}><PhoneIcon fontSize="small"/> 210-1234567</Box>
          <Box sx={{ display: 'flex', gap: 1 }}><EmailIcon fontSize="small"/> support@care4pets.gr</Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" color="white">Social</Typography>
          <Box sx={{ '& > svg': { mr: 2, cursor: 'pointer', color: 'white' } }}>
            <FacebookIcon /><InstagramIcon /><TwitterIcon /><YouTubeIcon />
          </Box>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

// --- DATA ---
const OWNER_INFO = [
  {
    id: 'pets',
    title: 'Τα Κατοικίδιά μου',
    icon: <PetsIcon color="primary" />,
    items: ['Προβολή/Επεξεργασία προφίλ', 'Ηλεκτρονικό Βιβλιάριο', 'Δήλωση απώλειας', 'Εκτύπωση στοιχείων']
  },
  {
    id: 'history',
    title: 'Ιστορικό & Ραντεβού',
    icon: <HistoryIcon color="primary" />,
    items: ['Ιστορικό ιατρικών πράξεων', 'Προγραμματισμένα ραντεβού', 'Ιστορικό δηλώσεων', 'Ακύρωση ραντεβού']
  },
  {
    id: 'vet',
    title: 'Κτηνίατροι & Υπηρεσίες',
    icon: <MedicalServicesIcon color="primary" />,
    items: ['Αναζήτηση κτηνιάτρου', 'Προβολή προφίλ', 'Αξιολόγηση', 'Νέο ραντεβού']
  }
];

export default function OwnerDashboard() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        
        {/* HERO */}
        <Box sx={{ 
          position: 'relative', height: '300px', bgcolor: '#344055',
          backgroundImage: 'url(https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80)', 
          backgroundSize: 'cover', backgroundPosition: 'center',
          borderBottomLeftRadius: '60px', borderBottomRightRadius: '60px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 5
        }}>
           <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.5)', borderRadius: '0 0 60px 60px' }} />
           <Container sx={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white' }}>
              <Typography variant="h3" fontWeight="800" sx={{ textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                Καλωσήρθατε, Ιδιοκτήτη
              </Typography>
           </Container>
        </Box>

        {/* QUICK ACTIONS */}
        <Container maxWidth="lg" sx={{ mt: -10, mb: 6, position: 'relative', zIndex: 2 }}>
          <Grid container spacing={3} justifyContent="center">
            {[
              { label: 'Τα Κατοικίδια', icon: <PetsIcon fontSize="large" />, color: '#00ACC1' },
              { label: 'Ιστορικό', icon: <HistoryIcon fontSize="large" />, color: '#00ACC1' },
              { label: 'Εύρεση Ιατρού', icon: <SearchIcon fontSize="large" />, color: '#00ACC1' }
            ].map((action) => (
              <Grid item xs={12} sm={4} key={action.label}>
                <Paper elevation={6} sx={{ 
                    p: 3, textAlign: 'center', borderRadius: '20px', cursor: 'pointer',
                    transition: '0.3s', bgcolor: action.color, color: 'white',
                    '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 15px 30px rgba(0,172,193,0.4)' }
                  }}>
                  <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 60, height: 60, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                    {action.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold">{action.label}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* ACCORDIONS */}
        <Container maxWidth="md" sx={{ mb: 10, flexGrow: 1 }}>
          <Typography variant="h5" align="center" fontWeight="bold" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
            Υπηρεσίες & Πληροφορίες
          </Typography>
          {OWNER_INFO.map((section) => (
            <Accordion key={section.id} sx={{ mb: 2, borderRadius: '16px !important', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ bgcolor: '#e0f2f1', p: 1, borderRadius: '12px' }}>{section.icon}</Box>
                  <Typography variant="h6" fontWeight="600" color="text.primary">{section.title}</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: '#fafafa', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', p: 3 }}>
                <List dense>
                  {section.items.map((item, index) => (
                    <ListItem key={index}>
                      <ListItemIcon><ArrowForwardIcon fontSize="small" color="secondary" /></ListItemIcon>
                      <ListItemText primary={item} primaryTypographyProps={{ fontSize: '15px', fontWeight: 500 }} />
                    </ListItem>
                  ))}
                </List>
                <Button variant="outlined" size="small" sx={{ mt: 2, ml: 2, borderRadius: '20px' }}>Μετάβαση</Button>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>

        <Footer />
      </Box>
    </ThemeProvider>
  );
}