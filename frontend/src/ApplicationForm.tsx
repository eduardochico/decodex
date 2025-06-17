import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useApplications } from './ApplicationsContext';

export default function ApplicationForm() {
  const { addApp, apps, updateApp } = useApplications();
  const navigate = useNavigate();
  const { id } = useParams();
  const editing = apps.find(a => a.id === Number(id));

  const [name, setName] = useState('');
  const [repository, setRepository] = useState('');
  const [gitUrl, setGitUrl] = useState('');

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setRepository(editing.repository);
      setGitUrl(editing.gitUrl);
    }
  }, [editing]);

  const handleSave = () => {
    if (editing) {
      updateApp({ ...editing, name, repository, gitUrl });
    } else {
      addApp({ name, repository, gitUrl });
    }
    navigate('/applications');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2, width: 400, mx: 'auto' }}>
      <Typography variant="h5">
        {editing ? 'Edit Application' : 'Add Application'}
      </Typography>
      <TextField label="Name" value={name} onChange={e => setName(e.target.value)} fullWidth />
      <TextField label="Repository" value={repository} onChange={e => setRepository(e.target.value)} fullWidth />
      <TextField label="Git URL" value={gitUrl} onChange={e => setGitUrl(e.target.value)} fullWidth />
      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button onClick={() => navigate('/applications')}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>Save</Button>
      </Box>
    </Box>
  );
}
