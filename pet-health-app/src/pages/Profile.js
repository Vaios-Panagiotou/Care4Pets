import React, { useMemo, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Paper,
  Avatar,
  TextField,
  IconButton,
  Divider,
  Stack,
  Chip,
  Tooltip,
  InputAdornment
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardSidebar from '../components/DashboardSidebar';
import PageHeader from './PageHeader';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import EmailIcon from '@mui/icons-material/Email';
import AddIcon from '@mui/icons-material/Add';
import LockIcon from '@mui/icons-material/Lock';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BadgeIcon from '@mui/icons-material/Badge';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import WcIcon from '@mui/icons-material/Wc';
import FingerprintIcon from '@mui/icons-material/Fingerprint';

// Ενημερωμένο ProfileField με εικονίδιο επεξεργασίας δίπλα στο input
const ProfileField = ({ label, value, type = 'text', onChange, name, editable, icon: Icon }) => (
  <Box sx={{ mb: 3, width: '100%' }}>
    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
      {Icon && <Icon fontSize="small" sx={{ color: '#3b82f6' }} />}
      <Typography variant="caption" fontWeight="bold" sx={{ color: '#666' }}>
        {label}
      </Typography>
    </Stack>
    <TextField
      fullWidth
      variant="filled"
      value={value ?? ''}
      name={name}
      onChange={onChange}
      type={type}
      InputProps={{ 
        readOnly: !editable, 
        disableUnderline: true,
        endAdornment: editable && (
          <InputAdornment position="end">
            <IconButton size="small" sx={{ color: '#3b82f6' }}>
              <EditIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        )
      }}
      sx={{
        '& .MuiFilledInput-root': {
          bgcolor: '#f5f6f7',
          borderRadius: 2,
          border: editable ? '1px solid #3b82f6' : '1px solid transparent',
          transition: 'all 0.2s',
          '&:hover': { bgcolor: '#eef0f3' },
          '&.Mui-focused': { bgcolor: '#fff', boxShadow: '0 0 0 2px rgba(59,130,246,0.2)' }
        }
      }}
    />
  </Box>
);

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, login } = useAuth();
  const [editable, setEditable] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(() => ({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    gender: user?.gender || '',
    idNumber: user?.idNumber || ''
  }));

  // Βασική επικύρωση email (π.χ. name@example.com)
  const isValidEmail = (email) => {
    if (!email || typeof email !== 'string') return false;
    const trimmed = email.trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  };

  const greetingName = useMemo(() => user?.name || 'Χρήστης', [user]);
  const avatarSrc = user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user?.id) return;
    // Ελέγχουμε ότι το email έχει σωστή μορφή
    if (form.email && !isValidEmail(form.email)) {
      setError('Μη έγκυρο email. Παρακαλώ εισάγετε μορφή name@example.com.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:3001/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user, ...form, email: (form.email || '').trim() })
      });
      if (!res.ok) throw new Error();
      const saved = await res.json();
      login(saved);
      setEditable(false);
    } catch (e) {
      setError('Σφάλμα αποθήκευσης.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#1f2022', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Paper sx={{ p: 2, borderRadius: 2, mb: 3 }}><PageHeader /></Paper>
        
        <Box sx={{ display: 'flex', gap: 3 }}>
          <DashboardSidebar />

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold' }}>Καλημέρα {greetingName}</Typography>
            <Typography variant="body2" sx={{ color: '#9ea3ae', mb: 4 }}>
              {new Date().toLocaleDateString('el-GR', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' })}
            </Typography>

            <Paper sx={{ 
              p: { xs: 3, md: 4 }, 
              borderRadius: 4, 
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              bgcolor: '#fff' 
            }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 6 }}>
                <Stack direction="row" spacing={3} alignItems="center">
                  <Avatar src={avatarSrc} sx={{ width: 120, height: 120, border: '4px solid #f0f2f5' }} />
                  <Box>
                    <Typography variant="h5" fontWeight="bold">{form.name}</Typography>
                    <Typography variant="body1" color="text.secondary">{form.email}</Typography>
                  </Box>
                </Stack>
                <IconButton color="error" onClick={() => { logout(); navigate('/login'); }}><LogoutIcon /></IconButton>
              </Stack>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <ProfileField label="Ονοματεπώνυμο" name="name" value={form.name} onChange={handleChange} editable={editable} icon={BadgeIcon} />
                  <ProfileField label="Φύλο" name="gender" value={form.gender} onChange={handleChange} editable={editable} icon={WcIcon} />
                  <ProfileField label="Αριθμός Ταυτότητας" name="idNumber" value={form.idNumber} onChange={handleChange} editable={editable} icon={FingerprintIcon} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ProfileField label="Κωδικός Πρόσβασης" value="••••••" type="password" editable={false} icon={LockIcon} />
                  <ProfileField label="Email" name="email" value={form.email} onChange={handleChange} editable={editable} type="email" icon={EmailIcon} />
                  <ProfileField label="Κινητό Τηλέφωνο" name="phone" value={form.phone} onChange={handleChange} editable={editable} icon={PhoneIcon} />
                  <ProfileField label="Διεύθυνση" name="address" value={form.address} onChange={handleChange} editable={editable} icon={HomeIcon} />
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />

              <Stack direction="row" spacing={2}>
                {!editable ? (
                  <Button variant="contained" size="large" startIcon={<EditIcon />} onClick={() => setEditable(true)} sx={{ px: 4, borderRadius: 2 }}>
                    Επεξεργασία Προφίλ
                  </Button>
                ) : (
                  <>
                    <Button variant="contained" color="success" size="large" onClick={handleSave} disabled={saving} sx={{ px: 4, borderRadius: 2 }}>
                      {saving ? 'Αποθήκευση...' : 'Αποθήκευση Αλλαγών'}
                    </Button>
                    <Button variant="outlined" size="large" onClick={() => setEditable(false)} sx={{ px: 4, borderRadius: 2 }}>
                      Ακύρωση
                    </Button>
                  </>
                )}
              </Stack>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}