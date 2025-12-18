import { useState } from 'react';
import { Box, Container, Typography, Paper, Button, Chip, Avatar } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from './PageHeader';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { NEWS_DATA } from './News';

const theme = createTheme({
    palette: {
        primary: { main: '#1976d2' },
        background: { default: '#f8fafc' },
        text: { primary: '#1e293b', secondary: '#64748b' }
    },
    typography: {
        fontFamily: '"Inter", "Roboto", sans-serif',
        h4: { fontWeight: 700 },
        body1: { lineHeight: 1.8 }
    }
});

export default function NewsDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const article = NEWS_DATA.find(item => item.id === parseInt(id));
    const [liked, setLiked] = useState(false);

    if (!article) {
        return (
            <ThemeProvider theme={theme}>
                <Container maxWidth="xl" sx={{ pt: 2 }}>
                    <PageHeader />
                </Container>
                <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
                    <Typography variant="h5" color="text.secondary">Το άρθρο δεν βρέθηκε</Typography>
                    <Button onClick={() => navigate('/news')} sx={{ mt: 2 }}>Επιστροφή στα νέα</Button>
                </Container>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 8 }}>
                <Container maxWidth="xl" sx={{ pt: 2 }}>
                    <PageHeader />
                </Container>

                {/* Hero Image */}
                <Box sx={{ width: '100%', height: 400, overflow: 'hidden', bgcolor: '#f0f0f0' }}>
                    <Box
                        component="img"
                        src={article.image}
                        alt={article.title}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </Box>

                <Container maxWidth="md" sx={{ mt: -6, position: 'relative', zIndex: 2 }}>
                    <Paper sx={{ p: 6, borderRadius: 2, bgcolor: 'white' }}>
                        {/* Category & Meta */}
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
                            <Chip label={article.category} color="primary" />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', fontSize: '0.9rem' }}>
                                <AccessTimeIcon sx={{ fontSize: 16 }} />
                                {article.date}
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                📖 {article.readTime}
                            </Typography>
                        </Box>

                        {/* Title */}
                        <Typography variant="h4" sx={{ mb: 4, color: 'text.primary' }}>
                            {article.title}
                        </Typography>

                        {/* Author & Actions */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6, pb: 4, borderBottom: '1px solid #e2e8f0' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                                    {article.author.charAt(0)}
                                </Avatar>
                                <Box>
                                    <Typography variant="body1" fontWeight={600}>
                                        {article.author}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Care4Pets Team
                                    </Typography>
                                </Box>
                            </Box>

                            <Button
                                startIcon={liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                onClick={() => setLiked(!liked)}
                                sx={{ color: liked ? '#ff6b6b' : 'text.secondary' }}
                            >
                                {article.likes + (liked ? 1 : 0)}
                            </Button>
                        </Box>

                        {/* Article Content */}
                        <Box sx={{ mb: 6 }}>
                            <Typography variant="body1" sx={{ mb: 3, color: 'text.primary', whiteSpace: 'pre-wrap' }}>
                                Καλώς ήρθατε στο άρθρο: <strong>{article.title}</strong>
                            </Typography>

                            <Typography variant="body1" paragraph sx={{ color: 'text.primary' }}>
                                Αυτό είναι ένα δείγμα περιεχομένου για το άρθρο που επιλέξατε. Στη πραγματική εφαρμογή, εδώ θα εμφανίζονταν το πλήρες περιεχόμενο του άρθρου.
                            </Typography>

                            <Typography variant="body1" paragraph sx={{ color: 'text.primary' }}>
                                <strong>Κατηγορία:</strong> {article.category}
                            </Typography>

                            <Typography variant="body1" paragraph sx={{ color: 'text.primary' }}>
                                <strong>Ημερομηνία δημοσίευσης:</strong> {article.date}
                            </Typography>

                            <Typography variant="body1" paragraph sx={{ color: 'text.primary' }}>
                                <strong>Χρόνος ανάγνωσης:</strong> {article.readTime}
                            </Typography>

                            <Typography variant="body1" sx={{ color: 'text.secondary', fontStyle: 'italic', mt: 4 }}>
                                Επιστρέψτε στα νέα για να δείτε άλλα ενδιαφέροντα άρθρα και ενημερώσεις της κοινότητας Care4Pets.
                            </Typography>
                        </Box>

                        {/* Back Button */}
                        <Button 
                            variant="contained" 
                            onClick={() => navigate('/news')}
                            sx={{ mt: 4 }}
                        >
                            ← Πίσω στα Νέα
                        </Button>
                    </Paper>
                </Container>
            </Box>
        </ThemeProvider>
    );
}
