import React, { useState } from 'react';
import {
  Box, Container, Grid, Typography, Paper, Tabs, Tab, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, Alert, Divider, IconButton, List, ListItem,
  ListItemText, ListItemSecondaryAction, Avatar
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import PageHeader from './PageHeader';

// Icons
import AddIcon from '@mui/icons-material/Add';
import PetsIcon from '@mui/icons-material/Pets';
import DescriptionIcon from '@mui/icons-material/Description';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import MedicationIcon from '@mui/icons-material/Medication';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

const theme = createTheme({
  palette: {
    primary: { main: '#00695c' },
    secondary: { main: '#FFA726' },
    background: { default: '#f9f9f9' }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
});

// Mock Data
const PRESCRIPTIONS = [
  { id: 1, date: '20 Δεκ 2024', petName: 'Μπόμπι', ownerName: 'Γιάννης Παπαδόπουλος', medicine: 'Antibiotica 250mg', dosage: '2x ημερησίως', duration: '7 ημέρες', notes: 'Μετά από γεύμα' },
  { id: 2, date: '18 Δεκ 2024', petName: 'Λούλα', ownerName: 'Μαρία Γεωργίου', medicine: 'Antiparasitic Drops', dosage: '1 φορά', duration: 'Μία δόση', notes: 'Εξωτερική χρήση' },
  { id: 3, date: '15 Δεκ 2024', petName: 'Ρεξ', ownerName: 'Νίκος Αθανασίου', medicine: 'Pain Relief', dosage: '1x ημερησίως', duration: '5 ημέρες', notes: 'Σε περίπτωση πόνου' },
];

const NEW_PETS = [
  { id: 1, name: 'Μπόμπι', type: 'Σκύλος', breed: 'Golden Retriever', age: '2 έτη', owner: 'Γιάννης Παπαδόπουλος', microchip: 'GR-2023-001234', date: '20 Δεκ 2024' },
  { id: 2, name: 'Λούλα', type: 'Γάτα', breed: 'Περσική', age: '3 έτη', owner: 'Μαρία Γεωργίου', microchip: 'GR-2023-005678', date: '18 Δεκ 2024' },
  { id: 3, name: 'Ρεξ', type: 'Σκύλος', breed: 'Labrador', age: '4 έτη', owner: 'Νίκος Αθανασίου', microchip: 'GR-2023-009012', date: '15 Δεκ 2024' },
];

export default function VetRecords() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  
  // Prescription Dialog
  const [openPrescription, setOpenPrescription] = useState(false);
  const [prescriptionForm, setPrescriptionForm] = useState({
    petName: '',
    ownerName: '',
    petType: '',
    diagnosis: '',
    medicine: '',
    dosage: '',
    frequency: '',
    duration: '',
    prescriptionDate: new Date().toISOString().split('T')[0],
    nextVisit: '',
    warnings: '',
    notes: ''
  });

  // New Pet Dialog
  const [openNewPet, setOpenNewPet] = useState(false);
  const [petForm, setPetForm] = useState({
    name: '',
    type: '',
    breed: '',
    age: '',
    gender: '',
    color: '',
    weight: '',
    microchip: '',
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    ownerAddress: ''
  });

  const [successDialog, setSuccessDialog] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSavePrescription = () => {
    // Save prescription logic
    setOpenPrescription(false);
    setPrescriptionForm({
      petName: '',
      ownerName: '',
      petType: '',
      diagnosis: '',
      medicine: '',
      dosage: '',
      frequency: '',
      duration: '',
      prescriptionDate: new Date().toISOString().split('T')[0],
      nextVisit: '',
      warnings: '',
      notes: ''
    });
    setSuccessDialog(true);
  };

  const handleSavePet = () => {
    // Save pet logic
    setOpenNewPet(false);
    setPetForm({
      name: '',
      type: '',
      breed: '',
      age: '',
      gender: '',
      color: '',
      weight: '',
      microchip: '',
      ownerName: '',
      ownerPhone: '',
      ownerEmail: '',
      ownerAddress: ''
    });
    setSuccessDialog(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f9f9f9', pb: 8, display: 'flex', flexDirection: 'column' }}>
        
        <Container maxWidth="xl" sx={{ pt: 2 }}>
          <PageHeader />
        </Container>

        {/* HERO HEADER */}
        <Box sx={{ bgcolor: '#00695c', py: 6, mb: 4, color: 'white', textAlign: 'center' }}>
          <Container maxWidth="md">
            <DescriptionIcon sx={{ fontSize: 60, mb: 2, opacity: 0.8 }} />
            <Typography variant="h4" fontWeight="bold">Συνταγογραφήσεις & Καταγραφές</Typography>
            <Typography variant="body1" sx={{ opacity: 0.8, mt: 1 }}>
              Διαχειριστείτε συνταγές φαρμάκων και καταχωρήστε νέα ζώα στην πλατφόρμα
            </Typography>
          </Container>
        </Box>

        {/* Main Layout */}
        <Box sx={{ display: 'flex', flex: 1, maxWidth: '100vw', overflow: 'hidden', p: 2, gap: 2 }}>
          <DashboardSidebar />

          <Container maxWidth="lg" sx={{ overflowY: 'auto', py: 4 }}>
            
            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<LocalPharmacyIcon />}
                onClick={() => setOpenPrescription(true)}
                sx={{ px: 3, py: 1.5 }}
              >
                Νέα Συνταγή
              </Button>
            </Box>

            {/* TABS */}
            <Paper sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                variant="fullWidth"
                textColor="primary"
                indicatorColor="primary"
                sx={{ '& .MuiTab-root': { fontWeight: 'bold', py: 2 } }}
              >
                <Tab icon={<LocalPharmacyIcon />} iconPosition="start" label="Συνταγές" />
                <Tab icon={<PetsIcon />} iconPosition="start" label="Νέα Ζώα" />
              </Tabs>
            </Paper>

            {/* TAB 0: PRESCRIPTIONS */}
            {tabValue === 0 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 3 }}>Πρόσφατες Συνταγές</Typography>
                <Grid container spacing={3}>
                  {PRESCRIPTIONS.map((item) => (
                    <Grid item xs={12} key={item.id}>
                      <Paper sx={{ p: 3, borderRadius: 3, '&:hover': { boxShadow: 4 }, transition: '0.3s' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                              <LocalPharmacyIcon fontSize="large" />
                            </Avatar>
                            <Box>
                              <Typography variant="h6" fontWeight="bold">{item.petName}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                Ιδιοκτήτης: {item.ownerName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {item.date}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton size="small" color="primary">
                              <EditIcon />
                            </IconButton>
                            <IconButton size="small" color="error">
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="caption" color="text.secondary" fontWeight="bold">ΦΑΡΜΑΚΟ</Typography>
                            <Typography variant="body1">{item.medicine}</Typography>
                          </Grid>
                          <Grid item xs={6} sm={2}>
                            <Typography variant="caption" color="text.secondary" fontWeight="bold">ΔΟΣΟΛΟΓΙΑ</Typography>
                            <Typography variant="body1">{item.dosage}</Typography>
                          </Grid>
                          <Grid item xs={6} sm={2}>
                            <Typography variant="caption" color="text.secondary" fontWeight="bold">ΔΙΑΡΚΕΙΑ</Typography>
                            <Typography variant="body1">{item.duration}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="caption" color="text.secondary" fontWeight="bold">ΣΗΜΕΙΩΣΕΙΣ</Typography>
                            <Typography variant="body2">{item.notes}</Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* TAB 1: NEW PETS */}
            {tabValue === 1 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 3 }}>Πρόσφατα Καταγεγραμμένα Ζώα</Typography>
                <Grid container spacing={3}>
                  {NEW_PETS.map((item) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
                      <Paper sx={{ p: 3, borderRadius: 3, '&:hover': { boxShadow: 4 }, transition: '0.3s' }}>
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                          <Avatar sx={{ bgcolor: 'secondary.main', width: 56, height: 56 }}>
                            <PetsIcon fontSize="large" />
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight="bold">{item.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.breed} • {item.age}
                            </Typography>
                            <Chip label={item.type} size="small" color="primary" sx={{ mt: 0.5 }} />
                          </Box>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" color="text.secondary" fontWeight="bold">ΙΔΙΟΚΤΗΤΗΣ</Typography>
                            <Typography variant="body2">{item.owner}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" color="text.secondary" fontWeight="bold">MICROCHIP</Typography>
                            <Typography variant="body2" fontFamily="monospace">{item.microchip}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" color="text.secondary" fontWeight="bold">ΚΑΤΑΧΩΡΗΣΗ</Typography>
                            <Typography variant="body2">{item.date}</Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

          </Container>
        </Box>

        {/* NEW PRESCRIPTION DIALOG */}
        <Dialog 
          open={openPrescription} 
          onClose={() => setOpenPrescription(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="bold">Νέα Συνταγή</Typography>
            <IconButton onClick={() => setOpenPrescription(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            {/* SECTION 1: Patient Info */}
            <Paper elevation={0} sx={{ p: 3, bgcolor: '#f5f5f5', borderRadius: 2, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PetsIcon color="primary" /> Στοιχεία Ασθενούς
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Όνομα Ζώου" 
                    value={prescriptionForm.petName}
                    onChange={(e) => setPrescriptionForm({...prescriptionForm, petName: e.target.value})}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Είδος</InputLabel>
                    <Select 
                      label="Είδος"
                      value={prescriptionForm.petType}
                      onChange={(e) => setPrescriptionForm({...prescriptionForm, petType: e.target.value})}
                    >
                      <MenuItem value="Σκύλος">Σκύλος</MenuItem>
                      <MenuItem value="Γάτα">Γάτα</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField 
                    fullWidth 
                    label="Όνομα Ιδιοκτήτη" 
                    value={prescriptionForm.ownerName}
                    onChange={(e) => setPrescriptionForm({...prescriptionForm, ownerName: e.target.value})}
                    size="small"
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* SECTION 2: Diagnosis */}
            <Paper elevation={0} sx={{ p: 3, bgcolor: '#e8f5e9', borderRadius: 2, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MedicalServicesIcon color="success" /> Διάγνωση
              </Typography>
              <TextField 
                fullWidth 
                label="Διάγνωση" 
                value={prescriptionForm.diagnosis}
                onChange={(e) => setPrescriptionForm({...prescriptionForm, diagnosis: e.target.value})}
                placeholder="π.χ. Λοίμωξη αναπνευστικού"
                multiline
                rows={2}
                size="small"
              />
            </Paper>

            {/* SECTION 3: Medication */}
            <Paper elevation={0} sx={{ p: 3, bgcolor: '#fff3e0', borderRadius: 2, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalPharmacyIcon color="warning" /> Φαρμακευτική Αγωγή
              </Typography>
              
              {/* Common Medicines Chips */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Συχνά Φάρμακα:</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {['Antibiotica 250mg', 'Antiparasitic Drops', 'Pain Relief', 'Anti-inflammatory', 'Vitamin Supplement'].map((med) => (
                    <Chip 
                      key={med}
                      label={med} 
                      size="small" 
                      onClick={() => setPrescriptionForm({...prescriptionForm, medicine: med})}
                      sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'primary.light', color: 'white' } }}
                    />
                  ))}
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField 
                    fullWidth 
                    label="Φάρμακο" 
                    value={prescriptionForm.medicine}
                    onChange={(e) => setPrescriptionForm({...prescriptionForm, medicine: e.target.value})}
                    placeholder="π.χ. Antibiotica 250mg"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField 
                    fullWidth 
                    label="Δοσολογία" 
                    value={prescriptionForm.dosage}
                    onChange={(e) => setPrescriptionForm({...prescriptionForm, dosage: e.target.value})}
                    placeholder="π.χ. 1 δισκίο"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Συχνότητα</InputLabel>
                    <Select 
                      label="Συχνότητα"
                      value={prescriptionForm.frequency}
                      onChange={(e) => setPrescriptionForm({...prescriptionForm, frequency: e.target.value})}
                    >
                      <MenuItem value="1x ημερησίως">1x ημερησίως</MenuItem>
                      <MenuItem value="2x ημερησίως">2x ημερησίως</MenuItem>
                      <MenuItem value="3x ημερησίως">3x ημερησίως</MenuItem>
                      <MenuItem value="Κάθε 8 ώρες">Κάθε 8 ώρες</MenuItem>
                      <MenuItem value="Κάθε 12 ώρες">Κάθε 12 ώρες</MenuItem>
                      <MenuItem value="Εφάπαξ">Εφάπαξ</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField 
                    fullWidth 
                    label="Διάρκεια" 
                    value={prescriptionForm.duration}
                    onChange={(e) => setPrescriptionForm({...prescriptionForm, duration: e.target.value})}
                    placeholder="π.χ. 7 ημέρες"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Alert severity="warning" icon={<MedicationIcon />}>
                    <TextField 
                      fullWidth 
                      label="Προειδοποιήσεις" 
                      value={prescriptionForm.warnings}
                      onChange={(e) => setPrescriptionForm({...prescriptionForm, warnings: e.target.value})}
                      placeholder="π.χ. Μετά από γεύμα, Να αποφεύγεται η έκθεση στον ήλιο"
                      size="small"
                      variant="standard"
                    />
                  </Alert>
                </Grid>
              </Grid>
            </Paper>

            {/* SECTION 4: Follow-up & Notes */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label="Ημερομηνία Συνταγής" 
                  type="date"
                  value={prescriptionForm.prescriptionDate}
                  onChange={(e) => setPrescriptionForm({...prescriptionForm, prescriptionDate: e.target.value})}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label="Επόμενη Επίσκεψη" 
                  type="date"
                  value={prescriptionForm.nextVisit}
                  onChange={(e) => setPrescriptionForm({...prescriptionForm, nextVisit: e.target.value})}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  label="Σημειώσεις" 
                  multiline
                  rows={3}
                  value={prescriptionForm.notes}
                  onChange={(e) => setPrescriptionForm({...prescriptionForm, notes: e.target.value})}
                  placeholder="Επιπλέον οδηγίες και παρατηρήσεις..."
                  size="small"
                />
              </Grid>
            </Grid>

            {/* PREVIEW SECTION */}
            {(prescriptionForm.petName || prescriptionForm.medicine) && (
              <Paper elevation={2} sx={{ p: 3, mt: 3, bgcolor: '#f9fbe7', borderLeft: '4px solid #00695c' }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>ΠΡΟΕΠΙΣΚΟΠΗΣΗ ΣΥΝΤΑΓΗΣ</Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={1}>
                  {prescriptionForm.petName && (
                    <Grid item xs={12}>
                      <Typography variant="body2"><strong>Ασθενής:</strong> {prescriptionForm.petName} {prescriptionForm.petType && `(${prescriptionForm.petType})`}</Typography>
                    </Grid>
                  )}
                  {prescriptionForm.ownerName && (
                    <Grid item xs={12}>
                      <Typography variant="body2"><strong>Ιδιοκτήτης:</strong> {prescriptionForm.ownerName}</Typography>
                    </Grid>
                  )}
                  {prescriptionForm.diagnosis && (
                    <Grid item xs={12}>
                      <Typography variant="body2"><strong>Διάγνωση:</strong> {prescriptionForm.diagnosis}</Typography>
                    </Grid>
                  )}
                  {prescriptionForm.medicine && (
                    <Grid item xs={12}>
                      <Typography variant="body2">
                        <strong>Φάρμακο:</strong> {prescriptionForm.medicine} 
                        {prescriptionForm.dosage && ` - ${prescriptionForm.dosage}`}
                        {prescriptionForm.frequency && ` ${prescriptionForm.frequency}`}
                        {prescriptionForm.duration && ` για ${prescriptionForm.duration}`}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenPrescription(false)} color="inherit">Ακύρωση</Button>
            <Button 
              onClick={handleSavePrescription} 
              variant="contained" 
              startIcon={<SaveIcon />}
              color="primary"
            >
              Αποθήκευση
            </Button>
          </DialogActions>
        </Dialog>

        {/* NEW PET DIALOG */}
        <Dialog 
          open={openNewPet} 
          onClose={() => setOpenNewPet(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle sx={{ bgcolor: 'secondary.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="bold">Καταγραφή Νέου Ζώου</Typography>
            <IconButton onClick={() => setOpenNewPet(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Στοιχεία Ζώου</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Όνομα Ζώου" 
                    value={petForm.name}
                    onChange={(e) => setPetForm({...petForm, name: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Είδος</InputLabel>
                    <Select 
                      label="Είδος"
                      value={petForm.type}
                      onChange={(e) => setPetForm({...petForm, type: e.target.value})}
                    >
                      <MenuItem value="Σκύλος">Σκύλος</MenuItem>
                      <MenuItem value="Γάτα">Γάτα</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Ράτσα" 
                    value={petForm.breed}
                    onChange={(e) => setPetForm({...petForm, breed: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Ηλικία" 
                    value={petForm.age}
                    onChange={(e) => setPetForm({...petForm, age: e.target.value})}
                    placeholder="π.χ. 2 έτη"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Φύλο</InputLabel>
                    <Select 
                      label="Φύλο"
                      value={petForm.gender}
                      onChange={(e) => setPetForm({...petForm, gender: e.target.value})}
                    >
                      <MenuItem value="Αρσενικό">Αρσενικό</MenuItem>
                      <MenuItem value="Θηλυκό">Θηλυκό</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Χρώμα" 
                    value={petForm.color}
                    onChange={(e) => setPetForm({...petForm, color: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Βάρος (kg)" 
                    type="number"
                    value={petForm.weight}
                    onChange={(e) => setPetForm({...petForm, weight: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Microchip" 
                    value={petForm.microchip}
                    onChange={(e) => setPetForm({...petForm, microchip: e.target.value})}
                    placeholder="π.χ. GR-2024-001234"
                  />
                </Grid>
              </Grid>
            
            <Divider sx={{ my: 4 }} />
            
            <Typography variant="h6" sx={{ mb: 3 }}>Στοιχεία Ιδιοκτήτη</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField 
                    fullWidth 
                    label="Ονοματεπώνυμο Ιδιοκτήτη" 
                    value={petForm.ownerName}
                    onChange={(e) => setPetForm({...petForm, ownerName: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Τηλέφωνο" 
                    value={petForm.ownerPhone}
                    onChange={(e) => setPetForm({...petForm, ownerPhone: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Email" 
                    type="email"
                    value={petForm.ownerEmail}
                    onChange={(e) => setPetForm({...petForm, ownerEmail: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField 
                    fullWidth 
                    label="Διεύθυνση" 
                    value={petForm.ownerAddress}
                    onChange={(e) => setPetForm({...petForm, ownerAddress: e.target.value})}
                  />
                </Grid>
              </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenNewPet(false)} color="inherit">Ακύρωση</Button>
            <Button 
              onClick={handleSavePet} 
              variant="contained" 
              startIcon={<SaveIcon />}
              color="secondary"
            >
              Καταχώρηση
            </Button>
          </DialogActions>
        </Dialog>

        {/* SUCCESS DIALOG */}
        <Dialog open={successDialog} onClose={() => setSuccessDialog(false)}>
          <DialogContent sx={{ textAlign: 'center', p: 5 }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" fontWeight="bold">Επιτυχής Καταχώρηση!</Typography>
            <Typography sx={{ mb: 3, mt: 1 }}>Η καταχώρηση ολοκληρώθηκε με επιτυχία.</Typography>
            <Button variant="contained" onClick={() => setSuccessDialog(false)}>OK</Button>
          </DialogContent>
        </Dialog>

      </Box>
    </ThemeProvider>
  );
}
