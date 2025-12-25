import { useState } from 'react';
import {
    Box, Container, Grid, Typography, Button, Paper, Card, CardContent,
    Chip, Pagination, TextField, IconButton, Tab, Tabs, CardActionArea,
    Snackbar, Alert
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SendIcon from '@mui/icons-material/Send';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import FilterListIcon from '@mui/icons-material/FilterList';

// Import PageHeader
import PageHeader from './PageHeader';

// --- THEME ---
const theme = createTheme({
    palette: {
        primary: { main: '#1976d2' },
        secondary: { main: '#ff6b6b' },
        background: { default: '#f8fafc' },
        text: { primary: '#1e293b', secondary: '#64748b' }
    },
    typography: {
        fontFamily: '"Inter", "Roboto", sans-serif',
        button: { textTransform: 'none', fontWeight: 600 },
        h5: { fontWeight: 700, letterSpacing: '-0.01em' },
        h6: { fontWeight: 600, lineHeight: 1.4 }
    },
    shape: { borderRadius: 12 },
    components: {
        MuiTab: { styleOverrides: { root: { fontWeight: 600, fontSize: '0.95rem', minHeight: 48, textTransform: 'none' } } },
        MuiCard: { styleOverrides: { root: { boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' } } }
    }
});

// --- DATA ---
const CATEGORIES = ['Όλα', 'Υγεία', 'Διατροφή', 'Κοινότητα', 'Ιστορίες', 'Εκπαίδευση'];

const CATEGORY_COLORS = {
    'Υγεία': '#E53935',
    'Διατροφή': '#43A047',
    'Κοινότητα': '#1E88E5',
    'Ιστορίες': '#FDD835',
    'Εκπαίδευση': '#8E24AA'
};

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80';

export const NEWS_DATA = [
    {
        id: 1,
        title: 'Καλοκαίρι και Κατοικίδια: Ο Απόλυτος Οδηγός Επιβίωσης',
        date: '24 Οκτ',
        readTime: '4m',
        category: 'Υγεία',
        image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        author: 'Care4Pets Team',
        likes: 120
    },
    {
        id: 2,
        title: '5 Superfoods που λατρεύουν οι σκύλοι (και κάνουν καλό!)',
        date: '22 Οκτ',
        readTime: '5m',
        category: 'Διατροφή',
        image: 'https://images.unsplash.com/photo-1589924691195-41432c84c161?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        author: 'Δρ. Νίκος',
        likes: 85
    },
    {
        id: 3,
        title: 'Η μεγάλη γιορτή υιοθεσίας στο κέντρο της Αθήνας',
        date: '20 Οκτ',
        readTime: '3m',
        category: 'Κοινότητα',
        image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        author: 'Δήμος Αθηναίων',
        likes: 240
    },
    {
        id: 4,
        title: 'Πώς ο Μαξ έσωσε την οικογένειά του από τη φωτιά',
        date: '18 Οκτ',
        readTime: '6m',
        category: 'Ιστορίες',
        image: 'https://images.unsplash.com/photo-1544568100-847a948585b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        author: 'Μαρία Κ.',
        likes: 560
    },
    {
        id: 5,
        title: 'Εκπαίδευση: Σταματήστε το τράβηγμα στο λουρί',
        date: '15 Οκτ',
        readTime: '8m',
        category: 'Εκπαίδευση',
        image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        author: 'Εκπαιδευτής Γιάννης',
        likes: 90
    },
    {
        id: 6,
        title: 'Γιατί οι γάτες λατρεύουν τα χάρτινα κουτιά;',
        date: '12 Οκτ',
        readTime: '2m',
        category: 'Εκπαίδευση',
        image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        author: 'Dr. Cat',
        likes: 310
    }
];

// --- COMPONENTS ---

// 1. SPACIOUS NEWS CARD
export const NewsCard = ({ item }) => {
    const navigate = useNavigate();
    const [imgSrc, setImgSrc] = useState(item.image || FALLBACK_IMAGE);

    return (
        <Card
            onClick={() => navigate(`/news/${item.id}`)}
            sx={{
                height: 440,
                borderRadius: '14px',
                bgcolor: 'white',
                overflow: 'hidden',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.12)'
                }
            }}
        >
            <CardActionArea sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

                {/* Image - Fixed Height with fallback */}
                <Box sx={{ width: '100%', height: 210, overflow: 'hidden', position: 'relative', bgcolor: '#f5f7fa', flexShrink: 0 }}>
                    <Box
                        component="img"
                        src={imgSrc}
                        alt={item.title}
                        loading="lazy"
                        onError={() => setImgSrc(FALLBACK_IMAGE)}
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease',
                            '.MuiCardActionArea-root:hover &': { transform: 'scale(1.05)' }
                        }}
                    />
                    {/* Category Badge */}
                    <Chip
                        label={item.category}
                        size="small"
                        sx={{
                            position: 'absolute', top: 10, right: 10,
                            bgcolor: CATEGORY_COLORS[item.category] || '#1976d2', color: 'white', fontWeight: 600, fontSize: '0.7rem'
                        }}
                    />
                </Box>

                {/* Content - Fixed Structure */}
                <CardContent sx={{ p: '16px', width: '100%', height: '230px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

                    {/* Meta Info */}
                    <Box sx={{ display: 'flex', gap: 1.5, mb: 1, fontSize: '0.8rem', color: 'text.secondary', flexShrink: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><AccessTimeIcon sx={{ fontSize: 15 }}/>{item.date}</Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>📖 {item.readTime}</Box>
                    </Box>

                    {/* Title - Exactly 2 lines */}
                    <Typography
                        variant="body1"
                        sx={{
                            fontWeight: 700,
                            color: 'text.primary',
                            lineHeight: 1.4,
                            height: '48px',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            flexShrink: 0
                        }}
                    >
                        {item.title}
                    </Typography>

                    {/* Footer - Fixed Position */}
                    <Box sx={{ pt: '12px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>
                            <span style={{ color: '#1976d2' }}>{item.author}</span>
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, color: 'text.secondary' }}>
                            <FavoriteBorderIcon sx={{ fontSize: 15 }} />
                            <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>{item.likes}</Typography>
                        </Box>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

// 2. HERO SECTION
const PlayfulHero = ({ onSearch }) => (
    <Box sx={{ 
            mb: 6, py: 6, px: 2,
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            color: 'white', textAlign: 'center',
            borderRadius: { xs: 0, md: '0 0 24px 24px' }
    }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Νέα & Ενημερώσεις</Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 4 }}>Καλοδεχόρισμα στην κοινότητα της Care4Pets</Typography>
            
            <Box sx={{ maxWidth: 500, mx: 'auto', display: 'flex', gap: 1 }}>
                <TextField
                    fullWidth
                    placeholder="Αναζήτηση άρθρων..."
                    size="small"
                    onChange={(e) => onSearch(e.target.value)}
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ mr: 1, color: 'white', opacity: 0.7 }} />,
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            bgcolor: 'rgba(255,255,255,0.15)',
                            color: 'white',
                            borderRadius: 2,
                            '& fieldset': { border: 'none' },
                            '&:hover, &.Mui-focused': { bgcolor: 'rgba(255,255,255,0.25)' }
                        },
                        '& .MuiOutlinedInput-input::placeholder': { color: 'rgba(255,255,255,0.6)', opacity: 1 }
                    }}
                />
            </Box>
    </Box>
);

// 3. NEWSLETTER
const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [open, setOpen] = useState(false);

    const handleSubscribe = () => {
        if (email) {
            setOpen(true);
            setEmail('');
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 15, mb: 10 }}>
            <Paper sx={{ 
                    p: 8, borderRadius: '40px', textAlign: 'center', position: 'relative', overflow: 'hidden',
                    background: 'linear-gradient(to right, #263238 0%, #37474F 100%)', color: 'white',
                    boxShadow: '0 20px 60px rgba(38, 50, 56, 0.4)'
            }}>
                    <Typography variant="h4" gutterBottom>📩 Weekly Woof!</Typography>
                    <Typography sx={{ mb: 5, opacity: 0.7, fontSize: '1.1rem' }}>Τα καλύτερα νέα της εβδομάδας, απευθείας στο email σας.</Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                            <TextField 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    variant="filled" 
                                    placeholder="Το email σας" 
                                    hiddenLabel 
                                    sx={{ 
                                            bgcolor: 'white', borderRadius: '16px', width: { xs: '100%', sm: '350px' },
                                            '& .MuiFilledInput-root': { bgcolor: 'white', borderRadius: '16px', '&:before, &:after': { display: 'none' }, py: 1 } 
                                    }} 
                            />
                            <Button 
                                variant="contained" color="secondary" size="large" 
                                onClick={handleSubscribe}
                                endIcon={<SendIcon />} sx={{ borderRadius: '16px', px: 4, fontSize: '1rem' }}
                            >
                                    Εγγραφή
                            </Button>
                    </Box>
            </Paper>

            <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: '100%', borderRadius: 4 }}>
                    Ευχαριστούμε! Η εγγραφή ολοκληρώθηκε. 🐾
                </Alert>
            </Snackbar>
        </Container>
    );
};

// --- MAIN PAGE ---
export default function News() {
    const [activeTab, setActiveTab] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredNews = NEWS_DATA.filter((item) => {
        const matchesCategory = activeTab === 0 || item.category === CATEGORIES[activeTab];
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pb: 8 }}>
                
                <Container maxWidth="xl" sx={{ pt: 1 }}>
                        <PageHeader />
                </Container>

                <Container maxWidth="xl">
                        <PlayfulHero onSearch={setSearchTerm} />
                        
                        {/* CATEGORY TABS */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6, overflowX: 'auto' }}>
                                <Paper elevation={0} sx={{ borderRadius: '50px', p: 0.5, bgcolor: '#f0f0f0', border: 'none', display: 'inline-flex' }}>
                                        <Tabs 
                                                value={activeTab} 
                                                onChange={(e, v) => setActiveTab(v)} 
                                                variant="scrollable" 
                                                scrollButtons="auto"
                                                textColor="primary"
                                                indicatorColor="primary"
                                                sx={{ '& .MuiTabs-indicator': { height: 3, borderRadius: 2 } }}
                                        >
                                                {CATEGORIES.map((cat, i) => <Tab key={i} label={cat} />)}
                                        </Tabs>
                                </Paper>
                        </Box>

                        {/* RESULTS COUNT */}
                        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
                                        {filteredNews.length > 0 ? `${filteredNews.length} άρθρα` : 'Δεν βρέθηκαν άρθρα'}
                                </Typography>
                        </Box>

                        {/* GRID */}
                        <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
                                {filteredNews.map(item => (
                                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id} sx={{ display: 'flex' }}>
                                                <NewsCard item={item} />
                                        </Grid>
                                ))}
                        </Grid>

                        {/* PAGINATION */}
                        {filteredNews.length > 0 && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                                        <Pagination count={5} color="primary" shape="rounded" />
                                </Box>
                        )}

                        <Newsletter />
                </Container>
            </Box>
        </ThemeProvider>
    );
}