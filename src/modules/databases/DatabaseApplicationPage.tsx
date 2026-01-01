
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getCollection } from '../../firebase/firestore';

interface DatabaseConfig {
  id: string;
  name: string;
}

const DatabaseApplicationPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const dbId = searchParams.get('db');

  const [databases, setDatabases] = useState<DatabaseConfig[]>([]);
  const [selectedDb, setSelectedDb] = useState(dbId || '');
  const [status, setStatus] = useState('PENDING');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDbs = async () => {
      try {
        const data = await getCollection<DatabaseConfig>('databases');
        setDatabases(data);
      } catch (e) {
        console.error('Failed to fetch databases');
      }
    };
    fetchDbs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!selectedDb) {
      setError('Please select a database');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5050/api/journals/${id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          databaseConfigId: selectedDb,
          status,
          notes
        })
      });

      if (!response.ok) throw new Error('Failed to submit application');

      setSuccess(true);
      setTimeout(() => navigate(`/databases/${id}`), 1500);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Indexing Application
      </Typography>
      <Typography color="textSecondary" sx={{ mb: 3 }}>
        Manage the application status for this journal in various scholarly databases.
      </Typography>

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>Application updated successfully! Redirecting...</Alert>}

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Database</InputLabel>
              <Select
                value={selectedDb}
                label="Database"
                onChange={(e) => setSelectedDb(e.target.value)}
              >
                {databases.map((db) => (
                  <MenuItem key={db.id} value={db.id}>{db.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="SUBMITTED">Submitted</MenuItem>
                <MenuItem value="UNDER_REVIEW">Under Review</MenuItem>
                <MenuItem value="ACCEPTED">Accepted</MenuItem>
                <MenuItem value="REJECTED">Rejected</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Notes / Metadata"
              multiline
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              sx={{ mb: 3 }}
              placeholder="Case numbers, submission links, or reasons for rejection..."
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit" variant="contained">Save Application</Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DatabaseApplicationPage;
