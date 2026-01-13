import React, { useEffect, useState } from 'react';
import {
  Box, Container, Grid, Typography, Button, Paper, Avatar, IconButton, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions, Chip, Skeleton, Tabs, Tab
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardSidebar from '../components/DashboardSidebar';
import PageHeader from './PageHeader';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import PetsIcon from '@mui/icons-material/Pets';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import { petsAPI } from '../services/api';

const theme = createTheme({
  palette: { 
    primary: { main: '#1976d2' },
    secondary: { main: '#ff6b6b' },
    background: { default: '#f8fafc' },
    text: { primary: '#1e293b', secondary: '#64748b' }
  },
  shape: { borderRadius: 12 }
});const QuickActionCard = ({ icon, title, onClick }) => (
  <Paper sx={{ 
    px: 2, py: 1.5, 
    cursor: 'pointer', 
    display: 'flex', 
    alignItems: 'center', 
    gap: 1.5,
    minWidth: 180,
    transition: 'all 0.2s',
    bgcolor: 'white',
    '&:hover': { bgcolor: '#e3f2fd', transform: 'translateY(-2px)', boxShadow: 3 } 
  }} onClick={onClick}>
    {icon}
    <Typography variant="body2" fontWeight={600}>{title}</Typography>
  </Paper>
);

const AppointmentCard = ({ appointment, onViewDetails, onCancel }) => (
  <Paper sx={{ 
    p: 2, mb: 2, 
    borderLeft: appointment.status === 'confirmed' 
      ? '4px solid #10b981' 
      : appointment.status === 'completed' 
        ? '4px solid #0ea5e9' 
        : '4px solid #ef4444', 
    bgcolor: 'white' 
  }}>
    <Typography variant="caption" sx={{ 
      bgcolor: appointment.status === 'confirmed' 
        ? '#d1fae5' 
        : appointment.status === 'completed' 
          ? '#e0f2fe' 
          : '#fee2e2',
      color: appointment.status === 'confirmed' 
        ? '#065f46' 
        : appointment.status === 'completed' 
          ? '#0c4a6e' 
          : '#991b1b',
      px: 1, py: 0.5, borderRadius: 1, fontWeight: 600, fontSize: '0.7rem'
    }}>
      {appointment.status === 'confirmed' ? 'Επιβεβαιωμένο' : appointment.status === 'completed' ? 'Ολοκληρωμένο' : 'Ακυρωμένο'}
    </Typography>
    <Typography variant="body2" fontWeight={700} sx={{ mt: 1, color: 'text.primary' }}>{appointment.date} • {appointment.time}</Typography>
    <Typography variant="caption" display="block" sx={{ mt: 0.5, color: 'text.secondary' }}>{appointment.vetName || appointment.doctor}</Typography>
    <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>{appointment.petName || appointment.pet}</Typography>
    {appointment.location && <Typography variant="caption" display="block" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, color: 'text.secondary' }}>
      <LocationOnIcon sx={{ fontSize: 14 }} /> {appointment.location}
    </Typography>}
    {appointment.diagnosis && (
      <Typography variant="caption" display="block" sx={{ mt: 0.5, color: 'text.secondary' }}>
        🧪 Διάγνωση: {appointment.diagnosis}
      </Typography>
    )}
    {appointment.treatment && (
      <Typography variant="caption" display="block" sx={{ mt: 0.5, color: 'text.secondary' }}>
        Θεραπεία: {appointment.treatment}
      </Typography>
    )}
    {appointment.nextVisit && (
      <Typography variant="caption" display="block" sx={{ mt: 0.5, color: 'text.secondary' }}>
        Επόμενη Επίσκεψη: {appointment.nextVisit}
      </Typography>
    )}
    {appointment.note && (
      <Typography variant="caption" display="block" sx={{ mt: 0.5, color: 'text.secondary' }}>
        {appointment.note}
      </Typography>
    )}
    {appointment.cancelReason && (
      <Typography variant="caption" display="block" sx={{ mt: 0.5, color: 'text.secondary' }}>
        Λόγος ακύρωσης: {appointment.cancelReason}
      </Typography>
    )}
    {appointment.phone && <Typography variant="caption" display="block" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
      <PhoneIcon sx={{ fontSize: 14 }} /> {appointment.phone}
    </Typography>}
    <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
      <Button size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} onClick={() => onViewDetails(appointment)}>Λεπτομέρειες</Button>
      {appointment.status === 'confirmed' && <Button size="small" variant="contained" sx={{ fontSize: '0.7rem', bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' } }} onClick={() => onCancel(appointment)}>Ακύρωση</Button>}
    </Box>
  </Paper>
);

// Shared date helpers moved to module-level so CalendarWidget (top-level) can use them
function parseApptDate(appt) {
  if (!appt) return null;

  const tryParse = (s) => {
    if (!s) return null;
    const d = new Date(s);
    if (!isNaN(d)) return d;
    const m = s.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
    if (m) {
      const day = parseInt(m[1], 10);
      const month = parseInt(m[2], 10) - 1;
      const year = parseInt(m[3], 10);
      const d2 = new Date(year, month, day);
      if (!isNaN(d2)) return d2;
    }
    const monthNamesGen = ['Ιανουαρίου','Φεβρουαρίου','Μαρτίου','Απριλίου','Μαΐου','Ιουνίου','Ιουλίου','Αυγούστου','Σεπτεμβρίου','Οκτωβρίου','Νοεμβρίου','Δεκεμβρίου'];
    const monthNamesLocal = ['Ιανουάριος','Φεβρουάριος','Μάρτιος','Απρίλιος','Μάιος','Ιούνιος','Ιούλιος','Αύγουστος','Σεπτέμβριος','Οκτώβριος','Νοέμβριος','Δεκέμβριος'];
    for (let i = 0; i < monthNamesLocal.length; i++) {
      const sLower = s.toLowerCase();
      if (sLower.includes(monthNamesLocal[i].toLowerCase()) || sLower.includes(monthNamesGen[i].toLowerCase())) {
        const dayMatch = s.match(/(\d{1,2})/);
        const yearMatch = s.match(/(\d{4})/);
        const day = dayMatch ? parseInt(dayMatch[1], 10) : 1;
        const year = yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear();
        const d2 = new Date(year, i, day);
        if (!isNaN(d2)) return d2;
      }
    }
    return null;
  };

  const candidates = [appt.date, appt.dateTime, appt.registeredAt, appt.dateStr, appt.createdAt];
  for (const c of candidates) {
    const p = tryParse(c);
    if (p) return p;
  }

  if (appt.date && appt.time) {
    const s = `${appt.date} ${appt.time}`;
    const p = tryParse(s);
    if (p) return p;
  }

  return null;
}

function isSameDay(d1, d2) {
  if (!d1 || !d2) return false;
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}

const CalendarWidget = ({ appointments = [], selectedDateExternal = null, onDaySelect = null }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = React.useState(today.getMonth());
  const [currentYear, setCurrentYear] = React.useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = React.useState(today.getDate());
  const [hoveredDay, setHoveredDay] = React.useState(null);
  const [appointmentsByDay, setAppointmentsByDay] = React.useState({});

  // Sync external selected date (if provided) into the calendar view
  React.useEffect(() => {
    if (!selectedDateExternal) return;
    if (Object.prototype.toString.call(selectedDateExternal) === '[object Date]') {
      setCurrentMonth(selectedDateExternal.getMonth());
      setCurrentYear(selectedDateExternal.getFullYear());
      setSelectedDay(selectedDateExternal.getDate());
    }
  }, [selectedDateExternal]);

  const days = ['Δε', 'Τρ', 'Τε', 'Πε', 'Πα', 'Σα', 'Κυ'];
  const monthNames = ['Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 'Μάιος', 'Ιούνιος', 
                      'Ιούλιος', 'Αύγουστος', 'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος'];
  
  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  // Build appointments map for the current month/year
  React.useEffect(() => {
    const map = {};
    const normalizeDate = (appt) => {
      if (!appt) return null;
      const tryParse = (s) => {
        if (!s) return null;
        const d = new Date(s);
        if (!isNaN(d)) return d;
        // dd/mm/yyyy or dd-mm-yyyy
        const m = s.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
        if (m) {
          const day = parseInt(m[1], 10);
          const month = parseInt(m[2], 10) - 1;
          const year = parseInt(m[3], 10);
          return new Date(year, month, day);
        }
        // Greek month name - support nominative and genitive (e.g., 'Ιανουάριος' and 'Ιανουαρίου')
        const monthNamesGen = ['Ιανουαρίου','Φεβρουαρίου','Μαρτίου','Απριλίου','Μαΐου','Ιουνίου','Ιουλίου','Αυγούστου','Σεπτεμβρίου','Οκτωβρίου','Νοεμβρίου','Δεκεμβρίου'];
        for (let i = 0; i < monthNames.length; i++) {
          const sLower = s.toLowerCase();
          if (sLower.includes(monthNames[i].toLowerCase()) || sLower.includes(monthNamesGen[i].toLowerCase())) {
            const dayMatch = s.match(/(\d{1,2})/);
            const yearMatch = s.match(/(\d{4})/);
            const day = dayMatch ? parseInt(dayMatch[1], 10) : 1;
            const year = yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear();
            return new Date(year, i, day);
          }
        }
        return null;
      };

      // try common fields
      const candidates = [appt.date, appt.dateTime, appt.registeredAt, appt.dateStr, appt.createdAt];
      for (const c of candidates) {
        const parsed = tryParse(c);
        if (parsed) return parsed;
      }

      // try combining date + time fields
      if (appt.date && appt.time) {
        const s = `${appt.date} ${appt.time}`;
        const parsed = tryParse(s);
        if (parsed) return parsed;
      }

      return null;
    };

    appointments.forEach((a) => {
      const d = normalizeDate(a);
      if (!d) return;
      if (d.getFullYear() !== currentYear || d.getMonth() !== currentMonth) return;
      const day = d.getDate();
      if (!map[day]) map[day] = { count: 0, details: [], type: null };
      map[day].count += 1;
      map[day].details.push(a);
      // decide type priority: cancelled > completed > confirmed > pending
      const status = a.status;
      const priority = { cancelled: 4, completed: 3, confirmed: 2, pending: 1 };
      const currentPriority = map[day].type ? (priority[map[day].type] || 0) : 0;
      const newPriority = priority[status] || 0;
      if (newPriority > currentPriority) {
        map[day].type = status;
      }
    });

    setAppointmentsByDay(map);
  }, [appointments, currentMonth, currentYear]);
  
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const prevMonthDays = getDaysInMonth(currentMonth - 1, currentYear);
  
  const handlePrevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); } else setCurrentMonth(m => m - 1);
  };
  const handleNextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); } else setCurrentMonth(m => m + 1);
  };
  

  const handleDayClick = (day) => {
    setSelectedDay(day);
    if (typeof onDaySelect === 'function') onDaySelect(day, currentMonth, currentYear);
  };

  const renderDay = (day, isCurrentMonth = true) => {
    const appointment = isCurrentMonth ? appointmentsByDay[day] : null;
    let bg = 'transparent', color = '#1e293b', border = 'none';
    
    if (appointment) {
      if (appointment.type === 'cancelled') { bg = '#ef4444'; color = 'white'; }
      else if (appointment.type === 'completed') { bg = '#0ea5e9'; color = 'white'; }
      else if (appointment.type === 'confirmed') { bg = '#10b981'; color = 'white'; }
      else if (appointment.type === 'pending') { bg = '#f59e0b'; color = 'white'; }
    }
    
    if (isCurrentMonth && day === selectedDayUsed) {
      border = '2px solid #1976d2';
    }

    const isToday = isCurrentMonth && day === 14 && currentMonth === 11 && currentYear === 2025;
    
    return (
      <Box 
        onClick={() => isCurrentMonth && handleDayClick(day)}
        onMouseEnter={() => setHoveredDay(isCurrentMonth ? day : null)}
        onMouseLeave={() => setHoveredDay(null)}
        sx={{ 
          width: 36, 
          height: 36, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          bgcolor: bg, 
          color: isCurrentMonth ? color : '#bdbdbd', 
          borderRadius: '6px', 
          fontSize: '0.85rem',
          fontWeight: isToday ? 700 : 500,
          cursor: isCurrentMonth ? 'pointer' : 'default',
          border: border,
          position: 'relative',
          transition: 'all 0.16s ease',
          boxShadow: hoveredDay === day && isCurrentMonth ? '0 4px 12px rgba(0,0,0,0.12)' : 'none',
          transform: hoveredDay === day && isCurrentMonth ? 'scale(1.06)' : 'scale(1)',
          '&:hover': { 
            bgcolor: !appointment && isCurrentMonth ? '#e3f2fd' : bg,
            boxShadow: isCurrentMonth ? '0 4px 12px rgba(0,0,0,0.12)' : 'none'
          }
        }}
      >
        {day}
        {appointment && isCurrentMonth && (
          <Box sx={{ 
            position: 'absolute', 
            bottom: 4, 
            right: 4, 
            width: 6, 
            height: 6, 
            borderRadius: '50%', 
            bgcolor: 'white',
            border: `1px solid ${bg}`
          }} />
        )}
      </Box>
    );
  };

  const calendar = [];
  
  // Previous month days
  for (let i = firstDay === 0 ? 6 : firstDay - 1; i > 0; i--) {
    calendar.push({ day: prevMonthDays - i + 1, isCurrentMonth: false });
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendar.push({ day: i, isCurrentMonth: true });
  }
  
  // Next month days to fill the grid
  const remainingDays = 42 - calendar.length;
  for (let i = 1; i <= remainingDays; i++) {
    calendar.push({ day: i, isCurrentMonth: false });
  }

  // Allow external control of selected day (via Date)
  const selectedDayUsed = (selectedDateExternal && Object.prototype.toString.call(selectedDateExternal) === '[object Date]') ? selectedDateExternal.getDate() : selectedDay;
  
  return (
    <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton size="small" onClick={handlePrevMonth}><svg style={{ width: 18, height: 18 }} viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" /></svg></IconButton>
          <Typography variant="h6" fontWeight={700}>{monthNames[currentMonth]} {currentYear}</Typography>
          <IconButton size="small" onClick={handleNextMonth}><svg style={{ width: 18, height: 18 }} viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg></IconButton>
        </Box>
        <Box />
      </Box>
      
      <Grid container spacing={1} sx={{ textAlign: 'center', mb: 2 }}>
        {calendar.map((item, idx) => (
          <Grid item xs={12/7} key={idx}>
            {renderDay(item.day, item.isCurrentMonth)}
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1, flex: '0 0 auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, bgcolor: '#10b981', borderRadius: '4px' }} />
          <Typography variant="caption">Επιβεβαιωμένα Ραντεβού</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, bgcolor: '#0ea5e9', borderRadius: '4px' }} />
          <Typography variant="caption">Ολοκληρωμένα</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, bgcolor: '#f59e0b', borderRadius: '4px' }} />
          <Typography variant="caption">Σε Αναμονή</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, bgcolor: '#ef4444', borderRadius: '4px' }} />
          <Typography variant="caption">Ακυρωμένα</Typography>
        </Box>
      </Box>


    </Paper>
  );
};

const PetCard = ({ pet, navigate, onEdit, onDelete, onViewDetails }) => (
  <Paper 
    elevation={0}
    sx={{ 
      p: 3,
      borderRadius: 3,
      border: '1px solid #e0e0e0',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        borderColor: '#1976d2'
      }
    }}
  >
    {/* Decorative gradient bar */}
    <Box sx={{ 
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 4,
      background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)'
    }} />

    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
      <Avatar 
        src={pet.img} 
        sx={{ 
          width: 80, 
          height: 80,
          border: '3px solid #e3f2fd',
          boxShadow: '0 4px 12px rgba(25,118,210,0.15)'
        }}
      >
        {!pet.img && <PetsIcon sx={{ fontSize: 40, color: '#1976d2' }} />}
      </Avatar>
      
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography 
          variant="h6" 
          fontWeight={700}
          sx={{ 
            color: '#1e293b',
            mb: 0.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {pet.name}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {pet.breed}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {pet.gender && (
            <Chip 
              icon={pet.gender === 'male' ? <MaleIcon /> : <FemaleIcon />}
              label={pet.gender === 'male' ? 'Αρσενικό' : 'Θηλυκό'}
              size="small"
              sx={{ 
                bgcolor: pet.gender === 'male' ? '#e3f2fd' : '#fce4ec',
                color: pet.gender === 'male' ? '#1976d2' : '#d81b60',
                fontWeight: 600,
                fontSize: '0.7rem'
              }}
            />
          )}
          {pet.age && (
            <Chip 
              icon={<CalendarTodayIcon sx={{ fontSize: 14 }} />}
              label={pet.age}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 600, fontSize: '0.7rem' }}
            />
          )}
          {pet.weight && (
            <Chip 
              label={pet.weight}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 600, fontSize: '0.7rem' }}
            />
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <IconButton 
          size="small" 
          onClick={() => onEdit(pet)}
          sx={{ 
            bgcolor: '#f5f5f5',
            '&:hover': { bgcolor: '#e3f2fd', color: '#1976d2' }
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton 
          size="small" 
          color="error" 
          onClick={() => onDelete(pet.id)}
          sx={{ 
            bgcolor: '#f5f5f5',
            '&:hover': { bgcolor: '#ffebee' }
          }}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>

    <Box sx={{ display: 'flex', gap: 1.5 }}>
      <Button 
        size="medium"
        variant="outlined" 
        fullWidth 
        onClick={() => navigate(`/owner/health-book/${pet.id}`)}
        sx={{ 
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 2,
          py: 1,
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            bgcolor: '#e3f2fd'
          }
        }}
      >
        Βιβλιάριο Υγείας
      </Button>
      <Button 
        size="medium"
        variant="contained" 
        fullWidth
        onClick={() => onViewDetails(pet)}
        sx={{ 
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 2,
          py: 1,
          bgcolor: '#1976d2',
          boxShadow: '0 2px 8px rgba(25,118,210,0.25)',
          '&:hover': {
            bgcolor: '#1565c0',
            boxShadow: '0 4px 12px rgba(25,118,210,0.35)'
          }
        }}
      >
        Λεπτομέρειες
      </Button>
    </Box>
  </Paper>
);export default function MyPets() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [pets, setPets] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', breed: '', gender: 'male', age: '', weight: '', img: '' });
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [petDetailsDialogOpen, setPetDetailsDialogOpen] = useState(false);
    const [selectedPet, setSelectedPet] = useState(null);
      const [apptTab, setApptTab] = useState(() => {
        try {
          const saved = localStorage.getItem('ownerApptTab');
          return saved || 'confirmed';
        } catch {
          return 'confirmed';
        }
      });
    const [calendarFilterDate, setCalendarFilterDate] = useState(null);

    // Using module-level helpers parseApptDate/isSameDay (declared above)

    const handleCalendarDaySelect = (day, month, year) => {
      const d = new Date(year, month, day);
      setCalendarFilterDate(d);
      // Focus the appointments view -- optional
      window.requestAnimationFrame(() => {
        const el = document.querySelector('#appointments-list');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    };
    useEffect(() => {
      try { localStorage.setItem('ownerApptTab', apptTab); } catch {}
    }, [apptTab]);

    useEffect(() => {
        const fetchPets = async () => {
            setError('');
            if (!user?.id) { 
                setLoading(false); 
                return; 
            }
            try {
                // Direct fetch to ensure data is retrieved
                const response = await fetch(`http://localhost:3001/pets?ownerId=${user.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setPets(data || []);
                } else {
                    throw new Error(`HTTP ${response.status}`);
                }
            } catch (e) {
                console.error('Error fetching pets:', e);
                setError('Σφάλμα φόρτωσης κατοικιδίων. Βεβαιώσου ότι τρέχει το json-server στο port 3001.');
            } finally {
                setLoading(false);
            }
        };
        fetchPets();
    }, [user]);

    // Fetch appointments
    useEffect(() => {
        const fetchAppointments = async () => {
            if (!user?.id) return;
            try {
                const response = await fetch(`http://localhost:3001/appointments?ownerId=${user.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setAppointments(data || []);
                }
            } catch (e) {
                console.error('Error fetching appointments:', e);
            }
        };
        fetchAppointments();
    }, [user]);

    //Addition of pets by users is disabled per policy (vet-only via national registry)
    const openEdit = (pet) => { setEditing(pet.id); setForm({ name: pet.name || '', breed: pet.breed || '', gender: (pet.gender || 'male'), age: pet.age || '', weight: pet.weight || '', img: pet.img || '' }); setDialogOpen(true); };
    const closeDialog = () => { setDialogOpen(false); setEditing(null); };

    const savePet = async () => {
        setError('');
        const payload = { ...form, ownerId: user.id };
        try {
            if (editing === 'new') {
                const created = await petsAPI.create(payload);
                setPets(prev => [created, ...prev]);
            } else {
                const updated = await petsAPI.update(editing, { ...payload, id: editing });
                setPets(prev => prev.map(p => p.id === updated.id ? updated : p));
            }
            closeDialog();
        } catch (e) {
            console.error(e);
            setError('Αποτυχία αποθήκευσης κατοικιδίου.');
        }
    };

    const deletePet = async (id) => {
        try {
            await petsAPI.delete(id);
            setPets(prev => prev.filter(p => p.id !== id));
        } catch (e) {
            console.error(e);
            setError('Αποτυχία διαγραφής.');
        }
    };

    // Appointment handlers
    const handleViewPetDetails = (pet) => {
        setSelectedPet(pet);
        setPetDetailsDialogOpen(true);
    };

    const handleViewDetails = (appointment) => {
        setSelectedAppointment(appointment);
        setDetailsDialogOpen(true);
    };

    const handleCancelAppointment = async (appointment) => {
        if (window.confirm('Είστε σίγουροι ότι θέλετε να ακυρώσετε το ραντεβού;')) {
            try {
                // Update appointment status to cancelled
                const response = await fetch(`http://localhost:3001/appointments/${appointment.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'cancelled' })
                });
                
                if (response.ok) {
                    // Update local state
                    setAppointments(prev => prev.map(a => 
                        a.id === appointment.id ? { ...a, status: 'cancelled' } : a
                    ));
                    alert('Το ραντεβού ακυρώθηκε επιτυχώς.');
                }
            } catch (error) {
                console.error('Error cancelling appointment:', error);
                alert('Σφάλμα κατά την ακύρωση του ραντεβού.');
            }
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
                {/* Page Header - stick to top */}
                <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e2e8f0', px: 2, position: 'sticky', top: 0, zIndex: 1200 }}>
                    <Container maxWidth="xl">
                        <PageHeader />
                    </Container>
                </Box>
                
                {/* Hero Section */}
                <Box sx={{ 
                    position: 'relative', 
                    height: 300,
                    backgroundImage: 'url(https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1600&q=80)',
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    overflow: 'hidden'
                }}>
                    {/* Gradient Overlay - Το πράσινο fade */}
                    <Box sx={{ 
                        position: 'absolute', 
                        inset: 0, 
                        background: 'linear-gradient(135deg, rgba(38, 50, 56, 0.9) 0%, rgba(0, 105, 92, 0.85) 100%)',
                        zIndex: 1
                    }} />
                    
                    {/* Content */}
                    <Typography variant="h3" sx={{ 
                        color: 'white', 
                        fontWeight: 800, 
                        zIndex: 2, 
                        textShadow: '2px 2px 4px rgba(0,0,0,0.3)' 
                    }}>
                        Κατοικίδια
                    </Typography>
                </Box>

                {/* Main Layout with Sidebar */}
                <Box sx={{ display: 'flex', flex: 1, maxWidth: '100vw', p: 2, gap: 2, justifyContent: 'center' }}>
                    {/* Sidebar */}
                    <Box sx={{ ml: 2, position: 'sticky', top: 16, alignSelf: 'flex-start', height: 'fit-content', flexShrink: 0 }}>
                        <DashboardSidebar />
                    </Box>

                    {/* Content */}
                    <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, pb: 6, ml: { xs: 0, md: 4 }, pl: { xs: 2, md: 4 } }}>
                        
                        {/* Pet Cards Section with Enhanced Header */}
                        <Box sx={{ mb: 4 }}>
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            mb: 3,
                            pb: 2,
                            borderBottom: '2px solid #e0e0e0'
                          }}>
                            <Box>
                              <Typography 
                                variant="h4" 
                                fontWeight={700}
                                sx={{ 
                                  color: '#1e293b',
                                  mb: 0.5,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1
                                }}
                              >
                                <PetsIcon sx={{ fontSize: 32, color: '#1976d2' }} />
                                Τα Κατοικίδιά Μου
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Διαχειριστείτε τα κατοικίδιά σας ({pets.length} {pets.length === 1 ? 'κατοικίδιο' : 'κατοικίδια'})
                              </Typography>
                            </Box>
                            {/*Add-pet action removed: pet registration is vet-only via national registry */}
                          </Box>

                          {loading ? (
                            <Grid container spacing={3}>
                              {[1, 2, 3].map((i) => (
                                <Grid item xs={12} sm={6} md={4} key={i}>
                                  <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 3 }} />
                                </Grid>
                              ))}
                            </Grid>
                          ) : pets.length === 0 ? (
                            <Paper 
                              elevation={0}
                              sx={{ 
                                p: 6, 
                                textAlign: 'center',
                                bgcolor: '#f8fafc',
                                border: '2px dashed #cbd5e1',
                                borderRadius: 3
                              }}
                            >
                              <PetsIcon sx={{ fontSize: 80, color: '#94a3b8', mb: 2 }} />
                              <Typography variant="h6" fontWeight={600} color="text.secondary" gutterBottom>
                                Δεν υπάρχουν κατοικίδια
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Η καταχώριση κατοικιδίου γίνεται αποκλειστικά από κτηνίατρο μέσω του Εθνικού Μητρώου Κατοικιδίων. Επικοινωνήστε με κτηνίατρο για την καταχώριση.
                              </Typography>
                              <Button 
                                variant="contained" 
                                size="large"
                                onClick={() => navigate('/owner/search')}
                                sx={{ 
                                  bgcolor: '#1976d2',
                                  textTransform: 'none',
                                  fontWeight: 600,
                                  px: 4
                                }}
                              >
                                Βρες Κτηνίατρο
                              </Button>
                            </Paper>
                          ) : (
                            <Grid container spacing={3}>
                              {pets.map(pet => (
                                <Grid item xs={12} sm={6} md={4} key={pet.id}>
                                  <PetCard pet={pet} navigate={navigate} onEdit={openEdit} onDelete={deletePet} onViewDetails={handleViewPetDetails} />
                                </Grid>
                              ))}
                            </Grid>
                          )}
                        </Box>

                        {/* Quick Actions */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="h6" fontWeight={700}>Γρήγορες Ενέργειες</Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <QuickActionCard 
                                icon={<SearchIcon sx={{ fontSize: 24, color: '#757575' }} />}
                                title="Βρες Κτηνίατρο"
                                onClick={() => navigate('/owner/search')}
                            />
                            <QuickActionCard 
                                icon={<CalendarTodayIcon sx={{ fontSize: 24, color: '#757575' }} />}
                                title="Εύρεση Ζώου"
                                onClick={() => navigate('/lost-pets')}
                            />
                            <QuickActionCard 
                                icon={<NotificationsIcon sx={{ fontSize: 24, color: '#757575' }} />}
                                title="Δήλωση Απώλειας"
                              onClick={() => navigate('/lost-pets?view=form')}
                            />
                        </Box>
                    </Box>

                    {/* Appointments with minimal tabs (calendar fixed width alongside appointments) */}
                    <Box sx={{ display: 'flex', gap: 3, alignItems: 'stretch', overflowX: 'auto', flexWrap: 'nowrap' }}>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ bgcolor: 'white', borderRadius: 3, border: '1px solid #e2e8f0', p: 2 }}>
                          {(() => {
                            const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
                            const completedCount = appointments.filter(a => a.status === 'completed').length;
                            const cancelledCount = appointments.filter(a => a.status === 'cancelled').length;
                            return (
                              <Tabs value={apptTab} onChange={(e, v) => setApptTab(v)} variant="fullWidth" sx={{ mb: 2 }}>
                                <Tab value="confirmed" label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><EventAvailableIcon sx={{ fontSize: 18, color: '#10b981' }} /><Typography variant="body2" fontWeight={700}>Επερχόμενα</Typography><Chip size="small" label={confirmedCount} /></Box>} />
                                <Tab value="completed" label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><DoneAllIcon sx={{ fontSize: 18, color: '#0ea5e9' }} /><Typography variant="body2" fontWeight={700} sx={{ color: '#0ea5e9' }}>Ολοκληρωμένα</Typography><Chip size="small" label={completedCount} sx={{ bgcolor: '#0ea5e9', color: '#fff' }} /></Box>} />
                                <Tab value="cancelled" label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><HighlightOffIcon sx={{ fontSize: 18, color: '#ef4444' }} /><Typography variant="body2" fontWeight={700} sx={{ color: '#ef4444' }}>Ακυρωμένα</Typography><Chip size="small" label={cancelledCount} sx={{ bgcolor: '#ef4444', color: '#fff' }} /></Box>} />
                              </Tabs>
                            );
                          })()}

                          {(() => {
                            const visible = calendarFilterDate ? appointments.filter(a => isSameDay(parseApptDate(a), calendarFilterDate)) : appointments.filter(a => a.status === apptTab);
                            return visible
                              .sort((a,b) => {
                                const ax = typeof a.id === 'number' ? a.id : 0;
                                const bx = typeof b.id === 'number' ? b.id : 0;
                                const ta = a.updatedAt ? Date.parse(a.updatedAt) : ax;
                                const tb = b.updatedAt ? Date.parse(b.updatedAt) : bx;
                                return tb - ta; // newest first
                              })
                              .slice(0,5)
                              .map(app => (
                                <AppointmentCard
                                  key={app.id}
                                  appointment={app}
                                  onViewDetails={handleViewDetails}
                                  onCancel={handleCancelAppointment}
                                />
                              ));
                          })()}

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, alignItems: 'center', gap: 1 }}>
                            <Box>
                              {calendarFilterDate ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="caption" color="text.secondary">Φιλτραρισμένα ραντεβού για:</Typography>
                                  <Typography variant="caption" fontWeight={700}>{calendarFilterDate.toLocaleDateString('el-GR')}</Typography>
                                  <Button size="small" onClick={() => setCalendarFilterDate(null)} sx={{ ml: 1 }}>Επαναφορά</Button>
                                </Box>
                              ) : (
                                <Typography variant="caption" color="text.secondary">Εμφανίζονται τα 5 πιο πρόσφατα.</Typography>
                              )}
                            </Box>
                            <Button variant="text" size="small" onClick={() => navigate('/owner/history')} sx={{ textTransform: 'none', fontSize: '0.75rem', px: 0.5 }}>
                              Δείτε όλα στο Ιστορικό
                            </Button>
                          </Box>
                          {appointments.filter(a => a.status === apptTab).length === 0 && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', py: 4 }}>
                              Δεν υπάρχουν ραντεβού σε αυτήν την κατηγορία.
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      <Box sx={{ width: 360, flexShrink: 0 }}>
                        <Box sx={{ position: 'sticky', top: 120, display: 'flex', flexDirection: 'column', height: '100%', bgcolor: 'white', borderRadius: 3, border: '1px solid #e2e8f0', p: 2, alignSelf: 'flex-start', boxShadow: 2 }}>
                          <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>Ημερολόγιο</Typography>
                          <CalendarWidget appointments={appointments} selectedDateExternal={calendarFilterDate} onDaySelect={handleCalendarDaySelect} />
                        </Box>
                      </Box>
                    </Box>

                    {/* Add/Edit Dialog */}
                    <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
                        <DialogTitle>{editing === 'new' ? 'Προσθήκη Κατοικιδίου' : 'Επεξεργασία Κατοικιδίου'}</DialogTitle>
                        <DialogContent dividers>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}><TextField label="Όνομα" fullWidth value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Grid>
                                <Grid item xs={12} sm={6}><TextField label="Φυλή" fullWidth value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })} /></Grid>
                                <Grid item xs={12} sm={6}><TextField label="Φύλο (male/female)" fullWidth value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} /></Grid>
                                <Grid item xs={12} sm={6}><TextField label="Ηλικία" fullWidth value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} /></Grid>
                                <Grid item xs={12} sm={6}><TextField label="Βάρος" fullWidth value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} /></Grid>
                                <Grid item xs={12}><TextField label="Εικόνα (URL)" fullWidth value={form.img} onChange={(e) => setForm({ ...form, img: e.target.value })} /></Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={closeDialog}>Άκυρο</Button>
                            <Button variant="contained" onClick={savePet}>Αποθήκευση</Button>
                        </DialogActions>
                    </Dialog>

                    {/* Appointment Details Dialog */}
                    <Dialog open={detailsDialogOpen} onClose={() => setDetailsDialogOpen(false)} maxWidth="sm" fullWidth>
                        <DialogTitle>Λεπτομέρειες Ραντεβού</DialogTitle>
                        <DialogContent dividers>
                            {selectedAppointment && (
                                <Box>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        <strong>Κτηνίατρος:</strong> {selectedAppointment.vetName || 'Δεν καθορίστηκε'}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        <strong>Κατοικίδιο:</strong> {selectedAppointment.petName || 'Δεν καθορίστηκε'}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        <strong>Ημερομηνία:</strong> {selectedAppointment.date || 'Δεν καθορίστηκε'}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        <strong>Ώρα:</strong> {selectedAppointment.time || 'Δεν καθορίστηκε'}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        <strong>Κατάσταση:</strong>{' '}
                                        <Chip 
                                          label={selectedAppointment.status === 'confirmed' ? 'Επιβεβαιωμένο' : selectedAppointment.status === 'completed' ? 'Ολοκληρωμένο' : 'Ακυρωμένο'}
                                          color={selectedAppointment.status === 'confirmed' ? 'success' : selectedAppointment.status === 'completed' ? 'info' : 'error'}
                                          size="small"
                                        />
                                    </Typography>
                                    {selectedAppointment.diagnosis && (
                                      <Typography variant="body2" sx={{ mb: 2 }}>
                                        <strong>Διάγνωση:</strong> {selectedAppointment.diagnosis}
                                      </Typography>
                                    )}
                                    {selectedAppointment.treatment && (
                                      <Typography variant="body2" sx={{ mb: 2 }}>
                                        <strong>Θεραπεία:</strong> {selectedAppointment.treatment}
                                      </Typography>
                                    )}
                                    {selectedAppointment.nextVisit && (
                                      <Typography variant="body2" sx={{ mb: 2 }}>
                                        <strong>Επόμενη Επίσκεψη:</strong> {selectedAppointment.nextVisit}
                                      </Typography>
                                    )}
                                    {selectedAppointment.note && (
                                      <Typography variant="body2" sx={{ mb: 2 }}>
                                        <strong>Σημειώσεις:</strong> {selectedAppointment.note}
                                      </Typography>
                                    )}
                                    {selectedAppointment.cancelReason && (
                                      <Typography variant="body2" sx={{ mb: 2 }}>
                                        <strong>Λόγος Ακύρωσης:</strong> {selectedAppointment.cancelReason}
                                      </Typography>
                                    )}
                                    {selectedAppointment.type && (
                                        <Typography variant="body1" sx={{ mb: 2 }}>
                                            <strong>Τύπος:</strong> {selectedAppointment.type}
                                        </Typography>
                                    )}
                                </Box>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDetailsDialogOpen(false)}>Κλείσιμο</Button>
                        </DialogActions>
                    </Dialog>

                    {/* Pet Details Dialog */}
                    <Dialog open={petDetailsDialogOpen} onClose={() => setPetDetailsDialogOpen(false)} maxWidth="sm" fullWidth>
                        <DialogTitle>Λεπτομέρειες Κατοικιδίου</DialogTitle>
                        <DialogContent dividers>
                            {selectedPet && (
                                <Box>
                                    {selectedPet.img && (
                                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                                            <Avatar 
                                                src={selectedPet.img} 
                                                sx={{ 
                                                    width: 120, 
                                                    height: 120,
                                                    margin: '0 auto',
                                                    border: '3px solid #e3f2fd',
                                                    boxShadow: '0 4px 12px rgba(25,118,210,0.15)'
                                                }}
                                            >
                                                <PetsIcon sx={{ fontSize: 60, color: '#1976d2' }} />
                                            </Avatar>
                                        </Box>
                                    )}
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        <strong>Όνομα:</strong> {selectedPet.name}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        <strong>Φυλή:</strong> {selectedPet.breed || 'Δεν καθορίστηκε'}
                                    </Typography>
                                    {selectedPet.type && (
                                        <Typography variant="body1" sx={{ mb: 2 }}>
                                            <strong>Τύπος:</strong> {selectedPet.type === 'dog' ? 'Σκύλος' : selectedPet.type === 'cat' ? 'Γάτα' : selectedPet.type}
                                        </Typography>
                                    )}
                                    {selectedPet.gender && (
                                        <Typography variant="body1" sx={{ mb: 2 }}>
                                            <strong>Φύλο:</strong>{' '}
                                            <Chip 
                                                icon={selectedPet.gender === 'male' ? <MaleIcon /> : <FemaleIcon />}
                                                label={selectedPet.gender === 'male' ? 'Αρσενικό' : 'Θηλυκό'}
                                                size="small"
                                                sx={{ 
                                                    bgcolor: selectedPet.gender === 'male' ? '#e3f2fd' : '#fce4ec',
                                                    color: selectedPet.gender === 'male' ? '#1976d2' : '#d81b60',
                                                    fontWeight: 600
                                                }}
                                            />
                                        </Typography>
                                    )}
                                    {selectedPet.age && (
                                        <Typography variant="body1" sx={{ mb: 2 }}>
                                            <strong>Ηλικία:</strong> {selectedPet.age}
                                        </Typography>
                                    )}
                                    {selectedPet.weight && (
                                        <Typography variant="body1" sx={{ mb: 2 }}>
                                            <strong>Βάρος:</strong> {selectedPet.weight}
                                        </Typography>
                                    )}
                                    {selectedPet.microchip && (
                                        <Typography variant="body1" sx={{ mb: 2 }}>
                                            <strong>Microchip:</strong> {selectedPet.microchip}
                                        </Typography>
                                    )}
                                    {selectedPet.birthDate && (
                                        <Typography variant="body1" sx={{ mb: 2 }}>
                                            <strong>Ημερομηνία Γέννησης:</strong> {selectedPet.birthDate}
                                        </Typography>
                                    )}
                                </Box>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setPetDetailsDialogOpen(false)}>Κλείσιμο</Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </Box>
        </Box>
        </ThemeProvider>
    );
}