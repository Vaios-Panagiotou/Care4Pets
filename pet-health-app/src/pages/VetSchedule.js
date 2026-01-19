import React, { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Autocomplete,
  TextField,
  Typography,
} from '@mui/material';
import { keyframes } from '@mui/system';
import { useNavigate } from 'react-router-dom';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import PersonIcon from '@mui/icons-material/Person';

import DashboardSidebar from '../components/DashboardSidebar';
import { appointmentsAPI, vetsAPI, usersAPI, visitsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Used only when the server has no appointments.
const MOCK_SCHEDULE = [
  { id: 101, time: '09:00', pet: 'Max', owner: 'Μαρία Δ.', status: 'completed', type: 'Routine', isMock: true },
  { id: 102, time: '10:30', pet: 'Bella', owner: 'Κώστας Α.', status: 'confirmed', type: 'Surgery', isMock: true },
  { id: 103, time: '12:00', pet: 'Charlie', owner: 'Νίκος Σ.', status: 'confirmed', type: 'Vaccine', isMock: true },
  { id: 104, time: '14:00', pet: 'Lucy', owner: 'Άννα Π.', status: 'pending', type: 'Emergency', isMock: true },
];

function mapApptToItem(appt) {
  const petName = appt.petName || appt.pet?.name || 'Κατοικίδιο';
  const ownerName = appt.ownerName || appt.owner?.name || 'Ιδιοκτήτης';
  return {
    id: appt.id,
    time: appt.time || '—',
    date: appt.date || '',
    pet: petName,
    owner: ownerName,
    status: appt.status || 'confirmed',
    type: appt.type || 'Visit',
    reason: appt.reason || '',
    note: appt.note || '',
    diagnosis: appt.diagnosis || '',
    treatment: appt.treatment || '',
    nextVisit: appt.nextVisit || '',
    cancelReason: appt.cancelReason || '',
    isMock: false,
  };
}

function timeToMinutes(t) {
  if (!t || typeof t !== 'string') return 24 * 60;
  const m = t.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return 24 * 60;
  const hh = parseInt(m[1], 10);
  const mm = parseInt(m[2], 10);
  return (isNaN(hh) || isNaN(mm)) ? 24 * 60 : hh * 60 + mm;
}

function getDueMeta(item, nowMin) {
  const startMin = timeToMinutes(item.time);
  const delta = startMin - nowMin;
  if (item.status !== 'confirmed') return { state: null, delta };
  if (delta <= -10) return { state: 'overdue', delta: Math.abs(delta) };
  if (delta <= 0) return { state: 'due', delta: 0 };
  if (delta <= 20) return { state: 'soon', delta };
  return { state: null, delta };
}

function statusLabel(status) {
  if (status === 'pending') return 'Νέο';
  if (status === 'confirmed') return 'Επιβεβαιωμένο';
  if (status === 'completed') return 'Ολοκληρώθηκε';
  if (status === 'cancelled') return 'Ακυρώθηκε';
  return status;
}

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  60% { transform: scale(1.12); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
`;

const Column = ({ title, subtitle, icon, actions, children }) => (
  <Paper sx={{ p: 2, borderRadius: 3 }}>
    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 1.25 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
        <Box sx={{
          width: 36,
          height: 36,
          borderRadius: 2,
          display: 'grid',
          placeItems: 'center',
          bgcolor: 'action.hover',
          color: 'text.primary'
        }}>
          {icon}
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 900, lineHeight: 1.1 }}>{title}</Typography>
          {subtitle ? <Typography variant="caption" color="text.secondary">{subtitle}</Typography> : null}
        </Box>
      </Box>
      {actions ? <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{actions}</Box> : null}
    </Box>
    <Divider sx={{ mb: 1.5 }} />
    {children}
  </Paper>
);

const RequestCard = ({ item, busy, onAccept, onDecline }) => (
  <Paper sx={{ p: 1.75, borderRadius: 3, mb: 1.5, boxShadow: '0 0 0 2px rgba(245,158,11,0.14)' }}>
    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5 }}>
      <Box sx={{ display: 'flex', gap: 1.25, minWidth: 0 }}>
        <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.dark', borderRadius: 2, width: 42, height: 42, fontWeight: 900 }}>
          {(item.pet || 'Κ')[0]}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography sx={{ fontWeight: 900 }} noWrap>{item.pet}</Typography>
            <Chip size="small" color="secondary" label="ΝΕΟ" sx={{ fontWeight: 900, animation: `${pulse} 1.1s ease-in-out infinite` }} />
          </Box>
          <Typography variant="body2" color="text.secondary" noWrap sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PersonIcon fontSize="small" /> {item.owner}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.75, flexWrap: 'wrap' }}>
            <Chip size="small" label={item.time} icon={<AccessTimeIcon />} variant="outlined" />
            {item.type ? <Chip size="small" label={item.type} sx={{ bgcolor: 'action.hover' }} /> : null}
          </Box>
          {item.reason ? (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.75 }}>
              {item.reason}
            </Typography>
          ) : null}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
        <Button
          size="small"
          variant="contained"
          color="primary"
          startIcon={<CheckCircleIcon />}
          disabled={item.isMock || busy}
          onClick={() => onAccept(item.id)}
          sx={{ minWidth: 130 }}
        >
          Αποδοχή
        </Button>
        <Button
          size="small"
          variant="outlined"
          color="error"
          startIcon={<CancelIcon />}
          disabled={item.isMock || busy}
          onClick={() => onDecline(item.id)}
        >
          Απόρριψη
        </Button>
      </Box>
    </Box>
  </Paper>
);

const ApptCard = ({ item, dueMeta, busy, onComplete, onCancel, onGoRegistration }) => {
  const urgent = dueMeta?.state === 'due' || dueMeta?.state === 'overdue';
  const soon = dueMeta?.state === 'soon';
  const dueChip =
    dueMeta?.state === 'overdue' ? { label: `Καθυστ. ${dueMeta.delta}′`, color: 'error' } :
    dueMeta?.state === 'due' ? { label: 'Τώρα', color: 'secondary' } :
    dueMeta?.state === 'soon' ? { label: `Σε ${dueMeta.delta}′`, color: 'secondary' } :
    null;

  const primaryAction = item.type === 'Registration'
    ? { label: 'Καταχώριση', onClick: () => onGoRegistration(item.id) }
    : { label: 'Ολοκλήρωση', onClick: () => onComplete(item.id) };

  return (
    <Paper sx={{
      p: 1.75,
      borderRadius: 3,
      mb: 1.5,
      boxShadow: urgent
        ? '0 0 0 2px rgba(220,38,38,0.18)'
        : (soon ? '0 0 0 2px rgba(245,158,11,0.14)' : undefined),
    }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5 }}>
        <Box sx={{ display: 'flex', gap: 1.25, minWidth: 0 }}>
          <Avatar sx={{
            bgcolor: urgent ? 'error.light' : 'action.hover',
            color: urgent ? 'error.main' : 'text.primary',
            borderRadius: 2,
            width: 42,
            height: 42,
            fontWeight: 900,
          }}>
            {(item.pet || 'Κ')[0]}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography sx={{ fontWeight: 900 }} noWrap>{item.pet}</Typography>
              <Chip size="small" label={item.time} icon={<AccessTimeIcon />} variant="outlined" />
              {dueChip ? <Chip size="small" label={dueChip.label} color={dueChip.color} /> : null}
            </Box>
            <Typography variant="body2" color="text.secondary" noWrap sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PersonIcon fontSize="small" /> {item.owner}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.75, flexWrap: 'wrap' }}>
              <Chip size="small" label={item.type} sx={{ bgcolor: 'action.hover' }} />
              <Chip size="small" label={statusLabel(item.status)} variant="outlined" />
            </Box>
            {item.reason ? (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.75 }}>
                {item.reason}
              </Typography>
            ) : null}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
          <Button
            size="small"
            variant="contained"
            color="primary"
            startIcon={<CheckCircleIcon />}
            disabled={item.isMock || busy || item.status !== 'confirmed'}
            onClick={primaryAction.onClick}
            sx={{ minWidth: 130 }}
          >
            {primaryAction.label}
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<CancelIcon />}
            disabled={item.isMock || busy || item.status !== 'confirmed'}
            onClick={() => onCancel(item.id)}
          >
            Ακύρωση
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

const ClosedCard = ({ item }) => (
  <Paper sx={{ p: 1.25, borderRadius: 3, mb: 1, opacity: item.status === 'completed' ? 0.92 : 1 }}>
    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.25 }}>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontWeight: 900 }} noWrap>
          {item.pet} <Typography component="span" color="text.secondary" sx={{ fontWeight: 700 }}>• {item.time}</Typography>
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>{item.owner}</Typography>
        {item.status === 'cancelled' && item.cancelReason ? (
          <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', mt: 0.25 }}>
            Λόγος: {item.cancelReason}
          </Typography>
        ) : null}
      </Box>
      <Chip size="small" label={statusLabel(item.status)} color={item.status === 'cancelled' ? 'error' : 'default'} variant={item.status === 'cancelled' ? 'filled' : 'outlined'} />
    </Box>
  </Paper>
);

export default function VetSchedule() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [closedExpanded, setClosedExpanded] = useState(false);

  const [serverAppointments, setServerAppointments] = useState([]);
  const [currentVetId, setCurrentVetId] = useState(null);
  const [updating, setUpdating] = useState({});
  const [nowMinutes, setNowMinutes] = useState(() => {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  });

  // New appointment dialog state
  const [newApptOpen, setNewApptOpen] = useState(false);
  const [creatingAppt, setCreatingAppt] = useState(false);
  const [owners, setOwners] = useState([]);
  const [loadingOwners, setLoadingOwners] = useState(false);
  const [newAppt, setNewAppt] = useState({
    ownerId: '',
    ownerName: '',
    ownerEmail: '',
    petName: '',
    date: '',
    time: '',
    type: 'Visit',
    reason: '',
    phone: ''
  });
  
  // Load owners when dialog opens
  useEffect(() => {
    let mounted = true;
    const loadOwners = async () => {
      if (!newApptOpen) return;
      try {
        setLoadingOwners(true);
        const all = await usersAPI.getAll();
        const onlyOwners = Array.isArray(all) ? all.filter(u => u.role === 'owner') : [];
        if (mounted) setOwners(onlyOwners);
      } catch (e) {
        console.warn('Failed to load owners', e);
        if (mounted) setOwners([]);
      } finally {
        if (mounted) setLoadingOwners(false);
      }
    };
    loadOwners();
    return () => { mounted = false; };
  }, [newApptOpen]);

  const [statusDialog, setStatusDialog] = useState({
    open: false,
    apptId: null,
    newStatus: null,
    note: '',
    diagnosis: '',
    treatment: '',
    nextVisit: ''
  });

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

  // Load appointments and filter to current vet
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

  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date();
      setNowMinutes(d.getHours() * 60 + d.getMinutes());
    }, 30000);
    return () => clearInterval(id);
  }, []);

  const items = useMemo(() => {
    const mapped = serverAppointments.map(mapApptToItem);
    const base = mapped.length ? mapped : MOCK_SCHEDULE;
    return [...base].sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
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
      ...(newStatus === 'cancelled' ? { cancelReason: meta.note || '', cancelledBy: 'vet' } : {}),
      updatedAt: new Date().toISOString(),
    };
    setUpdating(prev => ({ ...prev, [apptId]: true }));
    setServerAppointments(prev => prev.map(a => String(a.id) === String(apptId) ? updated : a));
    try {
      await appointmentsAPI.update(apptId, updated);
      // If appointment completed, record visit on pet and vet user
      if (newStatus === 'completed') {
        try {
          await visitsAPI.recordVisit(updated);
        } catch (err) { console.error('[record visit after complete]', err); }
      }
    } catch (e) {
      console.error('Failed to update appointment status', e);
      setServerAppointments(prev => prev.map(a => String(a.id) === String(apptId) ? original : a));
      alert('Αποτυχία ενημέρωσης κατάστασης ραντεβού.');
    } finally {
      setUpdating(prev => ({ ...prev, [apptId]: false }));
    }
  };

  const requestStatusChange = (apptId, newStatus) => {
    // If completing, route to the appropriate page depending on appointment details/reason
    if (newStatus === 'completed') {
      const appt = serverAppointments.find(a => String(a.id) === String(apptId));
      const details = Array.isArray(appt?.details) ? appt.details : [];
      const reason = (appt?.reason || '').toLowerCase();

      if (details.includes('new-record') || appt?.type === 'Registration' || reason.includes('καταχώρι')) {
        navigate(`/vet/new-record?appointmentId=${apptId}`);
        return;
      }
      if (details.includes('new-prescription') || reason.includes('συνταγ')) {
        navigate(`/vet/records?open=prescription&appointmentId=${apptId}`);
        return;
      }
      if (details.includes('loss') || reason.includes('απώλεια')) {
        navigate(`/vet/records?open=loss&appointmentId=${apptId}`);
        return;
      }
      if (details.includes('found') || reason.includes('εύρεση')) {
        navigate(`/vet/records?open=found&appointmentId=${apptId}`);
        return;
      }
      if (details.includes('transfer') || reason.includes('μεταβίβαση') || reason.includes('υιοθεσ')) {
        navigate(`/vet/records?open=transfer&appointmentId=${apptId}`);
        return;
      }
      // Default: open the status dialog (general complete flow)
    }

    setStatusDialog({
      open: true,
      apptId,
      newStatus,
      note: '',
      diagnosis: '',
      treatment: '',
      nextVisit: ''
    });
  };
  const closeStatusDialog = () => setStatusDialog({ open: false, apptId: null, newStatus: null, note: '', diagnosis: '', treatment: '', nextVisit: '' });
  const confirmStatusDialog = async () => {
    const { apptId, newStatus, note, diagnosis, treatment, nextVisit } = statusDialog;
    closeStatusDialog();
    await handleUpdateStatus(apptId, newStatus, { note, diagnosis, treatment, nextVisit });
  };

  const pendingItems = useMemo(() => items.filter(i => i.status === 'pending'), [items]);
  const confirmedItems = useMemo(() => items.filter(i => i.status === 'confirmed'), [items]);
  const completedItems = useMemo(() => items.filter(i => i.status === 'completed'), [items]);
  const cancelledItems = useMemo(() => items.filter(i => i.status === 'cancelled'), [items]);

  const closedHasMore = completedItems.length > 3 || cancelledItems.length > 3;
  const completedDisplay = closedExpanded ? completedItems : completedItems.slice(0, 3);
  const cancelledDisplay = closedExpanded ? cancelledItems : cancelledItems.slice(0, 3);

  const dueBucket = useMemo(() => {
    const withMeta = confirmedItems
      .map(i => ({ item: i, meta: getDueMeta(i, nowMinutes) }))
      .sort((a, b) => timeToMinutes(a.item.time) - timeToMinutes(b.item.time));
    return {
      urgent: withMeta.filter(x => x.meta.state === 'overdue' || x.meta.state === 'due'),
      soon: withMeta.filter(x => x.meta.state === 'soon'),
      later: withMeta.filter(x => !x.meta.state),
    };
  }, [confirmedItems, nowMinutes]);

  const counts = {
    inbox: pendingItems.length,
    today: confirmedItems.length,
    closed: completedItems.length + cancelledItems.length,
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 6 }}>

        {/* HERO SECTION (full width) */}
        <Box sx={{ 
          position: 'relative',
          py: 6,
          mb: 2,
          color: 'white',
          textAlign: 'center',
          width: '100vw',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          backgroundImage: 'url(https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'hidden'
        }}>
          <Box sx={{ 
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(38, 50, 56, 0.9) 0%, rgba(0, 105, 92, 0.85) 100%)',
              zIndex: 1
          }} />
          <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
              <CalendarMonthIcon sx={{ fontSize: 60, mb: 2, opacity: 0.95 }} />
              <Typography variant="h3" fontWeight="800" gutterBottom>
                  Ραντεβού Κτηνιάτρου
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                  Διαχειριστείτε εισερχόμενα, επιβεβαιώσεις και ολοκληρώσεις
              </Typography>
          </Container>
        </Box>

      <Container maxWidth="xl" sx={{ pt: 2 }}>

        {/* Header (spans above the sidebar) */}
        <Paper sx={{ p: 2, borderRadius: 3, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>Κέντρο Ραντεβού</Typography>
              <Typography variant="body2" color="text.secondary">Inbox → Αποδοχή/Απόρριψη, Σήμερα → Ολοκλήρωση, Κλειστά → Ιστορικό.</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Chip icon={<PendingActionsIcon />} label={`Νέα: ${counts.inbox}`} color={counts.inbox ? 'secondary' : 'default'} />
              <Chip icon={<AccessTimeIcon />} label={`Σήμερα: ${counts.today}`} />
              <Chip icon={<DoneAllIcon />} label={`Κλειστά: ${counts.closed}`} />
              <Button variant="contained" size="small" onClick={() => setNewApptOpen(true)}>Νέο Ραντεβού</Button>
            </Box>
          </Box>
        </Paper>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <Box sx={{ width: { xs: '100%', md: 280 }, flexShrink: 0, position: 'sticky', top: 120, alignSelf: 'flex-start' }}>
            <DashboardSidebar />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Grid container spacing={2} sx={{ flexWrap: { xs: 'wrap', md: 'nowrap' }, overflowX: { xs: 'auto', md: 'visible' } }}>
              <Grid item xs={12} md={4} sx={{ minWidth: { md: 320 } }}>
                <Column
                  title="Inbox"
                  subtitle={counts.inbox ? 'Νέα ραντεβού που περιμένουν έγκριση' : 'Δεν υπάρχουν νέα αιτήματα'}
                  icon={<NotificationsActiveIcon fontSize="small" />}
                  actions={counts.inbox ? (
                    <Chip size="small" color="secondary" label={counts.inbox} sx={{ fontWeight: 900, animation: `${pulse} 1.1s ease-in-out infinite` }} />
                  ) : (
                    <Chip size="small" label="0" />
                  )}
                >
                  {pendingItems.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">Όταν έρθει νέο ραντεβού, θα εμφανιστεί εδώ.</Typography>
                  ) : (
                    pendingItems.map((item) => (
                      <RequestCard
                        key={item.id}
                        item={item}
                        busy={!!updating[item.id]}
                        onAccept={(id) => handleUpdateStatus(id, 'confirmed')}
                        onDecline={(id) => requestStatusChange(id, 'cancelled')}
                      />
                    ))
                  )}
                </Column>
              </Grid>

              <Grid item xs={12} md={4} sx={{ minWidth: { md: 320 } }}>
                <Column
                  title="Σήμερα"
                  subtitle="Ολοκλήρωση / Ακύρωση από την κάρτα"
                  icon={<AccessTimeIcon fontSize="small" />}
                  actions={<Chip size="small" label={counts.today} />}
                >
                  {confirmedItems.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">Δεν υπάρχουν επιβεβαιωμένα ραντεβού.</Typography>
                  ) : (
                    <>
                      {dueBucket.urgent.length ? (
                        <Box sx={{ mb: 1.5 }}>
                          <Typography variant="caption" sx={{ fontWeight: 900, color: 'error.main' }}>ΤΩΡΑ / ΚΑΘΥΣΤΕΡΗΣΗ</Typography>
                          <Box sx={{ mt: 1 }}>
                            {dueBucket.urgent.map(({ item, meta }) => (
                              <ApptCard
                                key={item.id}
                                item={item}
                                dueMeta={meta}
                                busy={!!updating[item.id]}
                                onComplete={(id) => requestStatusChange(id, 'completed')}
                                onCancel={(id) => requestStatusChange(id, 'cancelled')}
                                onGoRegistration={(id) => navigate(`/vet/new-record?appointmentId=${id}`)}
                              />
                            ))}
                          </Box>
                        </Box>
                      ) : null}

                      {dueBucket.soon.length ? (
                        <Box sx={{ mb: 1.5 }}>
                          <Typography variant="caption" sx={{ fontWeight: 900, color: 'warning.dark' }}>ΕΡΧΕΤΑΙ ΣΥΝΤΟΜΑ</Typography>
                          <Box sx={{ mt: 1 }}>
                            {dueBucket.soon.map(({ item, meta }) => (
                              <ApptCard
                                key={item.id}
                                item={item}
                                dueMeta={meta}
                                busy={!!updating[item.id]}
                                onComplete={(id) => requestStatusChange(id, 'completed')}
                                onCancel={(id) => requestStatusChange(id, 'cancelled')}
                                onGoRegistration={(id) => navigate(`/vet/new-record?appointmentId=${id}`)}
                              />
                            ))}
                          </Box>
                        </Box>
                      ) : null}

                      <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary' }}>ΥΠΟΛΟΙΠΑ</Typography>
                      <Box sx={{ mt: 1 }}>
                        {dueBucket.later.map(({ item, meta }) => (
                          <ApptCard
                            key={item.id}
                            item={item}
                            dueMeta={meta}
                            busy={!!updating[item.id]}
                            onComplete={(id) => requestStatusChange(id, 'completed')}
                            onCancel={(id) => requestStatusChange(id, 'cancelled')}
                            onGoRegistration={(id) => navigate(`/vet/new-record?appointmentId=${id}`)}
                          />
                        ))}
                      </Box>
                    </>
                  )}
                </Column>
              </Grid>

              <Grid item xs={12} md={4}>
                <Column
                  title="Κλειστά"
                  subtitle="Ολοκληρωμένα + Ακυρωμένα"
                  icon={<DoneAllIcon fontSize="small" />}
                  actions={<Chip size="small" label={counts.closed} />}
                >
                  {counts.closed === 0 ? (
                    <Typography variant="body2" color="text.secondary">Δεν υπάρχει ιστορικό ακόμα.</Typography>
                  ) : (
                    <>
                      {completedDisplay.length ? (
                        <Box sx={{ mb: 1.5 }}>
                          <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary' }}>ΟΛΟΚΛΗΡΩΜΕΝΑ</Typography>
                          <Box sx={{ mt: 1 }}>
                            {completedDisplay.map((item) => (
                              <ClosedCard key={item.id} item={item} />
                            ))}
                          </Box>
                        </Box>
                      ) : null}

                      {cancelledDisplay.length ? (
                        <Box>
                          <Typography variant="caption" sx={{ fontWeight: 900, color: 'error.main' }}>ΑΚΥΡΩΜΕΝΑ</Typography>
                          <Box sx={{ mt: 1 }}>
                            {cancelledDisplay.map((item) => (
                              <ClosedCard key={item.id} item={item} />
                            ))}
                          </Box>
                        </Box>
                      ) : null}

                      {closedHasMore ? (
                        <Box sx={{ mt: 1 }}>
                          <Button
                            size="small"
                            variant="text"
                            onClick={() => setClosedExpanded(v => !v)}
                            sx={{ fontWeight: 800 }}
                          >
                            {closedExpanded ? 'Σύμπτυξη' : `Προβολή όλων (${counts.closed})`}
                          </Button>
                        </Box>
                      ) : null}
                    </>
                  )}
                </Column>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>

      {/* New Appointment Dialog */}
      <Dialog open={newApptOpen} onClose={() => setNewApptOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Νέο Ραντεβού</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <Autocomplete
              loading={loadingOwners}
              options={owners}
              getOptionLabel={(o) => o.fullname || o.name || o.email || ''}
              value={owners.find(o => String(o.id) === String(newAppt.ownerId)) || null}
              onChange={(e, val) => setNewAppt(prev => ({ ...prev, ownerId: val?.id || '', ownerName: val ? (val.fullname || val.name || '') : prev.ownerName, ownerEmail: val?.email || '' }))}
              onInputChange={(e, inp) => setNewAppt(prev => ({ ...prev, ownerName: inp }))}
              renderInput={(params) => (
                <TextField {...params} label="Ιδιοκτήτης" placeholder="Επιλέξτε ή πληκτρολογήστε" />
              )}
            />
            <TextField label="Κατοικίδιο" value={newAppt.petName} onChange={(e) => setNewAppt(prev => ({ ...prev, petName: e.target.value }))} fullWidth />
            <TextField label="Ημερομηνία" type="date" value={newAppt.date} onChange={(e) => setNewAppt(prev => ({ ...prev, date: e.target.value }))} InputLabelProps={{ shrink: true }} fullWidth />
            <TextField label="Ώρα" type="time" value={newAppt.time} onChange={(e) => setNewAppt(prev => ({ ...prev, time: e.target.value }))} InputLabelProps={{ shrink: true }} fullWidth />
            <TextField label="Τύπος" value={newAppt.type} onChange={(e) => setNewAppt(prev => ({ ...prev, type: e.target.value }))} fullWidth />
            <TextField label="Λόγος (προαιρετικό)" value={newAppt.reason} onChange={(e) => setNewAppt(prev => ({ ...prev, reason: e.target.value }))} fullWidth />
            <TextField label="Email ιδιοκτήτη" type="email" value={newAppt.ownerEmail} onChange={(e) => setNewAppt(prev => ({ ...prev, ownerEmail: e.target.value }))} fullWidth />
            <TextField label="Τηλέφωνο" type="tel" value={newAppt.phone} onChange={(e) => setNewAppt(prev => ({ ...prev, phone: e.target.value }))} fullWidth />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewApptOpen(false)} disabled={creatingAppt}>Άκυρο</Button>
          <Button variant="contained" disabled={creatingAppt} onClick={async () => {
            const { ownerId, ownerName, ownerEmail, petName, date, time, type, reason, phone } = newAppt;
            if (!petName || !date || !time) { alert('Συμπληρώστε Κατοικίδιο, Ημερομηνία και Ώρα.'); return; }
            setCreatingAppt(true);
            const payload = {
              ownerId: ownerId || null,
              ownerName: ownerName || undefined,
              ownerEmail: ownerEmail || undefined,
              vetId: String(currentVetId || user?.id || ''),
              vetUserId: String(user?.id || ''),
              vetEmail: user?.email || '',
              vetName: user?.fullname || user?.fullName || user?.name || '',
              petName,
              time,
              date,
              status: 'confirmed',
              type: type || 'Visit',
              reason: reason || '',
              phone: phone || '',
              updatedAt: new Date().toISOString(),
            };
            try {
              const created = await appointmentsAPI.create(payload);
              setServerAppointments(prev => [...prev, created]);
              setNewApptOpen(false);
              setNewAppt({ ownerId: '', ownerName: '', ownerEmail: '', petName: '', date: '', time: '', type: 'Visit', reason: '', phone: '' });
            } catch (e) {
              console.error('Failed to create appointment', e);
              alert('Αποτυχία δημιουργίας ραντεβού.');
            } finally {
              setCreatingAppt(false);
            }
          }}>Δημιουργία</Button>
        </DialogActions>
      </Dialog>

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
          <Button variant="contained" onClick={confirmStatusDialog}>
            {statusDialog.newStatus === 'completed' ? 'Καταχώριση' : 'Ακύρωση'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
