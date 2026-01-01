
import { Refresh } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Link as MuiLink,
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
import { getCollection } from '../../firebase/firestore';
import { useAuthStore } from '../../store/authStore';
import ReviewerRecommendationDialog from './ReviewerRecommendationDialog';

interface PaperData {
  id: string;
  title: string;
  doi: string;
  authors: string[];
  indexing: {
    scholar: { status: string; url?: string };
  };
}

const PapersListPage = () => {
  const [papers, setPapers] = useState<PaperData[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [recommendPaper, setRecommendPaper] = useState<{ id: string; title: string } | null>(null);
  const { user } = useAuthStore();

  const fetchPapers = async () => {
    try {
      const data = await getCollection<PaperData>('papers');
      setPapers(data);
    } catch (error) {
      console.error('Error fetching papers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchPapers();
  }, [user]);

  const handleVerify = async (id: string) => {
    setVerifyingId(id);
    try {
      const response = await fetch(`http://localhost:5050/api/papers/${id}/verify`, {
        method: 'POST'
      });
      const result = await response.json();
      if (result.success) {
        // Refresh local data
        await fetchPapers();
      }
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setVerifyingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'INDEXED': return 'success';
      case 'PENDING': return 'warning';
      case 'NOT_FOUND': return 'error';
      default: return 'default';
    }
  };

  if (loading) return <Typography>Loading papers...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">
          Research Papers Tracking
        </Typography>
        <IconButton onClick={() => fetchPapers()} disabled={loading}>
          <Refresh />
        </IconButton>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>DOI</TableCell>
              <TableCell>Authors</TableCell>
              <TableCell>Scholar Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {papers.map((paper) => (
              <TableRow key={paper.id}>
                <TableCell sx={{ fontWeight: 'medium' }}>{paper.title}</TableCell>
                <TableCell>{paper.doi}</TableCell>
                <TableCell>{paper.authors.join(', ')}</TableCell>
                <TableCell>
                  <Chip
                    label={paper.indexing?.scholar?.status || 'UNKNOWN'}
                    color={getStatusColor(paper.indexing?.scholar?.status) as any}
                    size="small"
                  />
                  {paper.indexing?.scholar?.url && (
                    <MuiLink
                      href={paper.indexing.scholar.url}
                      target="_blank"
                      sx={{ ml: 1, fontSize: '0.75rem' }}
                    >
                      View
                    </MuiLink>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleVerify(paper.id)}
                    disabled={verifyingId === paper.id}
                    startIcon={verifyingId === paper.id ? <CircularProgress size={16} /> : null}
                    sx={{ mr: 1 }}
                  >
                    {verifyingId === paper.id ? 'Verifying' : 'Verify'}
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setRecommendPaper({ id: paper.id, title: paper.title })}
                  >
                    Find Reviewer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {papers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">No papers found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <ReviewerRecommendationDialog
        open={!!recommendPaper}
        onClose={() => setRecommendPaper(null)}
        paperId={recommendPaper?.id || null}
        paperTitle={recommendPaper?.title || null}
      />
    </Box>
  );
};

export default PapersListPage;
