import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ConstructionIcon from '@mui/icons-material/Construction';

export default function PlaceholderPage({ title }) {
  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', mt: 10 }}>
      <ConstructionIcon sx={{ fontSize: 80, color: '#00695c', mb: 2 }} />
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {title || "Υπό Κατασκευή"}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Αυτή η λειτουργία θα είναι σύντομα διαθέσιμη στην πλατφόρμα Care4Pets.
      </Typography>
      <Button variant="contained" href="/" startIcon={<ArrowBackIcon />} sx={{ bgcolor: '#00695c' }}>
        Επιστροφή
      </Button>
    </Container>
  );
}