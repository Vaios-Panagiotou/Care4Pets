import React from 'react';
import { Container, Box, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function OwnerHelp() {
  const navigate = useNavigate();
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Οδηγός Χρήσης (Ιδιοκτήτης)</Typography>
          <Typography variant="body2" color="text.secondary">Σύντομες οδηγίες για τα βασικά.</Typography>
        </Box>
        <Button variant="contained" color="primary" onClick={() => navigate('/owner')}>Πίσω στο Dashboard</Button>
      </Box>

      <List dense>
        <ListItem disableGutters>
          <ListItemText primary="Τα Κατοικίδιά μου" secondary="Δείτε/επεξεργαστείτε προφίλ, ανοίξτε το ηλεκτρονικό βιβλιάριο και εκτυπώστε." />
          <Button variant="text" onClick={() => navigate('/owner/pets')}>Μετάβαση</Button>
        </ListItem>
        <ListItem disableGutters>
          <ListItemText primary="Ιστορικό & Ραντεβού" secondary="Δείτε ιατρικές πράξεις και τα προγραμματισμένα ραντεβού σας." />
          <Button variant="text" onClick={() => navigate('/owner/history')}>Μετάβαση</Button>
        </ListItem>
        <ListItem disableGutters>
          <ListItemText primary="Εύρεση Κτηνιάτρου" secondary="Αναζητήστε κτηνίατρο, επιλέξτε διαθέσιμη ώρα. Η κράτηση ξεκινά ως pending." />
          <Button variant="text" onClick={() => navigate('/owner/search')}>Μετάβαση</Button>
        </ListItem>
        <ListItem disableGutters>
          <ListItemText primary="Χαμένα Κατοικίδια" secondary="Δημιουργήστε αγγελία απώλειας και αναζητήστε σχετικά ευρήματα." />
          <Button variant="text" onClick={() => navigate('/lost-pets')}>Μετάβαση</Button>
        </ListItem>
        <ListItem disableGutters>
          <ListItemText primary="Προφίλ" secondary="Ενημερώστε τα στοιχεία σας και ρυθμίσεις λογαριασμού." />
          <Button variant="text" onClick={() => navigate('/owner/profile')}>Μετάβαση</Button>
        </ListItem>
      </List>

      <Box sx={{ mt: 4 }}>
        <Typography variant="body2" color="text.secondary">
          Συμβουλή: Από το βιβλιάριο υγείας μπορείτε να επιλέξετε «Εκτύπωση Βιβλιαρίου» για γρήγορο PDF/print.
        </Typography>
      </Box>
    </Container>
  );
}
