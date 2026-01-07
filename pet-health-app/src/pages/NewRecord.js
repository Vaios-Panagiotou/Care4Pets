import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Box, Container, Grid, Typography, TextField, Button, Paper, 
  MenuItem, Select, InputLabel, FormControl, Avatar, IconButton, Chip 
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Icons
import UploadIcon from '@mui/icons-material/Upload';
import PetsIcon from '@mui/icons-material/Pets';
import PersonIcon from '@mui/icons-material/Person';
import SaveIcon from '@mui/icons-material/Save';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Import PageHeader
import PageHeader from './PageHeader';
import DashboardSidebar from '../components/DashboardSidebar';
import { petsAPI, usersAPI, appointmentsAPI, vetsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Create theme outside component to prevent recreation on every render
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    background: { default: '#f8fafc' },
    text: { primary: '#1e293b', secondary: '#64748b' }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    button: { textTransform: 'none', fontWeight: 600 },
    h6: { fontWeight: 600 }
  },
  shape: { borderRadius: 12 },
  components: {
    MuiTextField: {
      defaultProps: {
        size: 'small'
      },
      styleOverrides: {
        root: { 
          '& .MuiInputBase-root': {
            backgroundColor: 'white'
          }
        }
      }
    }
  }
});

const NewRecord = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const scrollContainerRef = useRef(null);
  const [image, setImage] = useState(null);
  const [petForm, setPetForm] = useState({ name: '', type: '', breed: '', gender: '', age: '', microchip: '', img: '' });
  const [ownerForm, setOwnerForm] = useState({ fullname: '', phone: '', email: '', address: '', afm: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [pendingRegistrations, setPendingRegistrations] = useState(0);
  const [prefillDone, setPrefillDone] = useState(false);
  const [linkedAppt, setLinkedAppt] = useState(null);
  const [petErrors, setPetErrors] = useState({});
  const [ownerErrors, setOwnerErrors] = useState({});

  // Load pending Registration appointments for this vet
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const all = await appointmentsAPI.getAll();
        const list = Array.isArray(all) ? all : [];
        const vetIdStr = String(user?.id || '');
        // Match by vetUserId or vetId equals user.id, or by vetName/email fallback
        const userEmail = (user?.email || '').toLowerCase();
        const userName = (user?.fullname || user?.fullName || user?.name || '').toLowerCase();
        const mine = list.filter(a => (
          String(a.vetUserId || '') === vetIdStr ||
          String(a.vetId || '') === vetIdStr ||
          ((a.vetEmail || '').toLowerCase() === userEmail) ||
          ((a.vetName || '').toLowerCase() === userName)
        ));
        const pending = mine.filter(a => a.status === 'pending' && String(a.type).toLowerCase() === 'registration');
        if (mounted) setPendingRegistrations(pending.length);
      } catch (e) {
        if (mounted) setPendingRegistrations(0);
      }
    })();
    return () => { mounted = false; };
  }, [user]);

  // Prefill owner details from appointmentId (if provided)
  useEffect(() => {
    let mounted = true;
    const apptId = searchParams.get('appointmentId');
    if (!apptId || prefillDone) return;
    (async () => {
      try {
        const appts = await appointmentsAPI.getAll();
        const appt = (Array.isArray(appts) ? appts : []).find(a => String(a.id) === String(apptId));
        if (!appt) { if (mounted) setPrefillDone(true); return; }
        // Try to resolve owner via users API
        let fullname = appt.ownerName || '';
        let email = '';
        let phone = '';
        let address = '';
        let afm = '';
        try {
          const users = await usersAPI.getAll();
          const owner = (Array.isArray(users) ? users : []).find(u => String(u.id) === String(appt.ownerId));
          if (owner) {
            fullname = owner.fullname || owner.fullName || fullname;
            email = owner.email || '';
            afm = owner.afm || '';
          }
        } catch {}
        if (mounted) {
          setLinkedAppt({ id: appt.id, type: appt.type, status: appt.status, date: appt.date, time: appt.time, ownerName: fullname || appt.ownerName || '' });
          setOwnerForm(prev => ({
            ...prev,
            fullname: fullname || prev.fullname,
            email: email || prev.email,
            phone: phone || prev.phone,
            address: address || prev.address,
            afm: afm || prev.afm
          }));
          setPrefillDone(true);
        }
      } catch (e) {
        if (mounted) setPrefillDone(true);
      }
    })();
    return () => { mounted = false; };
  }, [searchParams, prefillDone]);

  // Prevent key events inside the form from bubbling to global listeners
  const stopKeyPropagation = useCallback((e) => {
    // Stop bubbling and capturing to neutralize any global handlers
    e.stopPropagation();
    if (e.nativeEvent && typeof e.nativeEvent.stopImmediatePropagation === 'function') {
      e.nativeEvent.stopImmediatePropagation();
    }
  }, []);

  const handleImageChange = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      // Validate input before any API calls
      const isEmail = (v) => /[^@\s]+@[^@\s]+\.[^@\s]+/.test(String(v || '').trim());
      const isPhone = (v) => {
        const s = String(v || '').replace(/\s|-/g, '');
        return /^(\+30)?(2\d{9}|69\d{8})$/.test(s) || /^\d{10}$/.test(s);
      };
      const isMicrochip = (v) => /^\d{15}$/.test(String(v || '').replace(/\D/g, ''));
      const validateAFM = (afm) => {
        const s = String(afm || '').replace(/\D/g, '');
        if (!s) return true; // optional
        if (!/^\d{9}$/.test(s)) return false;
        let sum = 0;
        for (let i = 0; i < 8; i++) {
          sum += Number(s[i]) * Math.pow(2, 8 - i);
        }
        const mod = sum % 11 % 10;
        return mod === Number(s[8]);
      };

      const nextPetErrors = {};
      const nextOwnerErrors = {};
      if (!petForm.name || petForm.name.trim().length < 2) nextPetErrors.name = 'Ελάχιστο 2 χαρακτήρες.';
      if (!['dog','cat','other'].includes(String(petForm.type || ''))) nextPetErrors.type = 'Επιλογή είδους.';
      if (!['male','female'].includes(String(petForm.gender || ''))) nextPetErrors.gender = 'Επιλογή φύλου.';
      if (!isMicrochip(petForm.microchip)) nextPetErrors.microchip = 'Το microchip πρέπει να είναι 15 ψηφία.';
      if (petForm.age && isNaN(Number(petForm.age))) nextPetErrors.age = 'Η ηλικία πρέπει να είναι αριθμός.';

      if (!ownerForm.fullname || ownerForm.fullname.trim().length < 3) nextOwnerErrors.fullname = 'Ελάχιστο 3 χαρακτήρες.';
      if (!isPhone(ownerForm.phone)) nextOwnerErrors.phone = 'Τηλέφωνο 10 ψηφίων ή μορφή +30…';
      if (!isEmail(ownerForm.email)) nextOwnerErrors.email = 'Μη έγκυρο email.';
      if (ownerForm.afm && !validateAFM(ownerForm.afm)) nextOwnerErrors.afm = 'Μη έγκυρο ΑΦΜ.';

      setPetErrors(nextPetErrors);
      setOwnerErrors(nextOwnerErrors);
      if (Object.keys(nextPetErrors).length || Object.keys(nextOwnerErrors).length) {
        throw new Error('Ελέγξτε τα πεδία με σφάλματα.');
      }

      if (!ownerForm.email) { throw new Error('Απαιτείται email ιδιοκτήτη για σύνδεση.'); }
      const found = await usersAPI.getByEmail(ownerForm.email.trim());
      if (!Array.isArray(found) || found.length === 0) {
        throw new Error('Δεν βρέθηκε ιδιοκτήτης με αυτό το email.');
      }
      const owner = found[0];
      const payload = {
        name: petForm.name || 'Χωρίς Όνομα',
        type: petForm.type || 'other',
        breed: petForm.breed || '',
        gender: petForm.gender || 'male',
        age: petForm.age || '',
        microchip: String(petForm.microchip || '').replace(/\D/g, ''),
        img: petForm.img || image || '',
        ownerId: owner.id,
        registeredAt: new Date().toISOString(),
      };
      const createdPet = await petsAPI.create(payload);

      // If we came here from a Registration appointment, mark it as completed and link the pet
      const apptId = searchParams.get('appointmentId');
      if (apptId) {
        try {
          const appts = await appointmentsAPI.getAll();
          const appt = (Array.isArray(appts) ? appts : []).find(a => String(a.id) === String(apptId));
          if (appt) {
            const updated = {
              ...appt,
              status: 'completed',
              petId: createdPet?.id,
              petName: payload.name || appt.petName || 'Κατοικίδιο',
              completedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            await appointmentsAPI.update(appt.id, updated);
          }
        } catch (e) {
          console.warn('Αποτυχία ενημέρωσης του ραντεβού ως completed', e);
        }
      }

      alert('Η καταχώριση ολοκληρώθηκε. Το ραντεβού σημειώθηκε ως ολοκληρωμένο.');
      navigate('/vet/schedule');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Αποτυχία αποθήκευσης.');
    } finally {
      setSaving(false);
    }
  }, [navigate, ownerForm, petForm, image, searchParams]);
  
  const handleCancel = useCallback(() => {
    navigate('/vet');
  }, [navigate]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 8, display: 'flex', flexDirection: 'column' }}>
        
        <Container maxWidth="xl" sx={{ pt: 2 }}>
            <PageHeader />
        </Container>

        <Box sx={{ display: 'flex', flex: 1, maxWidth: '100vw', overflow: 'hidden', p: 2, gap: 2 }}>
          <DashboardSidebar />
          
          <Box 
            ref={scrollContainerRef}
            sx={{ 
              flex: 1, 
              overflowY: 'auto',
              overflowX: 'hidden',
              WebkitOverflowScrolling: 'touch',
              willChange: 'transform'
            }}>
            {/* HERO HEADER */}
            <Box sx={{ bgcolor: '#1976d2', py: 5, mb: 2, color: 'white', textAlign: 'center', mr: -2 }}>
                <Container maxWidth="md">
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Νέα Καταγραφή Ασθενούς</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Συμπληρώστε τα στοιχεία του ζώου και του ιδιοκτήτη
                    </Typography>
                </Container>
            </Box>

            {/* Minimal indicator if opened from a Registration appointment; otherwise show pending banner */}
            {linkedAppt && String(linkedAppt.type).toLowerCase() === 'registration' ? (
              <Container maxWidth="md" sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                  <Chip icon={<CalendarMonthIcon />} label="Από ραντεβού Καταχώρισης" size="small" variant="outlined" color="primary" />
                  <Typography variant="caption" color="text.secondary">{linkedAppt.date || '-'} • {linkedAppt.time || '-'} • {linkedAppt.ownerName || 'Ιδιοκτήτης'}</Typography>
                </Box>
              </Container>
            ) : (
            pendingRegistrations > 0 && (
              <Container maxWidth="md" sx={{ mb: 6 }}>
                <Paper elevation={0} sx={{ p: 2, border: '1px dashed #f59e0b', bgcolor: '#fff7ed', color: '#9a3412', borderRadius: 2 }}>
                  <Typography variant="body2" fontWeight={700}>Εκκρεμούν {pendingRegistrations} καταχωρίσεις</Typography>
                  <Typography variant="caption">Από ραντεβού τύπου Καταχώριση. Ολοκληρώστε τη φόρμα και αποθηκεύστε.</Typography>
                </Paper>
              </Container>
            ))}

            <Container maxWidth="md">
          <Paper elevation={0} sx={{ p: 4, borderRadius: 2, bgcolor: 'white', border: '1px solid #e2e8f0' }}>
            <Box component="form" onSubmit={handleSubmit} onKeyDown={stopKeyPropagation} onKeyDownCapture={stopKeyPropagation} onKeyUp={stopKeyPropagation} onKeyUpCapture={stopKeyPropagation} onKeyPress={stopKeyPropagation} onKeyPressCapture={stopKeyPropagation} noValidate autoComplete="off">
                {/* PET INFORMATION SECTION */}
                <Box sx={{ mb: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, pb: 2, borderBottom: '2px solid #e2e8f0' }}>
                        <PetsIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>Στοιχεία Ζώου</Typography>
                    </Box>

                    {/* Image Upload */}
                    <Box sx={{ textAlign: 'center', mb: 4, p: 3, bgcolor: '#f8fafc', borderRadius: 2 }}>
                        <Avatar src={image} sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }} />
                        <Button variant="outlined" component="label" startIcon={<UploadIcon />} size="small">
                            Ανέβασμα Φωτογραφίας
                            <input type="file" hidden onChange={handleImageChange} />
                        </Button>
                    </Box>

                    {/* Pet Fields */}
                      <TextField 
                      fullWidth 
                      required 
                      label="Όνομα Ζώου" 
                      variant="outlined" 
                      size="small" 
                      sx={{ mb: 2 }} 
                      onKeyDown={stopKeyPropagation}
                      onKeyDownCapture={stopKeyPropagation}
                      onKeyUp={stopKeyPropagation}
                      onKeyUpCapture={stopKeyPropagation}
                      onKeyPress={stopKeyPropagation}
                        onKeyPressCapture={stopKeyPropagation}
                        value={petForm.name}
                        error={!!petErrors.name}
                        helperText={petErrors.name}
                        onChange={(e) => setPetForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                    
                      <FormControl fullWidth size="small" sx={{ bgcolor: 'white', mb: 2 }} error={!!petErrors.type}>
                        <InputLabel>Είδος</InputLabel>
                        <Select label="Είδος" value={petForm.type} onChange={(e) => setPetForm(prev => ({ ...prev, type: e.target.value }))}>
                            <MenuItem value="dog">Σκύλος</MenuItem>
                            <MenuItem value="cat">Γάτα</MenuItem>
                            <MenuItem value="other">Άλλο</MenuItem>
                        </Select>
                        {petErrors.type && <Typography variant="caption" color="error.main">{petErrors.type}</Typography>}
                    </FormControl>

                      <TextField fullWidth label="Φυλή" variant="outlined" size="small" sx={{ mb: 2 }} value={petForm.breed} onChange={(e) => setPetForm(prev => ({ ...prev, breed: e.target.value }))} />

                      <FormControl fullWidth size="small" sx={{ bgcolor: 'white', mb: 2 }} error={!!petErrors.gender}>
                        <InputLabel>Φύλο</InputLabel>
                        <Select label="Φύλο" value={petForm.gender} onChange={(e) => setPetForm(prev => ({ ...prev, gender: e.target.value }))}>
                            <MenuItem value="male">Αρσενικό</MenuItem>
                            <MenuItem value="female">Θηλυκό</MenuItem>
                        </Select>
                        {petErrors.gender && <Typography variant="caption" color="error.main">{petErrors.gender}</Typography>}
                    </FormControl>

                      <TextField fullWidth label="Ηλικία" variant="outlined" size="small" sx={{ mb: 2 }} value={petForm.age} onChange={(e) => setPetForm(prev => ({ ...prev, age: e.target.value }))} error={!!petErrors.age} helperText={petErrors.age} />

                      <TextField fullWidth label="Χρώμα / Σημάδια" variant="outlined" size="small" sx={{ mb: 2 }} onChange={(e) => setPetForm(prev => ({ ...prev, color: e.target.value }))} />
                      <TextField fullWidth required label="Αριθμός Microchip" variant="outlined" size="small" sx={{ bgcolor: '#e3f2fd', mb: 0 }} 
                        value={petForm.microchip}
                        onChange={(e) => setPetForm(prev => ({ ...prev, microchip: e.target.value.replace(/\D/g,'') }))}
                        inputProps={{ inputMode: 'numeric', maxLength: 15 }}
                        error={!!petErrors.microchip}
                        helperText={petErrors.microchip || 'Υποχρεωτικό'}
                      />
                </Box>

                {/* OWNER INFORMATION SECTION */}
                <Box sx={{ mb: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, pb: 2, borderBottom: '2px solid #e2e8f0' }}>
                        <PersonIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>Στοιχεία Ιδιοκτήτη</Typography>
                    </Box>

                    <TextField fullWidth required label="Ονοματεπώνυμο" variant="outlined" size="small" sx={{ mb: 2 }} value={ownerForm.fullname} onChange={(e) => setOwnerForm(prev => ({ ...prev, fullname: e.target.value }))} error={!!ownerErrors.fullname} helperText={ownerErrors.fullname} />
                    <TextField fullWidth required label="Τηλέφωνο" variant="outlined" size="small" sx={{ mb: 2 }} value={ownerForm.phone} onChange={(e) => setOwnerForm(prev => ({ ...prev, phone: e.target.value }))} inputProps={{ inputMode: 'tel' }} error={!!ownerErrors.phone} helperText={ownerErrors.phone} />
                    <TextField fullWidth required label="Email" type="email" variant="outlined" size="small" sx={{ mb: 2 }} value={ownerForm.email} onChange={(e) => setOwnerForm(prev => ({ ...prev, email: e.target.value }))} error={!!ownerErrors.email} helperText={ownerErrors.email} />
                    <TextField fullWidth label="Διεύθυνση" variant="outlined" size="small" sx={{ mb: 2 }} value={ownerForm.address} onChange={(e) => setOwnerForm(prev => ({ ...prev, address: e.target.value }))} />
                    <TextField fullWidth label="ΑΦΜ" variant="outlined" size="small" sx={{ mb: 0 }} value={ownerForm.afm} onChange={(e) => setOwnerForm(prev => ({ ...prev, afm: e.target.value.replace(/\D/g,'') }))} inputProps={{ inputMode: 'numeric' }} error={!!ownerErrors.afm} helperText={ownerErrors.afm || ''} />
                </Box>

                {/* VET NOTES SECTION */}
                <Box sx={{ mb: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, pb: 2, borderBottom: '2px solid #e2e8f0' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>Σημειώσεις Κτηνιάτρου</Typography>
                    </Box>
                    <TextField fullWidth multiline rows={5} placeholder="Γράψτε παρατηρήσεις, αλλεργίες, ιστορικό..." variant="outlined" size="small" sx={{ mb: 0 }} />
                </Box>
                {/* ACTION BUTTONS */}
                <Box sx={{ mt: 6, display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 4, borderTop: '1px solid #e2e8f0' }}>
                    <Button 
                        variant="outlined" 
                        startIcon={<ArrowBackIcon />}
                        onClick={handleCancel}
                        sx={{ px: 4 }}
                    >
                        Ακύρωση
                    </Button>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary" 
                        startIcon={<SaveIcon />}
                        disabled={saving}
                        sx={{ px: 4, py: 1.25 }}
                    >
                        {saving ? 'Αποθήκευση...' : 'Αποθήκευση'}
                    </Button>
                </Box>
            {error && (
              <Box sx={{ mt: 2, color: 'error.main' }}>
                <Typography variant="body2">{error}</Typography>
              </Box>
            )}
            </Box>
          </Paper>
            </Container>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default React.memo(NewRecord);