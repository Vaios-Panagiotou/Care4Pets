import React, { useState, useRef, useCallback } from 'react';
import { 
  Box, Container, Grid, Typography, TextField, Button, Paper, 
  MenuItem, Select, InputLabel, FormControl, Avatar, IconButton 
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Icons
import UploadIcon from '@mui/icons-material/Upload';
import PetsIcon from '@mui/icons-material/Pets';
import PersonIcon from '@mui/icons-material/Person';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Import PageHeader
import PageHeader from './PageHeader';
import DashboardSidebar from '../components/DashboardSidebar';

// Create theme outside component to prevent recreation on every render
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
      defaultProps: {
        size: 'small'
      },
      styleOverrides: {
        root: { 
          '& .MuiInputBase-root': {
            backgroundColor: 'white'
          }
        }
      }
    }
  }
});

const NewRecord = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [image, setImage] = useState(null);

  // Prevent key events inside the form from bubbling to global listeners
  const stopKeyPropagation = useCallback((e) => {
    // Stop bubbling and capturing to neutralize any global handlers
    e.stopPropagation();
    if (e.nativeEvent && typeof e.nativeEvent.stopImmediatePropagation === 'function') {
      e.nativeEvent.stopImmediatePropagation();
    }
  }, []);

  const handleImageChange = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    alert('Η καταγραφή αποθηκεύτηκε επιτυχώς!');
    navigate('/vet');
  }, [navigate]);
  
  const handleCancel = useCallback(() => {
    navigate('/vet');
  }, [navigate]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 8, display: 'flex', flexDirection: 'column' }}>
        
        <Container maxWidth="xl" sx={{ pt: 2 }}>
            <PageHeader />
        </Container>

        <Box sx={{ display: 'flex', flex: 1, maxWidth: '100vw', overflow: 'hidden', p: 2, gap: 2 }}>
          <DashboardSidebar />
          
          <Box 
            ref={scrollContainerRef}
            sx={{ 
              flex: 1, 
              overflowY: 'auto',
              overflowX: 'hidden',
              WebkitOverflowScrolling: 'touch',
              willChange: 'transform'
            }}>
            {/* HERO HEADER */}
            <Box sx={{ bgcolor: '#1976d2', py: 5, mb: 8, color: 'white', textAlign: 'center', mr: -2 }}>
                <Container maxWidth="md">
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Νέα Καταγραφή Ασθενούς</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Συμπληρώστε τα στοιχεία του ζώου και του ιδιοκτήτη
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="md">
          <Paper elevation={0} sx={{ p: 4, borderRadius: 2, bgcolor: 'white', border: '1px solid #e2e8f0' }}>
            <Box component="form" onSubmit={handleSubmit} onKeyDown={stopKeyPropagation} onKeyDownCapture={stopKeyPropagation} onKeyUp={stopKeyPropagation} onKeyUpCapture={stopKeyPropagation} onKeyPress={stopKeyPropagation} onKeyPressCapture={stopKeyPropagation} noValidate autoComplete="off">
                {/* PET INFORMATION SECTION */}
                <Box sx={{ mb: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, pb: 2, borderBottom: '2px solid #e2e8f0' }}>
                        <PetsIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>Στοιχεία Ζώου</Typography>
                    </Box>

                    {/* Image Upload */}
                    <Box sx={{ textAlign: 'center', mb: 4, p: 3, bgcolor: '#f8fafc', borderRadius: 2 }}>
                        <Avatar src={image} sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }} />
                        <Button variant="outlined" component="label" startIcon={<UploadIcon />} size="small">
                            Ανέβασμα Φωτογραφίας
                            <input type="file" hidden onChange={handleImageChange} />
                        </Button>
                    </Box>

                    {/* Pet Fields */}
                    <TextField 
                      fullWidth 
                      required 
                      label="Όνομα Ζώου" 
                      variant="outlined" 
                      size="small" 
                      sx={{ mb: 2 }} 
                      onKeyDown={stopKeyPropagation}
                      onKeyDownCapture={stopKeyPropagation}
                      onKeyUp={stopKeyPropagation}
                      onKeyUpCapture={stopKeyPropagation}
                      onKeyPress={stopKeyPropagation}
                      onKeyPressCapture={stopKeyPropagation}
                    />
                    
                    <FormControl fullWidth size="small" sx={{ bgcolor: 'white', mb: 2 }}>
                        <InputLabel>Είδος</InputLabel>
                        <Select label="Είδος" defaultValue="">
                            <MenuItem value="dog">Σκύλος</MenuItem>
                            <MenuItem value="cat">Γάτα</MenuItem>
                            <MenuItem value="other">Άλλο</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField fullWidth label="Φυλή" variant="outlined" size="small" sx={{ mb: 2 }} />

                    <FormControl fullWidth size="small" sx={{ bgcolor: 'white', mb: 2 }}>
                        <InputLabel>Φύλο</InputLabel>
                        <Select label="Φύλο" defaultValue="">
                            <MenuItem value="male">Αρσενικό</MenuItem>
                            <MenuItem value="female">Θηλυκό</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField fullWidth label="Ηλικία" variant="outlined" size="small" sx={{ mb: 2 }} />

                    <TextField fullWidth label="Χρώμα / Σημάδια" variant="outlined" size="small" sx={{ mb: 2 }} />
                    <TextField fullWidth required label="Αριθμός Microchip" variant="outlined" size="small" sx={{ bgcolor: '#e3f2fd', mb: 0 }} helperText="Υποχρεωτικό" />
                </Box>

                {/* OWNER INFORMATION SECTION */}
                <Box sx={{ mb: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, pb: 2, borderBottom: '2px solid #e2e8f0' }}>
                        <PersonIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>Στοιχεία Ιδιοκτήτη</Typography>
                    </Box>

                    <TextField fullWidth required label="Ονοματεπώνυμο" variant="outlined" size="small" sx={{ mb: 2 }} />
                    <TextField fullWidth required label="Τηλέφωνο" variant="outlined" size="small" sx={{ mb: 2 }} />
                    <TextField fullWidth label="Email" type="email" variant="outlined" size="small" sx={{ mb: 2 }} />
                    <TextField fullWidth label="Διεύθυνση" variant="outlined" size="small" sx={{ mb: 2 }} />
                    <TextField fullWidth label="ΑΦΜ" variant="outlined" size="small" sx={{ mb: 0 }} />
                </Box>

                {/* VET NOTES SECTION */}
                <Box sx={{ mb: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, pb: 2, borderBottom: '2px solid #e2e8f0' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>Σημειώσεις Κτηνιάτρου</Typography>
                    </Box>
                    <TextField fullWidth multiline rows={5} placeholder="Γράψτε παρατηρήσεις, αλλεργίες, ιστορικό..." variant="outlined" size="small" sx={{ mb: 0 }} />
                </Box>
                {/* ACTION BUTTONS */}
                <Box sx={{ mt: 6, display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 4, borderTop: '1px solid #e2e8f0' }}>
                    <Button 
                        variant="outlined" 
                        startIcon={<ArrowBackIcon />}
                        onClick={handleCancel}
                        sx={{ px: 4 }}
                    >
                        Ακύρωση
                    </Button>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary" 
                        startIcon={<SaveIcon />}
                        sx={{ px: 4, py: 1.25 }}
                    >
                        Αποθήκευση
                    </Button>
                </Box>
            </Box>
          </Paper>
            </Container>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default React.memo(NewRecord);