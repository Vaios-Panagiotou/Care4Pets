import React, { useState } from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Box, Container, Grid, 
  Paper, Card, CardContent, IconButton, Menu, MenuItem 
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'; // IMPORT useNavigate

// --- ICONS IMPORTS ---
import SearchIcon from '@mui/icons-material/Search';
import PetsIcon from '@mui/icons-material/Pets';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// IMPORT NEWS COMPONENT
import { NewsCard, NEWS_DATA } from './News';

// --- DATA CONFIGURATION ---
const STEPS = [
  { 
    id: '01', 
    title: 'Εγγραφή', 
    desc: 'Δημιουργήστε το προφίλ σας και καταχωρήστε τα στοιχεία του κατοικιδίου σας.', 
    icon: <PetsIcon fontSize="large" color="primary"/> 
  },
  { 
    id: '02', 
    title: 'Σύνδεση', 
    desc: 'Συνδεθείτε με τον κτηνίατρό σας και ενημερώστε το ηλεκτρονικό βιβλιάριο.', 
    icon: <MedicalServicesIcon fontSize="large" color="primary"/> 
  },
  { 
    id: '03', 
    title: 'Ασφάλεια', 
    desc: 'Σε περίπτωση απώλειας, ειδοποιήστε άμεσα την κοινότητα.', 
    icon: <SearchIcon fontSize="large" color="primary"/> 
  }
];

// --- THEME SETUP ---
const theme = createTheme({
  palette: {
    primary: { main: '#00695c' },
    secondary: { main: '#ffb74d' },
    background: { default: '#f4f6f8', paper: '#ffffff' },
    text: { primary: '#263238', secondary: '#546e7a' }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: '8px' } } },
    MuiMenu: { styleOverrides: { paper: { borderRadius: '12px', marginTop: '8px', boxShadow: '0px 4px 20px rgba(0,0,0,0.1)' } } }
  },
});

// --- SUB-COMPONENTS ---

const Navbar = () => {
  const [anchorElGenika, setAnchorElGenika] = useState(null);
  const [anchorElVet, setAnchorElVet] = useState(null);
  const [anchorElOwner, setAnchorElOwner] = useState(null);
  const navigate = useNavigate(); // Hook inside component

  const handleOpenMenu = (event, setAnchor) => setAnchor(event.currentTarget);
  const handleCloseMenu = (setAnchor) => setAnchor(null);

  const navButtonStyle = { fontSize: '16px', color: '#546e7a', '&:hover': { color: '#00695c', backgroundColor: 'transparent' } };

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'white', borderBottom: '1px solid #e0e0e0' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: 80 }}>
          
          {/* Logo Area */}
          <Box component="a" href="/" sx={{ display: 'flex', alignItems: 'center', flexGrow: 0, mr: 4, textDecoration: 'none', cursor: 'pointer' }}>
            <Box sx={{ bgcolor: 'primary.main', borderRadius: '12px', p: 1, mr: 1.5, display: 'flex' }}>
              <PetsIcon sx={{ color: 'white', fontSize: 30 }} />
            </Box>
            <Typography variant="h5" color="primary">Care4Pets</Typography>
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            
            {/* 1. Γενικά Dropdown */}
            <Box>
              <Button endIcon={<KeyboardArrowDownIcon />} onClick={(e) => handleOpenMenu(e, setAnchorElGenika)} sx={navButtonStyle}>Γενικά</Button>
              <Menu anchorEl={anchorElGenika} open={Boolean(anchorElGenika)} onClose={() => handleCloseMenu(setAnchorElGenika)}>
                <MenuItem onClick={() => { handleCloseMenu(setAnchorElGenika); navigate('/lost-pets'); }}>Αναζήτηση χαμένου κατοικιδίου</MenuItem>
                <MenuItem onClick={() => { handleCloseMenu(setAnchorElGenika); navigate('/news'); }}>Νέα και Ενημέρωση</MenuItem>
                <MenuItem onClick={() => { handleCloseMenu(setAnchorElGenika); navigate('/lost-pets'); }}>Δήλωση εύρεσης κατοικιδίου</MenuItem>
              </Menu>
            </Box>

            {/* 2. Κτηνίατροι Dropdown */}
            <Box>
              <Button endIcon={<KeyboardArrowDownIcon />} onClick={(e) => handleOpenMenu(e, setAnchorElVet)} sx={navButtonStyle}>Κτηνίατροι</Button>
              <Menu anchorEl={anchorElVet} open={Boolean(anchorElVet)} onClose={() => handleCloseMenu(setAnchorElVet)}>
                <MenuItem onClick={() => { handleCloseMenu(setAnchorElVet); navigate('/vet'); }}>Σχετικά με Κτηνίατρο</MenuItem>
              </Menu>
            </Box>

            {/* 3. Ιδιοκτήτες Dropdown */}
            <Box>
              <Button endIcon={<KeyboardArrowDownIcon />} onClick={(e) => handleOpenMenu(e, setAnchorElOwner)} sx={navButtonStyle}>Ιδιοκτήτες</Button>
              <Menu anchorEl={anchorElOwner} open={Boolean(anchorElOwner)} onClose={() => handleCloseMenu(setAnchorElOwner)}>
                <MenuItem onClick={() => { handleCloseMenu(setAnchorElOwner); navigate('/owner/pets'); }}>Το Κατοικίδιό μου</MenuItem>
                <MenuItem onClick={() => { handleCloseMenu(setAnchorElOwner); navigate('/owner/history'); }}>Ιστορικό</MenuItem>
                <MenuItem onClick={() => { handleCloseMenu(setAnchorElOwner); navigate('/owner/search'); }}>Ραντεβού με Κτηνίατρο</MenuItem>
              </Menu>
            </Box>

            <Button onClick={() => navigate('/contact')} sx={navButtonStyle}>Επικοινωνία</Button>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton sx={{ color: 'text.secondary' }}><SearchIcon /></IconButton>
            <Button variant="outlined" color="primary" onClick={() => navigate('/register')} sx={{ borderRadius: '20px', px: 3 }}>Εγγραφή</Button>
            <Button variant="contained" color="secondary" onClick={() => navigate('/login')} sx={{ borderRadius: '20px', px: 3, color: 'black' }}>Σύνδεση</Button>
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
};

const HeroSection = () => (
  <Box sx={{ position: 'relative', height: '650px', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
    <Box sx={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1,
        backgroundImage: 'url(https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80)',
        backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.7)'
      }}
    />
    
    <Container sx={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white' }}>
      <Typography variant="h3" sx={{ mb: 2, textShadow: '0px 4px 20px rgba(0,0,0,0.5)' }}>
        Φροντίδα που αξίζει στον καλύτερό σας φίλο.
      </Typography>
      <Typography variant="h6" sx={{ mb: 6, opacity: 0.9, fontWeight: 400, maxWidth: '700px', mx: 'auto' }}>
        Η πιο σύγχρονη πλατφόρμα διαχείρισης υγείας κατοικιδίων στην Ελλάδα.
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={5}>
          <Paper component="a" href="/login" elevation={6} sx={{
              p: 3, display: 'flex', alignItems: 'center', cursor: 'pointer', textDecoration: 'none',
              borderRadius: '16px', transition: 'transform 0.3s ease', 
              '&:hover': { transform: 'translateY(-5px)', bgcolor: 'secondary.light' }
            }}>
            <Box sx={{ bgcolor: 'secondary.main', p: 2, borderRadius: '50%', mr: 3 }}>
              <PetsIcon sx={{ fontSize: 32, color: 'black' }} />
            </Box>
            <Box>
              <Typography variant="h6" color="text.primary" fontWeight="bold">Είμαι Ιδιοκτήτης</Typography>
              <Typography variant="body2" color="text.secondary">Βιβλιάριο, Ραντεβού, Απώλειες</Typography>
            </Box>
            <ArrowForwardIcon sx={{ ml: 'auto', color: 'text.secondary' }} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper component="a" href="/login" elevation={6} sx={{
              p: 3, display: 'flex', alignItems: 'center', cursor: 'pointer', textDecoration: 'none',
              borderRadius: '16px', transition: 'transform 0.3s ease', 
              '&:hover': { transform: 'translateY(-5px)', bgcolor: '#e0f2f1' }
            }}>
            <Box sx={{ bgcolor: 'primary.main', p: 2, borderRadius: '50%', mr: 3 }}>
              <MedicalServicesIcon sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h6" color="text.primary" fontWeight="bold">Είμαι Κτηνίατρος</Typography>
              <Typography variant="body2" color="text.secondary">Διαχείριση Ιατρείου & Πελατών</Typography>
            </Box>
            <ArrowForwardIcon sx={{ ml: 'auto', color: 'text.secondary' }} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

const LostPetBanner = () => (
  <Box sx={{ bgcolor: '#263238', py: 4, color: 'white' }}>
    <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
      <Box>
        <Typography variant="h5" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SearchIcon sx={{ color: 'secondary.main' }} /> Χάσατε το κατοικίδιό σας;
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          Δηλώστε το τώρα στην πανελλαδική βάση δεδομένων μας.
        </Typography>
      </Box>
      <Button variant="contained" color="secondary" size="large" href="/lost-pets" sx={{ color: 'black', fontWeight: 'bold' }}>
        Δήλωση / Αναζήτηση
      </Button>
    </Container>
  </Box>
);

const StepsSection = () => (
  <Box sx={{ py: 10, bgcolor: 'background.default' }}>
    <Container>
      <Typography variant="h4" align="center" gutterBottom fontWeight="bold" color="primary">
        Πώς λειτουργεί;
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 8 }}>
        Τρία απλά βήματα για την ασφάλεια του φίλου σας
      </Typography>

      <Grid container spacing={4} alignItems="stretch" justifyContent="center">
        {STEPS.map((step) => (
          <Grid item xs={12} md={4} key={step.id} sx={{ display: 'flex' }}>
            <Card sx={{ 
              width: '100%', borderRadius: '16px', textAlign: 'center', p: 3, pt: 5, 
              position: 'relative', overflow: 'visible', mt: { xs: 4, md: 0 },
              boxShadow: 3, transition: 'box-shadow 0.3s ease', '&:hover': { boxShadow: 6 }
            }}>
              <Box sx={{ 
                position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)',
                bgcolor: 'white', border: '4px solid #f4f6f8', borderRadius: '50%', 
                p: 2, boxShadow: 2, width: 70, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {step.icon}
              </Box>
              <CardContent sx={{ mt: 2 }}>
                <Typography variant="h2" color="rgba(0,0,0,0.05)" fontWeight="900" sx={{ position: 'absolute', top: 10, right: 20 }}>
                  {step.id}
                </Typography>
                <Typography variant="h6" fontWeight="bold" gutterBottom>{step.title}</Typography>
                <Typography color="text.secondary">{step.desc}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

// New Section for News (Moved inside a component to use navigate)
const NewsSection = () => {
    const navigate = useNavigate();
    return (
        <Container maxWidth="lg" sx={{ py: 10 }}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>Νέα & Ενημερώσεις</Typography>
                <Typography variant="body1" color="text.secondary">
                Μείνετε ενημερωμένοι για την υγεία και τη φροντίδα των αγαπημένων σας φίλων.
                </Typography>
                <Box sx={{ width: 80, height: 4, bgcolor: '#00695c', mx: 'auto', mt: 2, borderRadius: 2 }} />
            </Box>

            <Grid container spacing={4}>
                {NEWS_DATA.slice(0, 3).map((item) => (
                <Grid item xs={12} md={4} key={item.id}>
                    <NewsCard item={item} />
                </Grid>
                ))}
            </Grid>

            <Box sx={{ textAlign: 'center', mt: 6 }}>
                <Button 
                variant="outlined" 
                size="large" 
                onClick={() => navigate('/news')}
                sx={{ 
                    border: '2px solid #00695c', color: '#00695c', fontWeight: 'bold', px: 5, py: 1.5,
                    '&:hover': { bgcolor: '#00695c', color: 'white' }
                }}
                >
                Προβολή Όλων των Νέων
                </Button>
            </Box>
        </Container>
    );
};

const Footer = () => (
  <Box sx={{ bgcolor: '#1a2327', color: '#b0bec5', py: 8 }}>
    <Container>
      <Grid container spacing={5}>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PetsIcon sx={{ color: 'secondary.main', mr: 1 }} />
            <Typography variant="h6" color="white">Care4Pets</Typography>
          </Box>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Η νούμερο 1 πλατφόρμα στην Ελλάδα για την υγεία και την ασφάλεια των κατοικιδίων.
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" color="white" gutterBottom>Επικοινωνία</Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}><PhoneIcon fontSize="small" /> 210-1234567</Box>
          <Box sx={{ display: 'flex', gap: 1 }}><EmailIcon fontSize="small" /> support@care4pets.gr</Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" color="white" gutterBottom>Social Media</Typography>
          <Box sx={{ '& > svg': { mr: 2, cursor: 'pointer', transition: 'color 0.2s', '&:hover': { color: 'white' } } }}>
            <FacebookIcon /><InstagramIcon /><TwitterIcon /><YouTubeIcon />
          </Box>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

// --- MAIN COMPONENT ---
export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <HeroSection />
        <LostPetBanner />
        <StepsSection />
        <NewsSection /> {/* Added the News Section here */}
        <Footer />
      </Box>
    </ThemeProvider>
  );
}