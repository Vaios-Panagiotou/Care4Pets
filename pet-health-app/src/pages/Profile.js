import React, { useMemo, useState } from 'react';
import { 
  Box, Container, Grid, Typography, Button, Paper, Avatar, TextField, IconButton, Divider
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import EmailIcon from '@mui/icons-material/Email';
import AddIcon from '@mui/icons-material/Add';

// Import PageHeader
import PageHeader from './PageHeader';

const theme = createTheme({
  palette: {
    primary: { main: '#3B82F6' }, // Το μπλε κουμπί "Επεξεργασία"
    text: { primary: '#333', secondary: '#666' },
    background: { default: '#333' } // Dark background για όλη τη σελίδα όπως στο screenshot
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    button: { textTransform: 'none', fontWeight: 600 },
    h6: { fontWeight: 700 }
  },
  shape: { borderRadius: 12 },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiFilledInput-root': {
            backgroundColor: '#F3F4F6', // Το γκρι φόντο των inputs
            borderRadius: '8px',
            '&:before, &:after': { display: 'none' }, // Αφαίρεση γραμμής από κάτω
            '&:hover': { backgroundColor: '#E5E7EB' }
          }
        }
      }
    }
  }
});

// --- HELPER COMPONENT: FORM FIELD ---
const ProfileField = ({ label, value, type = "text", onChange, name, editable }) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="caption" fontWeight="bold" sx={{ color: '#666', mb: 1, display: 'block' }}>
      {label}
    </Typography>
    <TextField
      fullWidth
      variant="filled"
      value={value ?? ''}
      name={name}
      onChange={onChange}
      type={type}
      InputProps={{
        readOnly: !editable,
        disableUnderline: true
      }}
    />
  </Box>
);

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, login } = useAuth();
  const [editable, setEditable] = useState(false);
  const [form, setForm] = useState(() => ({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    gender: user?.gender || '',
    idNumber: user?.idNumber || ''
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const greetingName = useMemo(() => user?.name || 'Χρήστης', [user]);
  const avatarSrc = user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setError('');
    if (!user?.id) {
      setError('Δεν βρέθηκε user id για ενημέρωση.');
      return;
    }
    setSaving(true);
    const updated = { ...user, ...form };
    try {
      const res = await fetch(`http://localhost:3001/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updated)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const saved = await res.json();
      // Update in-app session with latest server data
      login(saved);
      setEditable(false);
    } catch (e) {
      setError('Αποτυχία αποθήκευσης στο server. Βεβαιώσου ότι τρέχει το json-server.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {/* Dark Background Wrapper */}
      <Box sx={{ minHeight: '100vh', bgcolor: '#2c2c2c', pb: 8, pt: 2 }}>
        
        {/* White Header Area (Logo placeholder) */}
        <Container maxWidth="xl" sx={{ mb: 4 }}>
             {/* Εδώ βάζουμε το PageHeader αλλά με custom style για να ταιριάζει στο dark theme αν θες, 
                 ή απλά το αφήνουμε ως έχει. Στο σχέδιο δεν φαίνεται header, αλλά είναι καλό για UX */}
             <Paper sx={{ p: 1, borderRadius: '12px', bgcolor: 'white' }}>
                <PageHeader />
             </Paper>
        </Container>

        <Container maxWidth="lg">
          
          <Typography variant="h5" sx={{ color: 'white', mb: 0.5 }}>Καλημέρα {greetingName}</Typography>
          <Typography variant="caption" sx={{ color: '#bbb', mb: 4, display: 'block' }}>Τετάρτη, 19 Νοε 2025</Typography>

          <Grid container spacing={4}>
            
            {/* --- LEFT COLUMN: MAIN FORM --- */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 5, borderRadius: '24px', bgcolor: 'white' }}>
                
                {/* Header Profile Section inside Card */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 6, flexWrap: 'wrap', gap: 2 }}>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ position: 'relative' }}>
                            <Avatar 
                              src={avatarSrc}
                              sx={{ width: 70, height: 70 }} 
                            />
                            <Box sx={{ 
                                position: 'absolute', bottom: 0, right: 0, 
                                bgcolor: 'white', borderRadius: '50%', p: 0.5, border: '1px solid #ddd' 
                            }}>
                                <EditIcon sx={{ fontSize: 14, color: '#333' }} />
                            </Box>
                        </Box>
                        <Box>
                            <Typography variant="h6">{form.name || greetingName}</Typography>
                            <Typography variant="body2" color="text.secondary">{form.email || user?.email || ''}</Typography>
                        </Box>
                    </Box>

                    {/* Auto-save Banner */}
                    <Box sx={{ 
                        border: '1px solid #333', 
                        px: 3, py: 1, 
                        borderRadius: '4px',
                        display: { xs: 'none', sm: 'block' } 
                    }}>
                        <Typography variant="body2" fontWeight="500">Οι αλλαγές αποθηκεύονται αυτόματα</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {!editable ? (
                        <Button variant="contained" sx={{ bgcolor: '#3B82F6', borderRadius: '8px', boxShadow: 'none' }} onClick={() => setEditable(true)} startIcon={<EditIcon />}>
                          Επεξεργασία
                        </Button>
                      ) : (
                        <>
                          <Button variant="contained" sx={{ bgcolor: '#10B981', borderRadius: '8px', boxShadow: 'none' }} onClick={handleSave} disabled={saving}>
                            {saving ? 'Αποθήκευση…' : 'Αποθήκευση'}
                          </Button>
                          <Button variant="outlined" onClick={() => { setEditable(false); setForm({
                            name: user?.name || '',
                            email: user?.email || '',
                            phone: user?.phone || '',
                            address: user?.address || '',
                            gender: user?.gender || '',
                            idNumber: user?.idNumber || ''
                          }); }}>
                            Άκυρο
                          </Button>
                        </>
                      )}
                      <IconButton color="error" onClick={() => { logout(); navigate('/login'); }}>
                        <LogoutIcon />
                      </IconButton>
                    </Box>
                    {error && (
                      <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                        {error}
                      </Typography>
                    )}
                </Box>

                {/* FIELDS GRID */}
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <ProfileField label="Ονοματεπώνυμο" name="name" value={form.name} onChange={handleChange} editable={editable} />
                        <ProfileField label="Φύλο" name="gender" value={form.gender} onChange={handleChange} editable={editable} />
                        <ProfileField label="Αριθμός Ταυτότητας" name="idNumber" value={form.idNumber} onChange={handleChange} editable={editable} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <ProfileField label="Κωδικός Πρόσβασης" value="*****" type="password" editable={false} />
                        <ProfileField label="Κινητό Τηλέφωνο" name="phone" value={form.phone} onChange={handleChange} editable={editable} />
                        <ProfileField label="Διεύθυνση" name="address" value={form.address} onChange={handleChange} editable={editable} />
                    </Grid>
                </Grid>

                {/* EMAIL SECTION */}
                <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" fontWeight="bold" sx={{ color: '#666', mb: 2, display: 'block' }}>
                        To email μου
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ bgcolor: '#E3F2FD', p: 1, borderRadius: '50%', color: '#1976D2' }}>
                                <EmailIcon fontSize="small" />
                            </Box>
                            <Box>
                                <Typography variant="body2" fontWeight="bold">{form.email || user?.email || ''}</Typography>
                                <Typography variant="caption" color="text.secondary">1 month ago</Typography>
                            </Box>
                        </Box>
                        <IconButton size="small" onClick={() => setEditable(true)}><EditIcon fontSize="small" /></IconButton>
                    </Box>

                    <Button 
                        startIcon={<AddIcon />} 
                        sx={{ bgcolor: '#E3F2FD', color: '#1976D2', px: 3, borderRadius: '8px', fontWeight: 'bold' }}
                    >
                        +Προσθήκη Email
                    </Button>
                </Box>

              </Paper>
            </Grid>

            {/* --- RIGHT COLUMN: Minimal card with quick actions --- */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 4, borderRadius: '24px', bgcolor: 'white' }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Avatar src={avatarSrc} sx={{ width: 80, height: 80, mx: 'auto', mb: 1 }} />
                  <Typography variant="h6" fontSize="1rem">{form.name || greetingName}</Typography>
                  <Typography variant="caption" color="text.secondary">{form.email || user?.email || ''}</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                  <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setEditable(true)}>Επεξεργασία</Button>
                  <Button variant="outlined" color="error" startIcon={<LogoutIcon />} onClick={() => { logout(); navigate('/login'); }}>Αποσύνδεση</Button>
                </Box>
              </Paper>
            </Grid>

          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}