import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Typography, Paper, Divider, Chip, Accordion, AccordionSummary, AccordionDetails, 
  Grid, Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Avatar, Card, 
  CardContent, Tabs, Tab, Badge, LinearProgress, CircularProgress 
} from '@mui/material';
import { useParams } from 'react-router-dom';
import PageHeader from './PageHeader';
import DashboardSidebar from '../components/DashboardSidebar';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import PetsIcon from '@mui/icons-material/Pets';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import TimelineIcon from '@mui/icons-material/Timeline';
import { useAuth } from '../hooks/useAuth';

export default function PetHealthBook() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [petData, setPetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vaccines, setVaccines] = useState([]);
  const [history, setHistory] = useState([]);

  const handleOpenDialog = (content) => {
    setDialogContent(content);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogContent(null);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Calculate vaccine status
  const activeVaccines = vaccines.filter(v => v.status === 'Ενεργό').length;
  const totalVaccines = vaccines.length;

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!petData) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h5" color="error">Δεν βρέθηκε το κατοικίδιο</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pb: 8, display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="xl" sx={{ pt: 2 }}><PageHeader /></Container>
      
      <Box sx={{ display: 'flex', flex: 1, maxWidth: '100vw', p: 2, gap: 2 }}>
        <DashboardSidebar />
        
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          <Container maxWidth="lg">
            
            {/* Enhanced Pet Info Header Card */}
            <Paper 
              elevation={0}
              sx={{ 
                p: 4, 
                mb: 4, 
                borderRadius: 4, 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': { 
                  transform: 'translateY(-4px)', 
                  boxShadow: '0 12px 40px rgba(0,0,0,0.3)' 
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '40%',
                  height: '100%',
                  background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M50 10 Q60 30 50 50 Q40 30 50 10\' fill=\'rgba(255,255,255,0.05)\'/%3E%3C/svg%3E")',
                  opacity: 0.3
                }
              }}
              onClick={() => handleOpenDialog({
                type: 'pet',
                title: `Πληροφορίες: ${petData.name}`,
                data: {
                  name: petData.name,
                  species: petData.breed,
                  breed: petData.breed,
                  details: `Φύλο: ${petData.gender === 'male' ? 'Αρσενικό' : 'Θηλυκό'}\nΗλικία: ${petData.age} ετών\nΒάρος: ${petData.weight} kg\nID: ${petData.id}`
                }
              })}
            >
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                  <Avatar 
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      bgcolor: 'rgba(255,255,255,0.2)',
                      border: '3px solid rgba(255,255,255,0.3)'
                    }}
                  >
                    <PetsIcon sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h3" fontWeight="800" sx={{ mb: 0.5 }}>
                      {petData.name}
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                      Βιβλιάριο Υγείας
                    </Typography>
                  </Box>
                  <IconButton 
                    sx={{ 
                      color: 'white', 
                      bgcolor: 'rgba(255,255,255,0.2)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                    }}
                  >
                    <InfoIcon />
                  </IconButton>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.15)', borderRadius: 2, backdropFilter: 'blur(10px)' }}>
                      <Typography variant="caption" sx={{ opacity: 0.9, display: 'block', mb: 0.5 }}>Φύλο</Typography>
                      <Typography variant="h6" fontWeight="bold">{petData.gender === 'male' ? 'Αρσενικό' : 'Θηλυκό'}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.15)', borderRadius: 2, backdropFilter: 'blur(10px)' }}>
                      <Typography variant="caption" sx={{ opacity: 0.9, display: 'block', mb: 0.5 }}>Ράτσα</Typography>
                      <Typography variant="h6" fontWeight="bold">{petData.breed}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.15)', borderRadius: 2, backdropFilter: 'blur(10px)' }}>
                      <Typography variant="caption" sx={{ opacity: 0.9, display: 'block', mb: 0.5 }}>Εμβόλια</Typography>
                      <Typography variant="h6" fontWeight="bold">{activeVaccines}/{totalVaccines}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.15)', borderRadius: 2, backdropFilter: 'blur(10px)' }}>
                      <Typography variant="caption" sx={{ opacity: 0.9, display: 'block', mb: 0.5 }}>Επισκέψεις</Typography>
                      <Typography variant="h6" fontWeight="bold">{history.length}</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </Paper>

            {/* Tabs Navigation */}
            <Paper elevation={0} sx={{ mb: 3, borderRadius: 3, overflow: 'hidden' }}>
              <Tabs 
                value={currentTab} 
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    py: 2
                  }
                }}
              >
                <Tab 
                  icon={<VaccinesIcon />} 
                  iconPosition="start" 
                  label={`Εμβολιασμοί (${vaccines.length})`}
                />
                <Tab 
                  icon={<TimelineIcon />} 
                  iconPosition="start" 
                  label={`Ιστορικό (${history.length})`}
                />
              </Tabs>
            </Paper>

            {/* Tab Content */}
            {currentTab === 0 && (
              <Box>
                {vaccines.length === 0 ? (
                  <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 3, border: '2px dashed #e0e0e0' }}>
                    <VaccinesIcon sx={{ fontSize: 60, color: '#bdbdbd', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Δεν υπάρχουν εμβόλια
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Τα εμβόλια θα προστεθούν από τον κτηνίατρο κατά την επόμενη επίσκεψη.
                    </Typography>
                  </Paper>
                ) : vaccines.map((v, i) => (
                  <Card 
                    key={i}
                    elevation={0}
                    sx={{ 
                      mb: 3,
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: v.status === 'Ενεργό' ? '#4caf50' : '#ff9800',
                      transition: 'all 0.3s',
                      '&:hover': { 
                        transform: 'translateY(-4px)', 
                        boxShadow: 4,
                        borderColor: v.status === 'Ενεργό' ? '#2e7d32' : '#f57c00'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: v.status === 'Ενεργό' ? '#4caf50' : '#ff9800',
                            width: 56,
                            height: 56
                          }}
                        >
                          <VaccinesIcon sx={{ fontSize: 28 }} />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="h6" fontWeight="700">
                              {v.name}
                            </Typography>
                            <Chip 
                              icon={v.status === 'Ενεργό' ? <CheckCircleIcon /> : <WarningIcon />}
                              label={v.status} 
                              color={v.status === 'Ενεργό' ? 'success' : 'warning'}
                              sx={{ fontWeight: 600 }}
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            <CalendarTodayIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                            Χορήγηση: {v.date}
                          </Typography>
                          <Typography variant="body2" color="success.main" fontWeight={600}>
                            <CalendarTodayIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                            Επόμενη δόση: {v.next}
                          </Typography>
                        </Box>
                        <IconButton 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDialog({
                              type: 'vaccine',
                              title: `Εμβόλιο: ${v.name}`,
                              data: v,
                              extraInfo: `Σύνθεση: Ζώντες ιοί\nΠαρενέργειες: Πιθανή ελαφριά πυρετός, νωθρότητα, απώλεια όρεξης για 24-48 ώρες\nΑποθήκευση: 2-8°C\nΧώρα Προέλευσης: Γερμανία\nΠροφυλάξεις: Μην χορηγείτε σε άρρωστα ή εξασθενημένα ζώα\nΑντενδείξεις: Εγκυμοσύνη, θηλασμός\nΑλληλεπιδράσεις: Αποφύγετε συγχορήγηση με κορτικοστεροειδή`
                            });
                          }}
                          sx={{ 
                            bgcolor: '#f5f5f5',
                            '&:hover': { bgcolor: '#e0e0e0' }
                          }}
                        >
                          <InfoIcon />
                        </IconButton>
                      </Box>

                      <Accordion 
                        elevation={0}
                        sx={{ 
                          bgcolor: 'transparent',
                          '&:before': { display: 'none' }
                        }}
                      >
                        <AccordionSummary 
                          expandIcon={<ExpandMoreIcon />}
                          sx={{ 
                            px: 0,
                            minHeight: 48,
                            '&.Mui-expanded': { minHeight: 48 }
                          }}
                        >
                          <Typography variant="body2" fontWeight={600} color="primary">
                            Περισσότερες πληροφορίες
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ px: 0, pt: 0 }}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                                <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block" gutterBottom>
                                  ΚΤΗΝΙΑΤΡΟΣ
                                </Typography>
                                <Typography variant="body2">Δρ. {v.vet}</Typography>
                              </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                                <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block" gutterBottom>
                                  ΚΛΙΝΙΚΗ
                                </Typography>
                                <Typography variant="body2">{v.clinic}</Typography>
                              </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                                <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block" gutterBottom>
                                  ΚΑΤΑΣΚΕΥΑΣΤΗΣ
                                </Typography>
                                <Typography variant="body2">{v.manufacturer}</Typography>
                              </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                                <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block" gutterBottom>
                                  ΑΡΙΘΜΟΣ ΠΑΡΤΙΔΑΣ
                                </Typography>
                                <Typography variant="body2" fontFamily="monospace" fontSize="0.9rem">
                                  {v.batchNumber}
                                </Typography>
                              </Paper>
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}

            {currentTab === 1 && (
              <Box>
                {history.length === 0 ? (
                  <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 3, border: '2px dashed #e0e0e0' }}>
                    <LocalHospitalIcon sx={{ fontSize: 60, color: '#bdbdbd', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Δεν υπάρχει ιστορικό
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Το ιατρικό ιστορικό θα ενημερώνεται μετά από κάθε επίσκεψη στον κτηνίατρο.
                    </Typography>
                  </Paper>
                ) : history.map((h, i) => (
                  <Card 
                    key={i}
                    elevation={0}
                    sx={{ 
                      mb: 3,
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: h.status === 'Υγιής' || h.status === 'Πλήρης ανάρρωση' ? '#2196f3' : '#ffc107',
                      transition: 'all 0.3s',
                      '&:hover': { 
                        transform: 'translateY(-4px)', 
                        boxShadow: 4,
                        borderColor: h.status === 'Υγιής' || h.status === 'Πλήρης ανάρρωση' ? '#1976d2' : '#ff9800'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: h.status === 'Υγιής' || h.status === 'Πλήρης ανάρρωση' ? '#2196f3' : '#ffc107',
                            width: 56,
                            height: 56
                          }}
                        >
                          <LocalHospitalIcon sx={{ fontSize: 28 }} />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="h6" fontWeight="700">
                              {h.reason}
                            </Typography>
                            <Chip 
                              label={h.status}
                              color={h.status === 'Υγιής' || h.status === 'Πλήρης ανάρρωση' ? 'info' : 'warning'}
                              sx={{ fontWeight: 600 }}
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            <CalendarTodayIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                            {h.date} • Δρ. {h.vet}
                          </Typography>
                          {h.weight && (
                            <Typography variant="body2" color="text.secondary">
                              Βάρος: {h.weight}
                            </Typography>
                          )}
                        </Box>
                        <IconButton 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDialog({
                              type: 'history',
                              title: `Επίσκεψη: ${h.reason}`,
                              data: h,
                              extraInfo: `Διάρκεια Επίσκεψης: 45 λεπτά\nΚόστος: €85\nΑσφαλιστική Κάλυψη: Ναι (80%)\nΕπόμενο Ραντεβού: ${h.followup || 'Όχι απαραίτητο'}\nΣημειώσεις Κτηνιάτρου: ${h.reason === 'Ετήσιος Έλεγχος' ? 'Το ζώο είναι σε άριστη κατάσταση. Συνεχίστε το τρέχον διατροφικό πρόγραμμα.' : 'Απαιτείται παρακολούθηση. Τηλεφωνήστε αν επιδεινωθούν τα συμπτώματα.'}\nΠροτάσεις Διατροφής: ${h.reason === 'Γαστρεντερίτιδα' ? 'Ελαφριά διατροφή για 7 ημέρες - ρύζι και κοτόπουλο' : 'Κανονική διατροφή'}`
                            });
                          }}
                          sx={{ 
                            bgcolor: '#f5f5f5',
                            '&:hover': { bgcolor: '#e0e0e0' }
                          }}
                        >
                          <InfoIcon />
                        </IconButton>
                      </Box>

                      <Accordion 
                        elevation={0}
                        sx={{ 
                          bgcolor: 'transparent',
                          '&:before': { display: 'none' }
                        }}
                      >
                        <AccordionSummary 
                          expandIcon={<ExpandMoreIcon />}
                          sx={{ 
                            px: 0,
                            minHeight: 48,
                            '&.Mui-expanded': { minHeight: 48 }
                          }}
                        >
                          <Typography variant="body2" fontWeight={600} color="primary">
                            Λεπτομέρειες επίσκεψης
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ px: 0, pt: 0 }}>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Paper elevation={0} sx={{ p: 2, bgcolor: '#fff3e0', borderRadius: 2, border: '1px solid #ffb74d' }}>
                                <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block" gutterBottom>
                                  ΣΥΜΠΤΩΜΑΤΑ
                                </Typography>
                                <Typography variant="body2">{h.symptoms}</Typography>
                              </Paper>
                            </Grid>
                            <Grid item xs={12}>
                              <Paper elevation={0} sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 2, border: '1px solid #64b5f6' }}>
                                <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block" gutterBottom>
                                  ΔΙΑΓΝΩΣΗ
                                </Typography>
                                <Typography variant="body2" fontWeight="bold">{h.diagnosis}</Typography>
                              </Paper>
                            </Grid>
                            <Grid item xs={12}>
                              <Paper elevation={0} sx={{ p: 2, bgcolor: '#e8f5e9', borderRadius: 2, border: '1px solid #81c784' }}>
                                <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block" gutterBottom>
                                  ΘΕΡΑΠΕΙΑ
                                </Typography>
                                <Typography variant="body2">{h.treatment}</Typography>
                              </Paper>
                            </Grid>
                            {h.medications && (
                              <Grid item xs={12}>
                                <Paper elevation={0} sx={{ p: 2, bgcolor: '#ffebee', borderRadius: 2, border: '2px solid #ef5350' }}>
                                  <Typography variant="caption" color="error" fontWeight="bold" display="block" gutterBottom>
                                    💊 ΦΑΡΜΑΚΑ
                                  </Typography>
                                  <Typography variant="body2" fontWeight="600">{h.medications}</Typography>
                                </Paper>
                              </Grid>
                            )}
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}

            {!isAuthenticated && (
              <Typography color="error" sx={{ mt: 4, textAlign: 'center', p: 3, bgcolor: 'error.light', borderRadius: 2 }}>
                Πρέπει να συνδεθείτε για να δείτε τις πληροφορίες υγείας του ζώου.
              </Typography>
            )}
          </Container>
        </Box>
      </Box>

      {/* Info Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '16px' }
        }}
      >
        {dialogContent && (
          <>
            <DialogTitle sx={{ 
              bgcolor: dialogContent.type === 'pet' ? '#667eea' : dialogContent.type === 'vaccine' ? '#4caf50' : '#2196f3',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Typography variant="h6" fontWeight="bold">{dialogContent.title}</Typography>
              <IconButton onClick={handleCloseDialog} sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              {dialogContent.type === 'pet' && (
                <Box>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary" fontWeight="bold">ΟΝΟΜΑ</Typography>
                      <Typography variant="body1" fontWeight="bold">{dialogContent.data.name}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary" fontWeight="bold">ΕΙΔΟΣ</Typography>
                      <Typography variant="body1">{dialogContent.data.species}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary" fontWeight="bold">ΦΥΛΗ</Typography>
                      <Typography variant="body1">{dialogContent.data.breed}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="caption" color="text.secondary" fontWeight="bold">ΠΛΗΡΕΙΣ ΠΛΗΡΟΦΟΡΙΕΣ</Typography>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mt: 1 }}>
                        {dialogContent.data.details}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
              {dialogContent.type === 'vaccine' && (
                <Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary" fontWeight="bold">ΕΜΒΟΛΙΟ</Typography>
                      <Typography variant="h6" fontWeight="bold" color="primary">{dialogContent.data.name}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary" fontWeight="bold">ΚΑΤΑΣΤΑΣΗ</Typography>
                      <Chip label={dialogContent.data.status} color={dialogContent.data.status === 'Ενεργό' ? 'success' : 'warning'} size="small" sx={{ mt: 0.5 }} />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary" fontWeight="bold">ΚΑΤΑΣΚΕΥΑΣΤΗΣ</Typography>
                      <Typography variant="body2" fontWeight="bold">{dialogContent.data.manufacturer}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary" fontWeight="bold">ΗΜΕΡΟΜΗΝΙΑ</Typography>
                      <Typography variant="body2">{dialogContent.data.date}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary" fontWeight="bold">ΕΠΟΜΕΝΗ ΔΟΣΗ</Typography>
                      <Typography variant="body2" color="success.main" fontWeight="bold">{dialogContent.data.next}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary" fontWeight="bold">ΚΛΙΝΙΚΗ</Typography>
                      <Typography variant="body2">{dialogContent.data.clinic}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary" fontWeight="bold">ΚΤΗΝΙΑΤΡΟΣ</Typography>
                      <Typography variant="body2">Δρ. {dialogContent.data.vet}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary" fontWeight="bold">ΑΡΙΘΜΟΣ ΠΑΡΤΙΔΑΣ</Typography>
                      <Typography variant="body2" fontFamily="monospace" sx={{ bgcolor: '#f5f5f5', p: 1, borderRadius: 1 }}>{dialogContent.data.batchNumber}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="caption" color="text.secondary" fontWeight="bold">ΕΠΙΠΛΕΟΝ ΠΛΗΡΟΦΟΡΙΕΣ</Typography>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mt: 1, bgcolor: '#f9f9f9', p: 2, borderRadius: 1 }}>
                        {dialogContent.extraInfo}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
              {dialogContent.type === 'history' && (
                <Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary" fontWeight="bold">ΛΟΓΟΣ ΕΠΙΣΚΕΨΗΣ</Typography>
                      <Typography variant="h6" fontWeight="bold" color="secondary">{dialogContent.data.reason}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary" fontWeight="bold">ΗΜΕΡΟΜΗΝΙΑ</Typography>
                      <Typography variant="body2" fontWeight="bold">{dialogContent.data.date}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary" fontWeight="bold">ΚΑΤΑΣΤΑΣΗ</Typography>
                      <Chip label={dialogContent.data.status} color={dialogContent.data.status.includes('Υγιής') || dialogContent.data.status.includes('ανάρρωση') ? 'success' : 'warning'} size="small" />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary" fontWeight="bold">ΚΤΗΝΙΑΤΡΟΣ</Typography>
                      <Typography variant="body2">Δρ. {dialogContent.data.vet}</Typography>
                    </Grid>
                    {dialogContent.data.weight && (
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">ΒΑΡΟΣ</Typography>
                        <Typography variant="body2" fontWeight="bold" color="primary">{dialogContent.data.weight}</Typography>
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary" fontWeight="bold">ΣΥΜΠΤΩΜΑΤΑ</Typography>
                      <Typography variant="body2">{dialogContent.data.symptoms}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary" fontWeight="bold">ΔΙΑΓΝΩΣΗ</Typography>
                      <Typography variant="body2" fontWeight="bold" color="error.main">{dialogContent.data.diagnosis}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary" fontWeight="bold">ΘΕΡΑΠΕΙΑ</Typography>
                      <Typography variant="body2">{dialogContent.data.treatment}</Typography>
                    </Grid>
                    {dialogContent.data.medications && (
                      <Grid item xs={12}>
                        <Paper elevation={0} sx={{ p: 2, bgcolor: '#ffebee', border: '1px solid #ef5350', borderRadius: 1 }}>
                          <Typography variant="caption" color="error.main" fontWeight="bold">ΦΑΡΜΑΚΑ</Typography>
                          <Typography variant="body2" fontWeight="bold">{dialogContent.data.medications}</Typography>
                        </Paper>
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="caption" color="text.secondary" fontWeight="bold">ΕΠΙΠΛΕΟΝ ΠΛΗΡΟΦΟΡΙΕΣ & ΣΥΣΤΑΣΕΙΣ</Typography>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mt: 1, bgcolor: '#f9f9f9', p: 2, borderRadius: 1 }}>
                        {dialogContent.extraInfo}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={handleCloseDialog} variant="contained" sx={{ bgcolor: '#667eea' }}>
                Κλείσιμο
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}