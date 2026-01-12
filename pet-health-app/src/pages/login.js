import React, { useState } from 'react';
import { Box, Button, Checkbox, FormControlLabel, Grid, Link, TextField, Typography, Paper, Alert } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import PetsIcon from '@mui/icons-material/Pets';
import PageHeader from './PageHeader';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const reason = searchParams.get('reason');
  const infoMessage = reason === 'lost-pets'
    ? 'Για να κάνετε δήλωση απώλειας πρέπει να συνδεθείτε.'
    : '';

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
        const response = await fetch(`http://localhost:3001/users?email=${formData.email}&password=${formData.password}`);
        const users = await response.json();

        if (users.length > 0) {
            const user = users[0];
            login(user);

            // Post-auth redirect support
            try {
              const redirectParam = searchParams.get('redirect');
              const stored = sessionStorage.getItem('postAuthRedirect');
              if (stored) {
                sessionStorage.removeItem('postAuthRedirect');
                navigate(stored);
                return;
              }
              if (redirectParam === 'find-vet') {
                navigate('/find-vet?find=1');
                return;
              }
            } catch (_) {}
            // Default role-based navigation
            if (user.role === 'owner') {
              navigate('/owner');
            } else if (user.role === 'vet') {
              navigate('/vet');
            } else {
              navigate('/');
            }
        } else {
            setError('Λάθος email ή κωδικός πρόσβασης.');
        }
    } catch (err) {
        console.error(err);
        setError('Αδυναμία σύνδεσης με τον server.');
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* LEFT FORM PANEL */}
      <Box
        component={Paper}
        elevation={6}
        square
        sx={{
          flex: { xs: 1, sm: '0 0 66.666%', md: '0 0 50%' },
          height: '100%',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box sx={{ px: 4, pt: 2 }}>
          <PageHeader />
        </Box>

        <Box sx={{
          my: 'auto',
          mx: 'auto',
          px: 4,
          py: 4,
          width: '100%',
          maxWidth: '440px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
            <Box sx={{ bgcolor: '#00695c', borderRadius: '50%', p: 1, mr: 1 }}>
              <PetsIcon sx={{ color: 'white' }} />
            </Box>
            <Typography variant="h5" sx={{ color: '#00695c', fontWeight: 'bold' }}>Care4Pets</Typography>
          </Box>

          <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
            Σύνδεση λογαριασμού
          </Typography>

          {infoMessage && <Alert severity="info" sx={{ mb: 2 }}>{infoMessage}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoFocus
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Κωδικός Πρόσβασης"
              type="password"
              id="password"
              onChange={handleInputChange}
            />

            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Θυμήσου με"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: '#00695c', py: 1.5, fontWeight: 'bold' }}
            >
              Σύνδεση
            </Button>

            <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', my: 2 }}>
              <Typography sx={{ bgcolor: 'white', px: 1, zIndex: 1, color: 'text.secondary' }}>Ή</Typography>
              <Box sx={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '1px solid #e0e0e0', zIndex: 0 }} />
            </Box>

            <Button fullWidth variant="outlined" startIcon={<GoogleIcon />} sx={{ mb: 3, py: 1, color: '#555', borderColor: '#ddd' }}>
              Σύνδεση μέσω Google
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Link href="/forgot" variant="body2" sx={{ color: '#00695c' }}>
                Ξεχάσατε τον κωδικό;
              </Link>
              <Link href="/register" variant="body2" sx={{ color: '#00695c', fontWeight: 'bold' }}>
                Εγγραφή
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* RIGHT IMAGE PANEL */}
      <Box
        sx={{
          display: { xs: 'none', sm: 'block' },
          flex: { sm: '0 0 33.333%', md: '0 0 50%' },
          height: '100%',
          position: 'relative',
          backgroundImage: 'linear-gradient(120deg, rgba(0,105,92,0.5), rgba(0,105,92,0.08)), url(https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
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
            Καλώς ήρθες πίσω
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.95 }}>
            Συνέχισε να παρακολουθείς την υγεία των αγαπημένων σου.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}