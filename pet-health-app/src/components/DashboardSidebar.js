import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, List, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Owner Icons
import PetsIcon from '@mui/icons-material/Pets';
import HistoryIcon from '@mui/icons-material/History';
import SearchIcon from '@mui/icons-material/Search';
import Person2Icon from '@mui/icons-material/Person2';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

// Vet Icons
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import DescriptionIcon from '@mui/icons-material/Description';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DashboardIcon from '@mui/icons-material/Dashboard';

const OWNER_NAV = [
  { id: 'pets', label: 'Τα Κατοικίδια', icon: PetsIcon, path: '/owner/pets' },
  { id: 'history', label: 'Ιστορικό', icon: HistoryIcon, path: '/owner/history' },
  { id: 'search', label: 'Εύρεση Ιατρού', icon: SearchIcon, path: '/owner/search' },
  { id: 'lost', label: 'Δήλωση Απώλειας', icon: NotificationsActiveIcon, path: '/lost-pets?view=form' },
  { id: 'profile', label: 'Προφίλ', icon: Person2Icon, path: '/owner/profile' },
  { id: 'help', label: 'Οδηγός Χρήσης', icon: HelpOutlineIcon, path: '/owner/help' },
];

const VET_NAV = [
  { id: 'history', label: 'Ιστορικό', icon: HistoryIcon, path: '/vet/history' },
  { id: 'schedule', label: 'Πρόγραμμα', icon: EventAvailableIcon, path: '/vet/schedule' },
  { id: 'clinic', label: 'Το Ιατρείο', icon: MedicalServicesIcon, path: '/vet/clinic' },
  { id: 'records', label: 'Καταγραφές', icon: DescriptionIcon, path: '/vet/records' },
  { id: 'help', label: 'Οδηγός Χρήσης', icon: HelpOutlineIcon, path: '/vet/help' },
];

export default function DashboardSidebar({ static: isStatic = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const containerRef = useRef(null);
  const sidebarRef = useRef(null);
  const [metrics, setMetrics] = useState({
    containerLeft: 0,
    containerWidth: 260,
    containerTop: 0,
    footerTop: Infinity,
    headerOffset: 80,
    sidebarHeight: 0,
  });
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    if (isStatic) return; // No scroll listeners in static mode
    const measure = () => {
      const container = containerRef.current;
      const sidebar = sidebarRef.current;
      const footer = document.getElementById('app-footer');
      const topbar = document.getElementById('app-topbar');
      if (!container || !sidebar || !footer) return;
      const rect = container.getBoundingClientRect();
      const footerRect = footer.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const headerHeight = topbar ? topbar.offsetHeight : 80;
      const next = {
        containerLeft: rect.left,
        containerWidth: rect.width,
        containerTop: rect.top + scrollY,
        footerTop: footerRect.top + scrollY,
        headerOffset: headerHeight,
        sidebarHeight: sidebar.offsetHeight,
      };
      setMetrics(next);
      // Also update translateY after measuring
      const topMargin = 24;
      const bottomMargin = 24;
      const minTopAbs = next.containerTop + topMargin;
      const maxTopAbs = next.footerTop - next.sidebarHeight - bottomMargin;
      const desiredAbsTop = Math.min(Math.max(scrollY + next.headerOffset, minTopAbs), maxTopAbs);
      const y = Math.round(desiredAbsTop - (scrollY + next.headerOffset));
      setTranslateY(Math.max(0, y));
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY || window.pageYOffset;
        const topMargin = 24;
        const bottomMargin = 24;
        const minTopAbs = metrics.containerTop + topMargin;
        const maxTopAbs = metrics.footerTop - metrics.sidebarHeight - bottomMargin;
        const desiredAbsTop = Math.min(Math.max(scrollY + metrics.headerOffset, minTopAbs), maxTopAbs);
        const y = Math.round(desiredAbsTop - (scrollY + metrics.headerOffset));
        setTranslateY(Math.max(0, y));
        ticking = false;
      });
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
    };
  }, [isStatic, metrics.containerTop, metrics.footerTop, metrics.sidebarHeight, metrics.headerOffset]);

  // Choose nav based on user role
  const navItems = user?.role === 'vet' ? VET_NAV : OWNER_NAV;

  // Check if current path matches
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path);

  const dashboardPath = user?.role === 'vet' ? '/vet' : '/owner';
  const rolePrimary = user?.role === 'vet' ? '#00897B' : '#1976d2';
  const roleTint = user?.role === 'vet' ? '#e0f2f1' : '#e3f2fd';

  // Sticky positioning without scroll listeners to avoid jitter.

  return (
    <Box ref={containerRef} sx={{ width: { xs: '100%', sm: 260 }, flexShrink: 0 }}>
       <Box
        ref={sidebarRef}
        sx={{
          bgcolor: 'white',
          borderRadius: 4,
          border: '2px solid #cfd8dc',
          boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
          p: 2,
          ...(isStatic ? {
            position: 'sticky',
            top: metrics.headerOffset,
            zIndex: 2
          } : {
            position: 'fixed',
            top: metrics.headerOffset,
            left: metrics.containerLeft,
            width: metrics.containerWidth,
            transform: `translateY(${translateY}px)`,
            willChange: 'transform',
            zIndex: 2,
          }),
        }}
      >
      <Box sx={{ position: 'sticky', top: 0, bgcolor: 'white' }}>
        <Typography variant="subtitle2" sx={{ color: '#607d8b', mb: 1, textAlign: 'center' }}>
          {user?.role === 'vet' ? 'Μενού Κτηνιάτρου' : 'Μενού Ιδιοκτήτη'}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 700, color: rolePrimary, mb: 1, textAlign: 'center' }}>
          Γρήγορη Πλοήγηση
        </Typography>
        <Divider sx={{ mb: 2 }} />
      </Box>

      <Box sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 160px)' }}>
        <List dense>
          <ListItemButton
            selected={location.pathname === dashboardPath}
            onClick={() => navigate(dashboardPath)}
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon>
              <DashboardIcon sx={{ color: rolePrimary }} />
            </ListItemIcon>
            <ListItemText primary="Πίνακας Ελέγχου" secondary={user?.role === 'vet' ? 'Αρχική σελίδα κτηνιάτρου' : 'Αρχική σελίδα ιδιοκτήτη'} />
          </ListItemButton>

          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <ListItemButton
                key={item.id}
                selected={active}
                onClick={() => navigate(item.path)}
                sx={{ borderRadius: 2 }}
              >
                <ListItemIcon>
                  <Icon sx={{ color: rolePrimary }} />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            );
          })}
        </List>

        <Divider sx={{ my: 2 }} />
        <Box sx={{ p: 2, bgcolor: roleTint, borderRadius: 2, border: `1px solid ${rolePrimary}` }}>
          <Typography variant="body2" sx={{ color: '#455a64' }}>
            Χρησιμοποιήστε το μενού για άμεση πρόσβαση στις βασικές ενότητες. Το πλαϊνό παραμένει σταθερό καθώς κάνετε κύλιση.
          </Typography>
        </Box>
      </Box>
      </Box>
      {/* Spacer only for fixed-follow mode */}
      {!isStatic && (<Box sx={{ height: metrics.sidebarHeight }} />)}
    </Box>
  );
}
