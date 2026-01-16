import React, { useState } from 'react';
import { Container, Box, Paper, Grid, Typography, TextField, Button, Alert, LinearProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import UploadIcon from '@mui/icons-material/Upload';
import PlaceIcon from '@mui/icons-material/Place';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import { lostPetsAPI } from '../services/api';

export default function FoundPets() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    type: '',
    finderName: '',
    finderPhone: '',
    finderEmail: '',
    description: '',
    foundLocation: '',
    foundAt: '',
  });
  const [mapCoords, setMapCoords] = useState({ lat: 37.9838, lng: 23.7275 });
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    const readers = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });
    try {
      const dataUrls = await Promise.all(readers);
      setImages((prev) => [...prev, ...dataUrls]);
    } catch (err) {
      console.error(err);
    }
  };

  const validate = () => {
    if (!form.finderName || !form.finderPhone) return 'Συμπληρώστε όνομα και τηλέφωνο ευρέτη.';
    if (!form.description) return 'Συμπληρώστε μια σύντομη περιγραφή.';
    // Accept either a location name or map coordinates
    if (!form.foundLocation && !(mapCoords?.lat && mapCoords?.lng)) return 'Ορίστε περιοχή από τον χάρτη ή γράψτε σημείο εύρεσης.';
    if (!form.foundAt) return 'Συμπληρώστε ημερομηνία και ώρα εύρεσης.';
    return '';
  };

  const handleSubmit = async () => {
    const v = validate();
    if (v) { setError(v); return; }
    setError(''); setSubmitting(true);
    try {
      const payload = {
        type: 'found',
        animalType: form.type || 'Άλλο',
        description: form.description,
        location: form.foundLocation,
        foundAt: form.foundAt,
        finder: { name: form.finderName, phone: form.finderPhone, email: form.finderEmail },
        images,
        coords: mapCoords,
        createdAt: new Date().toISOString(),
      };
      await lostPetsAPI.create(payload);
      setSuccess(true);
      // Redirect back to lost pets listings after success
      setTimeout(() => navigate('/lost-pets'), 1200);
    } catch (err) {
      console.error(err);
      setError('Παρουσιάστηκε σφάλμα κατά την υποβολή.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Box sx={{
        height: { xs: '220px', md: '300px' },
        position: 'relative',
        mb: 6,
        borderRadius: '0 0 60px 60px',
        backgroundImage: 'url(https://images.unsplash.com/photo-1517519014922-f1fc4c0f7909?q=80&w=1600&auto=format&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(21,101,192,0.85) 0%, rgba(38,50,56,0.9) 100%)', borderRadius: '0 0 60px 60px' }} />
        <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center', px: 2 }}>
          <PetsIcon sx={{ fontSize: 64, color: '#FFA726', mb: 1 }} />
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 900, mb: 1 }}>
            Δήλωση Εύρεσης Κατοικιδίου
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
            Βρήκατε ζωάκι; Δηλώστε το για να επιστρέψει στον ιδιοκτήτη.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ px: 2, mb: 4 }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* No progress bar needed for simple found form */}

            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Paper sx={{ p: 3, borderRadius: 4 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Στοιχεία Ευρέσης</Typography>

                  {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="Όνομα Ευρέτη" value={form.finderName} onChange={(e) => setForm({ ...form, finderName: e.target.value })} InputProps={{ startAdornment: <PersonIcon sx={{ mr: 1 }} /> }} />
                    </Grid>
                    
                    
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="Τηλέφωνο" value={form.finderPhone} onChange={(e) => setForm({ ...form, finderPhone: e.target.value })} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="Email" type="email" value={form.finderEmail} onChange={(e) => setForm({ ...form, finderEmail: e.target.value })} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth sx={{ minWidth: 120, maxWidth: '100%', '& .MuiInputLabel-root': { fontSize: '1rem' }, '& .MuiSelect-select': { px: 2, fontSize: '1rem' } }}>
                        <InputLabel id="type-label">Είδος Ζώου</InputLabel>
                        <Select labelId="type-label" label="Είδος Ζώου" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                          <MenuItem value="Σκύλος">Σκύλος</MenuItem>
                          <MenuItem value="Γάτα">Γάτα</MenuItem>
                          <MenuItem value="Άλλο">Άλλο</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth multiline minRows={3} label="Περιγραφή" placeholder="Σύντομη περιγραφή ζώου, ιδιαίτερα χαρακτηριστικά" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                    </Grid>
                    {/* Area/Place text input removed; map handles location */}
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="Ημερομηνία & Ώρα" type="datetime-local" InputLabelProps={{ shrink: true }} value={form.foundAt} onChange={(e) => setForm({ ...form, foundAt: e.target.value })} InputProps={{ startAdornment: <ScheduleIcon sx={{ mr: 1 }} /> }} />
                    </Grid>
                    <Grid item xs={12}>
                      <SimpleMapEmbed
                        value={mapCoords}
                        onChange={(coords) => setMapCoords(coords)}
                        onLocationChange={(name) => setForm({ ...form, foundLocation: name })}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button variant="outlined" component="label" startIcon={<UploadIcon />}>Ανέβασμα Εικόνων
                        <input hidden multiple type="file" accept="image/*" onChange={handleImageUpload} />
                      </Button>
                      <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                        {images.map((src, idx) => (
                          <Box key={idx} sx={{ width: 96, height: 96, borderRadius: 2, overflow: 'hidden', border: '1px solid #eee' }}>
                            <img alt={`found-${idx}`} src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </Box>
                        ))}
                      </Box>
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                    <Button variant="contained" disabled={submitting} onClick={handleSubmit}>Υποβολή Δήλωσης</Button>
                    <Button variant="text" onClick={() => navigate('/lost-pets')}>Ακύρωση</Button>
                  </Box>

                  {submitting && <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>Υποβολή…</Typography>}
                  {success && <Alert severity="success" sx={{ mt: 2 }}>Η δήλωση εύρεσης καταχωρίστηκε!</Alert>}
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, borderRadius: 4 }}>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Χρήσιμες Οδηγίες</Typography>
                  <Typography variant="body2" color="text.secondary">
                    - Βεβαιωθείτε ότι οι φωτογραφίες είναι καθαρές.
                    <br/>
                    - Γράψτε ευδιάκριτα σημεία (κολάρο, σημάδια).
                    <br/>
                    - Σημειώστε ακριβώς πού και πότε βρέθηκε.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
        </Container>
      </Box>
    </Box>
  );
}

// Helpers: minimal OSM map embed with geocoding
function buildOsmEmbedSrc(lat, lng) {
  const d = 0.02; // ~2km
  const left = (lng - d).toFixed(6);
  const right = (lng + d).toFixed(6);
  const top = (lat + d).toFixed(6);
  const bottom = (lat - d).toFixed(6);
  return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lng}`;
}

function SimpleMapEmbed({ value, onChange, onLocationChange }) {
  const [query, setQuery] = useState('');
  const lat = value?.lat ?? 37.9838;
  const lng = value?.lng ?? 23.7275;
  const src = buildOsmEmbedSrc(lat, lng);

  const searchPlace = async () => {
    if (!query.trim()) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&accept-language=el&q=${encodeURIComponent(query)}`);
      const results = await res.json();
      if (results && results[0]) {
        const { lat, lon, display_name } = results[0];
        const coords = { lat: parseFloat(lat), lng: parseFloat(lon) };
        onChange?.(coords);
        onLocationChange?.(display_name || query);
      }
    } catch (e) {
      console.error('Geocoding failed', e);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
        <TextField
          fullWidth
          placeholder="Αναζήτηση περιοχής (π.χ. Κυψέλη, Αθήνα)"
          size="small"
          value={query}
          onChange={(e) => { setQuery(e.target.value); onLocationChange?.(e.target.value); }}
          onKeyDown={(e) => { if (e.key === 'Enter') searchPlace(); }}
        />
        <Button variant="outlined" onClick={searchPlace}>Αναζήτηση</Button>
      </Box>
      <Box sx={{ height: 300, borderRadius: 2, overflow: 'hidden' }}>
        <iframe title="map-embed" src={src} width="100%" height="100%" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      </Box>
      {value?.lat && value?.lng && (
        <Typography variant="caption" color="text.secondary">Συντεταγμένες: {value.lat.toFixed(5)}, {value.lng.toFixed(5)}</Typography>
      )}
    </Box>
  );
}
