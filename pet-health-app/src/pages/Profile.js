import React from 'react';
import { 
  Box, Container, Grid, Typography, Button, Paper, Avatar, TextField, IconButton, List, ListItem, ListItemText, ListItemIcon, Divider 
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import EmailIcon from '@mui/icons-material/Email';
import AddIcon from '@mui/icons-material/Add';

// Import PageHeader
import PageHeader from './PageHeader';

const theme = createTheme({
  palette: {
    primary: { main: '#3B82F6' }, // Το μπλε κουμπί "Επεξεργασία"
    text: { primary: '#333', secondary: '#666' },
    background: { default: '#333' } // Dark background για όλη τη σελίδα όπως στο screenshot
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    button: { textTransform: 'none', fontWeight: 600 },
    h6: { fontWeight: 700 }
  },
  shape: { borderRadius: 12 },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiFilledInput-root': {
            backgroundColor: '#F3F4F6', // Το γκρι φόντο των inputs
            borderRadius: '8px',
            '&:before, &:after': { display: 'none' }, // Αφαίρεση γραμμής από κάτω
            '&:hover': { backgroundColor: '#E5E7EB' }
          }
        }
      }
    }
  }
});

// --- HELPER COMPONENT: FORM FIELD ---
const ProfileField = ({ label, value, type = "text" }) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="caption" fontWeight="bold" sx={{ color: '#666', mb: 1, display: 'block' }}>
      {label}
    </Typography>
    <TextField
      fullWidth
      variant="filled"
      defaultValue={value}
      type={type}
      InputProps={{
        endAdornment: (
          <IconButton size="small">
            <EditIcon fontSize="small" sx={{ color: '#333' }} />
          </IconButton>
        ),
        disableUnderline: true
      }}
    />
  </Box>
);

export default function Profile() {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      {/* Dark Background Wrapper */}
      <Box sx={{ minHeight: '100vh', bgcolor: '#2c2c2c', pb: 8, pt: 2 }}>
        
        {/* White Header Area (Logo placeholder) */}
        <Container maxWidth="xl" sx={{ mb: 4 }}>
             {/* Εδώ βάζουμε το PageHeader αλλά με custom style για να ταιριάζει στο dark theme αν θες, 
                 ή απλά το αφήνουμε ως έχει. Στο σχέδιο δεν φαίνεται header, αλλά είναι καλό για UX */}
             <Paper sx={{ p: 1, borderRadius: '12px', bgcolor: 'white' }}>
                <PageHeader />
             </Paper>
        </Container>

        <Container maxWidth="lg">
          
          <Typography variant="h5" sx={{ color: 'white', mb: 0.5 }}>Καλημέρα Gianni</Typography>
          <Typography variant="caption" sx={{ color: '#bbb', mb: 4, display: 'block' }}>Τετάρτη, 19 Νοε 2025</Typography>

          <Grid container spacing={4}>
            
            {/* --- LEFT COLUMN: MAIN FORM --- */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 5, borderRadius: '24px', bgcolor: 'white' }}>
                
                {/* Header Profile Section inside Card */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 6, flexWrap: 'wrap', gap: 2 }}>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ position: 'relative' }}>
                            <Avatar 
                                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80" 
                                sx={{ width: 70, height: 70 }} 
                            />
                            <Box sx={{ 
                                position: 'absolute', bottom: 0, right: 0, 
                                bgcolor: 'white', borderRadius: '50%', p: 0.5, border: '1px solid #ddd' 
                            }}>
                                <EditIcon sx={{ fontSize: 14, color: '#333' }} />
                            </Box>
                        </Box>
                        <Box>
                            <Typography variant="h6">Giannis</Typography>
                            <Typography variant="body2" color="text.secondary">gripgrip@gmail.com</Typography>
                        </Box>
                    </Box>

                    {/* Auto-save Banner */}
                    <Box sx={{ 
                        border: '1px solid #333', 
                        px: 3, py: 1, 
                        borderRadius: '4px',
                        display: { xs: 'none', sm: 'block' } 
                    }}>
                        <Typography variant="body2" fontWeight="500">Οι αλλαγές αποθηκεύονται αυτόματα</Typography>
                    </Box>

                    <Button variant="contained" sx={{ bgcolor: '#3B82F6', borderRadius: '8px', boxShadow: 'none' }}>
                        Επεξεργασία
                    </Button>
                </Box>

                {/* FIELDS GRID */}
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <ProfileField label="Ονοματεπώνυμο" value="Gianis Grip" />
                        <ProfileField label="Φύλο" value="Woman" /> {/* Βάσει της εικόνας */}
                        <ProfileField label="Αριθμός Ταυτότητας" value="AM3465" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <ProfileField label="Κωδικός Πρόσβασης" value="*****" type="password" />
                        <ProfileField label="Κινητό Τηλέφωνο" value="GR 6982045186" />
                        <ProfileField label="Διεύθυνση" value="Ayiou dimitriou 54" />
                    </Grid>
                </Grid>

                {/* EMAIL SECTION */}
                <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" fontWeight="bold" sx={{ color: '#666', mb: 2, display: 'block' }}>
                        To email μου
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ bgcolor: '#E3F2FD', p: 1, borderRadius: '50%', color: '#1976D2' }}>
                                <EmailIcon fontSize="small" />
                            </Box>
                            <Box>
                                <Typography variant="body2" fontWeight="bold">gripgrip@gmail.com</Typography>
                                <Typography variant="caption" color="text.secondary">1 month ago</Typography>
                            </Box>
                        </Box>
                        <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                    </Box>

                    <Button 
                        startIcon={<AddIcon />} 
                        sx={{ bgcolor: '#E3F2FD', color: '#1976D2', px: 3, borderRadius: '8px', fontWeight: 'bold' }}
                    >
                        +Προσθήκη Email
                    </Button>
                </Box>

              </Paper>
            </Grid>

            {/* --- RIGHT COLUMN: SIDEBAR MENU --- */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 4, borderRadius: '24px', bgcolor: 'white' }}>
                
                {/* Mini Profile */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Avatar 
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80" 
                        sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }} 
                    />
                    <Typography variant="h6" fontSize="1rem">Giannis Grip</Typography>
                    <Typography variant="caption" color="text.secondary">gripgrip@gmail.com</Typography>
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Menu List */}
                <List component="nav">
                    
                    {/* Item 1: Profile (Active) */}
                    <ListItem 
                        button 
                        selected 
                        sx={{ 
                            bgcolor: '#F3F4F6 !important', 
                            borderRadius: '8px', 
                            mb: 1 
                        }}
                    >
                        <ListItemIcon><PersonOutlineIcon sx={{ color: '#333' }} /></ListItemIcon>
                        <ListItemText primary="Το προφίλ μου" primaryTypographyProps={{ fontWeight: 'bold', fontSize: '0.9rem' }} />
                        <KeyboardArrowRightIcon sx={{ color: '#6C63FF' }} />
                    </ListItem>

                    {/* Item 2: Settings */}
                    <ListItem button sx={{ borderRadius: '8px', mb: 1 }}>
                        <ListItemIcon><SettingsOutlinedIcon /></ListItemIcon>
                        <ListItemText primary="Ρυθμίσεις" primaryTypographyProps={{ fontSize: '0.9rem' }} />
                        <KeyboardArrowRightIcon sx={{ color: '#6C63FF' }} />
                    </ListItem>

                    {/* Item 3: Logout */}
                    <ListItem 
                        button 
                        onClick={() => { localStorage.removeItem('user'); navigate('/login'); }}
                        sx={{ borderRadius: '8px' }}
                    >
                        <ListItemIcon><LogoutIcon /></ListItemIcon>
                        <ListItemText primary="Αποσύνδεση" primaryTypographyProps={{ fontSize: '0.9rem' }} />
                    </ListItem>

                </List>

              </Paper>
            </Grid>

          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}