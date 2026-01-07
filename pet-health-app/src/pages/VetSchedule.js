import React, { useEffect, useMemo, useState } from 'react';
import { 
  Box, Container, Grid, Typography, Button, Paper, Avatar, Chip, IconButton, Collapse, Divider, Pagination, Switch 
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { keyframes } from '@mui/system';
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
import { appointmentsAPI, vetsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

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

// --- MOCK DATA (Requests placeholders no longer used; requests derive from server) ---

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
    isMock: false,
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
const RequestCard = ({ req, onAccept, onDecline }) => (
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
          <IconButton size="small" sx={{ bgcolor: 'white', color: 'error.main', border: '1px solid #eee' }} onClick={() => onDecline && onDecline(req.id)}><CancelIcon fontSize="small"/></IconButton>
          <IconButton size="small" sx={{ bgcolor: 'white', color: 'success.main', border: '1px solid #eee' }} onClick={() => onAccept && onAccept(req.id)}><CheckCircleIcon fontSize="small"/></IconButton>
        </Box>
    </Box>
  </Paper>
);

// 3. TIMELINE ITEM (Right Column)
const TimelineItem = ({ item, onRequestStatus, onGoRegistration, busy, dense=false }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <Box sx={{ display: 'flex', mb: dense ? 1 : 1.5 }}>
      {/* Time Column */}
      <Box sx={{ width: dense ? '56px' : '70px', textAlign: 'center', mr: dense ? 1.5 : 2, position: 'relative' }}>
        <Typography variant={dense ? 'caption' : 'subtitle2'} fontWeight="bold" color="text.secondary">{item.time}</Typography>
        {/* Vertical Line */}
        <Box sx={{ position: 'absolute', top: dense ? 18 : 25, bottom: -10, left: '50%', width: '2px', bgcolor: '#eee', transform: 'translateX(-50%)', display: 'block' }} />
      </Box>

      {/*Card*/}
      <Paper sx={{
        flexGrow: 1, p: dense ? 1 : 1.5, borderRadius: '12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderLeft: `5px solid ${item.color}`,
        bgcolor: item.status === 'completed' ? '#fafafa' : 'white',
        opacity: item.status === 'completed' ? 0.9 : 1,
        transition: 'background 120ms ease',
        '&:hover': { bgcolor: '#f9fafb' }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: dense ? 1 : 1.5 }}>
          <Avatar sx={{ bgcolor: item.color + '20', color: item.color, borderRadius: '8px', width: dense ? 28 : 40, height: dense ? 28 : 40, fontSize: dense ? 12 : 16 }}>{item.pet[0]}</Avatar>
          <Box>
            <Typography variant={dense ? 'body2' : 'subtitle1'} fontWeight="bold">{item.pet}</Typography>
            <Typography variant={dense ? 'caption' : 'body2'} color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PersonIcon fontSize={dense ? 'small' : 'inherit'}/> {item.owner}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip label={item.type} size="small" sx={{ bgcolor: item.color + '20', color: item.color, fontWeight: 'bold' }} />
          <Chip label={item.status === 'confirmed' ? 'Επιβεβαιωμένο' : (item.status === 'completed' ? 'Ολοκληρώθηκε' : (item.status === 'cancelled' ? 'Ακυρώθηκε' : 'Εκκρεμεί'))} size="small" variant="outlined" />
          <Button size="small" variant="text" onClick={() => setOpen(v => !v)} sx={{ ml: 0.5 }}>
            {open ? 'Λεπτομέρειες -' : 'Λεπτομέρειες +'}
          </Button>
        </Box>
      </Paper>

      <Collapse in={open} timeout={150} unmountOnExit>
        <Box sx={{ ml: dense ? '56px' : '70px', mt: dense ? 1 : 1.25, mb: dense ? 1.5 : 2 }}>
          <Paper sx={{ p: dense ? 1 : 1.5, borderRadius: 1.5, bgcolor: '#f8fafc' }}>
            <Typography variant="caption" color="text.secondary">Τύπος: <strong>{item.type}</strong></Typography>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                size="small" 
                variant="outlined" 
                color="success" 
                startIcon={<CheckCircleIcon fontSize="small" />}
                disabled={item.isMock || busy || item.status === 'completed'}
                onClick={() => {
                  if (item.type === 'Registration' && onGoRegistration) { onGoRegistration(item.id); }
                  else { onRequestStatus && onRequestStatus(item.id, 'completed'); }
                }}
              >
                {item.type === 'Registration' ? 'Μετάβαση σε Καταχώριση' : 'Ολοκλήρωση'}
              </Button>
              <Button 
                size="small" 
                variant="outlined" 
                color="error" 
                startIcon={<CancelIcon fontSize="small" />}
                disabled={item.isMock || busy || item.status === 'cancelled'}
                onClick={() => onRequestStatus && onRequestStatus(item.id, 'cancelled')}
              >
                Ακύρωση
              </Button>
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
  const navigate = useNavigate();
  const [serverAppointments, setServerAppointments] = useState([]);
  const [requestsOpen, setRequestsOpen] = useState(false);
  const { user } = useAuth();
  const [currentVetId, setCurrentVetId] = useState(null);
  const [updating, setUpdating] = useState({});
  const [compact, setCompact] = useState(true);
  const [page, setPage] = useState(1);
  // Pagination size for timeline list
  const perPage = 6;
  const [statusDialog, setStatusDialog] = useState({ open: false, apptId: null, newStatus: null, note: '', diagnosis: '', treatment: '', nextVisit: '' });

  // Resolve vet id for logged-in vet (fallback to user's id if no clinic profile exists)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!user?.id) { if (mounted) setCurrentVetId(null); return; }
        const vets = await vetsAPI.getAll();
        const myVet = Array.isArray(vets) ? vets.find(v => String(v.userId) === String(user.id)) : null;
        if (mounted) setCurrentVetId(myVet?.id ?? String(user.id));
      } catch (e) {
        console.warn('Failed to resolve current vet id.', e);
        if (mounted) setCurrentVetId(String(user?.id || ''));
      }
    })();
    return () => { mounted = false; };
  }, [user]);

  // Load appointments and filter to current vet (prefer strict ids, fall back to email/name match)
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await appointmentsAPI.getAll();
        let list = Array.isArray(data) ? data : [];
        if (currentVetId || user?.id) {
          const vetIdStr = String(currentVetId || '');
          const userIdStr = String(user?.id || '');
          const userEmail = (user?.email || '').toLowerCase();
          const userName = (user?.fullname || user?.fullName || user?.name || '').toLowerCase();
          let filtered = list.filter(a => (
            String(a.vetId || '') === vetIdStr ||
            String(a.vetUserId || '') === userIdStr ||
            String(a.vetId || '') === userIdStr
          ));
          // Fallback by email or name if nothing matched ids
          if (filtered.length === 0) {
            filtered = list.filter(a => {
              const apptEmail = (a.vetEmail || '').toLowerCase();
              const apptName = (a.vetName || '').toLowerCase();
              return (userEmail && apptEmail && apptEmail === userEmail) ||
                     (userName && apptName && apptName === userName);
            });
          }
          list = filtered;
        }
        if (mounted) setServerAppointments(list);
      } catch (e) {
        console.error('Failed to load appointments from server (port 3001).', e);
      }
    };
    load();
    return () => { mounted = false; };
  }, [currentVetId, user]);

  const timeline = useMemo(() => {
    const mapped = serverAppointments.map(mapApptToTimelineItem);
    const timeToMinutes = (t) => {
      if (!t || typeof t !== 'string') return 24 * 60;
      const m = t.match(/^(\d{1,2}):(\d{2})$/);
      if (!m) return 24 * 60;
      const hh = parseInt(m[1], 10);
      const mm = parseInt(m[2], 10);
      return (isNaN(hh) || isNaN(mm)) ? 24 * 60 : hh * 60 + mm;
    };
    // Keep all real appointments; drop only mock items that clash by time
    const mockFiltered = MOCK_SCHEDULE.filter(m => !mapped.some(r => r.time === m.time));
    const all = [...mockFiltered, ...mapped];
    all.sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
    return all;
  }, [serverAppointments]);

  const handleUpdateStatus = async (apptId, newStatus, meta = {}) => {
    const idx = serverAppointments.findIndex(a => String(a.id) === String(apptId));
    if (idx === -1) return;
    const original = serverAppointments[idx];
    const updated = { 
      ...original, 
      status: newStatus,
      ...(newStatus === 'completed' ? { 
        note: meta.note || '',
        diagnosis: meta.diagnosis || '',
        treatment: meta.treatment || '',
        nextVisit: meta.nextVisit || ''
      } : {}),
      ...(newStatus === 'cancelled' ? { cancelReason: meta.note || '' } : {}),
      updatedAt: new Date().toISOString(),
    };
    setUpdating(prev => ({ ...prev, [apptId]: true }));
    // Optimistic update
    setServerAppointments(prev => prev.map(a => String(a.id) === String(apptId) ? updated : a));
    try {
      await appointmentsAPI.update(apptId, updated);
    } catch (e) {
      console.error('Failed to update appointment status', e);
      // Rollback on error
      setServerAppointments(prev => prev.map(a => String(a.id) === String(apptId) ? original : a));
      alert('Αποτυχία ενημέρωσης κατάστασης ραντεβού.');
    } finally {
      setUpdating(prev => ({ ...prev, [apptId]: false }));
    }
  };

  const requestStatusChange = (apptId, newStatus) => {
    setStatusDialog({ open: true, apptId, newStatus, note: '' });
  };
  const closeStatusDialog = () => setStatusDialog({ open: false, apptId: null, newStatus: null, note: '' });
  const confirmStatusDialog = async () => {
    const { apptId, newStatus, note, diagnosis, treatment, nextVisit } = statusDialog;
    closeStatusDialog();
    await handleUpdateStatus(apptId, newStatus, { note, diagnosis, treatment, nextVisit });
  };

  const [filter, setFilter] = useState('all');
  const filteredTimeline = useMemo(() => {
    if (filter === 'all') return timeline.filter(i => i.status !== 'cancelled');
    return timeline.filter(i => i.status === filter);
  }, [timeline, filter]);
  useEffect(() => { setPage(1); }, [filter, timeline.length]);
  const pageCount = Math.max(1, Math.ceil(filteredTimeline.length / perPage));
  const pagedTimeline = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredTimeline.slice(start, start + perPage);
  }, [filteredTimeline, page]);
  const todayCount = timeline.length;
  const pendingCount = timeline.filter(i => i.status === 'pending').length;
  const completedCount = timeline.filter(i => i.status === 'completed').length;
  
  // Build requests from server appointments: latest pending
  const requests = useMemo(() => {
    const pending = serverAppointments.filter(a => a.status === 'pending');
    // Sort by id (timestamp-like) desc
    pending.sort((a, b) => Number(String(b.id).replace(/\D/g,'')) - Number(String(a.id).replace(/\D/g,'')));
    return pending.slice(0, 8).map(a => ({
      id: a.id,
      pet: a.petName || 'Κατοικίδιο',
      type: a.type === 'Registration' ? 'Καταχώριση' : (a.type || 'Επίσκεψη'),
      owner: a.ownerName || 'Ιδιοκτήτης',
      time: a.time || '-',
      date: a.date || '-',
      reason: a.reason || (a.type === 'Registration' ? 'Καταχώριση Κατοικιδίου' : 'Επίσκεψη'),
      img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=100&q=80'
    }));
  }, [serverAppointments]);

  // Pulse animation when there are pending requests
  const pulse = keyframes`
    0% { box-shadow: 0 0 0 0 rgba(255,167,38,0.6); }
    70% { box-shadow: 0 0 0 8px rgba(255,167,38,0); }
    100% { box-shadow: 0 0 0 0 rgba(255,167,38,0); }
  `;
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
                <Chip label={compact ? 'Compact' : 'Comfort'} variant="outlined" onClick={() => setCompact(v=>!v)} clickable />
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
              <Chip size="small" color={requests.length ? 'secondary' : 'default'} label={requests.length} sx={{ animation: requests.length ? `${pulse} 1.4s ease-out infinite` : 'none' }} />
              <Button size="small" onClick={() => setRequestsOpen(v => !v)} sx={{ ml: 'auto' }}>
                {requestsOpen ? 'Απόκρυψη' : 'Προβολή'}
              </Button>
            </Box>
            <Collapse in={requestsOpen} timeout={150} unmountOnExit>
              <Grid container spacing={2}>
                {requests.map(req => (
                  <Grid item xs={12} md={6} key={req.id}><RequestCard req={req} onAccept={(id) => handleUpdateStatus(id, 'confirmed')} onDecline={(id) => requestStatusChange(id, 'cancelled')} /></Grid>
                ))}
              </Grid>
              <Divider sx={{ my: 2 }} />
            </Collapse>

            {/*Timeline*/}
            {pagedTimeline.map(item => (
              <TimelineItem 
                key={item.id} 
                item={item} 
                onRequestStatus={requestStatusChange} 
                onGoRegistration={(id) => navigate(`/vet/new-record?appointmentId=${id}`)}
                busy={!!updating[item.id]}
                dense={compact}
              />
            ))}

            {/* Pagination */}
            {pageCount > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination count={pageCount} page={page} onChange={(_, v) => setPage(v)} size="small" />
              </Box>
            )}

            {/* Visual for Free Slot */}
            <Box sx={{ display: 'flex', mb: 1.5 }}>
              <Box sx={{ width: '70px', textAlign: 'center', mr: 2 }}><Typography variant="subtitle2" color="text.secondary">16:00</Typography></Box>
              <Box sx={{ flexGrow: 1, border: '2px dashed #eee', borderRadius: '12px', p: 1.5, textAlign: 'center', color: '#999' }}>
                <Typography variant="caption" fontWeight="bold">Διαθέσιμο Κενό</Typography>
              </Box>
            </Box>
          </Paper>
        </Container>
        {/* Status Notes Dialog */}
        <Dialog open={statusDialog.open} onClose={closeStatusDialog} maxWidth="sm" fullWidth>
          <DialogTitle>{statusDialog.newStatus === 'completed' ? 'Ολοκλήρωση Ραντεβού' : 'Ακύρωση Ραντεβού'}</DialogTitle>
          <DialogContent dividers>
            {statusDialog.newStatus === 'completed' ? (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <TextField label="Διάγνωση" value={statusDialog.diagnosis} onChange={(e) => setStatusDialog(prev => ({ ...prev, diagnosis: e.target.value }))} fullWidth />
                <TextField label="Θεραπεία" value={statusDialog.treatment} onChange={(e) => setStatusDialog(prev => ({ ...prev, treatment: e.target.value }))} fullWidth />
                <TextField label="Επόμενη Επίσκεψη" type="date" value={statusDialog.nextVisit} onChange={(e) => setStatusDialog(prev => ({ ...prev, nextVisit: e.target.value }))} InputLabelProps={{ shrink: true }} fullWidth />
                <TextField label="Σημειώσεις προς ιδιοκτήτη" value={statusDialog.note} onChange={(e) => setStatusDialog(prev => ({ ...prev, note: e.target.value }))} multiline rows={3} fullWidth sx={{ gridColumn: { xs: '1', sm: '1 / span 2' } }} />
              </Box>
            ) : (
              <TextField
                fullWidth
                multiline
                rows={3}
                label={'Λόγος ακύρωσης'}
                placeholder={'π.χ. Αδυναμία λόγω έκτακτης περίπτωσης'}
                value={statusDialog.note}
                onChange={(e) => setStatusDialog(prev => ({ ...prev, note: e.target.value }))}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={closeStatusDialog}>Άκυρο</Button>
            <Button variant="contained" onClick={confirmStatusDialog}>{statusDialog.newStatus === 'completed' ? 'Καταχώριση' : 'Ακύρωση'}</Button>
          </DialogActions>
        </Dialog>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}