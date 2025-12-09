import React from 'react';
import { 
  Box, Container, Grid, Typography, Button, Paper, Avatar, Chip, IconButton, Divider 
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Icons
import PetsIcon from '@mui/icons-material/Pets';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import EventIcon from '@mui/icons-material/Event'; // Αντί για Hourglass
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import InfoIcon from '@mui/icons-material/Info';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WarningIcon from '@mui/icons-material/Warning'; // Για τη δήλωση
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // Για το εκκρεμή ραντεβού

// Import PageHeader
import PageHeader from './PageHeader';

const theme = createTheme({
  palette: {
    primary: { main: '#333' }, // Σκούρο γκρι/μαύρο για κείμενα/κουμπιά
    secondary: { main: '#FFA726' }, // Πορτοκαλί
    error: { main: '#E53935' }, // Κόκκινο
    success: { main: '#2E7D32' }, // Πράσινο
    background: { default: '#f9f9f9' }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    button: { textTransform: 'none', fontWeight: 600 },
    h6: { fontWeight: 700 }
  },
  shape: { borderRadius: 8 }
});

// --- MOCK DATA ---
const MY_PETS = [
  {
    id: 1, name: 'Kouvelaj', breed: 'Golden Retriever', gender: 'male', age: '5 χρόνων', weight: '32 kg',
    img: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2, name: 'Pantiana', breed: 'Περσική Γάτα', gender: 'female', age: '3 χρόνων', weight: '4 kg',
    img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
  }
];

const APPOINTMENTS = [
  { id: 1, date: 'Τρίτη, 17 Νοεμβρίου 2025 • 10:00', doctor: 'Δρ. Νίκος Παπαδόπουλος', details: 'Kouvelaj - Εμβολιασμός Λύσσας', location: 'Αθήνα, Κέντρο - Ακαδημίας 23', phone: '+30 210 1234567' },
  { id: 2, date: 'Παρασκευή, 18 Νοεμβρίου 2025 • 14:30', doctor: 'Δρ. Μαρία Κωνσταντίνου', details: 'Pantiana - Ετήσια Εξέταση', location: 'Καλλιθέα - Θησέως 45', phone: '+30 210 7654321' }
];

const CANCELLED = [
  { id: 3, date: 'Τετάρτη, 26 Νοεμβρίου 2025 • 10:00', doctor: 'Δρ. Νίκος Παπαδόπουλος', details: 'Φωτεινή - Εμβολιασμός κατά ασθένειας', location: 'Αθήνα, Κέντρο - Ακαδημίας 23', phone: '+30 210 1234567' }
];

// --- COMPONENTS ---

// 1. STAT CARD (Top Overlap)
const StatCard = ({ title, count, icon }) => (
  <Paper elevation={0} sx={{ 
      p: 2, border: '1px solid #ddd', borderRadius: '8px', bgcolor: 'white', height: '100%',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '100px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
  }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '0.9rem', width: '80%' }}>{title}</Typography>
        <Box sx={{ color: '#555' }}>{icon}</Box>
    </Box>
    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{count}</Typography>
  </Paper>
);

// 2. PET CARD (Left Column)
const PetCard = ({ pet, navigate }) => (
  <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid #ddd', borderRadius: '8px', bgcolor: 'white' }}>
    <Box sx={{ display: 'flex', gap: 2 }}>
        <Avatar src={pet.img} variant="rounded" sx={{ width: 80, height: 80 }} />
        <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" fontWeight="bold">{pet.name}</Typography>
                {pet.gender === 'male' ? <MaleIcon fontSize="small" sx={{ color: '#FF9800' }}/> : <FemaleIcon fontSize="small" sx={{ color: '#FF9800' }}/>}
            </Box>
            <Typography variant="caption" display="block" color="text.secondary">🐶 {pet.breed}</Typography>
            <Typography variant="caption" display="block" color="text.secondary">📍 {pet.age}</Typography>
            <Typography variant="caption" display="block" color="text.secondary">⚖️ {pet.weight}</Typography>
        </Box>
    </Box>
    {/* Buttons aligned right */}
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1, mt: 2 }}>
        <Button 
            variant="contained" size="small" startIcon={<MenuBookIcon />} 
            onClick={() => navigate(`/owner/health-book/${pet.id}`)}
            sx={{ bgcolor: '#424242', fontSize: '0.7rem', textTransform: 'none', width: 'fit-content' }}
        >
            Προβολή Βιβλιαρίου Υγείας
        </Button>
        <Button 
            variant="contained" size="small" startIcon={<InfoIcon />} 
            onClick={() => navigate(`/owner/profile`)}
            sx={{ bgcolor: '#424242', fontSize: '0.7rem', textTransform: 'none', width: 'fit-content' }}
        >
            Προβολή Στοιχείων
        </Button>
    </Box>
  </Paper>
);

// 3. APPOINTMENT CARD (Right Column)
const AppointmentCard = ({ type, date, doctor, details, location, phone }) => (
  <Paper elevation={0} sx={{ 
      p: 2, mb: 2, border: '1px solid #ddd', borderRadius: '8px', bgcolor: 'white', 
      borderLeft: type === 'cancelled' ? 'none' : '4px solid #4CAF50' 
  }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="caption" sx={{ 
            bgcolor: type === 'upcoming' ? '#E8F5E9' : '#FFEBEE', 
            color: type === 'upcoming' ? '#2E7D32' : '#C62828', 
            px: 1, borderRadius: 1, fontWeight: 'bold' 
        }}>
            {type === 'upcoming' ? 'Επιβεβαιωμένο' : 'Ακυρωμένο'}
        </Typography>
    </Box>
    <Typography variant="subtitle1" fontWeight="bold" sx={{ textDecoration: type === 'cancelled' ? 'line-through' : 'none' }}>{date}</Typography>
    <Box sx={{ mt: 1 }}>
        <Typography variant="caption" display="block" fontWeight="bold">🏆 {doctor}</Typography>
        <Typography variant="caption" display="block" color="text.secondary">🐕 {details}</Typography>
        {location && <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}><LocationOnIcon fontSize="inherit" sx={{ verticalAlign: 'middle' }} /> {location}</Typography>}
        {phone && <Typography variant="caption" display="block" color="text.secondary"><PhoneIcon fontSize="inherit" sx={{ verticalAlign: 'middle' }} /> {phone}</Typography>}
    </Box>
    
    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        <Button size="small" variant="contained" sx={{ bgcolor: '#e0e0e0', color: '#333', fontSize: '0.7rem', boxShadow: 'none' }}>Λεπτομέρειες</Button>
        {type === 'upcoming' && (
            <Button size="small" variant="contained" color="error" sx={{ fontSize: '0.7rem', boxShadow: 'none' }}>Ακύρωση</Button>
        )}
    </Box>
  </Paper>
);

// 4. CALENDAR
const CalendarWidget = () => (
  <Paper elevation={0} sx={{ p: 2, border: '1px solid #ddd', borderRadius: '16px', bgcolor: 'white', mt: 4 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 2 }}>
        <IconButton size="small"><ChevronLeftIcon /></IconButton>
        <Typography variant="subtitle1" fontWeight="bold">Νοέμβριος 2025</Typography>
        <IconButton size="small"><ChevronRightIcon /></IconButton>
    </Box>
    <Grid container spacing={1} sx={{ textAlign: 'center' }}>
        {['ΔΕ', 'ΤΡ', 'ΤΕ', 'ΠΕ', 'ΠΑ', 'ΣΑ', 'ΚΥ'].map(d => (<Grid item xs={1.7} key={d}><Typography variant="caption" color="text.secondary" fontSize="0.7rem">{d}</Typography></Grid>))}
        {[...Array(30)].map((_, i) => {
            const day = i + 1;
            const isToday = day === 17;
            const isSelected = day === 18;
            const isOrange = day === 26 || day === 28;
            
            let bg = 'transparent';
            let color = 'inherit';
            if (isToday) { bg = '#00E676'; color = 'white'; }
            else if (isSelected) { bg = '#00E676'; color = 'white'; }
            else if (isOrange) { bg = '#FFA726'; color = 'white'; }
            else if (day === 24) { bg = '#FF5252'; color = 'white'; }

            return (<Grid item xs={1.7} key={day}><Box sx={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 'auto', bgcolor: bg, color: color, borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>{day}</Box></Grid>)
        })}
    </Grid>
  </Paper>
);

export default function MyPets() {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f9f9f9', pb: 8 }}>
        
        <Container maxWidth="xl" sx={{ pt: 1 }}>
            <PageHeader />
        </Container>

        {/* HERO IMAGE with CURVE */}
        <Box sx={{ 
            position: 'relative', height: '350px', mb: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80)',
            backgroundSize: 'cover', backgroundPosition: 'center',
            borderBottomLeftRadius: '50% 20%', borderBottomRightRadius: '50% 20%',
            overflow: 'hidden'
        }}>
            <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', pb: 5 }}>
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>Κατοικίδια</Typography>
            </Box>
        </Box>

        <Container maxWidth="xl">
            
            {/* 1. TOP STATS (Overlapping Hero) */}
            <Grid container spacing={2} sx={{ mb: 6, mt: -10, position: 'relative', zIndex: 2 }}>
                <Grid item xs={12} sm={6} md={3}><StatCard title="Τα Κατοικίδιά Μου" count="2" icon={<PetsIcon />} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard title="Προσεχείς Εμβολιασμοί" count="1" icon={<MedicalServicesIcon />} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard title="Εκκρεμή Ραντεβού" count="3" icon={<AccessTimeIcon />} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard title="Ολοκληρωμένα Ραντεβού" count="5" icon={<CheckCircleIcon />} /></Grid>
            </Grid>

            {/* 2. QUICK ACTIONS */}
            <Typography variant="h6" sx={{ mb: 2 }}>Γρήγορες Ενέργειες</Typography>
            <Grid container spacing={3} sx={{ mb: 6 }}>
                <Grid item xs={12} sm={4}>
                    <Paper elevation={0} onClick={() => navigate('/owner/search')} sx={{ p: 3, border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', height: '100%', display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'white', '&:hover': { borderColor: '#999' } }}>
                        <SearchIcon fontSize="large" sx={{ color: '#555' }} />
                        <Typography variant="subtitle1" fontWeight="bold">Βρες Κτηνίατρο</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Paper elevation={0} onClick={() => navigate('/lost-pets')} sx={{ p: 3, border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', height: '100%', display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'white', '&:hover': { borderColor: '#999' } }}>
                        <SearchIcon fontSize="large" sx={{ color: '#555' }} />
                        <Typography variant="subtitle1" fontWeight="bold">Εύρεση Ζώου</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid #ddd', borderRadius: '8px', bgcolor: 'white', height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <WarningIcon fontSize="large" sx={{ color: '#757575' }} />
                            <Typography variant="subtitle1" fontWeight="bold">Δήλωση Απώλειας</Typography>
                        </Box>
                        <Button variant="contained" color="secondary" fullWidth onClick={() => navigate('/lost-pets')} sx={{ mt: 'auto', fontWeight: 'bold', color: '#333', borderRadius: '4px' }}>
                            Προχώρησε δήλωσης
                        </Button>
                    </Paper>
                </Grid>
            </Grid>

            {/* 3. MAIN GRID */}
            <Grid container spacing={6}>
                
                {/* LEFT: PETS */}
                <Grid item xs={12} md={7}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Typography variant="h6">Τα Κατοικίδιά Μου</Typography>
                        <IconButton size="small"><ArrowForwardIcon /></IconButton>
                    </Box>
                    {MY_PETS.map(pet => <PetCard key={pet.id} pet={pet} navigate={navigate} />)}
                    
                    <Button variant="contained" sx={{ bgcolor: '#333', borderRadius: '20px', mt: 1, textTransform: 'none' }}>
                        Όλα τα κατοικίδια →
                    </Button>
                </Grid>

                {/* RIGHT: APPOINTMENTS */}
                <Grid item xs={12} md={5}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <Typography variant="h6">Επερχόμενα Ραντεβού</Typography>
                        <Chip label="2" size="small" sx={{ fontWeight: 'bold', bgcolor: '#e0e0e0' }} />
                    </Box>
                    {APPOINTMENTS.map(app => <AppointmentCard key={app.id} type={app.type} {...app} />)}

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, mt: 5 }}>
                        <Typography variant="h6">Ακυρωμένα</Typography>
                        <Chip label="1" size="small" sx={{ fontWeight: 'bold', bgcolor: '#e0e0e0' }} />
                    </Box>
                    {CANCELLED.map(app => <AppointmentCard key={app.id} type={app.type} {...app} />)}

                    <CalendarWidget />
                </Grid>

            </Grid>

        </Container>
      </Box>
    </ThemeProvider>
  );
}