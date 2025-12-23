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
  Fade,
  Chip,
  Card,
  CardContent,
  useTheme,
  InputAdornment
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardSidebar from '../components/DashboardSidebar';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import EmailIcon from '@mui/icons-material/Email';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import LockIcon from '@mui/icons-material/Lock';
import BadgeIcon from '@mui/icons-material/Badge';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import WcIcon from '@mui/icons-material/Wc';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

// --- Styled Components ---

// A field that looks like a clean text block until edited
const CreativeField = ({ label, value, type = 'text', onChange, name, editable, icon: Icon, width = 12 }) => (
  <Grid item xs={12} md={width}>
    <Box 
      sx={{ 
        p: 2, 
        borderRadius: 3,
        border: editable ? '1px solid #e2e8f0' : '1px solid transparent',
        bgcolor: editable ? '#fff' : 'transparent',
        transition: 'all 0.3s ease',
        '&:hover': {
           bgcolor: editable ? '#fff' : 'rgba(0,0,0,0.02)'
        }
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        {/* Icon Box */}
        <Box 
            sx={{ 
                width: 40, 
                height: 40, 
                borderRadius: '12px', 
                bgcolor: 'rgba(59, 130, 246, 0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#3b82f6'
            }}
        >
            {Icon && <Icon fontSize="small" />}
        </Box>

        {/* Text/Input Area */}
        <Box sx={{ flexGrow: 1 }}>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, letterSpacing: 0.5 }}>
                {label.toUpperCase()}
            </Typography>
            
            {editable ? (
                 <TextField
                    fullWidth
                    variant="standard"
                    value={value ?? ''}
                    name={name}
                    onChange={onChange}
                    type={type}
                    InputProps={{ disableUnderline: true, sx: { fontSize: '1rem', fontWeight: 500 } }}
                 />
            ) : (
                <Typography variant="body1" sx={{ fontWeight: 500, color: '#334155', minHeight: '24px' }}>
                    {type === 'password' ? '••••••••' : value}
                </Typography>
            )}
        </Box>
      </Stack>
    </Box>
  </Grid>
);

export default function Profile() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user, logout, login } = useAuth();
  
  const [editable, setEditable] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(() => ({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    gender: user?.gender || '',
    idNumber: user?.idNumber || ''
  }));

  const avatarSrc = user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
        setSaving(false);
        setEditable(false);
        login({ ...user, ...form });
    }, 1000);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#f1f5f9' }}>
      
      {/* Decorative Background Blobs */}
      <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <Box sx={{ position: 'absolute', top: '-10%', right: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(255,255,255,0) 70%)' }} />
        <Box sx={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(255,255,255,0) 70%)' }} />
      </Box>

      <DashboardSidebar />

      <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        
        {/* Page Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
                <Typography variant="h4" fontWeight="bold" sx={{ color: '#1e293b' }}>Το Προφίλ μου</Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>Διαχείριση προσωπικών στοιχείων και ασφάλειας</Typography>
            </Box>
        </Box>

        <Grid container spacing={4}>
            
          {/* LEFT COLUMN: IDENTITY CARD */}
          <Grid item xs={12} md={4}>
            <Card 
                sx={{ 
                    borderRadius: 4, 
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
                    bgcolor: '#fff',
                    overflow: 'visible' 
                }}
            >
                {/* Banner inside card */}
                <Box sx={{ 
                    height: 120, 
                    background: 'linear-gradient(120deg, #3b82f6 0%, #8b5cf6 100%)',
                    borderRadius: '16px 16px 0 0',
                    position: 'relative'
                }}>
                    <Box 
                        sx={{ 
                            position: 'absolute', 
                            bottom: -50, 
                            left: '50%', 
                            transform: 'translateX(-50%)',
                            p: 0.5,
                            bgcolor: '#fff',
                            borderRadius: '50%'
                        }}
                    >
                        <Avatar src={avatarSrc} sx={{ width: 100, height: 100, border: '4px solid #fff' }} />
                        <IconButton 
                            size="small" 
                            sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: '#1e293b', color: '#fff', '&:hover': { bgcolor: '#000' } }}
                        >
                            <CameraAltIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>

                <CardContent sx={{ mt: 6, textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight="bold" sx={{ color: '#1e293b' }}>
                        {form.name || 'User Name'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {form.email}
                    </Typography>

                    <Chip 
                        icon={<VerifiedUserIcon fontSize="small" />} 
                        label="Verified Account" 
                        size="small" 
                        color="success" 
                        variant="soft" 
                        sx={{ bgcolor: '#dcfce7', color: '#166534', fontWeight: 600, mb: 3 }} 
                    />

                    <Divider sx={{ my: 2 }} />

                    <Stack spacing={2}>
                        {!editable ? (
                             <Button 
                                variant="contained" 
                                fullWidth 
                                startIcon={<EditIcon />}
                                onClick={() => setEditable(true)}
                                sx={{ borderRadius: 2, textTransform: 'none', bgcolor: '#1e293b' }}
                            >
                                Επεξεργασία Προφίλ
                            </Button>
                        ) : (
                            <Stack direction="row" spacing={2}>
                                <Button 
                                    variant="outlined" 
                                    fullWidth
                                    onClick={() => setEditable(false)}
                                    sx={{ borderRadius: 2, textTransform: 'none' }}
                                >
                                    Ακύρωση
                                </Button>
                                <Button 
                                    variant="contained" 
                                    fullWidth
                                    onClick={handleSave}
                                    disabled={saving}
                                    sx={{ borderRadius: 2, textTransform: 'none', bgcolor: '#1e293b' }}
                                >
                                    {saving ? 'Αποθήκευση...' : 'Αποθήκευση'}
                                </Button>
                            </Stack>
                        )}
                        
                        <Button 
                            variant="outlined" 
                            color="error" 
                            fullWidth 
                            startIcon={<LogoutIcon />}
                            onClick={() => { logout(); navigate('/login'); }}
                            sx={{ borderRadius: 2, textTransform: 'none', borderColor: '#fee2e2', color: '#ef4444', '&:hover': { borderColor: '#ef4444', bgcolor: '#fef2f2' } }}
                        >
                            Αποσύνδεση
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
          </Grid>

          {/* RIGHT COLUMN: DETAILS FORM */}
          <Grid item xs={12} md={8}>
            <Fade in={true} timeout={800}>
                <Paper sx={{ 
                    p: 0, 
                    borderRadius: 4, 
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)',
                    bgcolor: '#fff',
                    overflow: 'hidden'
                }}>
                    {/* Section 1: General Info */}
                    <Box sx={{ p: 4 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box component="span" sx={{ width: 4, height: 24, bgcolor: '#3b82f6', borderRadius: 1 }} />
                            Βασικές Πληροφορίες
                        </Typography>
                        
                        <Grid container spacing={1}>
                            <CreativeField label="Ονοματεπώνυμο" name="name" value={form.name} onChange={handleChange} editable={editable} icon={BadgeIcon} width={12} />
                            <CreativeField label="Email" name="email" value={form.email} onChange={handleChange} editable={editable} icon={EmailIcon} width={12} />
                            <CreativeField label="Φύλο" name="gender" value={form.gender} onChange={handleChange} editable={editable} icon={WcIcon} width={6} />
                            <CreativeField label="Αρ. Ταυτότητας" name="idNumber" value={form.idNumber} onChange={handleChange} editable={editable} icon={FingerprintIcon} width={6} />
                        </Grid>
                    </Box>

                    <Divider />

                    {/* Section 2: Contact & Security */}
                    <Box sx={{ p: 4, bgcolor: '#f8fafc' }}>
                         <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box component="span" sx={{ width: 4, height: 24, bgcolor: '#8b5cf6', borderRadius: 1 }} />
                            Επικοινωνία & Ασφάλεια
                        </Typography>

                        <Grid container spacing={1}>
                            <CreativeField label="Τηλέφωνο" name="phone" value={form.phone} onChange={handleChange} editable={editable} icon={PhoneIcon} width={6} />
                            <CreativeField label="Διεύθυνση" name="address" value={form.address} onChange={handleChange} editable={editable} icon={HomeIcon} width={6} />
                            <CreativeField label="Κωδικός" value="••••••••" editable={false} icon={LockIcon} width={12} />
                        </Grid>
                    </Box>
                </Paper>
            </Fade>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}