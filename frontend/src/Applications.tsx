import { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import GitHubIcon from '@mui/icons-material/GitHub';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useNavigate } from 'react-router-dom';
import { useApplications } from './ApplicationsContext';
import type { Application } from './ApplicationsContext';

const statusColors = {
  ok: 'success.main',
  error: 'error.main',
  warning: 'warning.main',
} as const;

export default function Applications() {
  const { apps } = useApplications();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const openAdd = () => navigate('/applications/new');
  const openEdit = (app: Application) => navigate(`/applications/${app.id}/edit`);
  const openScan = (app: Application) => navigate(`/applications/${app.id}/scan`);

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
            <TableCell>Language</TableCell>
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
            <TableCell>
              <GitHubIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
              {app.repository}
            </TableCell>
            <TableCell>{app.language}</TableCell>
            <TableCell align="right">
              <IconButton onClick={() => openScan(app)}>
                <PlayArrowIcon />
              </IconButton>
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
    </Box>
  );
}
