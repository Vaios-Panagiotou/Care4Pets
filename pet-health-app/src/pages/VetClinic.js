import React, { useState } from 'react';
import { 
  Box, Container, Grid, Typography, Button, Paper, TextField, Avatar, IconButton, Divider, Switch, FormControlLabel, List, ListItem, ListItemText 
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MapIcon from '@mui/icons-material/Map';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import EuroIcon from '@mui/icons-material/Euro';

// Import PageHeader
import PageHeader from './PageHeader';
import DashboardSidebar from '../components/DashboardSidebar';

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
      styleOverrides: {
        root: { bgcolor: 'white' }
      }
    }
  }
});

// --- MOCK DATA ---
const INITIAL_SERVICES = [
  { id: 1, name: 'Γενική Εξέταση', price: '30' },
  { id: 2, name: 'Εμβολιασμός', price: '25' },
  { id: 3, name: 'Στείρωση (Γάτα)', price: '80' }
];

export default function VetClinic() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [newService, setNewService] = useState({ name: '', price: '' });

  // States για τα πεδία
  const [info, setInfo] = useState({
    name: 'Κτηνιατρικό Κέντρο Ζωούπολη',
    address: 'Πανεπιστημίου 16, Αθήνα',
    phone: '210 1234567',
    email: 'info@zooupoli.gr',
    desc: 'Σύγχρονο κτηνιατρείο με εξειδίκευση στα μικρά ζώα.'
  });

  const [hours, setHours] = useState({
    'Δευτέρα': '09:00 - 21:00',
    'Τρίτη': '09:00 - 21:00',
    'Τετάρτη': '09:00 - 21:00',
    'Πέμπτη': '09:00 - 21:00',
    'Παρασκευή': '09:00 - 21:00',
    'Σάββατο': '09:00 - 14:00',
    'Κυριακή': 'Κλειστά'
  });

  const [settings, setSettings] = useState({
    visibleInMap: true,
    emergencyCases: true,
    homeVisits: false
  });

  const handleSave = () => {
    setIsEditing(false);
    alert('Οι αλλαγές αποθηκεύτηκαν επιτυχώς!');
  };

  const handleAddService = () => {
    if (newService.name && newService.price) {
      setServices([...services, { id: services.length + 1, ...newService }]);
      setNewService({ name: '', price: '' });
    }
  };

  const handleDeleteService = (id) => {
    setServices(services.filter(s => s.id !== id));
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 10, display: 'flex', flexDirection: 'column' }}>
        
        <Container maxWidth="xl" sx={{ pt: 2 }}>
            <PageHeader />
        </Container>

        <Box sx={{ display: 'flex', flex: 1, maxWidth: '100vw', overflow: 'hidden', p: 2, gap: 2 }}>
          <DashboardSidebar />
          
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            {/* HERO HEADER */}
            <Box sx={{ bgcolor: '#1976d2', py: 5, mb: 5, color: 'white', mr: -2 }}>
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Το Ιατρείο μου</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>Διαχείριση προφίλ, ωραρίου και υπηρεσιών</Typography>
                        </Box>
                        <Button 
                            variant="contained" 
                            color={isEditing ? "success" : "primary"} 
                        startIcon={isEditing ? <SaveIcon /> : <EditIcon />} 
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        sx={{ bgcolor: isEditing ? '#10b981' : 'white', color: isEditing ? 'white' : '#1976d2', fontWeight: 'bold' }}
                    >
                        {isEditing ? 'Αποθήκευση' : 'Επεξεργασία'}
                    </Button>
                </Box>
            </Container>
        </Box>

        <Container maxWidth="lg">
            <Grid container spacing={4}>
                
                {/* LEFT COLUMN: BASIC INFO */}
                <Grid item xs={12} md={7}>
                    <Paper elevation={0} sx={{ p: 4, borderRadius: 2, bgcolor: 'white', border: '1px solid #e2e8f0', mb: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
                            <MapIcon color="primary" /> Βασικά Στοιχεία
                        </Typography>
                        <Divider sx={{ mb: 3 }} />
                        
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                                    <Avatar src="https://images.unsplash.com/photo-1628009368231-760335298025?ixlib=rb-4.0.3" sx={{ width: 80, height: 80, borderRadius: '8px' }} />
                                    {isEditing && (
                                        <Button variant="outlined" startIcon={<PhotoCameraIcon />} size="small">Αλλαγή Φωτογραφίας</Button>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Όνομα Ιατρείου" variant="outlined" size="small" disabled={!isEditing} value={info.name} onChange={(e) => setInfo({...info, name: e.target.value})} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Διεύθυνση" variant="outlined" size="small" disabled={!isEditing} value={info.address} onChange={(e) => setInfo({...info, address: e.target.value})} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Τηλέφωνο" variant="outlined" size="small" disabled={!isEditing} value={info.phone} onChange={(e) => setInfo({...info, phone: e.target.value})} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Email Επικοινωνίας" variant="outlined" size="small" disabled={!isEditing} value={info.email} onChange={(e) => setInfo({...info, email: e.target.value})} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth multiline rows={3} label="Περιγραφή" variant="outlined" size="small" disabled={!isEditing} value={info.desc} onChange={(e) => setInfo({...info, desc: e.target.value})} />
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* SERVICES LIST */}
                    <Paper elevation={0} sx={{ p: 4, borderRadius: 2, bgcolor: 'white', border: '1px solid #e2e8f0' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
                                <EuroIcon color="primary" /> Υπηρεσίες & Τιμοκατάλογος
                            </Typography>
                        </Box>
                        <Divider sx={{ mb: 3 }} />
                        
                        {isEditing && (
                            <Box sx={{ mb: 3, p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={8}>
                                        <TextField fullWidth label="Όνομα Υπηρεσίας" variant="outlined" size="small" value={newService.name} onChange={(e) => setNewService({...newService, name: e.target.value})} />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField fullWidth label="Τιμή (€)" variant="outlined" size="small" value={newService.price} onChange={(e) => setNewService({...newService, price: e.target.value})} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button fullWidth variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddService} size="small">
                                            Προσθήκη Υπηρεσίας
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                        
                        <List>
                            {services.map((service, index) => (
                                <React.Fragment key={service.id}>
                                    <ListItem 
                                        secondaryAction={
                                            isEditing && <IconButton edge="end" color="error" size="small" onClick={() => handleDeleteService(service.id)}><DeleteIcon /></IconButton>
                                        }
                                    >
                                        <ListItemText 
                                            primary={service.name} 
                                            primaryTypographyProps={{ fontWeight: 600 }} 
                                        />
                                        <Typography fontWeight="600" color="primary">{service.price}€</Typography>
                                    </ListItem>
                                    {index < services.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* RIGHT COLUMN: HOURS & SETTINGS */}
                <Grid item xs={12} md={5}>
                    
                    {/* OPENING HOURS */}
                    <Paper elevation={0} sx={{ p: 4, borderRadius: 2, bgcolor: '#e3f2fd', border: '1px solid #90caf9', mb: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
                            <AccessTimeIcon color="primary" /> Ωράριο Λειτουργίας
                        </Typography>
                        <Divider sx={{ mb: 3 }} />
                        
                        <Grid container spacing={2}>
                            {Object.entries(hours).map(([day, time]) => (
                                <Grid item xs={12} key={day} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    {isEditing ? (
                                        <>
                                            <Typography fontWeight="500" sx={{ minWidth: 100 }}>{day}</Typography>
                                            <TextField size="small" value={time} onChange={(e) => setHours({...hours, [day]: e.target.value})} sx={{ width: 180 }} />
                                        </>
                                    ) : (
                                        <>
                                            <Typography fontWeight="500">{day}</Typography>
                                            <Typography color="text.secondary">{time}</Typography>
                                        </>
                                    )}
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>

                    {/* SETTINGS */}
                    <Paper elevation={0} sx={{ p: 4, borderRadius: 2, bgcolor: 'white', border: '1px solid #e2e8f0' }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Ρυθμίσεις Προβολής</Typography>
                        <Divider sx={{ mb: 3 }} />
                        
                        <FormControlLabel 
                            control={<Switch checked={settings.visibleInMap} disabled={!isEditing} color="primary" onChange={(e) => setSettings({...settings, visibleInMap: e.target.checked})} />} 
                            label="Εμφάνιση στο χάρτη αναζήτησης" 
                        />
                        <FormControlLabel 
                            control={<Switch checked={settings.emergencyCases} disabled={!isEditing} color="primary" onChange={(e) => setSettings({...settings, emergencyCases: e.target.checked})} />} 
                            label="Δέχομαι επείγοντα περιστατικά" 
                        />
                        <FormControlLabel 
                            control={<Switch checked={settings.homeVisits} disabled={!isEditing} color="primary" onChange={(e) => setSettings({...settings, homeVisits: e.target.checked})} />} 
                            label="Κατ' οίκον επισκέψεις" 
                        />
                    </Paper>

                </Grid>

            </Grid>
        </Container>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}