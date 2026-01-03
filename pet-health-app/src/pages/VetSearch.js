import React, { useState, useMemo, useEffect } from 'react';
import { 
  Box, Container, Grid, Typography, Button, Paper, Avatar, Chip, IconButton, 
  Divider, Pagination, TextField, Radio, RadioGroup, FormControlLabel, FormControl,
  Dialog, DialogContent, Checkbox, Alert, Tooltip
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { keyframes } from '@mui/system';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
import DashboardSidebar from '../components/DashboardSidebar';

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

const STEPS = ['Επιλογή Κτηνιάτρου', 'Επιλογή Ώρας/Μέρας', 'Επιλογή Κατοικιδίου', 'Προεπισκόπηση'];
const TIME_SLOTS = ['09:00', '10:00', '11:30', '13:00', '17:00', '18:30', '19:45'];

const pulseRing = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0,105,92,0.25); }
  70% { box-shadow: 0 0 0 12px rgba(0,105,92,0); }
  100% { box-shadow: 0 0 0 0 rgba(0,105,92,0); }
`;

const floatCard = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
  100% { transform: translateY(0); }
`;

export default function VetSearch() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const { user } = useAuth();
  const [hasPets, setHasPets] = useState(true);
  const userLabel = user?.name || user?.fullName || user?.email || 'τον λογαριασμό σας';
  
  const [activeStep, setActiveStep] = useState(0);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [calendarDate, setCalendarDate] = useState(() => new Date());
  const todayRef = useMemo(() => new Date(), []);
  
  // Selection State
  const [selectedVet, setSelectedVet] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const vetsPerPage = 3;

  useEffect(() => {
    let result = true;
    const stored = localStorage.getItem('pets');
    if (stored) {
      try {
        const arr = JSON.parse(stored);
        if (Array.isArray(arr)) {
          if (arr.length === 0) result = false;
          else result = true;
        }
      } catch (e) {}
    }
    if (user?.pets && Array.isArray(user.pets)) {
      if (user.pets.length === 0) result = false;
      if (user.pets.length > 0) result = true;
    }
    setHasPets(result);
  }, [user]);
  
  // Filter vets based on search query
  const filteredVets = useMemo(() => {
    if (!searchQuery.trim()) return ALL_VETS;
    return ALL_VETS.filter(vet => 
      vet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vet.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vet.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);
  
  const pageCount = Math.ceil(filteredVets.length / vetsPerPage);
  const handlePageChange = (event, value) => setPage(value);
  const displayedVets = filteredVets.slice((page - 1) * vetsPerPage, page * vetsPerPage);

  // --- ACCESS GUARDS ---
  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
          <Container maxWidth="xl" sx={{ pt: 2 }}>
            <PageHeader />
          </Container>
          <Container maxWidth="md" sx={{ py: 8 }}>
            <Paper elevation={4} sx={{ p: 5, textAlign: 'center', borderRadius: 4, bgcolor: 'white' }}>
              <Typography variant="h4" fontWeight={800} sx={{ mb: 2, color: '#0f172a' }}>Συνδεθείτε για να συνεχίσετε</Typography>
              <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                Για να κλείσετε ραντεβού με κτηνίατρο πρέπει πρώτα να συνδεθείτε στον λογαριασμό σας.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Button variant="contained" size="large" onClick={() => navigate('/login')} sx={{ px: 4, borderRadius: 3 }}>Σύνδεση</Button>
                <Button variant="outlined" size="large" onClick={() => navigate('/register')} sx={{ px: 4, borderRadius: 3 }}>Εγγραφή</Button>
              </Box>
            </Paper>
          </Container>
        </Box>
      </ThemeProvider>
    );
  }

  if (hasPets === false) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
          <Container maxWidth="xl" sx={{ pt: 2 }}>
            <PageHeader />
          </Container>
          <Container maxWidth="md" sx={{ py: 8 }}>
            <Paper elevation={4} sx={{ p: 5, textAlign: 'center', borderRadius: 4, bgcolor: 'white' }}>
              <Typography variant="h4" fontWeight={800} sx={{ mb: 2, color: '#0f172a' }}>Προσθέστε ένα κατοικίδιο</Typography>
              <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                Για να αναζητήσετε κτηνίατρο, προσθέστε πρώτα το κατοικίδιό σας ώστε να γνωρίζουμε για ποιον κάνουμε κράτηση.
              </Typography>
              <Button variant="contained" size="large" onClick={() => navigate('/owner/pets')} sx={{ px: 4, borderRadius: 3 }}>Μετάβαση στα Κατοικίδια</Button>
            </Paper>
          </Container>
        </Box>
      </ThemeProvider>
    );
  }

  // --- LOGIC ---

  const handleNext = () => {
    if (activeStep === 0 && !selectedVet) { alert("Παρακαλώ επιλέξτε έναν κτηνίατρο."); return; }
    if (activeStep === 1 && (!selectedDate || !selectedTime)) { alert("Παρακαλώ επιλέξτε ημερομηνία ΚΑΙ ώρα."); return; }
    if (activeStep === 2) { alert("Παρακαλώ συνδεθείτε για να συνεχίσετε."); return; }
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

  // --- ACCESS GUARDS ---
  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
          <Container maxWidth="xl" sx={{ pt: 2 }}>
            <PageHeader />
          </Container>
          <Container maxWidth="md" sx={{ py: 8 }}>
            <Paper elevation={4} sx={{ p: 5, textAlign: 'center', borderRadius: 4, bgcolor: 'white' }}>
              <Typography variant="h4" fontWeight={800} sx={{ mb: 2, color: '#0f172a' }}>Συνδεθείτε για να συνεχίσετε</Typography>
              <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                Για να κλείσετε ραντεβού με κτηνίατρο πρέπει πρώτα να συνδεθείτε στον λογαριασμό σας.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Button variant="contained" size="large" onClick={() => navigate('/login')} sx={{ px: 4, borderRadius: 3 }}>Σύνδεση</Button>
                <Button variant="outlined" size="large" onClick={() => navigate('/register')} sx={{ px: 4, borderRadius: 3 }}>Εγγραφή</Button>
              </Box>
            </Paper>
          </Container>
        </Box>
      </ThemeProvider>
    );
  }

  if (hasPets === false) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
          <Container maxWidth="xl" sx={{ pt: 2 }}>
            <PageHeader />
          </Container>
          <Container maxWidth="md" sx={{ py: 8 }}>
            <Paper elevation={4} sx={{ p: 5, textAlign: 'center', borderRadius: 4, bgcolor: 'white' }}>
              <Typography variant="h4" fontWeight={800} sx={{ mb: 2, color: '#0f172a' }}>Προσθέστε ένα κατοικίδιο</Typography>
              <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                Για να αναζητήσετε κτηνίατρο, προσθέστε πρώτα το κατοικίδιό σας ώστε να γνωρίζουμε για ποιον κάνουμε κράτηση.
              </Typography>
              <Button variant="contained" size="large" onClick={() => navigate('/owner/pets')} sx={{ px: 4, borderRadius: 3 }}>Μετάβαση στα Κατοικίδια</Button>
            </Paper>
          </Container>
        </Box>
      </ThemeProvider>
    );
  }

  // --- SUB-COMPONENTS ---

  const StepVetList = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
          <TextField 
            placeholder="Αναζήτηση κτηνιάτρου..." 
            size="small"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            sx={{ flex: 1, minWidth: 240, maxWidth: 320, bgcolor: 'white', borderRadius: 2, boxShadow: '0 6px 18px rgba(15,23,42,0.06)' }}
          />
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            Αποτελέσματα
            <Chip label={filteredVets.length} size="small" color="primary" variant="outlined" />
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" endIcon={<FilterListIcon />} size="small" sx={{ color: '#333', borderColor: '#ccc', borderRadius: 2, '&:hover': { borderColor: '#00695c', color: '#00695c' } }}>Filter</Button>
              <Box sx={{ border: '1px solid #ccc', borderRadius: 2, display: 'flex', overflow: 'hidden' }}>
                  <IconButton size="small" sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}><ViewListIcon /></IconButton>
                  <IconButton size="small" sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}><GridViewIcon /></IconButton>
              </Box>
          </Box>
      </Box>
      {displayedVets.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#f5f5f5' }}>
          <Typography variant="body1" color="text.secondary">
            Δεν βρέθηκαν κτηνίατροι που ταιριάζουν με την αναζήτησή σας.
          </Typography>
        </Paper>
      ) : (
        displayedVets.map(vet => (
          <Paper 
            key={vet.id} 
            elevation={selectedVet?.id === vet.id ? 8 : 1} 
            onClick={() => setSelectedVet(vet)}
            sx={{ 
                position: 'relative',
                p: 2.5, mb: 3, border: selectedVet?.id === vet.id ? '2px solid #00695c' : '1px solid #eee', 
                borderRadius: '14px', display: 'flex', gap: 3, cursor: 'pointer',
                bgcolor: selectedVet?.id === vet.id ? '#e0f2f1' : 'white',
                transition: 'all 0.25s ease',
                '&:hover': { borderColor: '#00695c', transform: 'translateY(-6px) scale(1.01)', boxShadow: '0 14px 32px rgba(0,0,0,0.1)' },
                '&::after': {
                  content: '""', position: 'absolute', inset: 0, borderRadius: '14px', pointerEvents: 'none',
                  background: 'linear-gradient(120deg, rgba(0,105,92,0.08), rgba(255,167,38,0.06))', opacity: 0, transition: 'opacity 0.25s ease'
                },
                '&:hover::after': { opacity: 1 }
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
        ))
      )}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><Pagination count={pageCount} page={page} onChange={handlePageChange} color="primary" shape="rounded" /></Box>
    </Box>
  );

  const StepCalendar = () => (
    <Box sx={{ maxWidth: '1100px', mx: 'auto' }}>
      <Typography variant="h5" fontWeight="bold" align="center" gutterBottom sx={{ mt: -2 }}>Ώρα και Μέρα</Typography>
      <Divider sx={{ width: 60, height: 4, bgcolor: '#333', mx: 'auto', mb: 4, borderRadius: 2 }} />

      <Paper elevation={0} sx={{ p: 2.5, mb: 4, borderRadius: 3, border: '1px solid #e0e0e0', bgcolor: '#f8fafc', display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Chip label="Βήμα 2" color="primary" variant="outlined" />
        <Typography fontWeight={700}>Διαλέξτε μέρα, πράξη και ώρα</Typography>
        <Typography variant="body2" color="text.secondary">Η επιλογή σας κλειδώνει στο επόμενο βήμα.</Typography>
        <Chip
          label={`${selectedDate || 'Ημερομηνία;'} · ${selectedTime || 'Ώρα;'}`}
          color={(selectedDate && selectedTime) ? 'success' : 'default'}
          sx={{ ml: { xs: 0, md: 'auto' }, fontWeight: 'bold' }}
        />
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          {/** assume current date ~ 6 for highlighting available days; disable past days visually */}
          {/** todayDay used only for UI cue, not real-time logic */}
          {(() => { const todayDay = 6; return null; })()}
          <Paper elevation={0} sx={{ p: 4, border: '1px solid #e0e0e0', borderRadius: '24px', height: '100%', boxShadow: '0 10px 26px rgba(0,0,0,0.04)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
              <IconButton size="small" sx={{ border: '1px solid #eee', bgcolor: 'white' }}><ChevronLeftIcon /></IconButton>
              <Typography variant="h6" fontWeight="bold">Νοέμβριος 2025</Typography>
              <IconButton size="small" sx={{ border: '1px solid #eee', bgcolor: 'white' }}><ChevronRightIcon /></IconButton>
            </Box>

            <Grid container spacing={2}>
              {['Κυ','Δε','Τρ','Τε','Πε','Πα','Σα'].map(d => (
                <Grid item xs={1.7} key={d} sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="bold">{d}</Typography>
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              {[...Array(30)].map((_, i) => {
                const day = i + 1;
                const todayDay = 6;
                const isDisabled = day < todayDay;
                const isSelected = selectedDate === `Noe ${day}`;
                return (
                  <Grid item xs={1.7} key={i}>
                    <Tooltip title={isDisabled ? 'Μη διαθέσιμη ημέρα' : ''} disableHoverListener={!isDisabled}>
                      <Box
                        onClick={() => !isDisabled && setSelectedDate(`Noe ${day}`)}
                        sx={{
                          width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto',
                          borderRadius: '50%', cursor: isDisabled ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease',
                          bgcolor: isSelected ? '#00695c' : 'transparent',
                          color: isDisabled ? '#cbd5e1' : (isSelected ? 'white' : '#111'),
                          fontWeight: isSelected ? 'bold' : 'normal',
                          border: isSelected ? 'none' : '1px solid #eceff1',
                          opacity: isDisabled ? 0.5 : 1,
                          '&:hover': { bgcolor: isDisabled ? 'transparent' : (isSelected ? '#00695c' : '#f5f5f5'), transform: isDisabled ? 'none' : 'translateY(-2px)' }
                        }}
                      >{day}</Box>
                    </Tooltip>
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 4, border: '1px solid #e0e0e0', borderRadius: '24px', height: '100%', display: 'flex', flexDirection: 'column', gap: 3, boxShadow: '0 10px 26px rgba(0,0,0,0.04)' }}>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>Επιλογή Πράξης</Typography>
              <FormControl component="fieldset">
                <RadioGroup defaultValue="medical">
                  <FormControlLabel value="exam" control={<Radio color="primary" />} label="Καταγραφή Ζώου" />
                  <FormControlLabel value="medical" control={<Radio color="primary" />} label="Ιατρική πράξη" />
                </RadioGroup>
              </FormControl>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}><AccessTimeIcon fontSize="small"/> Διαθέσιμες Ώρες</Typography>
              <Grid container spacing={1.5}>
                {TIME_SLOTS.map((time) => {
                  const picked = selectedTime === time;
                  return (
                    <Grid item xs={4} key={time}>
                      <Button
                        fullWidth
                        variant={picked ? 'contained' : 'outlined'}
                        color={picked ? 'success' : 'primary'}
                        onClick={() => setSelectedTime(time)}
                        sx={{
                          borderRadius: 6,
                          fontWeight: 'bold',
                          bgcolor: picked ? '#00695c' : 'white',
                          color: picked ? 'white' : '#111',
                          borderColor: picked ? '#00695c' : '#e0e0e0',
                          boxShadow: picked ? '0 10px 22px rgba(0,105,92,0.25)' : 'none',
                          transition: 'all 0.18s ease',
                          '&:hover': { bgcolor: picked ? '#005448' : '#f6f8fa', transform: 'translateY(-1px)' }
                        }}
                      >
                        {time}
                      </Button>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>

            <Paper elevation={0} sx={{ mt: 'auto', p: 2.5, borderRadius: 2, border: '1px dashed #b0bec5', bgcolor: '#f1f8e9' }}>
              <Typography variant="body2" fontWeight="bold">Σύνοψη επιλογής</Typography>
              <Typography variant="body2" color="text.secondary">{selectedDate || 'Ημερομηνία;'} • {selectedTime || 'Ώρα;'}</Typography>
              {(!selectedDate || !selectedTime) && (
                <Typography variant="caption" color="error.main">Επιλέξτε και ημερομηνία και ώρα για να συνεχίσετε.</Typography>
              )}
            </Paper>
          </Paper>
        </Grid>
      </Grid>
    </Box>
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
          <Typography color="primary" fontWeight="bold">📅 {selectedDate || "Τετάρτη, 20 Νοεμβρίου 2025"} • {selectedTime || "10:00 ΠΜ"}</Typography>
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
      <Box sx={{ minHeight: '100vh', bgcolor: '#fbfbfb', pb: 10, display: 'flex', flexDirection: 'column' }}>
        
        <Container maxWidth="xl" sx={{ pt: 1 }}><PageHeader /></Container>

        <Box sx={{ display: 'flex', flex: 1, maxWidth: '100vw', overflow: 'hidden', p: 2, gap: 2 }}>
          <DashboardSidebar />
          
          <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ 
                height: '300px', position: 'relative', mb: 8,
                backgroundImage: 'url(https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1600&q=80)',
                backgroundSize: 'cover', backgroundPosition: 'center',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'visible'
            }}>
                {/* Gradient Overlay */}
                <Box sx={{ 
                    position: 'absolute', 
                    inset: 0, 
                    background: 'linear-gradient(135deg, rgba(0, 105, 92, 0.85) 0%, rgba(38, 50, 56, 0.75) 100%)',
                    zIndex: 1
                }} />
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', position: 'relative', zIndex: 2 }}>
                    Ραντεβού με Κτηνίατρο
                </Typography>
            
            <Box sx={{ position: 'absolute', bottom: -30, width: '100%', display: 'flex', justifyContent: 'center', zIndex: 3 }}>
                <Paper elevation={3} sx={{ px: 4, py: 1.5, borderRadius: '50px', display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'white' }}>
                    {STEPS.map((label, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ 
                                width: 30, height: 30, borderRadius: '50%', 
                                border: index === activeStep ? '2px solid #3B82F6' : '1px solid #ccc',
                                color: index === activeStep ? '#3B82F6' : (index < activeStep ? '#4CAF50' : '#999'),
                              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem',
                              bgcolor: index === activeStep ? '#E3F2FD' : 'white',
                              animation: index === activeStep ? `${pulseRing} 2.2s ease-in-out infinite` : 'none'
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
            {activeStep === 2 && <StepSelectPet />}
            {activeStep === 3 && <StepPreview />}

            {/* NAVIGATION BUTTONS */}
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
        </Box>
      </Box>
    </ThemeProvider>
  );
}