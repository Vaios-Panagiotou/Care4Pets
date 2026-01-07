import React, { useEffect, useState } from 'react';
import { 
  Box, Container, Typography, Paper, Chip, Tabs, Tab, List, 
  Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, IconButton,
  Rating, Avatar, Card, CardContent
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
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [visitDialogOpen, setVisitDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const openVisitDialog = (visit) => {
    setSelectedVisit(visit);
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

  const averageRating = (reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / reviews.length) 
    : (VET_HISTORY_DATA.reviews.reduce((acc, r) => acc + r.rating, 0) / VET_HISTORY_DATA.reviews.length)
  ).toFixed(1);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <DashboardSidebar />
        <Box sx={{ flex: 1 }}>
          <PageHeader />
          <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <HistoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography variant="h4" fontWeight="bold">Ιστορικό Κτηνιάτρου</Typography>
            </Box>

            {/* Rating Summary */}
            <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #00695c 0%, #004d40 100%)', color: 'white', borderRadius: 4 }}>
              <Grid container alignItems="center" spacing={3}>
                <Grid item>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h2" fontWeight="bold">{averageRating}</Typography>
                    <Rating value={parseFloat(averageRating)} precision={0.1} readOnly sx={{ color: '#FFA726' }} />
                    <Typography variant="body2" sx={{ mt: 1 }}>από {VET_HISTORY_DATA.reviews.length} κριτικές</Typography>
                  </Box>
                </Grid>
                <Grid item xs>
                  <Typography variant="h6" gutterBottom>Συνολική Βαθμολογία</Typography>
                  <Typography variant="body2">Σύνολο Επισκέψεων: {VET_HISTORY_DATA.visits.length}</Typography>
                  <Typography variant="body2">Μέση Διάρκεια: {Math.round(VET_HISTORY_DATA.visits.reduce((acc, v) => acc + parseInt(v.duration), 0) / VET_HISTORY_DATA.visits.length)} λεπτά</Typography>
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
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>Πρόσφατες Επισκέψεις ({VET_HISTORY_DATA.visits.length})</Typography>
                <List>
                  {VET_HISTORY_DATA.visits.map((visit, index) => (
                    <React.Fragment key={visit.id}>
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
                        onClick={() => openVisitDialog(visit)}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                            <Avatar sx={{ bgcolor: 'primary.main', width: 50, height: 50 }}>
                              <PetsIcon />
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" fontWeight="bold">{visit.petName}</Typography>
                              <Typography variant="body2" color="text.secondary">Ιδιοκτήτης: {visit.ownerName}</Typography>
                              <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                                <Chip label={visit.service} size="small" color="primary" variant="outlined" />
                                <Chip label={visit.date} size="small" icon={<CalendarMonthIcon />} />
                                <Chip label={visit.cost} size="small" icon={<EuroIcon />} color="secondary" />
                                <Chip label={visit.duration} size="small" icon={<AccessTimeIcon />} />
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
          {selectedVisit && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'white' }}>
                  <Typography variant="h5" fontWeight="bold">{selectedVisit.petName}</Typography>
                  <Typography variant="body2">Ιδιοκτήτης: {selectedVisit.ownerName}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Υπηρεσία</Typography>
                <Typography variant="body1" fontWeight="bold">{selectedVisit.service}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Ημερομηνία</Typography>
                <Typography variant="body1" fontWeight="bold">{selectedVisit.date}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Διάρκεια</Typography>
                <Typography variant="body1" fontWeight="bold">{selectedVisit.duration}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Κόστος</Typography>
                <Typography variant="body1" fontWeight="bold" color="secondary.main">{selectedVisit.cost}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="caption" color="text.secondary">Διάγνωση</Typography>
                <Paper sx={{ p: 2, mt: 1, bgcolor: '#e3f2fd' }}>
                  <Typography variant="body2">{selectedVisit.diagnosis}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">Θεραπεία</Typography>
                <Paper sx={{ p: 2, mt: 1, bgcolor: '#f3e5f5' }}>
                  <Typography variant="body2">{selectedVisit.treatment}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">Σημειώσεις</Typography>
                <Paper sx={{ p: 2, mt: 1, bgcolor: '#fff3e0' }}>
                  <Typography variant="body2">{selectedVisit.notes}</Typography>
                </Paper>
              </Grid>
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
