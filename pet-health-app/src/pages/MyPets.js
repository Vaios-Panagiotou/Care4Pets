import React, { useEffect, useState } from 'react';
import {
  Box, Container, Grid, Typography, Button, Paper, Avatar, IconButton, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions, Chip, Skeleton
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardSidebar from '../components/DashboardSidebar';
import PageHeader from './PageHeader';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import PetsIcon from '@mui/icons-material/Pets';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';

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

const AppointmentCard = ({ date, time, doctor, pet, location, phone, status }) => (
  <Paper sx={{ p: 2, mb: 2, borderLeft: status === 'confirmed' ? '4px solid #10b981' : '4px solid #ef4444', bgcolor: 'white' }}>
    <Typography variant="caption" sx={{ 
      bgcolor: status === 'confirmed' ? '#d1fae5' : '#fee2e2',
      color: status === 'confirmed' ? '#065f46' : '#991b1b',
      px: 1, py: 0.5, borderRadius: 1, fontWeight: 600, fontSize: '0.7rem'
    }}>
      {status === 'confirmed' ? 'Επιβεβαιωμένο' : 'Ακυρωμένο'}
    </Typography>
    <Typography variant="body2" fontWeight={700} sx={{ mt: 1, color: 'text.primary' }}>{date} • {time}</Typography>
    <Typography variant="caption" display="block" sx={{ mt: 0.5, color: 'text.secondary' }}>📋 {doctor}</Typography>
    <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>🐕 {pet}</Typography>
    {location && <Typography variant="caption" display="block" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, color: 'text.secondary' }}>
      <LocationOnIcon sx={{ fontSize: 14 }} /> {location}
    </Typography>}
    {phone && <Typography variant="caption" display="block" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
      <PhoneIcon sx={{ fontSize: 14 }} /> {phone}
    </Typography>}
    <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
      <Button size="small" variant="outlined" sx={{ fontSize: '0.7rem' }}>Λεπτομέρειες</Button>
      {status === 'confirmed' && <Button size="small" variant="contained" sx={{ fontSize: '0.7rem', bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' } }}>Ακύρωση</Button>}
    </Box>
  </Paper>
);

const CalendarWidget = () => {
  const [currentMonth, setCurrentMonth] = React.useState(11); // December (0-indexed)
  const [currentYear, setCurrentYear] = React.useState(2025);
  const [selectedDay, setSelectedDay] = React.useState(14);
  const [hoveredDay, setHoveredDay] = React.useState(null);

  const days = ['Δε', 'Τρ', 'Τε', 'Πε', 'Πα', 'Σα', 'Κυ'];
  const monthNames = ['Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 'Μάιος', 'Ιούνιος', 
                      'Ιούλιος', 'Αύγουστος', 'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος'];
  
  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();
  
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const prevMonthDays = getDaysInMonth(currentMonth - 1, currentYear);
  
  // Appointments by day (example data with details)
  const appointments = {
    17: { 
      type: 'confirmed', 
      count: 1,
      details: [
        { time: '10:00', doctor: 'Δρ. Νίκος Παπαδόπουλος', pet: 'Kouvelaj', reason: 'Εμβολιασμός', location: 'Αθήνα, Κέντρο - Ακαδημίας 23' }
      ]
    },
    24: { 
      type: 'confirmed', 
      count: 2,
      details: [
        { time: '09:30', doctor: 'Δρ. Μαρία Κωνσταντίνου', pet: 'Pantiana', reason: 'Τακτικός Έλεγχος', location: 'Καλλιθέα' },
        { time: '14:00', doctor: 'Δρ. Γιάννης Γεωργίου', pet: 'Kouvelaj', reason: 'Επανεξέταση', location: 'Αθήνα, Κέντρο' }
      ]
    },
    26: { 
      type: 'pending', 
      count: 1,
      details: [
        { time: '11:00', doctor: 'Δρ. Ελένη Παπαδάκη', pet: 'Pantiana', reason: 'Καθαρισμός Δοντιών', location: 'Γλυφάδα' }
      ]
    },
    27: { 
      type: 'pending', 
      count: 1,
      details: [
        { time: '16:30', doctor: 'Δρ. Κώστας Αντωνίου', pet: 'Kouvelaj', reason: 'Εξέταση Αίματος', location: 'Νέα Σμύρνη' }
      ]
    },
    28: { 
      type: 'cancelled', 
      count: 1,
      details: [
        { time: '14:30', doctor: 'Δρ. Μαρία Κωνσταντίνου', pet: 'Pantiana', reason: 'Ετήσια Εξέταση', location: 'Καλλιθέα' }
      ]
    }
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  const renderDay = (day, isCurrentMonth = true) => {
    const appointment = isCurrentMonth ? appointments[day] : null;
    let bg = 'transparent', color = '#1e293b', border = 'none';
    
    if (appointment) {
      if (appointment.type === 'confirmed') { bg = '#10b981'; color = 'white'; }
      else if (appointment.type === 'pending') { bg = '#f59e0b'; color = 'white'; }
      else if (appointment.type === 'cancelled') { bg = '#ef4444'; color = 'white'; }
    }
    
    if (isCurrentMonth && day === selectedDay) {
      border = '2px solid #1976d2';
    }

    const isToday = isCurrentMonth && day === 14 && currentMonth === 11 && currentYear === 2025;
    
    return (
      <Box 
        onClick={() => isCurrentMonth && handleDayClick(day)}
        onMouseEnter={() => setHoveredDay(isCurrentMonth ? day : null)}
        onMouseLeave={() => setHoveredDay(null)}
        sx={{ 
          width: 48, 
          height: 48, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          bgcolor: bg, 
          color: isCurrentMonth ? color : '#bdbdbd', 
          borderRadius: '8px', 
          fontSize: '0.95rem',
          fontWeight: isToday ? 700 : 500,
          cursor: isCurrentMonth ? 'pointer' : 'default',
          border: border,
          position: 'relative',
          transition: 'all 0.2s ease',
          boxShadow: hoveredDay === day && isCurrentMonth ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
          transform: hoveredDay === day && isCurrentMonth ? 'scale(1.1)' : 'scale(1)',
          '&:hover': { 
            bgcolor: !appointment && isCurrentMonth ? '#e3f2fd' : bg,
            boxShadow: isCurrentMonth ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
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
  
  return (
    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={700}>{monthNames[currentMonth]} {currentYear}</Typography>
      </Box>
      
      <Grid container spacing={1} sx={{ textAlign: 'center', mb: 2 }}>
        {days.map(d => (
          <Grid item xs={12/7} key={d}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>{d}</Typography>
          </Grid>
        ))}
      </Grid>
      
      <Grid container spacing={1} sx={{ textAlign: 'center' }}>
        {calendar.map((item, idx) => (
          <Grid item xs={12/7} key={idx}>
            {renderDay(item.day, item.isCurrentMonth)}
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 16, height: 16, bgcolor: '#10b981', borderRadius: '4px' }} />
          <Typography variant="caption">Επιβεβαιωμένα Ραντεβού</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 16, height: 16, bgcolor: '#f59e0b', borderRadius: '4px' }} />
          <Typography variant="caption">Σε Αναμονή</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 16, height: 16, bgcolor: '#ef4444', borderRadius: '4px' }} />
          <Typography variant="caption">Ακυρωμένα</Typography>
        </Box>
      </Box>

      {selectedDay && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ p: 2, bgcolor: '#dbeafe', borderRadius: 2, border: '1px solid #93c5fd', mb: 2 }}>
            <Typography variant="body2" fontWeight={600} color="primary">
              {selectedDay} {monthNames[currentMonth]} {currentYear}
            </Typography>
            {appointments[selectedDay] ? (
              <Typography variant="caption" display="block" sx={{ mt: 0.5, color: 'text.primary' }}>
                {appointments[selectedDay].count} ραντεβού
              </Typography>
            ) : (
              <Typography variant="caption" display="block" sx={{ mt: 0.5, color: 'text.secondary' }}>
                Δεν υπάρχουν ραντεβού
              </Typography>
            )}
          </Box>
          
          {appointments[selectedDay] && appointments[selectedDay].details && (
            <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
              {appointments[selectedDay].details.map((apt, idx) => {
                const statusColors = {
                  confirmed: { bg: '#d1fae5', border: '#10b981', text: '#065f46', badge: 'Επιβεβαιωμένο' },
                  pending: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e', badge: 'Σε Αναμονή' },
                  cancelled: { bg: '#fee2e2', border: '#ef4444', text: '#991b1b', badge: 'Ακυρωμένο' }
                };
                const colors = statusColors[appointments[selectedDay].type];
                
                return (
                  <Paper key={idx} sx={{ p: 1.5, mb: 1.5, bgcolor: colors.bg, border: `1px solid ${colors.border}` }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="caption" sx={{ 
                        bgcolor: 'white', 
                        color: colors.text, 
                        px: 1, 
                        py: 0.3, 
                        borderRadius: 1, 
                        fontWeight: 600,
                        fontSize: '0.65rem'
                      }}>
                        {colors.badge}
                      </Typography>
                      <Typography variant="caption" fontWeight={700} sx={{ color: colors.text }}>
                        {apt.time}
                      </Typography>
                    </Box>
                    
                    <Typography variant="caption" display="block" fontWeight={600} sx={{ color: 'text.primary', mb: 0.5 }}>
                      🐕 {apt.pet}
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ color: 'text.secondary', mb: 0.3 }}>
                      📋 {apt.doctor}
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ color: 'text.secondary', mb: 0.3 }}>
                      💊 {apt.reason}
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationOnIcon sx={{ fontSize: 12 }} /> {apt.location}
                    </Typography>
                  </Paper>
                );
              })}
            </Box>
          )}
        </Box>
      )}
    </Paper>
  );
};

const PetCard = ({ pet, navigate, onEdit, onDelete }) => (
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', breed: '', gender: 'male', age: '', weight: '', img: '' });

    // Mock appointments
    const appointments = [
        { id: 1, date: 'Τρίτη, 17 Νοεμβρίου 2025', time: '10:00', doctor: 'Δρ. Νίκος Παπαδόπουλος', pet: 'Kouvelaj - Εμβολιασμός', location: 'Αθήνα, Κέντρο - Ακαδημίας 23', phone: '+30 210 1234567', status: 'confirmed' },
        { id: 2, date: 'Τετάρτη, 28 Νοεμβρίου 2025', time: '14:30', doctor: 'Δρ. Μαρία Κωνσταντίνου', pet: 'Pantiana - Ετήσια Εξέταση', location: 'Καλλιθέα', phone: '+30 210 7654321', status: 'cancelled' }
    ];

    useEffect(() => {
        const fetchPets = async () => {
            setError('');
            if (!user?.id) { setLoading(false); return; }
            try {
                const res = await fetch(`http://localhost:3001/pets?ownerId=${user.id}`);
                const data = await res.json();
                setPets(data || []);
            } catch (e) {
                setError('Σφάλμα φόρτωσης κατοικιδίων. Βεβαιώσου ότι τρέχει το json-server.');
            } finally {
                setLoading(false);
            }
        };
        fetchPets();
    }, [user]);

    const openAdd = () => { setEditing('new'); setForm({ name: '', breed: '', gender: 'male', age: '', weight: '', img: '' }); setDialogOpen(true); };
    const openEdit = (pet) => { setEditing(pet.id); setForm({ name: pet.name || '', breed: pet.breed || '', gender: (pet.gender || 'male'), age: pet.age || '', weight: pet.weight || '', img: pet.img || '' }); setDialogOpen(true); };
    const closeDialog = () => { setDialogOpen(false); setEditing(null); };

    const savePet = async () => {
        setError('');
        const payload = { ...form, ownerId: user.id };
        try {
            if (editing === 'new') {
                const res = await fetch('http://localhost:3001/pets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                const created = await res.json();
                setPets(prev => [created, ...prev]);
            } else {
                const res = await fetch(`http://localhost:3001/pets/${editing}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                const updated = await res.json();
                setPets(prev => prev.map(p => p.id === updated.id ? updated : p));
            }
            closeDialog();
        } catch (e) { setError('Αποτυχία αποθήκευσης κατοικιδίου.'); }
    };

    const deletePet = async (id) => {
        try { await fetch(`http://localhost:3001/pets/${id}`, { method: 'DELETE' }); setPets(prev => prev.filter(p => p.id !== id)); }
        catch { setError('Αποτυχία διαγραφής.'); }
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
                    position: 'relative', height: 300,
                    backgroundImage: 'url(https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1600&q=80)',
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.4)' }} />
                    <Typography variant="h3" sx={{ color: 'white', fontWeight: 800, zIndex: 1, textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>Κατοικίδια</Typography>
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
                            <Button 
                              variant="contained" 
                              size="large"
                              startIcon={<AddIcon />} 
                              onClick={openAdd}
                              sx={{
                                bgcolor: '#1976d2',
                                textTransform: 'none',
                                fontWeight: 600,
                                px: 3,
                                py: 1.5,
                                borderRadius: 2,
                                boxShadow: '0 4px 12px rgba(25,118,210,0.3)',
                                '&:hover': {
                                  bgcolor: '#1565c0',
                                  boxShadow: '0 6px 16px rgba(25,118,210,0.4)',
                                  transform: 'translateY(-2px)'
                                },
                                transition: 'all 0.2s'
                              }}
                            >
                              Προσθήκη
                            </Button>
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
                                Ξεκινήστε προσθέτοντας το πρώτο σας κατοικίδιο
                              </Typography>
                              <Button 
                                variant="contained" 
                                size="large"
                                startIcon={<AddIcon />}
                                onClick={openAdd}
                                sx={{ 
                                  bgcolor: '#1976d2',
                                  textTransform: 'none',
                                  fontWeight: 600,
                                  px: 4
                                }}
                              >
                                Προσθήκη Πρώτου Κατοικιδίου
                              </Button>
                            </Paper>
                          ) : (
                            <Grid container spacing={3}>
                              {pets.map(pet => (
                                <Grid item xs={12} sm={6} md={4} key={pet.id}>
                                  <PetCard pet={pet} navigate={navigate} onEdit={openEdit} onDelete={deletePet} />
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
                                onClick={() => navigate('/lost-pets')}
                            />
                        </Box>
                    </Box>

                    {/* Main Grid: Appointments & Calendar */}
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            <Box sx={{ display: 'flex', gap: 3 }}>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Επερχόμενα Ραντεβού</Typography>
                                    {appointments.filter(a => a.status === 'confirmed').map(app => (
                                        <AppointmentCard key={app.id} {...app} />
                                    ))}
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Ακυρωμένα</Typography>
                                    {appointments.filter(a => a.status === 'cancelled').map(app => (
                                        <AppointmentCard key={app.id} {...app} />
                                    ))}
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Ημερολόγιο</Typography>
                            <CalendarWidget />
                        </Grid>
                    </Grid>

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
                </Container>
            </Box>
        </Box>
        </ThemeProvider>
    );
}