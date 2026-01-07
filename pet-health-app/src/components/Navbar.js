import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Container,
  Menu, MenuItem, TextField, InputAdornment, Autocomplete, Popper, IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
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
  const [searchValue, setSearchValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();
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

  return (
      <AppBar position="fixed" elevation={0} sx={{ backgroundColor: 'white', borderBottom: '1px solid #e0e0e0' }}>
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
                </Menu>
              </Box>

              {/* Ιδιοκτήτες */}
              <Box>
                <Button endIcon={<KeyboardArrowDownIcon />} onClick={(e) => handleOpenMenu(e, setAnchorElOwner)} sx={navButtonStyle}>Ιδιοκτήτες</Button>
                <Menu anchorEl={anchorElOwner} open={Boolean(anchorElOwner)} onClose={() => handleCloseMenu(setAnchorElOwner)}>
                  <MenuItem onClick={() => { handleCloseMenu(setAnchorElOwner); navigate('/owner/pets'); }}>Το Κατοικίδιό μου</MenuItem>
                  <MenuItem onClick={() => { handleCloseMenu(setAnchorElOwner); navigate('/owner/history'); }}>Ιστορικό</MenuItem>
                  <MenuItem onClick={() => { handleCloseMenu(setAnchorElOwner); navigate('/owner/search'); }}>Ραντεβού με Κτηνίατρο</MenuItem>
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
        </Container>
      </AppBar>
  );
}
