import React from 'react';
import { Box, Container, Typography, Paper, Divider, Chip, Accordion, AccordionSummary, AccordionDetails, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import PageHeader from './PageHeader';
import DashboardSidebar from '../components/DashboardSidebar';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { useAuth } from '../hooks/useAuth'; 

// --- MOCK DATA ---
const HEALTH_DATA = {
  1: { 
    name: 'Kouvelaj',
    species: 'Σκύλος',
    breed: 'Λαμπράντορ',
    vaccines: [
      { name: 'Λύσσας (Rabies)', date: '12/05/2024', next: '12/05/2025', vet: 'Δρ. Παπαδόπουλος', clinic: 'Κλινική Κουβελάj', manufacturer: 'Boehringer Ingelheim', batchNumber: 'BIV-2024-005', status: 'Ενεργό' },
      { name: 'DHPP (Τετραπλό)', date: '10/02/2024', next: '10/02/2025', vet: 'Δρ. Παπαδόπουλος', clinic: 'Κλινική Κουβελάj', manufacturer: 'Zoetis', batchNumber: 'ZOE-2024-012', status: 'Ενεργό' }
    ],
    history: [
      { date: '15/08/2024', reason: 'Γαστρεντερίτιδα', treatment: 'Αντιβίωση για 5 μέρες', vet: 'Δρ. Παπαδόπουλος', symptoms: 'Έμετος, διάρροια, απώλεια όρεξης', diagnosis: 'Ιογενής γαστρεντερίτιδα', medications: 'Amoxicillin 250mg x3/ημέρα', followup: '22/08/2024 - Βελτίωση', status: 'Πλήρης ανάρρωση', weight: '28.0 kg' },
      { date: '01/03/2024', reason: 'Ετήσιος Έλεγχος', treatment: 'Όλα φυσιολογικά', vet: 'Δρ. Παπαδόπουλος', symptoms: 'Καμία παράπονο', diagnosis: 'Υγιές ζώο', weight: '28.5 kg', bloodWork: 'Φυσιολογικά αποτελέσματα', status: 'Υγιής' }
    ]
  },
  2: { 
    name: 'Pantiana',
    species: 'Γάτα',
    breed: 'Περσικά',
    vaccines: [
      { name: 'FVRCP (Τριπλό)', date: '20/06/2024', next: '20/06/2025', vet: 'Δρ. Κωνσταντίνου', clinic: 'Κλινική Πάντιανας', manufacturer: 'Boehringer Ingelheim', batchNumber: 'BIV-2024-008', status: 'Ενεργό' }
    ],
    history: [
      { date: '10/09/2024', reason: 'Δερματική αλλεργία', treatment: 'Αλοιφή Betadine', vet: 'Δρ. Κωνσταντίνου', symptoms: 'Κνησμός, κοκκινίλα, φλεγμονή', diagnosis: 'Αλλεργική δερματίτιδα', medications: 'Betadine Ointment x2/ημέρα', followup: '17/09/2024 - Σημαντική βελτίωση', status: 'Κάτω από ιατρική παρακολούθηση' }
    ]
  }
};

export default function PetHealthBook() {
  const { id } = useParams();
  const data = HEALTH_DATA[id] || HEALTH_DATA[1];
  const { isAuthenticated, user } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8', pb: 8, display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="xl" sx={{ pt: 2 }}><PageHeader /></Container>
      
      <Box sx={{ display: 'flex', flex: 1, maxWidth: '100vw', overflow: 'hidden', p: 2, gap: 2 }}>
        <DashboardSidebar />
        
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          <Container maxWidth="md">
            {/* Pet Info Header */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: '16px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                Βιβλιάριο Υγείας: {data.name}
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Είδος</Typography>
                  <Typography variant="h6" fontWeight="bold">{data.species}</Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Φυλή</Typography>
                  <Typography variant="h6" fontWeight="bold">{data.breed}</Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Εμβόλια (Αυτόματο άνοιγμα) */}
            {isAuthenticated && user.role === 'vet' && (
              <Paper sx={{ p: 3, mb: 4, borderRadius: '16px', border: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <VaccinesIcon color="primary" fontSize="large"/>
                  <Typography variant="h6" fontWeight="bold">Εμβολιασμοί ({data.vaccines.length})</Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {data.vaccines.map((v, i) => (
                    <Accordion 
                      key={i}
                      disableGutters
                      sx={{ 
                        bgcolor: v.status === 'Ενεργό' ? '#e8f5e9' : '#fff3e0',
                        border: v.status === 'Ενεργό' ? '1px solid #81c784' : '1px solid #ffb74d',
                        borderRadius: 1,
                        mb: 1
                      }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ py: 2, px: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                          {v.status === 'Ενεργό' ? 
                            <CheckCircleIcon sx={{ color: 'success.main' }} /> : 
                            <WarningIcon sx={{ color: 'warning.main' }} />
                          }
                          <Box sx={{ flex: 1 }}>
                            <Typography fontWeight="bold">{v.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{v.date} - Δρ. {v.vet}</Typography>
                          </Box>
                          <Chip label={v.status} color={v.status === 'Ενεργό' ? 'success' : 'warning'} size="small" />
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails sx={{ bgcolor: 'white', pt: 3, px: 2, py: 2 }}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={6}>
                             <Typography variant="caption" color="text.secondary" fontWeight="bold">ΗΜΕΡΟΜΗΝΙΑ</Typography>
                             <Typography variant="body2">{v.date}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                             <Typography variant="caption" color="text.secondary" fontWeight="bold">ΕΠΟΜΕΝΗ ΔΟΣΗ</Typography>
                             <Typography variant="body2" color="success.main" fontWeight="bold">{v.next}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                             <Typography variant="caption" color="text.secondary" fontWeight="bold">ΚΛΙΝΙΚΗ</Typography>
                             <Typography variant="body2">{v.clinic}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                             <Typography variant="caption" color="text.secondary" fontWeight="bold">ΠΑΡΤΙΔΑ</Typography>
                             <Typography variant="body2" fontFamily="monospace">{v.batchNumber}</Typography>
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              </Paper>
            )}

            {/* Ιστορικό (Αυτόματο άνοιγμα) */}
            {isAuthenticated && (
              <Paper sx={{ p: 3, borderRadius: '16px', border: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <MedicalServicesIcon color="secondary" fontSize="large"/>
                  <Typography variant="h6" fontWeight="bold">Ιστορικό Επισκέψεων ({data.history.length})</Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {data.history.map((h, i) => (
                    <Accordion 
                      key={i}
                      disableGutters
                      sx={{ 
                        bgcolor: h.status === 'Υγιής' || h.status === 'Πλήρης ανάρρωση' ? '#e3f2fd' : '#fff9c4',
                        border: h.status === 'Υγιής' || h.status === 'Πλήρης ανάρρωση' ? '1px solid #64b5f6' : '1px solid #ffeb3b',
                        borderRadius: 1,
                        mb: 1
                      }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ py: 2, px: 2 }}>
                        <Box sx={{ width: '100%' }}>
                          <Typography fontWeight="bold">{h.reason}</Typography>
                          <Typography variant="caption" color="text.secondary">{h.date} - Δρ. {h.vet}</Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails sx={{ bgcolor: 'white', borderTop: '1px solid rgba(0,0,0,0.05)', pt: 3, px: 2, py: 2 }}>
                        <Grid container spacing={3}>
                           <Grid item xs={12}>
                              <Typography variant="caption" color="text.secondary" fontWeight="bold">ΣΥΜΠΤΩΜΑΤΑ</Typography>
                              <Typography variant="body2">{h.symptoms}</Typography>
                           </Grid>
                           <Grid item xs={12}>
                              <Typography variant="caption" color="text.secondary" fontWeight="bold">ΔΙΑΓΝΩΣΗ</Typography>
                              <Typography variant="body2" fontWeight="bold" color="primary">{h.diagnosis}</Typography>
                           </Grid>
                           <Grid item xs={12}>
                              <Typography variant="caption" color="text.secondary" fontWeight="bold">ΘΕΡΑΠΕΙΑ</Typography>
                              <Typography variant="body2">{h.treatment}</Typography>
                           </Grid>
                           {h.medications && (
                             <Grid item xs={12}>
                                <Paper elevation={0} sx={{ p: 1.5, bgcolor: '#ffebee', border: '1px solid #ef5350', borderRadius: 1 }}>
                                  <Typography variant="caption" color="error.main" fontWeight="bold">ΦΑΡΜΑΚΑ</Typography>
                                  <Typography variant="body2" fontWeight="bold">{h.medications}</Typography>
                                </Paper>
                             </Grid>
                           )}
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              </Paper>
            )}

            {!isAuthenticated && (
              <Typography color="error" sx={{ mt: 4, textAlign: 'center', p: 3, bgcolor: 'error.light', borderRadius: 2 }}>
                Πρέπει να συνδεθείτε για να δείτε τις πληροφορίες υγείας του ζώου.
              </Typography>
            )}
          </Container>
        </Box>
      </Box>
    </Box>
  );
}