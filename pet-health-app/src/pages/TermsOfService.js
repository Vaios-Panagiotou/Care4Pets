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
            Τελευταία ενημέρωση: 22 Δεκεμβρίου 2025
          </Typography>

          <Box sx={{ '& > *': { mb: 3 } }}>
            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                1. Αποδοχή Όρων
              </Typography>
              <Typography variant="body1" paragraph>
                Με την πρόσβαση και τη χρήση της πλατφόρμας Care4Pets, αποδέχεστε τους παρόντες όρους χρήσης. 
                Εάν δεν συμφωνείτε με οποιονδήποτε από τους όρους, παρακαλούμε μην χρησιμοποιείτε την υπηρεσία μας.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                2. Υπηρεσίες
              </Typography>
              <Typography variant="body1" paragraph>
                Η Care4Pets παρέχει ηλεκτρονική πλατφόρμα για τη διαχείριση της υγείας των κατοικιδίων, 
                σύνδεση με κτηνιάτρους, και υπηρεσίες αναζήτησης απολεσθέντων ζώων.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                3. Υποχρεώσεις Χρηστών
              </Typography>
              <Typography variant="body1" paragraph>
                Οι χρήστες υποχρεούνται να παρέχουν ακριβείς πληροφορίες κατά την εγγραφή και να διατηρούν 
                την εμπιστευτικότητα των στοιχείων πρόσβασής τους. Απαγορεύεται η χρήση της πλατφόρμας για 
                παράνομους σκοπούς ή η παραβίαση των δικαιωμάτων τρίτων.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                4. Πνευματικά Δικαιώματα
              </Typography>
              <Typography variant="body1" paragraph>
                Όλο το περιεχόμενο της πλατφόρμας (κείμενα, γραφικά, λογότυπα, εικόνες) προστατεύεται 
                από νόμους πνευματικής ιδιοκτησίας και ανήκει στην Care4Pets.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                5. Περιορισμός Ευθύνης
              </Typography>
              <Typography variant="body1" paragraph>
                Η Care4Pets δεν ευθύνεται για οποιαδήποτε ζημία προκύψει από τη χρήση ή την αδυναμία χρήσης 
                της πλατφόρμας. Οι πληροφορίες παρέχονται "ως έχουν" χωρίς καμία εγγύηση.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                6. Τροποποιήσεις
              </Typography>
              <Typography variant="body1" paragraph>
                Διατηρούμε το δικαίωμα να τροποποιήσουμε τους παρόντες όρους ανά πάσα στιγμή. 
                Οι αλλαγές θα ισχύουν αμέσως μετά τη δημοσίευσή τους στην πλατφόρμα.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                7. Επικοινωνία
              </Typography>
              <Typography variant="body1" paragraph>
                Για οποιαδήποτε ερώτηση σχετικά με τους όρους χρήσης, επικοινωνήστε μαζί μας στο 
                support@care4pets.gr ή τηλεφωνικά στο 210-1234567.
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
