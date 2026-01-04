import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Alert, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageHeader from './PageHeader';
import PetsIcon from '@mui/icons-material/Pets';
import { usersAPI } from '../services/api';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState('request'); // 'request' | 'reset' | 'done'
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRequest = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const found = await usersAPI.getByEmail(email.trim());
      if (Array.isArray(found) && found.length > 0) {
        setUser(found[0]);
        setStep('reset');
        setSuccess('Βρέθηκε λογαριασμός. Ορίστε νέο κωδικό πρόσβασης.');
      } else {
        setError('Δεν βρέθηκε χρήστης με αυτό το email.');
      }
    } catch (err) {
      console.error(err);
      setError('Αδυναμία επικοινωνίας με τον server.');
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!newPassword || newPassword.length < 4) {
      setError('Ο νέος κωδικός πρέπει να έχει τουλάχιστον 4 χαρακτήρες.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Οι κωδικοί δεν ταιριάζουν.');
      return;
    }
    try {
      const updated = { ...user, password: newPassword };
      await usersAPI.update(user.id, updated);
      setStep('done');
      setSuccess('Ο κωδικός ενημερώθηκε επιτυχώς. Μπορείτε να συνδεθείτε.');
    } catch (err) {
      console.error(err);
      setError('Αποτυχία ενημέρωσης κωδικού.');
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* LEFT PANEL */}
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
            Ανάκτηση Κωδικού
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          {step === 'request' && (
            <Box component="form" onSubmit={handleRequest} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, bgcolor: '#00695c', py: 1.5, fontWeight: 'bold' }}>
                Συνέχεια
              </Button>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Link href="/login" sx={{ color: '#00695c' }}>Επιστροφή στη Σύνδεση</Link>
              </Box>
            </Box>
          )}

          {step === 'reset' && (
            <Box component="form" onSubmit={handleReset} noValidate>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Λογαριασμός: <strong>{user?.email}</strong>
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                name="newPassword"
                label="Νέος Κωδικός"
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Επιβεβαίωση Κωδικού"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, bgcolor: '#00695c', py: 1.5, fontWeight: 'bold' }}>
                Αποθήκευση Νέου Κωδικού
              </Button>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Link href="/login" sx={{ color: '#00695c' }}>Επιστροφή στη Σύνδεση</Link>
              </Box>
            </Box>
          )}

          {step === 'done' && (
            <Box>
              <Typography sx={{ mb: 2 }}>Ο κωδικός σας ενημερώθηκε.</Typography>
              <Button fullWidth variant="contained" sx={{ bgcolor: '#00695c' }} onClick={() => navigate('/login')}>
                Μετάβαση στη Σύνδεση
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* RIGHT PANEL */}
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
            Ξεχάσατε τον κωδικό;
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.95 }}>
            Επαναφέρετε τον άμεσα και ασφαλώς.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
