import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Container,
  Menu, MenuItem, TextField, InputAdornment, Autocomplete, Popper, IconButton,
  Breadcrumbs, Link, Badge
} from '@mui/material';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import PetsIcon from '@mui/icons-material/Pets';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArticleIcon from '@mui/icons-material/Article';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PageviewIcon from '@mui/icons-material/Pageview';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

// News data for search suggestions
import { NEWS_DATA } from '../pages/News';

// Styling is inherited from the app's global theme

// Base search entries
const BASE_SEARCH_DATA = [
  { type: 'page', title: 'Τα Κατοικίδιά μου', path: '/owner/pets', icon: <PetsIcon /> },
  { type: 'page', title: 'Ιστορικό & Ραντεβού', path: '/owner/history', icon: <MedicalServicesIcon /> },
  { type: 'page', title: 'Εύρεση Κτηνίατρου', path: '/owner/search', icon: <SearchIcon /> },
  { type: 'page', title: 'Προφίλ', path: '/owner/profile', icon: <PetsIcon /> },
  { type: 'page', title: 'Επικοινωνία', path: '/contact', icon: <SearchIcon /> },
  { type: 'page', title: 'Χαμένα Κατοικίδια', path: '/lost-pets', icon: <PageviewIcon /> },
  { type: 'page', title: 'Νέα & Ενημέρωση', path: '/news', icon: <ArticleIcon /> },
  // Vets
  { type: 'vet', title: 'Δρ. Ιωάννης Σμυρνής - Παθολογία', path: '/owner/search', icon: <LocalHospitalIcon />, keywords: 'κτηνίατρος παθολογία αθήνα' },
  { type: 'vet', title: 'Δρ. Ελένη Καρρά - Καρδιολογία', path: '/owner/search', icon: <LocalHospitalIcon />, keywords: 'κτηνίατρος καρδιολογία' },
  { type: 'vet', title: 'Δρ. Γιώργος Παπαδόπουλος - Ορθοπεδική', path: '/owner/search', icon: <LocalHospitalIcon />, keywords: 'κτηνίατρος ορθοπεδική θεσσαλονίκη' },
  { type: 'vet', title: 'Δρ. Μαρία Δημητρίου - Δερματολογία', path: '/owner/search', icon: <LocalHospitalIcon />, keywords: 'κτηνίατρος δερματολογία' }
];

// Combine base search entries with news items
const SEARCH_DATA = [
  ...BASE_SEARCH_DATA,
  ...NEWS_DATA.map(news => ({
    type: 'news',
    title: news.title,
    path: `/news/${news.id}`,
    icon: <ArticleIcon />,
    keywords: `${news.category} ${news.title}`
  }))
];

export default function Navbar() {
  const [anchorElGenika, setAnchorElGenika] = useState(null);
  const [anchorElVet, setAnchorElVet] = useState(null);
  const [anchorElOwner, setAnchorElOwner] = useState(null);
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const [searchValue, setSearchValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [crumbsCollapsed, setCrumbsCollapsed] = useState(false);
  const lastToggleY = useRef(0);
  const lastY = useRef(0);
  const crumbsContentRef = useRef(null);
  const [crumbsHeight, setCrumbsHeight] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleOpenMenu = (event, setAnchor) => setAnchor(event.currentTarget);
  const handleCloseMenu = (setAnchor) => setAnchor(null);

  const handleSearchSelect = (event, value) => {
    if (value && value.path) {
      navigate(value.path);
      setInputValue('');
      setSearchValue(null);
    }
  };

  const handleLogout = () => {
    logout();
    handleCloseMenu(setAnchorElProfile);
    navigate('/login');
  };

  const navButtonStyle = { fontSize: '16px', color: '#546e7a', '&:hover': { color: '#00695c', backgroundColor: 'transparent' } };

  // Breadcrumb labels (Greek)
  const routeNameMap = {
    owner: 'Ιδιοκτήτης',
    vet: 'Κτηνίατρος',
    contact: 'Επικοινωνία',
    'lost-pets': 'Απολεσθέντα',
    history: 'Ιστορικό',
    pets: 'Τα Κατοικίδιά μου',
    search: 'Αναζήτηση Κτηνιάτρου',
    profile: 'Προφίλ',
    schedule: 'Πρόγραμμα',
    clinic: 'Κλινική',
    records: 'Καταγραφές',
    news: 'Νέα'
  };
  const pathnames = location.pathname.split('/').filter(Boolean);

  // Collapse breadcrumbs on downward scroll and show on upward scroll
  useEffect(() => {
    lastY.current = window.scrollY || 0;
    lastToggleY.current = lastY.current;
    const downThreshold = 80; // collapse after ~80px down
    const upThreshold = 60;   // show after ~60px up
    const onScroll = () => {
      const y = window.scrollY || 0;
      const delta = y - lastY.current;
      const goingDown = delta > 0;
      const goingUp = delta < 0;
      if (goingDown) {
        if (!crumbsCollapsed && y - lastToggleY.current > downThreshold) {
          setCrumbsCollapsed(true);
          lastToggleY.current = y;
        }
      } else if (goingUp) {
        if (crumbsCollapsed && lastToggleY.current - y > upThreshold) {
          setCrumbsCollapsed(false);
          lastToggleY.current = y;
        }
        if (y < 8 && crumbsCollapsed) {
          setCrumbsCollapsed(false);
          lastToggleY.current = y;
        }
      }
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [crumbsCollapsed]);

  // Measure breadcrumb content height for smooth height animation
  useLayoutEffect(() => {
    const measure = () => {
      const el = crumbsContentRef.current;
      const h = el ? el.offsetHeight : 0;
      setCrumbsHeight(h);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [location.pathname]);

  // Fetch notifications based on role
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.id) { setNotifications([]); return; }
      setLoadingNotifications(true);
      try {
        // Owner: show vet confirmations/cancellations
        if (user.role === 'owner') {
          const res = await fetch(`http://localhost:3001/appointments?ownerId=${user.id}`);
          const data = res.ok ? await res.json() : [];
          const items = (Array.isArray(data) ? data : [])
            .filter(a => a.status === 'confirmed' || a.status === 'cancelled')
            .sort((a,b) => {
              const ta = a.updatedAt ? Date.parse(a.updatedAt) : (typeof a.id === 'number' ? a.id : 0);
              const tb = b.updatedAt ? Date.parse(b.updatedAt) : (typeof b.id === 'number' ? b.id : 0);
              return tb - ta;
            })
            .slice(0, 6)
            .map(a => ({
              id: a.id,
              kind: a.status,
              text: a.status === 'confirmed'
                ? `Αποδοχή ραντεβού για ${a.petName || 'κατοικίδιο'} • ${a.date} ${a.time}`
                : (a.cancelledBy === 'vet'
                    ? `Ακύρωση από κτηνίατρο • ${a.petName || ''} • ${a.cancelReason || ''}`
                    : `Ακύρωση ραντεβού • ${a.petName || ''}`),
              when: a.updatedAt || a.date,
              to: '/owner/history'
            }));
          setNotifications(items);
        } else if (user.role === 'vet') {
          // Vet: show new pending appointments
          const res = await fetch(`http://localhost:3001/appointments?vetUserId=${user.id}`);
          let data = res.ok ? await res.json() : [];
          // Fallback: if none found via vetUserId, try vetId
          if (!Array.isArray(data) || data.length === 0) {
            const alt = await fetch(`http://localhost:3001/appointments?vetId=${user.id}`);
            data = alt.ok ? await alt.json() : [];
          }
          const list = (Array.isArray(data) ? data : []);
          const newReqItems = list
            .filter(a => a.status === 'pending')
            .sort((a,b) => {
              const ta = a.updatedAt ? Date.parse(a.updatedAt) : (typeof a.id === 'number' ? a.id : 0);
              const tb = b.updatedAt ? Date.parse(b.updatedAt) : (typeof b.id === 'number' ? b.id : 0);
              return tb - ta;
            })
            .slice(0, 6)
            .map(a => ({
              id: a.id,
              kind: 'pending',
              text: `Νέο ραντεβού: ${a.ownerName || 'Ιδιοκτήτης'} • ${a.petName || ''} • ${a.date} ${a.time}`,
              when: a.updatedAt || a.date,
              to: '/vet/schedule'
            }));
          const cancelledByOwnerItems = list
            .filter(a => a.status === 'cancelled' && a.cancelledBy === 'owner')
            .sort((a,b) => {
              const ta = a.updatedAt ? Date.parse(a.updatedAt) : (typeof a.id === 'number' ? a.id : 0);
              const tb = b.updatedAt ? Date.parse(b.updatedAt) : (typeof b.id === 'number' ? b.id : 0);
              return tb - ta;
            })
            .slice(0, 6)
            .map(a => ({
              id: a.id,
              kind: 'cancelled',
              text: `Ακύρωση από ιδιοκτήτη: ${a.ownerName || ''} • ${a.petName || ''}${a.cancelReason ? ` • ${a.cancelReason}` : ''}`,
              when: a.updatedAt || a.date,
              to: '/vet/schedule'
            }));
          setNotifications([...newReqItems, ...cancelledByOwnerItems]);
        } else {
          setNotifications([]);
        }
      } catch (e) {
        setNotifications([]);
      } finally {
        setLoadingNotifications(false);
      }
    };
    fetchNotifications();
  }, [user]);

  // Compute unread count from localStorage
  useEffect(() => {
    const key = user?.id ? `notifRead_${user.id}` : null;
    const readIds = key ? JSON.parse(localStorage.getItem(key) || '[]') : [];
    const unread = notifications.filter(n => !readIds.includes(n.id)).length;
    setUnreadCount(unread);
  }, [notifications, user]);

  const markAllRead = () => {
    const key = user?.id ? `notifRead_${user.id}` : null;
    if (!key) return;
    const current = JSON.parse(localStorage.getItem(key) || '[]');
    const ids = notifications.map(n => n.id);
    const merged = Array.from(new Set([...current, ...ids]));
    localStorage.setItem(key, JSON.stringify(merged));
    setUnreadCount(0);
  };

  return (
      <AppBar id="app-topbar" position="fixed" elevation={0} sx={{ backgroundColor: 'white', borderBottom: '1px solid #e0e0e0', zIndex: 1300 }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: 80 }}>

            {/* Logo */}
            <Box component="a" href="/" sx={{ display: 'flex', alignItems: 'center', flexGrow: 0, mr: 4, textDecoration: 'none', cursor: 'pointer' }}>
              <Box sx={{ bgcolor: 'primary.main', borderRadius: '12px', p: 1, mr: 1.5, display: 'flex' }}>
                <PetsIcon sx={{ color: 'white', fontSize: 30 }} />
              </Box>
              <Typography variant="h5" color="primary">Care4Pets</Typography>
            </Box>

            {/* Desktop Menu */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              {/* Γενικά */}
              <Box>
                <Button endIcon={<KeyboardArrowDownIcon />} onClick={(e) => handleOpenMenu(e, setAnchorElGenika)} sx={navButtonStyle}>Γενικά</Button>
                <Menu anchorEl={anchorElGenika} open={Boolean(anchorElGenika)} onClose={() => handleCloseMenu(setAnchorElGenika)}>
                  <MenuItem onClick={() => { handleCloseMenu(setAnchorElGenika); navigate('/lost-pets'); }}>Αναζήτηση χαμένου κατοικιδίου</MenuItem>
                  <MenuItem onClick={() => { handleCloseMenu(setAnchorElGenika); navigate('/news'); }}>Νέα και Ενημέρωση</MenuItem>
                </Menu>
              </Box>

              {/* Κτηνίατροι */}
              <Box>
                <Button endIcon={<KeyboardArrowDownIcon />} onClick={(e) => handleOpenMenu(e, setAnchorElVet)} sx={navButtonStyle}>Κτηνίατροι</Button>
                <Menu anchorEl={anchorElVet} open={Boolean(anchorElVet)} onClose={() => handleCloseMenu(setAnchorElVet)}>
                  <MenuItem onClick={() => { handleCloseMenu(setAnchorElVet); navigate('/vet'); }}>Σχετικά με Κτηνίατρο</MenuItem>
                  <MenuItem onClick={() => { handleCloseMenu(setAnchorElVet); navigate('/vet/history'); }}>Ιστορικό</MenuItem>
                  <MenuItem onClick={() => { handleCloseMenu(setAnchorElVet); navigate('/vet/schedule'); }}>Πρόγραμμα</MenuItem>
                  <MenuItem onClick={() => { handleCloseMenu(setAnchorElVet); navigate('/vet/clinic'); }}>Το Ιατρείο</MenuItem>
                  <MenuItem onClick={() => { handleCloseMenu(setAnchorElVet); navigate('/vet/records'); }}>Καταγραφές</MenuItem>
                </Menu>
              </Box>

              {/* Ιδιοκτήτες */}
              <Box>
                <Button endIcon={<KeyboardArrowDownIcon />} onClick={(e) => handleOpenMenu(e, setAnchorElOwner)} sx={navButtonStyle}>Ιδιοκτήτες</Button>
                <Menu anchorEl={anchorElOwner} open={Boolean(anchorElOwner)} onClose={() => handleCloseMenu(setAnchorElOwner)}>
                  <MenuItem onClick={() => { handleCloseMenu(setAnchorElOwner); navigate('/owner'); }}>Σχετικά με Ιδιοκτήτη</MenuItem>
                  <MenuItem onClick={() => { handleCloseMenu(setAnchorElOwner); navigate('/owner/pets'); }}>Το Κατοικίδιό μου</MenuItem>
                  <MenuItem onClick={() => { handleCloseMenu(setAnchorElOwner); navigate('/owner/history'); }}>Ιστορικό</MenuItem>
                  <MenuItem onClick={() => { handleCloseMenu(setAnchorElOwner); navigate('/owner/search'); }}>Ραντεβού με Κτηνίατρο</MenuItem>
                  <MenuItem onClick={() => { handleCloseMenu(setAnchorElOwner); navigate('/lost-pets?view=form'); }}>Δήλωση Απώλειας</MenuItem>
                </Menu>
              </Box>

              <Button onClick={() => navigate('/contact')} sx={navButtonStyle}>Επικοινωνία</Button>
            </Box>

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Autocomplete
                freeSolo
                options={SEARCH_DATA}
                value={searchValue}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
                onChange={handleSearchSelect}
                getOptionLabel={(option) => typeof option === 'string' ? option : option.title}
                filterOptions={(options, { inputValue }) => {
                  const filtered = options.filter(option => {
                    const searchText = inputValue.toLowerCase();
                    return (
                      option.title.toLowerCase().includes(searchText) ||
                      (option.keywords && option.keywords.toLowerCase().includes(searchText))
                    );
                  });
                  return filtered.slice(0, 8);
                }}
                sx={{ width: 280 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Αναζήτηση..."
                    size="small"
                    sx={{
                      bgcolor: '#f5f5f5',
                      borderRadius: '20px',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '20px',
                        paddingRight: '8px !important'
                      }
                    }}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" sx={{ color: 'text.secondary', ml: 1 }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props} sx={{ display: 'flex', gap: 1.5, alignItems: 'center', py: 1 }}>
                    <Box sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}>
                      {option.icon}
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {option.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.type === 'page' ? 'Σελίδα' : option.type === 'vet' ? 'Κτηνίατρος' : 'Άρθρο'}
                      </Typography>
                    </Box>
                  </Box>
                )}
                PopperComponent={(props) => <Popper {...props} sx={{ '& .MuiAutocomplete-listbox': { maxHeight: '400px' } }} />}
              />

              {/* Quick Help (only for logged-in users) */}
              {user && (
                <IconButton
                  aria-label="help"
                  onClick={() => navigate(user?.role === 'vet' ? '/vet/help' : user ? '/owner/help' : '/news')}
                  sx={{ color: 'primary.main', bgcolor: '#e8f5e9', '&:hover': { bgcolor: '#d0f0d6' } }}
                  title="Οδηγός Χρήσης"
                >
                  <HelpOutlineIcon />
                </IconButton>
              )}

              {/* Notifications button (left of profile icon) */}
              {user && (
                <>
                  <IconButton
                    aria-label="notifications"
                    onClick={(e) => handleOpenMenu(e, setAnchorElNotifications)}
                    sx={{ color: 'primary.main', bgcolor: '#e0f2f1', '&:hover': { bgcolor: '#b2dfdb' } }}
                    title={user.role === 'owner' ? 'Ειδοποιήσεις Ραντεβού' : 'Νέα Ραντεβού'}
                  >
                    <Badge color="error" overlap="circular" badgeContent={unreadCount || 0}>
                      <NotificationsNoneIcon />
                    </Badge>
                  </IconButton>
                  <Menu anchorEl={anchorElNotifications} open={Boolean(anchorElNotifications)} onClose={() => handleCloseMenu(setAnchorElNotifications)}>
                    <MenuItem disabled sx={{ color: 'text.secondary', fontWeight: 700 }}>
                      {user.role === 'owner' ? 'Ειδοποιήσεις' : 'Κέντρο Ειδοποιήσεων'}
                    </MenuItem>
                    {notifications.length > 0 && unreadCount > 0 && (
                      <MenuItem onClick={() => { markAllRead(); }} sx={{ color: 'primary.main', fontWeight: 700 }}>
                        Μαρκάρισμα όλων ως αναγνωσμένα
                      </MenuItem>
                    )}
                    {loadingNotifications ? (
                      <MenuItem disabled>Φόρτωση…</MenuItem>
                    ) : notifications.length === 0 ? (
                      <MenuItem disabled>{user.role === 'owner' ? 'Δεν υπάρχουν ενημερώσεις' : 'Δεν υπάρχουν νέα αιτήματα'}</MenuItem>
                    ) : (
                      notifications.map(n => (
                        <MenuItem key={n.id} onClick={() => { handleCloseMenu(setAnchorElNotifications); navigate(n.to); }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{n.text}</Typography>
                            <Typography variant="caption" color="text.secondary">{n.when}</Typography>
                          </Box>
                        </MenuItem>
                      ))
                    )}
                  </Menu>
                </>
              )}

              {/* Conditionally render auth or profile buttons */}
              {!user ? (
                <>
                  <Button variant="outlined" color="primary" onClick={() => navigate('/register')} sx={{ borderRadius: '20px', px: 3 }}>Εγγραφή</Button>
                  <Button variant="contained" color="secondary" onClick={() => navigate('/login')} sx={{ borderRadius: '20px', px: 3, color: 'black' }}>Σύνδεση</Button>
                </>
              ) : (
                <>
                  <IconButton 
                    onClick={(e) => handleOpenMenu(e, setAnchorElProfile)}
                    sx={{ color: 'primary.main', bgcolor: '#e0f2f1', '&:hover': { bgcolor: '#b2dfdb' } }}
                  >
                    <AccountCircleIcon />
                  </IconButton>
                  <Menu anchorEl={anchorElProfile} open={Boolean(anchorElProfile)} onClose={() => handleCloseMenu(setAnchorElProfile)}>
                    <MenuItem disabled sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      {user.fullname}
                    </MenuItem>
                    <MenuItem onClick={() => { handleCloseMenu(setAnchorElProfile); navigate(user.role === 'owner' ? '/owner/profile' : '/vet/profile'); }}>
                      Προφίλ
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      Αποσύνδεση
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>

          </Toolbar>
          {pathnames.length > 0 && (
            <Box sx={{
              height: crumbsCollapsed ? 0 : crumbsHeight,
              opacity: crumbsCollapsed ? 0 : 1,
              transform: crumbsCollapsed ? 'translateY(-4px)' : 'translateY(0)',
              overflow: 'hidden',
              transition: 'height 220ms ease, opacity 160ms ease, transform 180ms ease',
            }}>
              <Box ref={crumbsContentRef} sx={{
                display: 'flex',
                alignItems: 'center',
                px: { xs: 2, md: 3 },
                py: 0.5,
                mx: 'auto',
                maxWidth: 'xl'
              }}>
                <Breadcrumbs
                  aria-label="breadcrumb"
                  separator={<NavigateNextIcon sx={{ fontSize: 16, color: 'text.disabled' }} />}
                  maxItems={4}
                  itemsBeforeCollapse={1}
                  itemsAfterCollapse={2}
                  sx={{
                    '& .MuiBreadcrumbs-li': {
                      fontWeight: 400,
                      fontSize: '0.8rem',
                    },
                    '& a': {
                      display: 'inline-flex',
                      alignItems: 'center',
                      color: 'text.secondary',
                      textDecoration: 'none',
                      px: 0.75,
                      py: 0.25,
                      borderRadius: 1,
                      transition: 'background-color 120ms ease, color 120ms ease',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      '&:hover': { bgcolor: 'action.hover', color: 'primary.main' },
                      '&:active': { transform: 'translateY(0.5px)' },
                      '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 }
                    }
                  }}
                >
                  <Link
                    component={RouterLink}
                    to="/"
                    underline="none"
                    title="Αρχική"
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <HomeIcon sx={{ mr: 0.5, fontSize: 16 }} /> Αρχική
                  </Link>
                  {pathnames.map((value, index) => {
                    const last = index === pathnames.length - 1;
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const name = routeNameMap[value] || value;
                    const isRole = value === 'owner' || value === 'vet';
                    const roleLink = value === 'owner' ? '/owner' : value === 'vet' ? '/vet' : null;
                    if (last) {
                      return (
                        <Typography key={to} aria-current="page" sx={{ color: 'text.primary', fontWeight: 700, px: 0.75, py: 0.25 }}>
                          {name}
                        </Typography>
                      );
                    }
                    const linkTarget = isRole && roleLink ? roleLink : to;
                    return (
                      <Link
                        key={to}
                        component={RouterLink}
                        to={linkTarget}
                        underline="none"
                        title={name}
                      >
                        {name}
                      </Link>
                    );
                  })}
                </Breadcrumbs>
              </Box>
            </Box>
          )}
        </Container>
      </AppBar>
  );
}
