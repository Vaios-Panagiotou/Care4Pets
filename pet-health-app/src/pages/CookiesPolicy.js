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
            Τελευταία ενημέρωση: 6 Ιανουαρίου 2026
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
                Τι cookies χρησιμοποιούμε
              </Typography>
              <Typography variant="body1" paragraph>
                Χρησιμοποιούμε λίγα και απαραίτητα cookies για να λειτουργεί η εφαρμογή (σύνδεση, προτιμήσεις). Δεν κάνουμε παρακολούθηση για διαφημίσεις.
              </Typography>
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
                Επιλέγουμε μόνο βασική μέτρηση επίδοσης για να βελτιώνουμε την εμπειρία, χωρίς να ταυτοποιούμε χρήστες.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Cookies Λειτουργικότητας
              </Typography>
              <Typography variant="body1" paragraph>
                Κρατούν απλές προτιμήσεις (π.χ. γλώσσα), ώστε να μη χρειάζεται να τις επιλέγετε κάθε φορά.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Διαχείριση Cookies
              </Typography>
              <Typography variant="body1" paragraph>
                Μπορείτε να διαχειριστείτε τα cookies από τον browser σας. Αν τα απενεργοποιήσετε, ορισμένα μέρη μπορεί να μη λειτουργούν σωστά.
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
