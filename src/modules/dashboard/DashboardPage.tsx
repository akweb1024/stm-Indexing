import {
  Box,
  Card,
  CardContent,
  Grid,
  Paper,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { getCollection } from '../../firebase/firestore';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const DashboardPage = () => {
  const [stats, setStats] = useState({ journals: 0, papers: 0, databases: 1 });
  const [chartData, setChartData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const journals = await getCollection<any>('journals');
      const papers = await getCollection<any>('papers');

      setStats({
        journals: journals.length,
        papers: papers.length,
        databases: 1
      });

      // Prepare chart data (Mocking some trends for now)
      setChartData([
        { name: 'Oct', journals: journals.length, papers: 1 },
        { name: 'Nov', journals: journals.length, papers: 1 },
        { name: 'Dec', journals: journals.length, papers: papers.length },
      ]);

      const indexed = papers.filter(p => p.indexingStatus === 'INDEXED').length;
      const missing = papers.length - indexed;
      setPieData([
        { name: 'Indexed', value: indexed },
        { name: 'Pending/Missing', value: missing },
      ]);
    };
    fetchStats();
  }, []);

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">STM Suite Intelligence Dashboard</Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: 'primary.dark', color: 'white', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6">Total Journals</Typography>
              <Typography variant="h3">{stats.journals}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: 'secondary.dark', color: 'white', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6">Total Papers</Typography>
              <Typography variant="h3">{stats.papers}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: 'success.dark', color: 'white', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6">Indexed Rate</Typography>
              <Typography variant="h3">
                {stats.papers > 0 ? Math.round((pieData[0]?.value / stats.papers) * 100) : 0}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Portfolio Growth</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="papers" fill="#8884d8" name="Papers Indexed" radius={[4, 4, 0, 0]} />
                <Bar dataKey="journals" fill="#82ca9d" name="Journals Added" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Indexing Status</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
