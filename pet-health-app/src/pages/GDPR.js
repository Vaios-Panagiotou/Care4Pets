import React from 'react';
import { Container, Typography, Box, Paper, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SecurityIcon from '@mui/icons-material/Security';

export default function GDPR() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 6 }}>
      <Container maxWidth="md">
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)}
          sx={{ mb: 3 }}
        >
          Πίσω
        </Button>
        
        <Paper sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <SecurityIcon sx={{ fontSize: 48, color: 'primary.main' }} />
            <Typography variant="h3" fontWeight="bold" color="primary">
              GDPR με απλά λόγια
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Τελευταία ενημέρωση: 6 Ιανουαρίου 2026
          </Typography>

          <Alert severity="info" sx={{ mb: 3 }}>
            Σεβόμαστε την ιδιωτικότητά σας. Συλλέγουμε μόνο ό,τι χρειάζεται για να λειτουργεί η εφαρμογή και να υποστηρίζουμε τα κατοικίδιά σας.
          </Alert>

          <Box sx={{ '& > *': { mb: 3 } }}>
            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Τι κρατάμε
              </Typography>
              <Typography variant="body1">
                Βασικά στοιχεία λογαριασμού (όνομα, email), προφίλ κατοικιδίων και αρχεία ραντεβού/κριτικών. Δεν πουλάμε δεδομένα και δεν χρησιμοποιούμε δεδομένα για διαφημίσεις.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Τα δικαιώματά σας
              </Typography>
              <Typography variant="body1">
                Μπορείτε να ζητήσετε πρόσβαση, διόρθωση ή διαγραφή των δεδομένων σας. Χρειάζεστε αντίγραφο; Θα σας το στείλουμε σε κοινό format.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Πώς τα προστατεύουμε
              </Typography>
              <Typography variant="body1">
                Περιορισμένη πρόσβαση, ασφαλής αποθήκευση και καθαρή λογική συλλογής. Ό,τι δεν χρειάζεται — δεν αποθηκεύεται.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Επικοινωνία
              </Typography>
              <Typography variant="body1">
                Για αιτήματα σχετικά με τα δεδομένα σας στείλτε email στο support@care4pets.gr. Θα απαντήσουμε σύντομα.
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
