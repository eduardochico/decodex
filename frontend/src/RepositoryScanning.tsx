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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useApplications } from './ApplicationsContext';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';


interface ScanLog {
  id: number;
  status: 'scanning' | 'completed' | 'error';
  createdAt: string;
  output?: string;
  stage?: string;
  progress: number;
}

interface FileResult {
  id: number;
  filename: string;
  source: string;
  parse: string;
  analysis?: string;
}

export default function RepositoryScanning() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { apps } = useApplications();
  const app = apps.find(a => a.id === Number(id));
  const [logs, setLogs] = useState<ScanLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<ScanLog | null>(null);
  const [files, setFiles] = useState<FileResult[]>([]);
  const [selectedFile, setSelectedFile] = useState<number | ''>('');

  useEffect(() => {
    if (!selectedLog || !id || selectedLog.status !== 'completed') {
      setFiles([]);
      setSelectedFile('');
      return;
    }
    fetch(`${API_URL}/applications/${id}/scans/${selectedLog.id}/files`)
      .then(r => r.json())
      .then(data => {
        setFiles(data);
        setSelectedFile(data[0]?.id ?? '');
      })
      .catch(() => {
        setFiles([]);
        setSelectedFile('');
      });
  }, [selectedLog, id]);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_URL}/applications/${id}/scans`)
      .then(r => r.json())
      .then(setLogs)
      .catch(() => setLogs([]));
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!id) return;
      fetch(`${API_URL}/applications/${id}/scans`)
        .then(r => r.json())
        .then(setLogs)
        .catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const runScan = async () => {
    if (!id) return;
    const ok = window.confirm('Run repository scan? This may take several minutes.');
    if (!ok) return;
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
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map(log => (
            <TableRow key={log.id}>
              <TableCell>{log.id}</TableCell>
              <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
              <TableCell>
                {log.status === 'completed' ? (
                  <CheckCircleIcon color="success" />
                ) : log.status === 'error' ? (
                  <ErrorIcon color="error" />
                ) : (
                  <Typography variant="body2">
                    {log.stage ?? 'Running'} - {log.progress}%
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                {(log.status === 'completed' || log.status === 'error') && (
                  <Button size="small" onClick={() => setSelectedLog(log)}>
                    View output
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={Boolean(selectedLog)} onClose={() => setSelectedLog(null)} fullWidth maxWidth="lg">
        <DialogTitle>Scan Output</DialogTitle>
        <DialogContent dividers>
          {selectedLog?.status === 'error' ? (
            <SyntaxHighlighter
              language="text"
              style={atomDark}
              customStyle={{ margin: 0 }}
              wrapLongLines
            >
              {selectedLog?.output || ''}
            </SyntaxHighlighter>
          ) : (
            <>
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel id="file-select-label">File</InputLabel>
                <Select
                  labelId="file-select-label"
                  label="File"
                  value={selectedFile}
                  onChange={e => setSelectedFile(e.target.value as number)}
                >
                  {files.map(f => (
                    <MenuItem key={f.id} value={f.id}>
                      {f.filename}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box display="flex" gap={2}>
                <Box flex={1}>
                  <Typography variant="subtitle2" gutterBottom>
                    Source
                  </Typography>
                  <SyntaxHighlighter
                    language={app?.language || 'text'}
                    style={atomDark}
                    customStyle={{ margin: 0 }}
                    wrapLongLines
                  >
                    {files.find(f => f.id === selectedFile)?.source || ''}
                  </SyntaxHighlighter>
                </Box>
                <Box flex={1}>
                  <Typography variant="subtitle2" gutterBottom>
                    LLM Output
                  </Typography>
                  <SyntaxHighlighter
                    language="text"
                    style={atomDark}
                    customStyle={{ margin: 0 }}
                    wrapLongLines
                  >
                    {files.find(f => f.id === selectedFile)?.analysis || ''}
                  </SyntaxHighlighter>
                </Box>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedLog(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
