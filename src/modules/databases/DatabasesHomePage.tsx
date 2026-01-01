
import {
  Box,
  Card,
  CardContent,
  Grid,
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

interface Journal {
  id: string;
  name: string;
}

interface DatabaseConfig {
  id: string;
  name: string;
}

const DatabasesHomePage = () => {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [databases, setDatabases] = useState<DatabaseConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [journalsData, databasesData] = await Promise.all([
          getCollection<Journal>('journals'),
          getCollection<DatabaseConfig>('databases')
        ]);
        setJournals(journalsData);
        setDatabases(databasesData);
      } catch (error) {
        console.error('Error fetching databases data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Typography>Loading database overview...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Indexing Databases Overview
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {databases.map(db => (
          <Grid item xs={12} sm={4} key={db.id}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  {db.name}
                </Typography>
                <Typography variant="h5">
                  Available
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Auto-checking enabled
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Journal Indexing Status
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Journal</TableCell>
              {databases.map(db => (
                <TableCell key={db.id} align="center">{db.name}</TableCell>
              ))}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {journals.map(journal => (
              <TableRow key={journal.id} hover onClick={() => navigate(`/databases/${journal.id}`)} style={{ cursor: 'pointer' }}>
                <TableCell><strong>{journal.name}</strong></TableCell>
                {databases.map(db => (
                  <TableCell key={db.id} align="center">
                    <Typography variant="caption" color="textSecondary">
                      Click to manage
                    </Typography>
                  </TableCell>
                ))}
                <TableCell align="right">
                  <Typography variant="button" color="primary">Manage Applications</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DatabasesHomePage;
