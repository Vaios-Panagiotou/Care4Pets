import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, Collapse, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useNavigate } from 'react-router-dom';

export default function RoleHelpHint({ role }) {
  const navigate = useNavigate();
  const key = `helpSeen-${role}`;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(key);
      if (!seen) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, [key]);

  const closeAndRemember = () => {
    try { localStorage.setItem(key, '1'); } catch {}
    setOpen(false);
  };

  const goHelp = () => {
    navigate(role === 'vet' ? '/vet/help' : '/owner/help');
  };

  return (
    <Collapse in={open} timeout={300}>
      <Alert
        icon={<HelpOutlineIcon fontSize="inherit" />}
        severity="info"
        sx={{ borderRadius: 2, mb: 2 }}
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button size="small" variant="outlined" onClick={goHelp}>
              Άνοιγμα Οδηγού
            </Button>
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={closeAndRemember}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </Box>
        }
      >
        Νέος/α χρήστης; Δείτε ένα σύντομο «Οδηγός Χρήσης» για να ξεκινήσετε.
      </Alert>
    </Collapse>
  );
}
