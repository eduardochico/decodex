import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './Layout';
import Login from './Login';
import { Placeholder } from './pages';
import Applications from './Applications';
import ApplicationForm from './ApplicationForm';
import { ApplicationsProvider } from './ApplicationsContext';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily: 'Sora, system-ui, Avenir, Helvetica, Arial, sans-serif',
    h1: { fontFamily: 'Inter, Sora, system-ui, Avenir, Helvetica, Arial, sans-serif' },
    h2: { fontFamily: 'Inter, Sora, system-ui, Avenir, Helvetica, Arial, sans-serif' },
    h3: { fontFamily: 'Inter, Sora, system-ui, Avenir, Helvetica, Arial, sans-serif' },
    h4: { fontFamily: 'Inter, Sora, system-ui, Avenir, Helvetica, Arial, sans-serif' },
    h5: { fontFamily: 'Inter, Sora, system-ui, Avenir, Helvetica, Arial, sans-serif' },
    h6: { fontFamily: 'Inter, Sora, system-ui, Avenir, Helvetica, Arial, sans-serif' },
    subtitle1: { fontFamily: 'Inter, Sora, system-ui, Avenir, Helvetica, Arial, sans-serif' },
    subtitle2: { fontFamily: 'Inter, Sora, system-ui, Avenir, Helvetica, Arial, sans-serif' },
    button: { fontFamily: 'Inter, Sora, system-ui, Avenir, Helvetica, Arial, sans-serif' },
  },
});

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  if (!loggedIn) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Login onLogin={() => setLoggedIn(true)} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ApplicationsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Placeholder title="Welcome" />} />
              <Route path="user-stories" element={<Placeholder title="User Stories" />} />
              <Route path="use-cases" element={<Placeholder title="Use Cases" />} />
              <Route path="functional-objectives" element={<Placeholder title="Functional objectives by module" />} />
              <Route path="roles-permissions" element={<Placeholder title="Roles and permissions identified" />} />
              <Route path="critical-flows" element={<Placeholder title="Critical flows" />} />
              <Route path="detailed-architecture" element={<Placeholder title="Detailed Architecture" />} />
              <Route path="external-dependencies" element={<Placeholder title="External Dependencies" />} />
              <Route path="modules-complexity" element={<Placeholder title="Modules and complexity" />} />
              <Route path="testing-coverage" element={<Placeholder title="Testing coverage" />} />
              <Route path="commits-history" element={<Placeholder title="Commits history and evolution" />} />
              <Route path="dangerous-patterns" element={<Placeholder title="Dangerous patterns" />} />
              <Route path="applications" element={<Applications />} />
              <Route path="applications/new" element={<ApplicationForm />} />
              <Route path="applications/:id/edit" element={<ApplicationForm />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ApplicationsProvider>
    </ThemeProvider>
  );
}

export default App;
