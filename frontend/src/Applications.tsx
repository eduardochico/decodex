import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

interface Application {
  id: number;
  name: string;
  status: 'ok' | 'error' | 'warning';
  repository: string;
  gitUrl: string;
}

const statusColors = {
  ok: 'success.main',
  error: 'error.main',
  warning: 'warning.main',
} as const;

export default function Applications() {
  const [apps, setApps] = useState<Application[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Application | null>(null);
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'ok' | 'error' | 'warning'>('ok');
  const [repository, setRepository] = useState('');
  const [gitUrl, setGitUrl] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const openAdd = () => {
    setEditing(null);
    setName('');
    setStatus('ok');
    setRepository('');
    setGitUrl('');
    setDialogOpen(true);
  };

  const openEdit = (app: Application) => {
    setEditing(app);
    setName(app.name);
    setStatus(app.status);
    setRepository(app.repository);
    setGitUrl(app.gitUrl);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editing) {
      setApps(apps.map(a => (a.id === editing.id ? { ...editing, name, status, repository, gitUrl } : a)));
    } else {
      setApps([...apps, { id: Date.now(), name, status, repository, gitUrl }]);
    }
    setDialogOpen(false);
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Applications</Typography>
        <Button startIcon={<AddIcon />} variant="contained" onClick={openAdd}>
          Add Application
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Repository</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {apps.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(app => (
            <TableRow key={app.id}>
              <TableCell>{app.name}</TableCell>
              <TableCell>
                <FiberManualRecordIcon sx={{ color: statusColors[app.status] }} />
              </TableCell>
              <TableCell>{app.repository}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => openEdit(app)}>
                  <EditIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={apps.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{editing ? 'Edit Application' : 'Add Application'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Name" value={name} onChange={e => setName(e.target.value)} fullWidth />
          <TextField
            select
            label="Status"
            value={status}
            onChange={e => setStatus(e.target.value as 'ok' | 'error' | 'warning')}
            fullWidth
          >
            <MenuItem value="ok">OK</MenuItem>
            <MenuItem value="error">Error</MenuItem>
            <MenuItem value="warning">Warning</MenuItem>
          </TextField>
          <TextField label="Repository" value={repository} onChange={e => setRepository(e.target.value)} fullWidth />
          <TextField label="Git URL" value={gitUrl} onChange={e => setGitUrl(e.target.value)} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
