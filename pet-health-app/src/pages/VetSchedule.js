import React, { useState, useMemo } from 'react';
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
import LocationOnIcon from '@mui/icons-material/LocationOn';

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
const CalendarWidget = () => {
  const [currentMonth, setCurrentMonth] = React.useState(10); // November (0-indexed)
  const [currentYear, setCurrentYear] = React.useState(2025);
  const [selectedDay, setSelectedDay] = React.useState(17);
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
        { time: '10:00', doctor: 'Δρ. Νίκος Παπαδόπουλος', pet: 'Max', reason: 'Εμβολιασμός', location: 'Αθήνα, Κέντρο' }
      ]
    },
    18: { 
      type: 'confirmed', 
      count: 2,
      details: [
        { time: '09:30', doctor: 'Δρ. Μαρία Κωνσταντίνου', pet: 'Bella', reason: 'Τακτικός Έλεγχος', location: 'Καλλιθέα' },
        { time: '14:00', doctor: 'Δρ. Γιάννης Γεωργίου', pet: 'Charlie', reason: 'Επανεξέταση', location: 'Αθήνα, Κέντρο' }
      ]
    },
    20: { 
      type: 'pending', 
      count: 1,
      details: [
        { time: '11:00', doctor: 'Δρ. Ελένη Παπαδάκη', pet: 'Lucy', reason: 'Καθαρισμός Δοντιών', location: 'Γλυφάδα' }
      ]
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
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
      border = '2px solid #00695c';
    }

    const isToday = isCurrentMonth && day === 17 && currentMonth === 10 && currentYear === 2025;
    
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
        <IconButton size="small" onClick={handlePrevMonth}><ChevronLeftIcon /></IconButton>
        <Typography variant="h6" fontWeight={700} sx={{ minWidth: 200, textAlign: 'center' }}>{monthNames[currentMonth]} {currentYear}</Typography>
        <IconButton size="small" onClick={handleNextMonth}><ChevronRightIcon /></IconButton>
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
                  <Paper key={idx} sx={{ p: 1.5, mb: 1.5, bgcolor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="caption" sx={{ 
                        bgcolor: 'white', 
                        color: colors.text, 
                        px: 1, py: 0.5, borderRadius: 0.5, fontWeight: 600 
                      }}>
                        {colors.badge}
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={700} sx={{ mt: 1, color: 'text.primary' }}>{apt.time}</Typography>
                    <Typography variant="caption" display="block" sx={{ mt: 0.5, color: 'text.secondary' }}>📋 {apt.doctor}</Typography>
                    <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>🐕 {apt.pet}</Typography>
                    {apt.location && <Typography variant="caption" display="block" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, color: 'text.secondary' }}>
                      <LocationOnIcon sx={{ fontSize: 14 }} /> {apt.location}
                    </Typography>}
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