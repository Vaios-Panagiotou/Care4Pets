import { useState, useEffect } from 'react';
import {
    Box, Container, Grid, Typography, Button, Paper, Card, CardContent,
    Chip, Pagination, TextField, Tab, Tabs, CardActionArea,
    Snackbar, Alert
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import NewspaperIcon from '@mui/icons-material/Newspaper';

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
                height: '100%',
                minHeight: 420,
                maxHeight: 420,
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
            <CardActionArea sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>

                {/* Image - Fixed Height and Aspect Ratio */}
                <Box sx={{ 
                    width: '100%', 
                    height: 200, 
                    minHeight: 200,
                    maxHeight: 200,
                    overflow: 'hidden', 
                    position: 'relative', 
                    bgcolor: '#f5f7fa', 
                    flexShrink: 0 
                }}>
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
                            objectPosition: 'center',
                            display: 'block',
                            transition: 'transform 0.3s ease',
                            '.MuiCardActionArea-root:hover &': { transform: 'scale(1.05)' }
                        }}
                    />
                    {/* Category Badge */}
                    <Chip
                        label={item.category}
                        size="small"
                        sx={{
                            position: 'absolute', top: 12, right: 12,
                            bgcolor: CATEGORY_COLORS[item.category] || '#1976d2', 
                            color: 'white', 
                            fontWeight: 600, 
                            fontSize: '0.7rem',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        }}
                    />
                </Box>

                {/* Content - Fixed Structure */}
                <CardContent sx={{ 
                    p: 2.5, 
                    width: '100%', 
                    flex: 1,
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between' 
                }}>

                    {/* Meta Info */}
                    <Box sx={{ 
                        display: 'flex', 
                        gap: 1.5, 
                        mb: 1.5, 
                        fontSize: '0.8rem', 
                        color: 'text.secondary', 
                        flexShrink: 0 
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AccessTimeIcon sx={{ fontSize: 15 }}/>
                            {item.date}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            📖 {item.readTime}
                        </Box>
                    </Box>

                    {/* Title - Exactly 2 lines */}
                    <Typography
                        variant="body1"
                        sx={{
                            fontWeight: 700,
                            color: 'text.primary',
                            lineHeight: 1.4,
                            minHeight: '56px',
                            maxHeight: '56px',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            flexShrink: 0,
                            mb: 2
                        }}
                    >
                        {item.title}
                    </Typography>

                    {/* Footer - Fixed Position */}
                    <Box sx={{ 
                        pt: 1.5, 
                        borderTop: '1px solid #e2e8f0', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        flexShrink: 0,
                        mt: 'auto'
                    }}>
                        <Typography variant="caption" sx={{ 
                            color: 'text.secondary', 
                            fontWeight: 600, 
                            fontSize: '0.75rem' 
                        }}>
                            <span style={{ color: '#1976d2' }}>{item.author}</span>
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                            <FavoriteBorderIcon sx={{ fontSize: 16 }} />
                            <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>
                                {item.likes}
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

// 2. HERO SECTION
const PlayfulHero = ({ onSearch }) => {
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    return (
        <Box sx={{ 
                position: 'relative',
                mb: 6, 
                height: 420,
                backgroundImage: 'url(https://images.unsplash.com/photo-1444212477490-ca407925329e?auto=format&fit=crop&w=1920&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: { xs: 0, md: '0 0 24px 24px' },
                overflow: 'hidden'
        }}>
                {/* Animated Gradient Overlay */}
                <Box sx={{ 
                    position: 'absolute', 
                    inset: 0, 
                    background: 'linear-gradient(135deg, rgba(25,118,210,0.85) 0%, rgba(21,101,192,0.75) 100%)',
                    zIndex: 1
                }} />
                
                {/* Content */}
                <Box sx={{ 
                    position: 'relative', 
                    zIndex: 2, 
                    textAlign: 'center',
                    color: 'white',
                    px: 2,
                    maxWidth: 900
                }}>
                    {/* Icon Badge */}
                    <Box sx={{ 
                        display: 'inline-flex',
                        bgcolor: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '50px',
                        p: 1.5,
                        mb: 2,
                        animation: 'bounce 2s ease-in-out infinite',
                        '@keyframes bounce': {
                            '0%, 100%': { transform: 'translateY(0)' },
                            '50%': { transform: 'translateY(-10px)' }
                        }
                    }}>
                        <NewspaperIcon sx={{ fontSize: 40 }} />
                    </Box>

                    <Typography variant="h3" sx={{ 
                        fontWeight: 800, 
                        mb: 2, 
                        textShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        animation: 'fadeInDown 0.8s ease-out',
                        '@keyframes fadeInDown': {
                            '0%': { opacity: 0, transform: 'translateY(-20px)' },
                            '100%': { opacity: 1, transform: 'translateY(0)' }
                        }
                    }}>
                        Νέα & Ενημερώσεις
                    </Typography>
                    <Typography variant="h6" sx={{ 
                        opacity: 0.95, 
                        mb: 4,
                        animation: 'fadeInDown 0.8s ease-out 0.2s both'
                    }}>
                        Ανακαλύψτε τα τελευταία άρθρα για την φροντίδα των κατοικιδίων σας
                    </Typography>
                    
                    {/* Interactive Stats */}
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        gap: 4, 
                        mb: 4,
                        animation: 'fadeInUp 0.8s ease-out 0.4s both',
                        '@keyframes fadeInUp': {
                            '0%': { opacity: 0, transform: 'translateY(20px)' },
                            '100%': { opacity: 1, transform: 'translateY(0)' }
                        }
                    }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 800 }}>150+</Typography>
                            <Typography variant="caption" sx={{ opacity: 0.9 }}>Άρθρα</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 800 }}>50K+</Typography>
                            <Typography variant="caption" sx={{ opacity: 0.9 }}>Αναγνώστες</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 800 }}>20+</Typography>
                            <Typography variant="caption" sx={{ opacity: 0.9 }}>Συγγραφείς</Typography>
                        </Box>
                    </Box>
                    
                    {/* Enhanced Search Bar */}
                    <Box sx={{ 
                        maxWidth: 600, 
                        mx: 'auto',
                        transform: isSearchFocused ? 'scale(1.02)' : 'scale(1)',
                        transition: 'transform 0.3s ease',
                        animation: 'fadeInUp 0.8s ease-out 0.6s both'
                    }}>
                        <TextField
                            fullWidth
                            placeholder="Αναζήτηση άρθρων, κατηγοριών..."
                            size="medium"
                            onChange={(e) => onSearch(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ mr: 1, color: 'white', fontSize: 28 }} />,
                                endAdornment: (
                                    <Chip 
                                        label="Enter" 
                                        size="small" 
                                        sx={{ 
                                            bgcolor: 'rgba(255,255,255,0.2)', 
                                            color: 'white',
                                            fontWeight: 700,
                                            fontSize: '0.7rem'
                                        }} 
                                    />
                                )
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: 'rgba(255,255,255,0.15)',
                                    backdropFilter: 'blur(15px)',
                                    color: 'white',
                                    borderRadius: 3,
                                    fontSize: '1.1rem',
                                    py: 0.5,
                                    '& fieldset': { border: '2px solid rgba(255,255,255,0.2)' },
                                    '&:hover': { 
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        '& fieldset': { borderColor: 'rgba(255,255,255,0.4)' }
                                    },
                                    '&.Mui-focused': { 
                                        bgcolor: 'rgba(255,255,255,0.25)',
                                        '& fieldset': { borderColor: 'rgba(255,255,255,0.6)' }
                                    }
                                },
                                '& .MuiOutlinedInput-input::placeholder': { 
                                    color: 'rgba(255,255,255,0.7)', 
                                    opacity: 1,
                                    fontSize: '1rem'
                                }
                            }}
                        />
                    </Box>
                </Box>
        </Box>
    );
};

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

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
                        <Grid container spacing={3}>
                                {filteredNews.map(item => (
                                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
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