import React from 'react';
import {
  Box, Container, Grid, Typography, Button, Paper, Accordion,
  AccordionSummary, AccordionDetails, List, ListItem, ListItemIcon,
  ListItemText
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';

// Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import DescriptionIcon from '@mui/icons-material/Description';
import HistoryIcon from '@mui/icons-material/History';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PetsIcon from '@mui/icons-material/Pets';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

// Import PageHeader
import PageHeader from './PageHeader';
import Footer from '../components/Footer';

const theme = createTheme({
  palette: {
    primary: { main: '#00695c' },
    secondary: { main: '#ffb74d' },
    background: { default: '#f8f9fa' }
  },
  typography: {
    fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif',
    button: { textTransform: 'none', fontWeight: 600 }
  },
  shape: { borderRadius: 16 }
});

const VET_INFO = [
  {
    id: 'profile',
    title: 'Επαγγελματικό Προφίλ',
    icon: <AssignmentIndIcon color="primary" />,
    path: '/vet/profile',
    items: [{ text: 'Επεξεργασία στοιχείων', path: '/vet/profile' }, { text: 'Διαχείριση διαθεσιμότητας', path: '/vet/schedule' }]
  },
  {
    id: 'medical',
    title: 'Διαχείριση Ασθενών',
    icon: <MedicalInformationIcon color="primary" />,
    path: '/vet/patients',
    items: [{ text: 'Καταγραφή νέου ζώου', path: '/vet/patients' }, { text: 'Ιατρικές Πράξεις', path: '/vet/patients' }]
  },
  {
    id: 'schedule',
    title: 'Πρόγραμμα & Ραντεβού',
    icon: <EventAvailableIcon color="primary" />,
    path: '/vet/schedule',
    items: [{ text: 'Ημερήσιο πρόγραμμα', path: '/vet/schedule' }, { text: 'Ιστορικό επισκέψεων', path: '/vet/schedule' }]
  }
];

export default function VetDashboard() {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
        {/* Global Navbar is rendered in App.js */}
        
        {/* --- PAGE HEADER --- */}
        <Container maxWidth="xl">
            <PageHeader />
        </Container>

        {/* FULL WIDTH HERO */}
        <Box sx={{ 
          position: 'relative', 
          height: '400px', 
          width: '100%',
          bgcolor: '#263238',
          backgroundImage: 'url(https://images.unsplash.com/photo-1530041539828-114de669390e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)',
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center'
        }}>
          <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,105,92,0.7)' }} />
          <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white' }}>
            <Typography variant="h2" fontWeight="800" sx={{ textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
              Καλωσήρθατε, Γιατρέ
            </Typography>
          </Box>
        </Box>

        {/* MAIN LAYOUT: SIDEBAR + CONTENT */}
        <Box sx={{ display: 'flex', flexGrow: 1, p: 2, gap: 2 }}>
          {/* REUSABLE SIDEBAR */}
          <DashboardSidebar />

          {/* MAIN CONTENT */}
          <Box sx={{ flex: 1, p: 4, overflowY: 'auto' }}>
            {/* QUICK ACTIONS */}
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 4, 
                fontWeight: 700, 
                color: '#1e293b',
                textAlign: 'center',
                letterSpacing: '-0.5px'
              }}
            >
              Γρήγορες Ενέργειες
            </Typography>
            <Grid container spacing={4} sx={{ mb: 4, justifyContent: 'center', maxWidth: '900px', mx: 'auto' }}>
              {[
                { label: 'Ιστορικό', icon: <HistoryIcon fontSize="large" />, color: '#00897B', path: '/vet/history' },
                { label: 'Πρόγραμμα', icon: <EventAvailableIcon fontSize="large" />, color: '#00897B', path: '/vet/schedule' },
                { label: 'Το Ιατρείο', icon: <MedicalServicesIcon fontSize="large" />, color: '#00897B', path: '/vet/clinic' },
                { label: 'Καταγραφές', icon: <DescriptionIcon fontSize="large" />, color: '#00897B', path: '/vet/records' }
              ].map((action) => (
                <Grid item xs={12} sm={4} key={action.label}>
                  <Paper elevation={0} onClick={() => navigate(action.path)} sx={{ 
                      p: 3, textAlign: 'center', borderRadius: 4, cursor: 'pointer',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', bgcolor: action.color, color: 'white',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': { 
                        transform: 'translateY(-8px) scale(1.02)', 
                        boxShadow: '0 12px 24px rgba(0,137,123,0.4)',
                        '& .icon-container': {
                          transform: 'rotate(360deg) scale(1.1)'
                        }
                      },
                      '&:active': {
                        transform: 'translateY(-4px) scale(0.98)'
                      }
                    }}>
                    <Box 
                      className="icon-container"
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 60, height: 60, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, transition: 'all 0.5s ease' }}>
                      {action.icon}
                    </Box>
                    <Typography variant="h6" fontWeight="bold">{action.label}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* INFO CARDS */}
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 4, 
                fontWeight: 700, 
                color: '#1e293b',
                textAlign: 'center',
                letterSpacing: '-0.5px'
              }}
            >
              Δραστηριότητα Ιατρείου
            </Typography>
            <Grid container spacing={4} sx={{ justifyContent: 'center', maxWidth: '900px', mx: 'auto' }}>
              <Grid item xs={12} sm={6}>
                <Paper 
                  elevation={0} 
                  onClick={() => navigate('/vet/schedule')}
                  sx={{ 
                    p: 3, 
                    borderRadius: 4, 
                    bgcolor: '#f0f9f8',
                    border: '2px solid #00897B',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': { 
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,137,123,0.3)',
                      bgcolor: '#e0f2f1'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ fontSize: '32px' }}>📅</Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#00897B' }}>
                      Σημερινά Ραντεβού
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Δείτε τα προγραμματισμένα ραντεβού σας για σήμερα
                  </Typography>
                  <Button 
                    variant="contained" 
                    size="small" 
                    onClick={() => navigate('/vet/schedule')}
                    sx={{ 
                      borderRadius: 2,
                      bgcolor: '#00897B',
                      textTransform: 'none',
                      fontSize: '14px',
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor: '#00695c'
                      }
                    }}
                  >
                    Προβολή
                  </Button>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper 
                  elevation={0} 
                  onClick={() => navigate('/vet/clinic')}
                  sx={{ 
                    p: 3, 
                    borderRadius: 4, 
                    bgcolor: '#f0f9f8',
                    border: '2px solid #00897B',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': { 
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,137,123,0.3)',
                      bgcolor: '#e0f2f1'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ fontSize: '32px' }}>🏥</Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#00897B' }}>
                      Το Ιατρείο μου
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Διαχείριση πληροφοριών ιατρείου
                  </Typography>
                  <Button 
                    variant="contained" 
                    size="small" 
                    onClick={() => navigate('/vet/clinic')}
                    sx={{ 
                      borderRadius: 2,
                      bgcolor: '#00897B',
                      textTransform: 'none',
                      fontSize: '14px',
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor: '#00695c'
                      }
                    }}
                  >
                    Προβολή
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}