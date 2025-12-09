import React, { useState } from 'react';
import { 
  Box, Container, Typography, Paper, Chip, Tabs, Tab, List, ListItem, 
  ListItemIcon, ListItemText, Divider, Button 
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Icons
import HistoryIcon from '@mui/icons-material/History';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import VaccinesIcon from '@mui/icons-material/Vaccines';

// Import PageHeader
import PageHeader from './PageHeader';

// --- THEME ---
const theme = createTheme({
  palette: {
    primary: { main: '#00695c' },
    secondary: { main: '#FFA726' },
    background: { default: '#f9f9f9' }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    button: { textTransform: 'none', fontWeight: 600 },
    h5: { fontWeight: 700 }
  },
  shape: { borderRadius: 12 },
  components: {
    MuiPaper: { styleOverrides: { root: { boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #eee' } } }
  }
});

// --- MOCK DATA ---
const HISTORY_DATA = {
  appointments: [
    { id: 1, date: '15 Οκτ 2024', title: 'Ετήσιος Εμβολιασμός', vet: 'Δρ. Νίκος Παπαδόπουλος', pet: 'Kouvelaj', status: 'completed' },
    { id: 2, date: '02 Σεπ 2024', title: 'Δερματολογικός Έλεγχος', vet: 'Δρ. Μαρία Κωνσταντίνου', pet: 'Pantiana', status: 'completed' },
    { id: 3, date: '10 Αυγ 2024', title: 'Έκτακτο Περιστατικό', vet: 'Δρ. Νίκος Παπαδόπουλος', pet: 'Kouvelaj', status: 'cancelled' }
  ],
  medical: [
    { id: 1, date: '15 Οκτ 2024', title: 'Εμβόλιο Λύσσας', type: 'Vaccine', pet: 'Kouvelaj', notes: 'Επόμενη δόση σε 1 χρόνο' },
    { id: 2, date: '15 Οκτ 2024', title: 'Αποπαρασίτωση', type: 'Medicine', pet: 'Kouvelaj', notes: 'Drontal' },
    { id: 3, date: '01 Ιουν 2024', title: 'Στείρωση', type: 'Surgery', pet: 'Pantiana', notes: 'Επιτυχής επέμβαση' }
  ],
  declarations: [
    { id: 1, date: '20 Ιουλ 2024', title: 'Δήλωση Απώλειας', pet: 'Pantiana', status: 'resolved', notes: 'Βρέθηκε μετά από 2 μέρες' }
  ]
};

// --- SUB-COMPONENTS ---

// 1. History Item Row
const HistoryItem = ({ icon, title, subtitle, date, status, statusLabel, onClick }) => (
  <Paper sx={{ mb: 2, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: '0.2s', '&:hover': { bgcolor: '#f5f5f5' } }} onClick={onClick}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ p: 1.5, bgcolor: '#e0f2f1', color: '#00695c', borderRadius: '50%' }}>
            {icon}
        </Box>
        <Box>
            <Typography variant="subtitle1" fontWeight="bold">{title}</Typography>
            <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'block', sm: 'none' }, mt: 0.5 }}>{date}</Typography>
        </Box>
    </Box>
    
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <Typography variant="body2" color="text.secondary" fontWeight="500" sx={{ display: { xs: 'none', sm: 'block' } }}>
            {date}
        </Typography>
        
        {status && (
            <Chip 
                label={statusLabel} 
                size="small" 
                sx={{ 
                    bgcolor: status === 'completed' || status === 'resolved' ? '#E8F5E9' : '#FFEBEE', 
                    color: status === 'completed' || status === 'resolved' ? '#2E7D32' : '#C62828', 
                    fontWeight: 'bold', width: 100
                }} 
            />
        )}
        <ArrowForwardIosIcon fontSize="small" sx={{ color: '#ccc' }} />
    </Box>
  </Paper>
);

export default function History() {
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f9f9f9', pb: 8 }}>
        
        <Container maxWidth="xl" sx={{ pt: 2 }}>
            <PageHeader />
        </Container>

        {/* HERO HEADER */}
        <Box sx={{ bgcolor: '#263238', py: 6, mb: 4, color: 'white', textAlign: 'center' }}>
            <Container maxWidth="md">
                <HistoryIcon sx={{ fontSize: 60, mb: 2, opacity: 0.8 }} />
                <Typography variant="h4" fontWeight="bold">Ιστορικό & Αρχείο</Typography>
                <Typography variant="body1" sx={{ opacity: 0.8, mt: 1 }}>
                    Δείτε αναλυτικά όλες τις προηγούμενες ενέργειες, ραντεβού και ιατρικές πράξεις.
                </Typography>
            </Container>
        </Box>

        <Container maxWidth="lg">
            
            {/* TABS */}
            <Paper sx={{ mb: 4, borderRadius: '12px', overflow: 'hidden' }}>
                <Tabs 
                    value={tabValue} 
                    onChange={handleTabChange} 
                    variant="fullWidth"
                    textColor="primary"
                    indicatorColor="primary"
                    sx={{ '& .MuiTab-root': { fontWeight: 'bold', py: 2 } }}
                >
                    <Tab icon={<EventAvailableIcon />} iconPosition="start" label="Ραντεβού" />
                    <Tab icon={<MedicalServicesIcon />} iconPosition="start" label="Ιατρικό Ιστορικό" />
                    <Tab icon={<WarningIcon />} iconPosition="start" label="Δηλώσεις" />
                </Tabs>
            </Paper>

            {/* CONTENT - TAB 0: APPOINTMENTS */}
            {tabValue === 0 && (
                <Box>
                    <Typography variant="h6" sx={{ mb: 2 }}>Ολοκληρωμένα & Ακυρωμένα Ραντεβού</Typography>
                    {HISTORY_DATA.appointments.map((item) => (
                        <HistoryItem 
                            key={item.id}
                            icon={item.status === 'completed' ? <CheckCircleIcon /> : <CancelIcon />}
                            title={item.title}
                            subtitle={`${item.vet} • ${item.pet}`}
                            date={item.date}
                            status={item.status}
                            statusLabel={item.status === 'completed' ? 'Ολοκληρώθηκε' : 'Ακυρώθηκε'}
                        />
                    ))}
                </Box>
            )}

            {/* CONTENT - TAB 1: MEDICAL */}
            {tabValue === 1 && (
                <Box>
                    <Typography variant="h6" sx={{ mb: 2 }}>Ιατρικό Αρχείο & Εμβόλια</Typography>
                    {HISTORY_DATA.medical.map((item) => (
                        <HistoryItem 
                            key={item.id}
                            icon={<VaccinesIcon />}
                            title={item.title}
                            subtitle={`${item.pet} • ${item.notes}`}
                            date={item.date}
                            status="completed" // Reuse styling
                            statusLabel={item.type}
                        />
                    ))}
                </Box>
            )}

            {/* CONTENT - TAB 2: DECLARATIONS */}
            {tabValue === 2 && (
                <Box>
                    <Typography variant="h6" sx={{ mb: 2 }}>Ιστορικό Δηλώσεων (Απώλεια / Εύρεση)</Typography>
                    {HISTORY_DATA.declarations.length > 0 ? (
                        HISTORY_DATA.declarations.map((item) => (
                            <HistoryItem 
                                key={item.id}
                                icon={<WarningIcon />}
                                title={item.title}
                                subtitle={`${item.pet} • ${item.notes}`}
                                date={item.date}
                                status={item.status}
                                statusLabel="Βρέθηκε"
                            />
                        ))
                    ) : (
                        <Typography color="text.secondary" align="center" sx={{ py: 4 }}>Δεν υπάρχουν καταχωρημένες δηλώσεις.</Typography>
                    )}
                </Box>
            )}

        </Container>
      </Box>
    </ThemeProvider>
  );
}