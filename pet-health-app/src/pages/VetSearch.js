import React, { useState } from 'react';
import { 
  Box, Container, Grid, Typography, Button, Paper, Avatar, Chip, IconButton, 
  Divider, Pagination, TextField, Radio, RadioGroup, FormControlLabel, FormControl,
  Dialog, DialogContent, Checkbox, Alert
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Icons
import StarIcon from '@mui/icons-material/Star';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewListIcon from '@mui/icons-material/ViewList';
import GridViewIcon from '@mui/icons-material/GridView';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import GoogleIcon from '@mui/icons-material/Google';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// Import Header
import PageHeader from './PageHeader';

const theme = createTheme({
  palette: {
    primary: { main: '#00695c' },
    secondary: { main: '#FFA726' },
    success: { main: '#00C853' },
    error: { main: '#D50000' },
    text: { primary: '#333', secondary: '#666' },
    background: { default: '#f9f9f9' }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    button: { textTransform: 'none', fontWeight: 600 },
    h6: { fontWeight: 700 }
  },
  shape: { borderRadius: 8 }
});

// --- DATA ---
const ALL_VETS = [
  { id: 1, name: 'Δρ. Ιωάννης Σμυρνής', address: 'Πανεπιστημίου 16 - Αθήνα', specialty: 'Παθολογία Ζώων', availability: 'Παρ, 24 Ιαν 2025', views: '1.873', rating: 4.9, likes: 280, price: '50€', img: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: 2, name: 'Δρ. Ελένη Καρρά', address: 'Λεωφόρος Βουλιαγμένης 289', specialty: 'Κτηνιατρική Καρδιολογία', availability: 'Πεμ, 30 Ιαν 2025', views: '732', rating: 4.8, likes: 130, price: '30€', img: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: 3, name: 'Δρ. Γιώργος Παπαδόπουλος', address: 'Ερμού 45 - Θεσσαλονίκη', specialty: 'Ορθοπεδική', availability: 'Δευ, 27 Ιαν 2025', views: '540', rating: 4.7, likes: 210, price: '45€', img: 'https://randomuser.me/api/portraits/men/45.jpg' },
  { id: 4, name: 'Δρ. Μαρία Δημητρίου', address: 'Τσιμισκή 12 - Θεσσαλονίκη', specialty: 'Δερματολογία', availability: 'Τρι, 28 Ιαν 2025', views: '890', rating: 4.9, likes: 340, price: '60€', img: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { id: 5, name: 'Δρ. Κώστας Νικολάου', address: 'Πατησίων 100 - Αθήνα', specialty: 'Χειρουργική', availability: 'Τετ, 29 Ιαν 2025', views: '620', rating: 4.6, likes: 180, price: '55€', img: 'https://randomuser.me/api/portraits/men/22.jpg' },
];

const STEPS = ['Επιλογή Κτηνιάτρου', 'Επιλογή Ώρας/Μέρας', 'Σύνδεση', 'Επιλογή Κατοικιδίου', 'Προεπισκόπηση'];
const TIME_SLOTS = ['09:00', '10:00', '11:30', '13:00', '17:00', '18:30', '19:45'];

export default function VetSearch() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [openSuccess, setOpenSuccess] = useState(false);
  
  // Selection State
  const [selectedVet, setSelectedVet] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  
  // Login State
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Pagination State
  const [page, setPage] = useState(1);
  const vetsPerPage = 3;
  const pageCount = Math.ceil(ALL_VETS.length / vetsPerPage);
  
  const handlePageChange = (event, value) => setPage(value);
  const displayedVets = ALL_VETS.slice((page - 1) * vetsPerPage, page * vetsPerPage);

  // --- LOGIC ---

  const handleNext = () => {
    // Validations
    if (activeStep === 0 && !selectedVet) { alert("Παρακαλώ επιλέξτε έναν κτηνίατρο."); return; }
    if (activeStep === 1 && (!selectedDate || !selectedTime)) { alert("Παρακαλώ επιλέξτε ημερομηνία ΚΑΙ ώρα."); return; }
    
    // Στο βήμα 2 (Login), ο έλεγχος γίνεται στο handleSubmitLogin, όχι εδώ.
    if (activeStep === 2) {
       // Αν είναι ήδη στο βήμα Login, περιμένουμε να πατήσει το κουμπί "Σύνδεση" μέσα στη φόρμα.
       // Αλλά αν πατήσει "Επόμενο" κάτω δεξιά, του λέμε να συνδεθεί.
       alert("Παρακαλώ συνδεθείτε για να συνεχίσετε.");
       return; 
    }

    if (activeStep === 3 && !selectedPet) { setSelectedPet({ name: 'Kouvelaj', type: 'Golden Retriever', img: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=200&q=80' }); }

    if (activeStep < STEPS.length - 1) {
        setActiveStep((prev) => prev + 1);
    } else {
        setOpenSuccess(true);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep((prev) => prev - 1);
  };

  // --- LOGIN LOGIC ---
  const handleLoginSubmit = async () => {
    setLoginError('');
    try {
        const response = await fetch(`http://localhost:3001/users?email=${loginData.email}&password=${loginData.password}`);
        const users = await response.json();

        if (users.length > 0) {
            const user = users[0];
            localStorage.setItem('user', JSON.stringify(user)); // Αποθήκευση χρήστη
            setActiveStep((prev) => prev + 1); // Πάμε στο επόμενο βήμα
        } else {
            setLoginError('Λάθος email ή κωδικός.');
        }
    } catch (err) {
        console.error(err);
        setLoginError('Σφάλμα σύνδεσης με τον server.');
    }
  };

  // --- SUB-COMPONENTS ---

  const StepVetList = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Πύλη Κτηνιατρων <Chip label={ALL_VETS.length} size="small" color="primary" variant="outlined" sx={{ ml: 1 }} /></Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" endIcon={<FilterListIcon />} size="small" sx={{ color: '#333', borderColor: '#ccc' }}>Filter</Button>
              <Box sx={{ border: '1px solid #ccc', borderRadius: 1, display: 'flex' }}>
                  <IconButton size="small"><ViewListIcon /></IconButton>
                  <IconButton size="small"><GridViewIcon /></IconButton>
              </Box>
          </Box>
      </Box>
      {displayedVets.map(vet => (
          <Paper 
            key={vet.id} 
            elevation={selectedVet?.id === vet.id ? 4 : 0} 
            onClick={() => setSelectedVet(vet)}
            sx={{ 
                p: 2, mb: 3, border: selectedVet?.id === vet.id ? '2px solid #00695c' : '1px solid #eee', 
                borderRadius: '12px', display: 'flex', gap: 3, cursor: 'pointer',
                bgcolor: selectedVet?.id === vet.id ? '#e0f2f1' : 'white',
                transition: '0.2s', '&:hover': { borderColor: '#00695c' }
            }}
          >
              <Avatar src={vet.img} variant="rounded" sx={{ width: 100, height: 100, borderRadius: '8px' }} />
              <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ color: '#0277bd', mb: 1 }}>{vet.name}</Typography>
                  <Typography variant="caption" display="block" color="text.secondary"><LocationOnIcon fontSize="inherit"/> {vet.address}</Typography>
                  <Typography variant="caption" display="block" color="text.secondary"><MedicalServicesIcon fontSize="inherit"/> {vet.specialty}</Typography>
                  <Typography variant="caption" display="block" color="text.primary" fontWeight="bold"><CalendarMonthIcon fontSize="inherit"/> {vet.availability}</Typography>
              </Box>
              <Box sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <IconButton size="small" sx={{ alignSelf: 'flex-end' }}><MoreVertIcon /></IconButton>
                  <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                          <StarIcon sx={{ color: '#FFC107', fontSize: 18 }} />
                          <Typography variant="body2" fontWeight="bold">{vet.rating}</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mt: 1, color: '#555' }}>Τιμή από: <span style={{ color: '#00695c', fontWeight: 'bold', fontSize: '1.1rem' }}>{vet.price}</span></Typography>
                  </Box>
              </Box>
          </Paper>
      ))}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><Pagination count={pageCount} page={page} onChange={handlePageChange} color="primary" shape="rounded" /></Box>
    </Box>
  );

  const StepCalendar = () => (
    <Box sx={{ maxWidth: '1000px', mx: 'auto' }}>
      <Typography variant="h5" fontWeight="bold" align="center" gutterBottom sx={{ mt: -2 }}>Ώρα και Μέρα</Typography>
      <Divider sx={{ width: 60, height: 4, bgcolor: '#333', mx: 'auto', mb: 6, borderRadius: 2 }} />

      {/* Increased spacing to separate calendar from options */}
      <Grid container spacing={6}> 
        <Grid item xs={12} md={7}>
            <Paper elevation={0} sx={{ p: 4, border: '1px solid #e0e0e0', borderRadius: '24px', height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
                    <IconButton size="small" sx={{ border: '1px solid #eee' }}><ChevronLeftIcon /></IconButton>
                    <Typography variant="h6" fontWeight="bold">Νοέμβριος 2025</Typography>
                    <IconButton size="small" sx={{ border: '1px solid #eee' }}><ChevronRightIcon /></IconButton>
                </Box>
                <Grid container spacing={2}>
                    {['Κυ','Δε','Τρ','Τε','Πε','Πα','Σα'].map(d => <Grid item xs={1.7} key={d} sx={{ textAlign: 'center' }}><Typography variant="caption" color="text.secondary" fontWeight="bold">{d}</Typography></Grid>)}
                </Grid>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    {[...Array(30)].map((_, i) => {
                        const day = i + 1;
                        const isSelected = selectedDate === `Noe ${day}`;
                        return (
                            <Grid item xs={1.7} key={i}>
                                <Box 
                                  onClick={() => setSelectedDate(`Noe ${day}`)}
                                  sx={{ 
                                    width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', 
                                    borderRadius: '50%', cursor: 'pointer', transition: '0.2s',
                                    bgcolor: isSelected ? '#263238' : 'transparent', 
                                    color: isSelected ? 'white' : 'inherit',
                                    fontWeight: isSelected ? 'bold' : 'normal',
                                    '&:hover': { bgcolor: isSelected ? '#263238' : '#f5f5f5' }
                                }}>{day}</Box>
                            </Grid>
                        )
                    })}
                </Grid>
            </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={{ p: 4, border: '1px solid #e0e0e0', borderRadius: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>Επιλογή Πράξης</Typography>
                <FormControl component="fieldset" sx={{ mb: 4 }}>
                    <RadioGroup defaultValue="medical">
                        <FormControlLabel value="exam" control={<Radio color="primary" />} label="Καταγραφή Ζώου" />
                        <FormControlLabel value="medical" control={<Radio color="primary" />} label="Ιατρική πράξη" />
                    </RadioGroup>
                </FormControl>
                <Divider sx={{ mb: 3 }} />
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}><AccessTimeIcon fontSize="small"/> Διαθέσιμες Ώρες</Typography>
                <Grid container spacing={1}>
                    {TIME_SLOTS.map((time) => (
                        <Grid item xs={4} key={time}>
                            <Chip 
                                label={time} 
                                onClick={() => setSelectedTime(time)}
                                variant={selectedTime === time ? "filled" : "outlined"}
                                color="primary"
                                sx={{ 
                                    width: '100%', fontWeight: 'bold', cursor: 'pointer',
                                    bgcolor: selectedTime === time ? '#00695c' : 'transparent',
                                    color: selectedTime === time ? 'white' : '#333',
                                    borderColor: '#ddd'
                                }} 
                            />
                        </Grid>
                    ))}
                </Grid>
                {selectedDate && selectedTime && (
                    <Box sx={{ mt: 'auto', pt: 3 }}>
                        <Typography variant="body2" align="center" sx={{ bgcolor: '#e0f2f1', p: 1, borderRadius: 2, color: '#00695c', fontWeight: 'bold' }}>
                            Επιλογή: {selectedDate} στις {selectedTime}
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  const StepLogin = () => (
    <Grid container spacing={6} justifyContent="center" alignItems="center">
      <Grid item xs={12} md={6}>
          <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80" alt="cat" style={{ width: '100%', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
      </Grid>
      <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 5, borderRadius: '24px' }}>
              <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>Σύνδεση λογαριασμού</Typography>
              
              {loginError && <Alert severity="error" sx={{ mb: 2 }}>{loginError}</Alert>}

              <TextField 
                fullWidth label="Email" margin="normal" variant="filled" 
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
              />
              <TextField 
                fullWidth label="Κωδικός" type="password" margin="normal" variant="filled" 
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              />
              
              <FormControlLabel control={<Checkbox defaultChecked />} label="Θυμήσου με" sx={{ mt: 1 }} />
              
              <Button 
                fullWidth variant="contained" 
                sx={{ bgcolor: '#00695c', mt: 3, py: 1.5, fontSize: '1rem' }}
                onClick={handleLoginSubmit}
              >
                Σύνδεση
              </Button>
              
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="caption">Δεν έχετε λογαριασμό; <span style={{ color: '#00695c', fontWeight: 'bold', cursor: 'pointer' }}>Εγγραφή</span></Typography>
              </Box>
          </Paper>
      </Grid>
    </Grid>
  );

  const StepSelectPet = () => (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h5" fontWeight="bold">Επιλογή Κατοικιδίου</Typography>
      <Divider sx={{ width: 60, height: 3, bgcolor: '#333', mx: 'auto', mb: 6, mt: 1 }} />
      <Grid container spacing={4} justifyContent="center">
          {[
              { name: 'Kouvelaj', type: 'Golden Retriever', gender: 'male', img: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=200&q=80' },
              { name: 'Pantiana', type: 'Περσική Γάτα', gender: 'female', img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=200&q=80' }
          ].map((pet, i) => (
              <Grid item xs={12} sm={5} key={i}>
                  <Paper 
                    elevation={selectedPet?.name === pet.name ? 4 : 0} 
                    onClick={() => setSelectedPet(pet)}
                    sx={{ 
                        p: 2, border: selectedPet?.name === pet.name ? '2px solid #00695c' : '1px solid #333', 
                        borderRadius: '12px', textAlign: 'left', cursor: 'pointer', 
                        bgcolor: selectedPet?.name === pet.name ? '#e0f2f1' : 'white',
                        '&:hover': { bgcolor: '#f5f5f5' } 
                    }}
                  >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Box>
                              <Typography variant="h6" fontWeight="bold">{pet.name} {pet.gender === 'male' ? '♂' : '♀'}</Typography>
                              <Typography variant="caption" color="text.secondary">{pet.type}</Typography>
                          </Box>
                          <Avatar src={pet.img} variant="rounded" sx={{ width: 60, height: 60 }} />
                      </Box>
                      <Button fullWidth variant="contained" size="small" sx={{ mt: 2, bgcolor: '#333' }}>Επιλογή</Button>
                  </Paper>
              </Grid>
          ))}
      </Grid>
    </Box>
  );

  const StepPreview = () => (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h5" fontWeight="bold">Στοιχεία Κτηνίατρου</Typography>
      <Paper elevation={0} sx={{ p: 2, border: '1px solid #ccc', maxWidth: 500, mx: 'auto', mt: 2, mb: 4, display: 'flex', gap: 2 }}>
          <Avatar src={selectedVet?.img || "https://randomuser.me/api/portraits/men/32.jpg"} sx={{ width: 60, height: 60 }} />
          <Box sx={{ textAlign: 'left' }}>
              <Typography variant="subtitle2" fontWeight="bold">{selectedVet?.name || "Δρ. Ιωάννης Σμυρνής"}</Typography>
              <Typography variant="caption">{selectedVet?.specialty || "Παθολογία"}</Typography>
              <Typography variant="caption" display="block">Διεύθυνση: {selectedVet?.address || "Αθήνα"}</Typography>
          </Box>
      </Paper>

      <Typography variant="h5" fontWeight="bold">Ώρα και Μέρα</Typography>
      <Paper elevation={0} sx={{ p: 2, maxWidth: 500, mx: 'auto', mt: 2, mb: 4, border: '1px solid #eee', bgcolor: '#E3F2FD' }}>
          <Typography color="primary" fontWeight="bold">📅 {selectedDate ? `${selectedDate} 2025` : "Τετάρτη, 20 Νοεμβρίου 2025"} • {selectedTime || "10:00 ΠΜ"}</Typography>
      </Paper>

      <Typography variant="h5" fontWeight="bold">Στοιχεία Κατοικιδίου</Typography>
      <Paper elevation={0} sx={{ p: 2, border: '1px solid #333', maxWidth: 300, mx: 'auto', mt: 2, textAlign: 'left' }}>
          <Typography variant="h6">{selectedPet?.name || "Kouvelaj"} 🐕</Typography>
          <Typography variant="caption">{selectedPet?.type || "Golden Retriever"}</Typography>
      </Paper>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#fbfbfb', pb: 10 }}>
        
        <Container maxWidth="xl" sx={{ pt: 1 }}><PageHeader /></Container>

        <Box sx={{ 
            height: '300px', position: 'relative', mb: 5, bgcolor: '#333',
            backgroundImage: 'url(https://images.unsplash.com/photo-1628009368231-760335298025?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80)',
            backgroundSize: 'cover', backgroundPosition: 'center',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.5)' }} />
            <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', position: 'relative', zIndex: 1 }}>
                Ραντεβού με Κτηνίατρο
            </Typography>
            
            <Box sx={{ position: 'absolute', bottom: -25, width: '100%', display: 'flex', justifyContent: 'center' }}>
                <Paper elevation={3} sx={{ px: 4, py: 1.5, borderRadius: '50px', display: 'flex', alignItems: 'center', gap: 2 }}>
                    {STEPS.map((label, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ 
                                width: 30, height: 30, borderRadius: '50%', 
                                border: index === activeStep ? '2px solid #3B82F6' : '1px solid #ccc',
                                color: index === activeStep ? '#3B82F6' : (index < activeStep ? '#4CAF50' : '#999'),
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem',
                                bgcolor: index === activeStep ? '#E3F2FD' : 'white'
                            }}>
                                {index < activeStep ? '✓' : index + 1}
                            </Box>
                            <Typography variant="caption" sx={{ ml: 1, display: { xs: 'none', md: 'block' }, fontWeight: index === activeStep ? 'bold' : 'normal' }}>
                                {label}
                            </Typography>
                            {index < STEPS.length - 1 && <Box sx={{ width: 20, height: 1, bgcolor: '#ccc', mx: 1, display: { xs: 'none', sm: 'block' } }} />}
                        </Box>
                    ))}
                </Paper>
            </Box>
        </Box>

        <Container maxWidth="md" sx={{ mt: 8 }}>
            
            {activeStep === 0 && <StepVetList />}
            {activeStep === 1 && <StepCalendar />}
            {activeStep === 2 && <StepLogin />}
            {activeStep === 3 && <StepSelectPet />}
            {activeStep === 4 && <StepPreview />}

            {/* HIDE NAVIGATION BUTTONS ON LOGIN STEP - BECAUSE LOGIN HAS ITS OWN BUTTON */}
            {activeStep !== 2 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 6 }}>
                    <Button 
                        variant="contained" color="error" 
                        onClick={() => activeStep === 0 ? navigate('/owner') : handleBack()}
                        sx={{ px: 4, fontWeight: 'bold' }}
                    >
                        {activeStep === 0 ? 'Ακύρωση' : 'Προηγούμενο'}
                    </Button>

                    <Button 
                        variant="contained" color="success" endIcon={<ArrowForwardIcon />} 
                        sx={{ px: 4, fontWeight: 'bold', color: 'white' }}
                        onClick={handleNext}
                    >
                        {activeStep === STEPS.length - 1 ? 'Ολοκλήρωση' : 'Επόμενο'}
                    </Button>
                </Box>
            )}

        </Container>

        <Dialog open={openSuccess} onClose={() => navigate('/owner')} PaperProps={{ sx: { borderRadius: '20px', p: 4, textAlign: 'center' } }}>
            <DialogContent>
                <CheckCircleIcon sx={{ fontSize: 60, color: '#4CAF50', mb: 2 }} />
                <Typography variant="h5" fontWeight="bold">Ολοκλήρωση με επιτυχία</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                    Το ραντεβού σας καταχωρήθηκε επιτυχώς!
                </Typography>
                <Button variant="contained" fullWidth sx={{ bgcolor: '#263238' }} onClick={() => navigate('/owner')}>
                    Επιστροφή στο Dashboard
                </Button>
            </DialogContent>
        </Dialog>

      </Box>
    </ThemeProvider>
  );
}