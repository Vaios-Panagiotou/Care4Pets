import React, { useEffect, useState } from 'react';
import { 
  Box, Container, Typography, Paper, Chip, Tabs, Tab, List, 
  Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, IconButton,
  Rating, Avatar, Card, CardContent, TextField, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DashboardSidebar from '../components/DashboardSidebar';
import { useAuth } from '../context/AuthContext';

// Icons
import HistoryIcon from '@mui/icons-material/History';
import PetsIcon from '@mui/icons-material/Pets';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import StarIcon from '@mui/icons-material/Star';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import EuroIcon from '@mui/icons-material/Euro';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import PageHeader from './PageHeader';

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
  shape: { borderRadius: 12 }
});

//mock data για ιστορικό κτηνιάτρου
const VET_HISTORY_DATA = {
  visits: [
    { id: 1, date: '20 Δεκ 2025', petName: 'Μπάμπης', ownerName: 'Γιώργος Παπαδόπουλος', service: 'Ετήσιος Εμβολιασμός', cost: '45€', duration: '30 λεπτά', diagnosis: 'Υγιές ζώο', treatment: 'Εμβόλιο λύσσας', notes: 'Επόμενη επίσκεψη σε 1 χρόνο' },
    { id: 2, date: '18 Δεκ 2025', petName: 'Λούνα', ownerName: 'Μαρία Αντωνίου', service: 'Δερματολογικός Έλεγχος', cost: '60€', duration: '45 λεπτά', diagnosis: 'Ελαφριά δερματίτιδα', treatment: 'Αντιβίωση και αλοιφή', notes: 'Επανέλεγχος σε 2 εβδομάδες' },
    { id: 3, date: '15 Δεκ 2025', petName: 'Ρόκι', ownerName: 'Κώστας Νικολάου', service: 'Τακτικός Έλεγχος', cost: '35€', duration: '20 λεπτά', diagnosis: 'Καλή κατάσταση', treatment: 'Καμία', notes: 'Όλα εντάξει' },
    { id: 4, date: '12 Δεκ 2025', petName: 'Μίκυ', ownerName: 'Άννα Γεωργίου', service: 'Ακτινογραφία', cost: '85€', duration: '60 λεπτά', diagnosis: 'Μικρό κάταγμα', treatment: 'Ακινητοποίηση και παυσίπονα', notes: 'Επίσκεψη σε 1 μήνα για έλεγχο' },
    { id: 5, date: '10 Δεκ 2025', petName: 'Φίλιξ', ownerName: 'Δημήτρης Ιωάννου', service: 'Καθαρισμός Δοντιών', cost: '70€', duration: '50 λεπτά', diagnosis: 'Καλή στοματική υγεία', treatment: 'Καθαρισμός πλάκας', notes: 'Ετήσιος καθαρισμός συνιστάται' },
    { id: 6, date: '08 Δεκ 2025', petName: 'Μπέλα', ownerName: 'Νίκος Κωνσταντίνου', service: 'Στείρωση', cost: '120€', duration: '90 λεπτά', diagnosis: 'Επιτυχής χειρουργική επέμβαση', treatment: 'Χειρουργείο στείρωσης', notes: 'Επανέλεγχος σε 10 ημέρες' }
  ],
  reviews: [
    { id: 1, ownerName: 'Γιώργος Παπαδόπουλος', petName: 'Μπάμπης', rating: 5, date: '20 Δεκ 2025', comment: 'Εξαιρετικός κτηνίατρος! Πολύ προσεκτικός με το ζώο μου και πολύ εξηγητικός. Τον συνιστώ ανεπιφύλακτα!', service: 'Εμβολιασμός' },
    { id: 2, ownerName: 'Μαρία Αντωνίου', petName: 'Λούνα', rating: 5, date: '18 Δεκ 2025', comment: 'Πολύ καλή εξυπηρέτηση και επαγγελματισμός. Η γάτα μου ήταν πολύ ήρεμη κατά τη διάρκεια της εξέτασης.', service: 'Δερματολογικός Έλεγχος' },
    { id: 3, ownerName: 'Κώστας Νικολάου', petName: 'Ρόκι', rating: 4, date: '15 Δεκ 2025', comment: 'Πολύ καλός γιατρός, λίγο αργοί οι χρόνοι αναμονής αλλά άξιζε την αναμονή. Ο σκύλος μου είναι τώρα πολύ καλά.', service: 'Τακτικός Έλεγχος' },
    { id: 4, ownerName: 'Άννα Γεωργίου', petName: 'Μίκυ', rating: 5, date: '12 Δεκ 2025', comment: 'Ο Dr. έδωσε πολύ μεγάλη σημασία στο πρόβλημα του σκύλου μου. Έκανε πλήρη εξέταση και εξήγησε όλα τα βήματα. Ευχαριστώ πολύ!', service: 'Ακτινογραφία' },
    { id: 5, ownerName: 'Δημήτρης Ιωάννου', petName: 'Φίλιξ', rating: 5, date: '10 Δεκ 2025', comment: 'Άψογη δουλειά! Τα δόντια του γάτου μου είναι τώρα λαμπερά. Ο γιατρός ήταν πολύ προσεκτικός και φιλικός.', service: 'Καθαρισμός Δοντιών' },
    { id: 6, ownerName: 'Ελένη Παύλου', petName: 'Σόφι', rating: 4, date: '05 Δεκ 2025', comment: 'Πολύ καλός επαγγελματίας. Μόνο η τιμή ήταν λίγο υψηλή, αλλά η ποιότητα των υπηρεσιών το δικαιολογεί.', service: 'Χειρουργείο' },
    { id: 7, ownerName: 'Νίκος Κωνσταντίνου', petName: 'Μπέλα', rating: 5, date: '08 Δεκ 2025', comment: 'Η στείρωση έγινε άψογα και η ανάρρωση ήταν γρήγορη. Πολύ ευγενικός και επαγγελματίας. Σίγουρα θα επιστρέψω!', service: 'Στείρωση' }
  ]
};

export default function VetHistory() {
  const [tabValue, setTabValue] = useState(0);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [visitDialogOpen, setVisitDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [appointmentsError, setAppointmentsError] = useState('');

  // Filters for appointments
  const [filterQuery, setFilterQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');

  const monthMap = {
    'Ιανουαρίου': 0, 'Φεβρουαρίου': 1, 'Μαρτίου': 2, 'Απριλίου': 3, 'Μαΐου': 4, 'Ιουνίου': 5,
    'Ιουλίου': 6, 'Αυγούστου': 7, 'Σεπτεμβρίου': 8, 'Οκτωβρίου': 9, 'Νοεμβρίου': 10, 'Δεκεμβρίου': 11,
    'Ιαν': 0, 'Φεβ': 1, 'Μαρ': 2, 'Απρ': 3, 'Μάι': 4, 'Ιουν': 5,
    'Ιουλ': 6, 'Αυγ': 7, 'Σεπ': 8, 'Οκτ': 9, 'Νοε': 10, 'Δεκ': 11
  };

  const toTimestamp = (a) => {
    try {
      if (a?.updatedAt) {
        const d = new Date(a.updatedAt);
        if (!isNaN(d.getTime())) return d.getTime();
      }
      if (a?.completedAt) {
        const d = new Date(a.completedAt);
        if (!isNaN(d.getTime())) return d.getTime();
      }
      const dateStr = a?.date || '';
      const timeStr = a?.time || '';
      if (/^\d{4}-\d{2}-\d{2}(T.*)?$/.test(dateStr)) {
        // ISO date, optionally with time
        const base = dateStr.length === 10 ? `${dateStr} ${timeStr || '00:00'}` : dateStr;
        const d = new Date(base);
        return !isNaN(d.getTime()) ? d.getTime() : 0;
      }
      // Attempt Greek date parsing
      const parts = (dateStr || '').split(' ').filter(Boolean);
      let day, monthToken, year;
      if (parts.length >= 3) {
        if (isNaN(Number(parts[0]))) {
          // With weekday e.g. "Παρασκευή 16 Ιανουαρίου 2026"
          day = Number(parts[1]);
          monthToken = parts[2];
          year = Number(parts[3]);
        } else {
          // e.g. "20 Δεκ 2025"
          day = Number(parts[0]);
          monthToken = parts[1];
          year = Number(parts[2]);
        }
        const m = monthMap[monthToken];
        if (m !== undefined && !isNaN(day) && !isNaN(year)) {
          const d = new Date(year, m, day);
          if (timeStr) {
            const [hh, mm] = timeStr.split(':');
            d.setHours(Number(hh) || 0, Number(mm) || 0, 0, 0);
          }
          return d.getTime();
        }
      }
    } catch {}
    return 0;
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const openVisitDialog = (appointment) => {
    setSelectedAppointment(appointment);
    setVisitDialogOpen(true);
  };

  const openReviewDialog = (review) => {
    setSelectedReview(review);
    setReviewDialogOpen(true);
  };

  useEffect(() => {
    const fetchReviews = async () => {
      if (!user?.id) return;
      setLoadingReviews(true);
      setReviewError('');
      try {
        const res = await fetch(`http://localhost:3001/reviews?vetId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data || []);
        } else {
          throw new Error(`HTTP ${res.status}`);
        }
      } catch (e) {
        console.error('Error fetching vet reviews:', e);
        setReviewError('Σφάλμα φόρτωσης κριτικών. Εμφανίζονται δείγμα δεδομένων.');
        setReviews(VET_HISTORY_DATA.reviews);
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
  }, [user]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user?.id) return;
      setLoadingAppointments(true);
      setAppointmentsError('');
      try {
        // 1) Fetch by vetUserId
        let result = [];
        const byUserRes = await fetch(`http://localhost:3001/appointments?vetUserId=${user.id}`);
        if (byUserRes.ok) {
          result = await byUserRes.json();
        }

        // 2) Find vet profile to also fetch by vetId (profile id)
        const vetProfileRes = await fetch(`http://localhost:3001/vets?userId=${user.id}`);
        if (vetProfileRes.ok) {
          const profiles = await vetProfileRes.json();
          if (Array.isArray(profiles) && profiles.length > 0) {
            const vetProfileId = profiles[0]?.id;
            if (vetProfileId) {
              const byVetIdRes = await fetch(`http://localhost:3001/appointments?vetId=${vetProfileId}`);
              if (byVetIdRes.ok) {
                const byVetId = await byVetIdRes.json();
                // Merge & dedupe by id
                const map = new Map();
                [...result, ...byVetId].forEach(a => map.set(a.id, a));
                result = Array.from(map.values());
              }
            }
          }
        }

        // 3) If still empty, try a direct vetId match on user.id (legacy data)
        if (result.length === 0) {
          const legacyRes = await fetch(`http://localhost:3001/appointments?vetId=${user.id}`);
          if (legacyRes.ok) {
            result = await legacyRes.json();
          }
        }

        // Fallback to mock if nothing fetched
        if (!Array.isArray(result) || result.length === 0) {
          setAppointmentsError('Σφάλμα ή κενά δεδομένα ραντεβού. Εμφανίζονται δείγμα δεδομένων.');
          const fallback = VET_HISTORY_DATA.visits.map(v => ({
            id: v.id,
            petName: v.petName,
            ownerName: v.ownerName,
            date: v.date,
            time: v.duration || '',
            status: 'completed',
            type: v.service,
            reason: v.notes,
            note: v.notes,
            diagnosis: v.diagnosis,
            treatment: v.treatment
          }));
          setAppointments(fallback.sort((a, b) => toTimestamp(b) - toTimestamp(a)));
        } else {
          setAppointments(result.sort((a, b) => toTimestamp(b) - toTimestamp(a)));
        }
      } catch (e) {
        console.error('Error fetching vet appointments:', e);
        setAppointmentsError('Σφάλμα φόρτωσης ραντεβού. Εμφανίζονται δείγμα δεδομένων.');
        const fallback = VET_HISTORY_DATA.visits.map(v => ({
          id: v.id,
          petName: v.petName,
          ownerName: v.ownerName,
          date: v.date,
          time: v.duration || '',
          status: 'completed',
          type: v.service,
          reason: v.notes,
          note: v.notes,
          diagnosis: v.diagnosis,
          treatment: v.treatment
        }));
        setAppointments(fallback.sort((a, b) => toTimestamp(b) - toTimestamp(a)));
      } finally {
        setLoadingAppointments(false);
      }
    };
    fetchAppointments();
  }, [user]);

  const averageRating = (reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / reviews.length) 
    : (VET_HISTORY_DATA.reviews.reduce((acc, r) => acc + r.rating, 0) / VET_HISTORY_DATA.reviews.length)
  ).toFixed(1);

  // Derived filtered appointments (applies client-side filters)
  const filteredAppointments = (() => {
    const src = (appointments && appointments.length > 0) ? appointments : VET_HISTORY_DATA.visits.map(v => ({
      id: v.id,
      petName: v.petName,
      ownerName: v.ownerName,
      date: v.date,
      time: v.duration || '',
      status: v.status || 'completed',
      type: v.service,
      note: v.notes
    }));

    const q = (filterQuery || '').trim().toLowerCase();
    const fromTS = filterFrom ? new Date(filterFrom + 'T00:00:00').getTime() : null;
    const toTS = filterTo ? new Date(filterTo + 'T23:59:59').getTime() : null;

    return src.filter(appt => {
      try {
        if (q) {
          const hay = `${appt.petName||''} ${appt.ownerName||''} ${appt.type||''}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        if (filterStatus && filterStatus !== 'all') {
          const st = (appt.status || 'completed').toString().toLowerCase(); if (st !== String(filterStatus).toLowerCase()) return false;
        }
        if (fromTS || toTS) {
          const ts = toTimestamp(appt) || 0; if (fromTS && ts < fromTS) return false; if (toTS && ts > toTS) return false;
        }
        return true;
      } catch (e) { return true; }
    });
  })();

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <PageHeader />

          {/* HERO SECTION */}
          <Box sx={{ 
            position: 'relative', 
            py: 6, 
            mb: 2,
            color: 'white', 
            textAlign: 'center',
            backgroundImage: 'url(https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            overflow: 'hidden'
          }}>
            {/* Green Fade Overlay */}
            <Box sx={{ 
                position: 'absolute', 
                inset: 0, 
                background: 'linear-gradient(135deg, rgba(38, 50, 56, 0.9) 0%, rgba(0, 105, 92, 0.85) 100%)',
                zIndex: 1
            }} />
            
            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
                <HistoryIcon sx={{ fontSize: 60, mb: 2, opacity: 0.9 }} />
                <Typography variant="h3" fontWeight="800" gutterBottom>
                    Ιστορικό Κτηνιάτρου
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                    Δείτε αναλυτικά το αρχείο επισκέψεων και τις κριτικές των πελατών
                </Typography>
            </Container>
          </Box>

          </Box>

          {/* Below hero: sidebar left, content right */}
          <Box sx={{ display: 'flex', gap: 3, px: 2, pb: 4, alignItems: 'flex-start' }}>
            <Box sx={{ width: { xs: '100%', md: 280 }, flexShrink: 0 }}>
              <DashboardSidebar />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Rating Summary */}
            <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #00695c 0%, #004d40 100%)', color: 'white', borderRadius: 4 }}>
              <Grid container alignItems="center" spacing={3}>
                <Grid item>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h2" fontWeight="bold">{averageRating}</Typography>
                    <Rating value={parseFloat(averageRating)} precision={0.1} readOnly sx={{ color: '#FFA726' }} />
                    <Typography variant="body2" sx={{ mt: 1 }}>από {(reviews.length || VET_HISTORY_DATA.reviews.length)} κριτικές</Typography>
                  </Box>
                </Grid>
                <Grid item xs>
                  <Typography variant="h6" gutterBottom>Συνολική Βαθμολογία</Typography>
                  <Typography variant="body2">Σύνολο Επισκέψεων: {appointments.length || VET_HISTORY_DATA.visits.length}</Typography>
                </Grid>
              </Grid>
            </Paper>

            <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
              <Tab icon={<PetsIcon />} label="Επισκέψεις Ζώων" iconPosition="start" />
              <Tab icon={<StarIcon />} label="Κριτικές Πελατών" iconPosition="start" />
            </Tabs>

            {/*tab 0:Επισκέψεις Ζώων*/}
            {tabValue === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom sx={{ mb: 1 }}>Πρόσφατες Επισκέψεις ({filteredAppointments.length})</Typography>

                <Paper sx={{ p: 2, mb: 2, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  <TextField size="small" placeholder="Αναζήτηση κατοικίδιου / ιδιοκτήτη / υπηρεσίας..." value={filterQuery} onChange={e => setFilterQuery(e.target.value)} sx={{ minWidth: 240, flex: 1 }} />
                  <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel id="filter-status-label">Κατάσταση</InputLabel>
                    <Select labelId="filter-status-label" value={filterStatus} label="Κατάσταση" onChange={e => setFilterStatus(e.target.value)}>
                      <MenuItem value="all">Όλες</MenuItem>
                      <MenuItem value="completed">Ολοκληρωμένες</MenuItem>
                      <MenuItem value="cancelled">Ακυρωμένες</MenuItem>
                      <MenuItem value="draft">Πρόχειρα</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField size="small" label="Από" type="date" value={filterFrom} onChange={e => setFilterFrom(e.target.value)} InputLabelProps={{ shrink: true }} />
                  <TextField size="small" label="Έως" type="date" value={filterTo} onChange={e => setFilterTo(e.target.value)} InputLabelProps={{ shrink: true }} />
                  <Button size="small" variant="outlined" onClick={() => { setFilterQuery(''); setFilterStatus('all'); setFilterFrom(''); setFilterTo(''); }}>Καθαρισμός</Button>
                </Paper>

                {appointmentsError && (<Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>{appointmentsError}</Typography>)}

                <List>
                  {filteredAppointments.map((appt) => (
                    <React.Fragment key={appt.id}>
                      <Paper 
                        sx={{ 
                          mb: 2, 
                          p: 2.5, 
                          cursor: 'pointer', 
                          transition: 'all 0.3s',
                          borderRadius: 3,
                          '&:hover': { 
                            transform: 'translateX(8px)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
                          }
                        }}
                        onClick={() => openVisitDialog(appt)}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                            <Avatar sx={{ bgcolor: 'primary.main', width: 50, height: 50 }}>
                              <PetsIcon />
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" fontWeight="bold">{appt.petName}</Typography>
                              {appt.ownerName && (<Typography variant="body2" color="text.secondary">Ιδιοκτήτης: {appt.ownerName}</Typography>)}
                              <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                                {appt.type && (<Chip label={appt.type} size="small" color="primary" variant="outlined" />)}
                                {appt.date && (<Chip label={appt.date} size="small" icon={<CalendarMonthIcon />} />)}
                                {appt.time && (<Chip label={appt.time} size="small" icon={<AccessTimeIcon />} />)}
                                {appt.status && (<Chip label={appt.status} size="small" color={appt.status === 'completed' ? 'success' : appt.status === 'cancelled' ? 'default' : 'secondary'} />)}
                              </Box>
                            </Box>
                          </Box>
                          <IconButton color="primary">
                            <InfoIcon />
                          </IconButton>
                        </Box>
                      </Paper>
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            )}

            {/*tab 1:Κριτικές */}
            {tabValue === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom sx={{ mb: 1 }}>Κριτικές Πελατών ({reviews.length})</Typography>
                {reviewError && (<Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>{reviewError}</Typography>)}
                <Grid container spacing={3}>
                  {reviews.map((review) => (
                    <Grid item xs={12} md={6} key={review.id}>
                      <Card 
                        sx={{ 
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          height: '100%',
                          '&:hover': { 
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)' 
                          }
                        }}
                        onClick={() => openReviewDialog(review)}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Box>
                              <Typography variant="h6" fontWeight="bold">{review.ownerName}</Typography>
                              {review.petName && (<Typography variant="caption" color="text.secondary">Κατοικίδιο: {review.petName}</Typography>)}
                            </Box>
                            <Chip label={review.date} size="small" />
                          </Box>
                          <Rating value={Number(review.rating)} readOnly sx={{ mb: 1 }} />
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                            {review.comment && review.comment.length > 120 ? `${review.comment.substring(0, 120)}...` : review.comment}
                          </Typography>
                          {review.service && (<Chip label={review.service} size="small" color="primary" variant="outlined" />)}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Container>
        </Box>
      </Box>
    </Box>

      {/*visit Details Dialog */}
      <Dialog open={visitDialogOpen} onClose={() => setVisitDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MedicalServicesIcon />
            <span>Λεπτομέρειες Επίσκεψης</span>
          </Box>
          <IconButton onClick={() => setVisitDialogOpen(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          {selectedAppointment && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'white' }}>
                  <Typography variant="h5" fontWeight="bold">{selectedAppointment.petName}</Typography>
                  {selectedAppointment.ownerName && (<Typography variant="body2">Ιδιοκτήτης: {selectedAppointment.ownerName}</Typography>)}
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Υπηρεσία</Typography>
                <Typography variant="body1" fontWeight="bold">{selectedAppointment.type || '-'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Ημερομηνία</Typography>
                <Typography variant="body1" fontWeight="bold">{selectedAppointment.date}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Διάρκεια</Typography>
                <Typography variant="body1" fontWeight="bold">{selectedAppointment.time || '-'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Κατάσταση</Typography>
                <Typography variant="body1" fontWeight="bold" color="secondary.main">{selectedAppointment.status}</Typography>
              </Grid>
              {selectedAppointment.diagnosis && (
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="caption" color="text.secondary">Διάγνωση</Typography>
                  <Paper sx={{ p: 2, mt: 1, bgcolor: '#e3f2fd', minHeight: 72, display: 'flex', alignItems: 'flex-start', borderRadius: 2 }}>
                    <Typography variant="body1" sx={{ color: 'text.primary', whiteSpace: 'normal' }}>{selectedAppointment.diagnosis}</Typography>
                  </Paper>
                </Grid>
              )}
              {selectedAppointment.treatment && (
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Θεραπεία</Typography>
                  <Paper sx={{ p: 2, mt: 1, bgcolor: '#f3e5f5', minHeight: 72, display: 'flex', alignItems: 'flex-start', borderRadius: 2 }}>
                    <Typography variant="body1" sx={{ color: 'text.primary', whiteSpace: 'normal' }}>{selectedAppointment.treatment}</Typography>
                  </Paper>
                </Grid>
              )}
              {(selectedAppointment.note || selectedAppointment.reason) && (
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Σημειώσεις</Typography>
                  <Paper sx={{ p: 2, mt: 1, bgcolor: '#fff3e0', minHeight: 72, display: 'flex', alignItems: 'flex-start', borderRadius: 2 }}>
                    <Typography variant="body1" sx={{ color: 'text.primary', whiteSpace: 'normal' }}>{selectedAppointment.note || selectedAppointment.reason}</Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVisitDialogOpen(false)} variant="contained">Κλείσιμο</Button>
        </DialogActions>
      </Dialog>

      {/*review details dialog */}
      <Dialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: 'secondary.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StarIcon />
            <span>Λεπτομέρειες Κριτικής</span>
          </Box>
          <IconButton onClick={() => setReviewDialogOpen(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          {selectedReview && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                  <PersonIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">{selectedReview.ownerName}</Typography>
                  <Typography variant="caption" color="text.secondary">Κατοικίδιο: {selectedReview.petName}</Typography>
                </Box>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Rating value={selectedReview.rating} readOnly size="large" />
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>{selectedReview.date}</Typography>
              </Box>
              <Paper sx={{ p: 2, bgcolor: '#f5f5f5', mb: 2 }}>
                <Typography variant="body1">{selectedReview.comment}</Typography>
              </Paper>
              <Chip label={selectedReview.service} color="primary" icon={<MedicalServicesIcon />} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialogOpen(false)} variant="contained" color="secondary">Κλείσιμο</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}