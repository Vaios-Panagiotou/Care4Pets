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
              Συμμόρφωση GDPR
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Γενικός Κανονισμός Προστασίας Δεδομένων (GDPR)
          </Typography>

          <Alert severity="info" sx={{ mb: 3 }}>
            Η Care4Pets συμμορφώνεται πλήρως με τον Γενικό Κανονισμό Προστασίας Δεδομένων (EU) 2016/679
          </Alert>

          <Box sx={{ '& > *': { mb: 3 } }}>
            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Τι είναι το GDPR;
              </Typography>
              <Typography variant="body1" paragraph>
                Ο Γενικός Κανονισμός για την Προστασία Δεδομένων (GDPR) είναι ένας ευρωπαϊκός νόμος που 
                προστατεύει τα προσωπικά δεδομένα και την ιδιωτικότητα των πολιτών της ΕΕ. Ισχύει από τον 
                Μάιο του 2018 και επηρεάζει όλες τις επιχειρήσεις που επεξεργάζονται δεδομένα πολιτών της ΕΕ.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Τα Δικαιώματά Σας σύμφωνα με το GDPR
              </Typography>
              <Typography variant="body1" component="div">
                <ul style={{ lineHeight: 2 }}>
                  <li><strong>Δικαίωμα Πρόσβασης:</strong> Έχετε το δικαίωμα να ζητήσετε αντίγραφα των προσωπικών σας δεδομένων</li>
                  <li><strong>Δικαίωμα Διόρθωσης:</strong> Μπορείτε να ζητήσετε τη διόρθωση ανακριβών πληροφοριών</li>
                  <li><strong>Δικαίωμα Διαγραφής:</strong> Μπορείτε να ζητήσετε τη διαγραφή των δεδομένων σας</li>
                  <li><strong>Δικαίωμα Περιορισμού:</strong> Μπορείτε να περιορίσετε την επεξεργασία των δεδομένων σας</li>
                  <li><strong>Δικαίωμα Φορητότητας:</strong> Μπορείτε να λάβετε τα δεδομένα σας σε δομημένο format</li>
                  <li><strong>Δικαίωμα Εναντίωσης:</strong> Μπορείτε να αντιταχθείτε στην επεξεργασία των δεδομένων σας</li>
                </ul>
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Πώς Συμμορφωνόμαστε
              </Typography>
              <Typography variant="body1" paragraph>
                Η Care4Pets λαμβάνει τα ακόλουθα μέτρα για να διασφαλίσει τη συμμόρφωση με το GDPR:
              </Typography>
              <Typography variant="body1" component="div">
                <ul style={{ lineHeight: 2 }}>
                  <li>Διαφάνεια στη συλλογή και χρήση δεδομένων</li>
                  <li>Λήψη ρητής συγκατάθεσης για την επεξεργασία δεδομένων</li>
                  <li>Ασφαλής αποθήκευση και κρυπτογράφηση δεδομένων</li>
                  <li>Δυνατότητα εξαγωγής και διαγραφής δεδομένων</li>
                  <li>Ειδοποίηση για παραβιάσεις δεδομένων εντός 72 ωρών</li>
                  <li>Ορισμός Υπευθύνου Προστασίας Δεδομένων (DPO)</li>
                </ul>
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Νομική Βάση Επεξεργασίας
              </Typography>
              <Typography variant="body1" paragraph>
                Επεξεργαζόμαστε τα δεδομένα σας με βάση:
              </Typography>
              <Typography variant="body1" component="div">
                <ul>
                  <li>Συγκατάθεσή σας</li>
                  <li>Εκτέλεση σύμβασης</li>
                  <li>Νομική υποχρέωση</li>
                  <li>Έννομο συμφέρον</li>
                </ul>
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Διαβίβαση Δεδομένων
              </Typography>
              <Typography variant="body1" paragraph>
                Τα δεδομένα σας αποθηκεύονται σε servers εντός της Ευρωπαϊκής Ένωσης. Σε περίπτωση 
                διαβίβασης εκτός ΕΕ, διασφαλίζουμε κατάλληλες εγγυήσεις προστασίας.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Άσκηση Δικαιωμάτων
              </Typography>
              <Typography variant="body1" paragraph>
                Για να ασκήσετε οποιοδήποτε από τα δικαιώματά σας σύμφωνα με το GDPR, παρακαλούμε 
                επικοινωνήστε μαζί μας:
              </Typography>
              <Typography variant="body1" component="div">
                <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 2, mt: 2 }}>
                  <strong>Email:</strong> dpo@care4pets.gr<br/>
                  <strong>Τηλέφωνο:</strong> 210-1234567<br/>
                  <strong>Ταχυδρομική Διεύθυνση:</strong> Λεωφ. Συγγρού 234, 17671 Αθήνα
                </Box>
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Υποβολή Καταγγελίας
              </Typography>
              <Typography variant="body1" paragraph>
                Έχετε το δικαίωμα να υποβάλετε καταγγελία στην Αρχή Προστασίας Δεδομένων Προσωπικού 
                Χαρακτήρα (ΑΠΔΠΧ) εάν πιστεύετε ότι η επεξεργασία των δεδομένων σας παραβιάζει το GDPR.
              </Typography>
              <Typography variant="body1">
                <strong>ΑΠΔΠΧ:</strong> <a href="https://www.dpa.gr" target="_blank" rel="noopener noreferrer">www.dpa.gr</a>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
