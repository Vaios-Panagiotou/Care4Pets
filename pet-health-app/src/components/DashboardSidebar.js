import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Owner Icons
import PetsIcon from '@mui/icons-material/Pets';
import HistoryIcon from '@mui/icons-material/History';
import SearchIcon from '@mui/icons-material/Search';
import Person2Icon from '@mui/icons-material/Person2';

// Vet Icons
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

const OWNER_NAV = [
  { id: 'pets', label: 'Τα Κατοικίδια', icon: PetsIcon, path: '/owner/pets' },
  { id: 'history', label: 'Ιστορικό', icon: HistoryIcon, path: '/owner/history' },
  { id: 'search', label: 'Εύρεση Ιατρού', icon: SearchIcon, path: '/owner/search' },
  { id: 'profile', label: 'Προφίλ', icon: Person2Icon, path: '/owner/profile' },
];

const VET_NAV = [
  { id: 'patients', label: 'Διαχείριση Ασθενών', icon: MedicalInformationIcon, path: '/vet/patients' },
  { id: 'schedule', label: 'Πρόγραμμα', icon: EventAvailableIcon, path: '/vet/schedule' },
  { id: 'clinic', label: 'Το Ιατρείο', icon: MedicalServicesIcon, path: '/vet/clinic' },
];

export default function DashboardSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Choose nav based on user role
  const navItems = user?.role === 'vet' ? VET_NAV : OWNER_NAV;

  // Check if current path matches
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path);

  return (
    <Box
      sx={{
        width: '60px',
        flexShrink: 0,
        bgcolor: 'white',
        borderRadius: 4,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        overflowY: 'auto',
        overflowX: 'hidden', // prevent horizontal scrollbar/controls
        py: 1.25,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.4,
        position: 'sticky',
        top: '20px',
        maxHeight: '520px',
        alignSelf: 'flex-start', // prevent stretching to full page height
      }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        
        return (
          <Tooltip key={item.id} title={item.label} placement="right" arrow>
            <Box
              onClick={() => navigate(item.path)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 0.75,
                mx: 0.25,
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                width: '42px',
                height: '42px',
                position: 'relative',
                // Active state styling
                bgcolor: active ? (user?.role === 'vet' ? '#e0f2f1' : '#e3f2fd') : 'transparent',
                border: active ? `2px solid ${user?.role === 'vet' ? '#00897B' : '#1976d2'}` : '2px solid transparent',
                color: active ? (user?.role === 'vet' ? '#00897B' : '#1976d2') : '#90a4ae',
                // Hover effects
                '&:hover': {
                  bgcolor: user?.role === 'vet' ? '#e0f2f1' : '#e3f2fd',
                  transform: 'scale(1.01)',
                  boxShadow: `0 3px 10px ${user?.role === 'vet' ? 'rgba(0,137,123,0.16)' : 'rgba(25,118,210,0.16)'}`,
                  color: user?.role === 'vet' ? '#00897B' : '#1976d2',
                },
              }}
            >
              <Icon sx={{ fontSize: '19px' }} />
            </Box>
          </Tooltip>
        );
      })}
    </Box>
  );
}
