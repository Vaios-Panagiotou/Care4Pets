import React, { useState } from 'react';
import { Box, Button, Checkbox, FormControlLabel, Grid, Link, TextField, Typography, Paper, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import για πλοήγηση
import GoogleIcon from '@mui/icons-material/Google';
import PetsIcon from '@mui/icons-material/Pets';
import PageHeader from './PageHeader'; // IMPORT TO PAGEHEADER

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Η ΛΟΓΙΚΗ ΤΗΣ ΣΥΝΔΕΣΗΣ ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
        // Ψάχνουμε στο db.json αν υπάρχει χρήστης με αυτό το email και κωδικό
        const response = await fetch(`http://localhost:3001/users?email=${formData.email}&password=${formData.password}`);
        const users = await response.json();

        if (users.length > 0) {
            const user = users[0]; // Βρήκαμε τον χρήστη
            
            // Αποθήκευση στο localStorage (προαιρετικά, για να "θυμάται" ότι συνδέθηκε)
            localStorage.setItem('user', JSON.stringify(user));

            // Έλεγχος Ρόλου και Πλοήγηση
            if (user.role === 'owner') {
                navigate('/owner'); // Πήγαινε στο Dashboard Ιδιοκτήτη
            } else if (user.role === 'vet') {
                navigate('/vet'); // Πήγαινε στο Dashboard Κτηνίατρου
            } else {
                navigate('/'); // Fallback
            }
        } else {
            setError('Λάθος email ή κωδικός πρόσβασης.');
        }
    } catch (err) {
        console.error(err);
        setError('Αδυναμία σύνδεσης με τον server (βεβαιώσου ότι τρέχει το json-server).');
    }
  };

  return (
    <Grid container sx={{ height: '100vh' }}>
      
      {/* ΕΙΚΟΝΑ ΑΡΙΣΤΕΡΑ */}
      <Grid item xs={false} sm={4} md={6} 
        sx={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: 'grey.50',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* ΦΟΡΜΑ ΔΕΞΙΑ */}
      <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square sx={{ display: 'flex', flexDirection: 'column' }}>
        
        {/* PageHeader ADDED HERE */}
        <Box sx={{ width: '100%', px: 4, pt: 2 }}>
            <PageHeader />
        </Box>

        <Box sx={{ my: 4, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '400px', width: '100%', alignSelf: 'center' }}>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
             <Box sx={{ bgcolor: '#00695c', borderRadius: '50%', p: 1, mr: 1 }}>
                <PetsIcon sx={{ color: 'white' }} />
             </Box>
             <Typography variant="h5" sx={{ color: '#00695c', fontWeight: 'bold' }}>Care4Pets</Typography>
          </Box>

          <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
            Σύνδεση λογαριασμού
          </Typography>

          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField 
                margin="normal" required fullWidth 
                id="email" label="Email" name="email" autoFocus 
                onChange={handleInputChange} 
            />
            <TextField 
                margin="normal" required fullWidth 
                name="password" label="Κωδικός Πρόσβασης" type="password" id="password" 
                onChange={handleInputChange} 
            />
            
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Θυμήσου με"
            />

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, bgcolor: '#00695c', py: 1.5, fontWeight: 'bold' }}>
              Σύνδεση
            </Button>
            
            <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', my: 2 }}>
                <Typography sx={{ bgcolor: 'white', px: 1, zIndex: 1, color: 'text.secondary' }}>Ή</Typography>
                <Box sx={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '1px solid #e0e0e0', zIndex: 0 }} />
            </Box>

            <Button fullWidth variant="outlined" startIcon={<GoogleIcon />} sx={{ mb: 3, py: 1, color: '#555', borderColor: '#ddd' }}>
              Σύνδεση μέσω Google
            </Button>

            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" sx={{ color: '#00695c' }}>
                  Ξεχάσατε τον κωδικό;
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2" sx={{ color: '#00695c', fontWeight: 'bold' }}>
                  {"Δεν έχετε λογαριασμό; Εγγραφή"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}