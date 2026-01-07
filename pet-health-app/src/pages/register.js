import React, { useState, useEffect } from 'react';
import { 
  Box, Button, Container, Grid, TextField, Typography, Paper, ToggleButton, 
  ToggleButtonGroup, MenuItem, Select, InputLabel, FormControl, Alert 
} from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Για την πλοήγηση
import PetsIcon from '@mui/icons-material/Pets';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import GoogleIcon from '@mui/icons-material/Google';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MapIcon from '@mui/icons-material/Map';
import PageHeader from './PageHeader'; // IMPORT TO PAGEHEADER

export default function Register() {
  const navigate = useNavigate(); // Hook για αλλαγή σελίδας
  const [role, setRole] = useState('owner');
  
  // State για τα στοιχεία της φόρμας
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    afm: '', // Μόνο για γιατρούς
    // Επιπλέον πεδία για κτηνίατρους ώστε να συμβαδίζουν με το db.json `vets`
    phone: '',
    address: '',
    specialty: '',
    price: '',
    services: '', // comma-separated list
    image: ''
  });

  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [mapSrc, setMapSrc] = useState('');

  // Απλή αλλά αξιόπιστη επικύρωση email (π.χ. name@example.com)
  const isValidEmail = (email) => {
    if (!email || typeof email !== 'string') return false;
    const trimmed = email.trim();
    // Βασικός έλεγχος: κάτι@κάτι.κάτι
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  };

  // Ελληνικό τηλέφωνο: 10 ψηφία, συνήθως ξεκινά με 2 (σταθερό) ή 69 (κινητό)
  const isValidGreekPhone = (phone) => {
    if (!phone) return false;
    const digits = phone.replace(/[^0-9]/g, '');
    if (digits.length !== 10) return false;
    return digits.startsWith('2') || digits.startsWith('69');
  };

  const handleRoleChange = (event, newRole) => {
    if (newRole !== null) setRole(newRole);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  // Update map preview when address changes
  useEffect(() => {
    if (formData.address && formData.address.trim().length > 3) {
      const q = encodeURIComponent(formData.address.trim());
      setMapSrc(`https://www.google.com/maps?q=${q}&output=embed`);
    } else {
      setMapSrc('');
    }
  }, [formData.address]);

  // --- Η ΛΟΓΙΚΗ ΤΗΣ ΕΓΓΡΑΦΗΣ ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailTrimmed = (formData.email || '').trim();

    if (!emailTrimmed || !formData.password || !formData.fullname) {
      setError('Παρακαλώ συμπληρώστε όλα τα βασικά πεδία.');
      return;
    }

    if (!isValidEmail(emailTrimmed)) {
      setError('Παρακαλώ εισάγετε έγκυρο email (π.χ. name@example.com).');
      return;
    }

    // Επιπλέον έλεγχοι για εγγραφή κτηνιάτρου
    if (role === 'vet') {
      const vetFieldErrors = {};
      if (!formData.afm) vetFieldErrors.afm = 'ΑΦΜ είναι υποχρεωτικό';
      if (!formData.address) vetFieldErrors.address = 'Διεύθυνση ιατρείου είναι υποχρεωτική';
      if (!formData.specialty) vetFieldErrors.specialty = 'Ειδικότητα είναι υποχρεωτική';
      if (!formData.phone) vetFieldErrors.phone = 'Τηλέφωνο ιατρείου είναι υποχρεωτικό';
      else if (!isValidGreekPhone(formData.phone)) vetFieldErrors.phone = 'Έγκυρο ελληνικό τηλέφωνο: 10 ψηφία, αρχίζει με 2 ή 69';
      if (formData.price && isNaN(Number(formData.price))) vetFieldErrors.price = 'Η τιμή πρέπει να είναι αριθμός';

      if (Object.keys(vetFieldErrors).length > 0) {
        setFieldErrors(vetFieldErrors);
        setError('Συμπληρώστε σωστά τα υποχρεωτικά πεδία κτηνιάτρου.');
        return;
      }
    }

    const newUser = {
      id: Date.now().toString(), // Μοναδικό ID
      role,
      fullname: formData.fullname,
      email: emailTrimmed,
      password: formData.password
    };

    try {
      const userRes = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      if (userRes.ok) {
        if (role === 'vet') {
          const servicesArray = (formData.services || '')
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);

          const workingHours = {
            'Δευτέρα': '09:00 - 21:00',
            'Τρίτη': '09:00 - 21:00',
            'Τετάρτη': '09:00 - 21:00',
            'Πέμπτη': '09:00 - 21:00',
            'Παρασκευή': '09:00 - 21:00',
            'Σάββατο': '09:00 - 14:00'
          };

          const vetProfile = {
            id: Date.now().toString(),
            userId: newUser.id,
            name: newUser.fullname,
            email: newUser.email,
            phone: formData.phone || '+30',
            address: formData.address || '',
            specialty: formData.specialty || 'Γενική Κτηνιατρική',
            rating: 4.8,
            views: 0,
            likes: 0,
            price: Number(formData.price || 0),
            image: formData.image || 'https://randomuser.me/api/portraits/men/32.jpg',
            availability: 'Διαθέσιμος',
            services: servicesArray.length ? servicesArray : ['Γενική Εξέταση'],
            workingHours
          };

          try {
            await fetch('http://localhost:3001/vets', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(vetProfile)
            });
          } catch (e) {
            console.error('Error creating vet profile:', e);
          }
        }

        alert('Η εγγραφή ολοκληρώθηκε! Τώρα μπορείτε να συνδεθείτε.');
        navigate('/login'); // Πάμε στη σελίδα σύνδεσης
      } else {
        setError('Υπήρξε πρόβλημα με την εγγραφή.');
      }
    } catch (err) {
      console.error(err);
      setError('Ο server δεν ανταποκρίνεται. Βεβαιώσου ότι τρέχει το json-server.');
    }
  };

  // Δυναμική Εικόνα - χρησιμοποιούμε απευθείας χωρίς state
  const bgImageSrc = role === 'owner' 
    ? 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1600&q=80'
    : 'https://images.unsplash.com/photo-1530041539828-114de669390e?auto=format&fit=crop&w=1600&q=80';

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* LEFT FORM PANEL */}
      <Box
        component={Paper}
        elevation={6}
        square
        sx={{
          flex: { xs: '0 0 60%', sm: '0 0 66.666%', md: '0 0 58.333%' },
          height: '100%',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        
        {/* PageHeader ADDED HERE */}
        <Box sx={{ px: 4, pt: 2 }}>
            <PageHeader />
        </Box>

        <Container maxWidth="sm" sx={{ py: 4 }}> {/* Reduced py to accommodate header */}
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
             <Box sx={{ bgcolor: '#00695c', borderRadius: '50%', p: 1, mr: 1 }}>
                <PetsIcon sx={{ color: 'white' }} />
             </Box>
             <Typography variant="h5" sx={{ color: '#00695c', fontWeight: 'bold' }}>Care4Pets</Typography>
          </Box>

          <Typography component="h1" variant="h4" align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
            Δημιουργία λογαριασμού
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {/* ROLE TOGGLE */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 5 }}>
            <ToggleButtonGroup value={role} exclusive onChange={handleRoleChange}>
              <ToggleButton value="owner" sx={{ px: 4, py: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                    <PetsIcon fontSize="large" sx={{ display: 'block', mx: 'auto', mb: 1, color: role === 'owner' ? '#00695c' : 'grey' }} />
                    <Typography fontWeight="bold" sx={{ color: role === 'owner' ? '#00695c' : 'grey' }}>Ιδιοκτήτης</Typography>
                </Box>
              </ToggleButton>
              <ToggleButton value="vet" sx={{ px: 4, py: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                    <MedicalServicesIcon fontSize="large" sx={{ display: 'block', mx: 'auto', mb: 1, color: role === 'vet' ? '#00695c' : 'grey' }} />
                    <Typography fontWeight="bold" sx={{ color: role === 'vet' ? '#00695c' : 'grey' }}>Κτηνίατρος</Typography>
                </Box>
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* Βασικά Στοιχεία */}
            <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Βασικά Στοιχεία</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField required fullWidth name="fullname" label="Ονοματεπώνυμο" variant="filled" onChange={handleInputChange} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField required fullWidth name="email" label="Email" type="email" variant="filled" onChange={handleInputChange} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField required fullWidth name="password" label="Κωδικός Πρόσβασης" type="password" variant="filled" onChange={handleInputChange} />
                </Grid>
              </Grid>
            </Paper>

            {/* Επαγγελματικά Στοιχεία για Κτηνίατρο */}
            {role === 'vet' && (
              <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Επαγγελματικά Στοιχεία</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField required fullWidth name="afm" label="ΑΦΜ" variant="outlined" onChange={handleInputChange} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth name="phone" label="Τηλέφωνο Ιατρείου" variant="outlined" onChange={handleInputChange}
                      error={Boolean(fieldErrors.phone)} helperText={fieldErrors.phone} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth name="address" label="Διεύθυνση Ιατρείου" variant="outlined" onChange={handleInputChange}
                      error={Boolean(fieldErrors.address)} helperText={fieldErrors.address} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth name="specialty" label="Ειδικότητα" placeholder="π.χ. Παθολογία Ζώων" variant="outlined" onChange={handleInputChange}
                      error={Boolean(fieldErrors.specialty)} helperText={fieldErrors.specialty} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth name="price" label="Ενδεικτική Τιμή Επίσκεψης (€)" type="number" variant="outlined" onChange={handleInputChange}
                      error={Boolean(fieldErrors.price)} helperText={fieldErrors.price} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth name="services" label="Υπηρεσίες (χωρισμένες με κόμμα)" placeholder="Γενική Εξέταση, Εμβολιασμός, Αιματολογικός Έλεγχος" variant="outlined" onChange={handleInputChange} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth name="image" label="Εικόνα Προφίλ (URL)" variant="outlined" onChange={handleInputChange} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Button fullWidth component="label" variant="outlined" startIcon={<CloudUploadIcon />} sx={{ height: '56px' }}>
                      Ανέβασμα Άδειας (PDF) <input type="file" hidden />
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    {mapSrc ? (
                      <Box sx={{ border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
                        <iframe
                          title="Χάρτης Ιατρείου"
                          src={mapSrc}
                          width="100%"
                          height="220"
                          style={{ border: 0 }}
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                        <Box sx={{ p: 1.5, bgcolor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            Προεπισκόπηση βάσει διεύθυνσης. Για καλύτερη ακρίβεια, γράψτε πλήρη οδό και πόλη.
                          </Typography>
                          <Button size="small" href={`https://www.google.com/maps?q=${encodeURIComponent(formData.address || '')}`} target="_blank" rel="noopener" sx={{ textTransform: 'none' }}>
                            Άνοιγμα σε Χάρτη
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={{ height: 120, bgcolor: '#f8fafc', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #cbd5e1' }}>
                        <Typography color="text.secondary"><MapIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> Χάρτης Ιατρείου (συμπληρώστε διεύθυνση)</Typography>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            )}

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 4, mb: 2, bgcolor: '#00695c', py: 1.5, fontSize: '1.1rem' }}>
              Ολοκλήρωση Εγγραφής
            </Button>
            
            <Button fullWidth variant="outlined" startIcon={<GoogleIcon />} sx={{ mb: 3, color: '#555', borderColor: '#ddd' }}>
              Εγγραφή μέσω Google
            </Button>

            <Grid container justifyContent="center">
              <Grid item>
                <Button href="/login" sx={{ textTransform: 'none' }}>
                    Έχετε ήδη λογαριασμό; <span style={{ fontWeight: 'bold', marginLeft: '5px' }}>Συνδεθείτε</span>
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* RIGHT IMAGE PANEL */}
      <Box
        sx={{
          display: 'block',
          flex: { xs: '0 0 40%', sm: '0 0 33.333%', md: '0 0 41.666%' },
          height: '100%',
          position: 'relative',
          backgroundImage:
            role === 'vet'
              ? `url(${bgImageSrc})`
              : `linear-gradient(120deg, rgba(0,105,92,0.18), rgba(0,105,92,0.06)), url(${bgImageSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#e6f4f1',
          transition: 'background-image 0.4s ease-in-out',
          filter: role === 'vet' ? 'saturate(1.08) contrast(1.03)' : 'saturate(1.05)'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            bottom: 40,
            left: 40,
            right: 40,
            color: '#fff',
            textShadow: '0 2px 12px rgba(0,0,0,0.4)'
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Φροντίδα με στιλ
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.95 }}>
            Ο οδηγός υγείας κατοικιδίων σε κάθε βήμα της ζωής τους.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}