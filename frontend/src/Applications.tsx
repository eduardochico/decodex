import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
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

const dummyApps: Application[] = [
  { id: 1, name: 'Inventory', status: 'ok', repository: 'inventory', gitUrl: 'https://example.com/inventory.git' },
  { id: 2, name: 'Billing', status: 'error', repository: 'billing', gitUrl: 'https://example.com/billing.git' },
  { id: 3, name: 'Shipping', status: 'warning', repository: 'shipping', gitUrl: 'https://example.com/shipping.git' },
];

export default function Applications() {
  const [apps, setApps] = useState<Application[]>(dummyApps);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Application | null>(null);
  const [name, setName] = useState('');
  const [repository, setRepository] = useState('');
  const [gitUrl, setGitUrl] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const openAdd = () => {
    setEditing(null);
    setName('');
    setRepository('');
    setGitUrl('');
    setDialogOpen(true);
  };

  const openEdit = (app: Application) => {
    setEditing(app);
    setName(app.name);
    setRepository(app.repository);
    setGitUrl(app.gitUrl);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editing) {
      setApps(apps.map(a => (a.id === editing.id ? { ...editing, name, repository, gitUrl } : a)));
    } else {
      setApps([...apps, { id: Date.now(), name, status: 'ok', repository, gitUrl }]);
    }
    setDialogOpen(false);
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: '100%', height: '100%', p: 0, m: 0 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Applications</Typography>
        <Button startIcon={<AddIcon />} variant="contained" onClick={openAdd}>
          Add Application
        </Button>
      </Box>
      <Table sx={{ minWidth: '100%' }}>
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
