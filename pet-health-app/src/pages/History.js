import React, { useState } from 'react';
import { 
  Box, Container, Typography, Paper, Chip, Tabs, Tab, List, ListItem, 
  ListItemIcon, ListItemText, Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, IconButton 
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';

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
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';

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
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (content) => {
    setDialogContent(content);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogContent(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f9f9f9', pb: 8, display: 'flex', flexDirection: 'column' }}>
        
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

        {/* Main Layout with Sidebar */}
        <Box sx={{ display: 'flex', flex: 1, maxWidth: '100vw', overflow: 'hidden', p: 2, gap: 2 }}>
            {/* Sidebar */}
            <DashboardSidebar />

            {/* Content */}
            <Container maxWidth="lg" sx={{ overflowY: 'auto', py: 4 }}>
            
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
                            onClick={() => handleOpenDialog({
                                type: 'appointment',
                                data: item,
                                details: {
                                    clinic: 'Κτηνιατρική Κλινική Αθηνών',
                                    address: 'Λεωφ. Κηφισίας 123, Αθήνα',
                                    phone: '210 1234567',
                                    duration: '45 λεπτά',
                                    cost: '€65',
                                    payment: item.status === 'completed' ? 'Πληρώθηκε - Κάρτα' : 'Δεν χρεώθηκε',
                                    notes: item.status === 'completed' 
                                        ? 'Το ραντεβού ολοκληρώθηκε επιτυχώς. Το ζώο εξετάστηκε και δεν διαπιστώθηκαν προβλήματα υγείας. Συνιστάται επανεξέταση σε 6 μήνες.'
                                        : 'Το ραντεβού ακυρώθηκε από τον ιδιοκτήτη 2 ώρες πριν την προγραμματισμένη ώρα. Δεν επιβλήθηκε χρέωση ακύρωσης.',
                                    prescription: item.status === 'completed' ? 'Συνταγή: Antibiotica 250mg - 2x ημερησίως για 7 ημέρες' : null
                                }
                            })}
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
                            onClick={() => handleOpenDialog({
                                type: 'medical',
                                data: item,
                                details: {
                                    vet: 'Δρ. Νίκος Παπαδόπουλος',
                                    clinic: 'Κτηνιατρική Κλινική Αθηνών',
                                    weight: '28.5 kg',
                                    temperature: '38.5°C',
                                    diagnosis: item.type === 'Vaccine' 
                                        ? 'Προληπτικός εμβολιασμός κατά της λύσσας. Το ζώο είναι υγιές και κατάλληλο για εμβολιασμό.'
                                        : item.type === 'Surgery'
                                        ? 'Χειρουργική στείρωση. Η επέμβαση διήρκεσε 45 λεπτά και ολοκληρώθηκε χωρίς επιπλοκές.'
                                        : 'Χορήγηση φαρμάκου για την αποπαρασίτωση του ζώου.',
                                    treatment: item.type === 'Vaccine'
                                        ? 'Εμβόλιο Nobivac Rabies - Αριθμός παρτίδας: RB-2024-10-453'
                                        : item.type === 'Surgery'
                                        ? 'Χρήση γενικής αναισθησίας. Αντιβιοτική κάλυψη για 7 ημέρες. Αφαίρεση ραμμάτων σε 10 ημέρες.'
                                        : 'Drontal Plus - 1 δισκίο κάθε 3 μήνες',
                                    nextVisit: item.type === 'Vaccine'
                                        ? '15 Οκτ 2025 - Ετήσιος ενισχυτικός εμβολιασμός'
                                        : item.type === 'Surgery'
                                        ? '11 Ιουν 2024 - Έλεγχος πληγής και αφαίρεση ραμμάτων'
                                        : '15 Ιαν 2025 - Επόμενη αποπαρασίτωση',
                                    cost: item.type === 'Vaccine' ? '€35' : item.type === 'Surgery' ? '€250' : '€15',
                                    insurance: item.type === 'Surgery' ? 'Κάλυψη 70% από ασφάλεια' : 'Μη καλυπτόμενο'
                                }
                            })}
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
                                onClick={() => handleOpenDialog({
                                    type: 'declaration',
                                    data: item,
                                    details: {
                                        reportedLocation: 'Πάρκο Αγίου Δημητρίου, Αθήνα',
                                        reportedTime: '14:30',
                                        foundLocation: 'Κεντρική Πλατεία Γλυφάδας',
                                        foundTime: '22 Ιουλ 2024, 09:15',
                                        foundBy: 'Μαρία Γεωργίου - Τηλ: 6987654321',
                                        microchip: 'GR-2020-003456',
                                        condition: 'Το ζώο βρέθηκε σε καλή κατάσταση, ελαφρώς αφυδατωμένο',
                                        actions: 'Ενημερώθηκε η αστυνομία και το δημοτικό καταφύγιο. Το ζώο επέστρεψε στον ιδιοκτήτη μετά από επιβεβαίωση μικροτσίπ.',
                                        officer: 'Υπαξ. Κώστας Παπαδάκης - ΑΤ Γλυφάδας',
                                        caseNumber: 'LP-2024-07-1523'
                                    }
                                })}
                            />
                        ))
                    ) : (
                        <Typography color="text.secondary" align="center" sx={{ py: 4 }}>Δεν υπάρχουν καταχωρημένες δηλώσεις.</Typography>
                    )}
                </Box>
            )}

            </Container>
        </Box>

        {/* Info Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: '16px' }
          }}
        >
          {dialogContent && (
            <>
              <DialogTitle sx={{ 
                bgcolor: dialogContent.type === 'appointment' ? '#00695c' : dialogContent.type === 'medical' ? '#1976d2' : '#f57c00',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Typography variant="h6" fontWeight="bold">{dialogContent.data.title}</Typography>
                <IconButton onClick={handleCloseDialog} sx={{ color: 'white' }}>
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent sx={{ pt: 3 }}>
                <Grid container spacing={3}>
                  {/* Common Info */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary" fontWeight="bold">ΗΜΕΡΟΜΗΝΙΑ</Typography>
                    <Typography variant="body1" fontWeight="bold">{dialogContent.data.date}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary" fontWeight="bold">ΚΑΤΟΙΚΙΔΙΟ</Typography>
                    <Typography variant="body1" fontWeight="bold">{dialogContent.data.pet}</Typography>
                  </Grid>

                  {/* Appointment Details */}
                  {dialogContent.type === 'appointment' && (
                    <>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">ΚΤΗΝΙΑΤΡΟΣ</Typography>
                        <Typography variant="body1">{dialogContent.data.vet}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">ΚΛΙΝΙΚΗ</Typography>
                        <Typography variant="body2">{dialogContent.details.clinic}</Typography>
                        <Typography variant="caption" color="text.secondary">{dialogContent.details.address}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">ΕΠΙΚΟΙΝΩΝΙΑ</Typography>
                        <Typography variant="body2">{dialogContent.details.phone}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">ΔΙΑΡΚΕΙΑ</Typography>
                        <Typography variant="body2">{dialogContent.details.duration}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">ΚΟΣΤΟΣ</Typography>
                        <Typography variant="body2" fontWeight="bold" color="primary">{dialogContent.details.cost}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">ΠΛΗΡΩΜΗ</Typography>
                        <Typography variant="body2">{dialogContent.details.payment}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">ΚΑΤΑΣΤΑΣΗ</Typography>
                        <Chip 
                          label={dialogContent.data.status === 'completed' ? 'Ολοκληρώθηκε' : 'Ακυρώθηκε'} 
                          color={dialogContent.data.status === 'completed' ? 'success' : 'error'} 
                          sx={{ mt: 1 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                          <Typography variant="caption" color="text.secondary" fontWeight="bold">ΣΗΜΕΙΩΣΕΙΣ</Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>{dialogContent.details.notes}</Typography>
                        </Paper>
                      </Grid>
                      {dialogContent.details.prescription && (
                        <Grid item xs={12}>
                          <Paper elevation={0} sx={{ p: 2, bgcolor: '#e3f2fd', border: '1px solid #2196f3', borderRadius: 2 }}>
                            <Typography variant="caption" color="primary" fontWeight="bold">ΣΥΝΤΑΓΗ</Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>{dialogContent.details.prescription}</Typography>
                          </Paper>
                        </Grid>
                      )}
                    </>
                  )}

                  {/* Medical Details */}
                  {dialogContent.type === 'medical' && (
                    <>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">ΤΥΠΟΣ ΠΡΑΞΗΣ</Typography>
                        <Chip label={dialogContent.data.type} color="primary" sx={{ mt: 0.5 }} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">ΚΤΗΝΙΑΤΡΟΣ</Typography>
                        <Typography variant="body1">{dialogContent.details.vet}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">ΚΛΙΝΙΚΗ</Typography>
                        <Typography variant="body1">{dialogContent.details.clinic}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">ΒΑΡΟΣ</Typography>
                        <Typography variant="body2" fontWeight="bold">{dialogContent.details.weight}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">ΘΕΡΜΟΚΡΑΣΙΑ</Typography>
                        <Typography variant="body2" fontWeight="bold">{dialogContent.details.temperature}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">ΚΟΣΤΟΣ</Typography>
                        <Typography variant="body2" fontWeight="bold" color="primary">{dialogContent.details.cost}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">ΑΣΦΑΛΕΙΑ</Typography>
                        <Typography variant="body2">{dialogContent.details.insurance}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Paper elevation={0} sx={{ p: 2, bgcolor: '#fff3e0', borderRadius: 2 }}>
                          <Typography variant="caption" color="text.secondary" fontWeight="bold">ΔΙΑΓΝΩΣΗ</Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>{dialogContent.details.diagnosis}</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12}>
                        <Paper elevation={0} sx={{ p: 2, bgcolor: '#e8f5e9', borderRadius: 2 }}>
                          <Typography variant="caption" color="text.secondary" fontWeight="bold">ΘΕΡΑΠΕΙΑ / ΦΑΡΜΑΚΑ</Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>{dialogContent.details.treatment}</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12}>
                        <Paper elevation={0} sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
                          <Typography variant="caption" color="primary" fontWeight="bold">ΕΠΟΜΕΝΗ ΕΠΙΣΚΕΨΗ</Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>{dialogContent.details.nextVisit}</Typography>
                        </Paper>
                      </Grid>
                    </>
                  )}

                  {/* Declaration Details */}
                  {dialogContent.type === 'declaration' && (
                    <>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">ΚΑΤΑΣΤΑΣΗ</Typography>
                        <Chip label="Βρέθηκε" color="success" sx={{ mt: 0.5 }} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">ΤΟΠΟΣ ΑΠΩΛΕΙΑΣ</Typography>
                        <Typography variant="body2">{dialogContent.details.reportedLocation}</Typography>
                        <Typography variant="caption" color="text.secondary">Ώρα: {dialogContent.details.reportedTime}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">ΤΟΠΟΣ ΕΥΡΕΣΗΣ</Typography>
                        <Typography variant="body2">{dialogContent.details.foundLocation}</Typography>
                        <Typography variant="caption" color="text.secondary">{dialogContent.details.foundTime}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">ΒΡΕΘΗΚΕ ΑΠΟ</Typography>
                        <Typography variant="body2">{dialogContent.details.foundBy}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">ΜΙΚΡΟΤΣΙΠ</Typography>
                        <Typography variant="body2" fontFamily="monospace" sx={{ bgcolor: '#f5f5f5', p: 1, borderRadius: 1, display: 'inline-block' }}>{dialogContent.details.microchip}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">ΑΡΙΘΜΟΣ ΥΠΟΘΕΣΗΣ</Typography>
                        <Typography variant="body2" fontFamily="monospace" sx={{ bgcolor: '#f5f5f5', p: 1, borderRadius: 1, display: 'inline-block' }}>{dialogContent.details.caseNumber}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Paper elevation={0} sx={{ p: 2, bgcolor: '#fff3e0', borderRadius: 2 }}>
                          <Typography variant="caption" color="text.secondary" fontWeight="bold">ΚΑΤΑΣΤΑΣΗ ΖΩΟΥ</Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>{dialogContent.details.condition}</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12}>
                        <Paper elevation={0} sx={{ p: 2, bgcolor: '#e8f5e9', borderRadius: 2 }}>
                          <Typography variant="caption" color="text.secondary" fontWeight="bold">ΕΝΕΡΓΕΙΕΣ</Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>{dialogContent.details.actions}</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">ΥΠΕΥΘΥΝΟΣ ΑΞΙΩΜΑΤΙΚΟΣ</Typography>
                        <Typography variant="body2">{dialogContent.details.officer}</Typography>
                      </Grid>
                    </>
                  )}
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 2 }}>
                <Button onClick={handleCloseDialog} variant="contained" color="primary">
                  Κλείσιμο
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}