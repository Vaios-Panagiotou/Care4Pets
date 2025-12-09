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

const theme = createTheme({
  palette: {
    primary: { main: '#00695c' },
    secondary: { main: '#ffb74d' },
    background: { default: '#f4f6f8' }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    button: { textTransform: 'none', fontWeight: 600 },
    h6: { fontWeight: 700 }
  },
  shape: { borderRadius: 12 }
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

  // States για τα πεδία (Mock values)
  const [info, setInfo] = useState({
    name: 'Κτηνιατρικό Κέντρο Ζωούπολη',
    address: 'Πανεπιστημίου 16, Αθήνα',
    phone: '210 1234567',
    email: 'info@zooupoli.gr',
    desc: 'Σύγχρονο κτηνιατρείο με εξειδίκευση στα μικρά ζώα.'
  });

  const handleSave = () => {
    setIsEditing(false);
    alert('Οι αλλαγές αποθηκεύτηκαν!');
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8', pb: 10 }}>
        
        <Container maxWidth="xl" sx={{ pt: 2 }}>
            <PageHeader />
        </Container>

        {/* HERO HEADER */}
        <Box sx={{ bgcolor: '#263238', py: 5, mb: 5, color: 'white', borderRadius: '0 0 20px 20px' }}>
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h4" fontWeight="bold">Το Ιατρείο μου</Typography>
                        <Typography variant="body1" sx={{ opacity: 0.8 }}>Διαχείριση προφίλ, ωραρίου και υπηρεσιών.</Typography>
                    </Box>
                    <Button 
                        variant="contained" 
                        color={isEditing ? "success" : "secondary"} 
                        startIcon={isEditing ? <SaveIcon /> : <EditIcon />} 
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        sx={{ fontWeight: 'bold' }}
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
                    <Paper sx={{ p: 4, borderRadius: '16px', mb: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <MapIcon color="primary" /> Βασικά Στοιχεία
                        </Typography>
                        <Divider sx={{ mb: 3 }} />
                        
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                                    <Avatar src="https://images.unsplash.com/photo-1628009368231-760335298025?ixlib=rb-4.0.3" sx={{ width: 80, height: 80, borderRadius: '12px' }} />
                                    {isEditing && (
                                        <Button variant="outlined" startIcon={<PhotoCameraIcon />} size="small">Αλλαγή Φωτογραφίας</Button>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Όνομα Ιατρείου" variant="outlined" disabled={!isEditing} value={info.name} onChange={(e) => setInfo({...info, name: e.target.value})} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Διεύθυνση" variant="outlined" disabled={!isEditing} value={info.address} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Τηλέφωνο" variant="outlined" disabled={!isEditing} value={info.phone} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Email Επικοινωνίας" variant="outlined" disabled={!isEditing} value={info.email} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth multiline rows={3} label="Περιγραφή" variant="outlined" disabled={!isEditing} value={info.desc} />
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* SERVICES LIST */}
                    <Paper sx={{ p: 4, borderRadius: '16px' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <EuroIcon color="primary" /> Υπηρεσίες & Τιμοκατάλογος
                            </Typography>
                            {isEditing && <Button startIcon={<AddIcon />} size="small">Προσθήκη</Button>}
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        
                        <List>
                            {services.map((service, index) => (
                                <React.Fragment key={service.id}>
                                    <ListItem 
                                        secondaryAction={
                                            isEditing && <IconButton edge="end" color="error"><DeleteIcon /></IconButton>
                                        }
                                    >
                                        <ListItemText 
                                            primary={service.name} 
                                            primaryTypographyProps={{ fontWeight: 'bold' }} 
                                        />
                                        <Typography fontWeight="bold" color="primary">{service.price}€</Typography>
                                    </ListItem>
                                    {index < services.length - 1 && <Divider variant="inset" component="li" />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* RIGHT COLUMN: HOURS & SETTINGS */}
                <Grid item xs={12} md={5}>
                    
                    {/* OPENING HOURS */}
                    <Paper sx={{ p: 4, borderRadius: '16px', mb: 4, bgcolor: '#e0f2f1' }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTimeIcon color="primary" /> Ωράριο Λειτουργίας
                        </Typography>
                        <Divider sx={{ mb: 3 }} />
                        
                        <Grid container spacing={2}>
                            {['Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή'].map(day => (
                                <Grid item xs={12} key={day} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography fontWeight="500">{day}</Typography>
                                    <Typography color="text.secondary">09:00 - 21:00</Typography>
                                </Grid>
                            ))}
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', color: '#D32F2F' }}>
                                <Typography fontWeight="bold">Σάββατο</Typography>
                                <Typography>09:00 - 14:00</Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', color: '#757575' }}>
                                <Typography>Κυριακή</Typography>
                                <Typography fontStyle="italic">Κλειστά</Typography>
                            </Grid>
                        </Grid>
                        
                        {isEditing && (
                            <Button fullWidth variant="outlined" sx={{ mt: 3, bgcolor: 'white' }}>Επεξεργασία Ωραρίου</Button>
                        )}
                    </Paper>

                    {/* SETTINGS */}
                    <Paper sx={{ p: 4, borderRadius: '16px' }}>
                        <Typography variant="h6" gutterBottom>Ρυθμίσεις Προβολής</Typography>
                        <Divider sx={{ mb: 2 }} />
                        
                        <FormControlLabel 
                            control={<Switch defaultChecked disabled={!isEditing} color="primary" />} 
                            label="Εμφάνιση στο χάρτη αναζήτησης" 
                        />
                        <FormControlLabel 
                            control={<Switch defaultChecked disabled={!isEditing} color="primary" />} 
                            label="Δέχομαι επείγοντα περιστατικά" 
                        />
                        <FormControlLabel 
                            control={<Switch disabled={!isEditing} color="primary" />} 
                            label="Κατ' οίκον επισκέψεις" 
                        />
                    </Paper>

                </Grid>

            </Grid>
        </Container>

      </Box>
    </ThemeProvider>
  );
}