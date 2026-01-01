
import { Person, School } from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography
} from '@mui/material';
import { useEffect, useState } from 'react';

interface Recommendation {
    reviewerId: string;
    firstName: string;
    lastName: string;
    email: string;
    institution: string | null;
    score: number;
    matchedKeywords: string[];
    expertise: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    paperId: string | null;
    paperTitle: string | null;
}

const ReviewerRecommendationDialog = ({ open, onClose, paperId, paperTitle }: Props) => {
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && paperId) {
            const fetchRecommendations = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`http://localhost:5050/api/papers/${paperId}/recommend`);
                    const data = await response.json();
                    setRecommendations(data);
                } catch (error) {
                    console.error('Failed to fetch recommendations:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchRecommendations();
        }
    }, [open, paperId]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Reviewer Recommendations
                <Typography variant="subtitle2" color="textSecondary">
                    Based on: {paperTitle}
                </Typography>
            </DialogTitle>
            <DialogContent dividers>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : recommendations.length > 0 ? (
                    <List>
                        {recommendations.map((rec) => (
                            <Box key={rec.reviewerId} sx={{ mb: 2 }}>
                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                                            <Person />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="subtitle1" fontWeight="bold">
                                                    {rec.firstName} {rec.lastName}
                                                </Typography>
                                                <Chip
                                                    label={`Match Score: ${rec.score}%`}
                                                    size="small"
                                                    color={rec.score > 20 ? "success" : "primary"}
                                                />
                                            </Box>
                                        }
                                        secondary={
                                            <Box sx={{ mt: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                                    <School sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                                    <Typography variant="body2">{rec.institution || 'Independent Researcher'}</Typography>
                                                </Box>
                                                <Typography variant="caption" display="block" color="textSecondary" sx={{ mb: 1 }}>
                                                    Expertise: {rec.expertise}
                                                </Typography>
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {rec.matchedKeywords.map((kw) => (
                                                        <Chip key={kw} label={kw} size="small" variant="outlined" color="secondary" />
                                                    ))}
                                                </Box>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                                <DialogActions>
                                    <Button size="small">View Profile</Button>
                                    <Button size="small" variant="contained">Invite to Review</Button>
                                </DialogActions>
                                <Divider variant="inset" component="li" />
                            </Box>
                        ))}
                    </List>
                ) : (
                    <Typography align="center" sx={{ p: 3 }}>
                        No matching reviewers found for this paper's keywords.
                    </Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReviewerRecommendationDialog;
