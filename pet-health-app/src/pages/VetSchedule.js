import React, { useState } from 'react';
import { 
  Box, Container, Grid, Typography, Button, Paper, Avatar, Chip, IconButton, Divider 
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Icons
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import PersonIcon from '@mui/icons-material/Person';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import PendingActionsIcon from '@mui/icons-material/PendingActions';

// Import PageHeader
import PageHeader from './PageHeader';
import DashboardSidebar from '../components/DashboardSidebar';

const theme = createTheme({
  palette: {
    primary: { main: '#00695c' },
    secondary: { main: '#ffb74d' },
    success: { main: '#2E7D32' },
    error: { main: '#D32F2F' },
    background: { default: '#f8f9fa' }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    button: { textTransform: 'none', fontWeight: 600 },
    h6: { fontWeight: 700 }
  },
  shape: { borderRadius: 16 },
  components: {
    MuiPaper: { styleOverrides: { root: { border: '1px solid #e0e0e0', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' } } }
  }
});

// --- MOCK DATA ---
const REQUESTS = [
  { id: 1, pet: 'Luna', type: 'Γάτα', owner: 'Γιώργος Παπ.', time: '17:00', date: 'Σήμερα', reason: 'Εμβόλιο', img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=100&q=80' },
  { id: 2, pet: 'Rocky', type: 'Σκύλος', owner: 'Ελένη Κ.', time: '18:30', date: 'Αύριο', reason: 'Εξέταση αυτιών', img: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=100&q=80' }
];

const SCHEDULE = [
  { id: 101, time: '09:00', pet: 'Max', owner: 'Μαρία Δ.', status: 'completed', type: 'Routine', color: '#00695c' },
  { id: 102, time: '10:30', pet: 'Bella', owner: 'Κώστας Α.', status: 'confirmed', type: 'Surgery', color: '#D32F2F' },
  { id: 103, time: '12:00', pet: 'Charlie', owner: 'Νίκος Σ.', status: 'confirmed', type: 'Vaccine', color: '#FFA000' },
  { id: 104, time: '14:00', pet: 'Lucy', owner: 'Άννα Π.', status: 'pending', type: 'Emergency', color: '#7B1FA2' },
];

// --- COMPONENTS ---

// 1. STATS CARD (Top Row)
const StatCard = ({ title, count, icon, color, bgcolor }) => (
  <Paper sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%', borderRadius: '12px' }}>
    <Box>
        <Typography variant="caption" fontWeight="bold" color="text.secondary">{title}</Typography>
        <Typography variant="h4" fontWeight="800" sx={{ color: color, mt: 0.5 }}>{count}</Typography>
    </Box>
    <Box sx={{ bgcolor: bgcolor, color: color, p: 1.5, borderRadius: '50%' }}>{icon}</Box>
  </Paper>
);

// 2. REQUEST CARD (Left Column)
const RequestCard = ({ req }) => (
  <Paper sx={{ p: 2, mb: 2, borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: 2, borderLeft: '4px solid #FFA726' }}>
    <Box sx={{ display: 'flex', gap: 2 }}>
        <Avatar src={req.img} sx={{ width: 50, height: 50, borderRadius: '8px' }} />
        <Box>
            <Typography variant="subtitle2" fontWeight="bold">{req.pet} <Typography component="span" variant="caption" color="text.secondary">({req.type})</Typography></Typography>
            <Typography variant="caption" display="block" color="text.secondary">Ιδιοκτήτης: {req.owner}</Typography>
            <Typography variant="caption" fontWeight="bold" sx={{ color: '#00695c' }}>{req.reason}</Typography>
        </Box>
    </Box>
    
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#f5f5f5', p: 1, borderRadius: '8px' }}>
        <Typography variant="caption" fontWeight="bold">📅 {req.date} • {req.time}</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton size="small" sx={{ bgcolor: 'white', color: 'error.main', border: '1px solid #eee' }}><CancelIcon fontSize="small"/></IconButton>
            <IconButton size="small" sx={{ bgcolor: 'white', color: 'success.main', border: '1px solid #eee' }}><CheckCircleIcon fontSize="small"/></IconButton>
        </Box>
    </Box>
  </Paper>
);

// 3. TIMELINE ITEM (Right Column)
const TimelineItem = ({ item }) => (
  <Box sx={{ display: 'flex', mb: 0 }}>
    {/* Time Column */}
    <Box sx={{ width: '70px', textAlign: 'center', mr: 2, position: 'relative' }}>
        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">{item.time}</Typography>
        {/* Vertical Line */}
        <Box sx={{ 
            position: 'absolute', top: 25, bottom: -10, left: '50%', width: '2px', bgcolor: '#eee', transform: 'translateX(-50%)',
            display: 'block' 
        }} />
    </Box>

    {/* Card */}
    <Paper sx={{ 
        flexGrow: 1, p: 2, mb: 3, borderRadius: '12px', 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderLeft: `5px solid ${item.color}`,
        bgcolor: item.status === 'completed' ? '#fafafa' : 'white',
        opacity: item.status === 'completed' ? 0.8 : 1
    }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: item.color + '20', color: item.color, borderRadius: '8px' }}>
                {item.pet[0]}
            </Avatar>
            <Box>
                <Typography variant="subtitle1" fontWeight="bold">{item.pet}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <PersonIcon fontSize="inherit"/> {item.owner}
                </Typography>
            </Box>
        </Box>

        <Box sx={{ textAlign: 'right' }}>
            <Chip 
                label={item.type} 
                size="small" 
                sx={{ bgcolor: item.color + '20', color: item.color, fontWeight: 'bold', mb: 0.5 }} 
            />
            <Typography variant="caption" display="block" color="text.secondary">
                {item.status === 'confirmed' ? 'Επιβεβαιωμένο' : (item.status === 'completed' ? 'Ολοκληρώθηκε' : 'Εκκρεμεί')}
            </Typography>
        </Box>
    </Paper>
  </Box>
);

// 4. CALENDAR WIDGET
const CalendarWidget = () => (
  <Paper sx={{ p: 3, borderRadius: '16px' }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <IconButton size="small"><ChevronLeftIcon /></IconButton>
        <Typography variant="subtitle2" fontWeight="bold">Νοέμβριος 2025</Typography>
        <IconButton size="small"><ChevronRightIcon /></IconButton>
    </Box>
    <Grid container spacing={1} sx={{ textAlign: 'center' }}>
        {['Δ','Τ','Τ','Π','Π','Σ','Κ'].map(d => <Grid item xs={1.7} key={d}><Typography variant="caption" fontWeight="bold" color="text.secondary">{d}</Typography></Grid>)}
        {[...Array(30)].map((_, i) => {
            const day = i + 1;
            const isToday = day === 17;
            const hasAppt = day === 17 || day === 18 || day === 20;
            return (
                <Grid item xs={1.7} key={i}>
                    <Box sx={{ 
                        width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto',
                        borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem',
                        bgcolor: isToday ? '#00695c' : 'transparent',
                        color: isToday ? 'white' : 'inherit',
                        fontWeight: isToday ? 'bold' : 'normal',
                        border: isToday ? 'none' : (hasAppt ? '1px solid #b2dfdb' : 'none')
                    }}>{day}</Box>
                </Grid>
            )
        })}
    </Grid>
  </Paper>
);

export default function VetSchedule() {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa', pb: 10, display: 'flex', flexDirection: 'column' }}>
        
        <Container maxWidth="xl" sx={{ pt: 2 }}>
            <PageHeader />
        </Container>

        <Box sx={{ display: 'flex', flex: 1, maxWidth: '100vw', overflow: 'hidden', p: 2, gap: 2 }}>
          <DashboardSidebar />
          
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            {/* HERO TITLE AREA */}
            <Box sx={{ bgcolor: '#263238', py: 4, mb: -4, pb: 8, color: 'white', mr: -2 }}>
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h4" fontWeight="bold">Πρόγραμμα</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.7 }}>Διαχείριση ραντεβού και αιτημάτων.</Typography>
                        </Box>
                        <Button variant="contained" color="secondary" startIcon={<AccessTimeIcon />} sx={{ fontWeight: 'bold', borderRadius: '8px' }}>
                            Νέο Ραντεβού
                        </Button>
                </Box>
            </Container>
        </Box>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
            
            {/* STATS ROW */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
                    <StatCard title="ΣΗΜΕΡΙΝΑ ΡΑΝΤΕΒΟΥ" count="4" icon={<CalendarMonthIcon />} color="#00695c" bgcolor="#e0f2f1" />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <StatCard title="ΕΚΚΡΕΜΗ ΑΙΤΗΜΑΤΑ" count="2" icon={<PendingActionsIcon />} color="#FFA726" bgcolor="#FFF3E0" />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <StatCard title="ΟΛΟΚΛΗΡΩΜΕΝΑ" count="12" icon={<DoneAllIcon />} color="#2E7D32" bgcolor="#E8F5E9" />
                </Grid>
            </Grid>

            <Grid container spacing={4}>
                
                {/* LEFT COLUMN: CALENDAR & REQUESTS */}
                <Grid item xs={12} md={4}>
                    <CalendarWidget />
                    
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 4, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <NotificationsActiveIcon color="secondary" fontSize="small" /> Νέα Αιτήματα
                    </Typography>
                    {REQUESTS.map(req => <RequestCard key={req.id} req={req} />)}
                </Grid>

                {/* RIGHT COLUMN: TIMELINE SCHEDULE */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 4, borderRadius: '16px', minHeight: '600px', bgcolor: 'white' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
                            <Typography variant="h6">Σημερινό Πρόγραμμα</Typography>
                            <Chip label="17 Νοεμβρίου 2025" sx={{ fontWeight: 'bold' }} />
                        </Box>

                        {SCHEDULE.map(item => <TimelineItem key={item.id} item={item} />)}

                        {/* Visual for Free Slot */}
                        <Box sx={{ display: 'flex', mb: 3 }}>
                            <Box sx={{ width: '70px', textAlign: 'center', mr: 2 }}><Typography variant="subtitle2" color="text.secondary">16:00</Typography></Box>
                            <Box sx={{ flexGrow: 1, border: '2px dashed #eee', borderRadius: '12px', p: 1.5, textAlign: 'center', color: '#999' }}>
                                <Typography variant="caption" fontWeight="bold">Διαθέσιμο Κενό</Typography>
                            </Box>
                        </Box>

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