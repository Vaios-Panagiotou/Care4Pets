import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';

export default function Footer() {
  return (
    <Box sx={{ bgcolor: '#1a2327', color: '#b0bec5', py: 8, mt: 'auto' }}>
      <Container>
        <Grid container spacing={5} alignItems="flex-start">
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PetsIcon sx={{ color: '#f6ad55', mr: 1 }} />
              <Typography variant="h6" color="white">Care4Pets</Typography>
            </Box>
            <Typography variant="body2">
              Η νούμερο 1 πλατφόρμα στην Ελλάδα για την υγεία και την ασφάλεια των κατοικιδίων.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="white" gutterBottom>Επικοινωνία</Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}><PhoneIcon fontSize="small" /> 210-1234567</Box>
            <Box sx={{ display: 'flex', gap: 1 }}><EmailIcon fontSize="small" /> support@care4pets.gr</Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="white" gutterBottom>Social Media</Typography>
            <Box sx={{ '& > svg': { mr: 2, cursor: 'pointer', transition: 'color 0.2s', color: '#b0bec5', '&:hover': { color: 'white' } } }}>
              <FacebookIcon /><InstagramIcon /><TwitterIcon /><YouTubeIcon />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}