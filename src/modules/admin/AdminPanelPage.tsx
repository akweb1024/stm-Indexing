
import { Add, Delete, Edit } from '@mui/icons-material';
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Typography
} from '@mui/material';
import { useEffect, useState } from 'react';

interface Reviewer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    institution: string | null;
    expertise: string;
    rating: number;
    totalReviews: number;
}

interface DatabaseConfig {
    id: string;
    name: string;
    enabled: boolean;
    checkFrequency: string;
}

const AdminPanelPage = () => {
    const [tabValue, setTabValue] = useState(0);
    const [reviewers, setReviewers] = useState<Reviewer[]>([]);
    const [databases, setDatabases] = useState<DatabaseConfig[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingReviewer, setEditingReviewer] = useState<Reviewer | null>(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        institution: '',
        expertise: '',
        tenantId: 'tenant_1'
    });

    useEffect(() => {
        fetchReviewers();
        fetchDatabases();
    }, []);

    const fetchReviewers = async () => {
        try {
            const response = await fetch('http://localhost:5050/api/admin/reviewers');
            const data = await response.json();
            setReviewers(data);
        } catch (error) {
            console.error('Failed to fetch reviewers:', error);
        }
    };

    const fetchDatabases = async () => {
        try {
            const response = await fetch('http://localhost:5050/api/admin/database-configs');
            const data = await response.json();
            setDatabases(data);
        } catch (error) {
            console.error('Failed to fetch databases:', error);
        }
    };

    const handleSaveReviewer = async () => {
        try {
            const url = editingReviewer
                ? `http://localhost:5050/api/admin/reviewers/${editingReviewer.id}`
                : 'http://localhost:5050/api/admin/reviewers';

            const method = editingReviewer ? 'PUT' : 'POST';

            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            setOpenDialog(false);
            setEditingReviewer(null);
            setFormData({ firstName: '', lastName: '', email: '', institution: '', expertise: '', tenantId: 'tenant_1' });
            fetchReviewers();
        } catch (error) {
            console.error('Failed to save reviewer:', error);
        }
    };

    const handleDeleteReviewer = async (id: string) => {
        if (!confirm('Are you sure you want to delete this reviewer?')) return;

        try {
            await fetch(`http://localhost:5050/api/admin/reviewers/${id}`, {
                method: 'DELETE'
            });
            fetchReviewers();
        } catch (error) {
            console.error('Failed to delete reviewer:', error);
        }
    };

    const handleEditReviewer = (reviewer: Reviewer) => {
        setEditingReviewer(reviewer);
        setFormData({
            firstName: reviewer.firstName,
            lastName: reviewer.lastName,
            email: reviewer.email,
            institution: reviewer.institution || '',
            expertise: reviewer.expertise,
            tenantId: 'tenant_1'
        });
        setOpenDialog(true);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Admin Panel
            </Typography>
            <Typography color="textSecondary" sx={{ mb: 3 }}>
                Manage reviewers, databases, and system settings
            </Typography>

            <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 3 }}>
                <Tab label="Reviewers" />
                <Tab label="Databases" />
            </Tabs>

            {/* Reviewers Tab */}
            {tabValue === 0 && (
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6">Reviewer Management</Typography>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => {
                                setEditingReviewer(null);
                                setFormData({ firstName: '', lastName: '', email: '', institution: '', expertise: '', tenantId: 'tenant_1' });
                                setOpenDialog(true);
                            }}
                        >
                            Add Reviewer
                        </Button>
                    </Box>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Institution</TableCell>
                                    <TableCell>Expertise</TableCell>
                                    <TableCell>Rating</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reviewers.map((reviewer) => (
                                    <TableRow key={reviewer.id}>
                                        <TableCell>{reviewer.firstName} {reviewer.lastName}</TableCell>
                                        <TableCell>{reviewer.email}</TableCell>
                                        <TableCell>{reviewer.institution || 'N/A'}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {reviewer.expertise.split(',').slice(0, 2).map((exp, i) => (
                                                    <Chip key={i} label={exp.trim()} size="small" />
                                                ))}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{reviewer.rating.toFixed(1)}</TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" onClick={() => handleEditReviewer(reviewer)}>
                                                <Edit />
                                            </IconButton>
                                            <IconButton size="small" onClick={() => handleDeleteReviewer(reviewer.id)}>
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* Databases Tab */}
            {tabValue === 1 && (
                <Box>
                    <Typography variant="h6" sx={{ mb: 2 }}>Database Configurations</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Check Frequency</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {databases.map((db) => (
                                    <TableRow key={db.id}>
                                        <TableCell><strong>{db.name}</strong></TableCell>
                                        <TableCell>
                                            <Chip
                                                label={db.enabled ? 'Enabled' : 'Disabled'}
                                                color={db.enabled ? 'success' : 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{db.checkFrequency}</TableCell>
                                        <TableCell align="right">
                                            <Button size="small">Configure</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* Add/Edit Reviewer Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editingReviewer ? 'Edit Reviewer' : 'Add New Reviewer'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            label="First Name"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Last Name"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Institution"
                            value={formData.institution}
                            onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Expertise (comma-separated)"
                            value={formData.expertise}
                            onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                            fullWidth
                            multiline
                            rows={2}
                            placeholder="e.g., Machine Learning, AI, Neural Networks"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveReviewer}>
                        {editingReviewer ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminPanelPage;
