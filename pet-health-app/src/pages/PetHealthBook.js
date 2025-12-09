import React from 'react';
import { Box, Container, Typography, Paper, Grid, Divider, List, ListItem, ListItemText, Chip } from '@mui/material';
import { useParams } from 'react-router-dom';
import PageHeader from './PageHeader';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

// Mock Data για τα ζώα μας
const HEALTH_DATA = {
  1: { // ID 1 = Kouvelaj
    name: 'Kouvelaj',
    vaccines: [
      { name: 'Λύσσας (Rabies)', date: '12/05/2024', next: '12/05/2025', vet: 'Δρ. Παπαδόπουλος' },
      { name: 'DHPP (Τετραπλό)', date: '10/02/2024', next: '10/02/2025', vet: 'Δρ. Παπαδόπουλος' }
    ],
    history: [
      { date: '15/08/2024', reason: 'Γαστρεντερίτιδα', treatment: 'Αντιβίωση για 5 μέρες' },
      { date: '01/03/2024', reason: 'Ετήσιος Έλεγχος', treatment: 'Όλα φυσιολογικά' }
    ]
  },
  2: { // ID 2 = Pantiana
    name: 'Pantiana',
    vaccines: [
      { name: 'FVRCP (Τριπλό)', date: '20/06/2024', next: '20/06/2025', vet: 'Δρ. Κωνσταντίνου' }
    ],
    history: [
      { date: '10/09/2024', reason: 'Δερματική αλλεργία', treatment: 'Αλοιφή Betadine' }
    ]
  }
};

export default function PetHealthBook() {
  const { id } = useParams(); // Παίρνουμε το ID από το URL
  const data = HEALTH_DATA[id] || HEALTH_DATA[1]; // Fallback

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8', pb: 8 }}>
      <Container maxWidth="xl" sx={{ pt: 2 }}><PageHeader /></Container>
      <Container maxWidth="md">
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
           Βιβλιάριο Υγείας: {data.name}
        </Typography>

        {/* Εμβόλια */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: '16px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <VaccinesIcon color="primary" fontSize="large"/>
                <Typography variant="h6">Εμβολιασμοί</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List>
                {data.vaccines.map((v, i) => (
                    <ListItem key={i} sx={{ bgcolor: '#f9f9f9', mb: 1, borderRadius: '8px' }}>
                        <ListItemText 
                            primary={<Typography fontWeight="bold">{v.name}</Typography>} 
                            secondary={`Έγινε: ${v.date} | Κτηνίατρος: ${v.vet}`} 
                        />
                        <Chip label={`Επόμενο: ${v.next}`} color="success" size="small" variant="outlined" />
                    </ListItem>
                ))}
            </List>
        </Paper>

        {/* Ιστορικό */}
        <Paper sx={{ p: 3, borderRadius: '16px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <MedicalServicesIcon color="secondary" fontSize="large"/>
                <Typography variant="h6">Ιστορικό Επισκέψεων</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List>
                {data.history.map((h, i) => (
                    <ListItem key={i} sx={{ borderLeft: '4px solid #FFA000', bgcolor: '#fffde7', mb: 1, borderRadius: '4px' }}>
                        <ListItemText 
                            primary={h.reason} 
                            secondary={`${h.date} - ${h.treatment}`} 
                        />
                    </ListItem>
                ))}
            </List>
        </Paper>
      </Container>
    </Box>
  );
}