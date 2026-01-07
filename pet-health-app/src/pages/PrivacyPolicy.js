import React from 'react';
import { Container, Typography, Box, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function PrivacyPolicy() {
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
            Πολιτική Απορρήτου
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Τελευταία ενημέρωση: 6 Ιανουαρίου 2026
          </Typography>

          <Box sx={{ '& > *': { mb: 3 } }}>
            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                1. Τι καλύπτουμε
              </Typography>
              <Typography variant="body1" paragraph>
                Χρησιμοποιούμε τα απολύτως απαραίτητα δεδομένα για να λειτουργεί η εφαρμογή: στοιχεία λογαριασμού, προφίλ κατοικιδίων και ιστορικά ραντεβού/κριτικών.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                2. Τι συλλέγουμε
              </Typography>
              <Typography variant="body1" paragraph>
                Συλλέγουμε:
              </Typography>
              <Typography variant="body1" component="div">
                <ul>
                  <li>Όνομα, email (και προαιρετικά τηλέφωνο)</li>
                  <li>Στοιχεία κατοικιδίων (όνομα, είδος, βασικές σημειώσεις)</li>
                  <li>Απλά τεχνικά δεδομένα για ασφάλεια και βελτίωση (π.χ. τύπος browser)</li>
                </ul>
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                3. Πώς τα χρησιμοποιούμε
              </Typography>
              <Typography variant="body1" paragraph>
                Χρήσεις:
              </Typography>
              <Typography variant="body1" component="div">
                <ul>
                  <li>Σύνδεση/ταυτοποίηση χρήστη</li>
                  <li>Διαχείριση κατοικιδίων και ραντεβού</li>
                  <li>Εμφάνιση κριτικών και ιστορικού</li>
                </ul>
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                4. Κοινοποίηση
              </Typography>
              <Typography variant="body1" paragraph>
                Δεν πουλάμε δεδομένα. Κοινοποιούμε μόνο όπου απαιτείται από τον νόμο ή για να λειτουργήσει η υπηρεσία (π.χ. αποθήκευση).
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                5. Ασφάλεια
              </Typography>
              <Typography variant="body1" paragraph>
                Υπάρχουν βασικά τεχνικά μέτρα και περιορισμένη πρόσβαση. Αν κάτι δεν χρειάζεται, δεν το κρατάμε.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                6. Τα δικαιώματά σας
              </Typography>
              <Typography variant="body1" paragraph>
                Μπορείτε να ζητήσετε:
              </Typography>
              <Typography variant="body1" component="div">
                <ul>
                  <li>Πρόσβαση/αντίγραφο</li>
                  <li>Διόρθωση ή διαγραφή</li>
                </ul>
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                7. Επικοινωνία
              </Typography>
              <Typography variant="body1" paragraph>
                Για οτιδήποτε σχετικό με τα δεδομένα σας, στείλτε email στο support@care4pets.gr.
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
