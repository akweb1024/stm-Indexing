import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCollection } from '../../firebase/firestore';
import { useAuthStore } from '../../store/authStore';

interface Journal {
  id: string;
  name: string;
  issn: string;
  status: string;
  wordpressUrl: string;
  tenantId: string;
}

const JournalsListPage = () => {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJournals = async () => {
      if (!user) return;
      try {
        const data = await getCollection<Journal>('journals');
        setJournals(data);
      } catch (error) {
        console.error('Error fetching journals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJournals();
  }, [user]);

  if (loading) return <Typography>Loading journals...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Journals Portfolio
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Journal Name</TableCell>
              <TableCell>ISSN</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>WordPress URL</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {journals.map((journal) => (
              <TableRow
                key={journal.id}
                hover
                onClick={() => navigate(`/journals/${journal.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <TableCell><strong>{journal.name}</strong></TableCell>
                <TableCell>{journal.issn}</TableCell>
                <TableCell>
                  <Chip
                    label={journal.status}
                    color={journal.status === 'ACTIVE' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <a href={journal.wordpressUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                    {journal.wordpressUrl}
                  </a>
                </TableCell>
              </TableRow>
            ))}
            {journals.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">No journals found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default JournalsListPage;
