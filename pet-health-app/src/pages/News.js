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
        primary: { main: '#00695c' },
        secondary: { main: '#FF7043' }, // Vivid Orange
        text: { primary: '#1A2027', secondary: '#5E6C84' },
        background: { default: '#F4F7FA' } // Πολύ απαλό γαλάζιο-γκρι για βάθος
    },
    typography: {
        fontFamily: '"Inter", "Roboto", sans-serif',
        button: { textTransform: 'none', fontWeight: 700 },
        h5: { fontWeight: 800, letterSpacing: '-0.02em' },
        h6: { fontWeight: 700, lineHeight: 1.4 }
    },
    shape: { borderRadius: 24 }, // Μεγάλες καμπύλες
    components: {
        MuiTab: { styleOverrides: { root: { fontWeight: 700, fontSize: '1rem', minHeight: 56, marginRight: '16px' } } },
        MuiCard: { styleOverrides: { root: { boxShadow: '0 12px 24px -10px rgba(0,0,0,0.08)' } } } // Soft shadow base
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
    const catColor = CATEGORY_COLORS[item.category] || '#00695c';

    return (
        <Card
                onClick={() => navigate(`/news/${item.id}`)}
                sx={{
                        height: '100%', borderRadius: '20px', border: 'none',
                        bgcolor: 'white', overflow: 'visible',
                        transition: 'all 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 18px 40px -10px rgba(0,0,0,0.12)' }
                }}
        >
            <CardActionArea sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', borderRadius: '20px', overflow: 'hidden' }}>
                
                {/* Image */}
                <Box sx={{ width: '100%', height: 180, overflow: 'hidden', position: 'relative' }}>
                        <Box 
                                component="img" src={item.image} alt={item.title}
                                sx={{ 
                                        width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease',
                                        '.MuiCardActionArea-root:hover &': { transform: 'scale(1.04)' } 
                                }} 
                        />
                        {/* Category Badge - Floating */}
                        <Chip 
                                label={item.category} 
                                sx={{ 
                                        position: 'absolute', top: 14, right: 14, fontWeight: 800, letterSpacing: 0.4,
                                        bgcolor: 'white', color: catColor, boxShadow: 2, height: 30, borderRadius: '8px', fontSize: '0.75rem'
                                }} 
                        />
                </Box>
                
                {/* Content */}
                <CardContent sx={{ p: 3, width: '100%', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        
                        <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5, fontSize: '0.75rem', color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><AccessTimeIcon sx={{ fontSize: 14 }}/> {item.date}</Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><LocalOfferIcon sx={{ fontSize: 14 }}/> {item.readTime}</Box>
                        </Box>
                        
                        <Typography variant="h5" sx={{ mb: 1.5, color: '#1A2027', lineHeight: 1.25, fontSize: '1.05rem' }}>
                                {item.title}
                        </Typography>
                        
                        <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px dashed #f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <Typography variant="body2" fontWeight="700" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                                        By <span style={{ color: '#00695c' }}>{item.author}</span>
                                </Typography>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#FF7043' }}>
                                                <FavoriteBorderIcon fontSize="small" /> 
                                                <Typography variant="caption" fontWeight="bold">{item.likes}</Typography>
                                        </Box>
                                        <IconButton size="small" sx={{ bgcolor: '#E0F2F1', color: '#00695c' }}>
                                                <ArrowForwardRoundedIcon fontSize="small" />
                                        </IconButton>
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
            mt: 2, mb: 10, borderRadius: { xs: 0, md: '0 0 60px 60px' }, overflow: 'hidden', position: 'relative',
            background: 'linear-gradient(120deg, #004d40 0%, #00695c 100%)',
            color: 'white', py: 12, px: 2, textAlign: 'center',
            boxShadow: '0 20px 60px -20px rgba(0, 77, 64, 0.5)'
    }}>
            {/* Decorative Circles */}
            <Box sx={{ position: 'absolute', top: -100, left: -100, width: 400, height: 400, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.03)' }} />
            <Box sx={{ position: 'absolute', bottom: -50, right: -50, width: 300, height: 300, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.03)' }} />

            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                    <Chip label="MAGAZINE" sx={{ bgcolor: 'secondary.main', color: 'white', fontWeight: '900', mb: 3, letterSpacing: 2 }} />
                    <Typography variant="h2" sx={{ fontWeight: 900, mb: 2, letterSpacing: '-1px' }}>
                            Blog & Ενημερώσεις
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 400, mb: 6, maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}>
                            Ανακαλύψτε ιστορίες που εμπνέουν, συμβουλές υγείας και τα τελευταία νέα της κοινότητας.
                    </Typography>
                    
                    {/* SEARCH BAR */}
                    <Paper 
                        elevation={10} 
                        sx={{ 
                                p: '8px 12px', display: 'flex', alignItems: 'center', width: '100%', maxWidth: 550, mx: 'auto', 
                                borderRadius: '60px', bgcolor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)'
                        }}
                    >
                        <IconButton sx={{ p: '12px' }}><SearchIcon color="primary" /></IconButton>
                        <TextField 
                                sx={{ ml: 1, flex: 1 }} 
                                placeholder="Τι ψάχνετε σήμερα;" 
                                variant="standard" 
                                onChange={(e) => onSearch(e.target.value)} 
                                InputProps={{ disableUnderline: true, sx: { fontSize: '1.1rem', fontWeight: 500 } }} 
                        />
                        <Button variant="contained" color="primary" sx={{ borderRadius: '50px', px: 4, py: 1.5 }}>Αναζήτηση</Button>
                    </Paper>
            </Container>
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
            <Box sx={{ minHeight: '100vh', bgcolor: '#F4F7FA', pb: 5 }}>
                
                <Container maxWidth="xl" sx={{ pt: 1 }}>
                        <PageHeader />
                </Container>

                <PlayfulHero onSearch={setSearchTerm} />

                <Container maxWidth="lg">
                        
                        {/* CATEGORY TABS */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 8 }}>
                                <Paper elevation={0} sx={{ borderRadius: '50px', p: 1, bgcolor: 'white', border: '1px solid #eee' }}>
                                        <Tabs 
                                                value={activeTab} 
                                                onChange={(e, v) => setActiveTab(v)} 
                                                variant="scrollable" 
                                                scrollButtons="auto"
                                                textColor="primary"
                                                indicatorColor="primary"
                                                sx={{ '& .MuiTabs-indicator': { height: 4, borderRadius: 2 } }}
                                        >
                                                {CATEGORIES.map((cat, i) => <Tab key={i} label={cat} />)}
                                        </Tabs>
                                </Paper>
                        </Box>

                        {/* RESULTS COUNT */}
                        <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2 }}>
                                <Typography variant="h5" color="text.primary">
                                        {filteredNews.length > 0 ? 'Προτεινόμενα Άρθρα' : 'Δεν βρέθηκαν άρθρα'}
                                </Typography>
                                <Button startIcon={<FilterListIcon />} color="inherit">Ταξινόμηση</Button>
                        </Box>

                        {/* GRID - two columns with consistent spacing */}
                        <Grid container spacing={4} sx={{ alignItems: 'stretch' }}>
                                {filteredNews.map(item => (
                                        <Grid item xs={12} sm={6} md={6} key={item.id} sx={{ display: 'flex' }}>
                                                <NewsCard item={item} />
                                        </Grid>
                                ))}
                        </Grid>

                        {/* PAGINATION */}
                        {filteredNews.length > 0 && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                                        <Pagination count={5} color="primary" size="large" shape="rounded" />
                                </Box>
                        )}

                        <Newsletter />

                </Container>
            </Box>
        </ThemeProvider>
    );
}