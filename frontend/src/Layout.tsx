import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Collapse,
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircle from '@mui/icons-material/AccountCircle';

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
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [userAnchorEl, setUserAnchorEl] = useState<null | HTMLElement>(null);
  const [openSections, setOpenSections] = useState({
    'Business view': false,
    'Tech view': false,
  });
  const location = useLocation();
  const openUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setUserAnchorEl(event.currentTarget);
  };
  const closeUserMenu = () => setUserAnchorEl(null);
  const toggleSection = (heading: string) =>
    setOpenSections(prev => ({ ...prev, [heading]: !prev[heading as keyof typeof prev] }));

  const toggleDrawer = () => setDrawerOpen(prev => !prev);

  const drawer = (
    <div>
      <Toolbar />
      {sections.map(section => (
        <Box key={section.heading} sx={{ px: 2 }}>
          {section.heading === 'Applications' ? (
            <ListItemButton
              onClick={toggleDrawer}
              component={Link}
              to={section.items[0].path}
              sx={{ mt: 2 }}
            >
              <ListItemText
                primary={section.items[0].text}
                primaryTypographyProps={{ fontSize: '0.8rem', fontFamily: 'Inter' }}
              />
            </ListItemButton>
          ) : ['Business view', 'Tech view'].includes(section.heading) ? (
            <>
              <ListItemButton onClick={() => toggleSection(section.heading)} sx={{ mt: 2 }}>
                <ListItemText
                  primary={section.heading}
                  primaryTypographyProps={{ fontSize: '0.8rem', fontFamily: 'Inter' }}
                />
                {openSections[section.heading as keyof typeof openSections] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openSections[section.heading as keyof typeof openSections]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {section.items.map(item => (
                    <ListItem key={item.text} disablePadding>
                      <ListItemButton
                        component={Link}
                        to={item.path}
                        onClick={toggleDrawer}
                        sx={{ pl: 4 }}
                      >
                        <ListItemText
                          primary={item.text}
                          primaryTypographyProps={{ fontSize: '0.8rem', fontFamily: 'Inter' }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </>
          ) : (
            <>
              <Typography variant="subtitle1" sx={{ mt: 2, fontSize: '0.8rem' }}>
                {section.heading}
              </Typography>
              <List>
                {section.items.map(item => (
                  <ListItem key={item.text} disablePadding>
                    <ListItemButton component={Link} to={item.path} onClick={toggleDrawer}>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{ fontSize: '0.8rem', fontFamily: 'Inter' }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </Box>
      ))}
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: theme => theme.zIndex.drawer + 1, ml: { sm: drawerOpen ? `${drawerWidth}px` : 0 } }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={toggleDrawer} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>Decodex</Typography>
          <IconButton color="inherit">
            <SettingsIcon />
          </IconButton>
          <IconButton color="inherit" onClick={openUserMenu} sx={{ ml: 1 }}>
            <AccountCircle />
          </IconButton>
          <Menu anchorEl={userAnchorEl} open={Boolean(userAnchorEl)} onClose={closeUserMenu}>
            <MenuItem onClick={closeUserMenu}>User Profile</MenuItem>
            <MenuItem onClick={closeUserMenu}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { sm: drawerOpen ? drawerWidth : 0 }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={toggleDrawer}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth } }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="persistent"
          open={drawerOpen}
          sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' } }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: location.pathname === '/applications' ? 0 : 3, ml: { sm: drawerOpen ? `${drawerWidth}px` : 0 } }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
