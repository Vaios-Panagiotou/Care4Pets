import React, { useEffect, useMemo, useState } from 'react';
import { 
  Box, Container, Grid, Typography, Button, Paper, Avatar, Chip, IconButton, Collapse, Divider 
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
import { appointmentsAPI } from '../services/api';

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

const MOCK_SCHEDULE = SCHEDULE.map(item => ({ ...item, isMock: true }));

function mapApptToTimelineItem(appt) {
  //attempt to map common fields; provide reasonable fallbacks
  const petName = appt.petName || appt.pet?.name || 'Κατοικίδιο';
  const ownerName = appt.ownerName || appt.owner?.name || 'Ιδιοκτήτης';
  const time = appt.time || '15:00';
  const status = appt.status || 'confirmed';
  const type = appt.type || 'Visit';
  const color = status === 'completed' ? '#2E7D32' : status === 'pending' ? '#7B1FA2' : '#00695c';
  return {
    id: appt.id,
    time,
    pet: petName,
    owner: ownerName,
    status,
    type,
    color,
  };
}

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
const TimelineItem = ({ item }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <Box sx={{ display: 'flex', mb: 1.5 }}>
      {/* Time Column */}
      <Box sx={{ width: '70px', textAlign: 'center', mr: 2, position: 'relative' }}>
        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">{item.time}</Typography>
        {/* Vertical Line */}
        <Box sx={{ position: 'absolute', top: 25, bottom: -10, left: '50%', width: '2px', bgcolor: '#eee', transform: 'translateX(-50%)', display: 'block' }} />
      </Box>

      {/*Card*/}
      <Paper sx={{
        flexGrow: 1, p: 1.5, borderRadius: '12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderLeft: `5px solid ${item.color}`,
        bgcolor: item.status === 'completed' ? '#fafafa' : 'white',
        opacity: item.status === 'completed' ? 0.9 : 1,
        transition: 'background 120ms ease',
        '&:hover': { bgcolor: '#f9fafb' }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: item.color + '20', color: item.color, borderRadius: '8px' }}>{item.pet[0]}</Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">{item.pet}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PersonIcon fontSize="inherit"/> {item.owner}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip label={item.type} size="small" sx={{ bgcolor: item.color + '20', color: item.color, fontWeight: 'bold' }} />
          <Chip label={item.status === 'confirmed' ? 'Επιβεβαιωμένο' : (item.status === 'completed' ? 'Ολοκληρώθηκε' : 'Εκκρεμεί')} size="small" variant="outlined" />
          <Button size="small" variant="text" onClick={() => setOpen(v => !v)} sx={{ ml: 1 }}>
            {open ? 'Λεπτομέρειες -' : 'Λεπτομέρειες +'}
          </Button>
        </Box>
      </Paper>

      <Collapse in={open} timeout={150} unmountOnExit>
        <Box sx={{ ml: '70px', mt: 1.25, mb: 2 }}>
          <Paper sx={{ p: 1.5, borderRadius: 1.5, bgcolor: '#f8fafc' }}>
            <Typography variant="caption" color="text.secondary">Τύπος: <strong>{item.type}</strong></Typography>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" variant="outlined" color="success" startIcon={<CheckCircleIcon fontSize="small" />}>Ολοκλήρωση</Button>
              <Button size="small" variant="outlined" color="error" startIcon={<CancelIcon fontSize="small" />}>Ακύρωση</Button>
            </Box>
          </Paper>
        </Box>
      </Collapse>
    </Box>
  );
};

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
  const [serverAppointments, setServerAppointments] = useState([]);
  const [requestsOpen, setRequestsOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await appointmentsAPI.getAll();
        if (mounted) setServerAppointments(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Failed to load appointments from server (port 3001).', e);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const timeline = useMemo(() => {
    const mapped = serverAppointments.map(mapApptToTimelineItem);
    return [...MOCK_SCHEDULE, ...mapped];
  }, [serverAppointments]);

  const [filter, setFilter] = useState('all');
  const filteredTimeline = useMemo(() => filter === 'all' ? timeline : timeline.filter(i => i.status === filter), [timeline, filter]);
  const todayCount = timeline.length;
  const pendingCount = timeline.filter(i => i.status === 'pending').length;
  const completedCount = timeline.filter(i => i.status === 'completed').length;
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa', pb: 10, display: 'flex', flexDirection: 'column' }}>
        
        <Container maxWidth="xl" sx={{ pt: 2 }}>
            <PageHeader />
        </Container>

        <Box sx={{ display: 'flex', flex: 1, maxWidth: '100vw', overflow: 'hidden', p: 2, gap: 2 }}>
          <DashboardSidebar />
          
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            {/*COMPACT TOOLBA*/}
            <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e5e7eb', py: 1.5, mb: 2 }}>
              <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton size="small"><ChevronLeftIcon /></IconButton>
                <Chip icon={<CalendarMonthIcon />} label="Σήμερα" variant="outlined" />
                <IconButton size="small"><ChevronRightIcon /></IconButton>
                <Box sx={{ flex: 1 }} />
                <Chip label="Όλα" color={filter==='all' ? 'primary' : 'default'} onClick={() => setFilter('all')} clickable />
                <Chip label="Επιβεβαιωμένα" color={filter==='confirmed' ? 'primary' : 'default'} onClick={() => setFilter('confirmed')} clickable />
                <Chip label="Εκκρεμή" color={filter==='pending' ? 'primary' : 'default'} onClick={() => setFilter('pending')} clickable />
                <Chip label="Ολοκληρωμένα" color={filter==='completed' ? 'primary' : 'default'} onClick={() => setFilter('completed')} clickable />
                <Button variant="contained" size="small" startIcon={<AccessTimeIcon />} sx={{ ml: 1 }}>Νέο Ραντεβού</Button>
              </Container>
            </Box>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Paper sx={{ p: 3, borderRadius: '16px', bgcolor: 'white' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Πρόγραμμα</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label={`Σύνολο: ${todayCount}`} size="small" />
                <Chip label={`Εκκρεμή: ${pendingCount}`} size="small" />
                <Chip label={`Ολοκληρωμένα: ${completedCount}`} size="small" />
              </Box>
            </Box>

            {/* Requests inside same flow */}
            <Box sx={{ mt: 2, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <NotificationsActiveIcon color="secondary" fontSize="small" />
              <Typography variant="subtitle2" fontWeight="bold">Νέα Αιτήματα</Typography>
              <Chip size="small" label={REQUESTS.length} />
              <Button size="small" onClick={() => setRequestsOpen(v => !v)} sx={{ ml: 'auto' }}>
                {requestsOpen ? 'Απόκρυψη' : 'Προβολή'}
              </Button>
            </Box>
            <Collapse in={requestsOpen} timeout={150} unmountOnExit>
              <Grid container spacing={2}>
                {REQUESTS.map(req => (
                  <Grid item xs={12} md={6} key={req.id}><RequestCard req={req} /></Grid>
                ))}
              </Grid>
              <Divider sx={{ my: 2 }} />
            </Collapse>

            {/*Timeline*/}
            {filteredTimeline.map(item => <TimelineItem key={item.id} item={item} />)}

            {/* Visual for Free Slot */}
            <Box sx={{ display: 'flex', mb: 1.5 }}>
              <Box sx={{ width: '70px', textAlign: 'center', mr: 2 }}><Typography variant="subtitle2" color="text.secondary">16:00</Typography></Box>
              <Box sx={{ flexGrow: 1, border: '2px dashed #eee', borderRadius: '12px', p: 1.5, textAlign: 'center', color: '#999' }}>
                <Typography variant="caption" fontWeight="bold">Διαθέσιμο Κενό</Typography>
              </Box>
            </Box>
          </Paper>
        </Container>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}