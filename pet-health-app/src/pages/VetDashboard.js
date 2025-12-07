import React, { useState } from 'react';
import { 
  Box, Container, Grid, Typography, Button, Paper, Accordion, 
  AccordionSummary, AccordionDetails, List, ListItem, ListItemIcon, 
  ListItemText, AppBar, Toolbar, IconButton, Menu, MenuItem 
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

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

// --- NAVBAR COMPONENT ---
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

// --- FOOTER COMPONENT ---
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

const VET_INFO = [
  {
    id: 'profile',
    title: 'Επαγγελματικό Προφίλ',
    icon: <AssignmentIndIcon color="primary" />,
    items: ['Επεξεργασία στοιχείων', 'Διαχείριση διαθεσιμότητας', 'Αξιολογήσεις', 'Πιστοποιητικά']
  },
  {
    id: 'medical',
    title: 'Διαχείριση Ασθενών',
    icon: <MedicalInformationIcon color="primary" />,
    items: ['Καταγραφή νέου ζώου', 'Ενημέρωση Βιβλιαρίου', 'Ιατρικές Πράξεις', 'Δήλωση συμβάντων']
  },
  {
    id: 'schedule',
    title: 'Πρόγραμμα & Ραντεβού',
    icon: <EventAvailableIcon color="primary" />,
    items: ['Ημερήσιο πρόγραμμα', 'Αιτήματα ραντεβού', 'Ιστορικό επισκέψεων', 'Ακυρώσεις']
  }
];

export default function VetDashboard() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        
        {/* HERO */}
        <Box sx={{ 
          position: 'relative', height: '300px', bgcolor: '#263238',
          backgroundImage: 'url(https://images.unsplash.com/photo-1628009368231-760335298025?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          borderBottomLeftRadius: '60px', borderBottomRightRadius: '60px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 5
        }}>
           <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.6)', borderRadius: '0 0 60px 60px' }} />
           <Container sx={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white' }}>
              <Typography variant="h3" fontWeight="800" sx={{ textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                Καλωσήρθατε, Γιατρέ
              </Typography>
           </Container>
        </Box>

        {/* QUICK ACTIONS */}
        <Container maxWidth="lg" sx={{ mt: -10, mb: 6, position: 'relative', zIndex: 2 }}>
          <Grid container spacing={3} justifyContent="center">
            {[
              { label: 'Νέα Καταγραφή', icon: <VaccinesIcon fontSize="large" />, color: '#00897B' },
              { label: 'Ραντεβού', icon: <EventAvailableIcon fontSize="large" />, color: '#00897B' },
              { label: 'Το Ιατρείο', icon: <AssignmentIndIcon fontSize="large" />, color: '#00897B' }
            ].map((action) => (
              <Grid item xs={12} sm={4} key={action.label}>
                <Paper elevation={6} sx={{ 
                    p: 3, textAlign: 'center', borderRadius: '20px', cursor: 'pointer',
                    transition: '0.3s', bgcolor: action.color, color: 'white',
                    '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 15px 30px rgba(0,137,123,0.4)' }
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

        {/* INFO */}
        <Container maxWidth="md" sx={{ mb: 10, flexGrow: 1 }}>
          <Typography variant="h5" align="center" fontWeight="bold" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
            Εργαλεία Διαχείρισης
          </Typography>
          {VET_INFO.map((section) => (
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
                      <ListItemIcon><ArrowForwardIcon fontSize="small" color="primary" /></ListItemIcon>
                      <ListItemText primary={item} primaryTypographyProps={{ fontSize: '15px', fontWeight: 500 }} />
                    </ListItem>
                  ))}
                </List>
                <Button variant="contained" size="small" sx={{ mt: 2, ml: 2, borderRadius: '20px', bgcolor: '#00897B' }}>Άνοιγμα</Button>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>

        <Footer />
      </Box>
    </ThemeProvider>
  );
}