import React, { useEffect, useMemo, useState } from 'react';
import {
  Box, Container, Grid, Typography, Paper, Tabs, Tab, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, Alert, Divider, IconButton, Avatar,
  Checkbox, FormControlLabel
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DashboardSidebar from '../components/DashboardSidebar';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageHeader from './PageHeader';
import { petsAPI, usersAPI, appointmentsAPI, prescriptionsAPI, lostPetsAPI, foundPetsAPI, visitsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Εικονίδια
import PetsIcon from '@mui/icons-material/Pets';
import DescriptionIcon from '@mui/icons-material/Description';
import MedicationIcon from '@mui/icons-material/Medication';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

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

// Mock δεδομένα
const PRESCRIPTIONS = [
  { id: 1, date: '20 Δεκ 2024', petName: 'Μπόμπι', ownerName: 'Γιάννης Παπαδόπουλος', medicine: 'Antibiotica 250mg', dosage: '2x ημερησίως', duration: '7 ημέρες', notes: 'Μετά από γεύμα' },
  { id: 2, date: '18 Δεκ 2024', petName: 'Λούλα', ownerName: 'Μαρία Γεωργίου', medicine: 'Antiparasitic Drops', dosage: '1 φορά', duration: 'Μία δόση', notes: 'Εξωτερική χρήση' },
  { id: 3, date: '15 Δεκ 2024', petName: 'Ρεξ', ownerName: 'Νίκος Αθανασίου', medicine: 'Pain Relief', dosage: '1x ημερησίως', duration: '5 ημέρες', notes: 'Σε περίπτωση πόνου' },
];

// Η κατάσταση ζωντανών συνταγών μεταφέρθηκε στο VetRecords για να τηρηθούν οι κανόνες hooks


// Fallback data in case server is unavailable
const NEW_PETS_FALLBACK = [
  { id: 'fallback-1', name: 'Μπόμπι', type: 'Σκύλος', breed: 'Golden Retriever', age: '2 έτη', owner: 'Γιάννης Παπαδόπουλος', microchip: 'GR-2023-001234', date: '20 Δεκ 2024' },
  { id: 'fallback-2', name: 'Λούλα', type: 'Γάτα', breed: 'Περσική', age: '3 έτη', owner: 'Μαρία Γεωργίου', microchip: 'GR-2023-005678', date: '18 Δεκ 2024' },
  { id: 'fallback-3', name: 'Ρεξ', type: 'Σκύλος', breed: 'Labrador', age: '4 έτη', owner: 'Νίκος Αθανασίου', microchip: 'GR-2023-009012', date: '15 Δεκ 2024' },
];

export default function VetRecords() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [searchParams] = useSearchParams();

  // Άνοιγμα διαλόγων με βάση τα query params (π.χ. ?open=prescription&appointmentId=123)
  useEffect(() => {
    try {
      const open = searchParams.get('open');
      const apptId = searchParams.get('appointmentId');
      if (!open) return;
      if (open === 'prescription') {
        // Prefill prescription from appointment when possible
        if (apptId) {
          (async () => {
            try {
              const data = await appointmentsAPI.getAll();
              const appt = (Array.isArray(data) ? data : []).find(a => String(a.id) === String(apptId));
              if (appt) {
                setPrescriptionForm(prev => ({ ...prev, petName: appt.petName || appt.pet?.name || '', ownerName: appt.ownerName || appt.owner?.name || '' }));
              }
            } catch (e) { /* ignore */ }
            setOpenPrescription(true);
          })();
        } else setOpenPrescription(true);
      }
      if (open === 'loss') {
        if (apptId) {
          (async () => {
            try {
              const data = await appointmentsAPI.getAll();
              const appt = (Array.isArray(data) ? data : []).find(a => String(a.id) === String(apptId));
              if (appt) setLossForm(prev => ({ ...prev, description: (appt.detailNotes && appt.detailNotes['loss']) || appt.reason || prev.description }));
            } catch (e) {}
            setOpenLoss(true);
          })();
        } else setOpenLoss(true);
      }
      if (open === 'found') {
        if (apptId) {
          (async () => {
            try {
              const data = await appointmentsAPI.getAll();
              const appt = (Array.isArray(data) ? data : []).find(a => String(a.id) === String(apptId));
              if (appt) setFoundForm(prev => ({ ...prev, description: (appt.detailNotes && appt.detailNotes['found']) || appt.reason || prev.description }));
            } catch (e) {}
            setOpenFound(true);
          })();
        } else setOpenFound(true);
      }
      if (open === 'transfer') {
        // If appointment contains transfer notes, prefill
        if (apptId) {
          (async () => {
            try {
              const data = await appointmentsAPI.getAll();
              const appt = (Array.isArray(data) ? data : []).find(a => String(a.id) === String(apptId));
              if (appt) setTransferForm(prev => ({ ...prev, notes: (appt.detailNotes && appt.detailNotes['transfer']) || appt.reason || prev.notes }));
            } catch (e) {}
            setOpenTransfer(true);
          })();
        } else setOpenTransfer(true);
      }
    } catch (err) { console.error('[open param effect]', err); }
  }, [searchParams]);
  const [recentPets, setRecentPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(false);
  const [pendingRegCount, setPendingRegCount] = useState(0);

  const [owners, setOwners] = useState([]);
  const [clientOwners, setClientOwners] = useState([]);
  const [allPets, setAllPets] = useState([]);
  const [loadingOwners, setLoadingOwners] = useState(false);
  const [loadingAllPets, setLoadingAllPets] = useState(false);
  
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

  // Live prescriptions state (loads from API with fallback)
  const [prescriptions, setPrescriptions] = useState([]);
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(false);
  const [prescriptionError, setPrescriptionError] = useState('');
  const [savingPrescription, setSavingPrescription] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingPrescriptions(true);
      setPrescriptionError('');
      try {
        const data = await prescriptionsAPI.getAll();
        if (!mounted) return;
        // Show newest first
        setPrescriptions(Array.isArray(data) ? data.slice().reverse() : []);
      } catch (e) {
        console.warn('Failed to load prescriptions; using fallback.', e);
        if (!mounted) return;
        setPrescriptions(PRESCRIPTIONS);
        setPrescriptionError('Σφάλμα φόρτωσης συνταγών. Εμφανίζονται δείγμα δεδομένων.');
      } finally {
        if (mounted) setLoadingPrescriptions(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleDeletePrescription = async (id) => {
    if (!window.confirm('Διαγραφή συνταγής;')) return;
    try {
      await prescriptionsAPI.delete(id);
      setPrescriptions(prev => prev.filter(p => String(p.id) !== String(id)));
    } catch (e) {
      console.error('Failed to delete prescription', e);
    }
  };

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
  const [successMessage, setSuccessMessage] = useState('Η καταχώρηση ολοκληρώθηκε με επιτυχία.');

  // Vet Actions: Loss, Found, Transfer/Adoption
  const [openLoss, setOpenLoss] = useState(false);
  const [openFound, setOpenFound] = useState(false);
  const [openTransfer, setOpenTransfer] = useState(false);

  const [lossForm, setLossForm] = useState({
    ownerId: '',
    petId: '',
    lostDate: new Date().toISOString().split('T')[0],
    location: '',
    description: '',
    reward: '',
    urgent: false,
    phone: '',
    email: '',
    preferredContact: 'Τηλέφωνο',
  });
  const [lossError, setLossError] = useState('');
  const [savingLoss, setSavingLoss] = useState(false);

  const [foundForm, setFoundForm] = useState({
    type: '',
    description: '',
    location: '',
    foundAt: '',
    hasOwner: false,
  });
  const [foundImages, setFoundImages] = useState([]);
  const [foundImageUrl, setFoundImageUrl] = useState('');
  const [foundError, setFoundError] = useState('');
  const [savingFound, setSavingFound] = useState(false);

  const [transferForm, setTransferForm] = useState({
    ownerId: '',
    petId: '',
    newOwnerId: '',
    type: 'transfer',
    notes: '',
    effectiveDate: new Date().toISOString().split('T')[0],
  });
  const [transferError, setTransferError] = useState('');
  const [savingTransfer, setSavingTransfer] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Mark appointment completed helper
  const markAppointmentCompleted = async (apptId, meta = {}) => {
    if (!apptId) return;
    try {
      const all = await appointmentsAPI.getAll();
      const appt = (Array.isArray(all) ? all : []).find(a => String(a.id) === String(apptId));
      if (!appt) return;
      const updated = {
        ...appt,
        status: 'completed',
        note: meta.note || appt.note || '',
        diagnosis: meta.diagnosis || appt.diagnosis || '',
        treatment: meta.treatment || appt.treatment || '',
        nextVisit: meta.nextVisit || appt.nextVisit || '',
        updatedAt: new Date().toISOString()
      };
      await appointmentsAPI.update(apptId, updated);
      // Record pet visit and update vet visitedPets
      try {
        await visitsAPI.recordVisit(updated);
      } catch (err) { console.error('[record visit after mark complete]', err); }
      // Navigate back to schedule for immediate feedback
      navigate('/vet/schedule');
    } catch (e) {
      console.error('[markAppointmentCompleted]', e);
    }
  };

  const handleSavePrescription = async () => {
    setSavingPrescription(true);
    setPrescriptionError('');
    try {
      const payload = {
        petName: prescriptionForm.petName,
        ownerName: prescriptionForm.ownerName,
        petType: prescriptionForm.petType,
        diagnosis: prescriptionForm.diagnosis,
        medicine: prescriptionForm.medicine,
        dosage: prescriptionForm.dosage,
        frequency: prescriptionForm.frequency,
        duration: prescriptionForm.duration,
        date: prescriptionForm.prescriptionDate || new Date().toISOString().split('T')[0],
        nextVisit: prescriptionForm.nextVisit,
        warnings: prescriptionForm.warnings,
        notes: prescriptionForm.notes
      };
      const created = await prescriptionsAPI.create(payload);
      // Prepend newest
      setPrescriptions(prev => [created, ...prev]);
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

      // If opened via appointment, mark appointment completed
      try {
        const apptId = searchParams.get('appointmentId');
        if (apptId) await markAppointmentCompleted(apptId, { note: payload.notes, diagnosis: payload.diagnosis, nextVisit: payload.nextVisit });
      } catch (err) { console.error('[complete appt after prescription]', err); }
    } catch (e) {
      console.error('Error saving prescription', e);
      setPrescriptionError('Σφάλμα κατά την αποθήκευση της συνταγής. Δοκιμάστε ξανά.');
    } finally {
      setSavingPrescription(false);
    }
  }; 

  const handleSavePet = async () => {
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

    // If opened via appointment, mark it completed
    try {
      const apptId = searchParams.get('appointmentId');
      if (apptId) await markAppointmentCompleted(apptId, { note: 'Καταχώριση Κατοικιδίου' });
    } catch (err) { console.error('[complete appt after new pet]', err); }
  };

  const toGreekTypeLabel = (t) => {
    const v = String(t || '').toLowerCase();
    if (v === 'dog' || v === 'σκύλος') return 'Σκύλος';
    if (v === 'cat' || v === 'γάτα') return 'Γάτα';
    if (v === 'other' || v === 'άλλο') return 'Άλλο';
    return 'Ζώο';
  };

  const toGreekGender = (g) => {
    const v = String(g || '').toLowerCase();
    if (v === 'male' || v === 'αρσενικό') return 'Αρσενικό';
    if (v === 'female' || v === 'θηλυκό') return 'Θηλυκό';
    return 'Άγνωστο';
  };

  const formatGreekDate = (iso) => {
    try {
      if (!iso) return new Date().toLocaleDateString('el-GR', { day: '2-digit', month: 'short', year: 'numeric' });
      const d = new Date(iso);
      return d.toLocaleDateString('el-GR', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return new Date().toLocaleDateString('el-GR', { day: '2-digit', month: 'short', year: 'numeric' });
    }
  };

  const getVetMatch = (appt) => {
    const userId = String(user?.id || '');
    const email = (user?.email || '').toLowerCase();
    const name = (user?.fullname || user?.fullName || user?.name || '').toLowerCase();
    return (
      String(appt.vetUserId || '') === userId ||
      String(appt.vetId || '') === userId ||
      (appt.vetEmail && appt.vetEmail.toLowerCase() === email) ||
      (appt.vetName && appt.vetName.toLowerCase() === name)
    );
  };

  const ownersForVet = useMemo(() => (clientOwners.length ? clientOwners : owners), [clientOwners, owners]);

  const lossPetsForOwner = useMemo(() => {
    if (!lossForm.ownerId) return [];
    return (allPets || []).filter(p => String(p.ownerId || '') === String(lossForm.ownerId));
  }, [allPets, lossForm.ownerId]);

  const transferPetsForOwner = useMemo(() => {
    if (!transferForm.ownerId) return [];
    return (allPets || []).filter(p => String(p.ownerId || '') === String(transferForm.ownerId));
  }, [allPets, transferForm.ownerId]);

  // Load pets from server and compose "new animals" cards
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingPets(true);
      try {
        const [pets, users] = await Promise.all([
          petsAPI.getAll(),
          usersAPI.getAll()
        ]);
        if (!mounted) return;
        const ownerMap = new Map((Array.isArray(users) ? users : []).map(u => [String(u.id), u]));
        const toGreekType = (t) => t === 'dog' ? 'Σκύλος' : t === 'cat' ? 'Γάτα' : 'Ζώο';
        const fmtDate = (iso) => {
          try {
            if (!iso) return '—';
            const d = new Date(iso);
            return d.toLocaleDateString('el-GR', { day: '2-digit', month: 'short', year: 'numeric' });
          } catch { return '—'; }
        };
        // Only show recent pets that actually visited this vet (derived from appointments)
        const appts = Array.isArray(await appointmentsAPI.getAll()) ? await appointmentsAPI.getAll() : [];
        const vetAppointments = appts.filter(getVetMatch);
        const petIds = new Set(vetAppointments.map(a => String(a.petId || '')).filter(Boolean));
        const sourcePets = Array.isArray(pets) ? pets : [];
        const filtered = petIds.size ? sourcePets.filter(p => petIds.has(String(p.id))) : [];

        const rows = (filtered.map(p => ({
          id: String(p.id),
          name: p.name || '—',
          type: toGreekType(p.type),
          breed: p.breed || '—',
          age: p.age ? `${p.age} έτη` : '—',
          owner: ownerMap.get(String(p.ownerId))?.fullname || ownerMap.get(String(p.ownerId))?.fullName || '—',
          microchip: p.microchip || '—',
          date: fmtDate(p.registeredAt),
          registeredAt: p.registeredAt || null
        })));
        // Sort newest first using registeredAt or fallback to id (timestamp-like)
        rows.sort((a, b) => {
          const ta = a.registeredAt ? new Date(a.registeredAt).getTime() : Number(a.id) || 0;
          const tb = b.registeredAt ? new Date(b.registeredAt).getTime() : Number(b.id) || 0;
          return tb - ta;
        });
        // Only show vet-specific recent pets (empty list if none)
        setRecentPets(rows.slice(0, 12));
      } catch (e) {
        console.warn('Failed to load pets; using fallback.', e);
        if (!mounted) return;
        setRecentPets(NEW_PETS_FALLBACK);
      } finally {
        if (mounted) setLoadingPets(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Load owners, pets, and vet clients
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingOwners(true);
      setLoadingAllPets(true);
      try {
        const [users, pets, appts] = await Promise.all([
          usersAPI.getAll(),
          petsAPI.getAll(),
          appointmentsAPI.getAll(),
        ]);
        if (!mounted) return;
        const ownerList = (Array.isArray(users) ? users : []).filter(u => String(u.role || '').toLowerCase() === 'owner');
        setOwners(ownerList);
        // Only show pets that have appointments with this vet
        const vetAppointments = (Array.isArray(appts) ? appts : []).filter(getVetMatch);
        const petIds = new Set(vetAppointments.map(a => String(a.petId || '')).filter(Boolean));
        const filteredPets = petIds.size ? (Array.isArray(pets) ? pets : []).filter(p => petIds.has(String(p.id))) : [];
        setAllPets(filteredPets);

        const clientOwnerIds = new Set(vetAppointments.map(a => String(a.ownerId || '')).filter(Boolean));
        const clientList = ownerList.filter(o => clientOwnerIds.has(String(o.id)));
        setClientOwners(clientList.length ? clientList : ownerList);
      } catch (e) {
        if (!mounted) return;
        setOwners([]);
        setClientOwners([]);
        setAllPets([]);
      } finally {
        if (mounted) {
          setLoadingOwners(false);
          setLoadingAllPets(false);
        }
      }
    })();
    return () => { mounted = false; };
  }, [user]);

  // Minimal indicator: count open Registration appointments for this vet (pending or confirmed)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await appointmentsAPI.getAll();
        const list = Array.isArray(data) ? data : [];
        const userId = String(user?.id || '');
        const email = (user?.email || '').toLowerCase();
        const name = (user?.fullname || user?.fullName || user?.name || '').toLowerCase();
        const mine = list.filter(a => (
          String(a.vetUserId || '') === userId ||
          String(a.vetId || '') === userId ||
          (a.vetEmail && a.vetEmail.toLowerCase() === email) ||
          (a.vetName && a.vetName.toLowerCase() === name)
        ));
        const openRegs = mine.filter(a => String(a.type).toLowerCase() === 'registration' && a.status !== 'completed' && a.status !== 'cancelled');
        if (mounted) setPendingRegCount(openRegs.length);
      } catch (e) {
        if (mounted) setPendingRegCount(0);
      }
    })();
    return () => { mounted = false; };
  }, [user]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f9f9f9', pb: 8, display: 'flex', flexDirection: 'column' }}>
        
        <Container maxWidth="xl" sx={{ pt: 2 }}>
          <PageHeader />
        </Container>

        {/* HERO HEADER */}
        <Box sx={{
          position: 'relative',
          py: 6,
          mb: 4,
          color: 'white',
          textAlign: 'center',
          backgroundImage: 'url(https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'hidden'
        }}>
          {/* Green Fade Overlay (keeps image visible but darkens to match other heroes) */}
          <Box sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(38, 50, 56, 0.9) 0%, rgba(0, 105, 92, 0.85) 100%)',
            zIndex: 1
          }} />

          <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
            <DescriptionIcon sx={{ fontSize: 60, mb: 2, opacity: 0.95 }} />
            <Typography variant="h4" fontWeight="bold">Συνταγογραφήσεις & Καταγραφές</Typography>
            <Typography variant="body1" sx={{ opacity: 0.95, mt: 1 }}>
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
              <Button 
                variant="contained" 
                color="secondary" 
                startIcon={<PetsIcon />}
                onClick={() => navigate('/vet/new-record')}
                sx={{ px: 3, py: 1.5 }}
              >
                Νέα Καταγραφή
              </Button>
              <Button 
                variant="contained" 
                color="warning" 
                startIcon={<ReportProblemIcon />}
                onClick={() => navigate('/lost-pets?view=form')}
                sx={{ px: 3, py: 1.5 }}
              >
                Απώλεια Ζώου
              </Button>
              <Button 
                variant="contained" 
                color="info" 
                startIcon={<TravelExploreIcon />}
                onClick={() => navigate('/found-pets?view=form')}
                sx={{ px: 3, py: 1.5 }}
              >
                Εύρεση Ζώου
              </Button>
              <Button 
                variant="contained" 
                color="success" 
                startIcon={<SwapHorizIcon />}
                onClick={() => setOpenTransfer(true)}
                sx={{ px: 3, py: 1.5 }}
              >
                Μεταβίβαση / Υιοθεσία
              </Button>
              {pendingRegCount > 0 && (
                <Chip 
                  size="medium" 
                  color="primary" 
                  label={`Ανοικτές Καταχωρίσεις: ${pendingRegCount}`}
                  onClick={() => navigate('/vet/schedule')}
                  sx={{ alignSelf: 'center', fontWeight: 'bold' }}
                />
              )}
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
                  {(loadingPrescriptions ? PRESCRIPTIONS : prescriptions).map((item) => (
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
                            <IconButton size="small" color="error" onClick={() => handleDeletePrescription(item.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </Box> 
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <Typography variant="caption" color="text.secondary" fontWeight="bold">ΦΑΡΜΑΚΟ</Typography>
                            <Typography variant="body1">{item.medicine}</Typography>
                          </Grid>
                          <Grid size={{ xs: 6, sm: 2 }}>
                            <Typography variant="caption" color="text.secondary" fontWeight="bold">ΔΟΣΟΛΟΓΙΑ</Typography>
                            <Typography variant="body1">{item.dosage}</Typography>
                          </Grid>
                          <Grid size={{ xs: 6, sm: 2 }}>
                            <Typography variant="caption" color="text.secondary" fontWeight="bold">ΔΙΑΡΚΕΙΑ</Typography>
                            <Typography variant="body1">{item.duration}</Typography>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 4 }}>
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
                  {(loadingPets ? NEW_PETS_FALLBACK : recentPets).map((item) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
                      <Paper sx={{ p: 3, borderRadius: 3, '&:hover': { boxShadow: 4 }, transition: '0.3s' }}>
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                          <Avatar sx={{ bgcolor: 'secondary.main', width: 56, height: 56 }}>
                            <PetsIcon fontSize="large" />
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight="bold">{item.name}</Typography>
                            <Typography variant="body2" color="text.secondary">{item.breed} • {item.age}</Typography>
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
            {prescriptionError && (<Alert severity="error" sx={{ mb: 2 }}>{prescriptionError}</Alert>)}
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
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Δοσολογία" 
                    value={prescriptionForm.dosage}
                    onChange={(e) => setPrescriptionForm({...prescriptionForm, dosage: e.target.value})}
                    placeholder="π.χ. 1 δισκίο"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
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
              disabled={savingPrescription}
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
            <Typography sx={{ mb: 3, mt: 1 }}>{successMessage}</Typography>
            <Button variant="contained" onClick={() => setSuccessDialog(false)}>OK</Button>
          </DialogContent>
        </Dialog>

        {/* LOSS DIALOG */}
        <Dialog
          open={openLoss}
          onClose={() => setOpenLoss(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle sx={{ bgcolor: 'warning.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="bold">Καταγραφή Απώλειας Ζώου</Typography>
            <IconButton onClick={() => setOpenLoss(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            {lossError && (<Alert severity="error" sx={{ mb: 2 }}>{lossError}</Alert>)}
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>Πελάτης & Ζώο</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Ιδιοκτήτης</InputLabel>
                  <Select
                    label="Ιδιοκτήτης"
                    value={lossForm.ownerId}
                    onChange={(e) => {
                      const ownerId = e.target.value;
                      const owner = ownersForVet.find(o => String(o.id) === String(ownerId));
                      setLossForm(prev => ({
                        ...prev,
                        ownerId,
                        petId: '',
                        email: owner?.email || prev.email || '',
                        phone: owner?.phone || prev.phone || '',
                      }));
                    }}
                  >
                    {(ownersForVet || []).map(o => (
                      <MenuItem key={o.id} value={o.id}>{o.fullname || o.fullName || o.name || o.email}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small" disabled={!lossForm.ownerId || loadingAllPets}>
                  <InputLabel>Ζώο</InputLabel>
                  <Select
                    label="Ζώο"
                    value={lossForm.petId}
                    onChange={(e) => setLossForm(prev => ({ ...prev, petId: e.target.value }))}
                  >
                    {lossPetsForOwner.map(p => (
                      <MenuItem key={p.id} value={p.id}>{p.name || 'Χωρίς όνομα'} ({toGreekTypeLabel(p.type)})</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>Στοιχεία Απώλειας</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="Ημερομηνία"
                  InputLabelProps={{ shrink: true }}
                  value={lossForm.lostDate}
                  onChange={(e) => setLossForm(prev => ({ ...prev, lostDate: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Τοποθεσία"
                  value={lossForm.location}
                  onChange={(e) => setLossForm(prev => ({ ...prev, location: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Περιγραφή"
                  multiline
                  rows={3}
                  value={lossForm.description}
                  onChange={(e) => setLossForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Αμοιβή (προαιρετικό)"
                  value={lossForm.reward}
                  onChange={(e) => setLossForm(prev => ({ ...prev, reward: e.target.value }))}
                  placeholder="π.χ. 50€"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={lossForm.urgent}
                      onChange={(e) => setLossForm(prev => ({ ...prev, urgent: e.target.checked }))}
                    />
                  }
                  label="Επείγον"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>Επικοινωνία</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Τηλέφωνο"
                  value={lossForm.phone}
                  onChange={(e) => setLossForm(prev => ({ ...prev, phone: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Email"
                  value={lossForm.email}
                  onChange={(e) => setLossForm(prev => ({ ...prev, email: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Προτιμώμενη Επικοινωνία</InputLabel>
                  <Select
                    label="Προτιμώμενη Επικοινωνία"
                    value={lossForm.preferredContact}
                    onChange={(e) => setLossForm(prev => ({ ...prev, preferredContact: e.target.value }))}
                  >
                    <MenuItem value="Τηλέφωνο">Τηλέφωνο</MenuItem>
                    <MenuItem value="Email">Email</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenLoss(false)} color="inherit">Ακύρωση</Button>
            <Button
              variant="contained"
              color="warning"
              startIcon={<SaveIcon />}
              disabled={savingLoss || loadingOwners}
              onClick={async () => {
                setLossError('');
                if (!lossForm.ownerId) {
                  setLossError('Επιλέξτε ιδιοκτήτη.');
                  return;
                }
                if (!lossForm.location.trim()) {
                  setLossError('Συμπληρώστε τοποθεσία.');
                  return;
                }
                if (!lossForm.description.trim()) {
                  setLossError('Συμπληρώστε περιγραφή.');
                  return;
                }
                setSavingLoss(true);
                try {
                  const owner = ownersForVet.find(o => String(o.id) === String(lossForm.ownerId));
                  const pet = (allPets || []).find(p => String(p.id) === String(lossForm.petId));
                  const payload = {
                    petId: pet?.id || null,
                    name: pet?.name || 'Χωρίς όνομα',
                    type: toGreekTypeLabel(pet?.type || 'Ζώο'),
                    breed: pet?.breed || 'Άγνωστη',
                    gender: toGreekGender(pet?.gender),
                    age: pet?.age ? String(pet.age) : '',
                    color: pet?.color || '',
                    date: formatGreekDate(lossForm.lostDate),
                    location: lossForm.location || '',
                    img: pet?.image || pet?.img || 'https://via.placeholder.com/400',
                    reward: lossForm.reward || null,
                    views: 0,
                    urgent: !!lossForm.urgent,
                    description: lossForm.description || '',
                    phone: lossForm.phone || owner?.phone || '',
                    email: lossForm.email || owner?.email || '',
                    preferredContact: lossForm.preferredContact || 'Τηλέφωνο',
                    ownerId: owner?.id || null,
                    reportedByVetId: user?.id || null,
                    reportedByVetName: user?.fullname || user?.fullName || user?.name || '',
                  };
                  await lostPetsAPI.create(payload);
                  setOpenLoss(false);
                  setLossForm({
                    ownerId: '',
                    petId: '',
                    lostDate: new Date().toISOString().split('T')[0],
                    location: '',
                    description: '',
                    reward: '',
                    urgent: false,
                    phone: '',
                    email: '',
                    preferredContact: 'Τηλέφωνο',
                  });
                  setSuccessMessage('Η απώλεια δηλώθηκε επιτυχώς και εμφανίζεται στον ιδιοκτήτη.');
                  setSuccessDialog(true);

                  // If opened from an appointment, mark the appointment completed
                  try {
                    const apptId = searchParams.get('appointmentId');
                    if (apptId) await markAppointmentCompleted(apptId, { note: payload.description });
                  } catch (err) { console.error('[complete appt after loss]', err); }
                } catch (e) {
                  console.error(e);
                  setLossError('Αποτυχία καταχώρησης απώλειας. Βεβαιωθείτε ότι τρέχει το json-server.');
                } finally {
                  setSavingLoss(false);
                }
              }}
            >
              Καταχώρηση
            </Button>
          </DialogActions>
        </Dialog>

        {/* FOUND DIALOG */}
        <Dialog
          open={openFound}
          onClose={() => setOpenFound(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle sx={{ bgcolor: 'info.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="bold">Καταγραφή Εύρεσης Ζώου</Typography>
            <IconButton onClick={() => setOpenFound(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            {foundError && (<Alert severity="error" sx={{ mb: 2 }}>{foundError}</Alert>)}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Είδος</InputLabel>
                  <Select
                    label="Είδος"
                    value={foundForm.type}
                    onChange={(e) => setFoundForm(prev => ({ ...prev, type: e.target.value }))}
                  >
                    <MenuItem value="Σκύλος">Σκύλος</MenuItem>
                    <MenuItem value="Γάτα">Γάτα</MenuItem>
                    <MenuItem value="Άλλο">Άλλο</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  type="datetime-local"
                  label="Ημερομηνία/Ώρα Εύρεσης"
                  InputLabelProps={{ shrink: true }}
                  value={foundForm.foundAt}
                  onChange={(e) => setFoundForm(prev => ({ ...prev, foundAt: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Περιγραφή"
                  multiline
                  rows={3}
                  value={foundForm.description}
                  onChange={(e) => setFoundForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Τοποθεσία Εύρεσης"
                  value={foundForm.location}
                  onChange={(e) => setFoundForm(prev => ({ ...prev, location: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={foundForm.hasOwner}
                      onChange={(e) => setFoundForm(prev => ({ ...prev, hasOwner: e.target.checked }))}
                    />
                  }
                  label="Υπάρχει γνωστός ιδιοκτήτης"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>Φωτογραφίες (URL)</Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={9}>
                <TextField
                  fullWidth
                  size="small"
                  label="URL Φωτογραφίας"
                  value={foundImageUrl}
                  onChange={(e) => setFoundImageUrl(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => {
                    if (!foundImageUrl.trim()) return;
                    setFoundImages(prev => [...prev, foundImageUrl.trim()]);
                    setFoundImageUrl('');
                  }}
                >
                  Προσθήκη
                </Button>
              </Grid>
              {foundImages.length > 0 && (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {foundImages.map((url, idx) => (
                      <Chip
                        key={`${url}-${idx}`}
                        label={`Φωτογραφία ${idx + 1}`}
                        onDelete={() => setFoundImages(prev => prev.filter((_, i) => i !== idx))}
                      />
                    ))}
                  </Box>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenFound(false)} color="inherit">Ακύρωση</Button>
            <Button
              variant="contained"
              color="info"
              startIcon={<SaveIcon />}
              disabled={savingFound}
              onClick={async () => {
                setFoundError('');
                if (!foundForm.type) {
                  setFoundError('Επιλέξτε είδος.');
                  return;
                }
                if (!foundForm.description.trim()) {
                  setFoundError('Συμπληρώστε περιγραφή.');
                  return;
                }
                if (!foundForm.location.trim()) {
                  setFoundError('Συμπληρώστε τοποθεσία.');
                  return;
                }
                if (!foundForm.foundAt) {
                  setFoundError('Συμπληρώστε ημερομηνία/ώρα.');
                  return;
                }
                if (!foundImages.length) {
                  setFoundError('Προσθέστε τουλάχιστον μία φωτογραφία (URL).');
                  return;
                }
                setSavingFound(true);
                try {
                  const payload = {
                    type: foundForm.type,
                    description: foundForm.description,
                    location: foundForm.location,
                    foundAt: foundForm.foundAt,
                    hasOwner: !!foundForm.hasOwner,
                    images: foundImages,
                    createdAt: new Date().toISOString(),
                    reportedByVetId: user?.id || null,
                    reportedByVetName: user?.fullname || user?.fullName || user?.name || '',
                  };
                  await foundPetsAPI.create(payload);
                  setOpenFound(false);
                  setFoundForm({ type: '', description: '', location: '', foundAt: '', hasOwner: false });
                  setFoundImages([]);
                  setSuccessMessage('Η εύρεση καταχωρήθηκε επιτυχώς και εμφανίζεται δημόσια.');
                  setSuccessDialog(true);

                  // If opened from appointment, mark completed
                  try {
                    const apptId = searchParams.get('appointmentId');
                    if (apptId) await markAppointmentCompleted(apptId, { note: payload.description });
                  } catch (err) { console.error('[complete appt after found]', err); }
                } catch (e) {
                  console.error(e);
                  setFoundError('Αποτυχία καταχώρησης εύρεσης. Βεβαιωθείτε ότι τρέχει το json-server.');
                } finally {
                  setSavingFound(false);
                }
              }}
            >
              Καταχώρηση
            </Button>
          </DialogActions>
        </Dialog>

        {/* TRANSFER / ADOPTION DIALOG */}
        <Dialog
          open={openTransfer}
          onClose={() => setOpenTransfer(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle sx={{ bgcolor: 'success.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="bold">Μεταβίβαση / Υιοθεσία Ζώου</Typography>
            <IconButton onClick={() => setOpenTransfer(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ pt: 3, pb: 2 }}>
            {transferError && (<Alert severity="error" sx={{ mb: 2 }}>{transferError}</Alert>)}
            <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#f6f8f9', borderRadius: 2, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>Τρέχων Ιδιοκτήτης & Ζώο</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth sx={{ minWidth: 180 }}>
                    <InputLabel id="transfer-current-owner-label">Τρέχων Ιδιοκτήτης</InputLabel>
                    <Select
                      labelId="transfer-current-owner-label"
                      label="Τρέχων Ιδιοκτήτης"
                      value={transferForm.ownerId}
                      onChange={(e) => setTransferForm(prev => ({ ...prev, ownerId: e.target.value, petId: '' }))}
                    >
                      {(ownersForVet || []).map(o => (
                        <MenuItem key={o.id} value={o.id}>{o.fullname || o.fullName || o.name || o.email}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth sx={{ minWidth: 130 }} disabled={!transferForm.ownerId}>
                    <InputLabel id="transfer-pet-label">Ζώο</InputLabel>
                    <Select
                      labelId="transfer-pet-label"
                      label="Ζώο"
                      value={transferForm.petId}
                      onChange={(e) => setTransferForm(prev => ({ ...prev, petId: e.target.value }))}
                    >
                      {transferPetsForOwner.map(p => (
                        <MenuItem key={p.id} value={p.id}>{p.name || 'Χωρίς όνομα'} ({toGreekTypeLabel(p.type)})</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>

            <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#f1f8e9', borderRadius: 2, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>Τύπος Πράξης & Ημερομηνία</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={{ minWidth: 170 }}>
                    <InputLabel id="transfer-type-label">Τύπος Πράξης</InputLabel>
                    <Select
                      labelId="transfer-type-label"
                      label="Τύπος Πράξης"
                      value={transferForm.type}
                      onChange={(e) => setTransferForm(prev => ({ ...prev, type: e.target.value }))}
                    >
                      <MenuItem value="transfer">Μεταβίβαση</MenuItem>
                      <MenuItem value="adoption">Υιοθεσία</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    size="small"
                    type="date"
                    label="Ημερομηνία"
                    InputLabelProps={{ shrink: true }}
                    value={transferForm.effectiveDate}
                    onChange={(e) => setTransferForm(prev => ({ ...prev, effectiveDate: e.target.value }))}
                  />
                </Grid>
              </Grid>
            </Paper>

            <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#e8f5e9', borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>Νέος Ιδιοκτήτης & Σημειώσεις</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth sx={{ minWidth: 170 }}>
                    <InputLabel id="transfer-new-owner-label">Νέος Ιδιοκτήτης</InputLabel>
                    <Select
                      labelId="transfer-new-owner-label"
                      label="Νέος Ιδιοκτήτης"
                      value={transferForm.newOwnerId}
                      onChange={(e) => setTransferForm(prev => ({ ...prev, newOwnerId: e.target.value }))}
                    >
                      {(owners || []).map(o => (
                        <MenuItem key={o.id} value={o.id}>{o.fullname || o.fullName || o.name || o.email}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Σημειώσεις"
                    multiline
                    rows={3}
                    value={transferForm.notes}
                    onChange={(e) => setTransferForm(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </Grid>
              </Grid>
            </Paper>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenTransfer(false)} color="inherit">Ακύρωση</Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<SaveIcon />}
              disabled={savingTransfer}
              onClick={async () => {
                setTransferError('');
                if (!transferForm.ownerId) {
                  setTransferError('Επιλέξτε τρέχοντα ιδιοκτήτη.');
                  return;
                }
                if (!transferForm.petId) {
                  setTransferError('Επιλέξτε ζώο.');
                  return;
                }
                if (!transferForm.newOwnerId) {
                  setTransferError('Επιλέξτε νέο ιδιοκτήτη.');
                  return;
                }
                if (String(transferForm.newOwnerId) === String(transferForm.ownerId)) {
                  setTransferError('Ο νέος ιδιοκτήτης δεν μπορεί να είναι ο ίδιος.');
                  return;
                }
                setSavingTransfer(true);
                try {
                  const pet = (allPets || []).find(p => String(p.id) === String(transferForm.petId));
                  if (!pet) {
                    setTransferError('Δεν βρέθηκε το ζώο.');
                    setSavingTransfer(false);
                    return;
                  }
                  const updated = { ...pet, ownerId: transferForm.newOwnerId, updatedAt: new Date().toISOString() };
                  await petsAPI.update(pet.id, updated);

                  // Refresh pets in memory, but filter to pets that have appointments with this vet
                  const refreshedPets = Array.isArray(await petsAPI.getAll()) ? await petsAPI.getAll() : [];
                  try {
                    const refreshedAppts = Array.isArray(await appointmentsAPI.getAll()) ? await appointmentsAPI.getAll() : [];
                    const vetAppointmentsRef = refreshedAppts.filter(getVetMatch);
                    const petIdsRef = new Set(vetAppointmentsRef.map(a => String(a.petId || '')).filter(Boolean));
                    const filteredRefreshed = petIdsRef.size ? refreshedPets.filter(p => petIdsRef.has(String(p.id))) : [];
                    setAllPets(filteredRefreshed);
                  } catch (err) {
                    setAllPets(Array.isArray(refreshedPets) ? refreshedPets : []);
                  }

                  // capture notes before clearing
                  const transferNote = transferForm.notes;

                  setOpenTransfer(false);
                  setTransferForm({
                    ownerId: '',
                    petId: '',
                    newOwnerId: '',
                    type: 'transfer',
                    notes: '',
                    effectiveDate: new Date().toISOString().split('T')[0],
                  });
                  setSuccessMessage(transferForm.type === 'adoption'
                    ? 'Η υιοθεσία ολοκληρώθηκε και το ζώο εμφανίζεται στον νέο ιδιοκτήτη.'
                    : 'Η μεταβίβαση ολοκληρώθηκε και το ζώο εμφανίζεται στον νέο ιδιοκτήτη.');
                  setSuccessDialog(true);

                  // If opened from appointment, mark appointment completed
                  try {
                    const apptId = searchParams.get('appointmentId');
                    if (apptId) await markAppointmentCompleted(apptId, { note: transferNote });
                  } catch (err) { console.error('[complete appt after transfer]', err); }
                } catch (e) {
                  console.error(e);
                  setTransferError('Αποτυχία μεταβίβασης/υιοθεσίας. Βεβαιωθείτε ότι τρέχει το json-server.');
                } finally {
                  setSavingTransfer(false);
                }
              }}
            >
              Ολοκλήρωση
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </ThemeProvider>
  );
}
