import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Divider,
  Grid,
  Link,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../../components/Loading';
import { getDocument } from '../../firebase/firestore';

interface JournalDetail {
  id: string;
  name: string;
  code: string;
  issn: string;
  status: string;
  wordpressUrl: string;
  papers: any[];
}

const JournalDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [journal, setJournal] = useState<JournalDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [syncing, setSyncing] = useState(false);

  const fetchJournal = async () => {
    if (!id) return;
    try {
      const data = await getDocument<JournalDetail>('journals', id);
      setJournal(data);
    } catch (error) {
      console.error('Error fetching journal:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournal();
  }, [id]);

  const handleSync = async () => {
    if (!id) return;
    setSyncing(true);
    try {
      const response = await fetch(`http://localhost:5050/api/journals/${id}/sync`, {
        method: 'POST'
      });
      const data = await response.json();
      if (data.success) {
        alert(data.message);
        await fetchJournal();
      } else {
        alert('Sync failed: ' + data.error);
      }
    } catch (e) {
      alert('Error during sync: ' + (e as Error).message);
    } finally {
      setSyncing(false);
    }
  };

  if (loading) return <Loading />;
  if (!journal) return <Typography>Journal not found.</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate('/journals')}
          sx={{ cursor: 'pointer', textDecoration: 'none' }}
        >
          Journals
        </Link>
        <Typography color="textPrimary">{journal.name}</Typography>
      </Breadcrumbs>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">{journal.name}</Typography>
              <Chip label={journal.status} color={journal.status === 'ACTIVE' ? 'success' : 'default'} />
            </Box>
            <Typography variant="body1" gutterBottom><strong>ISSN:</strong> {journal.issn}</Typography>
            <Typography variant="body1" gutterBottom><strong>Code:</strong> {journal.code}</Typography>
            <Typography variant="body1" gutterBottom>
              <strong>WordPress URL:</strong> <a href={journal.wordpressUrl} target="_blank" rel="noreferrer">{journal.wordpressUrl}</a>
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>Recent Papers</Typography>
            <List>
              {journal.papers?.map((paper: any) => (
                <ListItem
                  key={paper.id}
                  button
                  onClick={() => navigate(`/papers/${paper.id}`)}
                  sx={{ borderBottom: '1px solid #eee' }}
                >
                  <ListItemText
                    primary={paper.title}
                    secondary={`DOI: ${paper.doi} | Status: ${paper.indexingStatus}`}
                  />
                </ListItem>
              ))}
              {(!journal.papers || journal.papers.length === 0) && (
                <Typography variant="body2" color="textSecondary">No papers synced yet.</Typography>
              )}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Actions</Typography>
            <Button
              variant="contained"
              fullWidth
              sx={{ mb: 2 }}
              onClick={handleSync}
              disabled={syncing}
            >
              {syncing ? 'Syncing...' : 'Sync from WordPress'}
            </Button>
            <Button
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              onClick={() => navigate(`/journals/${id}/analytics`)}
            >
              View Analytics
            </Button>
            <Button variant="outlined" fullWidth sx={{ mb: 2 }}>Edit Journal Settings</Button>
            <Button variant="outlined" color="error" fullWidth>Deactivate Journal</Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default JournalDetailPage;
