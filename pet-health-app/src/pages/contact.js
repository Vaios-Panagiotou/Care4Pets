import React, { useState } from 'react';
import { 
  Box, Container, Grid, Typography, TextField, Button, Checkbox, 
  FormControlLabel, Paper, Dialog, DialogContent, Divider 
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Icons
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// --- THEME ---
const theme = createTheme({
  palette: {
    primary: { main: '#7C4DFF' }, 
    secondary: { main: '#FF7043' },
    success: { main: '#00E676' },
    text: { primary: '#333', secondary: '#555' }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    button: { textTransform: 'none', fontWeight: 600 },
    h5: { fontWeight: 700 }
  },
  shape: {
    borderRadius: 16
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: { marginBottom: '20px' }
      }
    }
  }
});

// Helper Component για τα εικονίδια και τα κείμενα
const ContactItem = ({ icon, bg, color, title, content }) => (
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    {/* Κυκλικό Εικονίδιο */}
    <Box sx={{ 
      bgcolor: bg, color: color, 
      width: 40, height: 40, borderRadius: '50%', 
      display: 'flex', alignItems: 'center', justifyContent: 'center', 
      mr: 2, flexShrink: 0 
    }}>
      {icon}
    </Box>
    {/* Κείμενο */}
    <Box>
      <Typography variant="subtitle2" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
        {content}
      </Typography>
    </Box>
  </Box>
);

export default function Contact() {
  const [openSuccess, setOpenSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setOpenSuccess(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
        
        {/* HERO SECTION */}
        <Box sx={{ 
          position: 'relative', height: '320px', bgcolor: '#344055',
          backgroundImage: 'url(https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80)', 
          backgroundSize: 'cover', backgroundPosition: 'center',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
           <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.4)' }} />
           <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', position: 'relative', zIndex: 1 }}>
              Επικοινωνία
           </Typography>
           <Button href="/" startIcon={<ArrowBackIcon />} sx={{ 
               position: 'absolute', top: 30, left: 30, color: 'white', 
               bgcolor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(5px)', 
               '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }, zIndex: 1 
           }}>
              Πίσω στην Αρχική
           </Button>
        </Box>

        {/* MAIN CONTAINER */}
        <Container maxWidth="lg" sx={{ mt: -8, mb: 10, position: 'relative', zIndex: 2 }}>
          <Paper elevation={6} sx={{ p: { xs: 3, md: 5 }, borderRadius: '24px' }}>
            
            <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', color: '#7C4DFF', mb: 1 }}>
              Επικοινωνήστε Μαζί Μας
            </Typography>
            <Box sx={{ width: 60, height: 4, bgcolor: '#FFD740', mx: 'auto', mb: 6, borderRadius: 2 }} />

            <Grid container spacing={6}>
              
              {/* --- LEFT: FORM --- */}
              <Grid item xs={12} md={7}>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3, color: '#444' }}>
                    Στείλτε μας Μήνυμα
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                          <TextField required fullWidth label="Όνομα" placeholder="π.χ. Γιάννης" variant="outlined" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                          <TextField required fullWidth label="Επώνυμο" placeholder="π.χ. Παπαδόπουλος" variant="outlined" />
                      </Grid>
                      <Grid item xs={12}>
                          <TextField required fullWidth type="email" label="Email" placeholder="name@example.com" variant="outlined" />
                      </Grid>
                      <Grid item xs={12}>
                          <TextField required fullWidth label="Κινητό Τηλέφωνο" variant="outlined" />
                      </Grid>
                      <Grid item xs={12}>
                          <TextField required fullWidth multiline rows={4} label="Πληροφορίες" variant="outlined" />
                      </Grid>
                      <Grid item xs={12}>
                          <FormControlLabel 
                              control={<Checkbox required sx={{ color: '#7C4DFF', '&.Mui-checked': { color: '#7C4DFF' } }} />} 
                              label={<Typography variant="body2" color="text.secondary">Συμφωνώ στην πολιτική απορρήτου*</Typography>} 
                          />
                      </Grid>
                      <Grid item xs={12}>
                          <Button type="submit" variant="contained" fullWidth size="large" sx={{ bgcolor: '#7C4DFF', color: 'white', mt: 1 }}>
                              Αποστολή Μηνύματος
                          </Button>
                      </Grid>
                  </Grid>
                </Box>
              </Grid>

              {/* --- RIGHT: MAP & INFO --- */}
              <Grid item xs={12} md={5}>
                <Box sx={{ 
                    border: '1px solid #eee', borderRadius: '20px', 
                    height: '100%', bgcolor: '#ffffff', boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    display: 'flex', flexDirection: 'column', overflow: 'hidden'
                }}>
                  
                  <Typography variant="h6" fontWeight="bold" sx={{ p: 3, pb: 1 }}>Βρείτε μας</Typography>

                  {/* 1. MAP (Λειτουργικό Embed) */}
                  <Box sx={{ width: '100%', height: '220px', bgcolor: '#e0f7fa' }}>
                    <iframe 
                      title="google-map"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3146.387796036136!2d23.70425631532297!3d37.95751997972665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a1bc5ac7596001%3A0x629676774c880199!2sMenelaou%208%2C%20Kallithea%20176%2076!5e0!3m2!1sen!2sgr!4v1675628109673!5m2!1sen!2sgr" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen="" 
                      loading="lazy"
                    ></iframe>
                  </Box>

                  {/* 2. CONTACT INFO (Grid Layout) */}
                  <Box sx={{ p: 3 }}>
                    <Grid container spacing={2}>
                        
                        {/* Row 1: Email & Phone */}
                        <Grid item xs={12} sm={6}>
                             <ContactItem 
                                title="Email" 
                                content="care4pets@yahoo.gr" 
                                icon={<EmailIcon fontSize="small"/>}
                                bg="#FFCCBC" color="#FF5722"
                             />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                             <ContactItem 
                                title="Phone" 
                                content="210-456-7890" 
                                icon={<PhoneIcon fontSize="small"/>}
                                bg="#E1BEE7" color="#7B1FA2"
                             />
                        </Grid>

                        {/* Divider Line */}
                        <Grid item xs={12}>
                            <Divider sx={{ my: 1 }} />
                        </Grid>

                        {/* Row 2: Office */}
                        <Grid item xs={12}>
                             <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                <Box sx={{ 
                                  bgcolor: '#B9F6CA', color: '#00C853', 
                                  width: 40, height: 40, borderRadius: '50%', 
                                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                  mr: 2, flexShrink: 0
                                }}>
                                  <LocationOnIcon fontSize="small" />
                                </Box>
                                <Box>
                                  <Typography variant="subtitle2" fontWeight="bold">Office</Typography>
                                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                                    Ελάτε από τα γραφεία μας να σας γνωρίσουμε.
                                  </Typography>
                                  <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
                                    Μενελάου 8, Καλλιθέα 11631
                                  </Typography>
                                </Box>
                             </Box>
                        </Grid>
                        
                    </Grid>
                  </Box>

                </Box>
              </Grid>

            </Grid>
          </Paper>
        </Container>

        {/* POPUP */}
        <Dialog open={openSuccess} onClose={() => setOpenSuccess(false)} PaperProps={{ sx: { borderRadius: '24px', p: 3, maxWidth: '400px' } }}>
            <DialogContent sx={{ textAlign: 'center' }}>
                <Box sx={{ bgcolor: '#E8F5E9', width: 70, height: 70, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                    <CheckCircleIcon sx={{ color: '#4CAF50', fontSize: 40 }} />
                </Box>
                <Typography variant="h6" fontWeight="bold">Επιτυχία!</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Το μήνυμα ελήφθη.</Typography>
                <Button onClick={() => setOpenSuccess(false)} fullWidth variant="contained" sx={{ bgcolor: '#7C4DFF' }}>Εντάξει</Button>
            </DialogContent>
        </Dialog>

      </Box>
    </ThemeProvider>
  );
}