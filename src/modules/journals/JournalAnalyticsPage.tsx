
import { Article, Cancel, CheckCircle, School, TrendingUp } from '@mui/icons-material';
import {
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    LinearProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface JournalStats {
    totalPapers: number;
    indexedPapers: number;
    indexingRate: number;
    impactFactorEstimate: number;
    publicationsByType: Record<string, number>;
    indexingByService: {
        scholar: number;
        scopus: boolean;
        pubmed: boolean;
        doaj: boolean;
    };
}

const JournalAnalyticsPage = () => {
    const { id } = useParams();
    const [stats, setStats] = useState<JournalStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (!id) return;
            try {
                const response = await fetch(`http://localhost:5050/api/journals/${id}/stats`);
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [id]);

    if (loading) return <Typography>Loading analytics...</Typography>;
    if (!stats) return <Typography>No data available</Typography>;

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Journal Analytics & Impact Factor
            </Typography>
            <Typography color="textSecondary" sx={{ mb: 3 }}>
                Performance metrics and indexing status
            </Typography>

            <Grid container spacing={3}>
                {/* Impact Factor Card */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <TrendingUp sx={{ fontSize: 40, mr: 2 }} />
                                <Typography variant="h6">Impact Factor</Typography>
                            </Box>
                            <Typography variant="h2" fontWeight="bold">
                                {stats.impactFactorEstimate}
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                Estimated based on indexing coverage
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Papers Overview */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Article sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                                <Typography variant="h6">Publications</Typography>
                            </Box>
                            <Typography variant="h2" fontWeight="bold">
                                {stats.totalPapers}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Total papers tracked
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            {Object.entries(stats.publicationsByType).map(([type, count]) => (
                                <Box key={type} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">{type}</Typography>
                                    <Chip label={count} size="small" />
                                </Box>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Indexing Rate */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <School sx={{ fontSize: 40, mr: 2, color: 'success.main' }} />
                                <Typography variant="h6">Indexing Rate</Typography>
                            </Box>
                            <Typography variant="h2" fontWeight="bold">
                                {stats.indexingRate}%
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                {stats.indexedPapers} of {stats.totalPapers} papers indexed
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={stats.indexingRate}
                                sx={{ height: 8, borderRadius: 4 }}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Database Coverage */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Database Coverage
                            </Typography>
                            <List>
                                <ListItem>
                                    <ListItemIcon>
                                        {stats.indexingByService.scholar > 0 ?
                                            <CheckCircle color="success" /> :
                                            <Cancel color="error" />
                                        }
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Google Scholar"
                                        secondary={`${stats.indexingByService.scholar} papers verified`}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        {stats.indexingByService.scopus ?
                                            <CheckCircle color="success" /> :
                                            <Cancel color="disabled" />
                                        }
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Scopus"
                                        secondary={stats.indexingByService.scopus ? "Accepted" : "Not indexed"}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        {stats.indexingByService.pubmed ?
                                            <CheckCircle color="success" /> :
                                            <Cancel color="disabled" />
                                        }
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="PubMed"
                                        secondary={stats.indexingByService.pubmed ? "Accepted" : "Not indexed"}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        {stats.indexingByService.doaj ?
                                            <CheckCircle color="success" /> :
                                            <Cancel color="disabled" />
                                        }
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="DOAJ"
                                        secondary={stats.indexingByService.doaj ? "Accepted" : "Not indexed"}
                                    />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default JournalAnalyticsPage;
