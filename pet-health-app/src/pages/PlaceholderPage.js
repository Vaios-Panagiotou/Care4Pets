import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ConstructionIcon from '@mui/icons-material/Construction';
import PageHeader from './PageHeader';

export default function PlaceholderPage({ title }) {
  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', mt: 4 }}>
      <PageHeader />
      <Box sx={{ mt: 6 }}>
        <ConstructionIcon sx={{ fontSize: 80, color: '#00695c', mb: 2 }} />
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {title || "Υπό κατασκευή"}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Ετοιμάζουμε κάτι νέο εδώ. Ευχαριστούμε για την υπομονή — επιστρέφουμε σύντομα με ενημέρωση.
      </Typography>
      </Box>
    </Container>
  );
}