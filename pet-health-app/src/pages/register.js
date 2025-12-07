import React, { useState } from 'react';
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

export default function Register() {
  const navigate = useNavigate(); // Hook για αλλαγή σελίδας
  const [role, setRole] = useState('owner');
  
  // State για τα στοιχεία της φόρμας
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    afm: '', // Μόνο για γιατρούς
  });

  const [error, setError] = useState('');

  const handleRoleChange = (event, newRole) => {
    if (newRole !== null) setRole(newRole);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Η ΛΟΓΙΚΗ ΤΗΣ ΕΓΓΡΑΦΗΣ ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || !formData.fullname) {
        setError("Παρακαλώ συμπληρώστε όλα τα βασικά πεδία.");
        return;
    }

    const newUser = {
        ...formData,
        role: role, // Αποθηκεύουμε αν είναι 'owner' ή 'vet'
        id: Date.now().toString() // Μοναδικό ID
    };

    try {
        // Στέλνουμε τα δεδομένα στον JSON Server
        const response = await fetch('http://localhost:3001/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        });

        if (response.ok) {
            alert("Η εγγραφή ολοκληρώθηκε! Τώρα μπορείτε να συνδεθείτε.");
            navigate('/login'); // Πάμε στη σελίδα σύνδεσης
        } else {
            setError("Υπήρξε πρόβλημα με την εγγραφή.");
        }
    } catch (err) {
        console.error(err);
        setError("Ο server δεν ανταποκρίνεται. Βεβαιώσου ότι τρέχει το json-server.");
    }
  };

  // Δυναμική Εικόνα
  const bgImage = role === 'owner' 
    ? 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'
    : 'https://images.unsplash.com/photo-1628009368231-760335298025?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80';

  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      
      {/* LEFT IMAGE */}
      <Grid item xs={false} sm={4} md={5} 
        sx={{
          backgroundImage: `url(${bgImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundColor: 'grey.100',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: '0.5s all ease-in-out'
        }}
      />

      {/* RIGHT FORM */}
      <Grid item xs={12} sm={8} md={7} component={Paper} elevation={6} square>
        <Container maxWidth="sm" sx={{ py: 8 }}>
          
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
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField required fullWidth name="fullname" label="Ονοματεπώνυμο" variant="filled" onChange={handleInputChange} />
                </Grid>
                <Grid item xs={12}>
                    <TextField required fullWidth name="email" label="Email" type="email" variant="filled" onChange={handleInputChange} />
                </Grid>
                <Grid item xs={12}>
                    <TextField required fullWidth name="password" label="Κωδικός Πρόσβασης" type="password" variant="filled" onChange={handleInputChange} />
                </Grid>

                {role === 'vet' && (
                    <>
                        <Grid item xs={12}><Typography variant="h6" sx={{ mt: 2 }}>Επαγγελματικά Στοιχεία</Typography></Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField required fullWidth name="afm" label="ΑΦΜ" variant="outlined" onChange={handleInputChange} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                             <FormControl fullWidth>
                                <InputLabel>Επίπεδο Σπουδών</InputLabel>
                                <Select label="Επίπεδο Σπουδών" defaultValue="">
                                    <MenuItem value={1}>Πτυχίο Κτηνιατρικής</MenuItem>
                                    <MenuItem value={2}>Μεταπτυχιακό</MenuItem>
                                </Select>
                             </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Button fullWidth component="label" variant="outlined" startIcon={<CloudUploadIcon />}>
                                Ανέβασμα Άδειας (PDF) <input type="file" hidden />
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ height: 100, bgcolor: '#e0e0e0', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #999' }}>
                                <Typography color="text.secondary"><MapIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> Χάρτης Ιατρείου</Typography>
                            </Box>
                        </Grid>
                    </>
                )}
            </Grid>

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
      </Grid>
    </Grid>
  );
}