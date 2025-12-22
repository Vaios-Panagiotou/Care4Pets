import React from 'react';
import { Box, Container, Grid, Typography, Link, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PetsIcon from '@mui/icons-material/Pets';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: '#1a2327', color: '#b0bec5', py: 5, mt: 'auto' }}>
      <Container>
        <Grid container spacing={4} alignItems="flex-start">
          {/* Company Info */}
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <PetsIcon sx={{ color: '#f6ad55', mr: 1, fontSize: 28 }} />
              <Typography variant="h6" color="white" fontWeight="bold">Care4Pets</Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 1.5, lineHeight: 1.5 }}>
              Η νούμερο 1 πλατφόρμα στην Ελλάδα για την υγεία των κατοικιδίων.
            </Typography>
            <Typography variant="caption" sx={{ color: '#78909c', fontSize: '0.75rem' }}>
              © 2025 Care4Pets. Όλα τα δικαιώματα κατοχυρωμένα.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle1" color="white" gutterBottom fontWeight="600" sx={{ mb: 1.5 }}>
              Σύνδεσμοι
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
              <Link onClick={() => navigate('/')} sx={{ color: '#b0bec5', cursor: 'pointer', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: 'white' } }}>Αρχική</Link>
              <Link onClick={() => navigate('/lost-pets')} sx={{ color: '#b0bec5', cursor: 'pointer', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: 'white' } }}>Απολεσθέντα</Link>
              <Link onClick={() => navigate('/news')} sx={{ color: '#b0bec5', cursor: 'pointer', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: 'white' } }}>Νέα</Link>
              <Link onClick={() => navigate('/login')} sx={{ color: '#b0bec5', cursor: 'pointer', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: 'white' } }}>Σύνδεση</Link>
            </Box>
          </Grid>

          {/* Legal */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle1" color="white" gutterBottom fontWeight="600" sx={{ mb: 1.5 }}>
              Νομικά
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
              <Link onClick={() => navigate('/terms')} sx={{ color: '#b0bec5', cursor: 'pointer', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: 'white' } }}>Όροι Χρήσης</Link>
              <Link onClick={() => navigate('/privacy')} sx={{ color: '#b0bec5', cursor: 'pointer', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: 'white' } }}>Πολιτική Απορρήτου</Link>
              <Link onClick={() => navigate('/cookies')} sx={{ color: '#b0bec5', cursor: 'pointer', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: 'white' } }}>Cookies</Link>
              <Link onClick={() => navigate('/gdpr')} sx={{ color: '#b0bec5', cursor: 'pointer', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: 'white' } }}>GDPR</Link>
            </Box>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" color="white" gutterBottom fontWeight="600" sx={{ mb: 1.5 }}>
              Επικοινωνία
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <PhoneIcon fontSize="small" sx={{ color: '#f6ad55', fontSize: 18 }} />
                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>210-1234567</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <EmailIcon fontSize="small" sx={{ color: '#f6ad55', fontSize: 18 }} />
                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>support@care4pets.gr</Typography>
              </Box>
              <Link onClick={() => navigate('/contact')} sx={{ color: '#f6ad55', cursor: 'pointer', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600, mt: 0.5, '&:hover': { color: '#ffb74d' } }}>
                Φόρμα Επικοινωνίας →
              </Link>
            </Box>
          </Grid>

          {/* Social Media */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" color="white" gutterBottom fontWeight="600" sx={{ mb: 1.5 }}>
              Social Media
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, '& > svg': { cursor: 'pointer', transition: 'all 0.3s', color: '#b0bec5', fontSize: 24, '&:hover': { color: '#f6ad55', transform: 'translateY(-2px)' } } }}>
              <FacebookIcon />
              <InstagramIcon />
              <TwitterIcon />
              <YouTubeIcon />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}