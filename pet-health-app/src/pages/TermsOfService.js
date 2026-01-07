import React from 'react';
import { Container, Typography, Box, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function TermsOfService() {
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
          <Typography variant="h3" gutterBottom fontWeight="bold" color="primary">
            Όροι Χρήσης
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Τελευταία ενημέρωση: 6 Ιανουαρίου 2026
          </Typography>

          <Box sx={{ '& > *': { mb: 3 } }}>
            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                1. Συνοπτικά
              </Typography>
              <Typography variant="body1" paragraph>
                Χρησιμοποιώντας την εφαρμογή, συμφωνείτε να την αξιοποιείτε με σεβασμό και να παρέχετε ακριβείς πληροφορίες.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                2. Τι προσφέρουμε
              </Typography>
              <Typography variant="body1" paragraph>
                Διαχείριση προφίλ κατοικιδίων, ραντεβού και κριτικές. Δεν πρόκειται για ιατρικές συμβουλές· απευθυνθείτε στον κτηνίατρό σας.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                3. Υποχρεώσεις χρηστών
              </Typography>
              <Typography variant="body1" paragraph>
                Διατηρείτε ασφαλή τα στοιχεία πρόσβασης, ενημερώνετε έγκαιρα τα δεδομένα και δεν κάνετε κατάχρηση της υπηρεσίας.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                4. Περιεχόμενο
              </Typography>
              <Typography variant="body1" paragraph>
                Το περιεχόμενο της εφαρμογής προστατεύεται. Μην αντιγράφετε ή κάνετε χρήση χωρίς άδεια.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                5. Ευθύνη
              </Typography>
              <Typography variant="body1" paragraph>
                Καταβάλλουμε προσπάθεια για σταθερή λειτουργία, αλλά ενδέχονται σφάλματα. Χρησιμοποιείτε την εφαρμογή όπως είναι.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                6. Αλλαγές
              </Typography>
              <Typography variant="body1" paragraph>
                Μπορεί να ενημερώνουμε τους όρους. Οι αλλαγές ισχύουν από τη δημοσίευση.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                7. Επικοινωνία
              </Typography>
              <Typography variant="body1" paragraph>
                Έχετε απορίες; Στείλτε email στο support@care4pets.gr.
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
