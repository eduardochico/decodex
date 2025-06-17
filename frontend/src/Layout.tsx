import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { AppBar, Box, CssBaseline, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';

const drawerWidth = 240;

const sections = [
  {
    heading: 'Applications',
    items: [{ text: 'Applications', path: '/applications' }],
  },
  {
    heading: 'Business view',
    items: [
      { text: 'User Stories', path: '/user-stories' },
      { text: 'Use Cases', path: '/use-cases' },
      { text: 'Functional objectives by module', path: '/functional-objectives' },
      { text: 'Roles and permissions identified', path: '/roles-permissions' },
      { text: 'Critical flows', path: '/critical-flows' },
    ],
  },
  {
    heading: 'Tech view',
    items: [
      { text: 'Detailed Architecture', path: '/detailed-architecture' },
      { text: 'External Dependencies', path: '/external-dependencies' },
      { text: 'Modules and complexity', path: '/modules-complexity' },
      { text: 'Testing coverage', path: '/testing-coverage' },
      { text: 'Commits history and evolution', path: '/commits-history' },
      { text: 'Dangerous patterns', path: '/dangerous-patterns' },
    ],
  },
];

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const drawer = (
    <div>
      <Toolbar />
      {sections.map(section => (
        <Box key={section.heading} sx={{ px: 2 }}>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>{section.heading}</Typography>
          <List>
            {section.items.map(item => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton component={Link} to={item.path} onClick={() => setMobileOpen(false)}>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      ))}
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>Decodex</Typography>
          <IconButton color="inherit">
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth } }}>
          {drawer}
        </Drawer>
        <Drawer variant="permanent" sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' } }} open>
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: location.pathname === '/applications' ? 0 : 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
