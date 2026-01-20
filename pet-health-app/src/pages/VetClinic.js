import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Grid, Typography, Button, Paper, TextField, Avatar, IconButton, Divider, Switch, FormControlLabel, List, ListItem, ListItemText, InputAdornment, Card, CardContent, Chip, Stack, Fade, useTheme
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import EuroIcon from '@mui/icons-material/Euro';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import PetsIcon from '@mui/icons-material/Pets';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import VaccinesIcon from '@mui/icons-material/Vaccines'; // Using generic icon if Vaccines not available
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

import DashboardSidebar from '../components/DashboardSidebar';
import { vetClinicsAPI } from '../services/api';

// Professional Medical Theme
const theme = createTheme({
  palette: {
    primary: { main: '#0e7490' }, // Professional Teal/Cyan
    secondary: { main: '#64748b' }, // Slate Grey
    success: { main: '#10b981' },
    background: { default: '#f1f5f9', paper: '#ffffff' },
    text: { primary: '#0f172a', secondary: '#475569' }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.5px' },
    h6: { fontWeight: 600, letterSpacing: '-0.25px' },
    button: { textTransform: 'none', fontWeight: 600, borderRadius: 8 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiTextField: { styleOverrides: { root: { '& .MuiOutlinedInput-root': { backgroundColor: '#f8fafc' } } } }
  }
});

// --- Components ---

// 1. The 2x2 Stat Grid Component (Business Version)
const StatSquare = ({ icon: Icon, value, label, color, trend }) => (
    <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
        <Card 
            elevation={0}
            sx={{ 
                width: '100%',
                height: 220,
                minWidth: 180,
                maxWidth: 220,
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                border: '1px solid #e2e8f0',
                background: 'white',
                position: 'relative',
                overflow: 'hidden',
                py: 3
            }}
        >
            {/* Colored Accent Bar */}
            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 4, bgcolor: color }} />
            <Stack alignItems="center" spacing={1.5} sx={{ width: '100%' }}>
                <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: `${color}15`, color: color, display: 'flex', minWidth: 56, minHeight: 56, justifyContent: 'center', alignItems: 'center' }}>
                    <Icon sx={{ fontSize: 32 }} />
                </Box>
                <Typography variant="h4" fontWeight="bold" sx={{ color: '#0f172a' }}>{value}</Typography>
                <Typography variant="caption" fontWeight="600" sx={{ color: '#64748b', textAlign: 'center', letterSpacing: '0.5px', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {label.toUpperCase()}
                </Typography>
            </Stack>
            {trend && (
                <Chip 
                    label={trend} 
                    size="small" 
                    sx={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', bgcolor: `${color}15`, color: color, fontWeight: 700 }}
                />
            )}
        </Card>
    </Grid>
);

// 2. Service Item Row
const ServiceRow = ({ service, onDelete, isEditing }) => (
    <ListItem 
        sx={{ 
            bgcolor: '#f8fafc', 
            mb: 1, 
            borderRadius: 2, 
            border: '1px solid #f1f5f9' 
        }}
        secondaryAction={
            isEditing && (
                <IconButton edge="end" size="small" onClick={() => onDelete(service.id)} sx={{ color: '#ef4444' }}>
                    <DeleteIcon fontSize="small" />
                </IconButton>
            )
        }
    >
        <Box sx={{ mr: 2, p: 1, bgcolor: '#e0f2f1', borderRadius: '50%', color: '#00695c' }}>
            <LocalHospitalIcon fontSize="small" />
        </Box>
        <ListItemText 
            primary={service.name} 
            primaryTypographyProps={{ fontWeight: 600, color: '#334155' }}
            secondary={service.category || "Γενική Κτηνιατρική"}
        />
        <Typography fontWeight="700" color="primary.main" sx={{ mr: 2 }}>
            {service.price}€
        </Typography>
    </ListItem>
);

export default function VetClinicProfile() {
  const [isEditing, setIsEditing] = useState(false);
    const [clinicId, setClinicId] = useState(null);
    const [saving, setSaving] = useState(false);
  const [services, setServices] = useState([
    { id: 1, name: 'Γενική Εξέταση & Διάγνωση', price: '30', category: 'Επίσκεψη' },
    { id: 2, name: 'Ετήσιος Εμβολιασμός (Σκύλος)', price: '35', category: 'Πρόληψη' },
    { id: 3, name: 'Αιματολογικός Έλεγχος', price: '60', category: 'Εργαστήριο' },
    { id: 4, name: 'Microchip & Καταγραφή', price: '40', category: 'Διοικητικά' }
  ]);
  const [newService, setNewService] = useState({ name: '', price: '' });
  const [errors, setErrors] = useState({ phone: '', email: '' });

  const [info, setInfo] = useState({
    name: 'VetCare Clinic Pro',
    description: 'Πρότυπο Κτηνιατρικό Κέντρο Αθηνών. Παρέχουμε ολοκληρωμένη φροντίδα για μικρά ζώα με σύγχρονο εξοπλισμό.',
    address: 'Λεωφόρος Κηφισίας 124, Αμπελόκηποι',
    phone: '+30 210 6543210',
    email: 'contact@vetcarepro.gr',
    emergency: true
  });

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const list = Array.isArray(await vetClinicsAPI.getAll()) ? await vetClinicsAPI.getAll() : [];
                if (!mounted) return;
                if (list.length > 0) {
                    const clinic = list[0];
                    setClinicId(clinic.id || null);
                    setInfo((prev) => ({ ...prev, ...(clinic || {}) }));
                    if (clinic.services) setServices(clinic.services);
                    if (clinic.hours) setHours(clinic.hours);
                }
            } catch (err) {
                // ignore - keep defaults
                console.warn('Could not load vet clinic data', err);
            }
        })();
        return () => { mounted = false; };
    }, []);

  const [hours, setHours] = useState({
    'Δευτέρα': '09:00 - 21:00',
    'Τρίτη': '09:00 - 21:00',
    'Τετάρτη': '09:00 - 21:00',
    'Πέμπτη': '09:00 - 21:00',
    'Παρασκευή': '09:00 - 21:00',
    'Σάββατο': '09:00 - 14:00'
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/[\s\-+]/g, ''));
  };

  const handleInfoChange = (field, value) => {
    setInfo({ ...info, [field]: value });
    if (field === 'email') {
      setErrors({ ...errors, email: validateEmail(value) ? '' : 'Παρακαλώ εισάγετε έγκυρο email' });
    } else if (field === 'phone') {
      setErrors({ ...errors, phone: validatePhone(value) ? '' : 'Παρακαλώ εισάγετε έγκυρο τηλέφωνο (10 ψηφία)' });
    }
  };

  const handleAddService = () => {
    if (newService.name && newService.price) {
      setServices([...services, { id: Date.now(), ...newService, category: 'Νέα Υπηρεσία' }]);
      setNewService({ name: '', price: '' });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f1f5f9', display: 'flex' }}>
        
        <DashboardSidebar />

        <Container maxWidth="lg" sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingLeft: '10px' }}>
            
            {/* Header Area */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', textAlign: 'center', width: '100%', marginLeft: '400px' }}>
                <Box>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, letterSpacing: 1 }}>BUSINESS PROFILE</Typography>
                    <Typography variant="h4" sx={{ color: '#0f172a' }}>Διαχείριση Κλινικής</Typography>
                </Box>
            </Box>

           <Grid container spacing={3} sx={{ justifyContent: 'center', maxWidth: '1200px', flexDirection: 'column', alignItems: 'center', marginLeft: '160px' }}>
                
                {/* --- LEFT COLUMN: IDENTITY & HOURS --- */}
                <Grid item xs={12} sx={{ maxWidth: '800px' }}>
                    <Stack spacing={3}>
                        
                        {/* 1. Identity Card */}
                        <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', overflow: 'visible', position: 'relative' }}>
                                                        <Box sx={{ position: 'absolute', top: 110, right: 16, zIndex: 10 }}>
                                                                <Button 
                                                                        variant="contained" 
                                                                        size="small"
                                                                        startIcon={isEditing ? <SaveIcon /> : <EditIcon />} 
                                                                        onClick={async () => {
                                                                            if (isEditing) {
                                                                                // save
                                                                                setSaving(true);
                                                                                try {
                                                                                    const payload = { ...info, services, hours };
                                                                                    if (clinicId) {
                                                                                        const updated = await vetClinicsAPI.update(clinicId, payload);
                                                                                        setInfo((prev) => ({ ...prev, ...(updated || {}) }));
                                                                                        setServices(updated.services || services);
                                                                                        setHours(updated.hours || hours);
                                                                                        alert('Οι αλλαγές αποθηκεύτηκαν.');
                                                                                    } else {
                                                                                        // no clinic id: try updating first returned clinic
                                                                                        const list = Array.isArray(await vetClinicsAPI.getAll()) ? await vetClinicsAPI.getAll() : [];
                                                                                        if (list.length > 0) {
                                                                                            const id = list[0].id;
                                                                                            const updated = await vetClinicsAPI.update(id, payload);
                                                                                            setClinicId(id);
                                                                                            setInfo((prev) => ({ ...prev, ...(updated || {}) }));
                                                                                            setServices(updated.services || services);
                                                                                            setHours(updated.hours || hours);
                                                                                            alert('Οι αλλαγές αποθηκεύτηκαν.');
                                                                                        } else {
                                                                                            alert('Δεν βρέθηκε εγγραφή κλινικής για ενημέρωση.');
                                                                                        }
                                                                                    }
                                                                                } catch (err) {
                                                                                    console.error('Failed to save clinic', err);
                                                                                    alert('Σφάλμα κατά την αποθήκευση. Έλεγξε ότι τρέχει ο json-server στο 3001.');
                                                                                } finally {
                                                                                    setSaving(false);
                                                                                    setIsEditing(false);
                                                                                }
                                                                            } else {
                                                                                setIsEditing(true);
                                                                            }
                                                                        }}
                                                                        color={isEditing ? "success" : "primary"}
                                                                        sx={{ px: 2, boxShadow: '0 4px 14px 0 rgba(14, 116, 144, 0.3)' }}
                                                                        disabled={saving}
                                                                >
                                                                        {isEditing ? (saving ? 'Αποθήκευση...' : 'Αποθήκευση') : 'Επεξεργασία'}
                                                                </Button>
                                                        </Box>
                            <Box sx={{ height: 100, background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)', borderRadius: '16px 16px 0 0', position: 'relative' }}>
                                <Avatar 
                                    src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=200&q=80" 
                                    sx={{ width: 110, height: 110, border: '4px solid #fff', position: 'absolute', bottom: -55, left: 30, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                                />
                                {isEditing && (
                                    <IconButton 
                                        size="small" 
                                        sx={{ position: 'absolute', bottom: -50, left: 100, bgcolor: 'primary.main', color: '#fff', '&:hover': { bgcolor: 'primary.dark' } }}
                                    >
                                        <PhotoCameraIcon fontSize="small" />
                                    </IconButton>
                                )}
                                <Chip label="Premium Partner" color="warning" size="small" icon={<VerifiedUserIcon />} sx={{ position: 'absolute', top: 16, right: 16, bgcolor: '#fbbf24', color: '#78350f', fontWeight: 700 }} />
                            </Box>
                            
                            <CardContent sx={{ pt: 8, px: 4, pb: 4 }}>
                                <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5 }}>{info.name}</Typography>
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                    <Chip label="Ανοιχτά Τώρα" size="small" color="success" sx={{ height: 24, fontWeight: 600, bgcolor: '#dcfce7', color: '#166534' }} />
                                    <Typography variant="body2" color="text.secondary"> • Κτηνιατρική Κλινική</Typography>
                                </Stack>

                                <TextField 
                                    multiline rows={2} fullWidth variant="outlined" 
                                    value={info.description} 
                                    disabled={!isEditing}
                                    sx={{ mb: 3, '& .MuiInputBase-root': { fontSize: '0.9rem', color: '#475569' } }}
                                />

                                <Stack spacing={2}>
                                    <TextField fullWidth size="small" disabled={!isEditing} value={info.address} onChange={(e) => setInfo({...info, address: e.target.value})} InputProps={{ startAdornment: <InputAdornment position="start"><LocationOnIcon color="action" fontSize="small"/></InputAdornment> }} />
                                    <TextField 
                                        fullWidth 
                                        size="small" 
                                        disabled={!isEditing} 
                                        value={info.phone} 
                                        onChange={(e) => handleInfoChange('phone', e.target.value)}
                                        error={isEditing && !!errors.phone}
                                        helperText={isEditing ? errors.phone : ''}
                                        InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon color="action" fontSize="small"/></InputAdornment> }} 
                                    />
                                    <TextField 
                                        fullWidth 
                                        size="small" 
                                        disabled={!isEditing} 
                                        value={info.email} 
                                        onChange={(e) => handleInfoChange('email', e.target.value)}
                                        error={isEditing && !!errors.email}
                                        helperText={isEditing ? errors.email : ''}
                                        InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon color="action" fontSize="small"/></InputAdornment> }} 
                                    />
                                </Stack>
                            </CardContent>
                        </Card>

                        {/* 2. Business Analytics (2x2 Grid) */}
                        <Box>
                             <Typography variant="h6" sx={{ mb: 2, color: '#334155', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <TrendingUpIcon color="primary" /> Στατιστικά Επιχείρησης
                            </Typography>
                            <Grid container spacing={2} alignItems="stretch">
                                <StatSquare icon={PeopleIcon} value="124" label="Νέοι Πελάτες" color="#0e7490" trend="+12%" />
                                <StatSquare icon={PetsIcon} value="45" label="Επισκέψεις Σήμερα" color="#f59e0b" />
                                <StatSquare icon={EuroIcon} value="8.5k" label="Έσοδα Μήνα" color="#10b981" trend="+5%" />
                                <StatSquare icon={MonitorHeartIcon} value="98%" label="Ικανοποίηση" color="#ef4444" />
                            </Grid>
                        </Box>

                    </Stack>
                </Grid>

                {/* --- RIGHT COLUMN: SERVICES & SETTINGS --- */}
                <Grid item xs={12} sx={{ maxWidth: '800px' }}>
                    <Stack spacing={3}>
                        
                        {/* 1. Services Management */}
                        <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" fontWeight="bold" sx={{ color: '#0f172a' }}>Υπηρεσίες & Τιμοκατάλογος</Typography>
                            </Box>
                            
                            {isEditing && (
                                <Box sx={{ p: 2, bgcolor: '#f1f5f9', borderRadius: 2, mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <TextField 
                                        size="small" placeholder="Όνομα Υπηρεσίας" sx={{ flexGrow: 1, bgcolor: 'white' }} 
                                        value={newService.name} onChange={(e) => setNewService({...newService, name: e.target.value})}
                                    />
                                    <TextField 
                                        size="small" placeholder="Τιμή" sx={{ width: 100, bgcolor: 'white' }} 
                                        InputProps={{ endAdornment: <InputAdornment position="end">€</InputAdornment> }}
                                        value={newService.price} onChange={(e) => setNewService({...newService, price: e.target.value})}
                                    />
                                    <Button variant="contained" onClick={handleAddService} sx={{ minWidth: 40, width: 40, height: 40, p: 0 }}><AddIcon /></Button>
                                </Box>
                            )}

                            <List disablePadding>
                                {services.map((service) => (
                                    <ServiceRow key={service.id} service={service} isEditing={isEditing} onDelete={(id) => setServices(services.filter(s => s.id !== id))} />
                                ))}
                            </List>
                        </Paper>

                        {/* 2. Operational Settings & Hours */}
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', height: '100%' }}>
                                     <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AccessTimeIcon color="action" /> Ωράριο Λειτουργίας
                                    </Typography>
                                    <Stack spacing={1.5}>
                                        {['Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή'].map(day => (
                                            <Box key={day} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', gap: 2 }}>
                                                <Typography color="text.secondary" sx={{ minWidth: 80 }}>{day}</Typography>
                                                {isEditing ? (
                                                    <TextField 
                                                        size="small" 
                                                        value={hours[day]} 
                                                        onChange={(e) => setHours({...hours, [day]: e.target.value})}
                                                        variant="outlined"
                                                        sx={{ width: 150 }}
                                                    />
                                                ) : (
                                                    <Typography fontWeight="500">{hours[day]}</Typography>
                                                )}
                                            </Box>
                                        ))}
                                        <Divider sx={{ my: 1 }} />
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', gap: 2 }}>
                                            <Typography color="text.secondary" sx={{ minWidth: 80 }}>Σάββατο</Typography>
                                            {isEditing ? (
                                                <TextField 
                                                    size="small" 
                                                    value={hours['Σάββατο']} 
                                                    onChange={(e) => setHours({...hours, 'Σάββατο': e.target.value})}
                                                    variant="outlined"
                                                    sx={{ width: 150 }}
                                                />
                                            ) : (
                                                <Typography fontWeight="500">{hours['Σάββατο']}</Typography>
                                            )}
                                        </Box>
                                    </Stack>
                                </Paper>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', height: '100%' }}>
                                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>Ρυθμίσεις Κλινικής</Typography>
                                    <Stack spacing={0}>
                                        <FormControlLabel 
                                            control={<Switch defaultChecked disabled={!isEditing} />} 
                                            label={<Typography variant="body2">Δέχομαι Επείγοντα (24/7)</Typography>} 
                                        />
                                        <Divider sx={{ my: 1 }} />
                                        <FormControlLabel 
                                            control={<Switch disabled={!isEditing} />} 
                                            label={<Typography variant="body2">Κατ' οίκον επισκέψεις</Typography>} 
                                        />
                                        <Divider sx={{ my: 1 }} />
                                        <FormControlLabel 
                                            control={<Switch defaultChecked disabled={!isEditing} />} 
                                            label={<Typography variant="body2">Online Ραντεβού</Typography>} 
                                        />
                                    </Stack>
                                    
                                    <Box sx={{ mt: 3, p: 2, bgcolor: '#fff7ed', borderRadius: 2, border: '1px solid #ffedd5' }}>
                                        <Typography variant="caption" color="warning.main" fontWeight="bold">ΣΥΝΔΡΟΜΗ PRO</Typography>
                                        <Typography variant="body2" sx={{ fontSize: '0.8rem', mt: 0.5 }}>Η συνδρομή σας λήγει σε 25 ημέρες.</Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Stack>
                </Grid>

            </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}