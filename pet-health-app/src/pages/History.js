import React, { useEffect, useState } from 'react';
import { 
  Box, Container, Typography, Paper, Chip, Tabs, Tab, List, ListItem, 
  ListItemIcon, ListItemText, Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, IconButton,
  Rating, TextField, Alert, Snackbar
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import { useAuth } from '../context/AuthContext';

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
import StarIcon from '@mui/icons-material/Star';
import RateReviewIcon from '@mui/icons-material/RateReview';

//Import PageHeader
import PageHeader from './PageHeader';

//--- THEME ---
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
  ],
  reviews: [
    { id: 1, date: '16 Οκτ 2024', vetName: 'Δρ. Νίκος Παπαδόπουλος', clinic: 'Κτηνιατρική Κλινική Αθηνών', rating: 5, service: 'Ετήσιος Εμβολιασμός', comment: 'Εξαιρετικός επαγγελματίας! Πολύ φιλικός και υπομονετικός με το ζωάκι μου. Η εξέταση ήταν ενδελεχής και μου εξήγησε όλα τα βήματα. Σίγουρα θα ξαναπάω!' },
    { id: 2, date: '03 Σεπ 2024', vetName: 'Δρ. Μαρία Κωνσταντίνου', clinic: 'VetCare Γλυφάδας', rating: 4, service: 'Δερματολογικός Έλεγχος', comment: 'Πολύ καλή εξυπηρέτηση και γρήγορη διάγνωση. Η γιατρός ήταν πολύ επαγγελματική. Μόνο το κόστος ήταν λίγο υψηλό αλλά άξιζε την ποιότητα.' },
    { id: 3, date: '15 Ιουν 2024', vetName: 'Δρ. Γιώργος Αντωνίου', clinic: 'Πετ Κλινική Χαλανδρίου', rating: 5, service: 'Χειρουργείο Στείρωσης', comment: 'Άψογη επέμβαση! Το ζώο ανέρρωσε πολύ γρήγορα. Η μετεγχειρητική παρακολούθηση ήταν εξαιρετική. Πολύ ευγενικό προσωπικό και καθαρός χώρος.' },
    { id: 4, date: '10 Μαϊ 2024', vetName: 'Δρ. Ελένη Παπαδάκη', clinic: 'Animal Care Center', rating: 3, service: 'Οδοντιατρική Εξέταση', comment: 'Καλή υπηρεσία αλλά πολύ μεγάλη αναμονή. Ο γιατρός ήταν επαγγελματίας αλλά το προσωπικό στη ρεσεψιόν θα μπορούσε να είναι πιο φιλικό.' }
  ]
};

// --- SUB-COMPONENTS ---

// 1. History Item Row
const HistoryItem = ({ icon, title, subtitle, date, status, statusLabel, onClick, showReviewButton, onReviewClick }) => (
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
    
    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
        {showReviewButton && (
          <Button 
            size="small"
            variant="outlined"
            startIcon={<RateReviewIcon sx={{ display: { xs: 'none', sm: 'block' } }} />}
            onClick={(e) => {
              e.stopPropagation();
              onReviewClick();
            }}
            sx={{ 
              borderColor: '#FFA726',
              color: '#FFA726',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              px: { xs: 1, sm: 2 },
              display: { xs: 'none', md: 'flex' },
              '&:hover': { 
                borderColor: '#FB8C00',
                bgcolor: 'rgba(255, 167, 38, 0.08)'
              }
            }}
          >
            Αξιολόγηση
          </Button>
        )}
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
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [reviewData, setReviewData] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [apptError, setApptError] = useState('');
  const [ownerReviews, setOwnerReviews] = useState([]);
  const [loadingOwnerReviews, setLoadingOwnerReviews] = useState(false);
  const [ownerReviewsError, setOwnerReviewsError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user?.id) return;
      setLoadingAppointments(true);
      setApptError('');
      try {
        const res = await fetch(`http://localhost:3001/appointments?ownerId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          // sort newest first by updatedAt/id
          const sorted = [...(data || [])].sort((a,b) => {
            const ax = typeof a.id === 'number' ? a.id : 0;
            const bx = typeof b.id === 'number' ? b.id : 0;
            const ta = a.updatedAt ? Date.parse(a.updatedAt) : ax;
            const tb = b.updatedAt ? Date.parse(b.updatedAt) : bx;
            return tb - ta;
          });

          // Enrich appointments with resolved pet/vet names when missing
          const petIds = Array.from(new Set(sorted.map(s => s.petId).filter(Boolean)));
          const vetIds = Array.from(new Set(sorted.map(s => s.vetId).filter(Boolean)));

          // fetch pets for the owner and any petIds referenced
          let petMap = {};
          try {
            const petsRes = await fetch(`http://localhost:3001/pets?ownerId=${user.id}`);
            if (petsRes.ok) {
              const pets = await petsRes.json();
              pets.forEach(p => { if (p.id) petMap[String(p.id)] = p.name || p.name || p.id; });
            }
            // also fetch by petId if there are external petIds
            const externalPetIds = petIds.filter(id => !petMap[String(id)]);
            for (const pid of externalPetIds) {
              const pr = await fetch(`http://localhost:3001/pets?id=${encodeURIComponent(pid)}`);
              if (pr.ok) {
                const arr = await pr.json();
                if (Array.isArray(arr) && arr[0]) petMap[String(pid)] = arr[0].name || arr[0].name || String(pid);
              }
            }
          } catch (e) {
            // ignore pet fetch errors
          }

          // fetch vets info
          let vetMap = {};
          try {
            for (const vid of vetIds) {
              const vr = await fetch(`http://localhost:3001/vets?id=${encodeURIComponent(vid)}`);
              if (vr.ok) {
                const arr = await vr.json();
                if (Array.isArray(arr) && arr[0] && arr[0].name) vetMap[String(vid)] = arr[0].name;
              }
              // fallback: try users by userId
              if (!vetMap[String(vid)]) {
                const ur = await fetch(`http://localhost:3001/users?id=${encodeURIComponent(vid)}`);
                if (ur.ok) {
                  const ua = await ur.json();
                  if (Array.isArray(ua) && ua[0] && ua[0].fullname) vetMap[String(vid)] = ua[0].fullname;
                }
              }
            }
          } catch (e) {
            // ignore
          }

          const enriched = sorted.map(s => ({
            ...s,
            petName: s.petName || s.pet || (s.petId ? petMap[String(s.petId)] : s.petName) || '—',
            vetName: s.vetName || s.vet || (s.vetId ? vetMap[String(s.vetId)] : s.vetName) || 'Κτηνίατρος'
          }));

          setAppointments(enriched);
        } else {
          throw new Error(`HTTP ${res.status}`);
        }
      } catch (e) {
        console.error('Error fetching history appointments:', e);
        setApptError('Σφάλμα φόρτωσης ραντεβού ιστορικού. Βεβαιώσου ότι τρέχει το json-server στο 3001.');
        // fallback to mock data on error
        setAppointments(HISTORY_DATA.appointments);
      } finally {
        setLoadingAppointments(false);
      }
    };
    fetchAppointments();
  }, [user]);

  // Fetch owner's reviews for the Reviews tab
  useEffect(() => {
    const fetchOwnerReviews = async () => {
      if (!user?.id) return;
      setLoadingOwnerReviews(true);
      setOwnerReviewsError('');
      try {
        const res = await fetch(`http://localhost:3001/reviews?ownerId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          const sorted = [...(data || [])].sort((a,b) => {
            const ta = a.date ? Date.parse(a.date) : 0;
            const tb = b.date ? Date.parse(b.date) : 0;
            return tb - ta; // newest first
          });
          setOwnerReviews(sorted);
        } else {
          throw new Error(`HTTP ${res.status}`);
        }
      } catch (e) {
        console.error('Error fetching owner reviews:', e);
        setOwnerReviewsError('Σφάλμα φόρτωσης κριτικών. Εμφανίζονται δείγμα δεδομένων.');
        setOwnerReviews(HISTORY_DATA.reviews);
      } finally {
        setLoadingOwnerReviews(false);
      }
    };
    fetchOwnerReviews();
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (content) => {
    // Normalize data fields so dialogs always receive 'pet' and 'vet' strings
    const data = content?.data || {};
    const normalizedData = {
      ...data,
      pet: data.pet || data.petName || data.petId || '—',
      vet: data.vet || data.vetName || data.vetId || 'Κτηνίατρος'
    };
    setDialogContent({ ...content, data: normalizedData });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogContent(null);
  };

  const handleOpenReviewDialog = (appointment) => {
    setReviewData(appointment);
    setReviewRating(0);
    setReviewComment('');
    setOpenReviewDialog(true);
  };

  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
    setReviewData(null);
    setReviewRating(0);
    setReviewComment('');
  };

  const handleSubmitReview = () => {
    if (reviewRating === 0) {
      setSnackbar({ open: true, message: 'Παρακαλώ δώστε βαθμολογία', severity: 'warning' });
      return;
    }
    if (!reviewComment.trim()) {
      setSnackbar({ open: true, message: 'Παρακαλώ γράψτε ένα σχόλιο', severity: 'warning' });
      return;
    }
    // Persist review to JSON Server so vet can see it
    (async () => {
      try {
        // Map appointment vetId to vet userId if needed
        let targetVetId = reviewData?.vetId;
        try {
          if (targetVetId) {
            const mapRes = await fetch(`http://localhost:3001/vets?id=${targetVetId}`);
            if (mapRes.ok) {
              const vets = await mapRes.json();
              if (Array.isArray(vets) && vets[0]?.userId) {
                targetVetId = vets[0].userId;
              }
            }
          }
        } catch {}

        const payload = {
          id: String(Date.now()),
          ownerId: user?.id,
          ownerName: user?.fullname || '—',
          vetId: targetVetId || user?.id, // fallback to current user id if missing
          vetName: reviewData?.vetName || 'Κτηνίατρος',
          clinic: '—',
          appointmentId: reviewData?.id,
          service: reviewData?.reason || reviewData?.type || 'Επίσκεψη',
          rating: reviewRating,
          comment: reviewComment,
          date: new Date().toISOString().slice(0, 10)
        };
        const resp = await fetch('http://localhost:3001/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (resp.ok) {
          setOwnerReviews(prev => [payload, ...prev]);
        }
        setSnackbar({ open: true, message: 'Η κριτική σας καταχωρήθηκε επιτυχώς!', severity: 'success' });
        handleCloseReviewDialog();
      } catch (e) {
        console.error('Error submitting review:', e);
        setSnackbar({ open: true, message: 'Σφάλμα καταχώρισης κριτικής.', severity: 'error' });
      }
    })();
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f9f9f9', pb: 8, display: 'flex', flexDirection: 'column' }}>
        
        <Container maxWidth="xl" sx={{ pt: 2 }}>
            <PageHeader />
        </Container>

        {/*HERO HEADER*/}
        <Box sx={{ 
            position: 'relative',
            py: 6, 
            mb: 4, 
            color: 'white', 
            textAlign: 'center',
            backgroundImage: 'url(https://images.unsplash.com/photo-1581888227599-779811939961?auto=format&fit=crop&w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            overflow: 'hidden'
        }}>
            {/* Gradient Overlay */}
            <Box sx={{ 
                position: 'absolute', 
                inset: 0, 
                background: 'linear-gradient(135deg, rgba(38, 50, 56, 0.9) 0%, rgba(0, 105, 92, 0.85) 100%)',
                zIndex: 1
            }} />
            
            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
                <HistoryIcon sx={{ fontSize: 60, mb: 2, opacity: 0.8 }} />
                <Typography variant="h4" fontWeight="bold">Ιστορικό & Αρχείο</Typography>
                <Typography variant="body1" sx={{ opacity: 0.8, mt: 1 }}>
                    Δείτε αναλυτικά όλες τις προηγούμενες ενέργειες, ραντεβού και ιατρικές πράξεις.
                </Typography>
            </Container>
        </Box>

        {/*MAIN LAYOUT WITH SIDEBAR */}
        <Box sx={{ display: 'flex', flex: 1, maxWidth: '100vw', overflow: 'hidden', p: 2, gap: 2 }}>
            {/*Sidebar */}
            <DashboardSidebar />

            {/*Content*/}
            <Container maxWidth="lg" sx={{ overflowY: 'auto', py: 4 }}>
            
            {/*TABS*/}
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
                    <Tab icon={<RateReviewIcon />} iconPosition="start" label="Κριτικές" />
                </Tabs>
            </Paper>

            {/*TAB 0:APPOINTMENTS */}
            {tabValue === 0 && (
                <Box>
                <Typography variant="h6" sx={{ mb: 1 }}>Όλα τα Ραντεβού</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                  Εμφανίζονται όλα τα ραντεβού (Επερχόμενα, Ολοκληρωμένα, Ακυρωμένα).
                </Typography>
                {apptError && (
                  <Alert severity="warning" sx={{ mb: 2 }}>{apptError}</Alert>
                )}
                {(loadingAppointments ? [] : appointments).map((item) => (
                        <HistoryItem 
                            key={item.id}
                    icon={item.status === 'completed' ? <CheckCircleIcon /> : item.status === 'cancelled' ? <CancelIcon /> : <AccessTimeIcon />}
                    title={item.title || `${item.petName || item.pet} • ${item.vetName || item.vet || 'Κτηνίατρος'}`}
                    subtitle={`${item.vetName || item.vet || '—'} • ${item.petName || item.pet || '—'}`}
                    date={item.date || item.dateISO || '—'}
                    status={item.status}
                    statusLabel={item.status === 'completed' ? 'Ολοκληρωμένο' : item.status === 'cancelled' ? 'Ακυρωμένο' : 'Επιβεβαιωμένο'}
                    showReviewButton={item.status === 'completed'}
                        onReviewClick={() => handleOpenReviewDialog(item)}
                        onClick={() => {
                      // Prefer vet-provided fields (note, diagnosis, treatment); if none are present, show a concise summary instead
                      let notesContent = '';
                      if (item.note && String(item.note).trim()) {
                        notesContent = item.note;
                      } else if ((item.diagnosis && String(item.diagnosis).trim()) || (item.treatment && String(item.treatment).trim())) {
                        const parts = [];
                        if (item.diagnosis) parts.push(`Διάγνωση: ${item.diagnosis}`);
                        if (item.treatment) parts.push(`Θεραπεία: ${item.treatment}`);
                        notesContent = parts.join(' • ');
                      } else if (item.status === 'completed') {
                        notesContent = 'Το ραντεβού ολοκληρώθηκε επιτυχώς. Συνιστάται επανεξέταση αν χρειάζεται.';
                      } else {
                        notesContent = item.cancelledBy === 'vet'
                          ? `Το ραντεβού ακυρώθηκε από τον κτηνίατρο.${item.cancelReason ? ` Λόγος: ${item.cancelReason}` : ''}`
                          : `Το ραντεβού ακυρώθηκε από τον ιδιοκτήτη.${item.cancelReason ? ` Λόγος: ${item.cancelReason}` : ''}`;
                      }

                      handleOpenDialog({
                        type: 'appointment',
                        data: item,
                        details: {
                          clinic: 'Κτηνιατρική Κλινική Αθηνών',
                          address: 'Λεωφ. Κηφισίας 123, Αθήνα',
                          phone: '210 1234567',
                          duration: '45 λεπτά',
                          cost: '€65',
                          payment: item.status === 'completed' ? 'Πληρώθηκε - Κάρτα' : item.status === 'cancelled' ? 'Δεν χρεώθηκε' : '—',
                          notes: notesContent,
                          prescription: item.prescription || (item.status === 'completed' ? (item.diagnosis ? `Διάγνωση: ${item.diagnosis}` : null) : null)
                        }
                      });
                    }}
                        />
                    ))}
                {loadingAppointments && (
                  <Typography color="text.secondary" align="center" sx={{ py: 4 }}>Φόρτωση ραντεβού…</Typography>
                )}
                </Box>
            )}

            {/*TAB 1:MEDICAL*/}
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
                            status="completed" //reuse styling
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

            {/*TAB 3:REVIEWS*/}
            {tabValue === 3 && (
                <Box>
                <Typography variant="h6" sx={{ mb: 1 }}>Οι Κριτικές μου για Κτηνιάτρους</Typography>
                {ownerReviewsError && (
                  <Alert severity="warning" sx={{ mb: 2 }}>{ownerReviewsError}</Alert>
                )}
                {(loadingOwnerReviews ? [] : ownerReviews).length > 0 ? (
                  (loadingOwnerReviews ? [] : ownerReviews).map((item) => (
                            <Paper 
                                key={item.id} 
                                sx={{ 
                                    mb: 2, 
                                    p: 3, 
                                    cursor: 'pointer', 
                                    transition: '0.2s', 
                                    '&:hover': { bgcolor: '#f5f5f5', transform: 'translateY(-2px)', boxShadow: 3 } 
                                }}
                                onClick={() => handleOpenDialog({
                                    type: 'review',
                                    data: item,
                                    details: {
                          clinicAddress: item.clinic || '—',
                                        clinicPhone: '210 1234567',
                                        helpful: Math.floor(Math.random() * 20) + 5,
                                        verified: true
                                    }
                                })}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                            {item.vetName || 'Κτηνίατρος'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {(item.clinic || '—')} • {(item.service || 'Υπηρεσία')}
                          </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {[...Array(5)].map((_, i) => (
                                                <StarIcon 
                                                    key={i} 
                                                    sx={{ 
                                                        fontSize: 20, 
                                  color: i < Number(item.rating) ? '#FFA726' : '#e0e0e0' 
                                                    }} 
                                                />
                                            ))}
                                            <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                              ({Number(item.rating)}/5)
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap', ml: 2 }}>
                          {item.date}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.6 }}>
                                    {item.comment}
                                </Typography>
                            </Paper>
                        ))
                    ) : (
                        <Typography color="text.secondary" align="center" sx={{ py: 4 }}>Δεν έχετε καταχωρήσει κριτικές.</Typography>
                    )}
                </Box>
            )}

            {/*TAB 2:DECLARATIONS*/}
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

        {/*INFO DIALOG*/}
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
                        <Box sx={{ mt: 1 }}>
                          <Chip 
                            label={dialogContent.data.status === 'completed' ? 'Ολοκληρώθηκε' : 'Ακυρώθηκε'} 
                            color={dialogContent.data.status === 'completed' ? 'success' : 'error'} 
                          />
                        </Box>
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
                      {dialogContent.data.status === 'completed' && (
                        <Grid item xs={12}>
                          <Button 
                            fullWidth 
                            variant="contained" 
                            startIcon={<RateReviewIcon />}
                            onClick={() => {
                              handleCloseDialog();
                              handleOpenReviewDialog(dialogContent.data);
                            }}
                            sx={{ 
                              bgcolor: '#FFA726', 
                              color: 'white',
                              py: 1.5,
                              '&:hover': { bgcolor: '#FB8C00' }
                            }}
                          >
                            Αξιολογήστε τον Κτηνίατρο
                          </Button>
                        </Grid>
                      )}
                    </>
                  )}

                  {/*MEDICAL DETAILS*/}
                  {dialogContent.type === 'medical' && (
                    <>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">ΤΥΠΟΣ ΠΡΑΞΗΣ</Typography>
                        <Box sx={{ mt: 1 }}>
                          <Chip label={dialogContent.data.type} color="primary" />
                        </Box>
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

                  {/*REVIEW DETAILS*/}
                  {dialogContent.type === 'review' && (
                    <>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Box>
                            <Typography variant="h6" fontWeight="bold">{dialogContent.data.vetName}</Typography>
                            <Typography variant="body2" color="text.secondary">{dialogContent.data.clinic}</Typography>
                            <Typography variant="caption" color="text.secondary">{dialogContent.details.clinicAddress}</Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">ΒΑΘΜΟΛΟΓΙΑ</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          {[...Array(5)].map((_, i) => (
                            <StarIcon 
                              key={i} 
                              sx={{ 
                                fontSize: 32, 
                                color: i < dialogContent.data.rating ? '#FFA726' : '#e0e0e0' 
                              }} 
                            />
                          ))}
                          <Typography variant="h5" fontWeight="bold" sx={{ ml: 1 }}>
                            {dialogContent.data.rating}/5
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">ΥΠΗΡΕΣΙΑ</Typography>
                        <Typography variant="body1">{dialogContent.data.service}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">ΗΜΕΡΟΜΗΝΙΑ</Typography>
                        <Typography variant="body1">{dialogContent.data.date}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Paper elevation={0} sx={{ p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                          <Typography variant="caption" color="text.secondary" fontWeight="bold">Η ΚΡΙΤΙΚΗ ΜΟΥ</Typography>
                          <Typography variant="body1" sx={{ mt: 1.5, lineHeight: 1.8 }}>
                            {dialogContent.data.comment}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
                          <CheckCircleIcon color="primary" />
                          <Typography variant="body2" color="primary" fontWeight="600">
                            Επιβεβαιωμένη Επίσκεψη • {dialogContent.details.helpful} άτομα βρήκαν αυτή την κριτική χρήσιμη
                          </Typography>
                        </Box>
                      </Grid>
                    </>
                  )}

                  {/*DECLARATION DETAILS*/}
                  {dialogContent.type === 'declaration' && (
                    <>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">ΚΑΤΑΣΤΑΣΗ</Typography>
                        <Box sx={{ mt: 1 }}>
                          <Chip label="Βρέθηκε" color="success" />
                        </Box>
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
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" fontFamily="monospace" sx={{ bgcolor: '#f5f5f5', p: 1, borderRadius: 1, display: 'inline-block' }}>{dialogContent.details.microchip}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">ΑΡΙΘΜΟΣ ΥΠΟΘΕΣΗΣ</Typography>
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" fontFamily="monospace" sx={{ bgcolor: '#f5f5f5', p: 1, borderRadius: 1, display: 'inline-block' }}>{dialogContent.details.caseNumber}</Typography>
                        </Box>
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

        {/* REVIEW DIALOG */}
        <Dialog 
          open={openReviewDialog} 
          onClose={handleCloseReviewDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: '16px' }
          }}
        >
          <DialogTitle sx={{ 
            bgcolor: '#FFA726',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <RateReviewIcon />
              <Typography variant="h6" fontWeight="bold">Αξιολόγηση Κτηνιάτρου</Typography>
            </Box>
            <IconButton onClick={handleCloseReviewDialog} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            {reviewData && (
              <Box>
                <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2, mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary">ΡΑΝΤΕΒΟΥ</Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ mt: 0.5 }}>{reviewData.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{reviewData.vet}</Typography>
                  <Typography variant="caption" color="text.secondary">{reviewData.date}</Typography>
                </Paper>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Βαθμολογία *
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Rating
                      value={reviewRating}
                      onChange={(event, newValue) => setReviewRating(newValue)}
                      size="large"
                      sx={{
                        '& .MuiRating-iconFilled': {
                          color: '#FFA726'
                        }
                      }}
                    />
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      {reviewRating > 0 ? `${reviewRating}/5` : ''}
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Η γνώμη σας *
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Περιγράψτε την εμπειρία σας με τον κτηνίατρο. Πώς ήταν η συμπεριφορά του; Ήταν επαγγελματίας; Θα τον συστήνατε;"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {reviewComment.length}/500 χαρακτήρες
                  </Typography>
                </Box>

                <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
                  Η κριτική σας θα είναι ορατή σε άλλους ιδιοκτήτες κατοικιδίων και θα βοηθήσει στην επιλογή κτηνιάτρου.
                </Alert>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button onClick={handleCloseReviewDialog} variant="outlined" color="inherit">
              Ακύρωση
            </Button>
            <Button 
              onClick={handleSubmitReview} 
              variant="contained" 
              sx={{ 
                bgcolor: '#FFA726',
                '&:hover': { bgcolor: '#FB8C00' }
              }}
            >
              Υποβολή Κριτικής
            </Button>
          </DialogActions>
        </Dialog>

        {/* SNACKBAR FOR NOTIFICATIONS */}
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={4000} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            sx={{ width: '100%', borderRadius: 2 }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}