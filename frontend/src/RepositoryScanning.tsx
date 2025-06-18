import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  IconButton,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useApplications } from './ApplicationsContext';

const dummyLogs = [
  { id: 3, date: '2024-05-01 10:00', status: 'success' },
  { id: 2, date: '2024-04-25 12:30', status: 'error' },
  { id: 1, date: '2024-04-10 09:15', status: 'success' },
];

export default function RepositoryScanning() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { apps } = useApplications();
  const app = apps.find(a => a.id === Number(id));

  return (
    <Box sx={{ width: '100%' }}>
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton onClick={() => navigate('/applications')} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">Repository Scanning - {app?.name}</Typography>
      </Box>
      <Table sx={{ minWidth: '100%' }}>
        <TableHead>
          <TableRow>
            <TableCell>Run</TableCell>
            <TableCell>Timestamp</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dummyLogs.map(log => (
            <TableRow key={log.id}>
              <TableCell>{log.id}</TableCell>
              <TableCell>{log.date}</TableCell>
              <TableCell>
                {log.status === 'success' ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <ErrorIcon color="error" />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
