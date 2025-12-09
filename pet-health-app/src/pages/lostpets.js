import React, { useState } from 'react';
import { 
  Box, Container, Grid, Typography, Button, Paper, Avatar, Chip, IconButton, 
  TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel,
  Slider, Dialog, DialogContent, Stepper, Step, StepLabel
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PetsIcon from '@mui/icons-material/Pets';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Import PageHeader
import PageHeader from './PageHeader';

const theme = createTheme({
  palette: {
    primary: { main: '#00695c' },
    secondary: { main: '#FFA726' },
    error: { main: '#D32F2F' },
    background: { default: '#f8f9fa' }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    button: { textTransform: 'none', fontWeight: 600 },
    h6: { fontWeight: 700 }
  },
  shape: { borderRadius: 12 }
});

// --- MOCK DATA (Χαμένα Ζώα) ---
const LOST_PETS = [
  { id: 1, name: 'Μίκυ', type: 'Σκύλος', breed: 'Labrador', color: 'Μπεζ', date: '20 Οκτ 2025', location: 'Κυψέλη, Αθήνα', img: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80', reward: '50€' },
  { id: 2, name: 'Λούνα', type: 'Γάτα', breed: 'Άγνωστη', color: 'Μαύρο/Άσπρο', date: '18 Οκτ 2025', location: 'Περιστέρι', img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80', reward: null },
  { id: 3, name: 'Ρόκυ', type: 'Σκύλος', breed: 'Terrier', color: 'Καφέ', date: '15 Οκτ 2025', location: 'Χαλάνδρι', img: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80', reward: '100€' },
  { id: 4, name: 'Μάγια', type: 'Γάτα', breed: 'Siamese', color: 'Μπεζ', date: '12 Οκτ 2025', location: 'Νέα Σμύρνη', img: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=400&q=80', reward: null },
];

const STEPS = ['Στοιχεία Ζώου', 'Φωτογραφίες', 'Λεπτομέρειες', 'Επικοινωνία'];

export default function LostPets() {
  const navigate = useNavigate();
  const [view, setView] = useState('search'); // 'search' ή 'form'
  
  // Form State
  const [activeStep, setActiveStep] = useState(0);
  const [openSuccess, setOpenSuccess] = useState(false);

  // --- SUB-COMPONENTS ---

  // 1. SEARCH VIEW
  const SearchView = () => (
    <Box>
        {/* HERO */}
        <Box sx={{ 
            height: '300px', bgcolor: '#263238', position: 'relative', mb: 5, borderRadius: '0 0 50% 10% / 0 0 20px 20px',
            backgroundImage: 'url(https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80)',
            backgroundSize: 'cover', backgroundPosition: 'center',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
        }}>
            <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.5)', borderRadius: '0 0 50% 10% / 0 0 20px 20px' }} />
            <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', position: 'relative', zIndex: 1, textAlign: 'center' }}>
                Αναζήτηση Χαμένου Κατοικιδίου
            </Typography>
            <Button 
                variant="contained" color="secondary" size="large" 
                onClick={() => setView('form')}
                sx={{ mt: 3, position: 'relative', zIndex: 1, fontWeight: 'bold', px: 4, py: 1.5, borderRadius: '30px' }}
            >
                Δήλωση Απώλειας
            </Button>
        </Box>

        <Container maxWidth="xl">
            <Grid container spacing={4}>
                
                {/* FILTERS (Left Sidebar) */}
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 3, borderRadius: '16px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <FilterListIcon color="primary" />
                            <Typography variant="h6">Φίλτρα</Typography>
                        </Box>
                        
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Είδος</InputLabel>
                            <Select label="Είδος" defaultValue="">
                                <MenuItem value="dog">Σκύλος</MenuItem>
                                <MenuItem value="cat">Γάτα</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField fullWidth label="Περιοχή" variant="outlined" sx={{ mb: 2 }} />
                        
                        <Typography gutterBottom>Ακτίνα (km)</Typography>
                        <Slider defaultValue={10} valueLabelDisplay="auto" step={5} min={0} max={50} sx={{ mb: 2 }} />

                        <FormControlLabel control={<Checkbox />} label="Με αμοιβή" />
                        
                        <Button variant="contained" fullWidth sx={{ mt: 2 }}>Εφαρμογή</Button>
                    </Paper>
                </Grid>

                {/* RESULTS (Right Grid) */}
                <Grid item xs={12} md={9}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
                        <Typography variant="h6">{LOST_PETS.length} Αγγελίες</Typography>
                        <Button startIcon={<SearchIcon />} sx={{ textTransform: 'none' }}>Ταξινόμηση</Button>
                    </Box>

                    <Grid container spacing={3}>
                        {LOST_PETS.map(pet => (
                            <Grid item xs={12} sm={6} md={4} key={pet.id}>
                                <Paper sx={{ borderRadius: '16px', overflow: 'hidden', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 4 } }}>
                                    <Box sx={{ height: 200, bgcolor: '#eee', position: 'relative' }}>
                                        <img src={pet.img} alt={pet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        {pet.reward && (
                                            <Chip label={`Αμοιβή: ${pet.reward}`} color="secondary" size="small" sx={{ position: 'absolute', top: 10, right: 10, fontWeight: 'bold' }} />
                                        )}
                                    </Box>
                                    <Box sx={{ p: 2 }}>
                                        <Typography variant="h6">{pet.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">{pet.breed} • {pet.color}</Typography>
                                        
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1, color: '#555' }}>
                                            <LocationOnIcon fontSize="small" /> <Typography variant="caption">{pet.location}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#555' }}>
                                            <CalendarMonthIcon fontSize="small" /> <Typography variant="caption">{pet.date}</Typography>
                                        </Box>

                                        <Button variant="outlined" fullWidth sx={{ mt: 2, borderRadius: '8px' }}>Δες Περισσότερα</Button>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>

            </Grid>
        </Container>
    </Box>
  );

  // 2. FORM VIEW (Declaration)
  const FormView = () => (
    <Container maxWidth="md" sx={{ py: 6 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => setView('search')} sx={{ mb: 2 }}>Πίσω στην αναζήτηση</Button>
        
        <Paper sx={{ p: 4, borderRadius: '24px' }}>
            <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>Δήλωση Απώλειας</Typography>
            <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4 }}>
                Συμπληρώστε τα στοιχεία για να ειδοποιηθεί η κοινότητα άμεσα.
            </Typography>

            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 6 }}>
                {STEPS.map((label) => (
                    <Step key={label}><StepLabel>{label}</StepLabel></Step>
                ))}
            </Stepper>

            {/* Step Content */}
            <Box sx={{ minHeight: '300px' }}>
                {activeStep === 0 && (
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}><TextField fullWidth label="Όνομα Ζώου" variant="outlined" /></Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth><InputLabel>Είδος</InputLabel><Select label="Είδος" defaultValue=""><MenuItem value="dog">Σκύλος</MenuItem><MenuItem value="cat">Γάτα</MenuItem></Select></FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}><TextField fullWidth label="Ράτσα" variant="outlined" /></Grid>
                        <Grid item xs={12} sm={6}><TextField fullWidth label="Χρώμα" variant="outlined" /></Grid>
                        <Grid item xs={12}><TextField fullWidth label="Αριθμός Microchip" variant="outlined" /></Grid>
                    </Grid>
                )}

                {activeStep === 1 && (
                    <Box sx={{ textAlign: 'center', py: 4, border: '2px dashed #ccc', borderRadius: '16px' }}>
                        <AddPhotoAlternateIcon sx={{ fontSize: 60, color: '#ccc' }} />
                        <Typography>Προσθέστε φωτογραφία του κατοικιδίου σας</Typography>
                        <Button variant="contained" component="label" sx={{ mt: 2 }}>
                            Επιλογή Αρχείου <input type="file" hidden />
                        </Button>
                    </Box>
                )}

                {activeStep === 2 && (
                    <Box>
                        <TextField fullWidth label="Περιοχή Απώλειας" variant="outlined" sx={{ mb: 3 }} />
                        <TextField fullWidth type="date" label="Ημερομηνία Απώλειας" InputLabelProps={{ shrink: true }} sx={{ mb: 3 }} />
                        <TextField fullWidth multiline rows={4} label="Περιγραφή / Ιδιαίτερα χαρακτηριστικά" variant="outlined" />
                    </Box>
                )}

                {activeStep === 3 && (
                    <Box>
                        <Typography variant="h6" gutterBottom>Στοιχεία Επικοινωνίας (Ορατά σε όλους)</Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}><TextField fullWidth label="Όνομα" defaultValue="Giannis" variant="outlined" /></Grid>
                            <Grid item xs={12} sm={6}><TextField fullWidth label="Τηλέφωνο" defaultValue="6982045186" variant="outlined" /></Grid>
                            <Grid item xs={12}><TextField fullWidth label="Email" defaultValue="gripgrip@gmail.com" variant="outlined" /></Grid>
                            <Grid item xs={12}><FormControlLabel control={<Checkbox />} label="Δίνω αμοιβή" /></Grid>
                        </Grid>
                    </Box>
                )}
            </Box>

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6 }}>
                <Button disabled={activeStep === 0} onClick={() => setActiveStep(prev => prev - 1)}>Προηγούμενο</Button>
                <Button 
                    variant="contained" 
                    color={activeStep === STEPS.length - 1 ? "success" : "primary"}
                    onClick={() => {
                        if (activeStep === STEPS.length - 1) setOpenSuccess(true);
                        else setActiveStep(prev => prev + 1);
                    }}
                >
                    {activeStep === STEPS.length - 1 ? 'Οριστική Υποβολή' : 'Επόμενο'}
                </Button>
            </Box>
        </Paper>
    </Container>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#fbfbfb', pb: 8 }}>
        
        <Container maxWidth="xl" sx={{ pt: 2 }}>
            <PageHeader />
        </Container>

        {/* View Switcher */}
        {view === 'search' ? <SearchView /> : <FormView />}

        {/* Success Dialog */}
        <Dialog open={openSuccess} onClose={() => { setOpenSuccess(false); setView('search'); setActiveStep(0); }} PaperProps={{ sx: { borderRadius: '20px', p: 4, textAlign: 'center' } }}>
            <DialogContent>
                <CheckCircleIcon sx={{ fontSize: 60, color: '#2E7D32', mb: 2 }} />
                <Typography variant="h5" fontWeight="bold">Επιτυχία!</Typography>
                <Typography sx={{ mt: 1, mb: 3 }}>Η δήλωση απώλειας καταχωρήθηκε.</Typography>
                <Button variant="contained" fullWidth onClick={() => { setOpenSuccess(false); setView('search'); setActiveStep(0); }}>Επιστροφή</Button>
            </DialogContent>
        </Dialog>

      </Box>
    </ThemeProvider>
  );
}