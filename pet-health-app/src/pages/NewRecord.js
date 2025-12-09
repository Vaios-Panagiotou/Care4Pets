import React, { useState } from 'react';
import { 
  Box, Container, Grid, Typography, TextField, Button, Paper, 
  MenuItem, Select, InputLabel, FormControl, Avatar, IconButton 
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Icons
import UploadIcon from '@mui/icons-material/Upload';
import PetsIcon from '@mui/icons-material/Pets';
import PersonIcon from '@mui/icons-material/Person';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Import PageHeader
import PageHeader from './PageHeader';

const theme = createTheme({
  palette: {
    primary: { main: '#00695c' },
    secondary: { main: '#FFA726' },
    text: { primary: '#333', secondary: '#555' },
    background: { default: '#f8f9fa' }
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
        root: { marginBottom: '20px', bgcolor: 'white' }
      }
    }
  }
});

export default function NewRecord() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Η καταγραφή αποθηκεύτηκε επιτυχώς!');
    navigate('/vet');
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8', pb: 10 }}>
        
        <Container maxWidth="xl" sx={{ pt: 2 }}>
            <PageHeader />
        </Container>

        {/* HERO HEADER */}
        <Box sx={{ bgcolor: '#00695c', py: 6, mb: 6, color: 'white', textAlign: 'center', borderRadius: '0 0 50% 50% / 0 0 20px 20px' }}>
            <Container maxWidth="md">
                <Typography variant="h4" fontWeight="bold">Νέα Καταγραφή Ασθενούς</Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, mt: 1 }}>
                    Συμπληρώστε τα στοιχεία του ζώου και του ιδιοκτήτη για να δημιουργήσετε νέο φάκελο.
                </Typography>
            </Container>
        </Box>

        <Container maxWidth="lg">
          <Paper elevation={3} sx={{ p: 5, borderRadius: '24px' }}>
            <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={6}>
                    
                    {/* LEFT COLUMN: PET INFO */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                            <PetsIcon color="primary" fontSize="large" />
                            <Typography variant="h6">Στοιχεία Ζώου</Typography>
                        </Box>

                        {/* Image Upload */}
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Avatar src={image} sx={{ width: 120, height: 120, mx: 'auto', mb: 2, border: '4px solid #eee' }} />
                            <Button variant="outlined" component="label" startIcon={<UploadIcon />}>
                                Ανέβασμα Φωτογραφίας
                                <input type="file" hidden onChange={handleImageChange} />
                            </Button>
                        </Box>

                        <TextField fullWidth required label="Όνομα Ζώου" variant="outlined" />
                        
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <FormControl fullWidth sx={{ mb: 2, bgcolor: 'white' }}>
                                    <InputLabel>Είδος</InputLabel>
                                    <Select label="Είδος" defaultValue="">
                                        <MenuItem value="dog">Σκύλος</MenuItem>
                                        <MenuItem value="cat">Γάτα</MenuItem>
                                        <MenuItem value="other">Άλλο</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField fullWidth label="Φυλή (Ράτσα)" variant="outlined" />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <FormControl fullWidth sx={{ mb: 2, bgcolor: 'white' }}>
                                    <InputLabel>Φύλο</InputLabel>
                                    <Select label="Φύλο" defaultValue="">
                                        <MenuItem value="male">Αρσενικό</MenuItem>
                                        <MenuItem value="female">Θηλυκό</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField fullWidth label="Ηλικία" variant="outlined" />
                            </Grid>
                        </Grid>

                        <TextField fullWidth label="Χρώμα / Σημάδια" variant="outlined" />
                        <TextField fullWidth required label="Αριθμός Microchip" variant="outlined" sx={{ bgcolor: '#e0f2f1' }} helperText="Υποχρεωτικό πεδίο για ταυτοποίηση" />
                    </Grid>

                    {/* RIGHT COLUMN: OWNER INFO & ACTIONS */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                            <PersonIcon color="primary" fontSize="large" />
                            <Typography variant="h6">Στοιχεία Ιδιοκτήτη</Typography>
                        </Box>

                        <TextField fullWidth required label="Ονοματεπώνυμο Ιδιοκτήτη" variant="outlined" />
                        <TextField fullWidth required label="Τηλέφωνο Επικοινωνίας" variant="outlined" />
                        <TextField fullWidth label="Email" type="email" variant="outlined" />
                        <TextField fullWidth label="Διεύθυνση Κατοικίας" variant="outlined" />
                        <TextField fullWidth label="ΑΦΜ (Προαιρετικό)" variant="outlined" />

                        <Box sx={{ mt: 4, p: 3, bgcolor: '#f5f5f5', borderRadius: '12px' }}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Σημειώσεις Κτηνιάτρου</Typography>
                            <TextField fullWidth multiline rows={4} placeholder="Γράψτε τυχόν παρατηρήσεις, αλλεργίες ή ιστορικό..." variant="outlined" sx={{ bgcolor: 'white', mb: 0 }} />
                        </Box>

                        {/* ACTION BUTTONS */}
                        <Box sx={{ mt: 5, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button 
                                variant="outlined" 
                                color="error" 
                                startIcon={<ArrowBackIcon />}
                                onClick={() => navigate('/vet')}
                                sx={{ px: 3 }}
                            >
                                Ακύρωση
                            </Button>
                            <Button 
                                type="submit" 
                                variant="contained" 
                                color="primary" 
                                startIcon={<SaveIcon />}
                                sx={{ px: 4, py: 1.5, fontSize: '1rem' }}
                            >
                                Αποθήκευση Καταγραφής
                            </Button>
                        </Box>
                    </Grid>

                </Grid>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}