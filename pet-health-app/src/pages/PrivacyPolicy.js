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
            Τελευταία ενημέρωση: 22 Δεκεμβρίου 2025
          </Typography>

          <Box sx={{ '& > *': { mb: 3 } }}>
            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                1. Εισαγωγή
              </Typography>
              <Typography variant="body1" paragraph>
                Η Care4Pets σέβεται την ιδιωτικότητά σας και δεσμεύεται να προστατεύσει τα προσωπικά σας δεδομένα. 
                Η παρούσα πολιτική απορρήτου εξηγεί πώς συλλέγουμε, χρησιμοποιούμε και προστατεύουμε τις πληροφορίες σας.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                2. Συλλογή Δεδομένων
              </Typography>
              <Typography variant="body1" paragraph>
                Συλλέγουμε τα ακόλουθα είδη πληροφοριών:
              </Typography>
              <Typography variant="body1" component="div">
                <ul>
                  <li>Στοιχεία ταυτοποίησης (όνομα, email, τηλέφωνο)</li>
                  <li>Πληροφορίες κατοικιδίων (όνομα, είδος, ιατρικό ιστορικό)</li>
                  <li>Τεχνικά δεδομένα (IP address, browser, συσκευή)</li>
                  <li>Δεδομένα χρήσης (αλληλεπιδράσεις με την πλατφόρμα)</li>
                </ul>
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                3. Χρήση Δεδομένων
              </Typography>
              <Typography variant="body1" paragraph>
                Χρησιμοποιούμε τα δεδομένα σας για:
              </Typography>
              <Typography variant="body1" component="div">
                <ul>
                  <li>Παροχή και βελτίωση των υπηρεσιών μας</li>
                  <li>Επικοινωνία σχετικά με το λογαριασμό και τις υπηρεσίες</li>
                  <li>Εξατομίκευση της εμπειρίας χρήσης</li>
                  <li>Αποστολή ειδοποιήσεων και ενημερώσεων</li>
                  <li>Ανάλυση και βελτίωση της πλατφόρμας</li>
                </ul>
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                4. Κοινοποίηση Δεδομένων
              </Typography>
              <Typography variant="body1" paragraph>
                Δεν πουλάμε ούτε μοιραζόμαστε τα προσωπικά σας δεδομένα με τρίτους, εκτός εάν:
              </Typography>
              <Typography variant="body1" component="div">
                <ul>
                  <li>Έχουμε τη συγκατάθεσή σας</li>
                  <li>Απαιτείται από το νόμο</li>
                  <li>Είναι απαραίτητο για την παροχή των υπηρεσιών μας</li>
                </ul>
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                5. Ασφάλεια
              </Typography>
              <Typography variant="body1" paragraph>
                Εφαρμόζουμε κατάλληλα τεχνικά και οργανωτικά μέτρα για την προστασία των δεδομένων σας από 
                μη εξουσιοδοτημένη πρόσβαση, απώλεια ή καταστροφή.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                6. Τα Δικαιώματά Σας
              </Typography>
              <Typography variant="body1" paragraph>
                Έχετε το δικαίωμα:
              </Typography>
              <Typography variant="body1" component="div">
                <ul>
                  <li>Πρόσβασης στα δεδομένα σας</li>
                  <li>Διόρθωσης ανακριβών πληροφοριών</li>
                  <li>Διαγραφής των δεδομένων σας</li>
                  <li>Εναντίωσης στην επεξεργασία</li>
                  <li>Φορητότητας των δεδομένων</li>
                </ul>
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                7. Επικοινωνία
              </Typography>
              <Typography variant="body1" paragraph>
                Για ερωτήσεις σχετικά με την πολιτική απορρήτου, επικοινωνήστε: support@care4pets.gr
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
