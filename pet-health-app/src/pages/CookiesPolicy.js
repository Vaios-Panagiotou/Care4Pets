import React from 'react';
import { Container, Typography, Box, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function CookiesPolicy() {
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
            Πολιτική Cookies
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Τελευταία ενημέρωση: 22 Δεκεμβρίου 2025
          </Typography>

          <Box sx={{ '& > *': { mb: 3 } }}>
            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Τι είναι τα Cookies;
              </Typography>
              <Typography variant="body1" paragraph>
                Τα cookies είναι μικρά αρχεία κειμένου που αποθηκεύονται στη συσκευή σας όταν επισκέπτεστε 
                την ιστοσελίδα μας. Χρησιμοποιούνται για να βελτιώσουν την εμπειρία χρήσης και να κάνουν την 
                πλατφόρμα πιο αποτελεσματική.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Τύποι Cookies που Χρησιμοποιούμε
              </Typography>
              
              <TableContainer sx={{ mt: 2, mb: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Τύπος</strong></TableCell>
                      <TableCell><strong>Σκοπός</strong></TableCell>
                      <TableCell><strong>Διάρκεια</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Απαραίτητα</TableCell>
                      <TableCell>Για τη λειτουργία της πλατφόρμας</TableCell>
                      <TableCell>Session</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Απόδοσης</TableCell>
                      <TableCell>Ανάλυση χρήσης και βελτιστοποίηση</TableCell>
                      <TableCell>1 έτος</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Λειτουργικότητας</TableCell>
                      <TableCell>Αποθήκευση προτιμήσεων χρήστη</TableCell>
                      <TableCell>1 έτος</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Marketing</TableCell>
                      <TableCell>Εξατομικευμένες διαφημίσεις</TableCell>
                      <TableCell>2 έτη</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Απαραίτητα Cookies
              </Typography>
              <Typography variant="body1" paragraph>
                Αυτά τα cookies είναι απαραίτητα για τη λειτουργία της ιστοσελίδας και δεν μπορούν να 
                απενεργοποιηθούν. Περιλαμβάνουν cookies σύνδεσης, ασφάλειας και προσβασιμότητας.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Cookies Απόδοσης
              </Typography>
              <Typography variant="body1" paragraph>
                Μας βοηθούν να κατανοήσουμε πώς οι επισκέπτες χρησιμοποιούν την πλατφόρμα μας, συλλέγοντας 
                ανώνυμα στατιστικά στοιχεία. Αυτό μας επιτρέπει να βελτιώσουμε τη λειτουργικότητα και την εμπειρία.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Cookies Λειτουργικότητας
              </Typography>
              <Typography variant="body1" paragraph>
                Αποθηκεύουν τις προτιμήσεις σας (π.χ. γλώσσα, περιοχή) ώστε να σας προσφέρουμε μια πιο 
                εξατομικευμένη εμπειρία.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Διαχείριση Cookies
              </Typography>
              <Typography variant="body1" paragraph>
                Μπορείτε να ελέγξετε ή να διαγράψετε τα cookies όποτε θέλετε μέσω των ρυθμίσεων του browser σας. 
                Ωστόσο, η απενεργοποίηση ορισμένων cookies μπορεί να επηρεάσει τη λειτουργικότητα της πλατφόρμας.
              </Typography>
              <Typography variant="body1" paragraph>
                Για περισσότερες πληροφορίες: <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer">www.aboutcookies.org</a>
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Επικοινωνία
              </Typography>
              <Typography variant="body1" paragraph>
                Για ερωτήσεις σχετικά με τη χρήση cookies: support@care4pets.gr
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
