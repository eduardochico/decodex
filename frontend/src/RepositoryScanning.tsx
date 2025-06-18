import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  IconButton,
  Button,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useApplications } from './ApplicationsContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';


interface ScanLog {
  id: number;
  status: 'success' | 'error';
  createdAt: string;
}

export default function RepositoryScanning() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { apps } = useApplications();
  const app = apps.find(a => a.id === Number(id));
  const [logs, setLogs] = useState<ScanLog[]>([]);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_URL}/applications/${id}/scans`)
      .then(r => r.json())
      .then(setLogs)
      .catch(() => setLogs([]));
  }, [id]);

  const runScan = async () => {
    if (!id) return;
    const res = await fetch(`${API_URL}/applications/${id}/scans`, { method: 'POST' });
    const created = await res.json();
    setLogs(prev => [created, ...prev]);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton onClick={() => navigate('/applications')} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">Repository Scanning - {app?.name}</Typography>
        <Button variant="contained" onClick={runScan} sx={{ ml: 2 }}>
          Scan repository
        </Button>
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
          {logs.map(log => (
            <TableRow key={log.id}>
              <TableCell>{log.id}</TableCell>
              <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
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
