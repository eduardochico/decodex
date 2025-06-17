import { Button, TextField, Typography, Box } from '@mui/material';
import { useState } from 'react';

interface Props { onLogin: () => void }

export default function Login({ onLogin }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // placeholder auth
    if (username && password) onLogin();
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 300 }}>
        <Typography variant="h5" textAlign="center">Decodex Login</Typography>
        <TextField label="Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <Button type="submit" variant="contained">Login</Button>
      </Box>
    </Box>
  );
}
