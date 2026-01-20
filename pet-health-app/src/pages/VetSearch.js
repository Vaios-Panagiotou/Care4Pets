import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { 
  Box, Container, Grid, Typography, Button, Paper, Avatar, Chip, IconButton, 
  Divider, Pagination, TextField, Radio, RadioGroup, FormControlLabel, FormControl,
  Dialog, DialogContent, Checkbox, Alert, Tooltip, InputAdornment, MenuItem
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { keyframes } from '@mui/system';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Εικονίδια
import StarIcon from '@mui/icons-material/Star';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewListIcon from '@mui/icons-material/ViewList';
import GridViewIcon from '@mui/icons-material/GridView';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import GoogleIcon from '@mui/icons-material/Google';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ClearIcon from '@mui/icons-material/Clear';

// Εισαγωγή Header
import PageHeader from './PageHeader';
import DashboardSidebar from '../components/DashboardSidebar';
import { appointmentsAPI, vetsAPI, usersAPI } from '../services/api';

const theme = createTheme({
  palette: {
    primary: { main: '#00695c' },
    secondary: { main: '#FFA726' },
    success: { main: '#00C853' },
    error: { main: '#D50000' },
    text: { primary: '#333', secondary: '#666' },
    background: { default: '#f9f9f9' }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    button: { textTransform: 'none', fontWeight: 600 },
    h6: { fontWeight: 700 }
  },
  shape: { borderRadius: 8 }
});

// Mock κτηνίατροι (εφεδρικά αν ο server αποτύχει)
const FALLBACK_VETS = [
  { id: 1, name: 'Δρ. Ιωάννης Σμυρνής', address: 'Πανεπιστημίου 16 - Αθήνα', specialty: 'Παθολογία Ζώων', availability: 'Παρ, 24 Ιαν 2025', views: 1873, rating: 4.9, likes: 280, price: 50, image: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: 2, name: 'Δρ. Ελένη Καρρά', address: 'Λεωφόρος Βουλιαγμένης 289', specialty: 'Κτηνιατρική Καρδιολογία', availability: 'Πεμ, 30 Ιαν 2025', views: 732, rating: 4.8, likes: 130, price: 30, image: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: 3, name: 'Δρ. Γιώργος Παπαδόπουλος', address: 'Ερμού 45 - Θεσσαλονίκη', specialty: 'Ορθοπεδική', availability: 'Δευ, 27 Ιαν 2025', views: 540, rating: 4.7, likes: 210, price: 45, image: 'https://randomuser.me/api/portraits/men/45.jpg' },
  { id: 4, name: 'Δρ. Μαρία Δημητρίου', address: 'Τσιμισκή 12 - Θεσσαλονίκη', specialty: 'Δερματολογία', availability: 'Τρι, 28 Ιαν 2025', views: 890, rating: 4.9, likes: 340, price: 60, image: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { id: 5, name: 'Δρ. Κώστας Νικολάου', address: 'Πατησίων 100 - Αθήνα', specialty: 'Χειρουργική', availability: 'Τετ, 29 Ιαν 2025', views: 620, rating: 4.6, likes: 180, price: 55, image: 'https://randomuser.me/api/portraits/men/22.jpg' },
];

const STEPS = ['Επιλογή Κτηνιάτρου', 'Επιλογή Ώρας/Μέρας', 'Επιλογή Κατοικιδίου', 'Προεπισκόπηση'];
const TIME_SLOTS = ['09:00', '10:00', '11:30', '13:00', '17:00', '18:30', '19:45'];

const pulseRing = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0,105,92,0.25); }
  70% { box-shadow: 0 0 0 12px rgba(0,105,92,0); }
  100% { box-shadow: 0 0 0 0 rgba(0,105,92,0); }
`;

const floatCard = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
  100% { transform: translateY(0); }
`;

const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(6px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const bump = keyframes`
  0% { transform: scale(0.98); }
  60% { transform: scale(1.02); }
  100% { transform: scale(1); }
`;

export default function VetSearch() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const allowFindWithoutPet = searchParams.get('find') === '1';
  const { user } = useAuth();
  const [hasPets, setHasPets] = useState(true);
  const userLabel = user?.name || user?.fullName || user?.email || 'τον λογαριασμό σας';
  // Δεδομένα κτηνιάτρων (server + προερχόμενοι από users + εφεδρικά)
  const [allVets, setAllVets] = useState([]);
  const [vetUsers, setVetUsers] = useState([]);
  const [vetsLoaded, setVetsLoaded] = useState(false);
  
  // Pet management state
  const [userPets, setUserPets] = useState([]);
  const [showNewPetForm, setShowNewPetForm] = useState(false);
  const [newPetForm, setNewPetForm] = useState({
    name: '',
    type: 'dog',
    breed: '',
    gender: 'male',
    age: '',
    weight: '',
    color: ''
  });
  
  // Φόρτωση κατοικιδίων χρήστη από βάση
  useEffect(() => {
    const loadUserPets = async () => {
      if (!user?.id) return;
      try {
        const response = await fetch(`http://localhost:3001/pets?ownerId=${user.id}`);
        if (response.ok) {
          const pets = await response.json();
          setUserPets(pets);
          setHasPets(pets.length > 0);
        }
      } catch (error) {
        console.error('Error loading pets:', error);
        setHasPets(true);
      }
    };
    loadUserPets();
  }, [user]);
  
  const [activeStep, setActiveStep] = useState(0);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [searchInput, setSearchInput] = useState(queryParam);
  const searchRef = useRef(null);
  const reasonRef = useRef(null);
  const [calendarDate, setCalendarDate] = useState(() => new Date());
  const todayRef = useMemo(() => new Date(), []);
  
  // Selection State
  const [selectedVet, setSelectedVet] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [unavailableTimes, setUnavailableTimes] = useState([]);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [availabilityError, setAvailabilityError] = useState('');
  const REGISTRATION_REASON = 'Καταχώριση Κατοικιδίου';
  const [appointmentReason, setAppointmentReason] = useState('');
  const [registerAppointment, setRegisterAppointment] = useState(false);
  // Details & notes (user-selectable options)
  const [selectedDetails, setSelectedDetails] = useState([]);
  const [detailNotes, setDetailNotes] = useState({});
  const detailRefs = useRef({});
  // Single-select details: selecting a chip selects only that option; selecting again clears it
  const toggleDetail = (key) => setSelectedDetails(prev => {
    if (prev.length === 1 && prev[0] === key) {
      if (key === 'new-record') {
        setRegisterAppointment(false);
        if (appointmentReason === REGISTRATION_REASON) setAppointmentReason('');
      }
      setDetailNotes(d => { const c = { ...d }; delete c[key]; return c; });
      return [];
    }
    if (key === 'new-record') {
      setRegisterAppointment(true);
      setSelectedPet(null);
      if (!appointmentReason) setAppointmentReason(REGISTRATION_REASON);
    } else {
      setRegisterAppointment(false);
      if (appointmentReason === REGISTRATION_REASON) setAppointmentReason('');
    }
    return [key];
  });
  const [detailError, setDetailError] = useState(false);

  // Restore progress if coming from auth
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('vetSearchProgress');
      if (raw) {
        const p = JSON.parse(raw);
        if (p) {
          if (p.searchQuery) { setSearchQuery(p.searchQuery); setSearchInput(p.searchQuery); }
          if (p.selectedVet) { setSelectedVet(p.selectedVet); }
          if (p.selectedDate) { setSelectedDate(p.selectedDate); }
          if (p.selectedTime) { setSelectedTime(p.selectedTime); }
          if (typeof p.registerAppointment === 'boolean') { setRegisterAppointment(p.registerAppointment); }
          if (p.reason) { setAppointmentReason(p.reason); }
          if (p.details) { setSelectedDetails(Array.isArray(p.details) ? p.details : []); }
          if (p.detailNotes) { setDetailNotes(p.detailNotes); }
          if (p.selectedPet) { setSelectedPet(p.selectedPet); }
          if (typeof p.step === 'number') { setActiveStep(Math.min(Math.max(p.step, 0), STEPS.length - 1)); }
        }
        sessionStorage.removeItem('vetSearchProgress');
      }
    } catch (_) {}
  }, []);

  // Load time availability for selected vet + date
  useEffect(() => {
    let mounted = true;
    const loadAvailability = async () => {
      if (!selectedVet || !selectedDate) {
        if (mounted) {
          setUnavailableTimes([]);
          setLoadingTimes(false);
          setAvailabilityError('');
        }
        return;
      }
      setLoadingTimes(true);
      setAvailabilityError('');
      try {
        const data = await appointmentsAPI.getAll();
        const list = Array.isArray(data) ? data : [];
        const vetId = String(selectedVet.id || '');
        const vetUserId = String(selectedVet.userId || '');
        const vetEmail = (selectedVet.email || selectedVet.userEmail || '').toLowerCase();
        const vetName = (selectedVet.name || '').toLowerCase();
        const booked = list.filter(a => (
          (String(a.vetId || '') === vetId) ||
          (vetUserId && String(a.vetUserId || '') === vetUserId) ||
          (vetEmail && (a.vetEmail || '').toLowerCase() === vetEmail) ||
          (vetName && (a.vetName || '').toLowerCase() === vetName)
        ) &&
          String(a.date || '') === String(selectedDate || '') &&
          String(a.status || '').toLowerCase() !== 'cancelled'
        );
        const times = Array.from(new Set(booked.map(a => String(a.time || '')).filter(Boolean)));
        if (mounted) setUnavailableTimes(times);
      } catch (e) {
        console.warn('Αδυναμία ελέγχου διαθεσιμότητας.', e);
        if (mounted) {
          setUnavailableTimes([]);
          setAvailabilityError('Δεν ήταν δυνατός ο έλεγχος διαθεσιμότητας.');
        }
      } finally {
        if (mounted) setLoadingTimes(false);
      }
    };
    loadAvailability();
    return () => { mounted = false; };
  }, [selectedVet, selectedDate]);

  // Clear selected time if it became unavailable
  useEffect(() => {
    if (selectedTime && unavailableTimes.includes(selectedTime)) {
      setSelectedTime(null);
    }
  }, [selectedTime, unavailableTimes]);
  
  // Reason change handler
  const handleReasonChange = (e) => {
    setAppointmentReason(e.target.value);
  };
  
  // Pagination State
  const [page, setPage] = useState(1);
  const vetsPerPage = 3;
  // Filters & View State (declare before effects that use them)
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'
  // specialties/cities derived later after building sourceVets
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100);
  // Initialize from URL once (shareable filters/state)
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const cityParam = searchParams.get('city') || '';
    const specParam = searchParams.get('spec') || '';
    const ratingParam = Number(searchParams.get('rating') || 0);
    const priceParam = Number(searchParams.get('price') || 100);
    const pageParam = Number(searchParams.get('page') || 1);
    const viewParam = searchParams.get('view') || 'list';
    setSearchInput(q);
    setSearchQuery(q);
    setSelectedCities(cityParam ? cityParam.split(',').filter(Boolean) : []);
    setSelectedSpecialties(specParam ? specParam.split(',').filter(Boolean) : []);
    setMinRating(!isNaN(ratingParam) ? ratingParam : 0);
    setMaxPrice(!isNaN(priceParam) ? priceParam : 100);
    setPage(!isNaN(pageParam) && pageParam > 0 ? pageParam : 1);
    setViewMode(viewParam === 'grid' ? 'grid' : 'list');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load vets from server
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await vetsAPI.getAll();
        if (mounted) {
          setAllVets(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        console.warn('Falling back to mock vets; failed to load from server.', e);
        if (mounted) setAllVets([]); // will use FALLBACK_VETS below
      } finally {
        if (mounted) setVetsLoaded(true);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Load users with role vet to ensure registered vets appear too
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const users = await usersAPI.getAll();
        const vetsOnly = Array.isArray(users) ? users.filter(u => (u.role === 'vet')) : [];
        if (mounted) setVetUsers(vetsOnly);
      } catch (e) {
        console.warn('Could not load users to derive vets.', e);
        if (mounted) setVetUsers([]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Build combined vet source: fallback + server vets + derived from users (no duplicate userId)
  const sourceVets = useMemo(() => {
    const dbVets = Array.isArray(allVets) ? allVets : [];
    const byUserId = new Set(dbVets.map(v => String(v.userId ?? '')));
    const dbIds = new Set(dbVets.map(v => String(v.id ?? '')));
    const dbNames = new Set(dbVets.map(v => (v.name || '').trim().toLowerCase()));

    // Fallback vets: include only those not already present in DB by id or name
    const fallbackFiltered = FALLBACK_VETS.filter(fb => {
      const idHit = dbIds.has(String(fb.id));
      const nameHit = dbNames.has((fb.name || '').trim().toLowerCase());
      return !(idHit || nameHit);
    });

    // Derive vet entries from users with role=vet IF they don't already have a vet profile
    const derivedFromUsers = (vetUsers || []).filter(u => !byUserId.has(String(u.id))).map(u => ({
      id: String(u.id),
      userId: String(u.id),
      name: u.fullname || u.fullName || u.name || u.email || 'Κτηνίατρος',
      email: u.email || '',
      address: u.address || '—',
      specialty: 'Κτηνιατρικές Υπηρεσίες',
      rating: 4.8,
      views: 0,
      likes: 0,
      price: 40,
      image: 'https://images.unsplash.com/photo-1522693668201-5b88340c1bd7?auto=format&fit=crop&w=200&q=60',
      availability: ''
    }));
    // Merge and de-duplicate by id or name
    const combined = [...dbVets, ...fallbackFiltered, ...derivedFromUsers];
    const seen = new Set();
    const unique = [];
    for (const v of combined) {
      const keyId = String(v.id || '').trim();
      const keyName = (v.name || '').trim().toLowerCase();
      const key = keyId || `name:${keyName}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(v);
      }
    }
    return unique;
  }, [allVets, vetUsers]);

  // Derive specialties and cities from the combined source (deduped)
  const specialties = useMemo(
    () => Array.from(new Set((sourceVets || []).map(v => v.specialty).filter(Boolean))),
    [sourceVets]
  );
  const cities = useMemo(() => {
    const guessCity = (addr) => {
      if ((addr || '').includes('Αθήνα')) return 'Αθήνα';
      if ((addr || '').includes('Θεσσαλονίκη')) return 'Θεσσαλονίκη';
      return 'Άλλη';
    };
    return Array.from(new Set((sourceVets || []).map(v => guessCity(v.address))));
  }, [sourceVets]);

  // Helper: commit current or overridden state to URL (explicit actions only)
  const commitURL = (overrides = {}) => {
    const q = (overrides.searchQuery ?? searchQuery).trim();
    const citiesVal = overrides.selectedCities ?? selectedCities;
    const specsVal = overrides.selectedSpecialties ?? selectedSpecialties;
    const ratingVal = overrides.minRating ?? minRating;
    const priceVal = overrides.maxPrice ?? maxPrice;
    const pageVal = overrides.page ?? page;
    const viewVal = overrides.viewMode ?? viewMode;
    const params = {};
    if (q) params.q = q;
    if (citiesVal && citiesVal.length) params.city = citiesVal.join(',');
    if (specsVal && specsVal.length) params.spec = specsVal.join(',');
    if (ratingVal > 0) params.rating = String(ratingVal);
    if (priceVal !== 100) params.price = String(priceVal);
    if (pageVal > 1) params.page = String(pageVal);
    if (viewVal !== 'list') params.view = viewVal;
    setSearchParams(params, { replace: true });
  };

  // Debounce search input to avoid jumpy list updates
  useEffect(() => {
    const id = setTimeout(() => {
      setSearchQuery(searchInput);
      setPage(1);
    }, 250);
    return () => clearTimeout(id);
  }, [searchInput]);

  // Keep focus on the search field after state updates, but don't steal focus while typing elsewhere
  useEffect(() => {
    if (!filterOpen && searchRef.current) {
      try {
        const active = document.activeElement;
        // If focus is inside an input/textarea or a contentEditable, don't steal it
        if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) {
          console.debug('[searchFocus] skipping focus because active element is', active.tagName, active.id, active.className);
          return;
        }
        console.debug('[searchFocus] focusing search input');
        searchRef.current.focus();
      } catch (err) { console.error(err); }
    }
  }, [searchInput, searchQuery, filterOpen]);

  // Debug: log focus changes globally to detect which element receives focus
  useEffect(() => {
    const onFocusIn = (e) => {
      try {
        const t = e.target;
        console.debug('[focusin]', t.tagName, t.id || '', t.className || '', 'value:', t.value || '');
      } catch (err) { console.error(err); }
    };
    window.addEventListener('focusin', onFocusIn);
    return () => window.removeEventListener('focusin', onFocusIn);
  }, []);

  // Debug: log appointment reason updates and current active element
  useEffect(() => {
    try {
      console.debug('[appointmentReason change]', appointmentReason, 'active:', document.activeElement?.tagName, document.activeElement?.id);
      // Check active element shortly after state change
      setTimeout(() => {
        console.debug('[appointmentReason after timeout] active:', document.activeElement?.tagName, document.activeElement?.id);
      }, 10);
    } catch (err) { console.error(err); }
  }, [appointmentReason]);


  // Draft states used inside the filter dialog so the list doesn't re-render until Apply
  const [draftSelectedCities, setDraftSelectedCities] = useState([]);
  const [draftSelectedSpecialties, setDraftSelectedSpecialties] = useState([]);
  const [draftMinRating, setDraftMinRating] = useState(0);
  const [draftMaxPrice, setDraftMaxPrice] = useState(100);

  useEffect(() => {
    if (filterOpen) {
      setDraftSelectedCities(selectedCities);
      setDraftSelectedSpecialties(selectedSpecialties);
      setDraftMinRating(minRating);
      setDraftMaxPrice(maxPrice);
    }
  }, [filterOpen]);

  useEffect(() => {
    let result = true;
    const stored = localStorage.getItem('pets');
    if (stored) {
      try {
        const arr = JSON.parse(stored);
        if (Array.isArray(arr)) {
          if (arr.length === 0) result = false;
          else result = true;
        }
      } catch (e) {}
    }
    if (user?.pets && Array.isArray(user.pets)) {
      if (user.pets.length === 0) result = false;
      if (user.pets.length > 0) result = true;
    }
    setHasPets(result);
  }, [user]);
  
  // Filter vets based on search query
  const filteredVets = useMemo(() => {
    const SOURCE = sourceVets;
    const q = searchQuery.trim().toLowerCase();
    const priceNum = (p) => typeof p === 'number' ? p : (parseInt(String(p).replace(/[^0-9]/g, ''), 10) || 0);
    const withinFilters = (vet) => {
      const cityMatches = selectedCities.length === 0 || selectedCities.some(c => (vet.address || '').includes(c) || (c === 'Άλλη' && !/(Αθήνα|Θεσσαλονίκη)/.test(vet.address || '')));
      const specialtyMatches = selectedSpecialties.length === 0 || selectedSpecialties.includes(vet.specialty);
      const ratingMatches = (vet.rating || 0) >= minRating;
      const priceMatches = priceNum(vet.price) <= maxPrice;
      return cityMatches && specialtyMatches && ratingMatches && priceMatches;
    };
    const base = q
      ? SOURCE.filter(vet =>
          (vet.name || '').toLowerCase().includes(q) ||
          (vet.specialty || '').toLowerCase().includes(q) ||
          (vet.address || '').toLowerCase().includes(q)
        )
      : SOURCE;
    return base.filter(withinFilters);
  }, [searchQuery, selectedCities, selectedSpecialties, minRating, maxPrice, sourceVets]);
  
  const pageCount = Math.ceil(filteredVets.length / vetsPerPage);
  const handlePageChange = (event, value) => { setPage(value); commitURL({ page: value }); };
  const displayedVets = filteredVets.slice((page - 1) * vetsPerPage, page * vetsPerPage);

  // Guests can browse; login will be required before booking

  if (hasPets === false && !allowFindWithoutPet) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
          <Container maxWidth="xl" sx={{ pt: 2 }}>
            <PageHeader />
          </Container>
          <Container maxWidth="md" sx={{ py: 8 }}>
            <Paper elevation={4} sx={{ p: 5, textAlign: 'center', borderRadius: 4, bgcolor: 'white' }}>
              <Typography variant="h4" fontWeight={800} sx={{ mb: 2, color: '#0f172a' }}>Καταχώριση Κατοικιδίου από Κτηνίατρο</Typography>
              <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                Η καταχώριση κατοικιδίου γίνεται αποκλειστικά από κτηνίατρο μέσω του Εθνικού Μητρώου Κατοικιδίων. Επικοινωνήστε με κτηνίατρο για να καταχωρήσει το κατοικίδιό σας πριν προχωρήσετε σε ραντεβού.
              </Typography>
              <Button variant="contained" size="large" onClick={() => navigate('/owner/search?find=1')} sx={{ px: 4, borderRadius: 3 }}>Βρες Κτηνίατρο</Button>
            </Paper>
          </Container>
        </Box>
      </ThemeProvider>
    );
  }

  // --- LOGIC ---

  const handleNext = async () => {
    if (activeStep === 0 && !selectedVet) { alert("Παρακαλώ επιλέξτε έναν κτηνίατρο."); return; }
    if (activeStep === 1 && (!selectedDate || !selectedTime)) { alert("Παρακαλώ επιλέξτε ημερομηνία ΚΑΙ ώρα."); return; }
    // Before reaching pet-selection step, require authentication
    if (!user && activeStep >= 1) {
      try {
        const payload = {
          step: activeStep + 1, // next step the user attempted to go to
          searchQuery,
          selectedVet: selectedVet ? {
            id: selectedVet.id,
            userId: selectedVet.userId,
            name: selectedVet.name,
            email: selectedVet.email
          } : null,
          selectedDate,
          selectedTime,
          registerAppointment,
          reason: appointmentReason,
          details: selectedDetails,
          detailNotes
        };
        sessionStorage.setItem('vetSearchProgress', JSON.stringify(payload));
        sessionStorage.setItem('postAuthRedirect', '/find-vet?find=1');
      } catch (_) {}
      alert('Παρακαλώ συνδεθείτε ή εγγραφείτε για να συνεχίσετε.');
      navigate('/login?redirect=find-vet');
      return;
    }
    if (activeStep === 2 && !selectedPet && !registerAppointment) { alert("Παρακαλώ επιλέξτε κατοικίδιο ή επιλέξτε ραντεβού για καταχώριση κατοικιδίου."); return; }
    // Require one selected detail with non-empty note before proceeding
    if (activeStep === 2) {
      const key = selectedDetails[0];
      if (!key) {
        setDetailError(true);
        alert('Παρακαλώ επιλέξτε ένα από τα κουμπιά λεπτομερειών και προσθέστε μια σύντομη περιγραφή.');
        return;
      }
      const note = (detailNotes[key] || '').toString().trim();
      if (!note) {
        setDetailError(true);
        alert('Παρακαλώ προσθέστε περιγραφή για την επιλεγμένη λεπτομέρεια πριν προχωρήσετε.');
        return;
      }
    }
    // Do not inject a default pet here; if no pet is selected the preview should show empty state.
    if (activeStep < STEPS.length - 1) {
        setActiveStep((prev) => prev + 1);
    } else {
        // Before creating, enforce single-slot-per-vet constraint
        try {
          const all = await appointmentsAPI.getAll();
          const clash = (Array.isArray(all) ? all : []).find(a => 
            String(a.vetId) === String(selectedVet?.id || '') &&
            String(a.date) === String(selectedDate || '') &&
            String(a.time) === String(selectedTime || '') &&
            a.status !== 'cancelled'
          );
          if (clash) {
            alert('Υπάρχει ήδη ραντεβού για τον κτηνίατρο σε αυτή την ώρα. Επιλέξτε άλλη ώρα.');
            return;
          }
        } catch(e) {
          console.warn('Αδυναμία ελέγχου διαθεσιμότητας. Θα επιχειρηθεί δημιουργία.');
        }
        // Require authentication before creating appointment
        if (!user) {
          try {
            const payload = {
              step: activeStep, // preview step
              searchQuery,
              selectedVet,
              selectedDate,
              selectedTime,
              registerAppointment,
              reason: appointmentReason,
              details: selectedDetails,
              detailNotes
            };
            sessionStorage.setItem('vetSearchProgress', JSON.stringify(payload));
            sessionStorage.setItem('postAuthRedirect', '/find-vet?find=1');
          } catch (_) {}
          alert('Παρακαλώ συνδεθείτε για να ολοκληρώσετε την κράτηση.');
          navigate('/login?redirect=find-vet');
          return;
        }
        // Create appointment on server (as pending; vet confirms later)
        const payload = {
          ownerId: user?.id || null,
          ownerName: user?.fullname || user?.fullName || user?.email || 'Ιδιοκτήτης',
          vetId: selectedVet?.id || null,
          vetUserId: selectedVet?.userId || selectedVet?.id || null,
          vetEmail: selectedVet?.email || selectedVet?.userEmail || null,
          vetName: selectedVet?.name || 'Κτηνίατρος',
          petName: selectedPet?.name || (registerAppointment ? 'Νέα Καταχώριση' : 'Κατοικίδιο'),
          time: selectedTime || '15:00',
          date: selectedDate || new Date().toLocaleDateString('el-GR'),
          status: 'pending',
          type: registerAppointment ? 'Registration' : 'Visit',
          reason: appointmentReason || (registerAppointment ? 'Καταχώριση Κατοικιδίου' : 'Τακτικός Έλεγχος'),
          details: selectedDetails,
          detailNotes
        };
        try {
          await appointmentsAPI.create(payload);
          setOpenSuccess(true);
        } catch (e) {
          console.error(e);
          alert('Αποτυχία καταχώρησης ραντεβού. Βεβαιώσου ότι τρέχει το json-server στο port 3001.');
        }
    }
  };

  const handleSaveDraft = async () => {
    // allow saving a draft from the preview step (or earlier if desired)
    if (!selectedVet) { alert('Επιλέξτε έναν κτηνίατρο πριν αποθηκεύσετε.'); return; }
    try {
      const payload = {
        ownerId: user?.id || null,
        ownerName: user?.fullname || user?.fullName || user?.email || 'Ιδιοκτήτης',
        vetId: selectedVet?.id || null,
        vetUserId: selectedVet?.userId || selectedVet?.id || null,
        vetEmail: selectedVet?.email || selectedVet?.userEmail || null,
        vetName: selectedVet?.name || 'Κτηνίατρος',
        petName: selectedPet?.name || (registerAppointment ? 'Νέα Καταχώριση' : 'Κατοικίδιο'),
        time: selectedTime || '',
        date: selectedDate || '',
        status: 'draft',
        type: registerAppointment ? 'Registration' : 'Visit',
        reason: appointmentReason || (registerAppointment ? 'Καταχώριση Κατοικιδίου' : 'Τακτικός Έλεγχος'),
        details: selectedDetails,
        detailNotes,
        updatedAt: new Date().toISOString()
      };
      await appointmentsAPI.create(payload);
      alert('Το ραντεβού αποθηκεύτηκε ως πρόχειρο. Θα το βρείτε στο Ιστορικό → Ραντεβού.');
    } catch (e) {
      console.error('Failed to save draft', e);
      alert('Αποτυχία αποθήκευσης πρόχειρου.');
    }
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep((prev) => prev - 1);
  };

  // Guests can browse; login guard handled during progression

  if (hasPets === false && !allowFindWithoutPet) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
          <Container maxWidth="xl" sx={{ pt: 2 }}>
            <PageHeader />
          </Container>
          <Container maxWidth="md" sx={{ py: 8 }}>
            <Paper elevation={4} sx={{ p: 5, textAlign: 'center', borderRadius: 4, bgcolor: 'white' }}>
              <Typography variant="h4" fontWeight={800} sx={{ mb: 2, color: '#0f172a' }}>Καταχώριση Κατοικιδίου από Κτηνίατρο</Typography>
              <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                Η καταχώριση κατοικιδίου γίνεται αποκλειστικά από κτηνίατρο μέσω του Εθνικού Μητρώου Κατοικιδίων. Επικοινωνήστε με κτηνίατρο για να καταχωρήσει το κατοικίδιό σας πριν προχωρήσετε σε ραντεβού.
              </Typography>
              <Button variant="contained" size="large" onClick={() => navigate('/owner/search?find=1')} sx={{ px: 4, borderRadius: 3 }}>Βρες Κτηνίατρο</Button>
            </Paper>
          </Container>
        </Box>
      </ThemeProvider>
    );
  }

  // --- SUB-COMPONENTS ---

  const StepVetList = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
          <TextField 
            placeholder="Αναζήτηση κτηνιάτρου..." 
            size="small"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            inputRef={searchRef}
            InputProps={{
              endAdornment: (
                searchInput ? (
                  <InputAdornment position="end">
                    <IconButton size="small" aria-label="Καθαρισμός" onClick={() => { setSearchInput(''); setSearchQuery(''); setPage(1); commitURL({ searchQuery: '', page: 1 }); }}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null
              )
            }}
            sx={{ flex: 1, minWidth: 240, maxWidth: 320, bgcolor: 'white', borderRadius: 2, boxShadow: '0 6px 18px rgba(15,23,42,0.06)' }}
          />
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            Αποτελέσματα
            <Chip label={filteredVets.length} size="small" color="primary" variant="outlined" />
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" endIcon={<FilterListIcon />} size="small" onClick={() => setFilterOpen(true)} sx={{ color: '#333', borderColor: '#ccc', borderRadius: 2, '&:hover': { borderColor: '#00695c', color: '#00695c' } }}>Filter</Button>
                <Box sx={{ border: '1px solid #ccc', borderRadius: 2, display: 'flex', overflow: 'hidden' }}>
                  <IconButton size="small" onClick={() => { setViewMode('list'); commitURL({ viewMode: 'list' }); }} sx={{ bgcolor: viewMode==='list' ? '#f5f5f5' : 'transparent', '&:hover': { bgcolor: '#f5f5f5' } }}><ViewListIcon /></IconButton>
                  <IconButton size="small" onClick={() => { setViewMode('grid'); commitURL({ viewMode: 'grid' }); }} sx={{ bgcolor: viewMode==='grid' ? '#f5f5f5' : 'transparent', '&:hover': { bgcolor: '#f5f5f5' } }}><GridViewIcon /></IconButton>
              </Box>
          </Box>
      </Box>
      <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto' }}>
      {displayedVets.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#f5f5f5' }}>
          <Typography variant="body1" color="text.secondary">
            Δεν βρέθηκαν κτηνίατροι που ταιριάζουν με την αναζήτησή σας.
          </Typography>
        </Paper>
      ) : (
        viewMode === 'grid' ? (
          <Grid container spacing={2}>
            {displayedVets.map(vet => (
              <Grid item xs={12} sm={6} key={vet.id}>
                <Paper
                  elevation={selectedVet?.id === vet.id ? 8 : 1}
                  onClick={() => setSelectedVet(vet)}
                  sx={{ p: 2, borderRadius: '14px', border: selectedVet?.id === vet.id ? '2px solid #00695c' : '1px solid #eee', display: 'flex', gap: 2, cursor: 'pointer', bgcolor: selectedVet?.id === vet.id ? '#e0f2f1' : 'white' }}
                >
                  <Avatar src={vet.img || vet.image} variant="rounded" sx={{ width: 80, height: 80, borderRadius: '8px' }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" sx={{ color: '#0277bd' }}>{vet.name}</Typography>
                    <Typography variant="caption" display="block" color="text.secondary"><LocationOnIcon fontSize="inherit"/> {vet.address}</Typography>
                    <Typography variant="caption" display="block" color="text.secondary"><MedicalServicesIcon fontSize="inherit"/> {vet.specialty}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                      <StarIcon sx={{ color: '#FFC107', fontSize: 18 }} />
                      <Typography variant="body2" fontWeight="bold">{vet.rating}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1, color: '#555' }}>από <span style={{ color: '#00695c', fontWeight: 'bold' }}>{typeof vet.price === 'number' ? `${vet.price}€` : vet.price}</span></Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          displayedVets.map(vet => (
            <Paper 
              key={vet.id} 
              elevation={selectedVet?.id === vet.id ? 8 : 1} 
              onClick={() => setSelectedVet(vet)}
              sx={{ 
                  position: 'relative',
                  p: 2.5, mb: 3, border: selectedVet?.id === vet.id ? '2px solid #00695c' : '1px solid #eee', 
                  borderRadius: '14px', display: 'flex', gap: 3, cursor: 'pointer',
                  bgcolor: selectedVet?.id === vet.id ? '#e0f2f1' : 'white',
                  transition: 'all 0.25s ease',
                  '&:hover': { borderColor: '#00695c', transform: 'translateY(-6px) scale(1.01)', boxShadow: '0 14px 32px rgba(0,0,0,0.1)' },
                  '&::after': {
                    content: '""', position: 'absolute', inset: 0, borderRadius: '14px', pointerEvents: 'none',
                    background: 'linear-gradient(120deg, rgba(0,105,92,0.08), rgba(255,167,38,0.06))', opacity: 0, transition: 'opacity 0.25s ease'
                  },
                  '&:hover::after': { opacity: 1 }
              }}
            >
                   <Avatar src={vet.img || vet.image} variant="rounded" sx={{ width: 100, height: 100, borderRadius: '8px' }} />
                   <Box sx={{ flexGrow: 1 }}>
                     <Typography variant="h6" sx={{ color: '#0277bd', mb: 1 }}>{vet.name}</Typography>
                    <Typography variant="caption" display="block" color="text.secondary"><LocationOnIcon fontSize="inherit"/> {vet.address}</Typography>
                    <Typography variant="caption" display="block" color="text.secondary"><MedicalServicesIcon fontSize="inherit"/> {vet.specialty}</Typography>
                    <Typography variant="caption" display="block" color="text.primary" fontWeight="bold"><CalendarMonthIcon fontSize="inherit"/> {vet.availability}</Typography>
                </Box>
                <Box sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <IconButton size="small" sx={{ alignSelf: 'flex-end' }}><MoreVertIcon /></IconButton>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                            <StarIcon sx={{ color: '#FFC107', fontSize: 18 }} />
                            <Typography variant="body2" fontWeight="bold">{vet.rating}</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ mt: 1, color: '#555' }}>Τιμή από: <span style={{ color: '#00695c', fontWeight: 'bold', fontSize: '1.1rem' }}>{typeof vet.price === 'number' ? `${vet.price}€` : vet.price}</span></Typography>
                    </Box>
                </Box>
            </Paper>
          ))
        )
      )}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><Pagination count={pageCount} page={page} onChange={handlePageChange} color="primary" shape="rounded" /></Box>

      {/* Filter Dialog */}
      <Dialog 
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        keepMounted
        disableRestoreFocus
        disableAutoFocus
        disableEnforceFocus
        transitionDuration={0}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogContent sx={{ minWidth: 420 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Φίλτρα</Typography>
          <Typography variant="subtitle2">Πόλη</Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            {cities.map(c => (
              <FormControlLabel key={c} control={<Checkbox checked={draftSelectedCities.includes(c)} onChange={(e) => {
                const checked = e.target.checked; setDraftSelectedCities(prev => checked ? [...prev, c] : prev.filter(x => x !== c));
              }} />} label={c} />
            ))}
          </Box>
          <Typography variant="subtitle2">Ειδικότητα</Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            {specialties.map(s => (
              <FormControlLabel key={s} control={<Checkbox checked={draftSelectedSpecialties.includes(s)} onChange={(e) => {
                const checked = e.target.checked; setDraftSelectedSpecialties(prev => checked ? [...prev, s] : prev.filter(x => x !== s));
              }} />} label={s} />
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField label="Ελάχιστη Αξιολόγηση" type="number" inputProps={{ min: 0, max: 5, step: 0.1 }} value={draftMinRating} onChange={(e) => setDraftMinRating(Number(e.target.value))} size="small" />
            <TextField label="Μέγιστη Τιμή (€)" type="number" inputProps={{ min: 0, step: 5 }} value={draftMaxPrice} onChange={(e) => setDraftMaxPrice(Number(e.target.value))} size="small" />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="text" color="error" onClick={() => { setDraftSelectedCities([]); setDraftSelectedSpecialties([]); setDraftMinRating(0); setDraftMaxPrice(100); }}>Καθαρισμός</Button>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" onClick={() => setFilterOpen(false)}>Κλείσιμο</Button>
              <Button variant="contained" onClick={() => { 
                setSelectedCities(draftSelectedCities);
                setSelectedSpecialties(draftSelectedSpecialties);
                setMinRating(draftMinRating);
                setMaxPrice(draftMaxPrice);
                setPage(1);
                setFilterOpen(false);
                commitURL({ selectedCities: draftSelectedCities, selectedSpecialties: draftSelectedSpecialties, minRating: draftMinRating, maxPrice: draftMaxPrice, page: 1 });
              }}>Εφαρμογή</Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );

  const StepCalendar = () => {
    const monthFormatter = new Intl.DateTimeFormat('el-GR', { month: 'long', year: 'numeric' });
    const weekdayShort = ['Κυ','Δε','Τρ','Τε','Πε','Πα','Σα'];
    const formatGreek = (d) => d.toLocaleDateString('el-GR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const today = startOfDay(todayRef);

    const monthStart = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1);
    const startOffset = monthStart.getDay(); // Sunday=0
    const gridStart = new Date(monthStart);
    gridStart.setDate(monthStart.getDate() - startOffset);

    const days = Array.from({ length: 42 }, (_, i) => {
      const d = new Date(gridStart);
      d.setDate(gridStart.getDate() + i);
      return d;
    });

    const isSameDay = (a, b) => a && b && a.toDateString() === b.toDateString();
    const isCurrentMonth = (d) => d.getMonth() === calendarDate.getMonth();
    const isPast = (d) => startOfDay(d) < today;

    const quickPick = (type) => {
      if (type === 'today') {
        setSelectedDate(formatGreek(today));
      } else if (type === 'tomorrow') {
        const t = new Date(today); t.setDate(t.getDate() + 1); setSelectedDate(formatGreek(t));
      } else if (type === 'nextWeek') {
        const t = new Date(today); t.setDate(t.getDate() + 7); setSelectedDate(formatGreek(t));
      } else if (type === 'clear') {
        setSelectedDate(null); setSelectedTime(null);
      } else if (type === 'nextAvailable') {
        const target = days.find(d => !isPast(d) && isCurrentMonth(d)) || today;
        setSelectedDate(formatGreek(target));
        setSelectedTime(TIME_SLOTS[0]);
      }
    };

    const groupedSlots = TIME_SLOTS.reduce((acc, t) => {
      const h = parseInt(t.split(':')[0], 10);
      if (h < 12) acc.morning.push(t);
      else if (h < 17) acc.afternoon.push(t);
      else acc.evening.push(t);
      return acc;
    }, { morning: [], afternoon: [], evening: [] });

    // Keep UI steady on selection changes; no container re-mount or transform animations

    return (
      <Box sx={{ maxWidth: '900px', mx: 'auto' }}>
        <Typography variant="h5" fontWeight="bold" align="center" gutterBottom sx={{ mt: -2 }}>Ώρα και Μέρα</Typography>
        <Divider sx={{ width: 60, height: 4, bgcolor: '#333', mx: 'auto', mb: 3, borderRadius: 2 }} />

        {/* Single interactive container */}
        <Paper elevation={1} sx={{ p: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
          {/* Header with selection summary and quick picks */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <Chip label="Βήμα 2" color="primary" variant="outlined" />
            <Typography fontWeight={700}>Διαλέξτε μέρα και ώρα</Typography>
            <Chip
              label={`${selectedDate || 'Ημερομηνία;'} · ${selectedTime || 'Ώρα;'}`}
              color={(selectedDate && selectedTime) ? 'success' : 'default'}
              sx={{ ml: { xs: 0, md: 'auto' }, fontWeight: 'bold' }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' }, alignItems: 'flex-start' }}>
            {/* Calendar section */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.25, alignItems: 'center' }}>
                <IconButton size="small" sx={{ border: '1px solid #eee', bgcolor: 'white' }} onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))}><ChevronLeftIcon fontSize="small" /></IconButton>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>{monthFormatter.format(calendarDate)}</Typography>
                <IconButton size="small" sx={{ border: '1px solid #eee', bgcolor: 'white' }} onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))}><ChevronRightIcon fontSize="small" /></IconButton>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.75 }}>
                {weekdayShort.map(d => (
                  <Box key={d} sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="bold">{d}</Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ mt: 0.5, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.75 }}>
                {days.map((d, idx) => {
                  const disabled = isPast(d);
                  const muted = !isCurrentMonth(d);
                  const selected = selectedDate && formatGreek(d) === selectedDate;
                  return (
                    <Box key={idx} sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Tooltip title={disabled ? 'Μη διαθέσιμη ημέρα' : ''} disableHoverListener={!disabled}>
                        <Box
                          onClick={() => !disabled && setSelectedDate(formatGreek(d))}
                          sx={{
                            width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            borderRadius: '8px', cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease',
                            bgcolor: selected ? '#00695c' : 'transparent',
                            color: disabled ? '#cbd5e1' : (selected ? 'white' : (muted ? '#94a3b8' : '#111')),
                            fontWeight: selected ? 700 : 500,
                            border: selected ? 'none' : '1px solid #eceff1',
                            opacity: disabled ? 0.55 : 1,
                            '&:hover': { bgcolor: disabled ? 'transparent' : (selected ? '#005448' : '#f5f5f5') }
                          }}
                        >{d.getDate()}</Box>
                      </Tooltip>
                    </Box>
                  );
                })}
              </Box>

              <Box sx={{ mt: 1.25, display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                <Chip size="small" label="Σήμερα" onClick={() => quickPick('today')} />
                <Chip size="small" label="Αύριο" onClick={() => quickPick('tomorrow')} />
                <Chip size="small" label="Επόμενη Εβδομάδα" onClick={() => quickPick('nextWeek')} />
                <Chip size="small" label="Επόμενο διαθέσιμο" color="success" onClick={() => quickPick('nextAvailable')} />
                <Chip size="small" label="Καθαρισμός" color="error" variant="outlined" onClick={() => quickPick('clear')} />
              </Box>
            </Box>

            {/* Divider inside the same box on desktop */}
            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' }, my: 0.5 }} />

            {/* Times section */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}><AccessTimeIcon fontSize="small"/> Διαθέσιμες Ώρες</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                {loadingTimes ? 'Έλεγχος διαθεσιμότητας...' : availabilityError ? availabilityError : (selectedVet && selectedDate ? `Μη διαθέσιμες ώρες: ${unavailableTimes.length}` : 'Επιλέξτε κτηνίατρο και ημερομηνία για έλεγχο διαθεσιμότητας.')}
              </Typography>
              {/* Morning */}
              {groupedSlots.morning.length > 0 && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="overline" sx={{ color: 'text.secondary', lineHeight: 1 }}>Πρωί</Typography>
                  <Box sx={{ mt: 0.5, display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                    {groupedSlots.morning.map((time) => {
                      const picked = selectedTime === time;
                      const isUnavailable = !!selectedVet && !!selectedDate && unavailableTimes.includes(time);
                      return (
                        <Tooltip key={`m-${time}`} title={isUnavailable ? 'Μη διαθέσιμη ώρα' : ''} disableHoverListener={!isUnavailable}>
                          <span>
                            <Chip
                              size="small"
                              label={time}
                              clickable={!isUnavailable}
                              onClick={() => !isUnavailable && setSelectedTime(time)}
                              color={picked ? 'success' : 'default'}
                              variant={picked ? 'filled' : 'outlined'}
                              disabled={isUnavailable}
                              sx={{ fontWeight: 700, opacity: isUnavailable ? 0.55 : 1 }}
                            />
                          </span>
                        </Tooltip>
                      );
                    })}
                  </Box>
                </Box>
              )}
              {/* Afternoon */}
              {groupedSlots.afternoon.length > 0 && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="overline" sx={{ color: 'text.secondary', lineHeight: 1 }}>Μεσημέρι</Typography>
                  <Box sx={{ mt: 0.5, display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                    {groupedSlots.afternoon.map((time) => {
                      const picked = selectedTime === time;
                      const isUnavailable = !!selectedVet && !!selectedDate && unavailableTimes.includes(time);
                      return (
                        <Tooltip key={`a-${time}`} title={isUnavailable ? 'Μη διαθέσιμη ώρα' : ''} disableHoverListener={!isUnavailable}>
                          <span>
                            <Chip
                              size="small"
                              label={time}
                              clickable={!isUnavailable}
                              onClick={() => !isUnavailable && setSelectedTime(time)}
                              color={picked ? 'success' : 'default'}
                              variant={picked ? 'filled' : 'outlined'}
                              disabled={isUnavailable}
                              sx={{ fontWeight: 700, opacity: isUnavailable ? 0.55 : 1 }}
                            />
                          </span>
                        </Tooltip>
                      );
                    })}
                  </Box>
                </Box>
              )}
              {/* Evening */}
              {groupedSlots.evening.length > 0 && (
                <Box>
                  <Typography variant="overline" sx={{ color: 'text.secondary', lineHeight: 1 }}>Απόγευμα</Typography>
                  <Box sx={{ mt: 0.5, display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                    {groupedSlots.evening.map((time) => {
                      const picked = selectedTime === time;
                      const isUnavailable = !!selectedVet && !!selectedDate && unavailableTimes.includes(time);
                      return (
                        <Tooltip key={`e-${time}`} title={isUnavailable ? 'Μη διαθέσιμη ώρα' : ''} disableHoverListener={!isUnavailable}>
                          <span>
                            <Chip
                              size="small"
                              label={time}
                              clickable={!isUnavailable}
                              onClick={() => !isUnavailable && setSelectedTime(time)}
                              color={picked ? 'success' : 'default'}
                              variant={picked ? 'filled' : 'outlined'}
                              disabled={isUnavailable}
                              sx={{ fontWeight: 700, opacity: isUnavailable ? 0.55 : 1 }}
                            />
                          </span>
                        </Tooltip>
                      );
                    })}
                  </Box>
                </Box>
              )}

              <Paper elevation={0} sx={{ mt: 1.5, p: 1.5, borderRadius: 2, border: '1px dashed #b0bec5', bgcolor: '#f1f8e9', minHeight: 60 }}>
                <Typography variant="body2" fontWeight="bold">Σύνοψη επιλογής</Typography>
                <Typography variant="caption" color="text.secondary">{selectedDate || 'Ημερομηνία;'} • {selectedTime || 'Ώρα;'}</Typography>
                {(!selectedDate || !selectedTime) && (
                  <Typography variant="caption" color="error.main">Επιλέξτε και ημερομηνία και ώρα για να συνεχίσετε.</Typography>
                )}
              </Paper>
            </Box>
          </Box>
        </Paper>
      </Box>
    );
  };

  const StepSelectPet = () => (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h5" fontWeight="bold">Επιλογή Κατοικιδίου</Typography>
      <Divider sx={{ width: 60, height: 3, bgcolor: '#333', mx: 'auto', mb: 6, mt: 1 }} />
      
      {userPets.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Δεν βρέθηκε κατοικίδιο στο προφίλ σας.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Θέλετε να κλείσετε ραντεβού για δήλωση/καταχώριση κατοικιδίου;
          </Typography>
          <Button 
            variant="contained"
            sx={{ bgcolor: '#00695c' }}
            onClick={() => {
              setRegisterAppointment(true);
              setSelectedPet(null);
              if (!appointmentReason) setAppointmentReason(REGISTRATION_REASON);
              setActiveStep((prev) => prev + 1);
            }}
          >
            Κλείσε Ραντεβού για Δήλωση Κατοικιδίου
          </Button>
        </Box>
      ) : (
        <Box>
          <Grid container spacing={4} justifyContent="center">    
            {/* Extra option: allow booking a Registration even if pets exist */}
            <Grid item xs={12} sm={5} key="new-registration">
              <Paper
                elevation={registerAppointment ? 4 : 0}
                onClick={() => {
                  const next = !registerAppointment;
                  setRegisterAppointment(next);
                  if (next) {
                    setSelectedPet(null);
                    if (!appointmentReason) setAppointmentReason(REGISTRATION_REASON);
                    // Also select the 'Νέα Καταγραφή' detail so the downstream flow is consistent
                    setSelectedDetails(['new-record']);
                    setDetailNotes(prev => ({ ...prev, ['new-record']: prev['new-record'] || '' }));
                  } else {
                    if (appointmentReason === REGISTRATION_REASON) setAppointmentReason('');
                    // If user deselects registration, remove the new-record detail
                    setSelectedDetails(prev => prev.filter(d => d !== 'new-record'));
                    setDetailNotes(prev => { const c = { ...prev }; delete c['new-record']; return c; });
                  }
                }}
                sx={{
                  p: 2,
                  border: registerAppointment ? '2px solid #00695c' : '2px dashed #00695c',
                  borderRadius: '12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  bgcolor: registerAppointment ? '#e0f2f1' : '#f8fbfb',
                  '&:hover': { bgcolor: '#f1f8e9' }
                }}
              >
                <Typography variant="h6" fontWeight="bold">Δήλωση Νέου Κατοικιδίου</Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Επιλέξτε αυτό αν θέλετε να καταχωρήσετε νέο ζώο στο μητρώο κατά την επίσκεψη.
                </Typography>
                <Button fullWidth variant={registerAppointment ? 'contained' : 'outlined'} size="small" sx={{ mt: 2, bgcolor: registerAppointment ? '#00695c' : 'transparent', color: registerAppointment ? 'white' : 'inherit' }}>
                  {registerAppointment ? 'Επιλεγμένη Καταχώριση' : 'Επιλογή Καταχώρισης'}
                </Button>
              </Paper>
            </Grid>
            {userPets.map((pet, i) => (
              <Grid item xs={12} sm={5} key={pet.id}>
                <Paper 
                  elevation={selectedPet?.id === pet.id ? 4 : 0} 
                  onClick={() => {
                    setSelectedPet(pet);
                    setRegisterAppointment(false);
                    if (appointmentReason === REGISTRATION_REASON) setAppointmentReason('');
                    // Clear 'Νέα Καταγραφή' when selecting an existing pet
                    if (selectedDetails.includes('new-record')) {
                      setSelectedDetails([]);
                      setDetailNotes(prev => { const c = { ...prev }; delete c['new-record']; return c; });
                    }
                  }}
                  sx={{ 
                    p: 2, 
                    border: selectedPet?.id === pet.id ? '2px solid #00695c' : '1px solid #333', 
                    borderRadius: '12px', 
                    textAlign: 'left', 
                    cursor: 'pointer', 
                    bgcolor: selectedPet?.id === pet.id ? '#e0f2f1' : 'white',
                    '&:hover': { bgcolor: '#f5f5f5' } 
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">{pet.name} {pet.gender === 'male' ? '♂' : '♀'}</Typography>
                      <Typography variant="caption" color="text.secondary">{pet.breed}</Typography>
                    </Box>
                    <Avatar src={pet.image} variant="rounded" sx={{ width: 60, height: 60 }} />
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" display="block" color="text.secondary">
                      Τύπος: {pet.type || '—'}{pet.age ? ` • Ηλικία: ${pet.age}` : ''}{pet.weight ? ` • Βάρος: ${pet.weight}kg` : ''}
                    </Typography>
                    {(pet.microchip || pet.color) && (
                      <Typography variant="caption" display="block" color="text.secondary">
                        {pet.microchip ? `Microchip: ${pet.microchip}` : ''}{pet.microchip && pet.color ? ' • ' : ''}{pet.color ? `Χρώμα: ${pet.color}` : ''}
                      </Typography>
                    )}
                  </Box>
                  <Button fullWidth variant="contained" size="small" sx={{ mt: 2, bgcolor: '#333' }}>Επιλογή</Button>
                </Paper>
              </Grid>
            ))}
          </Grid>

          
          <Box sx={{ maxWidth: 760, mx: 'auto', mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, px: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 0, fontWeight: 700, alignSelf: 'flex-start' }}>Λεπτομέρειες</Typography>
              <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap', mb: 0, justifyContent: 'center', width: '100%' }}>
              {[
                { key: 'new-prescription', label: 'Νέα Συνταγή' },
                { key: 'new-record', label: 'Νέα Καταγραφή' },
                { key: 'loss', label: 'Απώλεια Ζώου' },
                { key: 'found', label: 'Εύρεση Ζώου' },
                { key: 'transfer', label: 'Μεταβίβαση / Υιοθεσία' },
                { key: 'checkup', label: 'Checkup' }
              ].map(opt => {
                const active = selectedDetails.includes(opt.key);
                return (
                  <Chip
                    key={opt.key}
                    label={opt.label}
                    clickable
                    color={active ? 'primary' : 'default'}
                    variant={active ? 'filled' : 'outlined'}
                    onClick={() => toggleDetail(opt.key)}
                    sx={{ fontWeight: 700, minWidth: 140, px: 1.5, justifyContent: 'center' }}
                  />
                );
              })}
            </Box>

            {selectedDetails.map(key => {
              const label = (key === 'new-prescription' && 'Νέα Συνταγή') || (key === 'new-record' && 'Νέα Καταγραφή') || (key === 'loss' && 'Απώλεια Ζώου') || (key === 'found' && 'Εύρεση Ζώο') || (key === 'transfer' && 'Μεταβίβαση / Υιοθεσία') || (key === 'checkup' && 'Checkup') || key;
              const val = (detailNotes[key] || '').toString();
              const showError = detailError && (!val || !val.trim());
              return (
                <Box key={`note-${key}`} sx={{ mb: 2, width: '100%' }}>
                  <TextField
                    fullWidth
                    label={`Προσθήκη λεπτομερειών — ${label}`}
                    placeholder="Προσθέστε περισσότερες πληροφορίες για αυτή την επιλογή (π.χ. συμπτώματα, διάρκεια, προηγούμενες θεραπείες)"
                    value={detailNotes[key] || ''}
                    inputRef={(el) => { detailRefs.current[key] = el; }}
                    onChange={(e) => {
                      try {
                        const newVal = e.target.value;
                        const selStart = e.target.selectionStart;
                        const selEnd = e.target.selectionEnd;
                        setDetailNotes(prev => ({ ...prev, [key]: newVal }));
                        if (detailError) setDetailError(false);
                        // Restore caret after React updates
                        requestAnimationFrame(() => {
                          try {
                            const el = detailRefs.current[key];
                            if (el) {
                              if (document.activeElement !== el) el.focus();
                              const len = (el.value || '').length;
                              const s = Math.min(selStart ?? len, len);
                              const epos = Math.min(selEnd ?? len, len);
                              if (typeof el.setSelectionRange === 'function') el.setSelectionRange(s, epos);
                            }
                          } catch (err) { /* ignore */ }
                        });
                      } catch (err) { /* ignore */ }
                    }}
                    size="small"
                    error={showError}
                    helperText={showError ? 'Απαιτείται περιγραφή για να συνεχίσετε.' : ''}
                  />
                </Box>
              );
            })}


          </Box>
        </Box>
      )}
    </Box>
  );

  const StepPreview = () => (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h5" fontWeight="bold">Στοιχεία Κτηνίατρου</Typography>
      <Paper elevation={0} sx={{ p: 2, border: '1px solid #ccc', maxWidth: 500, mx: 'auto', mt: 2, mb: 4, display: 'flex', gap: 2 }}>
          <Avatar src={selectedVet?.image || selectedVet?.img || "https://randomuser.me/api/portraits/men/32.jpg"} sx={{ width: 60, height: 60 }} />
          <Box sx={{ textAlign: 'left' }}>
              <Typography variant="subtitle2" fontWeight="bold">{selectedVet?.name || "Δρ. Ιωάννης Σμυρνής"}</Typography>
              <Typography variant="caption">{selectedVet?.specialty || "Παθολογία"}</Typography>
              <Typography variant="caption" display="block">Διεύθυνση: {selectedVet?.address || "Αθήνα"}</Typography>
          </Box>
      </Paper>

      <Typography variant="h5" fontWeight="bold">Ώρα και Μέρα</Typography>
      <Paper elevation={0} sx={{ p: 2, maxWidth: 500, mx: 'auto', mt: 2, mb: 4, border: '1px solid #eee', bgcolor: '#E3F2FD' }}>
          <Typography color="primary" fontWeight="bold">📅 {selectedDate || "Τετάρτη, 20 Νοεμβρίου 2025"} • {selectedTime || "10:00 ΠΜ"}</Typography>
      </Paper>

      <Typography variant="h5" fontWeight="bold">Στοιχεία Κατοικιδίου</Typography>
      {registerAppointment ? (
        <Paper elevation={0} sx={{ p: 2, border: '1px solid #333', maxWidth: 420, mx: 'auto', mt: 2, textAlign: 'left', bgcolor: '#fffde7' }}>
          <Typography variant="h6" fontWeight="bold">Ραντεβού για Καταχώριση Κατοικιδίου</Typography>
          <Typography variant="caption" color="text.secondary" display="block">Δεν έχει επιλεγεί υπάρχον κατοικίδιο. Η επίσκεψη αφορά δημιουργία νέου.</Typography>
        </Paper>
      ) : (
        <Paper elevation={0} sx={{ p: 2, border: '1px solid #333', maxWidth: 300, mx: 'auto', mt: 2, textAlign: 'left' }}>
          <Typography variant="h6">{selectedPet?.name || "Kouvelaj"} 🐕</Typography>
          <Typography variant="caption">{selectedPet?.type || "Golden Retriever"}</Typography>
        </Paper>
      )}
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#fbfbfb', pb: 10, display: 'flex', flexDirection: 'column' }}>
        
        <Container maxWidth="xl" sx={{ pt: 1 }}><PageHeader /></Container>

        {/* Full-width hero section outside of sidebar layout */}
        <Box sx={{ 
            width: '100vw',
            height: '300px', 
            position: 'relative', 
            mb: 8,
            marginLeft: 'calc(-50vw + 50%)',
            backgroundImage: 'url(https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1600&q=80)',
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            overflow: 'visible'
        }}>
            {/* Gradient Overlay */}
            <Box sx={{ 
                position: 'absolute', 
                inset: 0, 
                background: 'linear-gradient(135deg, rgba(0, 105, 92, 0.85) 0%, rgba(38, 50, 56, 0.75) 100%)',
                zIndex: 1
            }} />
            <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', position: 'relative', zIndex: 2 }}>
                Ραντεβού με Κτηνίατρο
            </Typography>
        
            <Box sx={{ position: 'absolute', bottom: -30, width: '100%', display: 'flex', justifyContent: 'center', zIndex: 3 }}>
                <Paper elevation={3} sx={{ px: 4, py: 1.5, borderRadius: '50px', display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'white' }}>
                    {STEPS.map((label, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ 
                                width: 30, height: 30, borderRadius: '50%', 
                                border: index === activeStep ? '2px solid #3B82F6' : '1px solid #ccc',
                                color: index === activeStep ? '#3B82F6' : (index < activeStep ? '#4CAF50' : '#999'),
                              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem',
                              bgcolor: index === activeStep ? '#E3F2FD' : 'white',
                              animation: index === activeStep ? `${pulseRing} 2.2s ease-in-out infinite` : 'none'
                            }}>
                                {index < activeStep ? '✓' : index + 1}
                            </Box>
                            <Typography variant="caption" sx={{ ml: 1, display: { xs: 'none', md: 'block' }, fontWeight: index === activeStep ? 'bold' : 'normal' }}>
                                {label}
                            </Typography>
                            {index < STEPS.length - 1 && <Box sx={{ width: 20, height: 1, bgcolor: '#ccc', mx: 1, display: { xs: 'none', sm: 'block' } }} />}
                        </Box>
                    ))}
                </Paper>
            </Box>
        </Box>

        {/* Sidebar (overlay, not affecting layout) */}
        {user && <DashboardSidebar noSpacer />}

        {/* Content layout below hero */}
        <Box sx={{ display: 'flex', flex: 1, maxWidth: '100%', overflow: 'hidden', p: 2, gap: 2 }}>

          <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <Container maxWidth="md" sx={{ mt: 2 }}>
            
            {activeStep === 0 && <StepVetList />}
            {activeStep === 1 && <StepCalendar />}
            {activeStep === 2 && <StepSelectPet />}
            {activeStep === 3 && <StepPreview />}

            {/* NAVIGATION BUTTONS */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 6 }}>
                    <Button 
                        variant="contained" color="error" 
                        onClick={() => activeStep === 0 ? navigate('/owner') : handleBack()}
                        sx={{ px: 4, fontWeight: 'bold' }}
                    >
                        {activeStep === 0 ? 'Ακύρωση' : 'Προηγούμενο'}
                    </Button>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {activeStep === STEPS.length - 1 && (
                        <Button variant="outlined" color="secondary" onClick={handleSaveDraft} sx={{ px: 3 }}>
                          Αποθήκευση Πρόχειρου
                        </Button>
                      )}
                      <Button 
                        variant="contained" color="success" endIcon={<ArrowForwardIcon />} 
                        sx={{ px: 4, fontWeight: 'bold', color: 'white' }}
                        onClick={handleNext}
                      >
                        {activeStep === STEPS.length - 1 ? 'Ολοκλήρωση' : 'Επόμενο'}
                      </Button>
                    </Box>
                </Box>

            </Container>

        <Dialog open={openSuccess} onClose={() => navigate('/owner')} PaperProps={{ sx: { borderRadius: '20px', p: 4, textAlign: 'center' } }}>
            <DialogContent>
                <CheckCircleIcon sx={{ fontSize: 60, color: '#4CAF50', mb: 2 }} />
                <Typography variant="h5" fontWeight="bold">Ολοκλήρωση με επιτυχία</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                    Το ραντεβού σας καταχωρήθηκε επιτυχώς!
                </Typography>
                <Button variant="contained" fullWidth sx={{ bgcolor: '#263238' }} onClick={() => navigate('/owner')}>
                    Επιστροφή στο Dashboard
                </Button>
            </DialogContent>
        </Dialog>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}