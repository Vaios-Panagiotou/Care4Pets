import React from 'react';
import { Container, Box, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function VetHelp() {
  const navigate = useNavigate();
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Οδηγός Χρήσης (Κτηνίατρος)</Typography>
          <Typography variant="body2" color="text.secondary">Τα απολύτως απαραίτητα βήματα.</Typography>
        </Box>
        <Button variant="contained" color="primary" onClick={() => navigate('/vet')}>Πίσω στο Dashboard</Button>
      </Box>

      <List dense>
        <ListItem disableGutters>
          <ListItemText primary="Πρόγραμμα & Ραντεβού" secondary="Δείτε ημέρα/ώρα, αποδεχτείτε ή απορρίψτε pending κρατήσεις." />
          <Button variant="text" onClick={() => navigate('/vet/schedule')}>Μετάβαση</Button>
        </ListItem>
        <ListItem disableGutters>
          <ListItemText primary="Καταγραφές" secondary="Καταγράψτε πράξεις, φάρμακα, εμβολιασμούς ανά ζώο." />
          <Button variant="text" onClick={() => navigate('/vet/records')}>Μετάβαση</Button>
        </ListItem>
        <ListItem disableGutters>
          <ListItemText primary="Ιστορικό" secondary="Δείτε πρόσφατες επισκέψεις και αξιολογήσεις." />
          <Button variant="text" onClick={() => navigate('/vet/history')}>Μετάβαση</Button>
        </ListItem>
        <ListItem disableGutters>
          <ListItemText primary="Προφίλ Ιατρείου" secondary="Ενημερώστε στοιχεία, ωράρια και διαθέσιμες υπηρεσίες." />
          <Button variant="text" onClick={() => navigate('/vet/clinic')}>Μετάβαση</Button>
        </ListItem>
      </List>

      <Box sx={{ mt: 4 }}>
        <Typography variant="body2" color="text.secondary">
          Συμβουλή: Για αποφυγή διπλοκρατήσεων, τα slots δεσμεύονται ανά ημερομηνία/ώρα. Ελέγξτε το πρόγραμμα πριν αποδοχή.
        </Typography>
      </Box>
    </Container>
  );
}
