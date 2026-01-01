
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDocument } from '../../firebase/firestore';

interface Application {
  id: string;
  status: string;
  appliedDate: string;
  notes?: string;
  databaseConfig: {
    name: string;
    id: string;
  };
}

interface Journal {
  id: string;
  name: string;
  issn: string;
}

const DatabaseDashboardPage = () => {
  const { id } = useParams();
  const [journal, setJournal] = useState<Journal | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [journalData, appsData] = await Promise.all([
          getDocument<Journal>('journals', id),
          fetch(`http://localhost:5050/api/journals/${id}/applications`).then(r => r.json())
        ]);
        setJournal(journalData);
        setApplications(appsData);
      } catch (error) {
        console.error('Error fetching application data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED': return 'success';
      case 'UNDER_REVIEW': return 'warning';
      case 'REJECTED': return 'error';
      case 'SUBMITTED': return 'info';
      default: return 'default';
    }
  };

  if (loading) return <Typography>Loading dashboard...</Typography>;
  if (!journal) return <Typography>Journal not found</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Indexing Status: {journal.name}
          </Typography>
          <Typography color="textSecondary">
            ISSN: {journal.issn} | Journal ID: {journal.id}
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => navigate(`/databases/${id}/apply`)}
        >
          New Application
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Database</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Applied Date</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell><strong>{app.databaseConfig.name}</strong></TableCell>
                    <TableCell>
                      <Chip
                        label={app.status}
                        color={getStatusColor(app.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{new Date(app.appliedDate).toLocaleDateString()}</TableCell>
                    <TableCell>{app.notes}</TableCell>
                    <TableCell align="right">
                      <Button size="small" onClick={() => navigate(`/databases/${id}/apply?db=${app.databaseConfig.id}`)}>Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
                {applications.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No active applications found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Indexing Roadmap
              </Typography>
              <Stepper orientation="vertical" activeStep={1}>
                <Step>
                  <StepLabel>WordPress Paper Sync</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Google Scholar Verification</StepLabel>
                </Step>
                <Step>
                  <StepLabel>DOAJ Application</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Scopus/PubMed Filing</StepLabel>
                </Step>
              </Stepper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DatabaseDashboardPage;
