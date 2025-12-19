import { useState } from 'react';
import { Box, Container, Typography, Paper, Button, Chip, Avatar, Grid, Table, TableBody, TableRow, TableCell, Divider } from '@mui/material';
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

                <Container maxWidth="lg" sx={{ mt: -6, position: 'relative', zIndex: 2 }}>
                    <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, bgcolor: 'white', boxShadow: '0 18px 46px rgba(15,23,42,0.08)' }}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={8}>
                                {/* Category & Meta */}
                                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
                                    <Chip label={article.category} color="primary" />
                                    <Chip icon={<AccessTimeIcon sx={{ fontSize: 16 }} />} label={article.date} variant="outlined" />
                                    <Chip label={`📖 ${article.readTime}`} variant="outlined" />
                                </Box>

                                {/* Title */}
                                <Typography variant="h4" sx={{ mb: 2, color: 'text.primary', lineHeight: 1.2 }}>
                                    {article.title}
                                </Typography>
                                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
                                    Καλώς ήρθατε στο άρθρο: {article.title}
                                </Typography>

                                {/* Author & Actions */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5, pb: 3, borderBottom: '1px solid #e2e8f0' }}>
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
                                        sx={{ color: liked ? '#ff6b6b' : 'text.secondary', fontWeight: 700 }}
                                    >
                                        {article.likes + (liked ? 1 : 0)}
                                    </Button>
                                </Box>

                                {/* Article Content */}
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <Typography variant="body1" color="text.primary">
                                        Αυτό είναι ένα δείγμα περιεχομένου για το άρθρο που επιλέξατε. Στη πραγματική εφαρμογή, εδώ θα εμφανίζονταν το πλήρες περιεχόμενο του άρθρου.
                                    </Typography>

                                    <Typography variant="body1" color="text.primary">
                                        Επιστρέψτε στα νέα για να δείτε άλλα ενδιαφέροντα άρθρα και ενημερώσεις της κοινότητας Care4Pets.
                                    </Typography>
                                </Box>
                            </Grid>

                            {/* Side Info */}
                            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
                                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Πληροφορίες Άρθρου</Typography>
                                    <Table size="small" sx={{ mb: 1 }}>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell sx={{ width: '45%', fontWeight: 700, border: 'none', color: '#475569', py: 1 }}>Κατηγορία</TableCell>
                                                <TableCell sx={{ border: 'none', py: 1 }}>{article.category}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ width: '45%', fontWeight: 700, border: 'none', color: '#475569', py: 1 }}>Ημερομηνία</TableCell>
                                                <TableCell sx={{ border: 'none', py: 1 }}>{article.date}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ width: '45%', fontWeight: 700, border: 'none', color: '#475569', py: 1 }}>Χρόνος ανάγνωσης</TableCell>
                                                <TableCell sx={{ border: 'none', py: 1 }}>{article.readTime}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ width: '45%', fontWeight: 700, border: 'none', color: '#475569', py: 1 }}>Συντάκτης</TableCell>
                                                <TableCell sx={{ border: 'none', py: 1 }}>{article.author}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                    <Divider sx={{ my: 2 }} />
                                    <Table size="small">
                                        <TableBody>
                                            <TableRow>
                                                <TableCell sx={{ width: '45%', fontWeight: 700, border: 'none', color: '#475569', py: 1 }}>Likes</TableCell>
                                                <TableCell sx={{ border: 'none', py: 1 }}>{article.likes + (liked ? 1 : 0)}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </Paper>

                                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px dashed #cbd5e1', bgcolor: 'white' }}>
                                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Χρειάζεστε βοήθεια;</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Επικοινωνήστε με την ομάδα μας για περισσότερες πληροφορίες.</Typography>
                                    <Button variant="contained" fullWidth sx={{ fontWeight: 700 }} onClick={() => navigate('/contact')}>
                                        Επικοινωνία
                                    </Button>
                                </Paper>
                            </Grid>
                        </Grid>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
                            <Button variant="text" onClick={() => navigate('/news')} sx={{ fontWeight: 700 }}>
                                ← Πίσω στα Νέα
                            </Button>
                            <Button variant="contained" onClick={() => navigate('/news')} sx={{ fontWeight: 700 }}>
                                Περισσότερα Νέα
                            </Button>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </ThemeProvider>
    );
}
